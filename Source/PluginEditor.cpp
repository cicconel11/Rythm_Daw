#include "PluginEditor.h"

//==============================================================================
RhythmAudioProcessorEditor::RhythmAudioProcessorEditor(RhythmAudioProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    // Set the editor size
    setSize(800, 600);
    
    // For now, we'll just create a simple label instead of WebBrowserComponent
    // since there are issues with WebKit on some systems
    addAndMakeVisible(helloLabel);
    helloLabel.setText("RHYTHM Plugin", juce::dontSendNotification);
    helloLabel.setFont(juce::Font(24.0f, juce::Font::bold));
    helloLabel.setJustificationType(juce::Justification::centred);
    helloLabel.setColour(juce::Label::textColourId, juce::Colours::white);
    
    // Set the background color
    setOpaque(true);
}

RhythmAudioProcessorEditor::~RhythmAudioProcessorEditor()
{
}

//==============================================================================
void RhythmAudioProcessorEditor::paint(juce::Graphics& g)
{
    // Fill the background with a solid color
    g.fillAll(juce::Colours::darkgrey);
    
    // Draw a simple border
    g.setColour(juce::Colours::white);
    g.drawRect(getLocalBounds(), 2);
}

void RhythmAudioProcessorEditor::resized()
{
    // Position the label in the center
    auto bounds = getLocalBounds().reduced(20);
    helloLabel.setBounds(bounds);
}
