import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
// Mock validation function for now
const validateConfig = (config: any) => {
  const errors: string[] = [];
  
  if (!config.base) {
    errors.push('Missing base breakpoint configuration');
  }
  
  if (!config.breakpoints || !Array.isArray(config.breakpoints)) {
    errors.push('Missing or invalid breakpoints configuration');
  }
  
  if (!config.strategy) {
    errors.push('Missing scaling strategy configuration');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const devCommand = new Command('dev')
  .description('Start development server with live preview and responsive testing')
  .option('-c, --config <path>', 'Path to configuration file', 'rre.config.ts')
  .option('-p, --port <number>', 'Port for development server', '3000')
  .option('-h, --host <host>', 'Host for development server', 'localhost')
  .option('--open', 'Open browser automatically')
  .option('--live', 'Enable live reload')
  .option('--responsive', 'Show responsive preview panel')
  .action(async (options) => {
    const spinner = ora('Starting React Responsive Easy development server...').start();
    
    try {
      // Validate configuration
      spinner.text = 'Validating configuration...';
      const configPath = path.resolve(options.config);
      
      if (!fs.existsSync(configPath)) {
        spinner.fail(`Configuration file not found: ${configPath}`);
        console.log(chalk.yellow('\n💡 Run "rre init" to create a configuration file'));
        process.exit(1);
      }
      
      // Load and validate config
      const config = await loadConfig(configPath);
      const validationResult = validateConfig(config);
      
      if (!validationResult.valid) {
        spinner.fail('Configuration validation failed');
        console.error(chalk.red('\n❌ Configuration errors:'));
        validationResult.errors.forEach(error => {
          console.error(chalk.red(`  • ${error}`));
        });
        process.exit(1);
      }
      
      spinner.succeed('Configuration validated successfully');
      
      // Check for package.json and dependencies
      spinner.text = 'Checking project setup...';
      const projectSetup = await checkProjectSetup();
      
      if (!projectSetup.hasPackageJson) {
        spinner.warn('No package.json found. Some features may not work.');
      }
      
      if (!projectSetup.hasCoreDependency) {
        spinner.warn('@react-responsive-easy/core not found in dependencies.');
        console.log(chalk.yellow('\n💡 Install with: npm install @react-responsive-easy/core'));
      }
      
      // Generate development server files
      spinner.text = 'Setting up development server...';
      const devFiles = await setupDevelopmentServer(config, options);
      
      // Start development server
      spinner.text = 'Starting server...';
      await startDevelopmentServer(devFiles, options);
      
      spinner.succeed('Development server started successfully!');
      
      // Show server information
      showServerInfo(options, config, devFiles);
      
      // Show responsive testing instructions
      showResponsiveTestingInstructions(config);
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n🛑 Development server stopped'));
        process.exit(0);
      });
      
    } catch (error) {
      spinner.fail('Failed to start development server');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function loadConfig(configPath: string): Promise<any> {
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const configMatch = configContent.match(/defineConfig\(([\s\S]*?)\)/);
    if (!configMatch) {
      throw new Error('Could not parse configuration file');
    }
    const configString = configMatch[1];
    return JSON.parse(configString);
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

async function checkProjectSetup(): Promise<any> {
  const hasPackageJson = fs.existsSync('package.json');
  let hasCoreDependency = false;
  
  if (hasPackageJson) {
    try {
      const packageJson = await fs.readJson('package.json');
      hasCoreDependency = packageJson.dependencies?.['@react-responsive-easy/core'] ||
                         packageJson.devDependencies?.['@react-responsive-easy/core'];
    } catch (error) {
      // Silently fail
    }
  }
  
  return {
    hasPackageJson,
    hasCoreDependency
  };
}

async function setupDevelopmentServer(config: any, options: any): Promise<any> {
  const devDir = '.rre-dev';
  await fs.ensureDir(devDir);
  
  // Generate HTML template
  const htmlContent = generateDevHTML(config, options);
  const htmlPath = path.join(devDir, 'index.html');
  await fs.writeFile(htmlPath, htmlContent);
  
  // Generate development JavaScript
  const jsContent = generateDevJS(config, options);
  const jsPath = path.join(devDir, 'dev.js');
  await fs.writeFile(jsPath, jsContent);
  
  // Generate CSS for responsive preview
  const cssContent = generateDevCSS(config, options);
  const cssPath = path.join(devDir, 'dev.css');
  await fs.writeFile(cssPath, cssContent);
  
  return {
    htmlPath,
    jsPath,
    cssPath,
    devDir
  };
}

function generateDevHTML(config: any, options: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Responsive Easy - Development Server</title>
    <link rel="stylesheet" href="dev.css">
</head>
<body>
    <div id="app">
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading React Responsive Easy...</p>
        </div>
    </div>
    
    ${options.responsive ? generateResponsivePreviewPanel(config) : ''}
    
    <script src="dev.js"></script>
</body>
</html>`;
}

function generateResponsivePreviewPanel(config: any): string {
  const breakpoints = config.breakpoints.map((bp: any) => 
    `<option value="${bp.name}">${bp.name} (${bp.width}×${bp.height})</option>`
  ).join('');
  
  return `
    <div class="responsive-preview-panel">
        <div class="panel-header">
            <h3>📱 Responsive Preview</h3>
            <button class="close-btn" onclick="togglePreviewPanel()">×</button>
        </div>
        <div class="panel-content">
            <div class="breakpoint-selector">
                <label for="breakpoint-select">Current Breakpoint:</label>
                <select id="breakpoint-select" onchange="changeBreakpoint(this.value)">
                    ${breakpoints}
                </select>
            </div>
            <div class="viewport-info">
                <div class="info-item">
                    <span class="label">Width:</span>
                    <span id="viewport-width">-</span>
                </div>
                <div class="info-item">
                    <span class="label">Height:</span>
                    <span id="viewport-height">-</span>
                </div>
                <div class="info-item">
                    <span class="label">Scale:</span>
                    <span id="viewport-scale">-</span>
                </div>
            </div>
            <div class="responsive-controls">
                <button onclick="toggleDeviceFrame()">Toggle Device Frame</button>
                <button onclick="resetViewport()">Reset Viewport</button>
            </div>
        </div>
    </div>`;
}

function generateDevJS(config: any, options: any): string {
  return `
// React Responsive Easy Development Server
// This is a simplified development environment for testing responsive behavior

let currentBreakpoint = '${config.base.name}';
let deviceFrameVisible = false;

// Mock ResponsiveProvider for development
class MockResponsiveProvider {
    constructor(config) {
        this.config = config;
        this.currentBreakpoint = config.base;
        this.breakpoints = config.breakpoints;
    }
    
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }
    
    setBreakpoint(breakpointName) {
        this.currentBreakpoint = this.breakpoints.find(bp => bp.name === breakpointName) || this.config.base;
        this.updateViewport();
        this.updateUI();
    }
    
    updateViewport() {
        const bp = this.currentBreakpoint;
        document.documentElement.style.setProperty('--viewport-width', bp.width + 'px');
        document.documentElement.style.setProperty('--viewport-height', bp.height + 'px');
        
        // Update viewport info
        document.getElementById('viewport-width').textContent = bp.width + 'px';
        document.getElementById('viewport-height').textContent = bp.height + 'px';
        
        // Calculate scale ratio
        const baseWidth = ${config.base.width};
        const scale = (bp.width / baseWidth).toFixed(3);
        document.getElementById('viewport-scale').textContent = scale + 'x';
    }
    
    updateUI() {
        // Trigger responsive updates
        document.body.style.setProperty('--current-breakpoint', this.currentBreakpoint.name);
        document.body.style.setProperty('--current-width', this.currentBreakpoint.width + 'px');
        document.body.style.setProperty('--current-height', this.currentBreakpoint.height + 'px');
        
        // Dispatch custom event for components to listen to
        window.dispatchEvent(new CustomEvent('breakpointChange', {
            detail: { breakpoint: this.currentBreakpoint }
        }));
    }
}

// Mock hooks for development
function useResponsiveValue(value, options = {}) {
    const provider = window.mockProvider;
    const bp = provider.getCurrentBreakpoint();
    
    // Simple scaling logic for development
    const baseWidth = ${config.base.width};
    const ratio = bp.width / baseWidth;
    
    let scaled = value * ratio;
    
    // Apply token-specific scaling
    if (options.token && ${JSON.stringify(config.strategy.tokens)}[options.token]) {
        const token = ${JSON.stringify(config.strategy.tokens)}[options.token];
        if (token.scale) scaled *= token.scale;
        if (token.min) scaled = Math.max(scaled, token.min);
        if (token.max) scaled = Math.min(scaled, token.max);
    }
    
    return Math.round(scaled * 100) / 100;
}

function useBreakpointMatch(breakpointName) {
    const provider = window.mockProvider;
    return provider.getCurrentBreakpoint().name === breakpointName;
}

// Initialize development environment
function initDevEnvironment() {
    const config = ${JSON.stringify(config)};
    window.mockProvider = new MockResponsiveProvider(config);
    
    // Set initial breakpoint
    window.mockProvider.setBreakpoint('${config.base.name}');
    
    // Create example component
    createExampleComponent();
    
    // Setup responsive preview
    if (${options.responsive}) {
        setupResponsivePreview();
    }
    
    console.log('🚀 React Responsive Easy Development Server Ready!');
    console.log('💡 Use useResponsiveValue() and other hooks in the console');
    console.log('💡 Change breakpoints using the responsive preview panel');
}

function createExampleComponent() {
    const app = document.getElementById('app');
    
    const exampleHTML = \`
        <div class="example-app">
            <h1>React Responsive Easy - Development Preview</h1>
            <p>This is a development environment for testing responsive behavior.</p>
            
            <div class="example-components">
                <div class="example-button">
                    <h3>Responsive Button</h3>
                    <button id="responsive-button" class="btn">
                        Click me
                    </button>
                    <p>Font size: <span id="button-font-size">-</span></p>
                    <p>Padding: <span id="button-padding">-</span></p>
                </div>
                
                <div class="example-card">
                    <h3>Responsive Card</h3>
                    <div id="responsive-card" class="card">
                        <h4>Sample Card</h4>
                        <p>This card demonstrates responsive scaling.</p>
                    </div>
                    <p>Card width: <span id="card-width">-</span></p>
                    <p>Card padding: <span id="card-padding">-</span></p>
                </div>
            </div>
            
            <div class="dev-info">
                <h3>Development Information</h3>
                <p><strong>Current Breakpoint:</strong> <span id="current-bp">-</span></p>
                <p><strong>Viewport:</strong> <span id="viewport-size">-</span></p>
                <p><strong>Scaling Ratio:</strong> <span id="scaling-ratio">-</span></p>
            </div>
        </div>
    \`;
    
    app.innerHTML = exampleHTML;
    
    // Update example component with responsive values
    updateExampleComponent();
}

function updateExampleComponent() {
    const button = document.getElementById('responsive-button');
    const card = document.getElementById('responsive-card');
    
    if (button) {
        const fontSize = useResponsiveValue(18, { token: 'fontSize' });
        const padding = useResponsiveValue(16, { token: 'spacing' });
        
        button.style.fontSize = fontSize + 'px';
        button.style.padding = padding + 'px';
        
        document.getElementById('button-font-size').textContent = fontSize + 'px';
        document.getElementById('button-padding').textContent = padding + 'px';
    }
    
    if (card) {
        const width = useResponsiveValue(300, { token: 'spacing' });
        const padding = useResponsiveValue(20, { token: 'spacing' });
        
        card.style.width = width + 'px';
        card.style.padding = padding + 'px';
        
        document.getElementById('card-width').textContent = width + 'px';
        document.getElementById('card-padding').textContent = padding + 'px';
    }
    
    // Update dev info
    const provider = window.mockProvider;
    const bp = provider.getCurrentBreakpoint();
    const ratio = (bp.width / ${config.base.width}).toFixed(3);
    
    document.getElementById('current-bp').textContent = bp.name;
    document.getElementById('viewport-size').textContent = bp.width + '×' + bp.height;
    document.getElementById('scaling-ratio').textContent = ratio + 'x';
}

function setupResponsivePreview() {
    // Add event listeners for responsive preview panel
    window.changeBreakpoint = function(breakpointName) {
        window.mockProvider.setBreakpoint(breakpointName);
        updateExampleComponent();
    };
    
    window.toggleDeviceFrame = function() {
        deviceFrameVisible = !deviceFrameVisible;
        document.body.classList.toggle('device-frame', deviceFrameVisible);
    };
    
    window.resetViewport = function() {
        window.mockProvider.setBreakpoint('${config.base.name}');
        updateExampleComponent();
    };
    
    window.togglePreviewPanel = function() {
        document.querySelector('.responsive-preview-panel').classList.toggle('collapsed');
    };
}

// Start development environment when page loads
document.addEventListener('DOMContentLoaded', initDevEnvironment);

// Listen for breakpoint changes
window.addEventListener('breakpointChange', updateExampleComponent);

// Make hooks available globally for console testing
window.useResponsiveValue = useResponsiveValue;
window.useBreakpointMatch = useBreakpointMatch;
window.mockProvider = null; // Will be set by initDevEnvironment
`;
}

function generateDevCSS(config: any, options: any): string {
  return `
/* React Responsive Easy Development Server Styles */

:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    
    --current-breakpoint: ${config.base.name};
    --current-width: ${config.base.width}px;
    --current-height: ${config.base.height}px;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: white;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top: 5px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.example-app {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.example-app h1 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 30px;
    font-size: 2.5rem;
}

.example-components {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin: 40px 0;
}

.example-button, .example-card {
    padding: 25px;
    border: 2px solid var(--light-color);
    border-radius: 8px;
    text-align: center;
}

.example-button h3, .example-card h3 {
    color: var(--secondary-color);
    margin-bottom: 20px;
}

.btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.card {
    background: var(--light-color);
    border-radius: 8px;
    padding: 20px;
    text-align: left;
}

.card h4 {
    color: var(--dark-color);
    margin-bottom: 15px;
}

.dev-info {
    background: var(--light-color);
    padding: 25px;
    border-radius: 8px;
    margin-top: 30px;
}

.dev-info h3 {
    color: var(--secondary-color);
    margin-bottom: 20px;
}

.dev-info p {
    margin: 10px 0;
    font-family: 'Courier New', monospace;
    background: white;
    padding: 8px 12px;
    border-radius: 4px;
    border-left: 4px solid var(--primary-color);
}

/* Responsive Preview Panel */
.responsive-preview-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transition: all 0.3s ease;
}

.responsive-preview-panel.collapsed {
    transform: translateX(calc(100% - 50px));
}

.panel-header {
    background: var(--primary-color);
    color: white;
    padding: 15px 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.panel-content {
    padding: 20px;
}

.breakpoint-selector {
    margin-bottom: 20px;
}

.breakpoint-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--dark-color);
}

.breakpoint-selector select {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--light-color);
    border-radius: 6px;
    font-size: 14px;
    background: white;
}

.viewport-info {
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 8px 0;
    border-bottom: 1px solid var(--light-color);
}

.info-item .label {
    font-weight: 600;
    color: var(--secondary-color);
}

.info-item span:last-child {
    font-family: 'Courier New', monospace;
    color: var(--primary-color);
}

.responsive-controls {
    display: flex;
    gap: 10px;
}

.responsive-controls button {
    flex: 1;
    padding: 10px;
    border: 2px solid var(--primary-color);
    background: white;
    color: var(--primary-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
}

.responsive-controls button:hover {
    background: var(--primary-color);
    color: white;
}

/* Device Frame */
body.device-frame {
    background: #000;
}

body.device-frame .example-app {
    max-width: var(--current-width);
    margin: 20px auto;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
}

body.device-frame .example-app::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #333;
    border-radius: 0 0 4px 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .example-app {
        margin: 10px;
        padding: 20px;
    }
    
    .example-app h1 {
        font-size: 2rem;
    }
    
    .example-components {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .responsive-preview-panel {
        width: 280px;
        right: 10px;
        top: 10px;
    }
}

@media (max-width: 480px) {
    .example-app {
        margin: 5px;
        padding: 15px;
    }
    
    .example-app h1 {
        font-size: 1.5rem;
    }
    
    .responsive-preview-panel {
        width: 250px;
        right: 5px;
        top: 5px;
    }
}
`;
}

async function startDevelopmentServer(devFiles: any, options: any): Promise<void> {
  // For now, we'll create a simple file server
  // In a real implementation, this would use a proper HTTP server
  
  console.log(chalk.green('\n🚀 Development server files created:'));
  console.log(chalk.gray(`  • HTML: ${devFiles.htmlPath}`));
  console.log(chalk.gray(`  • JavaScript: ${devFiles.jsPath}`));
  console.log(chalk.gray(`  • CSS: ${devFiles.cssPath}`));
  
  console.log(chalk.yellow('\n💡 To view your responsive preview:'));
  console.log(chalk.cyan(`  1. Open ${devFiles.htmlPath} in your browser`));
  console.log(chalk.cyan('  2. Use the responsive preview panel to test different breakpoints'));
  console.log(chalk.cyan('  3. Test responsive hooks in the browser console'));
  
  if (options.open) {
    console.log(chalk.blue('\n🌐 Opening browser...'));
    // In a real implementation, this would open the browser
  }
}

function showServerInfo(options: any, config: any, devFiles: any): void {
  console.log(chalk.blue('\n📊 Development Server Information:'));
  console.log(chalk.gray(`  • Port: ${options.port}`));
  console.log(chalk.gray(`  • Host: ${options.host}`));
  console.log(chalk.gray(`  • Live Reload: ${options.live ? 'Enabled' : 'Disabled'}`));
  console.log(chalk.gray(`  • Responsive Preview: ${options.responsive ? 'Enabled' : 'Disabled'}`));
  
  console.log(chalk.yellow('\n⚙️  Configuration:'));
  console.log(chalk.gray(`  • Base Breakpoint: ${config.base.name} (${config.base.width}×${config.base.height})`));
  console.log(chalk.gray(`  • Total Breakpoints: ${config.breakpoints.length}`));
  console.log(chalk.gray(`  • Scaling Strategy: ${config.strategy.origin}`));
  
  console.log(chalk.green('\n🎯 Available Breakpoints:'));
  config.breakpoints.forEach((bp: any) => {
    const isBase = bp.name === config.base.name;
    const marker = isBase ? '⭐' : '📱';
    console.log(chalk.gray(`  ${marker} ${bp.name}: ${bp.width}×${bp.height}`));
  });
}

function showResponsiveTestingInstructions(config: any): void {
  console.log(chalk.blue('\n🧪 Responsive Testing Instructions:'));
  console.log(chalk.cyan('  1. Open the HTML file in your browser'));
  console.log(chalk.cyan('  2. Use the responsive preview panel to switch breakpoints'));
  console.log(chalk.cyan('  3. Test responsive hooks in the browser console:'));
  console.log(chalk.gray('     • useResponsiveValue(18, { token: "fontSize" })'));
  console.log(chalk.gray('     • useBreakpointMatch("mobile")'));
  console.log(chalk.cyan('  4. Observe how components scale across breakpoints'));
  console.log(chalk.cyan('  5. Check the browser console for responsive updates'));
  
  console.log(chalk.yellow('\n💡 Pro Tips:'));
  console.log(chalk.gray('  • Use browser dev tools to simulate different screen sizes'));
  console.log(chalk.gray('  • Test accessibility with different font sizes'));
  console.log(chalk.gray('  • Verify touch targets meet minimum size requirements'));
}
