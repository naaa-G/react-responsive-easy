/**
 * Enterprise Alerting System for Performance Dashboard
 * 
 * Provides comprehensive alerting capabilities with intelligent routing,
 * escalation, and notification management for enterprise environments.
 */

import type { PerformanceAlert, PerformanceMetrics } from '../core/PerformanceMonitor';
import type { AIInsight } from './AIIntegration';

export interface AlertingConfig {
  enabled: boolean;
  channels: AlertChannel[];
  rules: AlertRule[];
  escalation: EscalationPolicy;
  rateLimiting: RateLimitingConfig;
  retention: RetentionConfig;
  integrations: IntegrationConfig[];
}

export interface AlertChannel {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'push' | 'dashboard';
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  filters?: AlertFilter[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  cooldown: number; // milliseconds
  lastTriggered?: number;
  triggerCount: number;
  metadata?: Record<string, any>;
}

export interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'regex';
  value: any;
  duration?: number; // milliseconds
  aggregation?: 'avg' | 'max' | 'min' | 'sum' | 'count';
}

export interface AlertAction {
  type: 'notify' | 'escalate' | 'auto-remediate' | 'log' | 'webhook';
  target: string;
  parameters?: Record<string, any>;
  delay?: number; // milliseconds
}

export interface AlertFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'regex';
  value: any;
}

export interface EscalationPolicy {
  enabled: boolean;
  levels: EscalationLevel[];
  maxEscalations: number;
  escalationDelay: number; // milliseconds
}

export interface EscalationLevel {
  level: number;
  name: string;
  channels: string[];
  conditions: AlertCondition[];
  delay: number; // milliseconds
}

export interface RateLimitingConfig {
  enabled: boolean;
  maxAlertsPerMinute: number;
  maxAlertsPerHour: number;
  maxAlertsPerDay: number;
  burstLimit: number;
}

export interface RetentionConfig {
  alertHistoryDays: number;
  metricsRetentionDays: number;
  logRetentionDays: number;
  archiveEnabled: boolean;
}

export interface IntegrationConfig {
  type: 'pagerduty' | 'datadog' | 'newrelic' | 'splunk' | 'custom';
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  filters?: AlertFilter[];
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  type: 'performance' | 'ai-insight' | 'system' | 'custom';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  source: string;
  timestamp: number;
  resolvedAt?: number;
  acknowledgedAt?: number;
  acknowledgedBy?: string;
  escalated: boolean;
  escalationLevel?: number;
  metadata: Record<string, any>;
  channels: string[];
  actions: AlertAction[];
}

export interface AlertStatistics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  escalatedAlerts: number;
  alertsBySeverity: Record<string, number>;
  alertsByType: Record<string, number>;
  averageResolutionTime: number;
  topRules: Array<{
    ruleId: string;
    name: string;
    triggerCount: number;
  }>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'push';
  subject?: string;
  template: string;
  variables: string[];
  enabled: boolean;
}

export class AlertingSystem {
  private config: AlertingConfig;
  private alerts: Map<string, AlertEvent> = new Map();
  private rules: Map<string, AlertRule> = new Map();
  private channels: Map<string, AlertChannel> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private rateLimiter: Map<string, number[]> = new Map();
  private isInitialized = false;

  constructor(config: AlertingConfig) {
    this.config = config;
    this.initializeSystem();
  }

  /**
   * Initialize the alerting system
   */
  private initializeSystem(): void {
    // Load default rules
    this.loadDefaultRules();
    
    // Load default channels
    this.loadDefaultChannels();
    
    // Load default templates
    this.loadDefaultTemplates();
    
    // Initialize rate limiter
    this.initializeRateLimiter();
    
    this.isInitialized = true;
    console.log('🚨 Alerting System initialized');
  }

  /**
   * Process performance metrics and check for alerts
   */
  async processMetrics(metrics: PerformanceMetrics, aiInsights: AIInsight[] = []): Promise<AlertEvent[]> {
    if (!this.config.enabled) {
      return [];
    }

    const triggeredAlerts: AlertEvent[] = [];

    // Check performance-based alerts
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      const shouldTrigger = await this.evaluateRule(rule, metrics);
      if (shouldTrigger) {
        const alert = await this.createAlert(rule, metrics, 'performance');
        if (alert) {
          triggeredAlerts.push(alert);
        }
      }
    }

