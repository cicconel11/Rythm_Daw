#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "PluginProcessor.h"

// Forward declarations
class Sidebar;
class SectionView;
class ParameterKnob;

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
    std::unique_ptr<ParameterKnob> inputGainKnob;
    std::unique_ptr<ParameterKnob> outputGainKnob;
    std::unique_ptr<ParameterKnob> dryWetKnob;
    
    // Layout constants
    static constexpr int sidebarWidth = 200;
    static constexpr int topBarHeight = 80;
    static constexpr int bottomBarHeight = 30;
    static constexpr int knobSize = 60;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(RythmPluginAudioProcessorEditor)
};

// Sidebar component
class Sidebar : public juce::Component
{
public:
    Sidebar();
    ~Sidebar() override = default;
    
    void paint(juce::Graphics& g) override;
    void resized() override;
    
private:
    std::unique_ptr<juce::TextButton> dashboardButton;
    std::unique_ptr<juce::TextButton> filesButton;
    std::unique_ptr<juce::TextButton> historyButton;
    std::unique_ptr<juce::TextButton> friendsButton;
    std::unique_ptr<juce::TextButton> chatButton;
    std::unique_ptr<juce::TextButton> settingsButton;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Sidebar)
};

// Section view component
class SectionView : public juce::Component
{
public:
    SectionView();
    ~SectionView() override = default;
    
    void paint(juce::Graphics& g) override;
    void resized() override;
    
    void setSection(const juce::String& sectionName);
    
private:
    juce::String currentSection;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(SectionView)
};

// Parameter knob component
class ParameterKnob : public juce::Slider
{
public:
    ParameterKnob(const juce::String& parameterId, 
                  juce::AudioProcessorValueTreeState& vts,
                  const juce::String& label);
    ~ParameterKnob() override = default;
    
private:
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> attachment;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(ParameterKnob)
};
