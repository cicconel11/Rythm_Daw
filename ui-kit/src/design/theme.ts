export const theme = {
  colors: {
    background: {
      primary: "#0D1126",
      secondary: "#141B33",
      tertiary: "#1A2142",
    },
    accent: {
      primary: "#7E4FFF",
      secondary: "#6B3FE6",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9CA3AF",
      muted: "#6B7280",
    },
    status: {
      online: "#10B981",
      offline: "#6B7280",
      active: "#10B981",
      inactive: "#6B7280",
    },
    border: {
      primary: "#374151",
      secondary: "#4B5563",
    },
  },
  fonts: {
    heading: "Inter",
    mono: "JetBrains Mono",
  },
  gradients: {
    background: "from-[#0D1126] via-[#141B33] to-[#0D1126]",
    card: "from-[#141B33] to-[#1A2142]",
    accent: "from-[#7E4FFF] to-[#6B3FE6]",
  },
} as const;
