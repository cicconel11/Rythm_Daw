#pragma once

#include <juce_gui_basics/juce_gui_basics.h>

enum class Section
{
    Dashboard,
    Files,
    History,
    Friends,
    Chat,
    Settings
};

class Sidebar : public juce::Component
{
public:
    Sidebar();
    ~Sidebar() override;

    void paint(juce::Graphics& g) override;
    void resized() override;

    // Callback for section changes
    std::function<void(Section)> onSectionChanged;

private:
    std::vector<std::unique_ptr<juce::TextButton>> sectionButtons;
    Section currentSection = Section::Dashboard;

    void createSectionButton(const juce::String& name, Section section);
    void buttonClicked(juce::Button* button);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Sidebar)
};
