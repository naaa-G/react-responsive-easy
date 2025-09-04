import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PluginManager, PluginManagerState, PluginManagerActions, PluginManifest, PluginConfig } from '../plugins/PluginManager';

/**
 * React hook for managing plugins in the Performance Dashboard
 * Provides a clean interface to the PluginManager with React state management
 */
export function usePluginManager() {
  const pluginManagerRef = useRef<PluginManager | null>(null);
  const [state, setState] = useState<PluginManagerState>({
    plugins: new Map(),
    availablePlugins: [],
    isLoading: false,
    error: null,
    registry: {
      url: '',
      plugins: [],
      lastUpdated: new Date(0),
      isUpdating: false
    }
  });

  // Initialize plugin manager
  useEffect(() => {
    if (!pluginManagerRef.current) {
      pluginManagerRef.current = new PluginManager();
      
      // Set up event listeners
      const manager = pluginManagerRef.current;
      
      manager.on('pluginLoading', (pluginId: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
      });
      
      manager.on('pluginLoaded', (pluginId: string, instance: any) => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
      
      manager.on('pluginError', (pluginId: string, error: string) => {
        setState(prev => ({ ...prev, isLoading: false, error }));
      });
      
      manager.on('pluginUnloaded', (pluginId: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginEnabled', (pluginId: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginDisabled', (pluginId: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginConfigUpdated', (pluginId: string, config: PluginConfig) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginInstalled', (pluginId: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginUninstalled', (pluginId: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('pluginUpdated', (pluginId: string, version: string) => {
        setState(prev => ({ ...prev }));
      });
      
      manager.on('registryUpdating', () => {
        setState(prev => ({ ...prev, registry: { ...prev.registry, isUpdating: true } }));
      });
      
      manager.on('registryUpdated', (registry: any) => {
        setState(prev => ({ ...prev, registry: { ...registry, isUpdating: false } }));
      });
      
      manager.on('registryError', (error: string) => {
        setState(prev => ({ ...prev, error, registry: { ...prev.registry, isUpdating: false } }));
      });
      
      manager.on('pluginLog', (pluginId: string, level: string, message: string) => {
        // Handle plugin logs if needed
      });
    }

    // Update state from plugin manager
    const updateState = () => {
      if (pluginManagerRef.current) {
        setState(pluginManagerRef.current.getState());
      }
    };

    updateState();
    const interval = setInterval(updateState, 1000); // Update every second

    return () => {
      clearInterval(interval);
      if (pluginManagerRef.current) {
        pluginManagerRef.current.removeAllListeners();
      }
    };
  }, []);

  // Actions
  const actions: PluginManagerActions = useMemo(() => {
    if (!pluginManagerRef.current) {
      return {} as PluginManagerActions;
    }

    const manager = pluginManagerRef.current;

    return {
      loadPlugin: async (manifest: PluginManifest, config?: Partial<PluginConfig>) => {
        return await manager.loadPlugin(manifest, config);
      },
      
      unloadPlugin: async (pluginId: string) => {
        await manager.unloadPlugin(pluginId);
      },
      
      reloadPlugin: async (pluginId: string) => {
        await manager.reloadPlugin(pluginId);
      },
      
      enablePlugin: async (pluginId: string) => {
        await manager.enablePlugin(pluginId);
      },
      
      disablePlugin: async (pluginId: string) => {
        await manager.disablePlugin(pluginId);
      },
      
      updatePluginConfig: async (pluginId: string, config: Partial<PluginConfig>) => {
        await manager.updatePluginConfig(pluginId, config);
      },
      
      installPlugin: async (manifest: PluginManifest) => {
        return await manager.installPlugin(manifest);
      },
      
      uninstallPlugin: async (pluginId: string) => {
        await manager.uninstallPlugin(pluginId);
      },
      
      updatePlugin: async (pluginId: string) => {
        await manager.updatePlugin(pluginId);
      },
      
      getPluginStatus: (pluginId: string) => {
        return manager.getPluginStatus(pluginId);
      },
      
      getPluginLogs: (pluginId: string) => {
        return manager.getPluginLogs(pluginId);
      },
      
      validatePlugin: async (manifest: PluginManifest) => {
        return await manager.validatePlugin(manifest);
      },
      
      searchPlugins: (query: string) => {
        return manager.searchPlugins(query);
      },
      
      updateRegistry: async () => {
        await manager.updateRegistry();
      },
      
      exportPlugin: async (pluginId: string) => {
        return await manager.exportPlugin(pluginId);
      },
      
      importPlugin: async (pluginData: any) => {
        return await manager.importPlugin(pluginData);
      }
    };
  }, []);

  // Computed values
  const activePlugins = useMemo(() => {
    return Array.from(state.plugins.values()).filter(plugin => plugin.status === 'active');
  }, [state.plugins]);

  const disabledPlugins = useMemo(() => {
    return Array.from(state.plugins.values()).filter(plugin => plugin.status === 'disabled');
  }, [state.plugins]);

  const errorPlugins = useMemo(() => {
    return Array.from(state.plugins.values()).filter(plugin => plugin.status === 'error');
  }, [state.plugins]);

  const pluginsByCategory = useMemo(() => {
    const categories: Record<string, PluginManifest[]> = {};
    state.availablePlugins.forEach(plugin => {
      if (!categories[plugin.category]) {
        categories[plugin.category] = [];
      }
      categories[plugin.category].push(plugin);
    });
    return categories;
  }, [state.availablePlugins]);

  const totalPlugins = useMemo(() => {
    return state.plugins.size;
  }, [state.plugins]);

  const installedPlugins = useMemo(() => {
    return Array.from(state.plugins.values());
  }, [state.plugins]);

  return {
    // State
    ...state,
    activePlugins,
    disabledPlugins,
    errorPlugins,
    pluginsByCategory,
    totalPlugins,
    installedPlugins,
    
    // Actions
    ...actions,
    
    // Computed
    isReady: !!pluginManagerRef.current,
    hasErrors: errorPlugins.length > 0,
    canInstallMore: totalPlugins < 50, // Max 50 plugins
    registryLastUpdated: state.registry.lastUpdated,
    isRegistryUpdating: state.registry.isUpdating
  };
}

/**
 * Hook for managing a specific plugin
 */
export function usePlugin(pluginId: string) {
  const { plugins, ...pluginManager } = usePluginManager();
  
  const plugin = useMemo(() => {
    return plugins.get(pluginId) || null;
  }, [plugins, pluginId]);

  const logs = useMemo(() => {
    return pluginManager.getPluginLogs(pluginId);
  }, [pluginManager, pluginId]);

  const actions = useMemo(() => {
    if (!plugin) return {};

    return {
      reload: () => pluginManager.reloadPlugin(pluginId),
      enable: () => pluginManager.enablePlugin(pluginId),
      disable: () => pluginManager.disablePlugin(pluginId),
      uninstall: () => pluginManager.uninstallPlugin(pluginId),
      update: () => pluginManager.updatePlugin(pluginId),
      updateConfig: (config: Partial<PluginConfig>) => 
        pluginManager.updatePluginConfig(pluginId, config),
      export: () => pluginManager.exportPlugin(pluginId),
      getLogs: () => pluginManager.getPluginLogs(pluginId)
    };
  }, [plugin, pluginManager, pluginId]);

  return {
    plugin,
    logs,
    ...actions,
    isLoaded: !!plugin,
    isActive: plugin?.status === 'active',
    isDisabled: plugin?.status === 'disabled',
    hasError: plugin?.status === 'error',
    error: plugin?.error,
    loadTime: plugin?.loadTime,
    lastActivity: plugin?.lastActivity
  };
}

/**
 * Hook for plugin registry management
 */
export function usePluginRegistry() {
  const { availablePlugins, registry, updateRegistry, searchPlugins, ...pluginManager } = usePluginManager();

  const featuredPlugins = useMemo(() => {
    return availablePlugins.filter(plugin => 
      plugin.keywords.includes('featured') || 
      plugin.keywords.includes('recommended')
    );
  }, [availablePlugins]);

  const popularPlugins = useMemo(() => {
    return availablePlugins
      .filter(plugin => plugin.keywords.includes('popular'))
      .sort((a, b) => b.name.localeCompare(a.name));
  }, [availablePlugins]);

  const recentPlugins = useMemo(() => {
    return availablePlugins
      .sort((a, b) => new Date(b.version).getTime() - new Date(a.version).getTime())
      .slice(0, 10);
  }, [availablePlugins]);

  const searchResults = useCallback((query: string) => {
    return searchPlugins(query);
  }, [searchPlugins]);

  const refreshRegistry = useCallback(async () => {
    await updateRegistry();
  }, [updateRegistry]);

  return {
    availablePlugins,
    featuredPlugins,
    popularPlugins,
    recentPlugins,
    registry,
    searchResults,
    refreshRegistry,
    isUpdating: registry.isUpdating,
    lastUpdated: registry.lastUpdated,
    totalAvailable: availablePlugins.length
  };
}

/**
 * Hook for plugin development and testing
 */
export function usePluginDevelopment() {
  const pluginManager = usePluginManager();

  const createTestPlugin = useCallback((overrides: Partial<PluginManifest> = {}): PluginManifest => {
    return {
      id: `test-plugin-${Date.now()}`,
      name: 'Test Plugin',
      version: '1.0.0',
      description: 'A test plugin for development',
      author: 'Developer',
      license: 'MIT',
      keywords: ['test', 'development'],
      dependencies: {},
      peerDependencies: {},
      main: 'index.js',
      category: 'utility',
      permissions: [],
      apiVersion: '2.0.0',
      minDashboardVersion: '2.0.0',
      ...overrides
    };
  }, []);

  const validateManifest = useCallback(async (manifest: PluginManifest) => {
    return await pluginManager.validatePlugin(manifest);
  }, [pluginManager]);

  const testPlugin = useCallback(async (manifest: PluginManifest) => {
    try {
      const pluginId = await pluginManager.loadPlugin(manifest);
      // Wait a bit to test
      await new Promise(resolve => setTimeout(resolve, 1000));
      await pluginManager.unloadPlugin(pluginId);
      return { success: true, pluginId };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [pluginManager]);

  return {
    createTestPlugin,
    validateManifest,
    testPlugin,
    pluginManager
  };
}
