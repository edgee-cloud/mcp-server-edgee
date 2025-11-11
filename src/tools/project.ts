import { z } from 'zod';
import * as api from '../api/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register project-related tools with the MCP server
 */
export function registerProjectTools(server: McpServer): void {
  // List Projects
  server.tool(
    'edgee-listProjects',
    'Returns a list of your Projects. The Projects are returned sorted by creation date, with the most recent Projects appearing first.',
    {
      organization_id: z.string().optional(),
      limit: z.number().optional(),
      start_key: z.string().optional(),
      order_direction: z.enum(['ASC', 'DESC']).optional(),
    },
    async ({ organization_id, limit, start_key, order_direction }) => {
      try {
        const data = await api.listProjects({
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
                text: 'Failed to retrieve projects.',
              },
            ],
          };
        }

        const projects = data.data;

        // Format projects
        const formattedProjects = projects.map((project) =>
          [
            `${project.slug || 'Unknown'}:`,
            `ID: ${project.id}`,
            `Organization ID: ${project.organization_id || 'Unknown'}`,
            `Description: ${project.description || 'None'}`,
            `External URL: ${project.external_project_url || 'None'}`,
            `Created at: ${project.created_at || 'Unknown'}`,
            `Updated at: ${project.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const projectsText = `Projects:\n\n${formattedProjects.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: projectsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listProjects:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving projects: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Project
  server.tool(
    'edgee-getProject',
    'Retrieve a Project by ID.',
    {
      id: z.string(),
      organization_id: z.string().optional(),
    },
    async ({ id, organization_id }) => {
      try {
        const project = await api.getProject(id, organization_id);

        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve project with ID: ${id}`,
              },
            ],
          };
        }

        const projectText = [
          `Project: ${project.slug || 'Unknown'}`,
          `ID: ${project.id}`,
          `Organization ID: ${project.organization_id || 'Unknown'}`,
          `Description: ${project.description || 'None'}`,
          `External URL: ${project.external_project_url || 'None'}`,
          `Log Severity: ${project.log_severity || 'Default'}`,
          `Force HTTPS: ${project.force_https !== undefined ? project.force_https : 'Default'}`,
          `Cache Enabled: ${project.cache !== undefined ? project.cache : 'Default'}`,
          project.override_cache ? `Override Cache Rules: ${project.override_cache.length}` : '',
          `Cookie Name: ${project.cookie_name || 'Default'}`,
          `Cookie Domain: ${project.cookie_domain || 'None'}`,
          `Proxy Only: ${project.proxy_only !== undefined ? project.proxy_only : 'Default'}`,
          `Inject SDK: ${project.inject_sdk !== undefined ? project.inject_sdk : 'Default'}`,
          `Created at: ${project.created_at || 'Unknown'}`,
          `Updated at: ${project.updated_at || 'Unknown'}`,
        ].filter(Boolean).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: projectText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getProject:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Project
  server.tool(
    'edgee-createProject',
    'Create a new Project.',
    {
      organization_id: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      external_project_url: z.string().optional(),
    },
    async ({ organization_id, slug, description, external_project_url }) => {
      try {
        const project = await api.createProject({
          organization_id,
          slug,
          description,
          external_project_url,
        });

        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to create project.',
              },
            ],
          };
        }

        const projectText = [
          'Project created successfully:',
          `Slug: ${project.slug || 'Unknown'}`,
          `ID: ${project.id}`,
          `Organization ID: ${project.organization_id || 'Unknown'}`,
          `Description: ${project.description || 'None'}`,
          `External URL: ${project.external_project_url || 'None'}`,
          `Created at: ${project.created_at || 'Unknown'}`,
          `Updated at: ${project.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: projectText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createProject:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating project: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Project
  server.tool(
    'edgee-updateProject',
    'Update an existing Project.',
    {
      id: z.string(),
      slug: z.string().optional(),
      description: z.string().optional(),
      external_project_url: z.string().optional(),
      log_severity: z.enum(['DEBUG', 'INFO', 'WARNING', 'ERROR']).optional(),
      force_https: z.boolean().optional(),
      cache: z.boolean().optional(),
      override_cache: z.array(
        z.object({
          path: z.string(),
          regex: z.boolean().optional(),
          ttl: z.number().optional(),
          swr: z.number().optional(),
          pass: z.boolean().optional(),
          rank: z.number().optional(),
          conditions: z
            .object({
              request_cookies: z
                .object({
                  present: z.array(z.string()).optional(),
                  absent: z.array(z.string()).optional(),
                  values: z.record(z.any()).optional(),
                })
                .optional(),
              request_headers: z
                .object({
                  present: z.array(z.string()).optional(),
                  absent: z.array(z.string()).optional(),
                  values: z.record(z.any()).optional(),
                })
                .optional(),
              request_query_params: z
                .object({
                  present: z.array(z.string()).optional(),
                  absent: z.array(z.string()).optional(),
                  values: z.record(z.any()).optional(),
                })
                .optional(),
              request_methods: z.array(z.string()).optional(),
              response_status: z.array(z.number()).optional(),
              response_headers: z
                .object({
                  present: z.array(z.string()).optional(),
                  absent: z.array(z.string()).optional(),
                  values: z.record(z.any()).optional(),
                })
                .optional(),
            })
            .optional(),
        })
      ).optional(),
      cookie_name: z.string().optional(),
      cookie_domain: z.string().optional(),
      proxy_only: z.boolean().optional(),
      inject_sdk: z.boolean().optional(),
    },
    async ({ id, ...updateData }) => {
      try {
        const project = await api.updateProject(id, {
          id,
          ...updateData,
        });

        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update project with ID: ${id}`,
              },
            ],
          };
        }

        const projectText = [
          'Project updated successfully:',
          `Slug: ${project.slug || 'Unknown'}`,
          `ID: ${project.id}`,
          `Organization ID: ${project.organization_id || 'Unknown'}`,
          `Description: ${project.description || 'None'}`,
          `External URL: ${project.external_project_url || 'None'}`,
          `Log Severity: ${project.log_severity || 'Default'}`,
          `Force HTTPS: ${project.force_https !== undefined ? project.force_https : 'Default'}`,
          `Cache Enabled: ${project.cache !== undefined ? project.cache : 'Default'}`,
          project.override_cache ? `Override Cache Rules: ${project.override_cache.length}` : '',
          `Cookie Name: ${project.cookie_name || 'Default'}`,
          `Cookie Domain: ${project.cookie_domain || 'None'}`,
          `Proxy Only: ${project.proxy_only !== undefined ? project.proxy_only : 'Default'}`,
          `Inject SDK: ${project.inject_sdk !== undefined ? project.inject_sdk : 'Default'}`,
          `Created at: ${project.created_at || 'Unknown'}`,
          `Updated at: ${project.updated_at || 'Unknown'}`,
        ].filter(Boolean).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: projectText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateProject:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating project: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Project
  server.tool(
    'edgee-deleteProject',
    'Delete an existing Project.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const result = await api.deleteProject(id);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete project with ID: ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Project with ID ${id} was successfully deleted.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteProject:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting project: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Project Counters
  server.tool(
    'edgee-getProjectCounters',
    'Get statistics for a project.',
    {
      id: z.string(),
      month: z.string().optional(),
      day: z.string().optional(),
    },
    async ({ id, month, day }) => {
      try {
        const counters = await api.getProjectCounters(id, month, day);

        if (!counters) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve counters for project with ID: ${id}`,
              },
            ],
          };
        }

        const countersText = [
          `Project Counters for ${id}:`,
          `Request Count: ${counters.request_count}`,
          `Event Count: ${counters.event_count}`,
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
        console.error('Error in edgee-getProjectCounters:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project counters: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get Project Domain
  server.tool(
    'edgee-getProjectDomain',
    'Get a domain for a project.',
    {
      id: z.string(),
      name: z.string(),
    },
    async ({ id, name }) => {
      try {
        const domain = await api.getProjectDomain(id, name);

        if (!domain) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve domain ${name} for project ${id}`,
              },
            ],
          };
        }

        const domainText = [
          `Domain: ${domain.name || 'Unknown'}`,
          `Project ID: ${domain.project_id}`,
          `DNS Status: ${domain.dns_status ? 'Valid' : 'Invalid'}`,
          `SSL Status: ${domain.ssl_status ? 'Valid' : 'Invalid'}`,
          `Created at: ${domain.created_at || 'Unknown'}`,
          `Updated at: ${domain.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: domainText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-getProjectDomain:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project domain: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List Project Domains
  server.tool(
    'edgee-listProjectDomains',
    'List all domains for a project.',
    {
      id: z.string(),
    },
    async ({ id }) => {
      try {
        const data = await api.listProjectDomains(id);

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve domains for project with ID: ${id}`,
              },
            ],
          };
        }

        const domains = data.data;

        // Format domains
        const formattedDomains = domains.map((domain) =>
          [
            `${domain.name || 'Unknown'}:`,
            `Project ID: ${domain.project_id}`,
            `DNS Status: ${domain.dns_status ? 'Valid' : 'Invalid'}`,
            `SSL Status: ${domain.ssl_status ? 'Valid' : 'Invalid'}`,
            `Created at: ${domain.created_at || 'Unknown'}`,
            `Updated at: ${domain.updated_at || 'Unknown'}`,
            '---',
          ].join('\n')
        );

        const domainsText = `Domains for project ${id}:\n\n${formattedDomains.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: domainsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listProjectDomains:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project domains: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update Project Domain
  server.tool(
    'edgee-updateProjectDomain',
    'Update a domain for a project.',
    {
      id: z.string(),
      name: z.string(),
      dns_status: z.boolean().optional(),
      ssl_status: z.boolean().optional(),
    },
    async ({ id, name, dns_status, ssl_status }) => {
      try {
        const domain = await api.updateProjectDomain(id, name, {
          dns_status,
          ssl_status,
        });

        if (!domain) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to update domain ${name} for project ${id}`,
              },
            ],
          };
        }

        const domainText = [
          'Domain updated successfully:',
          `Name: ${domain.name}`,
          `Project ID: ${domain.project_id}`,
          `DNS Status: ${domain.dns_status ? 'Valid' : 'Invalid'}`,
          `SSL Status: ${domain.ssl_status ? 'Valid' : 'Invalid'}`,
          `Created at: ${domain.created_at || 'Unknown'}`,
          `Updated at: ${domain.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: domainText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-updateProjectDomain:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating project domain: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Delete Project Domain
  server.tool(
    'edgee-deleteProjectDomain',
    'Delete a domain from a project.',
    {
      id: z.string(),
      name: z.string(),
    },
    async ({ id, name }) => {
      try {
        const result = await api.deleteProjectDomain(id, name);

        if (!result || !result.deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to delete domain ${name} from project ${id}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Domain ${name} was successfully deleted from project ${id}.`,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-deleteProjectDomain:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting project domain: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create Project Domain
  server.tool(
    'edgee-createProjectDomain',
    'Create a new domain for a project.',
    {
      id: z.string(),
      name: z.string(),
    },
    async ({ id, name }) => {
      try {
        const domain = await api.createProjectDomain(id, { name });

        if (!domain) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to create domain for project with ID: ${id}`,
              },
            ],
          };
        }

        const domainText = [
          'Domain created successfully:',
          `Name: ${domain.name}`,
          `Project ID: ${domain.project_id}`,
          `DNS Status: ${domain.dns_status ? 'Valid' : 'Invalid'}`,
          `SSL Status: ${domain.ssl_status ? 'Valid' : 'Invalid'}`,
          `Created at: ${domain.created_at || 'Unknown'}`,
          `Updated at: ${domain.updated_at || 'Unknown'}`,
        ].join('\n');

        return {
          content: [
            {
              type: 'text',
              text: domainText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-createProjectDomain:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error creating project domain: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List Project Components
  server.tool(
    'edgee-listProjectComponents',
    'List all components for a project.',
    {
      id: z.string(),
      category: z.enum(['data_collection', 'consent_management']).optional(),
      subcategory: z.enum(['analytics', 'warehouse', 'attribution', 'conversion api', 'consent_mapping']).optional(),
    },
    async ({ id, category, subcategory }) => {
      try {
        const data = await api.listProjectComponents(id, category, subcategory);

        if (!data || !data.data) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve components for project with ID: ${id}`,
              },
            ],
          };
        }

        const components = data.data;

        // Format components
        const formattedComponents = components.map((component) =>
          [
            `${component.component_slug || 'Unknown'}:`,
            `ID: ${component.id}`,
            `Component ID: ${component.component_id}`,
            `Version: ${component.component_version}`,
            `Category: ${component.category}`,
            `Subcategory: ${component.subcategory}`,
            `Active: ${component.active ? 'Yes' : 'No'}`,
            `Settings: ${component.settings ? JSON.stringify(component.settings, null, 2) : 'None'}`,
            '---',
          ].join('\n')
        );

        const componentsText = `Components for project ${id}:\n\n${formattedComponents.join('\n')}`;

        return {
          content: [
            {
              type: 'text',
              text: componentsText,
            },
          ],
        };
      } catch (error) {
        console.error('Error in edgee-listProjectComponents:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving project components: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
