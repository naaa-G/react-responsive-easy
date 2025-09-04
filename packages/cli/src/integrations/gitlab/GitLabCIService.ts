/**
 * GitLab CI Integration Service
 * 
 * Enterprise-grade GitLab CI integration with pipeline management,
 * security scanning, and deployment automation.
 * 
 * @author React Responsive Easy CLI
 * @version 2.0.0
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface GitLabPipeline {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: 'running' | 'pending' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual';
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
  before_sha: string;
  tag: boolean;
  yaml_errors: string[];
  user: any;
  started_at: string;
  finished_at: string;
  committed_at: string;
  duration: number;
  queued_duration: number;
  coverage: string;
  detailed_status: any;
}

export interface GitLabJob {
  id: number;
  status: 'created' | 'pending' | 'running' | 'failed' | 'success' | 'canceled' | 'skipped' | 'manual';
  stage: string;
  name: string;
  ref: string;
  tag: boolean;
  coverage: string;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  erased_at: string;
  duration: number;
  queued_duration: number;
  user: any;
  commit: any;
  pipeline: any;
  web_url: string;
  project: any;
  artifacts_file: any;
  runner: any;
  artifacts: any[];
  tag_list: string[];
}

export interface GitLabVariable {
  key: string;
  value: string;
  variable_type: 'env_var' | 'file';
  protected: boolean;
  masked: boolean;
  raw: boolean;
  environment_scope: string;
}

export interface GitLabEnvironment {
  id: number;
  name: string;
  slug: string;
  external_url: string;
  project: any;
  state: 'available' | 'stopped';
  created_at: string;
  updated_at: string;
  last_deployment: any;
  deployable: any;
}

export interface GitLabRunner {
  id: number;
  description: string;
  ip_address: string;
  active: boolean;
  is_shared: boolean;
  name: string;
  online: boolean;
  status: 'online' | 'offline' | 'stale';
  tag_list: string[];
  contacted_at: string;
  token: string;
  version: string;
  revision: string;
  platform: string;
  architecture: string;
  executor: string;
  access_level: string;
  maximum_timeout: number;
  locked: boolean;
  run_untagged: boolean;
  protected: boolean;
}

export class GitLabCIService extends EventEmitter {
  private token: string;
  private projectId: string;
  private baseUrl: string;

  constructor(token: string, projectId: string, baseUrl: string = 'https://gitlab.com') {
    super();
    this.token = token;
    this.projectId = projectId;
    this.baseUrl = baseUrl;
  }

  /**
   * Get project pipelines
   */
  async getPipelines(options: any = {}): Promise<GitLabPipeline[]> {
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.ref) params.append('ref', options.ref);
      if (options.scope) params.append('scope', options.scope);
      if (options.per_page) params.append('per_page', options.per_page.toString());

      const response = await this.request('GET', `/projects/${this.projectId}/pipelines?${params}`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get pipelines: ${error}`));
      throw error;
    }
  }

  /**
   * Get pipeline details
   */
  async getPipeline(pipelineId: number): Promise<GitLabPipeline> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/pipelines/${pipelineId}`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get pipeline: ${error}`));
      throw error;
    }
  }

  /**
   * Get pipeline jobs
   */
  async getPipelineJobs(pipelineId: number): Promise<GitLabJob[]> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/pipelines/${pipelineId}/jobs`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get pipeline jobs: ${error}`));
      throw error;
    }
  }

  /**
   * Get job details
   */
  async getJob(jobId: number): Promise<GitLabJob> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/jobs/${jobId}`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get job: ${error}`));
      throw error;
    }
  }

  /**
   * Get job logs
   */
  async getJobLogs(jobId: number): Promise<string> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/jobs/${jobId}/trace`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get job logs: ${error}`));
      throw error;
    }
  }

  /**
   * Cancel pipeline
   */
  async cancelPipeline(pipelineId: number): Promise<void> {
    try {
      await this.request('POST', `/projects/${this.projectId}/pipelines/${pipelineId}/cancel`);
      this.emit('pipeline-cancelled', { pipelineId });
    } catch (error) {
      this.emit('error', new Error(`Failed to cancel pipeline: ${error}`));
      throw error;
    }
  }

  /**
   * Retry pipeline
   */
  async retryPipeline(pipelineId: number): Promise<void> {
    try {
      await this.request('POST', `/projects/${this.projectId}/pipelines/${pipelineId}/retry`);
      this.emit('pipeline-retried', { pipelineId });
    } catch (error) {
      this.emit('error', new Error(`Failed to retry pipeline: ${error}`));
      throw error;
    }
  }

  /**
   * Create pipeline
   */
  async createPipeline(ref: string, variables: Record<string, string> = {}): Promise<GitLabPipeline> {
    try {
      const response = await this.request('POST', `/projects/${this.projectId}/pipeline`, {
        ref,
        variables: Object.entries(variables).map(([key, value]) => ({
          key,
          value
        }))
      });
      this.emit('pipeline-created', response);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to create pipeline: ${error}`));
      throw error;
    }
  }

  /**
   * Get project variables
   */
  async getVariables(): Promise<GitLabVariable[]> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/variables`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get variables: ${error}`));
      throw error;
    }
  }

  /**
   * Create project variable
   */
  async createVariable(key: string, value: string, options: any = {}): Promise<void> {
    try {
      await this.request('POST', `/projects/${this.projectId}/variables`, {
        key,
        value,
        variable_type: options.variable_type || 'env_var',
        protected: options.protected || false,
        masked: options.masked || false,
        raw: options.raw || false,
        environment_scope: options.environment_scope || '*'
      });
      this.emit('variable-created', { key, value });
    } catch (error) {
      this.emit('error', new Error(`Failed to create variable: ${error}`));
      throw error;
    }
  }

  /**
   * Get environments
   */
  async getEnvironments(): Promise<GitLabEnvironment[]> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/environments`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get environments: ${error}`));
      throw error;
    }
  }

  /**
   * Get runners
   */
  async getRunners(): Promise<GitLabRunner[]> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}/runners`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get runners: ${error}`));
      throw error;
    }
  }

  /**
   * Get project information
   */
  async getProject(): Promise<any> {
    try {
      const response = await this.request('GET', `/projects/${this.projectId}`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get project: ${error}`));
      throw error;
    }
  }

  /**
   * Make authenticated request to GitLab API
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}/api/v4${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`GitLab API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }
}
