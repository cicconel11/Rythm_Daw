"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransferGatewayEventSchema = exports.FileTransferSchema = exports.FileItemSchema = exports.FriendSchema = void 0;
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
exports.FileTransferSchema = zod_1.z.object({
    id: zod_1.z.string(),
    file: exports.FileItemSchema,
    fromUser: exports.FriendSchema.optional(),
    toUser: exports.FriendSchema.optional(),
    status: zod_1.z.enum([
        "pending",
        "uploading",
        "sent",
        "received",
        "failed",
        "declined",
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
            stunServers: zod_1.z.array(zod_1.z.any()),
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
    zod_1.z.object({ event: zod_1.z.literal("offer"), data: zod_1.z.any() }),
    zod_1.z.object({ event: zod_1.z.literal("answer"), data: zod_1.z.any() }),
    zod_1.z.object({ event: zod_1.z.literal("ice-candidate"), data: zod_1.z.any() }),
]);
//# sourceMappingURL=index.js.map