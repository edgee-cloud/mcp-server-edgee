import { makeEdgeeApiRequest } from './client.js';
import {
  UserWithRoles,
  Invitation,
  InvitationListResponse,
  InvitationCreateInput,
  ApiToken,
  ApiTokenListResponse,
  ApiTokenCreateInput,
  DeletedResponse,
  ListParams,
  UploadPresign,
} from '../types/index.js';

/**
 * Get the current user
 */
export async function getMe(): Promise<UserWithRoles> {
  return makeEdgeeApiRequest<UserWithRoles>('/v1/users/me');
}

/**
 * Get a user by ID
 */
export async function getUser(id: string): Promise<UserWithRoles> {
  return makeEdgeeApiRequest<UserWithRoles>(`/v1/users/${id}`);
}

// Invitation API

/**
 * List all invitations
 */
export async function listInvitations(
  params?: ListParams & { organization_id?: string }
): Promise<InvitationListResponse> {
  return makeEdgeeApiRequest<InvitationListResponse>('/v1/invitations', {
    params,
  });
}

/**
 * Get an invitation by ID
 */
export async function getInvitation(id: string): Promise<Invitation> {
  return makeEdgeeApiRequest<Invitation>(`/v1/invitations/${id}`);
}

/**
 * Create a new invitation
 */
export async function createInvitation(input: InvitationCreateInput): Promise<Invitation> {
  return makeEdgeeApiRequest<Invitation>('/v1/invitations', {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete an invitation
 */
export async function deleteInvitation(id: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/invitations/${id}`, {
    method: 'DELETE',
  });
}

// API Token API

/**
 * List all API tokens
 */
export async function listApiTokens(params?: ListParams & { name?: string }): Promise<ApiTokenListResponse> {
  return makeEdgeeApiRequest<ApiTokenListResponse>('/v1/api_tokens', {
    params,
  });
}

/**
 * Get an API token by ID
 */
export async function getApiToken(id: string): Promise<ApiToken> {
  return makeEdgeeApiRequest<ApiToken>(`/v1/api_tokens/${id}`);
}

/**
 * Create a new API token
 */
export async function createApiToken(input: ApiTokenCreateInput): Promise<ApiToken> {
  return makeEdgeeApiRequest<ApiToken>('/v1/api_tokens', {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete an API token
 */
export async function deleteApiToken(id: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/api_tokens/${id}`, {
    method: 'DELETE',
  });
}

// Upload API

/**
 * Get a presigned URL for uploading files
 */
export async function getUploadPresignedUrl(): Promise<UploadPresign> {
  return makeEdgeeApiRequest<UploadPresign>('/v1/upload/presign');
}
