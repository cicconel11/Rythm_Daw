import React, { useEffect } from "react";

interface ConfettiBurstProps {
  onDone?: () => void;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ onDone }) => {
  useEffect(() => {
    const fireConfetti = async () => {
      try {
        const confetti = await import("canvas-confetti");

        // Fire 300 particles
        confetti.default({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Call onDone after 1.5 seconds
        setTimeout(() => {
          onDone?.();
        }, 1500);
      } catch (error) {
        console.error("Failed to load confetti:", error);
        // Still call onDone even if confetti fails
        setTimeout(() => {
          onDone?.();
        }, 1500);
      }
    };

    fireConfetti();
  }, [onDone]);

  // This component doesn't render anything visible
  return null;
};
