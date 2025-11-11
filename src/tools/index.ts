import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerOrganizationTools } from './organization.js';
import { registerProjectTools } from './project.js';
import { registerExtendedProjectTools } from './project-extended.js';
import { registerComponentTools } from './component.js';
import { registerUserTools } from './user.js';

/**
 * Register all Edgee API tools with the MCP server
 */
export function registerAllTools(server: McpServer): void {
  registerOrganizationTools(server);
  registerProjectTools(server);
  registerExtendedProjectTools(server);
  registerComponentTools(server);
  registerUserTools(server);
}
