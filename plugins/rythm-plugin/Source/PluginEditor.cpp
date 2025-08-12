#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
RythmPluginAudioProcessorEditor::RythmPluginAudioProcessorEditor(RythmPluginAudioProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    // Set window size
    setSize(800, 600);
    
    // Create UI components
    sidebar = std::make_unique<Sidebar>();
    addAndMakeVisible(sidebar.get());
    
    sectionView = std::make_unique<SectionView>();
    addAndMakeVisible(sectionView.get());
    
    // Create parameter knobs
    inputGainKnob = std::make_unique<ParameterKnob>("inputGain", audioProcessor.getValueTreeState(), "Input Gain");
    addAndMakeVisible(inputGainKnob.get());
    
    outputGainKnob = std::make_unique<ParameterKnob>("outputGain", audioProcessor.getValueTreeState(), "Output Gain");
    addAndMakeVisible(outputGainKnob.get());
    
    dryWetKnob = std::make_unique<ParameterKnob>("dryWet", audioProcessor.getValueTreeState(), "Dry/Wet");
    addAndMakeVisible(dryWetKnob.get());
}

RythmPluginAudioProcessorEditor::~RythmPluginAudioProcessorEditor()
{
}

//==============================================================================
void RythmPluginAudioProcessorEditor::paint(juce::Graphics& g)
{
    // Background
    g.fillAll(juce::Colour(0xff2d2d30));
    
    // Top bar background
    g.setColour(juce::Colour(0xff3e3e42));
    g.fillRect(0, 0, getWidth(), topBarHeight);
    
    // Bottom bar background
    g.setColour(juce::Colour(0xff3e3e42));
    g.fillRect(0, getHeight() - bottomBarHeight, getWidth(), bottomBarHeight);
    
    // Title
    g.setColour(juce::Colours::white);
    g.setFont(20.0f);
    g.drawText("RHYTHM", sidebarWidth + 10, 10, getWidth() - sidebarWidth - 20, 30, 
               juce::Justification::centredLeft);
    
    // Status text
    g.setFont(12.0f);
    g.setColour(juce::Colours::lightgrey);
    g.drawText("Ready", 10, getHeight() - bottomBarHeight + 5, getWidth() - 20, 20, 
               juce::Justification::centredLeft);
}

void RythmPluginAudioProcessorEditor::resized()
{
    auto bounds = getLocalBounds();
    
    // Sidebar (left)
    sidebar->setBounds(0, 0, sidebarWidth, getHeight());
    
    // Top bar with parameter knobs
    auto topBar = bounds.removeFromTop(topBarHeight);
    topBar.removeFromLeft(sidebarWidth);
    
    int knobSpacing = (topBar.getWidth() - 3 * knobSize) / 4;
    int knobY = (topBarHeight - knobSize) / 2;
    
    inputGainKnob->setBounds(topBar.getX() + knobSpacing, knobY, knobSize, knobSize);
    outputGainKnob->setBounds(topBar.getX() + 2 * knobSpacing + knobSize, knobY, knobSize, knobSize);
    dryWetKnob->setBounds(topBar.getX() + 3 * knobSpacing + 2 * knobSize, knobY, knobSize, knobSize);
    
    // Section view (main area)
    bounds.removeFromBottom(bottomBarHeight);
    sectionView->setBounds(bounds);
}

