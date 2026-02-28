// Agent data contract
export interface Agent {
  id: string;
  role: string;
  state: string;
  workspace_path: string;
  last_message_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

// API response formats
export interface ApiAgent {
  id: string;
  role: string;
  state: string;
  lastSeen: string | null;
  workspace: string;
  created: string;
}
