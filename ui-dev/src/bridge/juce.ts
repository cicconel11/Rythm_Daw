/*--------------------------------------------------------------
  Mock JUCE <-> JS bridge for browser dev harness
--------------------------------------------------------------*/
export const juce = {
  send: (channel: string, payload: unknown) =>
    console.log('JUCE →', channel, payload),
  on: (_channel: string, _cb: (payload: unknown) => void) => {
    /* no-op stub for now */
  },
} as const;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – expose globally for quick debugging
window.juce = juce;

export type JuceBridge = typeof juce;
