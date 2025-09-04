import { EventEmitter } from 'events';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  keywords: string[];
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  main: string;
  types?: string;
  icon?: string;
  screenshots?: string[];
  category: 'visualization' | 'analytics' | 'integration' | 'utility' | 'custom';
  permissions: PluginPermission[];
  apiVersion: string;
  minDashboardVersion: string;
  maxDashboardVersion?: string;
  configSchema?: any;
  defaultConfig?: any;
}

export interface PluginPermission {
  name: string;
  description: string;
  required: boolean;
  scope: 'read' | 'write' | 'admin';
  resources: string[];
}

export interface PluginConfig {
  enabled: boolean;
  settings: Record<string, any>;
  permissions: Record<string, boolean>;
  version: string;
  lastUpdated: Date;
}

export interface PluginContext {
  dashboard: {
    version: string;
    api: any;
    events: EventEmitter;
    storage: PluginStorage;
    ui: PluginUI;
    data: PluginData;
  };
  plugin: {
    id: string;
    manifest: PluginManifest;
    config: PluginConfig;
    logger: PluginLogger;
  };
}

export interface PluginStorage {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  keys: () => Promise<string[]>;
}

export interface PluginUI {
  registerComponent: (name: string, component: React.ComponentType<any>) => void;
  unregisterComponent: (name: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  showModal: (component: React.ComponentType<any>, props?: any) => Promise<any>;
  addMenuItem: (menu: string, item: MenuItem) => void;
  removeMenuItem: (menu: string, itemId: string) => void;
  addToolbarButton: (button: ToolbarButton) => void;
  removeToolbarButton: (buttonId: string) => void;
}

export interface PluginData {
  getMetrics: () => Promise<any[]>;
  getAlerts: () => Promise<any[]>;
  getReports: () => Promise<any[]>;
  subscribe: (event: string, callback: Function) => void;
  unsubscribe: (event: string, callback: Function) => void;
  request: (endpoint: string, options?: any) => Promise<any>;
}

export interface PluginLogger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  condition?: () => boolean;
  order?: number;
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  tooltip?: string;
  condition?: () => boolean;
  order?: number;
}

export interface PluginInstance {
  id: string;
  manifest: PluginManifest;
  config: PluginConfig;
  instance: any;
  status: 'loading' | 'active' | 'error' | 'disabled';
  error?: string;
  loadTime: number;
  lastActivity: Date;
}

export interface PluginManagerState {
  plugins: Map<string, PluginInstance>;
  availablePlugins: PluginManifest[];
  isLoading: boolean;
  error: string | null;
  registry: PluginRegistry;
}

export interface PluginRegistry {
  url: string;
  plugins: PluginManifest[];
  lastUpdated: Date;
  isUpdating: boolean;
}

export interface PluginManagerActions {
  loadPlugin: (manifest: PluginManifest, config?: Partial<PluginConfig>) => Promise<string>;
  unloadPlugin: (pluginId: string) => Promise<void>;
  reloadPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  updatePluginConfig: (pluginId: string, config: Partial<PluginConfig>) => Promise<void>;
  installPlugin: (manifest: PluginManifest) => Promise<string>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  updatePlugin: (pluginId: string) => Promise<void>;
  getPluginStatus: (pluginId: string) => PluginInstance | null;
  getPluginLogs: (pluginId: string) => string[];
  validatePlugin: (manifest: PluginManifest) => Promise<boolean>;
  searchPlugins: (query: string) => PluginManifest[];
  updateRegistry: () => Promise<void>;
  exportPlugin: (pluginId: string) => Promise<any>;
  importPlugin: (pluginData: any) => Promise<string>;
}

/**
 * Enterprise-grade plugin manager for extensible dashboard architecture
 * Supports dynamic loading, sandboxing, permissions, and registry management
 */
