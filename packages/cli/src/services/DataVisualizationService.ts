import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import _chalk from 'chalk';

// Visualization Types
export interface VisualizationConfig {
  enabled: boolean;
  themes: VisualizationTheme[];
  defaultTheme: string;
  exportFormats: string[];
  interactive: boolean;
  realTime: boolean;
  caching: boolean;
  performance: VisualizationPerformanceConfig;
}

export interface VisualizationTheme {
  id: string;
  name: string;
  colors: string[];
  fonts: {
    primary: string;
    secondary: string;
    size: {
      title: number;
      subtitle: number;
      body: number;
      caption: number;
    };
  };
  layout: {
    padding: number;
    margin: number;
    borderRadius: number;
    shadow: boolean;
  };
  darkMode: boolean;
}

export interface VisualizationPerformanceConfig {
  maxDataPoints: number;
  samplingRate: number;
  compressionLevel: number;
  lazyLoading: boolean;
  virtualization: boolean;
}

export interface Visualization {
  id: string;
  name: string;
  type: VisualizationType;
  title: string;
  description: string;
  data: any;
  config: VisualizationConfig;
  theme: string;
  interactive: boolean;
  responsive: boolean;
  accessibility: AccessibilityConfig;
  metadata: VisualizationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type VisualizationType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'scatter' 
  | 'heatmap' 
  | 'gauge' 
  | 'table' 
  | 'dashboard' 
  | 'treemap' 
  | 'sankey' 
  | 'radar' 
  | 'funnel' 
  | 'waterfall' 
  | 'candlestick' 
  | 'boxplot' 
  | 'histogram' 
  | 'density' 
  | 'network' 
  | 'geographic' 
  | 'timeline';

export interface AccessibilityConfig {
  enabled: boolean;
  altText: string;
  ariaLabel: string;
  keyboardNavigation: boolean;
  screenReader: boolean;
  highContrast: boolean;
  colorBlindFriendly: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface VisualizationMetadata {
  created: Date;
  updated: Date;
  createdBy: string;
  updatedBy: string;
  version: string;
  description: string;
  tags: string[];
  category: string;
  source: string;
  lastDataUpdate: Date;
  dataQuality: number; // 0-1
  performance: {
    renderTime: number; // milliseconds
    dataProcessingTime: number; // milliseconds
    memoryUsage: number; // MB
    fileSize: number; // bytes
  };
}

export interface Dashboard {
  id: string;
  name: string;
  title: string;
  description: string;
  layout: DashboardLayout;
  visualizations: string[]; // Visualization IDs
  filters: DashboardFilter[];
  refreshInterval: number; // seconds
  autoRefresh: boolean;
  sharing: SharingConfig;
  permissions: PermissionConfig;
  metadata: DashboardMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'custom';
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  responsive: boolean;
  breakpoints: Record<string, any>;
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  visualizationId: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  title: string;
  config: Record<string, any>;
  filters: string[];
  refreshInterval?: number;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'range' | 'text';
  field: string;
  options?: any[];
  defaultValue?: any;
  required: boolean;
}

export interface SharingConfig {
  enabled: boolean;
  public: boolean;
  password?: string;
  expiration?: Date;
  allowedUsers: string[];
  allowedRoles: string[];
  embeddable: boolean;
  exportable: boolean;
}

export interface PermissionConfig {
  read: string[];
  write: string[];
  admin: string[];
  public: boolean;
}

export interface DashboardMetadata {
  created: Date;
  updated: Date;
  createdBy: string;
  updatedBy: string;
  version: string;
  description: string;
  tags: string[];
  category: string;
  lastViewed: Date;
  viewCount: number;
  favoriteCount: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  metadata?: Record<string, any>;
}

export interface ChartDataset {
  label: string;
  data: number[] | { x: any; y: any }[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  metadata?: Record<string, any>;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'html' | 'json';
  width?: number;
  height?: number;
  quality?: number;
  backgroundColor?: string;
  includeTitle?: boolean;
  includeLegend?: boolean;
  includeData?: boolean;
  watermark?: string;
}

export class DataVisualizationService extends EventEmitter {
  private config: VisualizationConfig;
  private visualizations: Map<string, Visualization> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private themes: Map<string, VisualizationTheme> = new Map();

