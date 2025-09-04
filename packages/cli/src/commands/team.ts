/**
 * Enterprise-Grade Team Management Commands
 * 
 * Provides comprehensive CLI commands for team management, user roles,
 * shared workspaces, and collaborative project management.
 * 
 * @author React Responsive Easy CLI
 * @version 2.0.0
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
// @ts-ignore
import figlet from 'figlet';
// @ts-ignore
import gradient from 'gradient-string';
import { TeamService, Team, Workspace, Project, TeamMember, UserRole } from '../services/TeamService';
import { readFile, writeFile, access } from 'fs-extra';
import { join, resolve } from 'path';
import inquirer from 'inquirer';

interface TeamCreateOptions {
  name: string;
  description?: string;
  visibility?: 'public' | 'private' | 'restricted';
  maxMembers?: number;
  interactive?: boolean;
}

interface WorkspaceCreateOptions {
  teamId: string;
  name: string;
  description?: string;
  type?: 'project' | 'department' | 'client' | 'custom';
  visibility?: 'public' | 'private' | 'restricted';
  interactive?: boolean;
}

interface ProjectCreateOptions {
  workspaceId: string;
  name: string;
  description?: string;
  type?: 'responsive' | 'component' | 'library' | 'template';
  visibility?: 'public' | 'private' | 'restricted';
  interactive?: boolean;
}

interface TeamInviteOptions {
  teamId: string;
  email: string;
  role?: string;
  workspaceIds?: string[];
  message?: string;
  interactive?: boolean;
}

interface TeamListOptions {
  format?: 'table' | 'json' | 'yaml';
  filter?: string;
  sort?: string;
}

interface TeamAnalyticsOptions {
  teamId: string;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  format?: 'table' | 'json' | 'yaml';
  output?: string;
}

export function createTeamCommands(): Command {
  const teamCommand = new Command('team');
  
  teamCommand
    .description('Enterprise team management and collaboration')
    .addHelpText('before', () => {
      const title = figlet.textSync('TEAM', { font: 'ANSI Shadow' });
      const gradientTitle = gradient.rainbow.multiline(title);
      return boxen(gradientTitle, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan'
      });
    });

  // Create team command
  teamCommand
    .command('create')
    .description('Create a new team')
    .requiredOption('-n, --name <name>', 'Team name')
    .option('-d, --description <description>', 'Team description')
    .option('-v, --visibility <visibility>', 'Team visibility (public, private, restricted)', 'private')
    .option('--max-members <maxMembers>', 'Maximum number of members', '50')
    .option('-i, --interactive', 'Interactive mode', false)
    .action(async (options: TeamCreateOptions) => {
      await createTeam(options);
    });

  // Create workspace command
  teamCommand
    .command('workspace')
    .description('Create a new workspace')
    .requiredOption('-t, --team-id <teamId>', 'Team ID')
    .requiredOption('-n, --name <name>', 'Workspace name')
    .option('-d, --description <description>', 'Workspace description')
    .option('--type <type>', 'Workspace type (project, department, client, custom)', 'project')
    .option('-v, --visibility <visibility>', 'Workspace visibility (public, private, restricted)', 'private')
    .option('-i, --interactive', 'Interactive mode', false)
    .action(async (options: WorkspaceCreateOptions) => {
      await createWorkspace(options);
    });

  // Create project command
  teamCommand
    .command('project')
    .description('Create a new project')
    .requiredOption('-w, --workspace-id <workspaceId>', 'Workspace ID')
    .requiredOption('-n, --name <name>', 'Project name')
    .option('-d, --description <description>', 'Project description')
    .option('--type <type>', 'Project type (responsive, component, library, template)', 'responsive')
    .option('-v, --visibility <visibility>', 'Project visibility (public, private, restricted)', 'private')
    .option('-i, --interactive', 'Interactive mode', false)
    .action(async (options: ProjectCreateOptions) => {
      await createProject(options);
    });

  // Invite user command
  teamCommand
    .command('invite')
    .description('Invite user to team')
    .requiredOption('-t, --team-id <teamId>', 'Team ID')
    .requiredOption('-e, --email <email>', 'User email')
    .option('-r, --role <role>', 'User role (owner, admin, developer, designer, viewer)', 'developer')
    .option('-w, --workspace-ids <workspaceIds>', 'Comma-separated workspace IDs')
    .option('-m, --message <message>', 'Invitation message')
    .option('-i, --interactive', 'Interactive mode', false)
    .action(async (options: TeamInviteOptions) => {
      await inviteUser(options);
    });

  // List teams command
  teamCommand
    .command('list')
    .description('List teams and workspaces')
    .option('-f, --format <format>', 'Output format (table, json, yaml)', 'table')
    .option('--filter <filter>', 'Filter by name or description')
    .option('--sort <sort>', 'Sort by field (name, created, members)', 'name')
    .action(async (options: TeamListOptions) => {
      await listTeams(options);
    });

  // Team info command
  teamCommand
    .command('info')
    .description('Show team information')
    .requiredOption('-t, --team-id <teamId>', 'Team ID')
    .option('-f, --format <format>', 'Output format (table, json, yaml)', 'table')
    .action(async (options: { teamId: string; format: string }) => {
      await showTeamInfo(options);
    });

  // Team analytics command
  teamCommand
    .command('analytics')
    .description('Show team analytics and insights')
    .requiredOption('-t, --team-id <teamId>', 'Team ID')
    .option('-p, --period <period>', 'Analytics period (day, week, month, quarter, year)', 'month')
    .option('-f, --format <format>', 'Output format (table, json, yaml)', 'table')
    .option('-o, --output <output>', 'Output file path')
    .action(async (options: TeamAnalyticsOptions) => {
      await showTeamAnalytics(options);
    });

  // Team members command
  teamCommand
    .command('members')
    .description('Manage team members')
    .option('-t, --team-id <teamId>', 'Team ID')
    .option('-l, --list', 'List team members', false)
    .option('-a, --add', 'Add team member', false)
    .option('-r, --remove', 'Remove team member', false)
    .option('-u, --update', 'Update team member', false)
    .action(async (options: any) => {
      await manageMembers(options);
    });

  // Team roles command
  teamCommand
    .command('roles')
    .description('Manage team roles and permissions')
    .option('-l, --list', 'List available roles', false)
    .option('-c, --create', 'Create custom role', false)
    .option('-u, --update', 'Update role', false)
    .option('-d, --delete', 'Delete role', false)
    .action(async (options: any) => {
      await manageRoles(options);
    });

  // Team settings command
  teamCommand
    .command('settings')
    .description('Manage team settings')
    .requiredOption('-t, --team-id <teamId>', 'Team ID')
    .option('-v, --view', 'View current settings', false)
    .option('-u, --update', 'Update settings', false)
    .action(async (options: any) => {
      await manageSettings(options);
    });

  return teamCommand;
}

/**
 * Create a new team
 */
