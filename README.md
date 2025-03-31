<div align="center">

<p align="center">
  <a href="https://www.edgee.cloud">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://cdn.edgee.cloud/img/favicon-dark.svg">
      <img src="https://cdn.edgee.cloud/img/favicon.svg" height="100" alt="Edgee">
    </picture>
    <h1 align="center">Edgee MCP Server</h1>
  </a>
</p>
</div>

MCP Server for the Edgee API, enabling organization management, project operations, component management, and user administration through the Model Context Protocol.

## Features

- **Organization Management**: Create, read, update, and delete organizations
- **Project Operations**: Manage projects, domains, components, and statistics
- **Component Management**: Work with components, versions, and settings
- **User Administration**: Manage users, invitations, and API tokens
- **Comprehensive Error Handling**: Clear error messages for common issues
- **Type-Safe API**: Built with TypeScript for robust type checking

## Tools

### Organization Tools

- `edgee-listOrganizations`: List all organizations with optional filtering
- `edgee-getMyOrganization`: Get your personal organization
- `edgee-getOrganization`: Get an organization by ID
- `edgee-createOrganization`: Create a new organization
- `edgee-updateOrganization`: Update an existing organization
- `edgee-deleteOrganization`: Delete an organization
- `edgee-listOrganizationUsers`: List users of an organization

### Project Tools

- `edgee-listProjects`: List all projects with optional filtering
- `edgee-getProject`: Get a project by ID
- `edgee-createProject`: Create a new project
- `edgee-updateProject`: Update an existing project
- `edgee-deleteProject`: Delete a project
- `edgee-getProjectCounters`: Get statistics for a project
- `edgee-listProjectDomains`: List domains for a project
- `edgee-createProjectDomain`: Create a new domain for a project
- `edgee-listProjectComponents`: List components for a project

### Component Tools

- `edgee-listPublicComponents`: List all public components
- `edgee-listOrganizationComponents`: List components for an organization
- `edgee-getComponentByUuid`: Get a component by UUID
- `edgee-getComponentBySlug`: Get a component by slug
- `edgee-createComponent`: Create a new component
- `edgee-createComponentVersion`: Create a new component version

### User Tools

- `edgee-getMe`: Get the current user
- `edgee-getUser`: Get a user by ID
- `edgee-listInvitations`: List all invitations
- `edgee-createInvitation`: Create a new invitation
- `edgee-deleteInvitation`: Delete an invitation
- `edgee-listApiTokens`: List all API tokens
- `edgee-createApiToken`: Create a new API token
- `edgee-deleteApiToken`: Delete an API token
- `edgee-getUploadPresignedUrl`: Get a presigned URL for uploading files

## Setup

### Personal Access Token
[Create an Edgee Personal Access Token](https://www.edgee.cloud/~/account/tokens):
   - Go to [API tokens](https://www.edgee.cloud/~/account/tokens) (in Account Settings > API Tokens)
   - Create a token
     - Give a name to this token
     - Select a validity period of the token you're about to create. If no duration is selected, the token will never expire. 
   - Copy the generated token

### Installation

You can use this MCP server in several ways:

#### NPX (Recommended)

```bash
npx @edgee/mcp-server-edgee
```

#### Global Installation

```bash
npm install -g @edgee/mcp-server-edgee
```

#### Local Installation

```bash
npm install @edgee/mcp-server-edgee
```

### Usage with Claude Desktop

To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "edgee": {
      "command": "npx",
      "args": [
        "-y",
        "@edgee/mcp-server-edgee"
      ],
      "env": {
        "EDGEE_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Examples

### List Organizations

```
Use the edgee-listOrganizations tool to list all your organizations.
```

### Create a Project

```
Use the edgee-createProject tool to create a new project with the following parameters:
- organization_id: "org_123456"
- slug: "my-new-project"
- description: "This is my new project"
```

### Get Project Components

```
Use the edgee-listProjectComponents tool to list all components for project "proj_123456".
```

### Create an Invitation

```
Use the edgee-createInvitation tool to invite a user to your organization:
- organization_id: "org_123456"
- email: "user@example.com"
- role: "member"
```

## Development

### Building from Source

```bash
git clone https://github.com/edgee-cloud/mcp-server-edgee.git
cd mcp-server-edgee
npm install
npm run build
```

## License

Apache-2.0
