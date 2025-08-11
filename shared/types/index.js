"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestSchema = exports.ChatThreadListSchema = exports.ChatThreadSchema = exports.ChatMessageListSchema = exports.ChatMessageSchema = exports.DownloadUrlSchema = exports.ActivitySchema = exports.FileTransferGatewayEventSchema = exports.FileTransferSchema = exports.FileTransferStatusEnum = exports.FileItemSchema = exports.FriendSchema = void 0;
const zod_1 = require("zod");
exports.FriendSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    avatar: zod_1.z.string().optional(),
    isOnline: zod_1.z.boolean().optional(),
});
exports.FileItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    size: zod_1.z.number(),
    type: zod_1.z.string(),
    lastModified: zod_1.z.number(),
});
exports.FileTransferStatusEnum = {
    PENDING: "pending",
    UPLOADING: "uploading",
    SENT: "sent",
    RECEIVED: "received",
    FAILED: "failed",
    DECLINED: "declined",
    ACCEPTED: "accepted",
};
exports.FileTransferSchema = zod_1.z.object({
    id: zod_1.z.string(),
    file: exports.FileItemSchema,
    fromUser: exports.FriendSchema.optional(),
    toUser: exports.FriendSchema.optional(),
    status: zod_1.z.enum([
        exports.FileTransferStatusEnum.PENDING,
        exports.FileTransferStatusEnum.UPLOADING,
        exports.FileTransferStatusEnum.SENT,
        exports.FileTransferStatusEnum.RECEIVED,
        exports.FileTransferStatusEnum.FAILED,
        exports.FileTransferStatusEnum.DECLINED,
        exports.FileTransferStatusEnum.ACCEPTED,
    ]),
    progress: zod_1.z.number(),
    timestamp: zod_1.z.string().transform((s) => new Date(s)),
    direction: zod_1.z.enum(["sent", "received"]),
});
exports.FileTransferGatewayEventSchema = zod_1.z.discriminatedUnion("event", [
    zod_1.z.object({
        event: zod_1.z.literal("transfer-initiated"),
        data: zod_1.z.object({
            uploadUrl: zod_1.z.string(),
            fileKey: zod_1.z.string(),
        }),
    }),
    zod_1.z.object({
        event: zod_1.z.literal("transfer-status"),
        data: zod_1.z.object({
            fileKey: zod_1.z.string(),
            status: zod_1.z.string(),
            progress: zod_1.z.number().optional(),
        }),
    }),
    zod_1.z.object({
        event: zod_1.z.literal("transfer-error"),
        data: zod_1.z.object({ message: zod_1.z.string() }),
    }),
    zod_1.z.object({ event: zod_1.z.literal("offer"), data: zod_1.z.unknown() }),
    zod_1.z.object({ event: zod_1.z.literal("answer"), data: zod_1.z.unknown() }),
]);
exports.ActivitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.string(),
    description: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
exports.DownloadUrlSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
});
exports.ChatMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    threadId: zod_1.z.string(),
    sender: zod_1.z.string(),
    content: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
exports.ChatMessageListSchema = zod_1.z.array(exports.ChatMessageSchema);
exports.ChatThreadSchema = zod_1.z.object({
    id: zod_1.z.string(),
    participants: zod_1.z.array(zod_1.z.string()),
    lastMessage: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string(),
});
exports.ChatThreadListSchema = zod_1.z.array(exports.ChatThreadSchema);
exports.FriendRequestSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    status: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
    plugins: zod_1.z.array(zod_1.z.string()),
});
//# sourceMappingURL=index.js.map