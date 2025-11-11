import { z } from 'zod';
import * as api from '../api/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register extended project-related tools with the MCP server
 * (Proxy Settings, Project Components, Component Counters, Debug)
 */
export function registerExtendedProjectTools(server: McpServer): void {
  // List Project Proxy Settings
  server.tool(
    'edgee-listProjectProxySettings',
    'List all proxy settings revisions for a project.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const data = await api.listProjectProxySettings(id);

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve proxy settings for project with ID: ${id}`,
              },
            ],
          };
        }

        const proxySettings = data.data;

        const formattedSettings = proxySettings.map((settings) =>
          [
            `Revision ${settings.revision}:`,
            `Description: ${settings.description || 'None'}`,
            `Active: ${settings.is_active ? 'Yes' : 'No'}`,
            `Backends: ${settings.backends ? settings.backends.length : 0}`,
            `Routes: ${settings.routes ? settings.routes.length : 0}`,
            '---',
          ].join('\n')
        );

        const settingsText = `Proxy Settings for project ${id}:\n\n${formattedSettings.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: settingsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listProjectProxySettings:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project proxy settings: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Project Proxy Settings
  server.tool(
    'edgee-createProjectProxySettings',
    'Create new proxy settings for a project.',
    {
      id: z.string(),
      description: z.string(),
      backends: z.array(z.any()),
      routes: z.array(z.any()).optional(),
    },
    async ({ id, description, backends, routes }) => {
      try {
        const settings = await api.createProjectProxySettings(id, {
          description,
          backends,
          routes,
        });

        if (!settings) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to create proxy settings for project ${id}`,
              },
            ],
          };
        }

        const settingsText = [
          'Proxy settings created successfully:',
          `Revision: ${settings.revision}`,
          `Description: ${settings.description || 'None'}`,
          `Active: ${settings.is_active ? 'Yes' : 'No'}`,
          `Backends: ${settings.backends ? settings.backends.length : 0}`,
          `Routes: ${settings.routes ? settings.routes.length : 0}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: settingsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createProjectProxySettings:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating project proxy settings: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Project Proxy Settings
  server.tool(
    'edgee-updateProjectProxySettings',
    'Update proxy settings for a project by revision.',
    {
      id: z.string(),
      revision: z.string(),
      description: z.string().optional(),
      is_active: z.boolean().optional(),
    },
    async ({ id, revision, description, is_active }) => {
      try {
        const settings = await api.updateProjectProxySettings(id, revision, {
          description,
          is_active,
        });

        if (!settings) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update proxy settings revision ${revision} for project ${id}`,
              },
            ],
          };
        }

        const settingsText = [
          'Proxy settings updated successfully:',
          `Revision: ${settings.revision}`,
          `Description: ${settings.description || 'None'}`,
          `Active: ${settings.is_active ? 'Yes' : 'No'}`,
          `Backends: ${settings.backends ? settings.backends.length : 0}`,
          `Routes: ${settings.routes ? settings.routes.length : 0}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: settingsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateProjectProxySettings:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating project proxy settings: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Project Component
  server.tool(
    'edgee-getProjectComponent',
    'Get a component for a project.',
    {
      id: z.string(),
      componentId: z.string(),
    },
    async ({ id, componentId }) => {
      try {
        const component = await api.getProjectComponent(id, componentId);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve component ${componentId} for project ${id}`,
              },
            ],
          };
        }

        const componentText = [
          `Component: ${component.component_slug || 'Unknown'}`,
          `ID: ${component.id}`,
          `Component ID: ${component.component_id}`,
          `Version: ${component.component_version}`,
          `Category: ${component.category}`,
          `Subcategory: ${component.subcategory}`,
          `Active: ${component.active ? 'Yes' : 'No'}`,
          `Settings: ${component.settings ? JSON.stringify(component.settings, null, 2) : 'None'}`,
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
        console.error('Error in edgee-getProjectComponent:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Project Component
  server.tool(
    'edgee-createProjectComponent',
    'Create a new component for a project.',
    {
      id: z.string(),
      component_id: z.string(),
      component_slug: z.string(),
      component_version: z.string(),
      category: z.string(),
      subcategory: z.string(),
      active: z.boolean().optional(),
      settings: z.any().optional(),
    },
    async ({ id, component_id, component_slug, component_version, category, subcategory, active, settings }) => {
      try {
        const component = await api.createProjectComponent(id, {
          component_id,
          component_slug,
          component_version,
          category,
          subcategory,
          active,
          settings,
        } as any);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to create component for project ${id}`,
              },
            ],
          };
        }

        const componentText = [
          'Component created successfully:',
          `Slug: ${component.component_slug || 'Unknown'}`,
          `ID: ${component.id}`,
          `Component ID: ${component.component_id}`,
          `Version: ${component.component_version}`,
          `Category: ${component.category}`,
          `Subcategory: ${component.subcategory}`,
          `Active: ${component.active ? 'Yes' : 'No'}`,
          `Settings: ${component.settings ? JSON.stringify(component.settings, null, 2) : 'None'}`,
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
        console.error('Error in edgee-createProjectComponent:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating project component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Project Component
  server.tool(
    'edgee-updateProjectComponent',
    'Update a component for a project.',
    {
      id: z.string(),
      componentId: z.string(),
      component_version: z.string().optional(),
      active: z.boolean().optional(),
      settings: z.any().optional(),
    },
    async ({ id, componentId, component_version, active, settings }) => {
      try {
        const component = await api.updateProjectComponent(id, componentId, {
          component_version,
          active,
          settings,
        } as any);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update component ${componentId} for project ${id}`,
              },
            ],
          };
        }

        const componentText = [
          'Component updated successfully:',
          `Slug: ${component.component_slug || 'Unknown'}`,
          `ID: ${component.id}`,
          `Component ID: ${component.component_id}`,
          `Version: ${component.component_version}`,
          `Category: ${component.category}`,
          `Subcategory: ${component.subcategory}`,
          `Active: ${component.active ? 'Yes' : 'No'}`,
          `Settings: ${component.settings ? JSON.stringify(component.settings, null, 2) : 'None'}`,
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
        console.error('Error in edgee-updateProjectComponent:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating project component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Project Component
  server.tool(
    'edgee-deleteProjectComponent',
    'Delete a component from a project.',
    {
      id: z.string(),
      componentId: z.string(),
    },
    async ({ id, componentId }) => {
      try {
        const result = await api.deleteProjectComponent(id, componentId);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete component ${componentId} from project ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Component ${componentId} was successfully deleted from project ${id}.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteProjectComponent:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting project component: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Project Component Counters
  server.tool(
    'edgee-getProjectComponentCounters',
    'Get counters for a project component.',
    {
      id: z.string(),
      componentId: z.string(),
      month: z.string().optional(),
      day: z.string().optional(),
    },
    async ({ id, componentId, month, day }) => {
      try {
        const counters = await api.getProjectComponentCounters(id, componentId, month, day);

        if (!counters) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve counters for component ${componentId} in project ${id}`,
              },
            ],
          };
        }

        const countersText = [
          `Component Counters for ${componentId}:`,
          `User Count: ${counters.user_count}`,
          `Track Count: ${counters.track_count}`,
          `Page Count: ${counters.page_count}`,
          month ? `Month: ${month}` : '',
          day ? `Day: ${day}` : '',
        ]
          .filter(Boolean)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: countersText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getProjectComponentCounters:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project component counters: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Incoming Data Collection Events
  server.tool(
    'edgee-getIncomingDataCollectionEvents',
    'Get incoming data collection events for a project.',
    {
      id: z.string(),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ id, limit, start_key, order_direction }) => {
      try {
        const data = await api.getIncomingDataCollectionEvents(id, {
          limit,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve incoming events for project ${id}`,
              },
            ],
          };
        }

        const events = data.data;

        const formattedEvents = events.map((event) =>
          [
            `Event ${event.uuid}:`,
            `Type: ${event.type}`,
            `From: ${event.from}`,
            `Timestamp: ${event.timestamp}`,
            `Data: ${JSON.stringify(event.data, null, 2)}`,
            '---',
          ].join('\n')
        );

        const eventsText = `Incoming Data Collection Events:\n\n${formattedEvents.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: eventsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getIncomingDataCollectionEvents:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving incoming data collection events: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Outgoing Data Collection Events
  server.tool(
    'edgee-getOutgoingDataCollectionEvents',
    'Get outgoing data collection events for a project.',
    {
      id: z.string(),
      eventId: z.string(),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ id, eventId, limit, start_key, order_direction }) => {
      try {
        const data = await api.getOutgoingDataCollectionEvents(id, eventId, {
          limit,
          start_key,
          order_direction,
        });

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve outgoing events for event ${eventId} in project ${id}`,
              },
            ],
          };
        }

        const events = data.data;

        const formattedEvents = events.map((event) =>
          [
            `Event ${event.uuid}:`,
            `Component: ${event.component_slug}`,
            `Component ID: ${event.component_id}`,
            `Request: ${JSON.stringify(event.component_request, null, 2)}`,
            `Response: ${JSON.stringify(event.component_response, null, 2)}`,
            '---',
          ].join('\n')
        );

        const eventsText = `Outgoing Data Collection Events:\n\n${formattedEvents.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: eventsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getOutgoingDataCollectionEvents:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving outgoing data collection events: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