async function createTeam(options: TeamCreateOptions): Promise<void> {
  const spinner = ora('Creating team...').start();

  try {
    const teamService = new TeamService();
    
    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Team name:',
          default: options.name,
          validate: (input: string) => input.length > 0 || 'Team name is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Team description:',
          default: options.description
        },
        {
          type: 'list',
          name: 'visibility',
          message: 'Team visibility:',
          choices: [
            { name: 'Private - Only team members can see', value: 'private' },
            { name: 'Public - Anyone can see', value: 'public' },
            { name: 'Restricted - Limited visibility', value: 'restricted' }
          ],
          default: options.visibility || 'private'
        },
        {
          type: 'number',
          name: 'maxMembers',
          message: 'Maximum number of members:',
          default: parseInt(String(options.maxMembers || '50')),
          validate: (input: number) => input > 0 || 'Maximum members must be greater than 0'
        }
      ]);

      options = { ...options, ...answers };
    }

    spinner.text = 'Creating team...';
    const team = await teamService.createTeam({
      name: options.name,
      description: options.description || '',
      createdBy: 'current-user', // In real implementation, get from auth
      settings: {
        visibility: options.visibility as any,
        maxMembers: parseInt(String(options.maxMembers || '50'))
      }
    });

    spinner.succeed(chalk.green('✅ Team created successfully'));

    // Display team details
    console.log(boxen(
      chalk.cyan(`Team: ${team.name}\n`) +
      chalk.cyan(`ID: ${team.id}\n`) +
      chalk.cyan(`Slug: ${team.slug}\n`) +
      chalk.cyan(`Visibility: ${team.settings.visibility}\n`) +
      chalk.cyan(`Max Members: ${team.settings.maxMembers}\n`) +
      chalk.cyan(`Created: ${team.createdAt.toISOString()}`),
      {
        title: 'Team Created',
        titleAlignment: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to create team: ${error}`));
    process.exit(1);
  }
}

/**
 * Create a new workspace
 */
async function createWorkspace(options: WorkspaceCreateOptions): Promise<void> {
  const spinner = ora('Creating workspace...').start();

  try {
    const teamService = new TeamService();
    
    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Workspace name:',
          default: options.name,
          validate: (input: string) => input.length > 0 || 'Workspace name is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Workspace description:',
          default: options.description
        },
        {
          type: 'list',
          name: 'type',
          message: 'Workspace type:',
          choices: [
            { name: 'Project - For development projects', value: 'project' },
            { name: 'Department - For organizational units', value: 'department' },
            { name: 'Client - For client-specific work', value: 'client' },
            { name: 'Custom - Custom workspace type', value: 'custom' }
          ],
          default: options.type || 'project'
        },
        {
          type: 'list',
          name: 'visibility',
          message: 'Workspace visibility:',
          choices: [
            { name: 'Private - Only workspace members can see', value: 'private' },
            { name: 'Public - Anyone can see', value: 'public' },
            { name: 'Restricted - Limited visibility', value: 'restricted' }
          ],
          default: options.visibility || 'private'
        }
      ]);

      options = { ...options, ...answers };
    }

    spinner.text = 'Creating workspace...';
    const workspace = await teamService.createWorkspace(options.teamId, {
      name: options.name,
      description: options.description || '',
      type: options.type as any,
      createdBy: 'current-user', // In real implementation, get from auth
      settings: {
        visibility: options.visibility as any
      }
    });

    spinner.succeed(chalk.green('✅ Workspace created successfully'));

    // Display workspace details
    console.log(boxen(
      chalk.cyan(`Workspace: ${workspace.name}\n`) +
      chalk.cyan(`ID: ${workspace.id}\n`) +
      chalk.cyan(`Slug: ${workspace.slug}\n`) +
      chalk.cyan(`Type: ${workspace.type}\n`) +
      chalk.cyan(`Visibility: ${workspace.settings.visibility}\n`) +
      chalk.cyan(`Created: ${workspace.createdAt.toISOString()}`),
      {
        title: 'Workspace Created',
        titleAlignment: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to create workspace: ${error}`));
    process.exit(1);
  }
}

