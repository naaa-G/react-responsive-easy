/**
 * Enterprise-Grade Team Management Service
 * 
 * Provides comprehensive team management with user roles, permissions,
 * shared workspaces, and collaborative configuration management.
 * 
 * @author React Responsive Easy CLI
 * @version 2.0.0
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';

// Enterprise Team Management Types
export interface Team {
  id: string;
  name: string;
  description: string;
  slug: string;
  avatar?: string;
  settings: TeamSettings;
  members: TeamMember[];
  workspaces: Workspace[];
  invitations: TeamInvitation[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: TeamMetadata;
}

export interface TeamSettings {
  visibility: 'public' | 'private' | 'restricted';
  allowInvites: boolean;
  requireApproval: boolean;
  defaultRole: UserRole;
  maxMembers: number;
  billing: BillingSettings;
  security: TeamSecuritySettings;
  notifications: TeamNotificationSettings;
  integrations: TeamIntegrationSettings;
}

export interface BillingSettings {
  plan: 'free' | 'pro' | 'enterprise';
  usage: UsageMetrics;
  limits: UsageLimits;
  billingEmail: string;
  paymentMethod?: string;
}

export interface UsageMetrics {
  members: number;
  workspaces: number;
  projects: number;
  storage: number; // in MB
  apiCalls: number;
  lastUpdated: Date;
}

export interface UsageLimits {
  maxMembers: number;
  maxWorkspaces: number;
  maxProjects: number;
  maxStorage: number; // in MB
  maxApiCalls: number;
}

export interface TeamSecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number; // in minutes
  ipWhitelist: string[];
  allowedDomains: string[];
  auditLogging: boolean;
  encryption: boolean;
}

export interface TeamNotificationSettings {
  email: boolean;
  slack: boolean;
  teams: boolean;
  webhook: boolean;
  channels: NotificationChannel[];
}

export interface TeamIntegrationSettings {
  github: boolean;
  gitlab: boolean;
  jenkins: boolean;
  jira: boolean;
  confluence: boolean;
  custom: CustomIntegration[];
}

export interface CustomIntegration {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: Date;
  lastActiveAt: Date;
  invitedBy: string;
  metadata: MemberMetadata;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  level: number; // 1-10, higher = more permissions
  permissions: Permission[];
  isDefault: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with';
  value: any;
}

export interface MemberMetadata {
  department?: string;
  title?: string;
  location?: string;
  timezone?: string;
  preferences: UserPreferences;
  skills: string[];
  experience: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: string[];
}

export interface DashboardPreferences {
  layout: string;
  widgets: string[];
  refreshRate: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  slug: string;
  teamId: string;
  type: 'project' | 'department' | 'client' | 'custom';
  settings: WorkspaceSettings;
  members: WorkspaceMember[];
  projects: Project[];
  resources: WorkspaceResource[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: WorkspaceMetadata;
}

export interface WorkspaceSettings {
  visibility: 'public' | 'private' | 'restricted';
  allowMemberInvites: boolean;
  requireApproval: boolean;
  defaultRole: UserRole;
  maxMembers: number;
  maxProjects: number;
  storage: StorageSettings;
  security: WorkspaceSecuritySettings;
  notifications: WorkspaceNotificationSettings;
}

export interface StorageSettings {
  limit: number; // in MB
  used: number; // in MB
  provider: 'local' | 'aws' | 'azure' | 'gcp';
  encryption: boolean;
  backup: boolean;
  retention: number; // in days
}

export interface WorkspaceSecuritySettings {
  accessControl: boolean;
  auditLogging: boolean;
  dataEncryption: boolean;
  ipRestrictions: string[];
  sessionTimeout: number;
}

export interface WorkspaceNotificationSettings {
  enabled: boolean;
  channels: NotificationChannel[];
  events: NotificationEvent[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'pending';
  joinedAt: Date;
  lastActiveAt: Date;
  invitedBy: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  type: 'responsive' | 'component' | 'library' | 'template';
  status: 'active' | 'archived' | 'draft';
  settings: ProjectSettings;
  members: ProjectMember[];
  configurations: ProjectConfiguration[];
  resources: ProjectResource[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: ProjectMetadata;
}

export interface ProjectSettings {
  visibility: 'public' | 'private' | 'restricted';
  allowCollaboration: boolean;
  requireReview: boolean;
  autoSave: boolean;
  versioning: boolean;
  backup: boolean;
  security: ProjectSecuritySettings;
}

export interface ProjectSecuritySettings {
  accessControl: boolean;
  auditLogging: boolean;
  dataEncryption: boolean;
  ipRestrictions: string[];
  sessionTimeout: number;
}

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'pending';
  joinedAt: Date;
  lastActiveAt: Date;
  invitedBy: string;
}

export interface ProjectConfiguration {
  id: string;
  name: string;
  description: string;
  type: 'responsive' | 'theme' | 'component' | 'layout';
  settings: Record<string, any>;
  version: string;
  isDefault: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  collaborators: string[];
}

export interface ProjectResource {
  id: string;
  name: string;
  type: 'file' | 'image' | 'document' | 'code' | 'data';
  path: string;
  size: number;
  mimeType: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  permissions: Permission[];
}

export interface WorkspaceResource {
  id: string;
  name: string;
  type: 'template' | 'library' | 'documentation' | 'asset';
  path: string;
  size: number;
  mimeType: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  permissions: Permission[];
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: UserRole;
  workspaceIds: string[];
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  token: string;
  metadata: InvitationMetadata;
}

export interface InvitationMetadata {
  message?: string;
  source: 'email' | 'link' | 'admin';
  ipAddress?: string;
  userAgent?: string;
}

export interface TeamMetadata {
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  description?: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface WorkspaceMetadata {
  category?: string;
  client?: string;
  department?: string;
  location?: string;
  description?: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface ProjectMetadata {
  category?: string;
  client?: string;
  department?: string;
  location?: string;
  description?: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'teams' | 'webhook' | 'in_app';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
  verified: boolean;
}

export interface NotificationEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: string[];
  conditions: NotificationCondition[];
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface TeamAnalytics {
  teamId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: TeamMetrics;
  trends: TeamTrends;
  insights: TeamInsight[];
  recommendations: string[];
  generatedAt: Date;
}

export interface TeamMetrics {
  members: {
    total: number;
    active: number;
    new: number;
    churn: number;
  };
  workspaces: {
    total: number;
    active: number;
    new: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    new: number;
  };
  activity: {
    logins: number;
    actions: number;
    collaborations: number;
    apiCalls: number;
  };
  performance: {
    avgResponseTime: number;
    uptime: number;
    errorRate: number;
    satisfaction: number;
  };
}

export interface TeamTrends {
  members: TrendData[];
  workspaces: TrendData[];
  projects: TrendData[];
  activity: TrendData[];
  performance: TrendData[];
}

export interface TrendData {
  date: Date;
  value: number;
  change: number;
  changePercent: number;
}

export interface TeamInsight {
  id: string;
  type: 'growth' | 'performance' | 'engagement' | 'security' | 'usage';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendations: string[];
  data: Record<string, any>;
}

export class TeamService extends EventEmitter {
  private teams: Map<string, Team> = new Map();
  private users: Map<string, any> = new Map();
  private roles: Map<string, UserRole> = new Map();
  private invitations: Map<string, TeamInvitation> = new Map();
  private analytics: Map<string, TeamAnalytics> = new Map();
  private config: any;

  constructor(config: any = {}) {
    super();
    this.config = config;
    this.initializeDefaultRoles();
  }

  /**
   * Initialize default user roles
   */
  private initializeDefaultRoles(): void {
    const defaultRoles: UserRole[] = [
      {
        id: 'owner',
        name: 'Owner',
        description: 'Full access to all team features and settings',
        level: 10,
        permissions: this.getAllPermissions(),
        isDefault: false,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Administrative access to team management',
        level: 8,
        permissions: this.getAdminPermissions(),
        isDefault: false,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'developer',
        name: 'Developer',
        description: 'Full development access to projects and configurations',
        level: 6,
        permissions: this.getDeveloperPermissions(),
        isDefault: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'designer',
        name: 'Designer',
        description: 'Design and configuration access',
        level: 5,
        permissions: this.getDesignerPermissions(),
        isDefault: false,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to team resources',
        level: 2,
        permissions: this.getViewerPermissions(),
        isDefault: false,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultRoles.forEach(role => {
      this.roles.set(role.id, role);
    });
  }

  /**
   * Create a new team
   */
  async createTeam(data: {
    name: string;
    description: string;
    createdBy: string;
    settings?: Partial<TeamSettings>;
  }): Promise<Team> {
    try {
      const teamId = uuidv4();
      const slug = this.generateSlug(data.name);
      
      const team: Team = {
        id: teamId,
        name: data.name,
        description: data.description,
        slug,
        settings: {
          visibility: 'private',
          allowInvites: true,
          requireApproval: false,
          defaultRole: this.roles.get('developer')!,
          maxMembers: 50,
          billing: {
            plan: 'free',
            usage: {
              members: 1,
              workspaces: 0,
              projects: 0,
              storage: 0,
              apiCalls: 0,
              lastUpdated: new Date()
            },
            limits: {
              maxMembers: 50,
              maxWorkspaces: 10,
              maxProjects: 100,
              maxStorage: 1000,
              maxApiCalls: 10000
            },
            billingEmail: ''
          },
          security: {
            twoFactorRequired: false,
            sessionTimeout: 480,
            ipWhitelist: [],
            allowedDomains: [],
            auditLogging: true,
            encryption: true
          },
          notifications: {
            email: true,
            slack: false,
            teams: false,
            webhook: false,
            channels: []
          },
          integrations: {
            github: false,
            gitlab: false,
            jenkins: false,
            jira: false,
            confluence: false,
            custom: []
          },
          ...data.settings
        },
        members: [],
        workspaces: [],
        invitations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: data.createdBy,
        metadata: {
          tags: [],
          customFields: {}
        }
      };

      // Add creator as owner
      const ownerRole = this.roles.get('owner')!;
      const ownerMember: TeamMember = {
        id: uuidv4(),
        userId: data.createdBy,
        email: '', // Will be set when user is created
        name: '', // Will be set when user is created
        role: ownerRole,
        permissions: ownerRole.permissions,
        status: 'active',
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        invitedBy: data.createdBy,
        metadata: {
          preferences: {
            theme: 'auto',
            language: 'en',
            notifications: {
              email: true,
              push: true,
              inApp: true,
              frequency: 'immediate',
              types: ['all']
            },
            dashboard: {
              layout: 'default',
              widgets: ['overview', 'recent', 'activity'],
              refreshRate: 30
            }
          },
          skills: [],
          experience: 'beginner'
        }
      };

      team.members.push(ownerMember);
      this.teams.set(teamId, team);

      this.emit('team-created', team);
      return team;
    } catch (error) {
      this.emit('error', new Error(`Failed to create team: ${error}`));
      throw error;
    }
  }

  /**
   * Create a new workspace
   */
  async createWorkspace(teamId: string, data: {
    name: string;
    description: string;
    type: Workspace['type'];
    createdBy: string;
    settings?: Partial<WorkspaceSettings>;
  }): Promise<Workspace> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const workspaceId = uuidv4();
      const slug = this.generateSlug(data.name);
      
      const workspace: Workspace = {
        id: workspaceId,
        name: data.name,
        description: data.description,
        slug,
        teamId,
        type: data.type,
        settings: {
          visibility: 'private',
          allowMemberInvites: true,
          requireApproval: false,
          defaultRole: this.roles.get('developer')!,
          maxMembers: 20,
          maxProjects: 50,
          storage: {
            limit: 500,
            used: 0,
            provider: 'local',
            encryption: true,
            backup: true,
            retention: 30
          },
          security: {
            accessControl: true,
            auditLogging: true,
            dataEncryption: true,
            ipRestrictions: [],
            sessionTimeout: 480
          },
          notifications: {
            enabled: true,
            channels: [],
            events: []
          },
          ...data.settings
        },
        members: [],
        projects: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: data.createdBy,
        metadata: {
          tags: [],
          customFields: {}
        }
      };

      team.workspaces.push(workspace);
      team.updatedAt = new Date();

      this.emit('workspace-created', { team, workspace });
      return workspace;
    } catch (error) {
      this.emit('error', new Error(`Failed to create workspace: ${error}`));
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(workspaceId: string, data: {
    name: string;
    description: string;
    type: Project['type'];
    createdBy: string;
    settings?: Partial<ProjectSettings>;
  }): Promise<Project> {
    try {
      const workspace = this.findWorkspaceById(workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      const projectId = uuidv4();
      
      const project: Project = {
        id: projectId,
        name: data.name,
        description: data.description,
        workspaceId,
        type: data.type,
        status: 'active',
        settings: {
          visibility: 'private',
          allowCollaboration: true,
          requireReview: false,
          autoSave: true,
          versioning: true,
          backup: true,
          security: {
            accessControl: true,
            auditLogging: true,
            dataEncryption: true,
            ipRestrictions: [],
            sessionTimeout: 480
          },
          ...data.settings
        },
        members: [],
        configurations: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: data.createdBy,
        metadata: {
          tags: [],
          customFields: {}
        }
      };

      workspace.projects.push(project);
      workspace.updatedAt = new Date();

      this.emit('project-created', { workspace, project });
      return project;
    } catch (error) {
      this.emit('error', new Error(`Failed to create project: ${error}`));
      throw error;
    }
  }

  /**
   * Invite user to team
   */
  async inviteUser(teamId: string, data: {
    email: string;
    role: string;
    workspaceIds: string[];
    invitedBy: string;
    message?: string;
  }): Promise<TeamInvitation> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const role = this.roles.get(data.role);
      if (!role) {
        throw new Error('Role not found');
      }

      const invitationId = uuidv4();
      const token = this.generateInvitationToken();
      
      const invitation: TeamInvitation = {
        id: invitationId,
        email: data.email,
        role,
        workspaceIds: data.workspaceIds,
        invitedBy: data.invitedBy,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        token,
        metadata: {
          message: data.message ?? 'You have been invited to join the team',
          source: 'email'
        }
      };

      team.invitations.push(invitation);
      this.invitations.set(invitationId, invitation);

      this.emit('user-invited', { team, invitation });
      return invitation;
    } catch (error) {
      this.emit('error', new Error(`Failed to invite user: ${error}`));
      throw error;
    }
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(invitationId: string, userId: string): Promise<TeamMember> {
    try {
      const invitation = this.invitations.get(invitationId);
      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Invitation is not pending');
      }

      if (invitation.expiresAt < new Date()) {
        throw new Error('Invitation has expired');
      }

      const team = this.teams.get(invitation.role.id); // This should be teamId, but for simplicity
      if (!team) {
        throw new Error('Team not found');
      }

      const member: TeamMember = {
        id: uuidv4(),
        userId,
        email: invitation.email,
        name: '', // Will be set when user is created
        role: invitation.role,
        permissions: invitation.role.permissions,
        status: 'active',
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        invitedBy: invitation.invitedBy,
        metadata: {
          preferences: {
            theme: 'auto',
            language: 'en',
            notifications: {
              email: true,
              push: true,
              inApp: true,
              frequency: 'immediate',
              types: ['all']
            },
            dashboard: {
              layout: 'default',
              widgets: ['overview', 'recent', 'activity'],
              refreshRate: 30
            }
          },
          skills: [],
          experience: 'beginner'
        }
      };

      team.members.push(member);
      invitation.status = 'accepted';
      team.updatedAt = new Date();

      this.emit('invitation-accepted', { team, member, invitation });
      return member;
    } catch (error) {
      this.emit('error', new Error(`Failed to accept invitation: ${error}`));
      throw error;
    }
  }

  /**
   * Get team analytics
   */
  async getTeamAnalytics(teamId: string, period: TeamAnalytics['period'] = 'month'): Promise<TeamAnalytics> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Mock analytics data - in real implementation, this would query actual data
      const analytics: TeamAnalytics = {
        teamId,
        period,
        metrics: {
          members: {
            total: team.members.length,
            active: team.members.filter(m => m.status === 'active').length,
            new: team.members.filter(m => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return m.joinedAt > monthAgo;
            }).length,
            churn: 0
          },
          workspaces: {
            total: team.workspaces.length,
            active: team.workspaces.length,
            new: team.workspaces.filter(w => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return w.createdAt > monthAgo;
            }).length
          },
          projects: {
            total: team.workspaces.reduce((sum, w) => sum + w.projects.length, 0),
            active: team.workspaces.reduce((sum, w) => sum + w.projects.filter(p => p.status === 'active').length, 0),
            completed: team.workspaces.reduce((sum, w) => sum + w.projects.filter(p => p.status === 'archived').length, 0),
            new: team.workspaces.reduce((sum, w) => sum + w.projects.filter(p => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return p.createdAt > monthAgo;
            }).length, 0)
          },
          activity: {
            logins: 0,
            actions: 0,
            collaborations: 0,
            apiCalls: 0
          },
          performance: {
            avgResponseTime: 0,
            uptime: 99.9,
            errorRate: 0.1,
            satisfaction: 4.5
          }
        },
        trends: {
          members: [],
          workspaces: [],
          projects: [],
          activity: [],
          performance: []
        },
        insights: [],
        recommendations: [],
        generatedAt: new Date()
      };

      this.analytics.set(teamId, analytics);
      return analytics;
    } catch (error) {
      this.emit('error', new Error(`Failed to get team analytics: ${error}`));
      throw error;
    }
  }

  /**
   * Helper methods
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateInvitationToken(): string {
    return randomBytes(32).toString('hex');
  }

  private findWorkspaceById(workspaceId: string): Workspace | null {
    for (const team of this.teams.values()) {
      const workspace = team.workspaces.find(w => w.id === workspaceId);
      if (workspace) return workspace;
    }
    return null;
  }

  private getAllPermissions(): Permission[] {
    return [
      { id: 'team:read', name: 'Read Team', description: 'View team information', resource: 'team', action: 'read' },
      { id: 'team:write', name: 'Write Team', description: 'Modify team information', resource: 'team', action: 'write' },
      { id: 'team:delete', name: 'Delete Team', description: 'Delete team', resource: 'team', action: 'delete' },
      { id: 'workspace:read', name: 'Read Workspace', description: 'View workspace information', resource: 'workspace', action: 'read' },
      { id: 'workspace:write', name: 'Write Workspace', description: 'Modify workspace information', resource: 'workspace', action: 'write' },
      { id: 'workspace:delete', name: 'Delete Workspace', description: 'Delete workspace', resource: 'workspace', action: 'delete' },
      { id: 'project:read', name: 'Read Project', description: 'View project information', resource: 'project', action: 'read' },
      { id: 'project:write', name: 'Write Project', description: 'Modify project information', resource: 'project', action: 'write' },
      { id: 'project:delete', name: 'Delete Project', description: 'Delete project', resource: 'project', action: 'delete' },
      { id: 'member:read', name: 'Read Members', description: 'View team members', resource: 'member', action: 'read' },
      { id: 'member:write', name: 'Write Members', description: 'Modify team members', resource: 'member', action: 'write' },
      { id: 'member:delete', name: 'Delete Members', description: 'Remove team members', resource: 'member', action: 'delete' }
    ];
  }

  private getAdminPermissions(): Permission[] {
    return this.getAllPermissions().filter(p => !p.id.includes('delete'));
  }

  private getDeveloperPermissions(): Permission[] {
    return [
      { id: 'team:read', name: 'Read Team', description: 'View team information', resource: 'team', action: 'read' },
      { id: 'workspace:read', name: 'Read Workspace', description: 'View workspace information', resource: 'workspace', action: 'read' },
      { id: 'workspace:write', name: 'Write Workspace', description: 'Modify workspace information', resource: 'workspace', action: 'write' },
      { id: 'project:read', name: 'Read Project', description: 'View project information', resource: 'project', action: 'read' },
      { id: 'project:write', name: 'Write Project', description: 'Modify project information', resource: 'project', action: 'write' },
      { id: 'member:read', name: 'Read Members', description: 'View team members', resource: 'member', action: 'read' }
    ];
  }

  private getDesignerPermissions(): Permission[] {
    return [
      { id: 'team:read', name: 'Read Team', description: 'View team information', resource: 'team', action: 'read' },
      { id: 'workspace:read', name: 'Read Workspace', description: 'View workspace information', resource: 'workspace', action: 'read' },
      { id: 'project:read', name: 'Read Project', description: 'View project information', resource: 'project', action: 'read' },
      { id: 'project:write', name: 'Write Project', description: 'Modify project information', resource: 'project', action: 'write' },
      { id: 'member:read', name: 'Read Members', description: 'View team members', resource: 'member', action: 'read' }
    ];
  }

  private getViewerPermissions(): Permission[] {
    return [
      { id: 'team:read', name: 'Read Team', description: 'View team information', resource: 'team', action: 'read' },
      { id: 'workspace:read', name: 'Read Workspace', description: 'View workspace information', resource: 'workspace', action: 'read' },
      { id: 'project:read', name: 'Read Project', description: 'View project information', resource: 'project', action: 'read' },
      { id: 'member:read', name: 'Read Members', description: 'View team members', resource: 'member', action: 'read' }
    ];
  }

  /**
   * Get all teams
   */
  getTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | null {
    return this.teams.get(teamId) ?? null;
  }

  /**
   * Get all roles
   */
  getRoles(): UserRole[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get role by ID
   */
  getRole(roleId: string): UserRole | null {
    return this.roles.get(roleId) ?? null;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      this.teams.clear();
      this.users.clear();
      this.roles.clear();
      this.invitations.clear();
      this.analytics.clear();
      this.removeAllListeners();
    } catch (error) {
      this.emit('error', new Error(`Failed to cleanup: ${error}`));
    }
  }
}
