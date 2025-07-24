import { z } from "zod";

// Friend
export const FriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  isOnline: z.boolean().optional(),
});
export type Friend = z.infer<typeof FriendSchema>;

// File Item
export const FileItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
});
export type FileItem = z.infer<typeof FileItemSchema>;

// File Transfer
export const FileTransferSchema = z.object({
  id: z.string(),
  file: FileItemSchema,
  fromUser: FriendSchema.optional(),
  toUser: FriendSchema.optional(),
  status: z.enum([
    "pending",
    "uploading",
    "sent",
    "received",
    "failed",
    "declined",
  ]),
  progress: z.number(),
  timestamp: z.string().transform((s) => new Date(s)),
  direction: z.enum(["sent", "received"]),
});
export type FileTransfer = z.infer<typeof FileTransferSchema>;

// File Transfer Gateway Events (discriminated union)
export const FileTransferGatewayEventSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("transfer-initiated"),
    data: z.object({
      uploadUrl: z.string(),
      fileKey: z.string(),
      stunServers: z.array(z.any()),
    }),
  }),
  z.object({
    event: z.literal("transfer-status"),
    data: z.object({
      fileKey: z.string(),
      status: z.string(),
      progress: z.number().optional(),
    }),
  }),
  z.object({
    event: z.literal("transfer-error"),
    data: z.object({ message: z.string() }),
  }),
  z.object({ event: z.literal("offer"), data: z.any() }),
  z.object({ event: z.literal("answer"), data: z.any() }),
  z.object({ event: z.literal("ice-candidate"), data: z.any() }),
]);
export type FileTransferGatewayEvent = z.infer<
  typeof FileTransferGatewayEventSchema
>;
