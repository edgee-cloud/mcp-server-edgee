import { makeEdgeeApiRequest, ApiRequestOptions } from './client.js';
import {
  Organization,
  OrganizationListResponse,
  OrganizationCreateInput,
  OrganizationUpdateInput,
  OrganizationUser,
  OrganizationUserListResponse,
  OrganizationUserUpdateInput,
  DeletedResponse,
  ListParams,
} from '../types/index.js';

/**
 * List all organizations
 */
export async function listOrganizations(params?: ListParams & { name?: string }): Promise<OrganizationListResponse> {
  return makeEdgeeApiRequest<OrganizationListResponse>('/v1/organizations', {
    params,
  });
}

/**
 * Get the current user's personal organization
 */
export async function getMyOrganization(): Promise<Organization> {
  return makeEdgeeApiRequest<Organization>('/v1/organizations/me');
}

/**
 * Get an organization by ID
 */
export async function getOrganization(id: string): Promise<Organization> {
  return makeEdgeeApiRequest<Organization>(`/v1/organizations/${id}`);
}

/**
 * Create a new organization
 */
export async function createOrganization(input: OrganizationCreateInput): Promise<Organization> {
  return makeEdgeeApiRequest<Organization>('/v1/organizations', {
    method: 'POST',
    body: input,
  });
}

/**
 * Update an organization
 */
export async function updateOrganization(id: string, input: OrganizationUpdateInput): Promise<Organization> {
  return makeEdgeeApiRequest<Organization>(`/v1/organizations/${id}`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/organizations/${id}`, {
    method: 'DELETE',
  });
}

/**
 * List users of an organization
 */
export async function listOrganizationUsers(
  id: string,
  params: ListParams & { role: 'admin' | 'editor' | 'member' }
): Promise<OrganizationUserListResponse> {
  return makeEdgeeApiRequest<OrganizationUserListResponse>(`/v1/organizations/${id}/users`, {
    params,
  });
}

/**
 * Update a user in an organization
 */
export async function updateOrganizationUser(
  id: string,
  userId: string,
  input: OrganizationUserUpdateInput
): Promise<OrganizationUser> {
  return makeEdgeeApiRequest<OrganizationUser>(`/v1/organizations/${id}/users/${userId}`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete a user from an organization
 */
export async function deleteOrganizationUser(id: string, userId: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/organizations/${id}/users/${userId}`, {
    method: 'DELETE',
  });
}
