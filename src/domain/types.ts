export interface Worker {
  id: string;
  user_id: string;
  name: string;
  last_seen_at: Date;
  hashrate_mh: number;
  status: 'online' | 'offline' | 'inactive';
}

export interface WatcherLink {
  id: string;
  user_id: string;
  payload_hash: Buffer;
  scope: string;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export interface DashboardResponse {
  workers: Array<{
    id: string;
    name: string;
    status: string;
    last_seen_at: string;
    hashrate_th: string;
  }>;
  agg: {
    online: number;
    offline: number;
    inactive: number;
    total_hashrate_th: string;
  };
}
