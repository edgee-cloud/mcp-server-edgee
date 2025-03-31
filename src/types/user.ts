import { ListResponse } from './common.js';

export interface UserBase {
  object: string;
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface User extends UserBase {
  role: string;
}

export interface UserWithRoles extends UserBase {
  roles: Record<string, 'admin' | 'member'>;
}

export interface Invitation {
  object: string;
  id: string;
  organization_id: string;
  role: 'admin' | 'member';
  email: string;
  created_at: string;
}

export interface InvitationListResponse extends ListResponse {
  data: Invitation[];
}

export interface InvitationCreateInput {
  organization_id: string;
  email: string;
  role: 'admin' | 'member';
}

export interface ApiToken {
  object: string;
  id: string;
  user_id: string;
  name: string;
  from_browser: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  token?: string;
}

export interface ApiTokenListResponse extends ListResponse {
  data: ApiToken[];
}

export interface ApiTokenCreateInput {
  name: string;
  expires_at?: string;
}

export interface UserUpdateInput {
  avatar_url?: string;
  terms_version?: string;
  privacy_version?: string;
}
