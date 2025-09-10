// Main entry point for React Responsive Easy CLI

export { initCommand } from './commands/init';
export { buildCommand } from './commands/build';
export { analyzeCommand } from './commands/analyze';
export { devCommand } from './commands/dev';
export { aiCommand } from './commands/ai';
export { performanceCommand } from './commands/performance';
export { createCICommands } from './commands/ci';
export { createTeamCommands } from './commands/team';
export { createSecurityCommands } from './commands/security';
export { createPluginCommands } from './commands/plugin';
export { createCloudCommands } from './commands/cloud';
export { analyticsCommand } from './commands/analytics';
export { enterpriseCommand } from './commands/enterprise';

// Enterprise CLI Core
export { EnterpriseCLI } from './core/EnterpriseCLI';
export type { 
  EnterpriseConfig, 
  ProjectMetadata, 
  AnalysisResult 
} from './core/EnterpriseCLI';

// Enterprise Services
export { AIIntegrationService } from './services/AIIntegrationService';
export type { 
  AIAnalysisOptions, 
  AIRecommendation, 
  AIInsight 
} from './services/AIIntegrationService';

export { PerformanceIntegrationService } from './services/PerformanceIntegrationService';
export type { 
  PerformanceSnapshot, 
  PerformanceReportData 
} from './services/PerformanceIntegrationService';

export { CICDService } from './services/CICDService';
export type { 
  CICDConfiguration, 
  CICDWorkflow, 
  CICDStatus, 
  CICDReport 
} from './services/CICDService';

export { TeamService } from './services/TeamService';
export type { 
  Team, 
  Workspace, 
  Project, 
  TeamMember, 
  UserRole 
} from './services/TeamService';

export { CollaborationService } from './services/CollaborationService';
export type { 
  CollaborationSession, 
  CollaborationParticipant, 
  ConfigurationChange 
} from './services/CollaborationService';

export { SecurityService } from './services/SecurityService';
export type { 
  SecurityConfig, 
  SecurityEvent, 
  SecurityAnalytics 
} from './services/SecurityService';

export { OAuthService } from './integrations/oauth/OAuthService';
export type { 
  OAuthProvider, 
  OAuthToken, 
  OAuthUser, 
  OAuthSession 
} from './integrations/oauth/OAuthService';

export { PluginManager } from './services/PluginManager';
export type { 
  Plugin, 
  PluginRegistry, 
  PluginAnalytics 
} from './services/PluginManager';

export { CloudService } from './services/CloudService';
export type { 
  CloudProvider, 
  CloudDeployment, 
  CloudAnalytics,
  CloudServiceInstance
} from './services/CloudService';

export { AnalyticsService } from './services/AnalyticsService';
export type { 
  AnalyticsConfig, 
  AnalyticsData, 
  AnalyticsInsight, 
  AnalyticsReport 
} from './services/AnalyticsService';

export { MLIntegrationService } from './services/MLIntegrationService';
export type { 
  MLModel, 
  MLPrediction, 
  MLTrainingJob, 
  MLDataset 
} from './services/MLIntegrationService';

export { DataVisualizationService } from './services/DataVisualizationService';
export type { 
  VisualizationConfig, 
  Visualization, 
  Dashboard, 
  ChartData 
} from './services/DataVisualizationService';

export { EnterpriseConfigService } from './services/EnterpriseConfigService';
export type { 
  EnterpriseConfig as EnterpriseConfigType, 
  OrganizationConfig, 
  SecurityConfig as EnterpriseSecurityConfig, 
  ComplianceConfig as EnterpriseComplianceConfig 
} from './services/EnterpriseConfigService';

export { EnterpriseAuditService } from './services/EnterpriseAuditService';
export type { 
  AuditConfig, 
  AuditEvent, 
  AuditReport, 
  ComplianceStandard 
} from './services/EnterpriseAuditService';

export type { PluginAPI } from './api/PluginAPI';
export type { 
  PluginAPI as PluginAPIType, 
  PluginCommandDefinition, 
  PluginHookDefinition 
} from './api/PluginAPI';

// CLI version and information
export const CLI_VERSION = '2.0.0';
export const CLI_NAME = '@yaseratiar/react-responsive-easy-cli';

// Re-export types for convenience
export type { Command } from 'commander';