    // Check AI insight-based alerts
    for (const insight of aiInsights) {
      if (insight.severity === 'critical' || insight.severity === 'warning') {
        const alert = await this.createAIInsightAlert(insight);
        if (alert) {
          triggeredAlerts.push(alert);
        }
      }
    }

    // Process triggered alerts
    for (const alert of triggeredAlerts) {
      await this.processAlert(alert);
    }

    return triggeredAlerts;
  }

  /**
   * Create a new alert
   */
  async createAlert(
    rule: AlertRule, 
    metrics: PerformanceMetrics, 
    type: AlertEvent['type']
  ): Promise<AlertEvent | null> {
    // Check cooldown
    if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
      return null;
    }

    // Check rate limiting
    if (!this.checkRateLimit(rule.id)) {
      console.warn(`Rate limit exceeded for rule: ${rule.id}`);
      return null;
    }

    const alert: AlertEvent = {
      id: this.generateAlertId(),
      ruleId: rule.id,
      type,
      severity: this.determineSeverity(rule, metrics),
      title: rule.name,
      description: rule.description,
      source: 'performance-monitor',
      timestamp: Date.now(),
      escalated: false,
      metadata: {
        metrics: this.extractRelevantMetrics(metrics, rule),
        rule: rule.metadata
      },
      channels: this.selectChannels(rule, metrics),
      actions: rule.actions
    };

    // Store alert
    this.alerts.set(alert.id, alert);

    // Update rule statistics
    rule.lastTriggered = Date.now();
    rule.triggerCount++;

    return alert;
  }

  /**
   * Create alert from AI insight
   */
  async createAIInsightAlert(insight: AIInsight): Promise<AlertEvent | null> {
    const alert: AlertEvent = {
      id: this.generateAlertId(),
      ruleId: 'ai-insight',
      type: 'ai-insight',
      severity: insight.severity,
      title: insight.title,
      description: insight.description,
      source: 'ai-integration',
      timestamp: Date.now(),
      escalated: false,
      metadata: {
        insight,
        confidence: insight.confidence,
        impact: insight.impact,
        actionable: insight.actionable
      },
      channels: this.selectChannelsForAIInsight(insight),
      actions: insight.actions?.map(action => ({
        type: 'notify' as const,
        target: 'dashboard',
        parameters: { action }
      })) || []
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  /**
   * Process an alert (send notifications, execute actions)
   */
  private async processAlert(alert: AlertEvent): Promise<void> {
    try {
      // Send notifications to channels
      for (const channelId of alert.channels) {
        const channel = this.channels.get(channelId);
        if (channel && channel.enabled) {
          await this.sendNotification(alert, channel);
        }
      }

      // Execute actions
      for (const action of alert.actions) {
        await this.executeAction(alert, action);
      }

      // Check for escalation
      if (this.config.escalation.enabled && !alert.escalated) {
        await this.checkEscalation(alert);
      }

    } catch (error) {
      console.error(`Failed to process alert ${alert.id}:`, error);
    }
  }

  /**
   * Send notification through a channel
   */
  private async sendNotification(alert: AlertEvent, channel: AlertChannel): Promise<void> {
    try {
      const template = this.getTemplateForChannel(channel.type);
      const message = this.renderTemplate(template, alert, channel);

      switch (channel.type) {
        case 'email':
          await this.sendEmail(channel, message);
          break;
        case 'slack':
          await this.sendSlackMessage(channel, message);
          break;
        case 'webhook':
          await this.sendWebhook(channel, message);
          break;
        case 'sms':
          await this.sendSMS(channel, message);
          break;
        case 'push':
          await this.sendPushNotification(channel, message);
          break;
        case 'dashboard':
          await this.sendDashboardNotification(alert);
          break;
      }

      console.log(`Notification sent via ${channel.type} for alert ${alert.id}`);
    } catch (error) {
      console.error(`Failed to send notification via ${channel.type}:`, error);
    }
  }

  /**
   * Execute an alert action
   */
  private async executeAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    try {
      switch (action.type) {
        case 'notify':
          await this.executeNotifyAction(alert, action);
          break;
        case 'escalate':
          await this.executeEscalateAction(alert, action);
          break;
        case 'auto-remediate':
          await this.executeAutoRemediateAction(alert, action);
          break;
        case 'log':
          await this.executeLogAction(alert, action);
          break;
        case 'webhook':
          await this.executeWebhookAction(alert, action);
          break;
      }
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error);
    }
  }

  /**
   * Check for alert escalation
   */
  private async checkEscalation(alert: AlertEvent): Promise<void> {
    const escalationLevel = this.determineEscalationLevel(alert);
    if (escalationLevel > 0) {
      await this.escalateAlert(alert, escalationLevel);
    }
  }

  /**
   * Escalate an alert
   */
  private async escalateAlert(alert: AlertEvent, level: number): Promise<void> {
    const escalationPolicy = this.config.escalation.levels.find(l => l.level === level);
    if (!escalationPolicy) return;

    alert.escalated = true;
    alert.escalationLevel = level;

    // Send escalation notifications
    for (const channelId of escalationPolicy.channels) {
      const channel = this.channels.get(channelId);
      if (channel) {
        await this.sendNotification(alert, channel);
      }
    }

    console.log(`Alert ${alert.id} escalated to level ${level}`);
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.acknowledgedAt = Date.now();
    alert.acknowledgedBy = acknowledgedBy;

    return true;
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolvedAt = Date.now();

    // Send resolution notification
    const resolutionAlert: AlertEvent = {
      ...alert,
      id: this.generateAlertId(),
      title: `RESOLVED: ${alert.title}`,
      description: `Alert has been resolved: ${alert.description}`,
      severity: 'info',
      timestamp: Date.now()
    };

    await this.processAlert(resolutionAlert);

    return true;
  }

  /**
   * Get alert statistics
   */
  getStatistics(): AlertStatistics {
    const alerts = Array.from(this.alerts.values());
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const activeAlerts = alerts.filter(a => !a.resolvedAt);
    const resolvedAlerts = alerts.filter(a => a.resolvedAt);
    const escalatedAlerts = alerts.filter(a => a.escalated);

    const alertsBySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRules = Array.from(this.rules.values())
      .sort((a, b) => b.triggerCount - a.triggerCount)
      .slice(0, 5)
      .map(rule => ({
        ruleId: rule.id,
        name: rule.name,
        triggerCount: rule.triggerCount
      }));

    const averageResolutionTime = resolvedAlerts.length > 0
      ? resolvedAlerts.reduce((sum, alert) => {
          if (alert.resolvedAt) {
            return sum + (alert.resolvedAt - alert.timestamp);
          }
          return sum;
        }, 0) / resolvedAlerts.length
      : 0;

    return {
      totalAlerts: alerts.length,
      activeAlerts: activeAlerts.length,
      resolvedAlerts: resolvedAlerts.length,
      escalatedAlerts: escalatedAlerts.length,
      alertsBySeverity,
      alertsByType,
      averageResolutionTime,
      topRules
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): AlertEvent[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolvedAt);
  }

  /**
   * Update alerting configuration
   */
  updateConfig(newConfig: Partial<AlertingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Add a new alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove an alert rule
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Add a new alert channel
   */
  addChannel(channel: AlertChannel): void {
    this.channels.set(channel.id, channel);
  }

  /**
   * Remove an alert channel
   */
  removeChannel(channelId: string): boolean {
    return this.channels.delete(channelId);
  }

  /**
   * Dispose of the alerting system
   */
  dispose(): void {
    this.alerts.clear();
    this.rules.clear();
    this.channels.clear();
    this.templates.clear();
    this.rateLimiter.clear();
    this.isInitialized = false;
  }

  // Private helper methods

  private loadDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high-layout-shift',
        name: 'High Layout Shift',
        description: 'Layout shift score exceeds threshold',
        enabled: true,
        conditions: [{
          metric: 'layoutShift.current',
          operator: 'gt',
          value: 0.1
        }],
        actions: [{
          type: 'notify',
          target: 'dashboard'
        }],
        cooldown: 300000, // 5 minutes
        triggerCount: 0
      },
      {
        id: 'high-memory-usage',
        name: 'High Memory Usage',
        description: 'Memory usage exceeds threshold',
        enabled: true,
        conditions: [{
          metric: 'memory.usage',
          operator: 'gt',
          value: 0.8
        }],
        actions: [{
          type: 'notify',
          target: 'dashboard'
        }],
        cooldown: 600000, // 10 minutes
        triggerCount: 0
      },
      {
        id: 'slow-lcp',
        name: 'Slow Largest Contentful Paint',
        description: 'LCP exceeds performance threshold',
        enabled: true,
        conditions: [{
          metric: 'paintTiming.lcp',
          operator: 'gt',
          value: 2500
        }],
        actions: [{
          type: 'notify',
          target: 'dashboard'
        }],
        cooldown: 300000, // 5 minutes
        triggerCount: 0
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  private loadDefaultChannels(): void {
    const defaultChannels: AlertChannel[] = [
      {
        id: 'dashboard',
        type: 'dashboard',
        name: 'Dashboard Notifications',
        enabled: true,
        config: {},
        priority: 'medium'
      }
    ];

    defaultChannels.forEach(channel => this.channels.set(channel.id, channel));
  }

  private loadDefaultTemplates(): void {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'default-email',
        name: 'Default Email Template',
        type: 'email',
        subject: 'Performance Alert: {{title}}',
        template: `
          <h2>{{title}}</h2>
          <p><strong>Severity:</strong> {{severity}}</p>
          <p><strong>Description:</strong> {{description}}</p>
          <p><strong>Time:</strong> {{timestamp}}</p>
          <p><strong>Source:</strong> {{source}}</p>
        `,
        variables: ['title', 'severity', 'description', 'timestamp', 'source'],
        enabled: true
      },
      {
        id: 'default-slack',
        name: 'Default Slack Template',
        type: 'slack',
        template: `
          🚨 *{{title}}*
          *Severity:* {{severity}}
          *Description:* {{description}}
          *Time:* {{timestamp}}
        `,
        variables: ['title', 'severity', 'description', 'timestamp'],
        enabled: true
      }
    ];

    defaultTemplates.forEach(template => this.templates.set(template.id, template));
  }

  private initializeRateLimiter(): void {
    // Initialize rate limiter for each rule
    for (const rule of this.rules.values()) {
      this.rateLimiter.set(rule.id, []);
    }
  }

  private async evaluateRule(rule: AlertRule, metrics: PerformanceMetrics): Promise<boolean> {
    for (const condition of rule.conditions) {
      const value = this.getMetricValue(metrics, condition.metric);
      if (!this.evaluateCondition(value, condition)) {
        return false;
      }
    }
    return true;
  }

  private getMetricValue(metrics: PerformanceMetrics, path: string): any {
    const parts = path.split('.');
    let value: any = metrics;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  private evaluateCondition(value: any, condition: AlertCondition): boolean {
    if (value === undefined) return false;

    switch (condition.operator) {
      case 'gt': return value > condition.value;
      case 'lt': return value < condition.value;
      case 'eq': return value === condition.value;
      case 'gte': return value >= condition.value;
      case 'lte': return value <= condition.value;
      case 'contains': return String(value).includes(String(condition.value));
      case 'regex': return new RegExp(condition.value).test(String(value));
      default: return false;
    }
  }

  private determineSeverity(rule: AlertRule, metrics: PerformanceMetrics): AlertEvent['severity'] {
    // Determine severity based on rule conditions and metric values
    for (const condition of rule.conditions) {
      const value = this.getMetricValue(metrics, condition.metric);
      if (value > condition.value * 2) {
        return 'critical';
      } else if (value > condition.value * 1.5) {
        return 'warning';
      }
    }
    return 'warning';
  }

  private extractRelevantMetrics(metrics: PerformanceMetrics, rule: AlertRule): Record<string, any> {
    const relevant: Record<string, any> = {};
    
    for (const condition of rule.conditions) {
      const value = this.getMetricValue(metrics, condition.metric);
      if (value !== undefined) {
        relevant[condition.metric] = value;
      }
    }
    
    return relevant;
  }

  private selectChannels(rule: AlertRule, metrics: PerformanceMetrics): string[] {
    const channels: string[] = [];
    
    for (const channel of this.channels.values()) {
      if (channel.enabled && this.channelMatchesFilters(channel, metrics)) {
        channels.push(channel.id);
      }
    }
    
    return channels.length > 0 ? channels : ['dashboard'];
  }

  private selectChannelsForAIInsight(insight: AIInsight): string[] {
    const channels: string[] = [];
    
    for (const channel of this.channels.values()) {
      if (channel.enabled && this.channelMatchesAISeverity(channel, insight.severity)) {
        channels.push(channel.id);
      }
    }
    
    return channels.length > 0 ? channels : ['dashboard'];
  }

  private channelMatchesFilters(channel: AlertChannel, metrics: PerformanceMetrics): boolean {
    if (!channel.filters) return true;
    
    for (const filter of channel.filters) {
      const value = this.getMetricValue(metrics, filter.field);
      if (!this.evaluateFilter(value, filter)) {
        return false;
      }
    }
    
    return true;
  }

  private channelMatchesAISeverity(channel: AlertChannel, severity: string): boolean {
    const severityLevels = { info: 1, warning: 2, critical: 3, emergency: 4 };
    const channelLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    
    return severityLevels[severity as keyof typeof severityLevels] >= 
           channelLevels[channel.priority as keyof typeof channelLevels];
  }

  private evaluateFilter(value: any, filter: AlertFilter): boolean {
    if (value === undefined) return false;

    switch (filter.operator) {
      case 'equals': return value === filter.value;
      case 'not_equals': return value !== filter.value;
      case 'contains': return String(value).includes(String(filter.value));
      case 'not_contains': return !String(value).includes(String(filter.value));
      case 'regex': return new RegExp(filter.value).test(String(value));
      default: return false;
    }
  }

  private checkRateLimit(ruleId: string): boolean {
    const config = this.config.rateLimiting;
    if (!config.enabled) return true;

    const now = Date.now();
    const timestamps = this.rateLimiter.get(ruleId) || [];
    
    // Remove old timestamps
    const recentTimestamps = timestamps.filter(ts => now - ts < 60000); // Last minute
    
    // Check limits
    if (recentTimestamps.length >= config.maxAlertsPerMinute) {
      return false;
    }
    
    // Add current timestamp
    recentTimestamps.push(now);
    this.rateLimiter.set(ruleId, recentTimestamps);
    
    return true;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTemplateForChannel(type: string): NotificationTemplate | null {
    for (const template of this.templates.values()) {
      if (template.type === type && template.enabled) {
        return template;
      }
    }
    return null;
  }

  private renderTemplate(template: NotificationTemplate | null, alert: AlertEvent, channel: AlertChannel): string {
    if (!template) return alert.description;

    let rendered = template.template;
    
    // Replace variables
    for (const variable of template.variables) {
      const value = this.getTemplateVariable(alert, variable);
      rendered = rendered.replace(new RegExp(`{{${variable}}}`, 'g'), String(value));
    }
    
    return rendered;
  }

  private getTemplateVariable(alert: AlertEvent, variable: string): any {
    switch (variable) {
      case 'title': return alert.title;
      case 'severity': return alert.severity;
      case 'description': return alert.description;
      case 'timestamp': return new Date(alert.timestamp).toISOString();
      case 'source': return alert.source;
      case 'id': return alert.id;
      default: return alert.metadata[variable] || '';
    }
  }

  private determineEscalationLevel(alert: AlertEvent): number {
    if (!this.config.escalation.enabled) return 0;
    
    const timeSinceAlert = Date.now() - alert.timestamp;
    
    for (const level of this.config.escalation.levels) {
      if (timeSinceAlert >= level.delay) {
        return level.level;
      }
    }
    
    return 0;
  }

  // Notification sending methods (mock implementations)
  private async sendEmail(channel: AlertChannel, message: string): Promise<void> {
    console.log(`Email sent to ${channel.config.email}: ${message}`);
  }

  private async sendSlackMessage(channel: AlertChannel, message: string): Promise<void> {
    console.log(`Slack message sent to ${channel.config.webhook}: ${message}`);
  }

  private async sendWebhook(channel: AlertChannel, message: string): Promise<void> {
    console.log(`Webhook sent to ${channel.config.url}: ${message}`);
  }

  private async sendSMS(channel: AlertChannel, message: string): Promise<void> {
    console.log(`SMS sent to ${channel.config.phone}: ${message}`);
  }

  private async sendPushNotification(channel: AlertChannel, message: string): Promise<void> {
    console.log(`Push notification sent: ${message}`);
  }

  private async sendDashboardNotification(alert: AlertEvent): Promise<void> {
    console.log(`Dashboard notification: ${alert.title}`);
  }

  // Action execution methods (mock implementations)
  private async executeNotifyAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    console.log(`Notify action executed for alert ${alert.id}`);
  }

  private async executeEscalateAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    console.log(`Escalate action executed for alert ${alert.id}`);
  }

  private async executeAutoRemediateAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    console.log(`Auto-remediate action executed for alert ${alert.id}`);
  }

  private async executeLogAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    console.log(`Log action executed for alert ${alert.id}`);
  }

  private async executeWebhookAction(alert: AlertEvent, action: AlertAction): Promise<void> {
    console.log(`Webhook action executed for alert ${alert.id}`);
  }
}
