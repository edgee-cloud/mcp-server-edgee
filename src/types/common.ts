/**
 * Common types used across the Edgee API
 */

export interface ListResponse {
  object: string;
  url: string;
  has_more: boolean;
  last_key: string;
}

export interface DeletedResponse {
  object: string;
  id: string;
  deleted: boolean;
}

export interface ErrorResponse {
  error: {
    type:
      | 'invalid_request_error'
      | 'not_found_error'
      | 'creation_error'
      | 'update_error'
      | 'deletion_error'
      | 'forbidden_error'
      | 'authentication_error'
      | 'conflict_error';
    message: string;
    params?: Array<{
      param: string;
      message: string;
    }>;
  };
}

export interface ListParams {
  limit?: number;
  start_key?: string;
  order_direction?: 'ASC' | 'DESC';
}

export interface UploadPresign {
  upload_url: string;
}
