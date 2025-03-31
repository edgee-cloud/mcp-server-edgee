import { ErrorResponse } from '../types/index.js';

const EDGEE_API_BASE = 'https://api.edgee.app';
const USER_AGENT = 'edgee-mcp/1.0';

/**
 * Error thrown when an API request fails
 */
export class EdgeeApiError extends Error {
  status: number;
  errorResponse?: ErrorResponse;

  constructor(message: string, status: number, errorResponse?: ErrorResponse) {
    super(message);
    this.name = 'EdgeeApiError';
    this.status = status;
    this.errorResponse = errorResponse;
  }
}

/**
 * Options for making API requests
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any> | any;
  body?: any;
}

/**
 * Makes a request to the Edgee API
 *
 * @param path The API path (without the base URL)
 * @param options Request options
 * @returns The response data
 * @throws EdgeeApiError if the request fails
 */
export async function makeEdgeeApiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = process.env.EDGEE_TOKEN;
  if (!token) {
    throw new Error('EDGEE_TOKEN environment variable is required');
  }

  const { method = 'GET', params, body } = options;

  // Build URL with query parameters
  let url = `${EDGEE_API_BASE}${path}`;
  if (params) {
    const queryParams = new URLSearchParams();
    // Convert params to a flat object if it's not already
    const flatParams = params as Record<string, any>;
    for (const [key, value] of Object.entries(flatParams)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Add body if provided
  if (body) {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Content-Type': 'application/json',
    };
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);

    // Handle non-OK responses
    if (!response.ok) {
      let errorResponse: ErrorResponse | undefined;
      try {
        errorResponse = (await response.json()) as ErrorResponse;
      } catch (e) {
        // Ignore JSON parsing errors for error responses
      }

      throw new EdgeeApiError(`HTTP error! status: ${response.status}`, response.status, errorResponse);
    }

    // Parse and return the response
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof EdgeeApiError) {
      throw error;
    }

    // Handle other errors (network, etc.)
    console.error('Error making Edgee API request:', error);
    throw new EdgeeApiError(error instanceof Error ? error.message : 'Unknown error', 0);
  }
}