//==============================================================================
// Sidebar implementation
Sidebar::Sidebar()
{
    // Create navigation buttons
    dashboardButton = std::make_unique<juce::TextButton>("Dashboard");
    addAndMakeVisible(dashboardButton.get());
    
    filesButton = std::make_unique<juce::TextButton>("Files");
    addAndMakeVisible(filesButton.get());
    
    historyButton = std::make_unique<juce::TextButton>("History");
    addAndMakeVisible(historyButton.get());
    
    friendsButton = std::make_unique<juce::TextButton>("Friends");
    addAndMakeVisible(friendsButton.get());
    
    chatButton = std::make_unique<juce::TextButton>("Chat");
    addAndMakeVisible(chatButton.get());
    
    settingsButton = std::make_unique<juce::TextButton>("Settings");
    addAndMakeVisible(settingsButton.get());
    
    // Style buttons
    auto styleButton = [](juce::TextButton* button) {
        button->setColour(juce::TextButton::buttonColourId, juce::Colour(0xff3e3e42));
        button->setColour(juce::TextButton::buttonOnColourId, juce::Colour(0xff007acc));
        button->setColour(juce::TextButton::textColourOffId, juce::Colours::white);
        button->setColour(juce::TextButton::textColourOnId, juce::Colours::white);
    };
    
    styleButton(dashboardButton.get());
    styleButton(filesButton.get());
    styleButton(historyButton.get());
    styleButton(friendsButton.get());
    styleButton(chatButton.get());
    styleButton(settingsButton.get());
}

void Sidebar::paint(juce::Graphics& g)
{
    // Sidebar background
    g.fillAll(juce::Colour(0xff252526));
    
    // Title
    g.setColour(juce::Colours::white);
    g.setFont(16.0f);
    g.drawText("RHYTHM", 10, 10, getWidth() - 20, 30, juce::Justification::centred);
}

void Sidebar::resized()
{
    auto bounds = getLocalBounds();
    bounds.removeFromTop(50); // Space for title
    
    int buttonHeight = 40;
    int buttonMargin = 5;
    
    dashboardButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
    bounds.removeFromTop(buttonMargin);
    
    filesButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
    bounds.removeFromTop(buttonMargin);
    
    historyButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
    bounds.removeFromTop(buttonMargin);
    
    friendsButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
    bounds.removeFromTop(buttonMargin);
    
    chatButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
    bounds.removeFromTop(buttonMargin);
    
    settingsButton->setBounds(bounds.removeFromTop(buttonHeight).reduced(buttonMargin));
}

//==============================================================================
// Section view implementation
SectionView::SectionView()
    : currentSection("Dashboard")
{
}

void SectionView::paint(juce::Graphics& g)
{
    // Background
    g.fillAll(juce::Colour(0xff2d2d30));
    
    // Section title
    g.setColour(juce::Colours::white);
    g.setFont(18.0f);
    g.drawText(currentSection, 20, 20, getWidth() - 40, 30, juce::Justification::centredLeft);
    
    // Placeholder content
    g.setFont(14.0f);
    g.setColour(juce::Colours::lightgrey);
    g.drawText("Section content will be implemented here...", 20, 60, getWidth() - 40, 30, 
               juce::Justification::centredLeft);
}

void SectionView::resized()
{
    // Layout for section content will be implemented here
}

void SectionView::setSection(const juce::String& sectionName)
{
    currentSection = sectionName;
    repaint();
}

//==============================================================================
// Parameter knob implementation
ParameterKnob::ParameterKnob(const juce::String& parameterId, 
                             juce::AudioProcessorValueTreeState& vts,
                             const juce::String& label)
{
    // Set up slider
    setSliderStyle(juce::Slider::RotaryHorizontalVerticalDrag);
    setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    setColour(juce::Slider::thumbColourId, juce::Colour(0xff007acc));
    setColour(juce::Slider::trackColourId, juce::Colour(0xff3e3e42));
    setColour(juce::Slider::backgroundColourId, juce::Colour(0xff252526));
    setColour(juce::Slider::textBoxTextColourId, juce::Colours::white);
    setColour(juce::Slider::textBoxBackgroundColourId, juce::Colour(0xff3e3e42));
    setColour(juce::Slider::textBoxOutlineColourId, juce::Colour(0xff007acc));
    
    // Create attachment
    attachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(vts, parameterId, *this);
    
    // Set label
    setName(label);
}

//==============================================================================
