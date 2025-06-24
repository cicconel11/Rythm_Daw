#include "SnapshotManager.h"
#include <juce_core/juce_core.h>
#include <juce_events/juce_events.h>
#include <juce_cryptography/hashing/juce_SHA256.h>
#include <juce_data_structures/juce_data_structures.h>

// Helper function to create a multipart form data boundary
static const juce::String createBoundary()
{
    return "----WebKitFormBoundary" + juce::String::toHexString(juce::Random::getSystemRandom().nextInt64());
}

// Helper function to create a multipart form data part
static void writeFormDataPart(juce::MemoryOutputStream& out, const juce::String& boundary,
                             const juce::String& name, const juce::String& value,
                             const juce::String& contentType = {})
{
    out << "--" << boundary << "\r\n"
        << "Content-Disposition: form-data; name=\"" << name << "\"";
    
    if (contentType.isNotEmpty())
        out << "\r\nContent-Type: " << contentType;
    
    out << "\r\n\r\n" << value << "\r\n";
}

// Helper function to create a file part in multipart form data
static void writeFilePart(juce::MemoryOutputStream& out, const juce::String& boundary,
                         const juce::String& name, const juce::String& filename,
                         const void* data, size_t size, const juce::String& contentType)
{
    out << "--" << boundary << "\r\n"
        << "Content-Disposition: form-data; name=\"" << name << "\"; filename=\"" << filename << "\"\r\n"
        << "Content-Type: " << (contentType.isNotEmpty() ? contentType : "application/octet-stream") << "\r\n"
        << "Content-Transfer-Encoding: binary\r\n\r\n";
    
    out.write(data, static_cast<size_t>(size));
    out << "\r\n";
}

//==============================================================================
SnapshotManager::SnapshotManager()
{
    startTimer(1000); // Check for auto-save every second
    lastActivityTime = juce::Time::getCurrentTime();
}

SnapshotManager::~SnapshotManager()
{
    stopTimer();
    cancelPendingUpdate();
}

void SnapshotManager::setProjectId(const juce::String& newProjectId)
{
    if (projectId != newProjectId)
    {
        projectId = newProjectId;
        if (projectId.isNotEmpty() && authToken.isNotEmpty())
            fetchSnapshots();
    }
}

void SnapshotManager::setAuthToken(const juce::String& token)
{
    if (authToken != token)
    {
        authToken = token;
        if (projectId.isNotEmpty() && authToken.isNotEmpty())
            fetchSnapshots();
    }
}

void SnapshotManager::setApiBaseUrl(const juce::String& url)
{
    apiBaseUrl = url;
}

void SnapshotManager::takeSnapshot(const juce::String& name, const juce::String& description)
{
    if (isUploading || !stateSerializer)
        return;
    
    // Serialize the current state
    auto state = stateSerializer();
    if (!state.isObject())
    {
        listeners.call([&](Listener& l) { l.snapshotError("Failed to serialize project state"); });
        return;
    }
    
    // Convert state to JSON
    auto json = juce::JSON::toString(state, true);
    auto jsonData = json.toRawUTF8();
    
    // Create a ZIP archive in memory
    juce::ZipFile::Builder zipBuilder;
    zipBuilder.addEntry(new juce::MemoryInputStream(
        jsonData.getAddress(), jsonData.sizeInBytes(), false),
        0, "project.json");
    
    juce::MemoryBlock zipData;
    juce::MemoryOutputStream zipStream(zipData, false);
    zipBuilder.writeToStream(zipStream, nullptr);
    
    // Start upload in background
    isUploading = true;
    uploadProgress = 0.0f;
    
    juce::MessageManager::callAsync([this, name, description, zipData]() {
        sendSnapshotToServer(name, description, zipData);
    });
}