  constructor(config: VisualizationConfig) {
    super();
    this.config = config;
    this.initializeService();
  }

  /**
   * Initialize visualization service
   */
  private initializeService(): void {
    if (this.config.enabled) {
      this.initializeThemes();
      this.emit('visualization-service-initialized', { config: this.config });
    }
  }

  /**
   * Initialize default themes
   */
  private initializeThemes(): void {
    // Default theme
    const defaultTheme: VisualizationTheme = {
      id: 'default',
      name: 'Default',
      colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
      fonts: {
        primary: 'Inter, sans-serif',
        secondary: 'Inter, sans-serif',
        size: {
          title: 24,
          subtitle: 18,
          body: 14,
          caption: 12
        }
      },
      layout: {
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadow: true
      },
      darkMode: false
    };

    // Dark theme
    const darkTheme: VisualizationTheme = {
      id: 'dark',
      name: 'Dark',
      colors: ['#60A5FA', '#F87171', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#22D3EE', '#A3E635'],
      fonts: {
        primary: 'Inter, sans-serif',
        secondary: 'Inter, sans-serif',
        size: {
          title: 24,
          subtitle: 18,
          body: 14,
          caption: 12
        }
      },
      layout: {
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadow: true
      },
      darkMode: true
    };

    // Corporate theme
    const corporateTheme: VisualizationTheme = {
      id: 'corporate',
      name: 'Corporate',
      colors: ['#1E40AF', '#DC2626', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#65A30D'],
      fonts: {
        primary: 'Roboto, sans-serif',
        secondary: 'Roboto, sans-serif',
        size: {
          title: 22,
          subtitle: 16,
          body: 13,
          caption: 11
        }
      },
      layout: {
        padding: 12,
        margin: 6,
        borderRadius: 4,
        shadow: false
      },
      darkMode: false
    };

    this.themes.set('default', defaultTheme);
    this.themes.set('dark', darkTheme);
    this.themes.set('corporate', corporateTheme);
  }

  /**
   * Create visualization
   */
  async createVisualization(config: {
    name: string;
    type: VisualizationType;
    title: string;
    description: string;
    data: any;
    theme?: string;
    interactive?: boolean;
    responsive?: boolean;
  }): Promise<Visualization> {
    const theme = this.themes.get(config.theme ?? this.config.defaultTheme);
    if (!theme) {
      throw new Error(`Theme ${config.theme ?? this.config.defaultTheme} not found`);
    }

    const visualization: Visualization = {
      id: uuidv4(),
      name: config.name,
      type: config.type,
      title: config.title,
      description: config.description,
      data: config.data,
      config: this.config,
      theme: theme.id,
      interactive: config.interactive ?? this.config.interactive,
      responsive: config.responsive ?? true,
      accessibility: {
        enabled: true,
        altText: config.description,
        ariaLabel: config.title,
        keyboardNavigation: true,
        screenReader: true,
        highContrast: false,
        colorBlindFriendly: true,
        fontSize: 'medium'
      },
      metadata: {
        created: new Date(),
        updated: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        version: '1.0.0',
        description: config.description,
        tags: [],
        category: 'general',
        source: 'cli',
        lastDataUpdate: new Date(),
        dataQuality: this.calculateDataQuality(config.data),
        performance: {
          renderTime: 0,
          dataProcessingTime: 0,
          memoryUsage: 0,
          fileSize: 0
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.visualizations.set(visualization.id, visualization);
    this.emit('visualization-created', visualization);

    return visualization;
  }

  /**
   * Create dashboard
   */
  async createDashboard(config: {
    name: string;
    title: string;
    description: string;
    layout?: Partial<DashboardLayout>;
    visualizations?: string[];
    filters?: DashboardFilter[];
    refreshInterval?: number;
  }): Promise<Dashboard> {
    const dashboard: Dashboard = {
      id: uuidv4(),
      name: config.name,
      title: config.title,
      description: config.description,
      layout: {
        type: 'grid',
        columns: 4,
        rows: 3,
        gap: 16,
        padding: 16,
        responsive: true,
        breakpoints: {
          mobile: { columns: 1, rows: 6 },
          tablet: { columns: 2, rows: 4 },
          desktop: { columns: 4, rows: 3 }
        },
        widgets: [],
        ...config.layout
      },
      visualizations: config.visualizations ?? [],
      filters: config.filters ?? [],
      refreshInterval: config.refreshInterval ?? 300,
      autoRefresh: true,
      sharing: {
        enabled: false,
        public: false,
        allowedUsers: [],
        allowedRoles: [],
        embeddable: false,
        exportable: true
      },
      permissions: {
        read: [],
        write: [],
        admin: [],
        public: false
      },
      metadata: {
        created: new Date(),
        updated: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        version: '1.0.0',
        description: config.description,
        tags: [],
        category: 'general',
        lastViewed: new Date(),
        viewCount: 0,
        favoriteCount: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboards.set(dashboard.id, dashboard);
    this.emit('dashboard-created', dashboard);

    return dashboard;
  }

  /**
   * Generate chart data from analytics data
   */
  generateChartData(data: any[], config: {
    type: VisualizationType;
    xField: string;
    yField: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  }): ChartData {
    const _labels: string[] = [];
    const _datasets: ChartDataset[] = [];

    switch (config.type) {
      case 'line':
      case 'bar':
        return this.generateTimeSeriesData(data, config);
      
      case 'pie':
        return this.generatePieChartData(data, config);
      
      case 'scatter':
        return this.generateScatterPlotData(data, config);
      
      case 'heatmap':
        return this.generateHeatmapData(data, config);
      
      default:
        return this.generateTimeSeriesData(data, config);
    }
  }

  /**
   * Generate time series chart data
   */
  private generateTimeSeriesData(data: any[], config: any): ChartData {
    const labels: string[] = [];
    const datasets: ChartDataset[] = [];

    // Group data by time
    const groupedData = data.reduce((acc, item) => {
      const timeKey = new Date(item[config.xField]).toISOString().split('T')[0];
      if (timeKey !== undefined) {
        acc[timeKey] ??= [];
        acc[timeKey].push(item);
      }
      return acc;
    }, {} as Record<string, any[]>);

    // Generate labels and data
    Object.keys(groupedData).sort().forEach(timeKey => {
      labels.push(timeKey);
    });

    // Generate datasets
    if (config.groupBy) {
      const groups = [...new Set(data.map(item => item[config.groupBy]))];
      groups.forEach((group, index) => {
        const theme = this.themes.get(this.config.defaultTheme);
        const color = theme?.colors[index % theme.colors.length] ?? '#3B82F6';
        
        const groupData = labels.map(label => {
          const dayData = groupedData[label]?.filter((item: any) => item[config.groupBy] === group) ?? [];
          return this.aggregateData(dayData, config.yField, config.aggregation ?? 'sum');
        });

        datasets.push({
          label: group,
          data: groupData,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          fill: config.type === 'line',
          tension: 0.4
        });
      });
    } else {
      const theme = this.themes.get(this.config.defaultTheme);
      const color = theme?.colors[0] ?? '#3B82F6';
      
      const aggregatedData = labels.map(label => {
        const dayData = groupedData[label] ?? [];
        return this.aggregateData(dayData, config.yField, config.aggregation ?? 'sum');
      });

      datasets.push({
        label: config.yField,
        data: aggregatedData,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        fill: config.type === 'line',
        tension: 0.4
      });
    }

    return { labels, datasets };
  }

  /**
   * Generate pie chart data
   */
  private generatePieChartData(data: any[], config: any): ChartData {
    const groupedData = data.reduce((acc, item) => {
      const key = item[config.xField];
      acc[key] ??= 0;
      acc[key] += this.aggregateData([item], config.yField, config.aggregation ?? 'sum');
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(groupedData);
    const theme = this.themes.get(this.config.defaultTheme);
    
    const datasets: ChartDataset[] = [{
      label: config.yField,
      data: Object.values(groupedData) as number[],
      backgroundColor: labels.map((_, index) => 
        theme?.colors[index % theme.colors.length] ?? '#3B82F6'
      ),
      borderColor: '#ffffff',
      borderWidth: 2
    }];

    return { labels, datasets };
  }

  /**
   * Generate scatter plot data
   */
  private generateScatterPlotData(data: any[], config: any): ChartData {
    const theme = this.themes.get(this.config.defaultTheme);
    const color = theme?.colors[0] ?? '#3B82F6';

    const scatterData = data.map(item => ({
      x: item[config.xField],
      y: item[config.yField]
    }));

    const datasets: ChartDataset[] = [{
      label: `${config.yField} vs ${config.xField}`,
      data: scatterData,
      backgroundColor: color,
      borderColor: color,
      pointRadius: 6,
      pointHoverRadius: 8
    }];

    return { 
      labels: [], 
      datasets,
      metadata: { type: 'scatter' }
    };
  }

  /**
   * Generate heatmap data
   */
  private generateHeatmapData(data: any[], config: any): ChartData {
    // Simple heatmap implementation
    const labels = [...new Set(data.map(item => item[config.xField]))];
    const datasets: ChartDataset[] = [{
      label: 'Heatmap',
      data: data.map(item => item[config.yField]),
      backgroundColor: data.map(item => {
        const value = item[config.yField];
        const normalized = (value - Math.min(...data.map(d => d[config.yField]))) / 
                          (Math.max(...data.map(d => d[config.yField])) - Math.min(...data.map(d => d[config.yField])));
        return `rgba(59, 130, 246, ${normalized})`;
      })
    }];

    return { labels, datasets, metadata: { type: 'heatmap' } };
  }

  /**
   * Aggregate data
   */
  private aggregateData(data: any[], field: string, aggregation: string): number {
    const values = data.map(item => item[field]).filter(v => typeof v === 'number');
    
    if (values.length === 0) return 0;

    switch (aggregation) {
      case 'sum':
        return values.reduce((sum, v) => sum + v, 0);
      case 'avg':
        return values.reduce((sum, v) => sum + v, 0) / values.length;
      case 'count':
        return values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return values.reduce((sum, v) => sum + v, 0);
    }
  }

  /**
   * Calculate data quality score
   */
  private calculateDataQuality(data: any): number {
    if (!data || typeof data !== 'object') return 0;

    let quality = 1.0;
    
    // Check for missing values
    if (Array.isArray(data)) {
      const totalValues = data.length;
      const missingValues = data.filter(item => item === null || item === undefined).length;
      quality -= (missingValues / totalValues) * 0.3;
    }

    // Check for data consistency
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      const consistentTypes = data.every(item => 
        typeof item === typeof firstItem
      );
      if (!consistentTypes) quality -= 0.2;
    }

    return Math.max(0, Math.min(1, quality));
  }

  /**
   * Export visualization
   */
  async exportVisualization(visualizationId: string, options: ExportOptions): Promise<Buffer | string> {
    const visualization = this.visualizations.get(visualizationId);
    if (!visualization) {
      throw new Error(`Visualization ${visualizationId} not found`);
    }

    // In a real implementation, this would generate the actual export
    // For now, we'll return a mock export
    const exportData = {
      visualization: {
        id: visualization.id,
        name: visualization.name,
        type: visualization.type,
        title: visualization.title,
        data: visualization.data,
        config: visualization.config,
        theme: visualization.theme
      },
      export: {
        format: options.format,
        timestamp: new Date().toISOString(),
        options
      }
    };

    this.emit('visualization-exported', { visualizationId, format: options.format });

    switch (options.format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'html':
        return this.generateHTMLExport(exportData);
      default:
        return Buffer.from(JSON.stringify(exportData));
    }
  }

  /**
   * Generate HTML export
   */
  private generateHTMLExport(data: any): string {
    const theme = this.themes.get(data.visualization.theme);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.visualization.title}</title>
    <style>
        body {
            font-family: ${theme?.fonts.primary ?? 'Inter, sans-serif'};
            margin: 0;
            padding: 20px;
            background-color: ${theme?.darkMode ? '#1a1a1a' : '#ffffff'};
            color: ${theme?.darkMode ? '#ffffff' : '#000000'};
        }
        .visualization {
            max-width: 800px;
            margin: 0 auto;
            padding: ${theme?.layout.padding ?? 16}px;
            border-radius: ${theme?.layout.borderRadius ?? 8}px;
            ${theme?.layout.shadow ? 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);' : ''}
            background-color: ${theme?.darkMode ? '#2a2a2a' : '#ffffff'};
        }
        .title {
            font-size: ${theme?.fonts.size.title ?? 24}px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .description {
            font-size: ${theme?.fonts.size.body ?? 14}px;
            margin-bottom: 20px;
            opacity: 0.8;
        }
        .data {
            font-family: monospace;
            background-color: ${theme?.darkMode ? '#333333' : '#f5f5f5'};
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="visualization">
        <h1 class="title">${data.visualization.title}</h1>
        <p class="description">${data.visualization.description}</p>
        <div class="data">
            <pre>${JSON.stringify(data.visualization.data, null, 2)}</pre>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Get visualization
   */
  getVisualization(id: string): Visualization | null {
    return this.visualizations.get(id) ?? null;
  }

  /**
   * Get all visualizations
   */
  getVisualizations(filters?: {
    type?: VisualizationType;
    theme?: string;
    limit?: number;
  }): Visualization[] {
    let visualizations = Array.from(this.visualizations.values());

    if (filters) {
      if (filters.type) {
        visualizations = visualizations.filter(v => v.type === filters.type);
      }
      if (filters.theme) {
        visualizations = visualizations.filter(v => v.theme === filters.theme);
      }
      if (filters.limit) {
        visualizations = visualizations.slice(0, filters.limit);
      }
    }

    return visualizations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get dashboard
   */
  getDashboard(id: string): Dashboard | null {
    return this.dashboards.get(id) ?? null;
  }

  /**
   * Get all dashboards
   */
  getDashboards(limit?: number): Dashboard[] {
    const dashboards = Array.from(this.dashboards.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? dashboards.slice(0, limit) : dashboards;
  }

  /**
   * Get themes
   */
  getThemes(): VisualizationTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Update visualization
   */
  async updateVisualization(id: string, updates: Partial<Visualization>): Promise<void> {
    const visualization = this.visualizations.get(id);
    if (visualization) {
      Object.assign(visualization, updates);
      visualization.updatedAt = new Date();
      visualization.metadata.updated = new Date();
      this.visualizations.set(id, visualization);
      this.emit('visualization-updated', visualization);
    }
  }

  /**
   * Delete visualization
   */
  async deleteVisualization(id: string): Promise<void> {
    const visualization = this.visualizations.get(id);
    if (visualization) {
      this.visualizations.delete(id);
      this.emit('visualization-deleted', { id, visualization });
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    enabled: boolean;
    visualizationsCount: number;
    dashboardsCount: number;
    themesCount: number;
    config: VisualizationConfig;
  } {
    return {
      enabled: this.config.enabled,
      visualizationsCount: this.visualizations.size,
      dashboardsCount: this.dashboards.size,
      themesCount: this.themes.size,
      config: this.config
    };
  }
}
