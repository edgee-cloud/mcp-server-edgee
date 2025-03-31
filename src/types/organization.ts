import { ListResponse } from './common.js';

export interface Organization {
  object: string;
  id: string;
  name: string;
  slug: string;
  avatar_url: string;
  type: 'perso' | 'pro';
  current_billing_plan: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationListResponse extends ListResponse {
  data: Organization[];
}

export interface OrganizationCreateInput {
  name: string;
  slug: string;
}

export interface OrganizationUpdateInput {
  id: string;
  name?: string;
  slug?: string;
}

export interface OrganizationUser {
  object: string;
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: 'admin' | 'editor' | 'member';
  created_at: string;
  updated_at: string;
}

export interface OrganizationUserListResponse extends ListResponse {
  data: OrganizationUser[];
}

export interface OrganizationUserUpdateInput {
  role: 'admin' | 'editor' | 'member';
}
