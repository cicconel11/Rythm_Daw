#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "PluginProcessor.h"
#include "UI/Sidebar.h"
#include "UI/SectionView.h"

class RythmPluginAudioProcessorEditor : public juce::AudioProcessorEditor
{
public:
    RythmPluginAudioProcessorEditor(RythmPluginAudioProcessor&);
    ~RythmPluginAudioProcessorEditor() override;

    void paint(juce::Graphics&) override;
    void resized() override;

private:
    RythmPluginAudioProcessor& audioProcessor;

    // UI Components
    std::unique_ptr<Sidebar> sidebar;
    std::unique_ptr<SectionView> sectionView;
    
    // Parameter controls
    std::unique_ptr<juce::Slider> inputGainSlider;
    std::unique_ptr<juce::Slider> outputGainSlider;
    std::unique_ptr<juce::Slider> dryWetSlider;
    
    std::unique_ptr<juce::Label> inputGainLabel;
    std::unique_ptr<juce::Label> outputGainLabel;
    std::unique_ptr<juce::Label> dryWetLabel;
    
    // Parameter attachments
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> inputGainAttachment;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> outputGainAttachment;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> dryWetAttachment;
    
    // Status bar
    std::unique_ptr<juce::Label> statusLabel;
    std::unique_ptr<juce::Label> sampleRateLabel;
    std::unique_ptr<juce::Label> blockSizeLabel;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(RythmPluginAudioProcessorEditor)
};
