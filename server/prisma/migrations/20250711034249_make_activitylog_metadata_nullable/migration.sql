-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;
ALTER TABLE "User" ADD COLUMN "refreshToken" TEXT;

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "info" TEXT,
    "lastActiveAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "projectId" TEXT,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ActivityLog" ("action", "createdAt", "entityId", "entityType", "id", "ipAddress", "metadata", "projectId", "userAgent", "userId") SELECT "action", "createdAt", "entityId", "entityType", "id", "ipAddress", "metadata", "projectId", "userAgent", "userId" FROM "ActivityLog";
DROP TABLE "ActivityLog";
ALTER TABLE "new_ActivityLog" RENAME TO "ActivityLog";
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_projectId_idx" ON "ActivityLog"("projectId");
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE TABLE "new_CrashReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "stackTrace" TEXT NOT NULL,
    "stack" TEXT,
    "breadcrumbs" TEXT,
    "context" TEXT,
    "projectId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CrashReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CrashReport" ("breadcrumbs", "context", "createdAt", "error", "id", "metadata", "projectId", "stack", "stackTrace", "userId") SELECT "breadcrumbs", "context", "createdAt", "error", "id", "metadata", "projectId", "stack", "stackTrace", "userId" FROM "CrashReport";
DROP TABLE "CrashReport";
ALTER TABLE "new_CrashReport" RENAME TO "CrashReport";
CREATE TABLE "new_Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Snapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Snapshot" ("createdAt", "data", "description", "id", "name", "projectId", "updatedAt") SELECT "createdAt", "data", "description", "id", "name", "projectId", "updatedAt" FROM "Snapshot";
DROP TABLE "Snapshot";
ALTER TABLE "new_Snapshot" RENAME TO "Snapshot";
CREATE TABLE "new_WebRtcMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "metricType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "peerConnectionId" TEXT,
    "rttMs" REAL,
    "jitterMs" REAL,
    "packetLoss" REAL,
    "networkType" TEXT,
    "effectiveType" TEXT,
    "downlinkMbps" REAL,
    "iceCandidatePairId" TEXT,
    "localCandidateId" TEXT,
    "remoteCandidateId" TEXT,
    "timestamp" DATETIME NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebRtcMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WebRtcMetric" ("createdAt", "downlinkMbps", "effectiveType", "iceCandidatePairId", "id", "jitterMs", "localCandidateId", "metadata", "metricType", "networkType", "packetLoss", "peerConnectionId", "projectId", "remoteCandidateId", "rttMs", "timestamp", "userId", "value") SELECT "createdAt", "downlinkMbps", "effectiveType", "iceCandidatePairId", "id", "jitterMs", "localCandidateId", "metadata", "metricType", "networkType", "packetLoss", "peerConnectionId", "projectId", "remoteCandidateId", "rttMs", "timestamp", "userId", "value" FROM "WebRtcMetric";
DROP TABLE "WebRtcMetric";
ALTER TABLE "new_WebRtcMetric" RENAME TO "WebRtcMetric";
CREATE INDEX "WebRtcMetric_userId_projectId_timestamp_idx" ON "WebRtcMetric"("userId", "projectId", "timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
