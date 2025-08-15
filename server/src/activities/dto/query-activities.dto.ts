export class QueryActivitiesDto {
  cursor?: string;
  take?: number;
  type?: string[]; // e.g. ["FILE_UPLOAD","MESSAGE_SENT"]
  userId?: string;
  actorId?: string;
  projectId?: string;
  start?: string;  // ISO
  end?: string;    // ISO
  q?: string;      // optional payload text query (basic)
}
