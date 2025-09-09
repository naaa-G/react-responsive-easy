import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock functions for now - will be replaced with actual imports later
const createDefaultConfig = () => ({
  base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
  breakpoints: [
    { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
  ],
  strategy: {
    origin: 'width',
    tokens: {
      fontSize: { scale: 0.85, min: 12, max: 22 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 }
    },
    rounding: { mode: 'nearest', precision: 0.5 }
  }
});

const configPresets = {
  conservative: createDefaultConfig(),
  aggressive: {
    ...createDefaultConfig(),
    strategy: {
      ...createDefaultConfig().strategy,
      tokens: {
        fontSize: { scale: 0.7, min: 10, max: 24 },
        spacing: { scale: 0.7, step: 1 },
        radius: { scale: 0.8 }
      }
    }
  },
  'mobile-first': {
    ...createDefaultConfig(),
    base: { name: 'mobile', width: 390, height: 844, alias: 'base' },
    breakpoints: [
      { name: 'mobile', width: 390, height: 844, alias: 'base' },
      { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
      { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
      { name: 'desktop', width: 1920, height: 1080, alias: 'desktop' }
    ]
  }
};

export const initCommand = new Command('init')
  .description('Initialize React Responsive Easy in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-p, --preset <preset>', 'Use configuration preset (conservative|aggressive|mobile-first)')
  .option('-o, --output <path>', 'Output directory for config files', '.')
  .action(async (options) => {
    const spinner = ora('Initializing React Responsive Easy...').start();
    
    try {
      // Determine output directory
      const outputDir = path.resolve(options.output);
      
      // Check if directory exists
      if (!fs.existsSync(outputDir)) {
        spinner.fail('Output directory does not exist');
        process.exit(1);
      }
      
      // Check if already initialized
      const configPath = path.join(outputDir, 'rre.config.ts');
      if (fs.existsSync(configPath) && !options.yes) {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'rre.config.ts already exists. Overwrite?',
            default: false
          }
        ]);
        
        if (!overwrite) {
          spinner.info('Initialization cancelled');
          return;
        }
      }
      
      // Get configuration preset
      let preset = options.preset;
      if (!preset && !options.yes) {
        const { selectedPreset } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedPreset',
            message: 'Choose a configuration preset:',
            choices: [
              { name: 'Conservative - Balanced scaling with accessibility focus', value: 'conservative' },
              { name: 'Aggressive - Maximum scaling for dramatic effects', value: 'aggressive' },
              { name: 'Mobile-First - Optimized for mobile experiences', value: 'mobile-first' },
              { name: 'Custom - Start with defaults and customize later', value: 'custom' }
            ],
            default: 'conservative'
          }
        ]);
        preset = selectedPreset;
      }
      
      // Generate configuration
      let config;
      if (preset && preset !== 'custom') {
        config = configPresets[preset as keyof typeof configPresets];
      } else {
        config = createDefaultConfig();
      }
      
      // Create configuration file
      const configContent = generateConfigFile(config, preset);
      await fs.writeFile(configPath, configContent);
      
      // Create example component
      const examplePath = path.join(outputDir, 'components', 'ExampleButton.tsx');
      await fs.ensureDir(path.dirname(examplePath));
      await fs.writeFile(examplePath, generateExampleComponent());
      
      // Create package.json scripts
      await updatePackageJson(outputDir);
      
      // Create README section
      const readmePath = path.join(outputDir, 'RRE_SETUP.md');
      await fs.writeFile(readmePath, generateSetupGuide());
      
      spinner.succeed('React Responsive Easy initialized successfully!');
      
      // Show next steps
      console.log(chalk.green('\n🎉 Setup complete! Next steps:'));
      console.log(`${chalk.cyan('1. ')}Install dependencies: npm install @react-responsive-easy/core`);
      console.log(`${chalk.cyan('2. ')}Wrap your app with <ResponsiveProvider>`);
      console.log(`${chalk.cyan('3. ')}Use responsive hooks in your components`);
      console.log(`${chalk.cyan('4. ')}Run rre build to transform your code`);
      console.log(`${chalk.cyan('5. ')}Run rre analyze to check scaling`);
      
      console.log(chalk.yellow('\n📁 Files created:'));
      console.log(chalk.gray('  • ') + configPath);
      console.log(chalk.gray('  • ') + examplePath);
      console.log(chalk.gray('  • ') + readmePath);
      
    } catch (error) {
      spinner.fail('Initialization failed');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

function generateConfigFile(config: any, preset?: string): string {
  return `import { defineConfig } from '@react-responsive-easy/core';

export default defineConfig(${JSON.stringify(config, null, 2)});

// Configuration preset: ${preset || 'custom'}
// 
// Available options:
// - base: Base breakpoint (largest screen size)
// - breakpoints: Array of breakpoints with width/height
// - strategy: Scaling strategy (origin, tokens, rounding)
// - tokens: Specialized scaling rules for different CSS properties
// 
// Run 'rre analyze' to validate your configuration
// Run 'rre build' to transform your code
`;
}

function generateExampleComponent(): string {
  return `import React from 'react';
import { ResponsiveProvider, useResponsiveValue, useBreakpointMatch } from '@react-responsive-easy/core';
import config from '../rre.config';

// Example responsive button component
const ExampleButton: React.FC = () => {
  const fontSize = useResponsiveValue(18, { token: 'fontSize' });
  const padding = useResponsiveValue(16, { token: 'spacing' });
  const isMobile = useBreakpointMatch('mobile');
  
  return (
    <button 
      style={{ 
        fontSize: \`\${fontSize}px\`, 
        padding: \`\${padding}px\`,
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      {isMobile ? 'Tap me' : 'Click me'}
    </button>
  );
};

// Example app wrapper
const App: React.FC = () => (
  <ResponsiveProvider config={config}>
    <div style={{ padding: '20px' }}>
      <h1>React Responsive Easy Example</h1>
      <ExampleButton />
    </div>
  </ResponsiveProvider>
);

export default App;
export { ExampleButton };
`;
}

async function updatePackageJson(outputDir: string): Promise<void> {
  const packagePath = path.join(outputDir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    return; // No package.json to update
  }
  
  try {
    const packageJson = await fs.readJson(packagePath);
    
    // Add RRE scripts
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['rre:build'] = 'rre build';
    packageJson.scripts['rre:analyze'] = 'rre analyze';
    packageJson.scripts['rre:dev'] = 'rre dev';
    
    // Add RRE dependencies if not present
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    if (!packageJson.dependencies['@react-responsive-easy/core']) {
      packageJson.dependencies['@react-responsive-easy/core'] = '^0.0.1';
    }
    
    await fs.writeJson(packagePath, packageJson, { spaces: 2 });
  } catch (error) {
    // Silently fail - package.json update is optional
    console.warn(chalk.yellow('Warning: Could not update package.json'));
  }
}

function generateSetupGuide(): string {
  return `# React Responsive Easy Setup Guide

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install @react-responsive-easy/core
   \`\`\`

2. **Wrap your app:**
   \`\`\`tsx
   import { ResponsiveProvider } from '@react-responsive-easy/core';
   import config from './rre.config';
   
   const App = () => (
     <ResponsiveProvider config={config}>
       <YourApp />
     </ResponsiveProvider>
   );
   \`\`\`

3. **Use responsive hooks:**
   \`\`\`tsx
   const Button = () => {
     const fontSize = useResponsiveValue(18, { token: 'fontSize' });
     return <button style={{ fontSize }}>Click me</button>;
   };
   \`\`\`

## 🛠️ CLI Commands

- \`rre build\` - Transform your code for production
- \`rre analyze\` - Check scaling and configuration
- \`rre dev\` - Development server with live preview

## 📚 Documentation

Visit: https://github.com/naaa-G/react-responsive-easy

## 🆘 Need Help?

- Check the configuration in \`rre.config.ts\`
- Run \`rre analyze\` to validate setup
- Review the example component in \`components/ExampleButton.tsx\`
`;
}
