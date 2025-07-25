import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FriendSchema } from "../types";
import { api } from "../lib/api";
import { useEffect } from "react";

export const useFriends = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await api.get("/friends");
      return res.data.map((item: unknown) => FriendSchema.parse(item));
    },
  });

  // Subscribe to WS presence updates
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + "/presence");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === "presence:update") {
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      }
    };
    return () => ws.close();
  }, [queryClient]);

  return query;
};
