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
        stunServers: z.ZodArray<z.ZodAny>;
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
    data: z.ZodAny;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"answer">;
    data: z.ZodAny;
}, z.core.$strip>, z.ZodObject<{
    event: z.ZodLiteral<"ice-candidate">;
    data: z.ZodAny;
}, z.core.$strip>]>;
export type FileTransferGatewayEvent = z.infer<typeof FileTransferGatewayEventSchema>;
