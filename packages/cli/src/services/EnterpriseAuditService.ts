import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import * as crypto from 'crypto';

// Audit and Compliance Types
export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  category: AuditCategory;
  severity: AuditSeverity;
  source: AuditSource;
  user: AuditUser;
  resource: AuditResource;
  action: AuditAction;
  result: AuditResult;
  details: AuditDetails;
  metadata: AuditMetadata;
  compliance: ComplianceInfo;
  integrity: IntegrityInfo;
}

export type AuditEventType = 
  | 'authentication' 
  | 'authorization' 
  | 'data_access' 
  | 'data_modification' 
  | 'configuration_change' 
  | 'system_event' 
  | 'security_event' 
  | 'compliance_event' 
  | 'business_event' 
  | 'custom';

export type AuditCategory = 
  | 'security' 
  | 'compliance' 
  | 'operational' 
  | 'business' 
  | 'technical' 
  | 'administrative';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditSource {
  system: string;
  component: string;
  version: string;
  environment: string;
  hostname: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  requestId: string;
}

export interface AuditUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  groups: string[];
  department: string;
  location: string;
  attributes: Record<string, any>;
}

export interface AuditResource {
  type: string;
  id: string;
  name: string;
  path: string;
  owner: string;
  classification: string;
  sensitivity: string;
  location: string;
  attributes: Record<string, any>;
}

export interface AuditAction {
  type: string;
  operation: string;
  method: string;
  parameters: Record<string, any>;
  input: any;
  output: any;
  duration: number; // milliseconds
  statusCode: number;
}

export interface AuditResult {
  success: boolean;
  error?: string;
  message: string;
  code: string;
  details: Record<string, any>;
}

export interface AuditDetails {
  description: string;
  context: Record<string, any>;
  changes: ChangeRecord[];
  before: any;
  after: any;
  tags: string[];
  custom: Record<string, any>;
}

export interface ChangeRecord {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'add' | 'update' | 'delete';
  timestamp: Date;
}

export interface AuditMetadata {
  version: string;
  schema: string;
  retention: number; // days
  encryption: boolean;
  compression: boolean;
  indexed: boolean;
  searchable: boolean;
  exportable: boolean;
}

export interface ComplianceInfo {
  standards: string[];
  requirements: string[];
  controls: string[];
  policies: string[];
  regulations: string[];
  certifications: string[];
  assessments: string[];
  violations: ComplianceViolation[];
}

export interface ComplianceViolation {
  id: string;
  standard: string;
  requirement: string;
  severity: AuditSeverity;
  description: string;
  remediation: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}

export interface IntegrityInfo {
  hash: string;
  algorithm: string;
  signature?: string;
  certificate?: string;
  timestamp: Date;
  verified: boolean;
}

export interface AuditConfig {
  enabled: boolean;
  level: AuditLevel;
  retention: number; // days
  storage: AuditStorage;
  encryption: AuditEncryption;
  compression: boolean;
  realTime: boolean;
  batchSize: number;
  flushInterval: number; // seconds
  filters: AuditFilter[];
  rules: AuditRule[];
  compliance: ComplianceConfig;
  reporting: ReportingConfig;
}

export type AuditLevel = 'minimal' | 'standard' | 'detailed' | 'comprehensive';

export interface AuditStorage {
  type: 'local' | 'database' | 'cloud' | 'siem';
  location: string;
  credentials?: Record<string, any>;
  partitioning: boolean;
  archiving: boolean;
  backup: boolean;
}

export interface AuditEncryption {
  enabled: boolean;
  algorithm: string;
  keyRotation: number; // days
  keyStorage: 'local' | 'hsm' | 'cloud';
  transport: boolean;
  atRest: boolean;
}

export interface AuditFilter {
  id: string;
  name: string;
  condition: string;
  action: 'include' | 'exclude' | 'mask';
  enabled: boolean;
  priority: number;
}

