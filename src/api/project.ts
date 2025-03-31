import { makeEdgeeApiRequest } from './client.js';
import {
  Project,
  ProjectListResponse,
  ProjectCreateInput,
  ProjectUpdateInput,
  DeletedResponse,
  ListParams,
  Domain,
  DomainListResponse,
  DomainCreateInput,
  DomainUpdateInput,
  ProxySettings,
  ProxySettingsListResponse,
  ProxySettingsCreateInput,
  ProxySettingsUpdateInput,
  ProjectComponent,
  ProjectComponentListResponse,
  ProjectCounters,
  ProjectComponentCounters,
  IncomingDataCollectionEventListResponse,
  OutgoingDataCollectionEventListResponse,
} from '../types/index.js';

/**
 * List all projects
 */
export async function listProjects(params?: ListParams & { organization_id?: string }): Promise<ProjectListResponse> {
  return makeEdgeeApiRequest<ProjectListResponse>('/v1/projects', {
    params,
  });
}

/**
 * Get a project by ID
 */
export async function getProject(id: string, organizationId?: string): Promise<Project> {
  return makeEdgeeApiRequest<Project>(`/v1/projects/${id}`, {
    params: { organization_id: organizationId },
  });
}

/**
 * Create a new project
 */
export async function createProject(input: ProjectCreateInput): Promise<Project> {
  return makeEdgeeApiRequest<Project>('/v1/projects', {
    method: 'POST',
    body: input,
  });
}

/**
 * Update a project
 */
export async function updateProject(id: string, input: ProjectUpdateInput): Promise<Project> {
  return makeEdgeeApiRequest<Project>(`/v1/projects/${id}`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/projects/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get project counters
 */
export async function getProjectCounters(id: string, month?: string, day?: string): Promise<ProjectCounters> {
  return makeEdgeeApiRequest<ProjectCounters>(`/v1/projects/${id}/counters`, {
    params: { month, day },
  });
}

/**
 * Get project component counters
 */
export async function getProjectComponentCounters(
  id: string,
  componentId: string,
  month?: string,
  day?: string
): Promise<ProjectComponentCounters> {
  return makeEdgeeApiRequest<ProjectComponentCounters>(`/v1/projects/${id}/components/${componentId}/counters`, {
    params: { month, day },
  });
}

// Domain API

/**
 * List all domains for a project
 */
export async function listProjectDomains(id: string): Promise<DomainListResponse> {
  return makeEdgeeApiRequest<DomainListResponse>(`/v1/projects/${id}/domains`);
}

/**
 * Get a domain for a project
 */
export async function getProjectDomain(id: string, name: string): Promise<Domain> {
  return makeEdgeeApiRequest<Domain>(`/v1/projects/${id}/domains/${name}`);
}

/**
 * Create a new domain for a project
 */
export async function createProjectDomain(id: string, input: DomainCreateInput): Promise<Domain> {
  return makeEdgeeApiRequest<Domain>(`/v1/projects/${id}/domains`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Update a domain for a project
 */
export async function updateProjectDomain(id: string, name: string, input: DomainUpdateInput): Promise<Domain> {
  return makeEdgeeApiRequest<Domain>(`/v1/projects/${id}/domains/${name}`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete a domain for a project
 */
export async function deleteProjectDomain(id: string, name: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/projects/${id}/domains/${name}`, {
    method: 'DELETE',
  });
}

// Proxy Settings API

/**
 * List all proxy settings for a project
 */
export async function listProjectProxySettings(id: string): Promise<ProxySettingsListResponse> {
  return makeEdgeeApiRequest<ProxySettingsListResponse>(`/v1/projects/${id}/proxy-settings`);
}

/**
 * Create new proxy settings for a project
 */
export async function createProjectProxySettings(id: string, input: ProxySettingsCreateInput): Promise<ProxySettings> {
  return makeEdgeeApiRequest<ProxySettings>(`/v1/projects/${id}/proxy-settings`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Update proxy settings for a project
 */
export async function updateProjectProxySettings(
  id: string,
  revision: string,
  input: ProxySettingsUpdateInput
): Promise<ProxySettings> {
  return makeEdgeeApiRequest<ProxySettings>(`/v1/projects/${id}/proxy-settings/${revision}`, {
    method: 'POST',
    body: input,
  });
}

// Project Components API

/**
 * List all components for a project
 */
export async function listProjectComponents(
  id: string,
  category?: string,
  subcategory?: string
): Promise<ProjectComponentListResponse> {
  return makeEdgeeApiRequest<ProjectComponentListResponse>(`/v1/projects/${id}/components`, {
    params: { category, subcategory },
  });
}

/**
 * Get a component for a project
 */
export async function getProjectComponent(id: string, componentId: string): Promise<ProjectComponent> {
  return makeEdgeeApiRequest<ProjectComponent>(`/v1/projects/${id}/components/${componentId}`);
}

/**
 * Create a new component for a project
 */
export async function createProjectComponent(id: string, input: ProjectComponent): Promise<ProjectComponent> {
  return makeEdgeeApiRequest<ProjectComponent>(`/v1/projects/${id}/components`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Update a component for a project
 */
export async function updateProjectComponent(
  id: string,
  componentId: string,
  input: ProjectComponent
): Promise<ProjectComponent> {
  return makeEdgeeApiRequest<ProjectComponent>(`/v1/projects/${id}/components/${componentId}`, {
    method: 'POST',
    body: input,
  });
}

/**
 * Delete a component from a project
 */
export async function deleteProjectComponent(id: string, componentId: string): Promise<DeletedResponse> {
  return makeEdgeeApiRequest<DeletedResponse>(`/v1/projects/${id}/components/${componentId}`, {
    method: 'DELETE',
  });
}

// Debug Data Collection API

/**
 * Get incoming data collection events for a project
 */
export async function getIncomingDataCollectionEvents(
  id: string,
  params?: ListParams
): Promise<IncomingDataCollectionEventListResponse> {
  return makeEdgeeApiRequest<IncomingDataCollectionEventListResponse>(
    `/v1/projects/${id}/debug/data-collection/incoming`,
    { params }
  );
}

/**
 * Get outgoing data collection events for a project
 */
export async function getOutgoingDataCollectionEvents(
  id: string,
  eventId: string,
  params?: ListParams
): Promise<OutgoingDataCollectionEventListResponse> {
  return makeEdgeeApiRequest<OutgoingDataCollectionEventListResponse>(
    `/v1/projects/${id}/debug/data-collection/outgoing/${eventId}`,
    { params }
  );
}
