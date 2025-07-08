// This is the editor for the audio processor
#ifndef PLUGINEDITOR_H_INCLUDED
#define PLUGINEDITOR_H_INCLUDED

#include <JuceHeader.h>
#include "PluginProcessor.h"

class RhythmAudioProcessorEditor  : public juce::AudioProcessorEditor
{
public:
    explicit RhythmAudioProcessorEditor(RhythmAudioProcessor&);
    ~RhythmAudioProcessorEditor() override;

    //==============================================================================
    void paint(juce::Graphics&) override;
    void resized() override;

private:
    // This reference is provided as a quick way for your editor to
    // access the processor object that created it.
    RhythmAudioProcessor& audioProcessor;
    
    // Simple label for the UI
    juce::Label helloLabel;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(RhythmAudioProcessorEditor)
};

#endif  // PLUGINEDITOR_H_INCLUDED
