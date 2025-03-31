import { makeEdgeeApiRequest } from './client.js';
import {
  Component,
  ComponentListResponse,
  ComponentCreateInput,
  ComponentUpdateParams,
  ComponentVersion,
  ComponentVersionCreateInput,
  ComponentVersionUpdateInput,
  DeletedResponse,
  ListParams,
} from '../types/index.js';

/**
 * List all public components
 */
export async function listPublicComponents(
  category?: 'data_collection',
  subcategory?: 'analytics' | 'warehouse' | 'attribution' | 'conversion api'
): Promise<ComponentListResponse> {
  return makeEdgeeApiRequest<ComponentListResponse>('/v1/components', {
    params: { category, subcategory },
  });
}

/**
 * List all components for an organization
 */
export async function listOrganizationComponents(
  id: string,
  category?: 'data_collection',
  subcategory?: 'analytics' | 'warehouse' | 'attribution' | 'conversion api'
): Promise<ComponentListResponse> {
  return makeEdgeeApiRequest<ComponentListResponse>(`/v1/organizations/${id}/components`, {
    params: { category, subcategory },
  });
}

/**
 * Get a component by UUID
 */
export async function getComponentByUuid(id: string): Promise<Component> {
  return makeEdgeeApiRequest<Component>(`/v1/components/${id}`);
}

/**
 * Get a component by slug
 */
export async function getComponentBySlug(orgSlug: string, componentSlug: string): Promise<Component> {
  return makeEdgeeApiRequest<Component>(`/v1/components/${orgSlug}/${componentSlug}`);
}

/**
 * Create a new component
 */
export async function createComponent(input: ComponentCreateInput): Promise<Component> {
  return makeEdgeeApiRequest<Component>('/v1/components', {
    method: 'POST',
    body: input,
  });
}

/**
 * Update a component by UUID
 */
export async function updateComponentByUuid(id: string, input: ComponentUpdateParams): Promise<Component> {
  return makeEdgeeApiRequest<Component>(`/v1/components/${id}`, {
    method: 'PUT',
    body: input,
  });
}

/**
 * Update a component by slug
 */
export async function updateComponentBySlug(
  orgSlug: string,
  componentSlug: string,
  input: ComponentUpdateParams
): Promise<Component> {
  return makeEdgeeApiRequest<Component>(`/v1/components/${orgSlug}/${componentSlug}`, {
    method: 'PUT',
    body: input,
  });
}

/**
 * Delete a component by UUID
 */
export async function deleteComponentByUuid(id: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/components/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Delete a component by slug
 */
export async function deleteComponentBySlug(orgSlug: string, componentSlug: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/components/${orgSlug}/${componentSlug}`, {
    method: 'DELETE',
  });
}

/**
 * Create a component version by UUID
 */
export async function createComponentVersionByUuid(
  id: string,
  input: ComponentVersionCreateInput
): Promise<ComponentVersion> {
  return makeEdgeeApiRequest<ComponentVersion>(`/v1/components/${id}/versions`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Create a component version by slug
 */
export async function createComponentVersionBySlug(
  orgSlug: string,
  componentSlug: string,
  input: ComponentVersionCreateInput
): Promise<ComponentVersion> {
  return makeEdgeeApiRequest<ComponentVersion>(`/v1/components/${orgSlug}/${componentSlug}/versions`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Update a component version by slug
 */
export async function updateComponentVersionBySlug(
  orgSlug: string,
  componentSlug: string,
  versionId: string,
  input: ComponentVersionUpdateInput
): Promise<ComponentVersion> {
  return makeEdgeeApiRequest<ComponentVersion>(`/v1/components/${orgSlug}/${componentSlug}/versions/${versionId}`, {
    method: 'PUT',
    body: input,
  });
}