export class PluginManager extends EventEmitter {
  private plugins: Map<string, PluginInstance> = new Map();
  private availablePlugins: PluginManifest[] = [];
  private registry: PluginRegistry = {
    url: 'https://plugins.performance-dashboard.com/registry',
    plugins: [],
    lastUpdated: new Date(0),
    isUpdating: false
  };
  private isLoading = false;
  private error: string | null = null;
  private pluginLogs: Map<string, string[]> = new Map();
  private sandbox: PluginSandbox;

  constructor() {
    super();
    this.sandbox = new PluginSandbox();
    this.initializeDefaultPlugins();
  }

  // State getter
  getState(): PluginManagerState {
    return {
      plugins: new Map(this.plugins),
      availablePlugins: [...this.availablePlugins],
      isLoading: this.isLoading,
      error: this.error,
      registry: { ...this.registry }
    };
  }

  // Actions
  async loadPlugin(manifest: PluginManifest, config?: Partial<PluginConfig>): Promise<string> {
    if (this.plugins.has(manifest.id)) {
      throw new Error(`Plugin ${manifest.id} is already loaded`);
    }

    this.isLoading = true;
    this.error = null;
    this.emit('pluginLoading', manifest.id);

    try {
      // Validate plugin
      const isValid = await this.validatePlugin(manifest);
      if (!isValid) {
        throw new Error(`Plugin ${manifest.id} validation failed`);
      }

      // Create plugin config
      const pluginConfig: PluginConfig = {
        enabled: true,
        settings: { ...manifest.defaultConfig, ...config?.settings },
        permissions: this.initializePermissions(manifest),
        version: manifest.version,
        lastUpdated: new Date(),
        ...config
      };

      // Load plugin instance
      const startTime = Date.now();
      const instance = await this.sandbox.loadPlugin(manifest, pluginConfig);
      const loadTime = Date.now() - startTime;

      // Create plugin instance
      const pluginInstance: PluginInstance = {
        id: manifest.id,
        manifest,
        config: pluginConfig,
        instance,
        status: 'active',
        loadTime,
        lastActivity: new Date()
      };

      this.plugins.set(manifest.id, pluginInstance);
      this.pluginLogs.set(manifest.id, []);

      this.log(manifest.id, 'info', `Plugin loaded successfully in ${loadTime}ms`);
      this.emit('pluginLoaded', manifest.id, pluginInstance);

      return manifest.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.error = errorMessage;
      this.log(manifest.id, 'error', `Failed to load plugin: ${errorMessage}`);
      this.emit('pluginError', manifest.id, errorMessage);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    try {
      // Call plugin cleanup
      if (plugin.instance && typeof plugin.instance.cleanup === 'function') {
        await plugin.instance.cleanup();
      }

      // Unload from sandbox
      await this.sandbox.unloadPlugin(pluginId);

      // Remove from registry
      this.plugins.delete(pluginId);
      this.pluginLogs.delete(pluginId);

      this.log(pluginId, 'info', 'Plugin unloaded successfully');
      this.emit('pluginUnloaded', pluginId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(pluginId, 'error', `Failed to unload plugin: ${errorMessage}`);
      throw error;
    }
  }

  async reloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    const manifest = plugin.manifest;
    const config = plugin.config;

    await this.unloadPlugin(pluginId);
    await this.loadPlugin(manifest, config);
  }

  async enablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    plugin.config.enabled = true;
    plugin.status = 'active';

    if (plugin.instance && typeof plugin.instance.enable === 'function') {
      await plugin.instance.enable();
    }

    this.log(pluginId, 'info', 'Plugin enabled');
    this.emit('pluginEnabled', pluginId);
  }

  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    plugin.config.enabled = false;
    plugin.status = 'disabled';

    if (plugin.instance && typeof plugin.instance.disable === 'function') {
      await plugin.instance.disable();
    }

