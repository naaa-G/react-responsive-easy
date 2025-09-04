/**
 * Jenkins Integration Service
 * 
 * Enterprise-grade Jenkins integration with pipeline management,
 * job automation, and deployment orchestration.
 * 
 * @author React Responsive Easy CLI
 * @version 2.0.0
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface JenkinsJob {
  name: string;
  url: string;
  color: string;
  fullName: string;
  displayName: string;
  fullDisplayName: string;
  description: string;
  nextBuildNumber: number;
  buildable: boolean;
  builds: JenkinsBuild[];
  firstBuild: JenkinsBuild;
  lastBuild: JenkinsBuild;
  lastCompletedBuild: JenkinsBuild;
  lastFailedBuild: JenkinsBuild;
  lastStableBuild: JenkinsBuild;
  lastSuccessfulBuild: JenkinsBuild;
  lastUnstableBuild: JenkinsBuild;
  lastUnsuccessfulBuild: JenkinsBuild;
  property: any[];
  queueItem: any;
  concurrentBuild: boolean;
  keepDependencies: boolean;
  scm: any;
  canRoam: boolean;
  disabled: boolean;
  blockBuildWhenDownstreamBuilding: boolean;
  blockBuildWhenUpstreamBuilding: boolean;
  triggers: any[];
  actions: any[];
  lastDuration: number;
  healthReport: any[];
  inQueue: boolean;
}

export interface JenkinsBuild {
  number: number;
  url: string;
  displayName: string;
  fullDisplayName: string;
  description: string;
  id: string;
  result: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT';
  timestamp: number;
  duration: number;
  building: boolean;
  builtOn: string;
  changeSet: any;
  culprits: any[];
  actions: any[];
  artifacts: any[];
  fingerprint: any[];
  keepLog: boolean;
  mavenArtifacts: any[];
  mavenVersionUsed: string;
  previousBuild: JenkinsBuild;
  nextBuild: JenkinsBuild;
  queueId: number;
  executor: any;
  workspace: any;
  scm: any;
  parameters: any[];
  causes: any[];
  upstreamProjects: any[];
  downstreamProjects: any[];
  subBuilds: any[];
  subBuildCount: number;
  subBuildsCompleted: number;
  subBuildsSuccessful: number;
  subBuildsFailed: number;
  subBuildsUnstable: number;
  subBuildsAborted: number;
  subBuildsNotBuilt: number;
  subBuildsInProgress: number;
  subBuildsQueued: number;
  subBuildsTotal: number;
  subBuildsDuration: number;
  subBuildsTimestamp: number;
  subBuildsBuilding: boolean;
  subBuildsBuiltOn: string;
  subBuildsChangeSet: any;
  subBuildsCulprits: any[];
  subBuildsActions: any[];
  subBuildsArtifacts: any[];
  subBuildsFingerprint: any[];
  subBuildsKeepLog: boolean;
  subBuildsMavenArtifacts: any[];
  subBuildsMavenVersionUsed: string;
  subBuildsPreviousBuild: JenkinsBuild;
  subBuildsNextBuild: JenkinsBuild;
  subBuildsUrl: string;
  subBuildsQueueId: number;
  subBuildsExecutor: any;
  subBuildsWorkspace: any;
  subBuildsScm: any;
  subBuildsParameters: any[];
  subBuildsCauses: any[];
  subBuildsUpstreamProjects: any[];
  subBuildsDownstreamProjects: any[];
}

export interface JenkinsPipeline {
  name: string;
  status: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT' | 'RUNNING' | 'QUEUED';
  startTime: number;
  duration: number;
  stages: JenkinsStage[];
  parameters: Record<string, any>;
  environment: Record<string, any>;
  artifacts: any[];
  logs: string;
}

export interface JenkinsStage {
  name: string;
  status: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT' | 'RUNNING' | 'QUEUED';
  startTime: number;
  duration: number;
  steps: JenkinsStep[];
  logs: string;
}

export interface JenkinsStep {
  name: string;
  status: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT' | 'RUNNING' | 'QUEUED';
  startTime: number;
  duration: number;
  logs: string;
}

export class JenkinsService extends EventEmitter {
  private baseUrl: string;
  private username: string;
  private token: string;

  constructor(baseUrl: string, username: string, token: string) {
    super();
    this.baseUrl = baseUrl;
    this.username = username;
    this.token = token;
  }

  /**
   * Get all jobs
   */
  async getJobs(): Promise<JenkinsJob[]> {
    try {
      const response = await this.request('GET', '/api/json?tree=jobs[name,url,color,fullName,displayName,fullDisplayName,description,nextBuildNumber,buildable,builds[number,url,displayName,fullDisplayName,description,id,result,timestamp,duration,building,builtOn,changeSet,culprits,actions,artifacts,fingerprint,keepLog,mavenArtifacts,mavenVersionUsed,previousBuild,nextBuild,url,queueId,executor,workspace,scm,parameters,causes,upstreamProjects,downstreamProjects,subBuilds,subBuildCount,subBuildsCompleted,subBuildsSuccessful,subBuildsFailed,subBuildsUnstable,subBuildsAborted,subBuildsNotBuilt,subBuildsInProgress,subBuildsQueued,subBuildsTotal,subBuildsDuration,subBuildsTimestamp,subBuildsBuilding,subBuildsBuiltOn,subBuildsChangeSet,subBuildsCulprits,subBuildsActions,subBuildsArtifacts,subBuildsFingerprint,subBuildsKeepLog,subBuildsMavenArtifacts,subBuildsMavenVersionUsed,subBuildsPreviousBuild,subBuildsNextBuild,subBuildsUrl,subBuildsQueueId,subBuildsExecutor,subBuildsWorkspace,subBuildsScm,subBuildsParameters,subBuildsCauses,subBuildsUpstreamProjects,subBuildsDownstreamProjects],firstBuild,lastBuild,lastCompletedBuild,lastFailedBuild,lastStableBuild,lastSuccessfulBuild,lastUnstableBuild,lastUnsuccessfulBuild,nextBuildNumber,property,queueItem,concurrentBuild,keepDependencies,scm,canRoam,disabled,blockBuildWhenDownstreamBuilding,blockBuildWhenUpstreamBuilding,triggers,actions,url,lastDuration,healthReport,inQueue,queueItem');
      return response.jobs || [];
    } catch (error) {
      this.emit('error', new Error(`Failed to get jobs: ${error}`));
      throw error;
    }
  }

  /**
   * Get job details
   */
  async getJob(jobName: string): Promise<JenkinsJob> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/api/json`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get job: ${error}`));
      throw error;
    }
  }

  /**
   * Get job builds
   */
  async getJobBuilds(jobName: string): Promise<JenkinsBuild[]> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/api/json?tree=builds[number,url,displayName,fullDisplayName,description,id,result,timestamp,duration,building,builtOn,changeSet,culprits,actions,artifacts,fingerprint,keepLog,mavenArtifacts,mavenVersionUsed,previousBuild,nextBuild,url,queueId,executor,workspace,scm,parameters,causes,upstreamProjects,downstreamProjects]`);
      return response.builds || [];
    } catch (error) {
      this.emit('error', new Error(`Failed to get job builds: ${error}`));
      throw error;
    }
  }

  /**
   * Get build details
   */
  async getBuild(jobName: string, buildNumber: number): Promise<JenkinsBuild> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/${buildNumber}/api/json`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get build: ${error}`));
      throw error;
    }
  }

  /**
   * Get build logs
   */
  async getBuildLogs(jobName: string, buildNumber: number): Promise<string> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/${buildNumber}/consoleText`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get build logs: ${error}`));
      throw error;
    }
  }

  /**
   * Trigger job build
   */
  async triggerBuild(jobName: string, parameters: Record<string, any> = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      Object.entries(parameters).forEach(([key, value]) => {
        params.append(key, value);
      });

      await this.request('POST', `/job/${encodeURIComponent(jobName)}/buildWithParameters?${params}`);
      this.emit('build-triggered', { jobName, parameters });
    } catch (error) {
      this.emit('error', new Error(`Failed to trigger build: ${error}`));
      throw error;
    }
  }

  /**
   * Stop build
   */
  async stopBuild(jobName: string, buildNumber: number): Promise<void> {
    try {
      await this.request('POST', `/job/${encodeURIComponent(jobName)}/${buildNumber}/stop`);
      this.emit('build-stopped', { jobName, buildNumber });
    } catch (error) {
      this.emit('error', new Error(`Failed to stop build: ${error}`));
      throw error;
    }
  }

  /**
   * Get pipeline status
   */
  async getPipelineStatus(jobName: string, buildNumber: number): Promise<JenkinsPipeline> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/${buildNumber}/wfapi/describe`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get pipeline status: ${error}`));
      throw error;
    }
  }

  /**
   * Get pipeline logs
   */
  async getPipelineLogs(jobName: string, buildNumber: number): Promise<string> {
    try {
      const response = await this.request('GET', `/job/${encodeURIComponent(jobName)}/${buildNumber}/wfapi/log`);
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get pipeline logs: ${error}`));
      throw error;
    }
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<any> {
    try {
      const response = await this.request('GET', '/api/json');
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get system info: ${error}`));
      throw error;
    }
  }

  /**
   * Get queue information
   */
  async getQueue(): Promise<any> {
    try {
      const response = await this.request('GET', '/queue/api/json');
      return response;
    } catch (error) {
      this.emit('error', new Error(`Failed to get queue: ${error}`));
      throw error;
    }
  }

  /**
   * Make authenticated request to Jenkins API
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    const auth = Buffer.from(`${this.username}:${this.token}`).toString('base64');
    
    const headers: Record<string, string> = {
      'Authorization': `Basic ${auth}`,
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
        throw new Error(`Jenkins API error: ${response.status} ${response.statusText}`);
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
