import { z } from "zod";
export declare const FriendSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type Friend = z.infer<typeof FriendSchema>;
export declare const FileItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    size: z.ZodNumber;
    type: z.ZodString;
    lastModified: z.ZodNumber;
}, z.core.$strip>;
export type FileItem = z.infer<typeof FileItemSchema>;
export declare const FileTransferStatusEnum: {
    readonly PENDING: "pending";
    readonly UPLOADING: "uploading";
    readonly SENT: "sent";
    readonly RECEIVED: "received";
    readonly FAILED: "failed";
    readonly DECLINED: "declined";
    readonly ACCEPTED: "accepted";
};
export type FileTransferStatus = (typeof FileTransferStatusEnum)[keyof typeof FileTransferStatusEnum];
export declare const FileTransferSchema: z.ZodObject<{
    id: z.ZodString;
    file: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        size: z.ZodNumber;
        type: z.ZodString;
        lastModified: z.ZodNumber;
    }, z.core.$strip>;
    fromUser: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        isOnline: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    toUser: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        isOnline: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    status: z.ZodEnum<{
        pending: "pending";
        uploading: "uploading";
        sent: "sent";
        received: "received";
        failed: "failed";
        declined: "declined";
        accepted: "accepted";
    }>;
    progress: z.ZodNumber;
    timestamp: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    direction: z.ZodEnum<{
        sent: "sent";
        received: "received";
    }>;
}, z.core.$strip>;
export type FileTransfer = z.infer<typeof FileTransferSchema>;
export declare const FileTransferGatewayEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    event: z.ZodLiteral<"transfer-initiated">;
    data: z.ZodObject<{
        uploadUrl: z.ZodString;
        fileKey: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"transfer-status">;
    data: z.ZodObject<{
        fileKey: z.ZodString;
        status: z.ZodString;
        progress: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"transfer-error">;
    data: z.ZodObject<{
        message: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"offer">;
    data: z.ZodUnknown;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"answer">;
    data: z.ZodUnknown;
}, z.core.$strip>]>;
export type FileTransferGatewayEvent = z.infer<typeof FileTransferGatewayEventSchema>;
export declare const ActivitySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    description: z.ZodString;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type Activity = z.infer<typeof ActivitySchema>;
export declare const DownloadUrlSchema: z.ZodObject<{
    url: z.ZodString;
}, z.core.$strip>;
export type DownloadUrl = z.infer<typeof DownloadUrlSchema>;
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    threadId: z.ZodString;
    sender: z.ZodString;
    content: z.ZodString;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const ChatMessageListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    threadId: z.ZodString;
    sender: z.ZodString;
    content: z.ZodString;
    timestamp: z.ZodString;
}, z.core.$strip>>;
export declare const ChatThreadSchema: z.ZodObject<{
    id: z.ZodString;
    participants: z.ZodArray<z.ZodString>;
    lastMessage: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ChatThread = z.infer<typeof ChatThreadSchema>;
export declare const ChatThreadListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    participants: z.ZodArray<z.ZodString>;
    lastMessage: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodString;
}, z.core.$strip>>;
export declare const FriendRequestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    status: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    plugins: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type FriendRequest = z.infer<typeof FriendRequestSchema>;