void SnapshotManager::loadSnapshot(const juce::String& snapshotId)
{
    if (!stateDeserializer)
        return;
    
    for (const auto& snapshot : snapshots)
    {
        if (snapshot.id == snapshotId)
        {
            // In a real implementation, download and extract the snapshot
            // For now, we'll just deserialize the state
            juce::URL downloadUrl(snapshot.downloadUrl);
            
            downloadUrl.downloadToFile(juce::File::getSpecialLocation(juce::File::tempDirectory)
                                      .getChildFile("snapshot_" + juce::String(snapshot.id.hashCode()) + ".zip"),
                                     [this](juce::URL::DownloadTask*, bool success) {
                                         if (success)
                                         {
                                             // Extract and load the state
                                             // This is a simplified version
                                             // In a real implementation, you would:
                                             // 1. Extract the ZIP
                                             // 2. Read project.json
                                             // 3. Call stateDeserializer with the state
                                         }
                                     });
            break;
        }
    }
}

juce::Array<SnapshotManager::Snapshot> SnapshotManager::getSnapshots() const
{
    juce::Array<Snapshot> result;
    
    for (const auto& snapshot : snapshots)
        result.add(snapshot);
    
    return result;
}

void SnapshotManager::setAutoSaveEnabled(bool enabled)
{
    if (autoSaveEnabled != enabled)
    {
        autoSaveEnabled = enabled;
        if (autoSaveEnabled)
            lastActivityTime = juce::Time::getCurrentTime();
    }
}

void SnapshotManager::resetInactivityTimer()
{
    lastActivityTime = juce::Time::getCurrentTime();
}

void SnapshotManager::addListener(Listener* listener)
{
    juce::ScopedLock lock(listenerLock);
    listeners.add(listener);
}

void SnapshotManager::removeListener(Listener* listener)
{
    juce::ScopedLock lock(listenerLock);
    listeners.remove(listener);
}

void SnapshotManager::timerCallback()
{
    if (!autoSaveEnabled || !stateSerializer || isUploading)
        return;
    
    auto now = juce::Time::getCurrentTime();
    auto msSinceLastActivity = now.toMilliseconds() - lastActivityTime.toMilliseconds();
    
    if (msSinceLastActivity >= autoSaveIntervalMs)
    {
        // Auto-save with a generated name
        takeSnapshot("Auto-save at " + now.toString(true, true, true, true));
        lastActivityTime = now;
    }
}

void SnapshotManager::handleAsyncUpdate()
{
    // Handle any pending updates on the message thread
    // This could be used for progress updates or completion callbacks
}

void SnapshotManager::changeListenerCallback(juce::ChangeBroadcaster* source)
{
    // Handle change notifications from other components
}

