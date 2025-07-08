/*
  Warnings:

  - Added the required column `expiresAt` to the `UserPresence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `WebRtcMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CrashReport" ADD COLUMN "breadcrumbs" TEXT;
ALTER TABLE "CrashReport" ADD COLUMN "context" TEXT;
ALTER TABLE "CrashReport" ADD COLUMN "projectId" TEXT;
ALTER TABLE "CrashReport" ADD COLUMN "stack" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPresence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "status" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserPresence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPresence" ("createdAt", "id", "lastSeen", "status", "updatedAt", "userId") SELECT "createdAt", "id", "lastSeen", "status", "updatedAt", "userId" FROM "UserPresence";
DROP TABLE "UserPresence";
ALTER TABLE "new_UserPresence" RENAME TO "UserPresence";
CREATE INDEX "UserPresence_expiresAt_idx" ON "UserPresence"("expiresAt");
CREATE UNIQUE INDEX "UserPresence_userId_projectId_key" ON "UserPresence"("userId", "projectId");
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
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebRtcMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WebRtcMetric" ("createdAt", "id", "metadata", "metricType", "userId", "value") SELECT "createdAt", "id", "metadata", "metricType", "userId", "value" FROM "WebRtcMetric";
DROP TABLE "WebRtcMetric";
ALTER TABLE "new_WebRtcMetric" RENAME TO "WebRtcMetric";
CREATE INDEX "WebRtcMetric_userId_projectId_timestamp_idx" ON "WebRtcMetric"("userId", "projectId", "timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
