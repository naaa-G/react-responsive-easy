#!/usr/bin/env node

/**
 * Enterprise-grade build script for performance dashboard
 * Provides clean, production-ready builds with proper error handling
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// ANSI color codes for clean output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    log(`\n${colors.blue}Executing: ${command}${colors.reset}`);
    const result = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    log(`\n${colors.red}Error executing command: ${command}${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function getBuildMetadata() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return {
    name: packageJson.name,
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize(dirPath, label) {
  if (!fs.existsSync(dirPath)) return null;
  
  let totalSize = 0;
  let fileCount = 0;
  const files = [];
  
  function analyzeDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        analyzeDir(itemPath);
      } else {
        const size = stat.size;
        totalSize += size;
        fileCount++;
        files.push({
          name: path.relative(dirPath, itemPath),
          size: size,
          sizeFormatted: formatBytes(size)
        });
      }
    }
  }
  
  analyzeDir(dirPath);
  
  return {
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    fileCount,
    files: files.sort((a, b) => b.size - a.size)
  };
}

function main() {
  const startTime = Date.now();
  const metadata = getBuildMetadata();
  
  log(`${colors.bright}${colors.green}🚀 Starting Enterprise Build Process${colors.reset}`);
  log(`${colors.blue}📦 Package: ${metadata.name}@${metadata.version}${colors.reset}`);
  log(`${colors.blue}🕒 Started: ${metadata.timestamp}${colors.reset}`);
  log(`${colors.blue}🖥️  Environment: ${metadata.platform} ${metadata.arch} (Node ${metadata.nodeVersion})${colors.reset}`);
  
  // Step 1: Clean previous builds
  log(`\n${colors.yellow}📁 Cleaning previous builds...${colors.reset}`);
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('dashboard-dist')) {
    fs.rmSync('dashboard-dist', { recursive: true, force: true });
  }
  
  // Step 2: Build main package
  const rollupStart = Date.now();
  log(`\n${colors.yellow}📦 Building main package...${colors.reset}`);
  execCommand('rollup -c', { stdio: 'inherit' });
  const rollupTime = Date.now() - rollupStart;
  log(`${colors.green}✅ Main package built in ${rollupTime}ms${colors.reset}`);
  
  // Step 2.5: Generate TypeScript declarations
  const tscStart = Date.now();
  log(`\n${colors.yellow}📝 Generating TypeScript declarations...${colors.reset}`);
  execCommand('npx tsc --noEmit false --declaration --declarationMap --outDir dist', { stdio: 'inherit' });
  const tscTime = Date.now() - tscStart;
  log(`${colors.green}✅ TypeScript declarations generated in ${tscTime}ms${colors.reset}`);
  
  // Step 3: Build dashboard
  const viteStart = Date.now();
  log(`\n${colors.yellow}🎨 Building dashboard...${colors.reset}`);
  execCommand('vite build --config vite.config.ts --logLevel error', { stdio: 'inherit' });
  const viteTime = Date.now() - viteStart;
  log(`${colors.green}✅ Dashboard built in ${viteTime}ms${colors.reset}`);
  
  // Step 4: Verify builds and analyze
  log(`\n${colors.yellow}✅ Verifying builds...${colors.reset}`);
  
  const distExists = fs.existsSync('dist');
  const dashboardDistExists = fs.existsSync('dashboard-dist');
  
  if (distExists && dashboardDistExists) {
    const totalTime = Date.now() - startTime;
    
    // Analyze bundle sizes
    const mainAnalysis = analyzeBundleSize('dist', 'Main Package');
    const dashboardAnalysis = analyzeBundleSize('dashboard-dist', 'Dashboard');
    
    log(`\n${colors.green}🎉 Build completed successfully!${colors.reset}`);
    log(`${colors.green}⏱️  Total build time: ${totalTime}ms${colors.reset}`);
    log(`${colors.green}📊 Build breakdown:${colors.reset}`);
    log(`${colors.green}   • Main package: ${rollupTime}ms${colors.reset}`);
    log(`${colors.green}   • Dashboard: ${viteTime}ms${colors.reset}`);
    
    if (mainAnalysis) {
      log(`\n${colors.green}📁 Main package (dist/):${colors.reset}`);
      log(`${colors.green}   • Total size: ${mainAnalysis.totalSizeFormatted}${colors.reset}`);
      log(`${colors.green}   • Files: ${mainAnalysis.fileCount}${colors.reset}`);
    }
    
    if (dashboardAnalysis) {
      log(`\n${colors.green}🎨 Dashboard (dashboard-dist/):${colors.reset}`);
      log(`${colors.green}   • Total size: ${dashboardAnalysis.totalSizeFormatted}${colors.reset}`);
      log(`${colors.green}   • Files: ${dashboardAnalysis.fileCount}${colors.reset}`);
      
      // Show largest files
      if (dashboardAnalysis.files.length > 0) {
        log(`${colors.green}   • Largest files:${colors.reset}`);
        dashboardAnalysis.files.slice(0, 3).forEach(file => {
          log(`${colors.green}     - ${file.name}: ${file.sizeFormatted}${colors.reset}`);
        });
      }
    }
    
    // Write build metadata
    const buildInfo = {
      ...metadata,
      buildTime: totalTime,
      rollupTime,
      viteTime,
      mainPackage: mainAnalysis,
      dashboard: dashboardAnalysis,
      success: true
    };
    
    fs.writeFileSync('build-info.json', JSON.stringify(buildInfo, null, 2));
    log(`\n${colors.blue}📋 Build metadata saved to build-info.json${colors.reset}`);
    
  } else {
    log(`\n${colors.red}❌ Build verification failed${colors.reset}`);
    log(`${colors.red}   • Main package exists: ${distExists}${colors.reset}`);
    log(`${colors.red}   • Dashboard exists: ${dashboardDistExists}${colors.reset}`);
    process.exit(1);
  }
  
  log(`\n${colors.bright}${colors.green}✨ Enterprise build process completed!${colors.reset}`);
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log(`\n${colors.red}❌ Uncaught Exception: ${error.message}${colors.reset}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`\n${colors.red}❌ Unhandled Rejection at: ${promise}, reason: ${reason}${colors.reset}`);
  process.exit(1);
});

main();