/**
 * Create a new project
 */
async function createProject(options: ProjectCreateOptions): Promise<void> {
  const spinner = ora('Creating project...').start();

  try {
    const teamService = new TeamService();
    
    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: options.name,
          validate: (input: string) => input.length > 0 || 'Project name is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Project description:',
          default: options.description
        },
        {
          type: 'list',
          name: 'type',
          message: 'Project type:',
          choices: [
            { name: 'Responsive - Responsive design project', value: 'responsive' },
            { name: 'Component - Reusable component library', value: 'component' },
            { name: 'Library - Code library or framework', value: 'library' },
            { name: 'Template - Project template', value: 'template' }
          ],
          default: options.type || 'responsive'
        },
        {
          type: 'list',
          name: 'visibility',
          message: 'Project visibility:',
          choices: [
            { name: 'Private - Only project members can see', value: 'private' },
            { name: 'Public - Anyone can see', value: 'public' },
            { name: 'Restricted - Limited visibility', value: 'restricted' }
          ],
          default: options.visibility || 'private'
        }
      ]);

      options = { ...options, ...answers };
    }

    spinner.text = 'Creating project...';
    const project = await teamService.createProject(options.workspaceId, {
      name: options.name,
      description: options.description || '',
      type: options.type as any,
      createdBy: 'current-user', // In real implementation, get from auth
      settings: {
        visibility: options.visibility as any
      }
    });

    spinner.succeed(chalk.green('✅ Project created successfully'));

    // Display project details
    console.log(boxen(
      chalk.cyan(`Project: ${project.name}\n`) +
      chalk.cyan(`ID: ${project.id}\n`) +
      chalk.cyan(`Type: ${project.type}\n`) +
      chalk.cyan(`Status: ${project.status}\n`) +
      chalk.cyan(`Visibility: ${project.settings.visibility}\n`) +
      chalk.cyan(`Created: ${project.createdAt.toISOString()}`),
      {
        title: 'Project Created',
        titleAlignment: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to create project: ${error}`));
    process.exit(1);
  }
}

/**
 * Invite user to team
 */
async function inviteUser(options: TeamInviteOptions): Promise<void> {
  const spinner = ora('Inviting user...').start();

  try {
    const teamService = new TeamService();
    
    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'User email:',
          default: options.email,
          validate: (input: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(input) || 'Please enter a valid email address';
          }
        },
        {
          type: 'list',
          name: 'role',
          message: 'User role:',
          choices: [
            { name: 'Owner - Full access to all features', value: 'owner' },
            { name: 'Admin - Administrative access', value: 'admin' },
            { name: 'Developer - Development access', value: 'developer' },
            { name: 'Designer - Design access', value: 'designer' },
            { name: 'Viewer - Read-only access', value: 'viewer' }
          ],
          default: options.role || 'developer'
        },
        {
          type: 'input',
          name: 'message',
          message: 'Invitation message (optional):',
          default: options.message
        }
      ]);

      options = { ...options, ...answers };
    }

    spinner.text = 'Sending invitation...';
    const inviteOptions: {
      email: string;
      role: string;
      workspaceIds: string[];
      invitedBy: string;
      message?: string;
    } = {
      email: options.email,
      role: options.role || 'developer',
      workspaceIds: options.workspaceIds ? String(options.workspaceIds).split(',') : [],
      invitedBy: 'current-user', // In real implementation, get from auth
    };
    
    if (options.message !== undefined) {
      inviteOptions.message = options.message;
    }
    
    const invitation = await teamService.inviteUser(options.teamId, inviteOptions);

    spinner.succeed(chalk.green('✅ User invited successfully'));

    // Display invitation details
    console.log(boxen(
      chalk.cyan(`Email: ${invitation.email}\n`) +
      chalk.cyan(`Role: ${invitation.role.name}\n`) +
      chalk.cyan(`Status: ${invitation.status}\n`) +
      chalk.cyan(`Expires: ${invitation.expiresAt.toISOString()}\n`) +
      chalk.cyan(`Token: ${invitation.token}`),
      {
        title: 'Invitation Sent',
        titleAlignment: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to invite user: ${error}`));
    process.exit(1);
  }
}