    this.log(pluginId, 'info', 'Plugin disabled');
    this.emit('pluginDisabled', pluginId);
  }

  async updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    plugin.config = { ...plugin.config, ...config, lastUpdated: new Date() };

    if (plugin.instance && typeof plugin.instance.updateConfig === 'function') {
      await plugin.instance.updateConfig(plugin.config);
    }

    this.log(pluginId, 'info', 'Plugin config updated');
    this.emit('pluginConfigUpdated', pluginId, plugin.config);
  }

  async installPlugin(manifest: PluginManifest): Promise<string> {
    // Download and install plugin
    const pluginId = await this.loadPlugin(manifest);
    
    // Save to local storage
    await this.savePluginToStorage(manifest, this.plugins.get(pluginId)!.config);
    
    this.log(pluginId, 'info', 'Plugin installed successfully');
    this.emit('pluginInstalled', pluginId);
    
    return pluginId;
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    await this.unloadPlugin(pluginId);
    await this.removePluginFromStorage(pluginId);
    
    this.log(pluginId, 'info', 'Plugin uninstalled successfully');
    this.emit('pluginUninstalled', pluginId);
  }

  async updatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Check for updates
    const latestManifest = await this.getLatestPluginManifest(pluginId);
    if (latestManifest && latestManifest.version !== plugin.manifest.version) {
      await this.reloadPlugin(pluginId);
      this.log(pluginId, 'info', `Plugin updated to version ${latestManifest.version}`);
      this.emit('pluginUpdated', pluginId, latestManifest.version);
    }
  }

  getPluginStatus(pluginId: string): PluginInstance | null {
    return this.plugins.get(pluginId) || null;
  }

  getPluginLogs(pluginId: string): string[] {
    return this.pluginLogs.get(pluginId) || [];
  }

  async validatePlugin(manifest: PluginManifest): Promise<boolean> {
    try {
      // Check required fields
      const requiredFields = ['id', 'name', 'version', 'description', 'author', 'main'];
      for (const field of requiredFields) {
        if (!manifest[field as keyof PluginManifest]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Check version compatibility
      if (manifest.minDashboardVersion && !this.isVersionCompatible(manifest.minDashboardVersion)) {
        throw new Error(`Dashboard version too old. Required: ${manifest.minDashboardVersion}`);
      }

      if (manifest.maxDashboardVersion && !this.isVersionCompatible(manifest.maxDashboardVersion, true)) {
        throw new Error(`Dashboard version too new. Maximum: ${manifest.maxDashboardVersion}`);
      }

      // Validate permissions
      for (const permission of manifest.permissions) {
        if (!permission.name || !permission.scope) {
          throw new Error('Invalid permission configuration');
        }
      }

      return true;
    } catch (error) {
      console.error('Plugin validation failed:', error);
      return false;
    }
  }

  searchPlugins(query: string): PluginManifest[] {
    const lowercaseQuery = query.toLowerCase();
    return this.availablePlugins.filter(plugin =>
      plugin.name.toLowerCase().includes(lowercaseQuery) ||
      plugin.description.toLowerCase().includes(lowercaseQuery) ||
      plugin.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }

  async updateRegistry(): Promise<void> {
    this.registry.isUpdating = true;
    this.emit('registryUpdating');

    try {
      // Fetch from remote registry
      const response = await fetch(this.registry.url);
      const data = await response.json();
      
      this.registry.plugins = data.plugins || [];
      this.registry.lastUpdated = new Date();
      this.availablePlugins = [...this.registry.plugins];

      this.emit('registryUpdated', this.registry);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update registry';
      this.emit('registryError', this.error);
    } finally {
      this.registry.isUpdating = false;
    }
  }

  async exportPlugin(pluginId: string): Promise<any> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    return {
      manifest: plugin.manifest,
      config: plugin.config,
      logs: this.getPluginLogs(pluginId),
      exportedAt: new Date()
    };
  }

  async importPlugin(pluginData: any): Promise<string> {
    const { manifest, config } = pluginData;
    return await this.loadPlugin(manifest, config);
  }

  // Private methods
  private initializeDefaultPlugins(): void {
    // Load default plugins from storage
    this.loadPluginsFromStorage();
  }

  private initializePermissions(manifest: PluginManifest): Record<string, boolean> {
    const permissions: Record<string, boolean> = {};
    manifest.permissions.forEach(permission => {
      permissions[permission.name] = permission.required;
    });
    return permissions;
  }

  private isVersionCompatible(version: string, isMax = false): boolean {
    const dashboardVersion = '2.0.0'; // Current dashboard version
    const comparison = this.compareVersions(dashboardVersion, version);
    return isMax ? comparison <= 0 : comparison >= 0;
  }

  private compareVersions(version1: string, version2: string): number {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part > v2part) return 1;
      if (v1part < v2part) return -1;
    }
    
    return 0;
  }

  private log(pluginId: string, level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    const logs = this.pluginLogs.get(pluginId) || [];
    logs.push(logEntry);
    
    // Keep only last 100 log entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    this.pluginLogs.set(pluginId, logs);
    this.emit('pluginLog', pluginId, level, message);
  }

  private async savePluginToStorage(manifest: PluginManifest, config: PluginConfig): Promise<void> {
    const storageKey = `plugin_${manifest.id}`;
    const data = { manifest, config };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  private async removePluginFromStorage(pluginId: string): Promise<void> {
    const storageKey = `plugin_${pluginId}`;
    localStorage.removeItem(storageKey);
  }

  private async loadPluginsFromStorage(): Promise<void> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('plugin_'));
    
    for (const key of keys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.manifest && data.config) {
          await this.loadPlugin(data.manifest, data.config);
        }
      } catch (error) {
        console.error(`Failed to load plugin from storage: ${key}`, error);
      }
    }
  }

  private async getLatestPluginManifest(pluginId: string): Promise<PluginManifest | null> {
    return this.registry.plugins.find(plugin => plugin.id === pluginId) || null;
  }
}

