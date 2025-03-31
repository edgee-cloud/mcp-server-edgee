#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAllTools } from './tools/index.js';

/**
 * Edgee MCP Server
 *
 * This server provides tools for interacting with the Edgee API.
 * It requires an EDGEE_TOKEN environment variable to be set.
 */

// Check for required environment variables
if (!process.env.EDGEE_TOKEN) {
  console.error('Error: EDGEE_TOKEN environment variable is required');
  process.exit(1);
}

// Create server instance
const server = new McpServer({
  name: 'edgee',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register all tools
registerAllTools(server);

// Error handling
process.on('uncaughtException', (error: Error) => {
  console.error('[MCP Error]', error);
});

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Edgee MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