/**
 * List teams and workspaces
 */
async function listTeams(options: TeamListOptions): Promise<void> {
  const spinner = ora('Loading teams...').start();

  try {
    const teamService = new TeamService();
    
    spinner.text = 'Fetching teams...';
    const teams = teamService.getTeams();

    if (teams.length === 0) {
      spinner.succeed(chalk.yellow('No teams found'));
      return;
    }

    spinner.succeed(chalk.green(`Found ${teams.length} teams`));

    if (options.format === 'table') {
      console.log(chalk.cyan('\n📋 Teams:'));
      console.table(teams.map(team => ({
        Name: team.name,
        ID: team.id,
        Members: team.members.length,
        Workspaces: team.workspaces.length,
        Visibility: team.settings.visibility,
        Created: team.createdAt.toISOString().split('T')[0]
      })));

      // Show workspaces for each team
      teams.forEach(team => {
        if (team.workspaces.length > 0) {
          console.log(chalk.cyan(`\n📁 Workspaces in ${team.name}:`));
          console.table(team.workspaces.map(workspace => ({
            Name: workspace.name,
            ID: workspace.id,
            Type: workspace.type,
            Projects: workspace.projects.length,
            Created: workspace.createdAt.toISOString().split('T')[0]
          })));
        }
      });
    } else if (options.format === 'json') {
      console.log(JSON.stringify(teams, null, 2));
    } else if (options.format === 'yaml') {
      // Simple YAML output
      teams.forEach(team => {
        console.log(`- name: ${team.name}`);
        console.log(`  id: ${team.id}`);
        console.log(`  members: ${team.members.length}`);
        console.log(`  workspaces: ${team.workspaces.length}`);
        console.log(`  visibility: ${team.settings.visibility}`);
        console.log(`  created: ${team.createdAt.toISOString()}`);
        console.log('');
      });
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to list teams: ${error}`));
    process.exit(1);
  }
}

/**
 * Show team information
 */
async function showTeamInfo(options: { teamId: string; format: string }): Promise<void> {
  const spinner = ora('Loading team information...').start();

  try {
    const teamService = new TeamService();
    
    spinner.text = 'Fetching team details...';
    const team = teamService.getTeam(options.teamId);

    if (!team) {
      spinner.fail(chalk.red('Team not found'));
      return;
    }

    spinner.succeed(chalk.green('Team information loaded'));

    if (options.format === 'table') {
      console.log(boxen(
        chalk.cyan(`Team: ${team.name}\n`) +
        chalk.cyan(`ID: ${team.id}\n`) +
        chalk.cyan(`Slug: ${team.slug}\n`) +
        chalk.cyan(`Description: ${team.description}\n`) +
        chalk.cyan(`Visibility: ${team.settings.visibility}\n`) +
        chalk.cyan(`Members: ${team.members.length}\n`) +
        chalk.cyan(`Workspaces: ${team.workspaces.length}\n`) +
        chalk.cyan(`Created: ${team.createdAt.toISOString()}\n`) +
        chalk.cyan(`Updated: ${team.updatedAt.toISOString()}`),
        {
          title: 'Team Information',
          titleAlignment: 'center',
          padding: 1,
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      ));

      // Show members
      if (team.members.length > 0) {
        console.log(chalk.cyan('\n👥 Team Members:'));
        console.table(team.members.map(member => ({
          Name: member.name || member.email,
          Email: member.email,
          Role: member.role.name,
          Status: member.status,
          Joined: member.joinedAt.toISOString().split('T')[0]
        })));
      }

      // Show workspaces
      if (team.workspaces.length > 0) {
        console.log(chalk.cyan('\n📁 Workspaces:'));
        console.table(team.workspaces.map(workspace => ({
          Name: workspace.name,
          Type: workspace.type,
          Projects: workspace.projects.length,
          Members: workspace.members.length,
          Created: workspace.createdAt.toISOString().split('T')[0]
        })));
      }
    } else if (options.format === 'json') {
      console.log(JSON.stringify(team, null, 2));
    } else if (options.format === 'yaml') {
      // Simple YAML output
      console.log(`name: ${team.name}`);
      console.log(`id: ${team.id}`);
      console.log(`slug: ${team.slug}`);
      console.log(`description: ${team.description}`);
      console.log(`visibility: ${team.settings.visibility}`);
      console.log(`members: ${team.members.length}`);
      console.log(`workspaces: ${team.workspaces.length}`);
      console.log(`created: ${team.createdAt.toISOString()}`);
      console.log(`updated: ${team.updatedAt.toISOString()}`);
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to get team information: ${error}`));
    process.exit(1);
  }
}