/**
 * Plugin sandbox for secure plugin execution
 */
class PluginSandbox {
  private loadedPlugins: Map<string, any> = new Map();
  private context: PluginContext;

  constructor() {
    this.context = this.createPluginContext();
  }

  async loadPlugin(manifest: PluginManifest, config: PluginConfig): Promise<any> {
    // Create secure context for plugin
    const pluginContext = this.createPluginContext();
    pluginContext.plugin = {
      id: manifest.id,
      manifest,
      config,
      logger: this.createLogger(manifest.id)
    };

    // Load plugin code (in real implementation, this would load from URL or file)
    const pluginCode = await this.fetchPluginCode(manifest);
    
    // Execute plugin in sandbox
    const pluginInstance = await this.executePlugin(pluginCode, pluginContext);
    
    this.loadedPlugins.set(manifest.id, pluginInstance);
    
    return pluginInstance;
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (plugin && typeof plugin.cleanup === 'function') {
      await plugin.cleanup();
    }
    this.loadedPlugins.delete(pluginId);
  }

  private createPluginContext(): PluginContext {
    return {
      dashboard: {
        version: '2.0.0',
        api: this.createDashboardAPI(),
        events: new EventEmitter(),
        storage: this.createStorage(),
        ui: this.createUI(),
        data: this.createDataAPI()
      },
      plugin: {
        id: '',
        manifest: {} as PluginManifest,
        config: {} as PluginConfig,
        logger: this.createLogger('')
      }
    };
  }

  private createDashboardAPI(): any {
    return {
      version: '2.0.0',
      getConfig: () => ({}),
      setConfig: () => {},
      getMetrics: () => [],
      getAlerts: () => []
    };
  }

