import React from "react";
import { Badge } from "./ui/badge.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { CheckCircle, AlertTriangle, XCircle, Music } from "lucide-react";

interface Plugin {
  id: string;
  name: string;
  vendor: string;
  version: string;
  status: "up-to-date" | "version-mismatch" | "missing";
  active: boolean;
  category: string;
}

interface PluginListProps {
  showInactive: boolean;
}

const mockPlugins: Plugin[] = [
  {
    id: "1",
    name: "Serum",
    vendor: "Xfer Records",
    version: "1.365",
    status: "up-to-date",
    active: true,
    category: "Synthesizer",
  },
  {
    id: "2",
    name: "FabFilter Pro-Q 3",
    vendor: "FabFilter",
    version: "3.24",
    status: "up-to-date",
    active: true,
    category: "EQ",
  },
  {
    id: "3",
    name: "Waves SSL G-Master",
    vendor: "Waves",
    version: "14.0",
    status: "version-mismatch",
    active: true,
    category: "Compressor",
  },
  {
    id: "4",
    name: "Native Instruments Massive X",
    vendor: "Native Instruments",
    version: "1.4.1",
    status: "missing",
    active: false,
    category: "Synthesizer",
  },
  {
    id: "5",
    name: "Valhalla VintageVerb",
    vendor: "Valhalla DSP",
    version: "3.0.1",
    status: "up-to-date",
    active: false,
    category: "Reverb",
  },
  {
    id: "6",
    name: "Soundtoys Decapitator",
    vendor: "Soundtoys",
    version: "5.5.4",
    status: "up-to-date",
    active: true,
    category: "Distortion",
  },
];

const getStatusIcon = (status: Plugin["status"]) => {
  switch (status) {
    case "up-to-date":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "version-mismatch":
      return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    case "missing":
      return <XCircle className="w-4 h-4 text-red-400" />;
  }
};

const getStatusBadge = (status: Plugin["status"]) => {
  switch (status) {
    case "up-to-date":
      return (
        <Badge
          variant="secondary"
          className="bg-green-500/20 text-green-400 border-green-500/30"
        >
          Up to date
        </Badge>
      );
    case "version-mismatch":
      return (
        <Badge
          variant="secondary"
          className="bg-orange-500/20 text-orange-400 border-orange-500/30"
        >
          Update available
        </Badge>
      );
    case "missing":
      return (
        <Badge
          variant="secondary"
          className="bg-red-500/20 text-red-400 border-red-500/30"
        >
          Missing
        </Badge>
      );
  }
};

export function PluginList({ showInactive }: PluginListProps) {
  const filteredPlugins = showInactive
    ? mockPlugins
    : mockPlugins.filter((p) => p.active);
  const hasPlugins = filteredPlugins.length > 0;

  if (!hasPlugins) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          No plugins found
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {showInactive
            ? "No plugins detected in your system."
            : "No active plugins found."}
        </p>
        <p className="text-gray-500 text-xs">
          Try running a plugin scan to detect installed plugins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Plugins ({filteredPlugins.length})
        </h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">
              {mockPlugins.filter((p) => p.status === "up-to-date").length}{" "}
              Active
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-gray-400">
              {
                mockPlugins.filter((p) => p.status === "version-mismatch")
                  .length
              }{" "}
              Updates
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-gray-400">
              {mockPlugins.filter((p) => p.status === "missing").length} Missing
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-3">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="flex items-center justify-between p-3 bg-[#0D1126] border border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(plugin.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {plugin.name}
                    </span>
                    {!plugin.active && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-400"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{plugin.vendor}</span>
                    <span>•</span>
                    <span>{plugin.category}</span>
                    <span>•</span>
                    <span>v{plugin.version}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(plugin.status)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
