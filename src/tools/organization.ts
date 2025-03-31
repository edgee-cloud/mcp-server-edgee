import { z } from 'zod';
import * as api from '../api/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register organization-related tools with the MCP server
 */
export function registerOrganizationTools(server: McpServer): void {
  // List Organizations
  server.tool(
    'edgee-listOrganizations',
    'Returns a list of your Organizations. The Organizations are returned sorted by creation date, with the most recent Organizations appearing first.',
    {
      limit: z.number().optional(),
      name: z.string().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ limit, name, start_key, order_direction }) => {
      try {
        const data = await api.listOrganizations({
          limit,
          name,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve organizations.',
              },
            ],
          };
        }

        const organizations = data.data;

        // Format organizations
        const formattedOrganizations = organizations.map((organization) =>
          [
            `${organization.name || 'Unknown'}:`,
            `ID: ${organization.id}`,
            `Slug: ${organization.slug || 'Unknown'}`,
            `Type: ${organization.type || 'Unknown'}`,
            `Current billing plan: ${organization.current_billing_plan || 'Unknown'}`,
            `Created at: ${organization.created_at || 'Unknown'}`,
            `Updated at: ${organization.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const organizationsText = `Organizations:\n\n${formattedOrganizations.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: organizationsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listOrganizations:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving organizations: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get My Organization
  server.tool('edgee-getMyOrganization', 'Retrieve your personal organization.', {}, async () => {
    try {
      const organization = await api.getMyOrganization();

      if (!organization) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve your organization.',
            },
          ],
        };
      }

      const organizationText = [
        `Organization: ${organization.name || 'Unknown'}`,
        `ID: ${organization.id}`,
        `Slug: ${organization.slug || 'Unknown'}`,
        `Type: ${organization.type || 'Unknown'}`,
        `Current billing plan: ${organization.current_billing_plan || 'Unknown'}`,
        `Created at: ${organization.created_at || 'Unknown'}`,
        `Updated at: ${organization.updated_at || 'Unknown'}`,
      ].join('\n');

      return {
        content: [
          {
            type: 'text',
            text: organizationText,
          },
        ],
      };
    } catch (error) {
      console.error('Error in edgee-getMyOrganization:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving your organization: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Get Organization
  server.tool(
    'edgee-getOrganization',
    'Retrieve an Organization by ID.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const organization = await api.getOrganization(id);

        if (!organization) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve organization with ID: ${id}`,
              },
            ],
          };
        }

        const organizationText = [
          `Organization: ${organization.name || 'Unknown'}`,
          `ID: ${organization.id}`,
          `Slug: ${organization.slug || 'Unknown'}`,
          `Type: ${organization.type || 'Unknown'}`,
          `Current billing plan: ${organization.current_billing_plan || 'Unknown'}`,
          `Created at: ${organization.created_at || 'Unknown'}`,
          `Updated at: ${organization.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: organizationText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getOrganization:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving organization: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Organization
  server.tool(
    'edgee-createOrganization',
    'Create a new Organization.',
    {
      name: z.string(),
      slug: z.string(),
    },
    async ({ name, slug }) => {
      try {
        const organization = await api.createOrganization({
          name,
          slug,
        });

        if (!organization) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to create organization.',
              },
            ],
          };
        }

        const organizationText = [
          'Organization created successfully:',
          `Name: ${organization.name || 'Unknown'}`,
          `ID: ${organization.id}`,
          `Slug: ${organization.slug || 'Unknown'}`,
          `Type: ${organization.type || 'Unknown'}`,
          `Current billing plan: ${organization.current_billing_plan || 'Unknown'}`,
          `Created at: ${organization.created_at || 'Unknown'}`,
          `Updated at: ${organization.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: organizationText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createOrganization:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating organization: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Organization
  server.tool(
    'edgee-updateOrganization',
    'Update an existing Organization.',
    {
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
    },
    async ({ id, name, slug }) => {
      try {
        const organization = await api.updateOrganization(id, {
          id,
          name,
          slug,
        });

        if (!organization) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update organization with ID: ${id}`,
              },
            ],
          };
        }

        const organizationText = [
          'Organization updated successfully:',
          `Name: ${organization.name || 'Unknown'}`,
          `ID: ${organization.id}`,
          `Slug: ${organization.slug || 'Unknown'}`,
          `Type: ${organization.type || 'Unknown'}`,
          `Current billing plan: ${organization.current_billing_plan || 'Unknown'}`,
          `Created at: ${organization.created_at || 'Unknown'}`,
          `Updated at: ${organization.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: organizationText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateOrganization:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating organization: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Organization
  server.tool(
    'edgee-deleteOrganization',
    'Delete an existing Organization.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const result = await api.deleteOrganization(id);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete organization with ID: ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Organization with ID ${id} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteOrganization:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting organization: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List Organization Users
  server.tool(
    'edgee-listOrganizationUsers',
    'List all users of an organization.',
    {
      id: z.string(),
      role: z.enum(['admin', 'editor', 'member']),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ id, role, limit, start_key, order_direction }) => {
      try {
        const data = await api.listOrganizationUsers(id, {
          role,
          limit,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve users for organization with ID: ${id}`,
              },
            ],
          };
        }

        const users = data.data;

        // Format users
        const formattedUsers = users.map((user) =>
          [
            `${user.name || 'Unknown'}:`,
            `ID: ${user.id}`,
            `Email: ${user.email || 'Unknown'}`,
            `Role: ${user.role || 'Unknown'}`,
            `Created at: ${user.created_at || 'Unknown'}`,
            `Updated at: ${user.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const usersText = `Users for organization ${id}:\n\n${formattedUsers.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: usersText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listOrganizationUsers:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving organization users: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