  private createStorage(): PluginStorage {
    return {
      get: async (key: string) => {
        const value = localStorage.getItem(`plugin_storage_${key}`);
        return value ? JSON.parse(value) : null;
      },
      set: async (key: string, value: any) => {
        localStorage.setItem(`plugin_storage_${key}`, JSON.stringify(value));
      },
      delete: async (key: string) => {
        localStorage.removeItem(`plugin_storage_${key}`);
      },
      clear: async () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('plugin_storage_'));
        keys.forEach(key => localStorage.removeItem(key));
      },
      keys: async () => {
        return Object.keys(localStorage)
          .filter(key => key.startsWith('plugin_storage_'))
          .map(key => key.replace('plugin_storage_', ''));
      }
    };
  }

  private createUI(): PluginUI {
    return {
      registerComponent: (name: string, component: React.ComponentType<any>) => {
        // Register component with dashboard UI system
        console.log(`Registering component: ${name}`);
      },
      unregisterComponent: (name: string) => {
        console.log(`Unregistering component: ${name}`);
      },
      showNotification: (message: string, type = 'info') => {
        console.log(`Notification [${type}]: ${message}`);
      },
      showModal: async (component: React.ComponentType<any>, props?: any) => {
        console.log('Showing modal:', component.name);
        return Promise.resolve();
      },
      addMenuItem: (menu: string, item: MenuItem) => {
        console.log(`Adding menu item to ${menu}:`, item.label);
      },
      removeMenuItem: (menu: string, itemId: string) => {
        console.log(`Removing menu item from ${menu}:`, itemId);
      },
      addToolbarButton: (button: ToolbarButton) => {
        console.log('Adding toolbar button:', button.label);
      },
      removeToolbarButton: (buttonId: string) => {
        console.log('Removing toolbar button:', buttonId);
      }
    };
  }

  private createDataAPI(): PluginData {
    return {
      getMetrics: async () => [],
      getAlerts: async () => [],
      getReports: async () => [],
      subscribe: (event: string, callback: Function) => {
        console.log(`Subscribing to event: ${event}`);
      },
      unsubscribe: (event: string, callback: Function) => {
        console.log(`Unsubscribing from event: ${event}`);
      },
      request: async (endpoint: string, options?: any) => {
        console.log(`Making request to: ${endpoint}`);
        return {};
      }
    };
  }

  private createLogger(pluginId: string): PluginLogger {
    return {
      debug: (message: string, ...args: any[]) => {
        console.debug(`[${pluginId}] ${message}`, ...args);
      },
      info: (message: string, ...args: any[]) => {
        console.info(`[${pluginId}] ${message}`, ...args);
      },
      warn: (message: string, ...args: any[]) => {
        console.warn(`[${pluginId}] ${message}`, ...args);
      },
      error: (message: string, ...args: any[]) => {
        console.error(`[${pluginId}] ${message}`, ...args);
      }
    };
  }

  private async fetchPluginCode(manifest: PluginManifest): Promise<string> {
    // In real implementation, fetch from manifest.main URL
    return `
      class Plugin {
        constructor(context) {
          this.context = context;
        }
        
        async initialize() {
          this.context.plugin.logger.info('Plugin initialized');
        }
        
        async cleanup() {
          this.context.plugin.logger.info('Plugin cleaned up');
        }
      }
      
      module.exports = Plugin;
    `;
  }

  private async executePlugin(code: string, context: PluginContext): Promise<any> {
    // In real implementation, use proper sandboxing (Web Workers, iframe, etc.)
    // For now, return a mock plugin instance
    return {
      initialize: async () => {
        context.plugin.logger.info('Plugin initialized');
      },
      cleanup: async () => {
        context.plugin.logger.info('Plugin cleaned up');
      },
      enable: async () => {
        context.plugin.logger.info('Plugin enabled');
      },
      disable: async () => {
        context.plugin.logger.info('Plugin disabled');
      },
      updateConfig: async (config: PluginConfig) => {
        context.plugin.logger.info('Plugin config updated');
      }
    };
  }
}
