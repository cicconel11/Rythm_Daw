#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
RythmPluginAudioProcessor::RythmPluginAudioProcessor()
    : AudioProcessor(BusesProperties()
        .withInput("Input", juce::AudioChannelSet::stereo(), true)
        .withOutput("Output", juce::AudioChannelSet::stereo(), true)),
      parameters(*this, nullptr, "Parameters", createParameterLayout())
{
    // Initialize smoothed values
    inputGainSmoothed.setCurrentAndTargetValue(1.0f);
    outputGainSmoothed.setCurrentAndTargetValue(1.0f);
    dryWetSmoothed.setCurrentAndTargetValue(0.5f);
    
    // Initialize bridge client
    bridgeClient = std::make_unique<BridgeClient>();
    bridgeClient->connect();
}

RythmPluginAudioProcessor::~RythmPluginAudioProcessor()
{
    if (bridgeClient)
    {
        bridgeClient->disconnect();
    }
}

//==============================================================================
const juce::String RythmPluginAudioProcessor::getName() const
{
    return JucePlugin_Name;
}

bool RythmPluginAudioProcessor::acceptsMidi() const
{
    return false;
}

bool RythmPluginAudioProcessor::producesMidi() const
{
    return false;
}

bool RythmPluginAudioProcessor::isMidiEffect() const
{
    return false;
}

double RythmPluginAudioProcessor::getTailLengthSeconds() const
{
    return 0.0;
}

int RythmPluginAudioProcessor::getNumPrograms()
{
    return 1;
}

int RythmPluginAudioProcessor::getCurrentProgram()
{
    return 0;
}

void RythmPluginAudioProcessor::setCurrentProgram(int index)
{
    juce::ignoreUnused(index);
}

const juce::String RythmPluginAudioProcessor::getProgramName(int index)
{
    juce::ignoreUnused(index);
    return {};
}

void RythmPluginAudioProcessor::changeProgramName(int index, const juce::String& newName)
{
    juce::ignoreUnused(index, newName);
}

//==============================================================================
void RythmPluginAudioProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    // Set smoothing time constants (50ms)
    const float smoothingTime = 0.05f;
    inputGainSmoothed.reset(sampleRate, smoothingTime);
    outputGainSmoothed.reset(sampleRate, smoothingTime);
    dryWetSmoothed.reset(sampleRate, smoothingTime);
    
    // Set initial values from parameters
    inputGainSmoothed.setCurrentAndTargetValue(*parameters.getRawParameterValue(inputGainId));
    outputGainSmoothed.setCurrentAndTargetValue(*parameters.getRawParameterValue(outputGainId));
    dryWetSmoothed.setCurrentAndTargetValue(*parameters.getRawParameterValue(dryWetId));
}

void RythmPluginAudioProcessor::releaseResources()
{
}

bool RythmPluginAudioProcessor::isBusesLayoutSupported(const BusesLayout& layouts) const
{
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
        && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;

    return true;
}

void RythmPluginAudioProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ignoreUnused(midiMessages);

    juce::ScopedNoDenormals noDenormals;
    auto totalNumInputChannels = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear(i, 0, buffer.getNumSamples());

    // Update smoothed values from parameters
    inputGainSmoothed.setTargetValue(*parameters.getRawParameterValue(inputGainId));
    outputGainSmoothed.setTargetValue(*parameters.getRawParameterValue(outputGainId));
    dryWetSmoothed.setTargetValue(*parameters.getRawParameterValue(dryWetId));

    // Process audio with parameters
    for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
    {
        float* channelData = buffer.getWritePointer(channel);
        
        for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
        {
            // Get current smoothed values
            const float inputGainDb = inputGainSmoothed.getNextValue();
            const float outputGainDb = outputGainSmoothed.getNextValue();
            const float dryWet = dryWetSmoothed.getNextValue();
            
            // Convert dB to linear gain
            const float inputGain = juce::Decibels::decibelsToGain(inputGainDb);
            const float outputGain = juce::Decibels::decibelsToGain(outputGainDb);
            
            // Apply input gain
            float inputSample = channelData[sample] * inputGain;
            
            // Apply dry/wet mix (simple pass-through for now, can be extended with effects)
            float processedSample = inputSample; // Placeholder for future effects
            float outputSample = (inputSample * (1.0f - dryWet)) + (processedSample * dryWet);
            
            // Apply output gain with hard clip protection
            outputSample *= outputGain;
            outputSample = juce::jlimit(-1.0f, 1.0f, outputSample);
            
            channelData[sample] = outputSample;
        }
    }
}

//==============================================================================
bool RythmPluginAudioProcessor::hasEditor() const
{
    return true;
}

juce::AudioProcessorEditor* RythmPluginAudioProcessor::createEditor()
{
    return new RythmPluginAudioProcessorEditor(*this);
}

//==============================================================================
void RythmPluginAudioProcessor::getStateInformation(juce::MemoryBlock& destData)
{
    auto state = parameters.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void RythmPluginAudioProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));
    
    if (xmlState.get() != nullptr)
        if (xmlState->hasTagName(parameters.state.getType()))
            parameters.replaceState(juce::ValueTree::fromXml(*xmlState));
}

//==============================================================================
juce::AudioProcessorValueTreeState::ParameterLayout RythmPluginAudioProcessor::createParameterLayout()
{
    std::vector<std::unique_ptr<juce::RangedAudioParameter>> params;
    
    // Input Gain: -24dB to +24dB
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        inputGainId,
        "Input Gain",
        juce::NormalisableRange<float>(-24.0f, 24.0f, 0.1f),
        0.0f,
        juce::String(),
        juce::AudioProcessorParameter::genericParameter,
        [](float value, int) { return juce::String(value, 1) + " dB"; },
        [](const juce::String& text) { return text.dropLastCharacters(3).getFloatValue(); }
    ));
    
    // Output Gain: -24dB to +24dB
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        outputGainId,
        "Output Gain",
        juce::NormalisableRange<float>(-24.0f, 24.0f, 0.1f),
        0.0f,
        juce::String(),
        juce::AudioProcessorParameter::genericParameter,
        [](float value, int) { return juce::String(value, 1) + " dB"; },
        [](const juce::String& text) { return text.dropLastCharacters(3).getFloatValue(); }
    ));
    
    // Dry/Wet: 0% to 100%
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        dryWetId,
        "Dry/Wet",
        juce::NormalisableRange<float>(0.0f, 1.0f, 0.01f),
        0.5f,
        juce::String(),
        juce::AudioProcessorParameter::genericParameter,
        [](float value, int) { return juce::String(static_cast<int>(value * 100.0f)) + "%"; },
        [](const juce::String& text) { return text.dropLastCharacters(1).getFloatValue() / 100.0f; }
    ));
    
    return { params.begin(), params.end() };
}

//==============================================================================
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new RythmPluginAudioProcessor();
}
