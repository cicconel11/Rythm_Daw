import { useEffect, useCallback, useRef } from "react";
import { rtcService, EventCallback } from "../services/rtc.service";
import { ServerEvents, ClientEvents } from "../types/websocket.types";

type EventMap = {
  [K in keyof typeof ServerEvents]: Parameters<EventCallback>[0];
};

export const useRtc = <T extends keyof EventMap>(
  eventHandlers: { [K in T]?: (data: EventMap[K]) => void } = {},
) => {
  const handlersRef = useRef(eventHandlers);

  // Update handlers when they change
  useEffect(() => {
    handlersRef.current = eventHandlers;
  }, [eventHandlers]);

  // Set up event listeners
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Connect to the WebSocket server
    const connect = async () => {
      try {
        await rtcService.connect();
      } catch (error) {
        console.error("Failed to connect to RTC server:", error);
      }
    };

    connect();

    // Set up event listeners
    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      if (handler) {
        const unsubscribe = rtcService.on(event, handler as EventCallback);
        unsubscribers.push(unsubscribe);
      }
    });

    // Clean up on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      // Don't disconnect here to maintain connection across component unmounts
      // rtcService.disconnect();
    };
  }, []);

  // Wrapper methods
  const joinRoom = useCallback(async (roomId: string) => {
    try {
      return await rtcService.joinRoom(roomId);
    } catch (error) {
      console.error("Failed to join room:", error);
      throw error;
    }
  }, []);

  const leaveRoom = useCallback(async (roomId: string) => {
    try {
      return await rtcService.leaveRoom(roomId);
    } catch (error) {
      console.error("Failed to leave room:", error);
      throw error;
    }
  }, []);

  const sendTrackUpdate = useCallback((update: unknown) => {
    rtcService.sendTrackUpdate(update);
  }, []);

  const sendSignal = useCallback((signal: unknown) => {
    rtcService.sendSignal(signal);
  }, []);

  const isConnected = useCallback(() => {
    return rtcService.isConnected;
  }, []);

  return {
    joinRoom,
    leaveRoom,
    sendTrackUpdate,
    sendSignal,
    isConnected,
    // Direct access to the service if needed
    service: rtcService,
  };
};

export default useRtc;