/**
 * Show team analytics
 */
async function showTeamAnalytics(options: TeamAnalyticsOptions): Promise<void> {
  const spinner = ora('Loading team analytics...').start();

  try {
    const teamService = new TeamService();
    
    spinner.text = 'Generating analytics...';
    const analytics = await teamService.getTeamAnalytics(options.teamId, options.period);

    spinner.succeed(chalk.green('Analytics generated successfully'));

    if (options.format === 'table') {
      console.log(boxen(
        chalk.cyan(`Team Analytics - ${options.period}\n`) +
        chalk.cyan(`Generated: ${analytics.generatedAt.toISOString()}\n\n`) +
        chalk.yellow('📊 Members:\n') +
        chalk.cyan(`  Total: ${analytics.metrics.members.total}\n`) +
        chalk.cyan(`  Active: ${analytics.metrics.members.active}\n`) +
        chalk.cyan(`  New: ${analytics.metrics.members.new}\n`) +
        chalk.cyan(`  Churn: ${analytics.metrics.members.churn}\n\n`) +
        chalk.yellow('📁 Workspaces:\n') +
        chalk.cyan(`  Total: ${analytics.metrics.workspaces.total}\n`) +
        chalk.cyan(`  Active: ${analytics.metrics.workspaces.active}\n`) +
        chalk.cyan(`  New: ${analytics.metrics.workspaces.new}\n\n`) +
        chalk.yellow('🚀 Projects:\n') +
        chalk.cyan(`  Total: ${analytics.metrics.projects.total}\n`) +
        chalk.cyan(`  Active: ${analytics.metrics.projects.active}\n`) +
        chalk.cyan(`  Completed: ${analytics.metrics.projects.completed}\n`) +
        chalk.cyan(`  New: ${analytics.metrics.projects.new}\n\n`) +
        chalk.yellow('⚡ Performance:\n') +
        chalk.cyan(`  Uptime: ${analytics.metrics.performance.uptime}%\n`) +
        chalk.cyan(`  Error Rate: ${analytics.metrics.performance.errorRate}%\n`) +
        chalk.cyan(`  Satisfaction: ${analytics.metrics.performance.satisfaction}/5`),
        {
          title: 'Team Analytics',
          titleAlignment: 'center',
          padding: 1,
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      ));

      // Show recommendations
      if (analytics.recommendations.length > 0) {
        console.log(chalk.yellow('\n💡 Recommendations:'));
        analytics.recommendations.forEach(rec => {
          console.log(chalk.yellow(`  • ${rec}`));
        });
      }
    } else if (options.format === 'json') {
      console.log(JSON.stringify(analytics, null, 2));
    } else if (options.format === 'yaml') {
      // Simple YAML output
      console.log(`period: ${analytics.period}`);
      console.log(`generated: ${analytics.generatedAt.toISOString()}`);
      console.log(`members:`);
      console.log(`  total: ${analytics.metrics.members.total}`);
      console.log(`  active: ${analytics.metrics.members.active}`);
      console.log(`  new: ${analytics.metrics.members.new}`);
      console.log(`  churn: ${analytics.metrics.members.churn}`);
      console.log(`workspaces:`);
      console.log(`  total: ${analytics.metrics.workspaces.total}`);
      console.log(`  active: ${analytics.metrics.workspaces.active}`);
      console.log(`  new: ${analytics.metrics.workspaces.new}`);
      console.log(`projects:`);
      console.log(`  total: ${analytics.metrics.projects.total}`);
      console.log(`  active: ${analytics.metrics.projects.active}`);
      console.log(`  completed: ${analytics.metrics.projects.completed}`);
      console.log(`  new: ${analytics.metrics.projects.new}`);
    }

    // Save to file if output specified
    if (options.output) {
      const content = options.format === 'json' 
        ? JSON.stringify(analytics, null, 2)
        : `# Team Analytics\n\nPeriod: ${analytics.period}\nGenerated: ${analytics.generatedAt.toISOString()}\n\n## Metrics\n\n- Members: ${analytics.metrics.members.total}\n- Workspaces: ${analytics.metrics.workspaces.total}\n- Projects: ${analytics.metrics.projects.total}`;
      
      await writeFile(options.output, content, 'utf8');
      console.log(chalk.green(`\n📄 Analytics saved to: ${options.output}`));
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to get team analytics: ${error}`));
    process.exit(1);
  }
}

/**
 * Manage team members
 */
async function manageMembers(options: any): Promise<void> {
  const spinner = ora('Managing team members...').start();

  try {
    const teamService = new TeamService();
    
    if (options.list) {
      spinner.text = 'Loading team members...';
      const team = teamService.getTeam(options.teamId);
      
      if (!team) {
        spinner.fail(chalk.red('Team not found'));
        return;
      }

      spinner.succeed(chalk.green('Team members loaded'));

      if (team.members.length === 0) {
        console.log(chalk.yellow('No members found'));
        return;
      }

      console.log(chalk.cyan(`\n👥 Team Members (${team.members.length}):`));
      console.table(team.members.map(member => ({
        Name: member.name || member.email,
        Email: member.email,
        Role: member.role.name,
        Status: member.status,
        Joined: member.joinedAt.toISOString().split('T')[0],
        'Last Active': member.lastActiveAt.toISOString().split('T')[0]
      })));
    } else {
      spinner.fail(chalk.red('Please specify an action (--list, --add, --remove, --update)'));
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to manage members: ${error}`));
    process.exit(1);
  }
}

