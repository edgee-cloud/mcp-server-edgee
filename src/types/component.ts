import { ListResponse } from './common.js';

export interface ConfigurationField {
  name: string;
  title: string;
  type: 'string' | 'bool' | 'number';
  required: boolean;
  description?: string;
}

export interface ComponentVersion {
  object: string;
  version: string;
  wit_world_version: string;
  wasm_url: string;
  dynamic_fields: ConfigurationField[];
  changelog?: string;
  created_at: string;
}

export interface Component {
  object: string;
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  category: string;
  subcategory: string;
  description?: string;
  latest_version?: string;
  versions: Record<string, ComponentVersion>;
  repo_link?: string;
  documentation_link?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  is_archived: boolean;
}

export interface ComponentListResponse extends ListResponse {
  data: Component[];
}

export interface ComponentCreateInput {
  name: string;
  slug: string;
  category: 'data_collection' | 'consent_management';
  subcategory: 'analytics' | 'warehouse' | 'attribution' | 'conversion api' | 'consent_mapping';
  documentation_link?: string;
  repo_link?: string;
  description?: string;
  avatar_url?: string;
  public?: boolean;
  organization_id: string;
}

export interface ComponentUpdateParams {
  documentation_link?: string;
  repo_link?: string;
  name?: string;
  description?: string;
  is_archived?: boolean;
  public?: boolean;
  avatar_url?: string;
}

export interface ComponentVersionCreateInput {
  version: string;
  wit_version: string;
  wasm_url: string;
  dynamic_fields?: ConfigurationField[];
  changelog?: string;
}

export interface ComponentVersionUpdateInput {
  changelog?: string;
}

export interface ProjectComponent {
  object: string;
  id: string;
  component_id: string;
  component_slug: string;
  component_version: string;
  category: string;
  subcategory: string;
  active: boolean;
  settings?: Record<string, any>;
}

export interface ProjectComponentListResponse extends ListResponse {
  data: ProjectComponent[];
}
