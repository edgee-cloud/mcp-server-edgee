import { z } from 'zod';
import * as api from '../api/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register component-related tools with the MCP server
 */
export function registerComponentTools(server: McpServer): void {
  // List Public Components
  server.tool(
    'edgee-listPublicComponents',
    'List all public components.',
    {
      category: z.enum(['data_collection']).optional(),
      subcategory: z.enum(['analytics', 'warehouse', 'attribution', 'conversion api']).optional(),
    },
    async ({ category, subcategory }) => {
      try {
        const data = await api.listPublicComponents(category, subcategory);

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve public components.',
              },
            ],
          };
        }

        const components = data.data;

        // Format components
        const formattedComponents = components.map((component) =>
          [
            `${component.name || 'Unknown'}:`,
            `ID: ${component.id}`,
            `Slug: ${component.slug || 'Unknown'}`,
            `Category: ${component.category || 'Unknown'}`,
            `Subcategory: ${component.subcategory || 'Unknown'}`,
            `Description: ${component.description || 'None'}`,
            `Latest Version: ${component.latest_version || 'None'}`,
            `Public: ${component.is_public ? 'Yes' : 'No'}`,
            `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
            `Created at: ${component.created_at || 'Unknown'}`,
            `Updated at: ${component.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const componentsText = `Public Components:\n\n${formattedComponents.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: componentsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listPublicComponents:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving public components: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List Organization Components
  server.tool(
    'edgee-listOrganizationComponents',
    'List all components for an organization.',
    {
      id: z.string(),
      category: z.enum(['data_collection']).optional(),
      subcategory: z.enum(['analytics', 'warehouse', 'attribution', 'conversion api']).optional(),
    },
    async ({ id, category, subcategory }) => {
      try {
        const data = await api.listOrganizationComponents(id, category, subcategory);

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve components for organization with ID: ${id}`,
              },
            ],
          };
        }

        const components = data.data;

        // Format components
        const formattedComponents = components.map((component) =>
          [
            `${component.name || 'Unknown'}:`,
            `ID: ${component.id}`,
            `Slug: ${component.slug || 'Unknown'}`,
            `Category: ${component.category || 'Unknown'}`,
            `Subcategory: ${component.subcategory || 'Unknown'}`,
            `Description: ${component.description || 'None'}`,
            `Latest Version: ${component.latest_version || 'None'}`,
            `Public: ${component.is_public ? 'Yes' : 'No'}`,
            `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
            `Created at: ${component.created_at || 'Unknown'}`,
            `Updated at: ${component.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const componentsText = `Components for organization ${id}:\n\n${formattedComponents.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: componentsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listOrganizationComponents:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving organization components: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Component by UUID
  server.tool(
    'edgee-getComponentByUuid',
    'Get a component by UUID.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const component = await api.getComponentByUuid(id);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve component with ID: ${id}`,
              },
            ],
          };
        }

        // Format component versions
        let versionsText = '';
        if (component.versions && Object.keys(component.versions).length > 0) {
          const formattedVersions = Object.entries(component.versions).map(([version, versionData]) =>
            [
              `Version: ${version}`,
              `WIT World Version: ${versionData.wit_world_version || 'Unknown'}`,
              `WASM URL: ${versionData.wasm_url || 'Unknown'}`,
              `Created at: ${versionData.created_at || 'Unknown'}`,
              `Changelog: ${versionData.changelog || 'None'}`,
              `Dynamic Fields: ${versionData.dynamic_fields ? JSON.stringify(versionData.dynamic_fields, null, 2) : 'None'}`,
            ].join('\n  ')
          );
          versionsText = `\nVersions:\n  ${formattedVersions.join('\n  ---\n  ')}`;
        }

        const componentText = [
          `Component: ${component.name || 'Unknown'}`,
          `ID: ${component.id}`,
          `Slug: ${component.slug || 'Unknown'}`,
          `Category: ${component.category || 'Unknown'}`,
          `Subcategory: ${component.subcategory || 'Unknown'}`,
          `Description: ${component.description || 'None'}`,
          `Latest Version: ${component.latest_version || 'None'}`,
          `Repository Link: ${component.repo_link || 'None'}`,
          `Documentation Link: ${component.documentation_link || 'None'}`,
          `Public: ${component.is_public ? 'Yes' : 'No'}`,
          `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
          `Created at: ${component.created_at || 'Unknown'}`,
          `Updated at: ${component.updated_at || 'Unknown'}`,
          versionsText,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: componentText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getComponentByUuid:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Component by Slug
  server.tool(
    'edgee-getComponentBySlug',
    'Get a component by slug.',
    {
      orgSlug: z.string(),
      componentSlug: z.string(),
    },
    async ({ orgSlug, componentSlug }) => {
      try {
        const component = await api.getComponentBySlug(orgSlug, componentSlug);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve component with slug: ${orgSlug}/${componentSlug}`,
              },
            ],
          };
        }

        // Format component versions
        let versionsText = '';
        if (component.versions && Object.keys(component.versions).length > 0) {
          const formattedVersions = Object.entries(component.versions).map(([version, versionData]) =>
            [
              `Version: ${version}`,
              `WIT World Version: ${versionData.wit_world_version || 'Unknown'}`,
              `WASM URL: ${versionData.wasm_url || 'Unknown'}`,
              `Created at: ${versionData.created_at || 'Unknown'}`,
              `Changelog: ${versionData.changelog || 'None'}`,
              `Dynamic Fields: ${versionData.dynamic_fields ? JSON.stringify(versionData.dynamic_fields, null, 2) : 'None'}`,
            ].join('\n  ')
          );
          versionsText = `\nVersions:\n  ${formattedVersions.join('\n  ---\n  ')}`;
        }

        const componentText = [
          `Component: ${component.name || 'Unknown'}`,
          `ID: ${component.id}`,
          `Slug: ${component.slug || 'Unknown'}`,
          `Category: ${component.category || 'Unknown'}`,
          `Subcategory: ${component.subcategory || 'Unknown'}`,
          `Description: ${component.description || 'None'}`,
          `Latest Version: ${component.latest_version || 'None'}`,
          `Repository Link: ${component.repo_link || 'None'}`,
          `Documentation Link: ${component.documentation_link || 'None'}`,
          `Public: ${component.is_public ? 'Yes' : 'No'}`,
          `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
          `Created at: ${component.created_at || 'Unknown'}`,
          `Updated at: ${component.updated_at || 'Unknown'}`,
          versionsText,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: componentText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getComponentBySlug:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Component
  server.tool(
    'edgee-createComponent',
    'Create a new component.',
    {
      organization_id: z.string(),
      name: z.string(),
      slug: z.string(),
      category: z.enum(['data_collection']),
      subcategory: z.enum(['analytics', 'warehouse', 'attribution', 'conversion api']),
      description: z.string().optional(),
      documentation_link: z.string().optional(),
      repo_link: z.string().optional(),
      avatar_url: z.string().optional(),
      public: z.boolean().optional(),
    },
    async ({
      organization_id,
      name,
      slug,
      category,
      subcategory,
      description,
      documentation_link,
      repo_link,
      avatar_url,
      public: isPublic,
    }) => {
      try {
        const component = await api.createComponent({
          organization_id,
          name,
          slug,
          category,
          subcategory,
          description,
          documentation_link,
          repo_link,
          avatar_url,
          public: isPublic,
        });

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to create component.',
              },
            ],
          };
        }

        const componentText = [
          'Component created successfully:',
          `Name: ${component.name || 'Unknown'}`,
          `ID: ${component.id}`,
          `Slug: ${component.slug || 'Unknown'}`,
          `Category: ${component.category || 'Unknown'}`,
          `Subcategory: ${component.subcategory || 'Unknown'}`,
          `Description: ${component.description || 'None'}`,
          `Repository Link: ${component.repo_link || 'None'}`,
          `Documentation Link: ${component.documentation_link || 'None'}`,
          `Public: ${component.is_public ? 'Yes' : 'No'}`,
          `Created at: ${component.created_at || 'Unknown'}`,
          `Updated at: ${component.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: componentText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createComponent:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Component by UUID
  server.tool(
    'edgee-updateComponentByUuid',
    'Update a component by UUID.',
    {
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      documentation_link: z.string().optional(),
      repo_link: z.string().optional(),
      avatar_url: z.string().optional(),
      is_archived: z.boolean().optional(),
      public: z.boolean().optional(),
    },
    async ({ id, name, description, documentation_link, repo_link, avatar_url, is_archived, public: isPublic }) => {
      try {
        const component = await api.updateComponentByUuid(id, {
          name,
          description,
          documentation_link,
          repo_link,
          avatar_url,
          is_archived,
          public: isPublic,
        });

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update component with ID: ${id}`,
              },
            ],
          };
        }

        const componentText = [
          'Component updated successfully:',
          `Name: ${component.name || 'Unknown'}`,
          `ID: ${component.id}`,
          `Slug: ${component.slug || 'Unknown'}`,
          `Category: ${component.category || 'Unknown'}`,
          `Subcategory: ${component.subcategory || 'Unknown'}`,
          `Description: ${component.description || 'None'}`,
          `Repository Link: ${component.repo_link || 'None'}`,
          `Documentation Link: ${component.documentation_link || 'None'}`,
          `Public: ${component.is_public ? 'Yes' : 'No'}`,
          `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
          `Created at: ${component.created_at || 'Unknown'}`,
          `Updated at: ${component.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: componentText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateComponentByUuid:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Component by UUID
  server.tool(
    'edgee-deleteComponentByUuid',
    'Delete a component by UUID.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const result = await api.deleteComponentByUuid(id);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete component with ID: ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Component with ID ${id} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteComponentByUuid:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Component by Slug
  server.tool(
    'edgee-updateComponentBySlug',
    'Update a component by slug.',
    {
      orgSlug: z.string(),
      componentSlug: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      documentation_link: z.string().optional(),
      repo_link: z.string().optional(),
      avatar_url: z.string().optional(),
      is_archived: z.boolean().optional(),
      public: z.boolean().optional(),
    },
    async ({
      orgSlug,
      componentSlug,
      name,
      description,
      documentation_link,
      repo_link,
      avatar_url,
      is_archived,
      public: isPublic,
    }) => {
      try {
        const component = await api.updateComponentBySlug(orgSlug, componentSlug, {
          name,
          description,
          documentation_link,
          repo_link,
          avatar_url,
          is_archived,
          public: isPublic,
        });

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update component with slug: ${orgSlug}/${componentSlug}`,
              },
            ],
          };
        }

        const componentText = [
          'Component updated successfully:',
          `Name: ${component.name || 'Unknown'}`,
          `ID: ${component.id}`,
          `Slug: ${component.slug || 'Unknown'}`,
          `Category: ${component.category || 'Unknown'}`,
          `Subcategory: ${component.subcategory || 'Unknown'}`,
          `Description: ${component.description || 'None'}`,
          `Repository Link: ${component.repo_link || 'None'}`,
          `Documentation Link: ${component.documentation_link || 'None'}`,
          `Public: ${component.is_public ? 'Yes' : 'No'}`,
          `Archived: ${component.is_archived ? 'Yes' : 'No'}`,
          `Created at: ${component.created_at || 'Unknown'}`,
          `Updated at: ${component.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: componentText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateComponentBySlug:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Component by Slug
  server.tool(
    'edgee-deleteComponentBySlug',
    'Delete a component by slug.',
    {
      orgSlug: z.string(),
      componentSlug: z.string(),
    },
    async ({ orgSlug, componentSlug }) => {
      try {
        const result = await api.deleteComponentBySlug(orgSlug, componentSlug);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete component with slug: ${orgSlug}/${componentSlug}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Component ${orgSlug}/${componentSlug} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteComponentBySlug:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Component Version
  server.tool(
    'edgee-createComponentVersion',
    'Create a new component version.',
    {
      id: z.string(),
      version: z.string(),
      wit_version: z.string(),
      wasm_url: z.string(),
      changelog: z.string().optional(),
      dynamic_fields: z
        .array(
          z.object({
            name: z.string(),
            title: z.string(),
            type: z.enum(['string', 'bool', 'number']),
            required: z.boolean(),
            description: z.string().optional(),
          })
        )
        .optional(),
    },
    async ({ id, version, wit_version, wasm_url, changelog, dynamic_fields }) => {
      try {
        const componentVersion = await api.createComponentVersionByUuid(id, {
          version,
          wit_version,
          wasm_url,
          changelog,
          dynamic_fields,
        });

        if (!componentVersion) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to create version for component with ID: ${id}`,
              },
            ],
          };
        }

        const versionText = [
          'Component version created successfully:',
          `Version: ${componentVersion.version}`,
          `WIT World Version: ${componentVersion.wit_world_version || 'Unknown'}`,
          `WASM URL: ${componentVersion.wasm_url || 'Unknown'}`,
          `Created at: ${componentVersion.created_at || 'Unknown'}`,
          `Changelog: ${componentVersion.changelog || 'None'}`,
          `Dynamic Fields: ${componentVersion.dynamic_fields ? JSON.stringify(componentVersion.dynamic_fields, null, 2) : 'None'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: versionText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createComponentVersion:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating component version: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Component Version by Slug
  server.tool(
    'edgee-createComponentVersionBySlug',
    'Create a new component version by slug.',
    {
      orgSlug: z.string(),
      componentSlug: z.string(),
      version: z.string(),
      wit_version: z.string(),
      wasm_url: z.string(),
      changelog: z.string().optional(),
      dynamic_fields: z
        .array(
          z.object({
            name: z.string(),
            title: z.string(),
            type: z.enum(['string', 'bool', 'number']),
            required: z.boolean(),
            description: z.string().optional(),
          })
        )
        .optional(),
    },
    async ({ orgSlug, componentSlug, version, wit_version, wasm_url, changelog, dynamic_fields }) => {
      try {
        const componentVersion = await api.createComponentVersionBySlug(orgSlug, componentSlug, {
          version,
          wit_version,
          wasm_url,
          changelog,
          dynamic_fields,
        });

        if (!componentVersion) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to create version for component ${orgSlug}/${componentSlug}`,
              },
            ],
          };
        }

        const versionText = [
          'Component version created successfully:',
          `Version: ${componentVersion.version}`,
          `WIT World Version: ${componentVersion.wit_world_version || 'Unknown'}`,
          `WASM URL: ${componentVersion.wasm_url || 'Unknown'}`,
          `Created at: ${componentVersion.created_at || 'Unknown'}`,
          `Changelog: ${componentVersion.changelog || 'None'}`,
          `Dynamic Fields: ${componentVersion.dynamic_fields ? JSON.stringify(componentVersion.dynamic_fields, null, 2) : 'None'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: versionText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createComponentVersionBySlug:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating component version: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Component Version by Slug
  server.tool(
    'edgee-updateComponentVersionBySlug',
    'Update a component version by slug.',
    {
      orgSlug: z.string(),
      componentSlug: z.string(),
      versionId: z.string(),
      changelog: z.string().optional(),
    },
    async ({ orgSlug, componentSlug, versionId, changelog }) => {
      try {
        const componentVersion = await api.updateComponentVersionBySlug(orgSlug, componentSlug, versionId, {
          changelog,
        });

        if (!componentVersion) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update version ${versionId} for component ${orgSlug}/${componentSlug}`,
              },
            ],
          };
        }

        const versionText = [
          'Component version updated successfully:',
          `Version: ${componentVersion.version}`,
          `WIT World Version: ${componentVersion.wit_world_version || 'Unknown'}`,
          `WASM URL: ${componentVersion.wasm_url || 'Unknown'}`,
          `Created at: ${componentVersion.created_at || 'Unknown'}`,
          `Changelog: ${componentVersion.changelog || 'None'}`,
          `Dynamic Fields: ${componentVersion.dynamic_fields ? JSON.stringify(componentVersion.dynamic_fields, null, 2) : 'None'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: versionText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateComponentVersionBySlug:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating component version: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
