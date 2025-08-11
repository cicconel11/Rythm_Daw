#pragma once

#include <juce_core/juce_core.h>

namespace JsonUtils
{
    juce::String createPluginLoadedMessage();
    juce::String createParameterChangedMessage(const juce::String& parameterId, float value);
    juce::String createPluginUnloadedMessage();
    
    bool parseMessage(const juce::String& message, juce::String& command, juce::var& data);
}
