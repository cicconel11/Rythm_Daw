#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

class RythmPluginAudioProcessor : public juce::AudioProcessor
{
public:
    RythmPluginAudioProcessor();
    ~RythmPluginAudioProcessor() override;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;

    bool isBusesLayoutSupported(const BusesLayout& busesLayout) const override;

    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    const juce::String getName() const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram(int index) override;
    const juce::String getProgramName(int index) override;
    void changeProgramName(int index, const juce::String& newName) override;

    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

    juce::AudioProcessorValueTreeState& getValueTreeState() { return parameters; }

private:
    juce::AudioProcessorValueTreeState parameters;
    juce::AudioProcessorValueTreeState::ParameterLayout createParameterLayout();

    // Parameter IDs
    juce::String inputGainId = "inputGain";
    juce::String outputGainId = "outputGain";
    juce::String dryWetId = "dryWet";

    // Smoothed values for parameter changes
    juce::dsp::SmoothedValue<float> inputGainSmoothed;
    juce::dsp::SmoothedValue<float> outputGainSmoothed;
    juce::dsp::SmoothedValue<float> dryWetSmoothed;

    // Parameter listeners
    std::atomic<float> inputGainValue{0.0f};
    std::atomic<float> outputGainValue{0.0f};
    std::atomic<float> dryWetValue{100.0f};

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(RythmPluginAudioProcessor)
};
