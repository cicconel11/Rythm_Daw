#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
RythmPluginAudioProcessor::RythmPluginAudioProcessor()
    : AudioProcessor(BusesProperties()
        .withInput("Input", juce::AudioChannelSet::stereo(), true)
        .withOutput("Output", juce::AudioChannelSet::stereo(), true)),
      parameters(*this, nullptr, juce::Identifier("RythmPlugin"), createParameterLayout())
{
    // Set up parameter listeners
    parameters.addParameterListener(inputGainId, this);
    parameters.addParameterListener(outputGainId, this);
    parameters.addParameterListener(dryWetId, this);
}

RythmPluginAudioProcessor::~RythmPluginAudioProcessor()
{
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
    juce::ignoreUnused(sampleRate, samplesPerBlock);
    
    // Reset smoothed values
    inputGainSmoothed.reset(sampleRate, 0.1);
    outputGainSmoothed.reset(sampleRate, 0.1);
    dryWetSmoothed.reset(sampleRate, 0.1);
    
    // Set initial values
    inputGainSmoothed.setCurrentAndTargetValue(inputGainValue.load());
    outputGainSmoothed.setCurrentAndTargetValue(outputGainValue.load());
    dryWetSmoothed.setCurrentAndTargetValue(dryWetValue.load() / 100.0f);
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

    const int numSamples = buffer.getNumSamples();
    const int numChannels = buffer.getNumChannels();
    
    // Process each sample
    for (int sample = 0; sample < numSamples; ++sample)
    {
        // Update smoothed values
        const float inputGain = inputGainSmoothed.getNextValue();
        const float outputGain = outputGainSmoothed.getNextValue();
        const float dryWet = dryWetSmoothed.getNextValue();
        
        // Convert dB to linear
        const float inputGainLinear = juce::Decibels::decibelsToGain(inputGain);
        const float outputGainLinear = juce::Decibels::decibelsToGain(outputGain);
        
        for (int channel = 0; channel < numChannels; ++channel)
        {
            float* channelData = buffer.getWritePointer(channel);
            const float inputSample = channelData[sample];
            
            // Apply input gain
            float processedSample = inputSample * inputGainLinear;
            
            // Apply output gain
            processedSample *= outputGainLinear;
            
            // Hard clip protection
            processedSample = juce::jlimit(-0.98f, 0.98f, processedSample);
            
            // Dry/wet mix
            const float drySample = inputSample;
            const float wetSample = processedSample;
            channelData[sample] = drySample * (1.0f - dryWet) + wetSample * dryWet;
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
    return new juce::GenericAudioProcessorEditor(*this);
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

juce::AudioProcessorValueTreeState::ParameterLayout RythmPluginAudioProcessor::createParameterLayout()
{
    std::vector<std::unique_ptr<juce::RangedAudioParameter>> params;

    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        inputGainId,
        "Input Gain",
        juce::NormalisableRange<float>(0.0f, 24.0f, 0.1f),
        0.0f,
        juce::AudioParameterFloatAttributes()
            .withLabel("dB")
            .withCategory("Gain")));

    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        outputGainId,
        "Output Gain",
        juce::NormalisableRange<float>(0.0f, 24.0f, 0.1f),
        0.0f,
        juce::AudioParameterFloatAttributes()
            .withLabel("dB")
            .withCategory("Gain")));

    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        dryWetId,
        "Dry/Wet",
        juce::NormalisableRange<float>(0.0f, 100.0f, 0.1f),
        100.0f,
        juce::AudioParameterFloatAttributes()
            .withLabel("%")
            .withCategory("Mix")));

    return { params.begin(), params.end() };
}

//==============================================================================
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new RythmPluginAudioProcessor();
}