/**
 * Manage team roles
 */
async function manageRoles(options: any): Promise<void> {
  const spinner = ora('Managing team roles...').start();

  try {
    const teamService = new TeamService();
    
    if (options.list) {
      spinner.text = 'Loading available roles...';
      const roles = teamService.getRoles();
      
      spinner.succeed(chalk.green('Roles loaded'));

      console.log(chalk.cyan('\n🎭 Available Roles:'));
      console.table(roles.map(role => ({
        Name: role.name,
        ID: role.id,
        Level: role.level,
        Permissions: role.permissions.length,
        Default: role.isDefault ? 'Yes' : 'No',
        System: role.isSystem ? 'Yes' : 'No'
      })));
    } else {
      spinner.fail(chalk.red('Please specify an action (--list, --create, --update, --delete)'));
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to manage roles: ${error}`));
    process.exit(1);
  }
}

/**
 * Manage team settings
 */
async function manageSettings(options: any): Promise<void> {
  const spinner = ora('Managing team settings...').start();

  try {
    const teamService = new TeamService();
    
    if (options.view) {
      spinner.text = 'Loading team settings...';
      const team = teamService.getTeam(options.teamId);
      
      if (!team) {
        spinner.fail(chalk.red('Team not found'));
        return;
      }

      spinner.succeed(chalk.green('Team settings loaded'));

      console.log(boxen(
        chalk.cyan(`Visibility: ${team.settings.visibility}\n`) +
        chalk.cyan(`Allow Invites: ${team.settings.allowInvites ? 'Yes' : 'No'}\n`) +
        chalk.cyan(`Require Approval: ${team.settings.requireApproval ? 'Yes' : 'No'}\n`) +
        chalk.cyan(`Default Role: ${team.settings.defaultRole.name}\n`) +
        chalk.cyan(`Max Members: ${team.settings.maxMembers}\n`) +
        chalk.cyan(`Plan: ${team.settings.billing.plan}\n`) +
        chalk.cyan(`Two-Factor Required: ${team.settings.security.twoFactorRequired ? 'Yes' : 'No'}\n`) +
        chalk.cyan(`Session Timeout: ${team.settings.security.sessionTimeout} minutes\n`) +
        chalk.cyan(`Audit Logging: ${team.settings.security.auditLogging ? 'Yes' : 'No'}\n`) +
        chalk.cyan(`Encryption: ${team.settings.security.encryption ? 'Yes' : 'No'}`),
        {
          title: 'Team Settings',
          titleAlignment: 'center',
          padding: 1,
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      ));
    } else {
      spinner.fail(chalk.red('Please specify an action (--view, --update)'));
    }

  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to manage settings: ${error}`));
    process.exit(1);
  }
}