void SnapshotManager::sendSnapshotToServer(const juce::String& name, const juce::String& description, const juce::MemoryBlock& projectData)
{
    if (projectId.isEmpty() || authToken.isEmpty())
    {
        isUploading = false;
        listeners.call([&](Listener& l) { l.snapshotError("Project ID or auth token not set"); });
        return;
    }
    
    const auto boundary = createBoundary();
    juce::MemoryOutputStream formData;
    
    // Add form fields
    writeFormDataPart(formData, boundary, "projectId", projectId);
    writeFormDataPart(formData, boundary, "name", name);
    writeFormDataPart(formData, boundary, "description", description);
    writeFormDataPart(formData, boundary, "metadata", "{}", "application/json");
    
    // Add file
    writeFilePart(formData, boundary, "file", "snapshot.zip",
                 projectData.getData(), projectData.getSize(),
                 "application/zip");
    
    // Close the request
    formData << "--" << boundary << "--\r\n";
    
    // Create and configure the URL
    juce::URL url(apiBaseUrl + "/api/snapshots");
    
    // Create headers
    juce::StringPairArray headers;
    headers.set("Authorization", "Bearer " + authToken);
    headers.set("Content-Type", "multipart/form-data; boundary=" + boundary);
    
    // Create input stream from form data
    auto inputStream = std::make_unique<juce::MemoryInputStream>(formData.getData(), formData.getDataSize(), false);
    
    // Create a progress callback
    auto progressCallback = [this](int bytesSent, int totalBytes) {
        if (totalBytes > 0)
        {
            uploadProgress = static_cast<float>(bytesSent) / totalBytes;
            listeners.call([this](Listener& l) { l.snapshotProgress(uploadProgress); });
        }
        return !isUploading; // Return false to cancel
    };
    
    // Start the upload
    url.withPOSTData(formData.toString())
       .withExtraHeaders(headers)
       .readEntireBinaryStream([this](const void* data, size_t size) {
           // Handle response
           auto response = juce::String::createStringFromData(data, static_cast<int>(size));
           
           try {
               auto result = juce::JSON::parse(response);
               if (auto* obj = result.getDynamicObject())
               {
                   Snapshot snapshot;
                   snapshot.id = obj->getProperty("id").toString();
                   snapshot.name = obj->getProperty("name").toString();
                   snapshot.description = obj->getProperty("description").toString();
                   snapshot.createdAt = juce::Time::fromISO8601(obj->getProperty("createdAt").toString());
                   snapshot.projectId = obj->getProperty("projectId").toString();
                   
                   // Get the first file URL if available
                   if (auto* files = obj->getProperty("files").getArray())
                       if (files->size() > 0)
                           if (auto* file = files->getUnchecked(0).getDynamicObject())
                               snapshot.downloadUrl = file->getProperty("downloadUrl").toString();
                   
                   // Add to our list
                   snapshots.insert(0, snapshot);
                   
                   // Notify listeners
                   listeners.call([&](Listener& l) { l.snapshotCreated(snapshot); });
               }
               else
               {
                   listeners.call([&](Listener& l) { l.snapshotError("Invalid response from server"); });
               }
           }
           catch (const std::exception& e)
           {
               listeners.call([&](Listener& l) { l.snapshotError(e.what()); });
           }
           
           isUploading = false;
           return 0;
       }, progressCallback, "POST");
}

void SnapshotManager::fetchSnapshots()
{
    if (projectId.isEmpty() || authToken.isEmpty())
        return;
    
    juce::URL url(apiBaseUrl + "/api/snapshots/" + projectId);
    
    juce::StringPairArray headers;
    headers.set("Authorization", "Bearer " + authToken);
    headers.set("Content-Type", "application/json");
    
    url.withGET()
       .withExtraHeaders(headers)
       .readEntireTextStream([this](const juce::String& response) {
           try {
               auto result = juce::JSON::parse(response);
               if (auto* arr = result.getArray())
               {
                   juce::Array<Snapshot> newSnapshots;
                   
                   for (const auto& item : *arr)
                   {
                       if (auto* obj = item.getDynamicObject())
                       {
                           Snapshot snapshot;
                           snapshot.id = obj->getProperty("id").toString();
                           snapshot.name = obj->getProperty("name").toString();
                           snapshot.description = obj->getProperty("description").toString();
                           snapshot.createdAt = juce::Time::fromISO8601(obj->getProperty("createdAt").toString());
                           snapshot.projectId = obj->getProperty("projectId").toString();
                           
                           // Get the first file URL if available
                           if (auto* files = obj->getProperty("files").getArray())
                               if (files->size() > 0)
                                   if (auto* file = files->getUnchecked(0).getDynamicObject())
                                       snapshot.downloadUrl = file->getProperty("downloadUrl").toString();
                           
                           newSnapshots.add(snapshot);
                       }
                   }
                   
                   // Update snapshots list
                   {
                       const juce::ScopedLock lock(stateMutex);
                       snapshots = newSnapshots;
                   }
                   
                   // Notify listeners that snapshots were updated
                   listeners.call([](Listener& l) { l.snapshotProgress(-1.0f); });
               }
           }
           catch (const std::exception& e)
           {
               listeners.call([&](Listener& l) { l.snapshotError(e.what()); });
           }
       });
}
