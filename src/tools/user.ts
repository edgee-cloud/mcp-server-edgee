import { z } from 'zod';
import * as api from '../api/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register user-related tools with the MCP server
 */
export function registerUserTools(server: McpServer): void {
  // Get Current User
  server.tool('edgee-getMe', 'Get the current user.', {}, async () => {
    try {
      const user = await api.getMe();

      if (!user) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve current user.',
            },
          ],
        };
      }

      // Format user roles
      let rolesText = '';
      if (user.roles && Object.keys(user.roles).length > 0) {
        const formattedRoles = Object.entries(user.roles).map(([orgId, role]) => `Organization ${orgId}: ${role}`);
        rolesText = `\nRoles:\n  ${formattedRoles.join('\n  ')}`;
      }

      const userText = [
        `User: ${user.name || 'Unknown'}`,
        `ID: ${user.id}`,
        `Email: ${user.email || 'Unknown'}`,
        `Avatar URL: ${user.avatar_url || 'None'}`,
        `Created at: ${user.created_at || 'Unknown'}`,
        `Updated at: ${user.updated_at || 'Unknown'}`,
        rolesText,
      ].join('\n');

      return {
        content: [
          {
            type: 'text',
            text: userText,
          },
        ],
      };
    } catch (error) {
      console.error('Error in edgee-getMe:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving current user: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Get User
  server.tool(
    'edgee-getUser',
    'Get a user by ID.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const user = await api.getUser(id);

        if (!user) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve user with ID: ${id}`,
              },
            ],
          };
        }

        // Format user roles
        let rolesText = '';
        if (user.roles && Object.keys(user.roles).length > 0) {
          const formattedRoles = Object.entries(user.roles).map(([orgId, role]) => `Organization ${orgId}: ${role}`);
          rolesText = `\nRoles:\n  ${formattedRoles.join('\n  ')}`;
        }

        const userText = [
          `User: ${user.name || 'Unknown'}`,
          `ID: ${user.id}`,
          `Email: ${user.email || 'Unknown'}`,
          `Avatar URL: ${user.avatar_url || 'None'}`,
          `Created at: ${user.created_at || 'Unknown'}`,
          `Updated at: ${user.updated_at || 'Unknown'}`,
          rolesText,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: userText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getUser:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving user: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update User
  server.tool(
    'edgee-updateUser',
    'Update a user by ID.',
    {
      id: z.string(),
      avatar_url: z.string().optional(),
      terms_version: z.string().optional(),
      privacy_version: z.string().optional(),
    },
    async ({ id, avatar_url, terms_version, privacy_version }) => {
      try {
        const user = await api.updateUser(id, {
          avatar_url,
          terms_version,
          privacy_version,
        });

        if (!user) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update user with ID: ${id}`,
              },
            ],
          };
        }

        // Format user roles
        let rolesText = '';
        if (user.roles && Object.keys(user.roles).length > 0) {
          const formattedRoles = Object.entries(user.roles).map(([orgId, role]) => `Organization ${orgId}: ${role}`);
          rolesText = `\nRoles:\n  ${formattedRoles.join('\n  ')}`;
        }

        const userText = [
          `User updated successfully:`,
          `Name: ${user.name || 'Unknown'}`,
          `ID: ${user.id}`,
          `Email: ${user.email || 'Unknown'}`,
          `Avatar URL: ${user.avatar_url || 'None'}`,
          `Created at: ${user.created_at || 'Unknown'}`,
          `Updated at: ${user.updated_at || 'Unknown'}`,
          rolesText,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: userText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateUser:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating user: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List Invitations
  server.tool(
    'edgee-listInvitations',
    'List all invitations.',
    {
      organization_id: z.string().optional(),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ organization_id, limit, start_key, order_direction }) => {
      try {
        const data = await api.listInvitations({
          organization_id,
          limit,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve invitations.',
              },
            ],
          };
        }

        const invitations = data.data;

        // Format invitations
        const formattedInvitations = invitations.map((invitation) =>
          [
            `Email: ${invitation.email || 'Unknown'}`,
            `ID: ${invitation.id}`,
            `Organization ID: ${invitation.organization_id || 'Unknown'}`,
            `Role: ${invitation.role || 'Unknown'}`,
            `Created at: ${invitation.created_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const invitationsText = `Invitations:\n\n${formattedInvitations.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: invitationsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listInvitations:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving invitations: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Invitation
  server.tool(
    'edgee-createInvitation',
    'Create a new invitation.',
    {
      organization_id: z.string(),
      email: z.string().email(),
      role: z.enum(['admin', 'member']),
    },
    async ({ organization_id, email, role }) => {
      try {
        const invitation = await api.createInvitation({
          organization_id,
          email,
          role,
        });

        if (!invitation) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to create invitation.',
              },
            ],
          };
        }

        const invitationText = [
          'Invitation created successfully:',
          `Email: ${invitation.email || 'Unknown'}`,
          `ID: ${invitation.id}`,
          `Organization ID: ${invitation.organization_id || 'Unknown'}`,
          `Role: ${invitation.role || 'Unknown'}`,
          `Created at: ${invitation.created_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: invitationText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createInvitation:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating invitation: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Invitation
  server.tool(
    'edgee-deleteInvitation',
    'Delete an invitation.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const result = await api.deleteInvitation(id);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete invitation with ID: ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Invitation with ID ${id} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteInvitation:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting invitation: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List API Tokens
  server.tool(
    'edgee-listApiTokens',
    'List all API tokens.',
    {
      name: z.string().optional(),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ name, limit, start_key, order_direction }) => {
      try {
        const data = await api.listApiTokens({
          name,
          limit,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve API tokens.',
              },
            ],
          };
        }

        const tokens = data.data;

        // Format tokens
        const formattedTokens = tokens.map((token) =>
          [
            `${token.name || 'Unknown'}:`,
            `ID: ${token.id}`,
            `User ID: ${token.user_id || 'Unknown'}`,
            `From Browser: ${token.from_browser ? 'Yes' : 'No'}`,
            `Last Used At: ${token.last_used_at || 'Never'}`,
            `Expires At: ${token.expires_at || 'Never'}`,
            `Created at: ${token.created_at || 'Unknown'}`,
            `Updated at: ${token.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const tokensText = `API Tokens:\n\n${formattedTokens.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: tokensText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listApiTokens:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving API tokens: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create API Token
  server.tool(
    'edgee-createApiToken',
    'Create a new API token.',
    {
      name: z.string(),
      expires_at: z.string().optional(),
    },
    async ({ name, expires_at }) => {
      try {
        const token = await api.createApiToken({
          name,
          expires_at,
        });

        if (!token) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to create API token.',
              },
            ],
          };
        }

        const tokenText = [
          'API Token created successfully:',
          `Name: ${token.name || 'Unknown'}`,
          `ID: ${token.id}`,
          `User ID: ${token.user_id || 'Unknown'}`,
          `From Browser: ${token.from_browser ? 'Yes' : 'No'}`,
          `Expires At: ${token.expires_at || 'Never'}`,
          `Created at: ${token.created_at || 'Unknown'}`,
          `Updated at: ${token.updated_at || 'Unknown'}`,
          token.token ? `Token: ${token.token}` : 'Token: Not available (only shown once at creation)',
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: tokenText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createApiToken:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating API token: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete API Token
  server.tool(
    'edgee-deleteApiToken',
    'Delete an API token.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const result = await api.deleteApiToken(id);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete API token with ID: ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `API token with ID ${id} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteApiToken:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting API token: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Upload Presigned URL
  server.tool('edgee-getUploadPresignedUrl', 'Get a presigned URL for uploading files.', {}, async () => {
    try {
      const result = await api.getUploadPresignedUrl();

      if (!result || !result.upload_url) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to get upload presigned URL.',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Upload Presigned URL: ${result.upload_url}`,
          },
        ],
      };
    } catch (error) {
      console.error('Error in edgee-getUploadPresignedUrl:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting upload presigned URL: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });
}
