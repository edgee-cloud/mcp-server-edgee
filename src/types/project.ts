import { ListResponse } from './common.js';

export interface ProjectBase {
  object: string;
  id: string;
  organization_id: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  external_project_url?: string;
}

export interface KeyValueConditions {
  present?: string[];
  absent?: string[];
  values?: Record<string, any>;
}

export interface CacheRule {
  path: string;
  regex?: boolean;
  ttl?: number;
  swr?: number;
  pass?: boolean;
  rank?: number;
  conditions?: {
    request_cookies?: KeyValueConditions;
    request_headers?: KeyValueConditions;
    request_query_params?: KeyValueConditions;
    request_methods?: string[];
    response_status?: number[];
    response_headers?: KeyValueConditions;
  };
}

export interface ProjectFull {
  log_severity?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  edgee_behind_proxy_cache?: boolean;
  force_https?: boolean;
  cache?: boolean;
  override_cache?: CacheRule[];
  cookie_name?: string;
  cookie_domain?: string;
  proxy_only?: boolean;
  inject_sdk?: boolean;
  enforce_no_store_policy?: boolean;
  trusted_ips?: string[];
  password_protection?: boolean;
  blocked_ips?: string[];
  cookie_whitelist?: string[];
  forwarded_headers?: Array<{
    name: string;
    value: string;
  }>;
}

export interface Project extends ProjectBase, ProjectFull {}

export interface ProjectListResponse extends ListResponse {
  data: Project[];
}

export interface ProjectCreateInput {
  organization_id: string;
  slug: string;
  description?: string;
  external_project_url?: string;
}

export interface ProjectUpdateInput {
  id: string;
  slug?: string;
  description?: string;
  external_project_url?: string;
  log_severity?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  edgee_behind_proxy_cache?: boolean;
  force_https?: boolean;
  cache?: boolean;
  override_cache?: CacheRule[];
  cookie_name?: string;
  cookie_domain?: string;
  proxy_only?: boolean;
  inject_sdk?: boolean;
  enforce_no_store_policy?: boolean;
  trusted_ips?: string[];
  password_protection?: boolean;
  blocked_ips?: string[];
  cookie_whitelist?: string[];
  forwarded_headers?: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProjectCounters {
  object: string;
  request_count: number;
  event_count: number;
  month?: string;
  day?: string;
  project_id: string;
}

export interface ProjectComponentCounters {
  object: string;
  user_count: number;
  track_count: number;
  page_count: number;
  month?: string;
  day?: string;
  project_id: string;
  component_id: string;
}

export interface Domain {
  object: string;
  name: string;
  project_id: string;
  dns_status: boolean;
  ssl_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface DomainListResponse extends ListResponse {
  data: Domain[];
}

export interface DomainCreateInput {
  name: string;
}

export interface DomainUpdateInput {
  dns_status?: boolean;
  ssl_status?: boolean;
}

export interface ProxySettingsBackend {
  name: string;
  address: string;
  enable_ssl?: boolean;
  check_certificate?: string;
  ca_certificate?: string;
  sni_hostname?: string;
  default?: boolean;
  override_host?: string;
}

export interface ProxySettingsRoute {
  path: string;
  regex?: boolean;
  backend_name: string;
  rank: string;
  continent?: string[];
  region?: string[];
  country?: string[];
}

export interface ProxySettings {
  object: string;
  revision: number;
  description: string;
  is_active: boolean;
  backends: ProxySettingsBackend[];
  routes: ProxySettingsRoute[];
}

export interface ProxySettingsListResponse extends ListResponse {
  data: ProxySettings[];
}

export interface ProxySettingsCreateInput {
  description: string;
  backends: ProxySettingsBackend[];
  routes?: ProxySettingsRoute[];
}

export interface ProxySettingsUpdateInput {
  description?: string;
  is_active?: boolean;
}