export interface AuditRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'log' | 'alert' | 'block' | 'notify';
  severity: AuditSeverity;
  enabled: boolean;
  threshold?: number;
  timeWindow?: number; // seconds
}

export interface ComplianceConfig {
  standards: ComplianceStandard[];
  assessments: Assessment[];
  reporting: ComplianceReporting;
  monitoring: ComplianceMonitoring;
}

export interface ComplianceStandard {
  name: string;
  version: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_assessed';
  requirements: Requirement[];
  controls: Control[];
  lastAssessment: Date;
  nextAssessment: Date;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'implemented' | 'partial' | 'not_implemented';
  evidence: Evidence[];
  owner: string;
  dueDate: Date;
}

export interface Control {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  owner: string;
  status: 'effective' | 'ineffective' | 'not_tested';
  lastTested: Date;
  nextTest: Date;
  results: TestResult[];
}

export interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'log' | 'test' | 'interview';
  title: string;
  description: string;
  location: string;
  collected: Date;
  collector: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface TestResult {
  id: string;
  testDate: Date;
  tester: string;
  result: 'pass' | 'fail' | 'partial';
  details: string;
  recommendations: string[];
  followUp?: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'audit';
  standard: string;
  assessor: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scope: string[];
  findings: Finding[];
  recommendations: Recommendation[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  category: string;
  standard: string;
  requirement: string;
  control: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
  remediation: string;
  dueDate: Date;
  owner: string;
  evidence: Evidence[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dueDate: Date;
  owner: string;
  dependencies: string[];
}

export interface ComplianceReporting {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  recipients: string[];
  formats: ('pdf' | 'excel' | 'json' | 'html')[];
  automated: boolean;
  templates: string[];
  dashboards: string[];
}

export interface ComplianceMonitoring {
  enabled: boolean;
  realTime: boolean;
  alerts: boolean;
  metrics: string[];
  thresholds: Record<string, number>;
  notifications: string[];
}

export interface ReportingConfig {
  enabled: boolean;
  frequency: string;
  recipients: string[];
  formats: string[];
  templates: string[];
  automated: boolean;
  retention: number; // days
}

export interface AuditReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'compliance' | 'security' | 'custom';
  period: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  data: AuditEvent[];
  summary: AuditSummary;
  findings: Finding[];
  recommendations: Recommendation[];
  compliance: ComplianceSummary;
  generatedAt: Date;
  generatedBy: string;
  format: 'json' | 'pdf' | 'excel' | 'html';
}

export interface AuditSummary {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  eventsByUser: Record<string, number>;
  eventsByResource: Record<string, number>;
  successRate: number;
  errorRate: number;
  averageDuration: number;
  topUsers: Array<{ user: string; count: number }>;
  topResources: Array<{ resource: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
  anomalies: Anomaly[];
  trends: Trend[];
}

export interface ComplianceSummary {
  standards: Array<{
    name: string;
    status: string;
    score: number;
    requirements: number;
    implemented: number;
    partial: number;
    notImplemented: number;
  }>;
  overallScore: number;
  overallGrade: string;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  openFindings: number;
  resolvedFindings: number;
  overdueFindings: number;
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: AuditSeverity;
  detectedAt: Date;
  confidence: number;
  data: Record<string, any>;
  recommendations: string[];
}

export interface Trend {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: number;
  period: {
    start: Date;
    end: Date;
  };
  data: Array<{ date: Date; value: number }>;
}

export class EnterpriseAuditService extends EventEmitter {
  private config: AuditConfig;
  private events: Map<string, AuditEvent> = new Map();
  private reports: Map<string, AuditReport> = new Map();
  private compliance: Map<string, ComplianceStandard> = new Map();
  private assessments: Map<string, Assessment> = new Map();
  private isProcessing: boolean = false;
  private processingQueue: AuditEvent[] = [];

  constructor(config: AuditConfig) {
    super();
    this.config = config;
    this.initializeService();
  }

  /**
   * Initialize audit service
   */
  private initializeService(): void {
    if (this.config.enabled) {
      this.startProcessing();
      this.emit('audit-service-initialized', { config: this.config });
    }
  }

  /**
   * Start event processing
   */
  private startProcessing(): void {
    if (this.config.realTime) {
      this.startRealTimeProcessing();
    }
    
    setInterval(() => {
      this.processBatch();
    }, this.config.flushInterval * 1000);
  }

  /**
   * Start real-time processing
   */
  private startRealTimeProcessing(): void {
    this.emit('real-time-processing-started');
  }

  /**
   * Process batch events
   */
  private async processBatch(): Promise<void> {
    if (this.processingQueue.length === 0) return;
    
    this.isProcessing = true;
    try {
      const batch = this.processingQueue.splice(0, this.config.batchSize);
      await this.processEvents(batch);
      this.emit('batch-processed', { count: batch.length });
    } catch (error) {
      this.emit('batch-processing-error', { error });
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process audit events
   */
  private async processEvents(events: AuditEvent[]): Promise<void> {
    for (const event of events) {
      try {
        // Apply filters
        if (!this.shouldLogEvent(event)) {
          continue;
        }

        // Apply rules
        await this.applyRules(event);

        // Store event
        this.events.set(event.id, event);

        // Check compliance
        await this.checkCompliance(event);

        // Emit event
        this.emit('audit-event-processed', event);

      } catch (error) {
        this.emit('event-processing-error', { event, error });
      }
    }
  }

  /**
   * Check if event should be logged
   */
  private shouldLogEvent(event: AuditEvent): boolean {
    for (const filter of this.config.filters) {
      if (!filter.enabled) continue;
      
      if (this.evaluateCondition(filter.condition, event)) {
        switch (filter.action) {
          case 'include':
            return true;
          case 'exclude':
            return false;
          case 'mask':
            // Mask sensitive data
            this.maskSensitiveData(event);
            return true;
        }
      }
    }
    return true;
  }

  /**
   * Apply audit rules
   */
  private async applyRules(event: AuditEvent): Promise<void> {
    for (const rule of this.config.rules) {
      if (!rule.enabled) continue;
      
      if (this.evaluateCondition(rule.condition, event)) {
        switch (rule.action) {
          case 'log':
            // Already logged
            break;
          case 'alert':
            await this.createAlert(event, rule);
            break;
          case 'block':
            await this.blockAction(event, rule);
            break;
          case 'notify':
            await this.sendNotification(event, rule);
            break;
        }
      }
    }
  }

  /**
   * Evaluate condition safely without eval
   */
  private evaluateCondition(condition: string, event: AuditEvent): boolean {
    try {
      // Safe condition evaluation using a simple parser
      return this.safeEvaluateExpression(condition, event);
    } catch (error) {
      this.emit('condition-evaluation-error', { condition, error });
      return false;
    }
  }

  /**
   * Safe expression evaluator that doesn't use eval
   */
  private safeEvaluateExpression(condition: string, event: AuditEvent): boolean {
    // Replace placeholders with actual values
    let expr = condition
      .replace(/\{eventType\}/g, `"${event.eventType}"`)
      .replace(/\{category\}/g, `"${event.category}"`)
      .replace(/\{severity\}/g, `"${event.severity}"`)
      .replace(/\{user\.id\}/g, `"${event.user.id}"`)
      .replace(/\{resource\.type\}/g, `"${event.resource.type}"`)
      .replace(/\{action\.type\}/g, `"${event.action.type}"`)
      .replace(/\{result\.success\}/g, event.result.success.toString());

    // Simple boolean expression parser for common patterns
    return this.parseBooleanExpression(expr);
  }

  /**
   * Parse simple boolean expressions safely
   */
  private parseBooleanExpression(expr: string): boolean {
    // Handle simple equality comparisons
    if (expr.includes('===')) {
      const [left, right] = expr.split('===').map(s => s.trim());
      return this.parseValue(left!) === this.parseValue(right!);
    }
    
    if (expr.includes('!==')) {
      const [left, right] = expr.split('!==').map(s => s.trim());
      return this.parseValue(left!) !== this.parseValue(right!);
    }
    
    if (expr.includes('==')) {
      const [left, right] = expr.split('==').map(s => s.trim());
      return this.parseValue(left!) == this.parseValue(right!);
    }
    
    if (expr.includes('!=')) {
      const [left, right] = expr.split('!=').map(s => s.trim());
      return this.parseValue(left!) != this.parseValue(right!);
    }

    // Handle logical operators
    if (expr.includes('&&')) {
      const parts = expr.split('&&').map(s => s.trim());
      return parts.every(part => this.parseBooleanExpression(part));
    }
    
    if (expr.includes('||')) {
      const parts = expr.split('||').map(s => s.trim());
      return parts.some(part => this.parseBooleanExpression(part));
    }

    // Handle negation
    if (expr.startsWith('!')) {
      return !this.parseBooleanExpression(expr.substring(1).trim());
    }

    // Handle parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return this.parseBooleanExpression(expr.slice(1, -1));
    }

    // Handle simple boolean values
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    
    // Handle string comparisons
    if (expr.startsWith('"') && expr.endsWith('"')) {
      return expr.length > 2; // Non-empty string is truthy
    }

    // Default to false for unknown expressions
    return false;
  }

  /**
   * Parse values safely
   */
  private parseValue(value: string): any {
    value = value.trim();
    
    // Handle strings
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    
    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Handle numbers
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    
    return value;
  }

  /**
   * Create alert
   */
  private async createAlert(event: AuditEvent, rule: AuditRule): Promise<void> {
    const alert = {
      id: uuidv4(),
      ruleId: rule.id,
      eventId: event.id,
      severity: rule.severity,
      message: `Audit rule triggered: ${rule.name}`,
      timestamp: new Date(),
      event,
      rule
    };

    this.emit('audit-alert', alert);
  }

  /**
   * Block action
   */
  private async blockAction(event: AuditEvent, rule: AuditRule): Promise<void> {
    const block = {
      id: uuidv4(),
      ruleId: rule.id,
      eventId: event.id,
      action: 'block',
      reason: `Blocked by audit rule: ${rule.name}`,
      timestamp: new Date(),
      event,
      rule
    };

    this.emit('audit-block', block);
  }

  /**
   * Send notification
   */
  private async sendNotification(event: AuditEvent, rule: AuditRule): Promise<void> {
    const notification = {
      id: uuidv4(),
      ruleId: rule.id,
      eventId: event.id,
      type: 'audit_notification',
      message: `Audit event requires attention: ${event.eventType}`,
      timestamp: new Date(),
      event,
      rule
    };

    this.emit('audit-notification', notification);
  }

  /**
   * Check compliance
   */
  private async checkCompliance(event: AuditEvent): Promise<void> {
    for (const standard of this.config.compliance.standards) {
      await this.checkStandardCompliance(event, standard);
    }
  }

  /**
   * Check standard compliance
   */
  private async checkStandardCompliance(event: AuditEvent, standard: ComplianceStandard): Promise<void> {
    // Check if event violates any requirements
    for (const requirement of standard.requirements) {
      if (this.violatesRequirement(event, requirement)) {
        const violation: ComplianceViolation = {
          id: uuidv4(),
          standard: standard.name,
          requirement: requirement.id,
          severity: 'medium',
          description: `Event violates requirement: ${requirement.title}`,
          remediation: 'Review and correct the action',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'open'
        };

        event.compliance.violations.push(violation);
        this.emit('compliance-violation', { event, violation, standard, requirement });
      }
    }
  }

  /**
   * Check if event violates requirement
   */
  private violatesRequirement(event: AuditEvent, requirement: Requirement): boolean {
    // Simple violation detection - in a real implementation, you would have more sophisticated logic
    if (requirement.status === 'not_implemented') {
      return true;
    }

    // Check for specific violations based on event type and requirement
    if (event.eventType === 'data_access' && requirement.category === 'data_protection') {
      return !event.result.success;
    }

    if (event.eventType === 'authentication' && requirement.category === 'access_control') {
      return event.severity === 'high' || event.severity === 'critical';
    }

    return false;
  }

  /**
   * Mask sensitive data
   */
  private maskSensitiveData(event: AuditEvent): void {
    // Mask sensitive fields
    if (event.user.email) {
      event.user.email = this.maskEmail(event.user.email);
    }

    if (event.resource.path) {
      event.resource.path = this.maskPath(event.resource.path);
    }

    if (event.action.input) {
      event.action.input = this.maskObject(event.action.input);
    }

    if (event.action.output) {
      event.action.output = this.maskObject(event.action.output);
    }
  }

  /**
   * Mask email
   */
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    return `${local?.substring(0, 2) ?? '**'}***@${domain}`;
  }

  /**
   * Mask path
   */
  private maskPath(path: string): string {
    return path.replace(/\/[^\/]+/g, '/***');
  }

  /**
   * Mask object
   */
  private maskObject(obj: any): any {
    if (typeof obj === 'string') {
      return '***MASKED***';
    }
    if (typeof obj === 'object' && obj !== null) {
      const masked: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.isSensitiveField(key)) {
          masked[key] = '***MASKED***';
        } else {
          masked[key] = this.maskObject(value);
        }
      }
      return masked;
    }
    return obj;
  }

  /**
   * Check if field is sensitive
   */
  private isSensitiveField(field: string): boolean {
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'ssn', 'credit_card', 'email', 'phone'];
    return sensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
  }

  /**
   * Log audit event
   */
  async logEvent(eventData: Omit<AuditEvent, 'id' | 'timestamp' | 'integrity' | 'compliance'>): Promise<AuditEvent> {
    const event: AuditEvent = {
      id: uuidv4(),
      timestamp: new Date(),
      integrity: this.calculateIntegrity(eventData),
      compliance: {
        standards: [],
        requirements: [],
        controls: [],
        policies: [],
        regulations: [],
        certifications: [],
        assessments: [],
        violations: []
      },
      ...eventData
    };

    // Add to processing queue
    this.processingQueue.push(event);

    // Process immediately if real-time
    if (this.config.realTime) {
      await this.processEvents([event]);
    }

    this.emit('audit-event-logged', event);
    return event;
  }

  /**
   * Calculate integrity hash
   */
  private calculateIntegrity(eventData: any): IntegrityInfo {
    const data = JSON.stringify(eventData, null, 2);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    
    return {
      hash,
      algorithm: 'SHA-256',
      timestamp: new Date(),
      verified: true
    };
  }

  /**
   * Generate audit report
   */
  async generateReport(config: {
    name: string;
    type: 'summary' | 'detailed' | 'compliance' | 'security' | 'custom';
    period: { start: Date; end: Date };
    filters?: Record<string, any>;
    format: 'json' | 'pdf' | 'excel' | 'html';
  }): Promise<AuditReport> {
    const reportId = uuidv4();
    
    // Get events for the period
    const periodEvents = Array.from(this.events.values())
      .filter(e => e.timestamp >= config.period.start && e.timestamp <= config.period.end);
    
    // Apply filters
    let filteredEvents = periodEvents;
    if (config.filters) {
      filteredEvents = this.applyFilters(periodEvents, config.filters);
    }
    
    // Generate summary
    const summary = this.generateSummary(filteredEvents);
    
    // Generate findings
    const findings = this.generateFindings(filteredEvents);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(filteredEvents, findings);
    
    // Generate compliance summary
    const compliance = this.generateComplianceSummary(filteredEvents);
    
    const report: AuditReport = {
      id: reportId,
      name: config.name,
      type: config.type,
      period: config.period,
      filters: config.filters || {},
      data: filteredEvents,
      summary,
      findings,
      recommendations,
      compliance,
      generatedAt: new Date(),
      generatedBy: 'system',
      format: config.format
    };

    this.reports.set(reportId, report);
    this.emit('audit-report-generated', report);

    return report;
  }

  /**
   * Apply filters to events
   */
  private applyFilters(events: AuditEvent[], filters: Record<string, any>): AuditEvent[] {
    return events.filter(event => {
      for (const [key, value] of Object.entries(filters)) {
        if (this.getEventValue(event, key) !== value) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Get event value by path
   */
  private getEventValue(event: AuditEvent, path: string): any {
    const keys = path.split('.');
    let value: any = event;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Generate audit summary
   */
  private generateSummary(events: AuditEvent[]): AuditSummary {
    const eventsByType: Record<string, number> = {};
    const eventsByCategory: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const eventsByUser: Record<string, number> = {};
    const eventsByResource: Record<string, number> = {};
    const eventsByAction: Record<string, number> = {};
    
    let totalDuration = 0;
    let successCount = 0;
    
    events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      eventsByUser[event.user.id] = (eventsByUser[event.user.id] || 0) + 1;
      eventsByResource[event.resource.type] = (eventsByResource[event.resource.type] || 0) + 1;
      eventsByAction[event.action.type] = (eventsByAction[event.action.type] || 0) + 1;
      
      totalDuration += event.action.duration;
      if (event.result.success) successCount++;
    });
    
    const topUsers = Object.entries(eventsByUser)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const topResources = Object.entries(eventsByResource)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const topActions = Object.entries(eventsByAction)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalEvents: events.length,
      eventsByType,
      eventsByCategory,
      eventsBySeverity,
      eventsByUser,
      eventsByResource,
      successRate: events.length > 0 ? (successCount / events.length) * 100 : 0,
      errorRate: events.length > 0 ? ((events.length - successCount) / events.length) * 100 : 0,
      averageDuration: events.length > 0 ? totalDuration / events.length : 0,
      topUsers,
      topResources,
      topActions,
      anomalies: this.detectAnomalies(events),
      trends: this.detectTrends(events)
    };
  }

  /**
   * Detect anomalies
   */
  private detectAnomalies(events: AuditEvent[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    // Detect unusual patterns
    const userActivity = new Map<string, number>();
    const resourceAccess = new Map<string, number>();
    const timePatterns = new Map<number, number>();
    
    events.forEach(event => {
      userActivity.set(event.user.id, (userActivity.get(event.user.id) || 0) + 1);
      resourceAccess.set(event.resource.id, (resourceAccess.get(event.resource.id) || 0) + 1);
      timePatterns.set(event.timestamp.getHours(), (timePatterns.get(event.timestamp.getHours()) || 0) + 1);
    });
    
    // Detect unusual user activity
    const avgActivity = events.length / userActivity.size;
    for (const [user, count] of userActivity.entries()) {
      if (count > avgActivity * 3) {
        anomalies.push({
          id: uuidv4(),
          type: 'unusual_user_activity',
          description: `User ${user} has unusually high activity: ${count} events`,
          severity: 'medium',
          detectedAt: new Date(),
          confidence: 0.8,
          data: { user, count, average: avgActivity },
          recommendations: ['Review user activity', 'Check for compromised account']
        });
      }
    }
    
    // Detect unusual resource access
    const avgResourceAccess = events.length / resourceAccess.size;
    for (const [resource, count] of resourceAccess.entries()) {
      if (count > avgResourceAccess * 5) {
        anomalies.push({
          id: uuidv4(),
          type: 'unusual_resource_access',
          description: `Resource ${resource} has unusually high access: ${count} events`,
          severity: 'high',
          detectedAt: new Date(),
          confidence: 0.9,
          data: { resource, count, average: avgResourceAccess },
          recommendations: ['Review resource access patterns', 'Check for unauthorized access']
        });
      }
    }
    
    return anomalies;
  }

  /**
   * Detect trends
   */
  private detectTrends(events: AuditEvent[]): Trend[] {
    const trends: Trend[] = [];
    
    // Group events by hour
    const hourlyEvents = new Map<number, number>();
    events.forEach(event => {
      const hour = Math.floor(event.timestamp.getTime() / (1000 * 60 * 60));
      hourlyEvents.set(hour, (hourlyEvents.get(hour) || 0) + 1);
    });
    
    if (hourlyEvents.size > 1) {
      const hours = Array.from(hourlyEvents.keys()).sort();
      const values = hours.map(hour => hourlyEvents.get(hour) || 0);
      
      // Simple trend calculation
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      
      let direction: 'increasing' | 'decreasing' | 'stable';
      if (secondAvg > firstAvg * 1.1) {
        direction = 'increasing';
      } else if (secondAvg < firstAvg * 0.9) {
        direction = 'decreasing';
      } else {
        direction = 'stable';
      }
      
      trends.push({
        metric: 'event_volume',
        direction,
        strength: Math.abs(secondAvg - firstAvg) / firstAvg,
        period: {
          start: new Date((hours[0] ?? 0) * 1000 * 60 * 60),
          end: new Date((hours[hours.length - 1] ?? 0) * 1000 * 60 * 60)
        },
        data: hours.map((hour, index) => ({
          date: new Date(hour * 1000 * 60 * 60),
          value: values[index] ?? 0
        }))
      });
    }
    
    return trends;
  }

  /**
   * Generate findings
   */
  private generateFindings(events: AuditEvent[]): Finding[] {
    const findings: Finding[] = [];
    
    // Find failed authentication attempts
    const failedAuths = events.filter(e => 
      e.eventType === 'authentication' && !e.result.success
    );
    
    if (failedAuths.length > 10) {
      findings.push({
        id: uuidv4(),
        title: 'High Number of Failed Authentication Attempts',
        description: `Found ${failedAuths.length} failed authentication attempts`,
        severity: 'high',
        category: 'security',
        standard: 'ISO27001',
        requirement: 'A.9.2.1',
        control: 'A.9.2.1',
        status: 'open',
        remediation: 'Review authentication logs and implement account lockout policies',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        owner: 'security_team',
        evidence: []
      });
    }
    
    // Find unauthorized access attempts
    const unauthorizedAccess = events.filter(e => 
      e.eventType === 'authorization' && !e.result.success
    );
    
    if (unauthorizedAccess.length > 5) {
      findings.push({
        id: uuidv4(),
        title: 'Unauthorized Access Attempts Detected',
        description: `Found ${unauthorizedAccess.length} unauthorized access attempts`,
        severity: 'critical',
        category: 'security',
        standard: 'ISO27001',
        requirement: 'A.9.1.1',
        control: 'A.9.1.1',
        status: 'open',
        remediation: 'Investigate unauthorized access attempts and strengthen access controls',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        owner: 'security_team',
        evidence: []
      });
    }
    
    return findings;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(events: AuditEvent[], findings: Finding[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Generate recommendations based on findings
    findings.forEach(finding => {
      recommendations.push({
        id: uuidv4(),
        title: `Address ${finding.title}`,
        description: finding.remediation,
        priority: finding.severity === 'critical' ? 'critical' : 
                 finding.severity === 'high' ? 'high' : 
                 finding.severity === 'medium' ? 'medium' : 'low',
        effort: 'medium',
        impact: finding.severity === 'critical' ? 'high' : 
                finding.severity === 'high' ? 'high' : 'medium',
        status: 'pending',
        dueDate: finding.dueDate,
        owner: finding.owner,
        dependencies: []
      });
    });
    
    // Generate general recommendations
    const errorRate = events.length > 0 ? 
      (events.filter(e => !e.result.success).length / events.length) * 100 : 0;
    
    if (errorRate > 10) {
      recommendations.push({
        id: uuidv4(),
        title: 'Improve System Reliability',
        description: `Error rate is ${errorRate.toFixed(1)}%, which is above acceptable threshold`,
        priority: 'high',
        effort: 'high',
        impact: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        owner: 'operations_team',
        dependencies: []
      });
    }
    
    return recommendations;
  }

  /**
   * Generate compliance summary
   */
  private generateComplianceSummary(events: AuditEvent[]): ComplianceSummary {
    const standards = Array.from(this.compliance.values()).map(standard => {
      const totalRequirements = standard.requirements.length;
      const implemented = standard.requirements.filter(r => r.status === 'implemented').length;
      const partial = standard.requirements.filter(r => r.status === 'partial').length;
      const notImplemented = standard.requirements.filter(r => r.status === 'not_implemented').length;
      
      const score = totalRequirements > 0 ? (implemented + partial * 0.5) / totalRequirements * 100 : 0;
      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
      
      return {
        name: standard.name,
        status: standard.status,
        score,
        requirements: totalRequirements,
        implemented,
        partial,
        notImplemented
      };
    });
    
    const overallScore = standards.length > 0 ? 
      standards.reduce((sum, s) => sum + s.score, 0) / standards.length : 0;
    const overallGrade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : 
                        overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F';
    
    const violations = events.flatMap(e => e.compliance.violations);
    const criticalFindings = violations.filter(v => v.severity === 'critical').length;
    const highFindings = violations.filter(v => v.severity === 'high').length;
    const mediumFindings = violations.filter(v => v.severity === 'medium').length;
    const lowFindings = violations.filter(v => v.severity === 'low').length;
    const openFindings = violations.filter(v => v.status === 'open').length;
    const resolvedFindings = violations.filter(v => v.status === 'resolved').length;
    const overdueFindings = violations.filter(v => 
      v.status === 'open' && v.dueDate < new Date()
    ).length;
    
    return {
      standards,
      overallScore,
      overallGrade,
      criticalFindings,
      highFindings,
      mediumFindings,
      lowFindings,
      openFindings,
      resolvedFindings,
      overdueFindings
    };
  }

  /**
   * Get audit events
   */
  getEvents(filters?: {
    eventType?: AuditEventType;
    category?: AuditCategory;
    severity?: AuditSeverity;
    userId?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditEvent[] {
    let events = Array.from(this.events.values());

    if (filters) {
      if (filters.eventType) {
        events = events.filter(e => e.eventType === filters.eventType);
      }
      if (filters.category) {
        events = events.filter(e => e.category === filters.category);
      }
      if (filters.severity) {
        events = events.filter(e => e.severity === filters.severity);
      }
      if (filters.userId) {
        events = events.filter(e => e.user.id === filters.userId);
      }
      if (filters.resourceType) {
        events = events.filter(e => e.resource.type === filters.resourceType);
      }
      if (filters.startDate) {
        events = events.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        events = events.filter(e => e.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        events = events.slice(0, filters.limit);
      }
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get audit reports
   */
  getReports(limit?: number): AuditReport[] {
    const reports = Array.from(this.reports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    
    return limit ? reports.slice(0, limit) : reports;
  }

  /**
   * Get compliance standards
   */
  getComplianceStandards(): ComplianceStandard[] {
    return Array.from(this.compliance.values());
  }

  /**
   * Get assessments
   */
  getAssessments(): Assessment[] {
    return Array.from(this.assessments.values());
  }

  /**
   * Get service status
   */
  getStatus(): {
    enabled: boolean;
    processing: boolean;
    eventsCount: number;
    reportsCount: number;
    complianceStandardsCount: number;
    assessmentsCount: number;
    queueSize: number;
  } {
    return {
      enabled: this.config.enabled,
      processing: this.isProcessing,
      eventsCount: this.events.size,
      reportsCount: this.reports.size,
      complianceStandardsCount: this.compliance.size,
      assessmentsCount: this.assessments.size,
      queueSize: this.processingQueue.length
    };
  }
}
