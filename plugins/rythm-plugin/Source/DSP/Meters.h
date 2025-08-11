#pragma once

#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_audio_basics/juce_audio_basics.h>

class Meters : public juce::Component
{
public:
    Meters();
    ~Meters() override;

    void paint(juce::Graphics& g) override;
    void resized() override;

    void setLevels(float inputLevel, float outputLevel);

private:
    float inputLevel = 0.0f;
    float outputLevel = 0.0f;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Meters)
};
