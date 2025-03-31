import { ListResponse } from './common.js';

export interface IncomingDataCollectionEvent {
  object: string;
  uuid: string;
  timestamp: string;
  type: 'page' | 'track' | 'user';
  from: 'edge' | 'client' | 'third';
  data: Record<string, any>;
  context: Record<string, any>;
}

export interface IncomingDataCollectionEventListResponse extends ListResponse {
  data: IncomingDataCollectionEvent[];
}

export interface OutgoingDataCollectionEvent {
  object: string;
  uuid: string;
  component_id: string;
  component_slug: string;
  component_request: Record<string, any>;
  component_response: Record<string, any>;
}

export interface OutgoingDataCollectionEventListResponse extends ListResponse {
  data: OutgoingDataCollectionEvent[];
}
