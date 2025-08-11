#pragma once

#include <juce_gui_basics/juce_gui_basics.h>

enum class Section;

class SectionView : public juce::Component
{
public:
    SectionView();
    ~SectionView() override;

    void paint(juce::Graphics& g) override;
    void resized() override;

    void setSection(Section section);

private:
    Section currentSection;
    std::unique_ptr<juce::Label> titleLabel;
    std::unique_ptr<juce::TextEditor> contentArea;

    void updateContent();

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(SectionView)
};
