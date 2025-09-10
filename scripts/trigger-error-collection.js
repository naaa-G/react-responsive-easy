#!/usr/bin/env node

/**
 * Trigger Error Collection Workflow
 * 
 * This script helps trigger the error collection workflow manually
 * and provides information about the current status.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Error Collection Workflow Trigger');
console.log('=====================================\n');

// Check if we're in a git repository
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Not in a git repository. Please run this from the project root.');
  process.exit(1);
}

// Check if we have a remote origin
try {
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  console.log(`📡 Repository: ${remoteUrl}`);
} catch (error) {
  console.error('❌ No remote origin found. Please ensure you have a GitHub remote configured.');
  process.exit(1);
}

// Check current branch
try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`🌿 Current branch: ${currentBranch}`);
} catch (error) {
  console.error('❌ Could not determine current branch.');
  process.exit(1);
}

// Check if there are uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  Warning: You have uncommitted changes.');
    console.log('   Consider committing your changes before triggering the workflow.\n');
  } else {
    console.log('✅ Working directory is clean.\n');
  }
} catch (error) {
  console.error('❌ Could not check git status.');
  process.exit(1);
}

// Check if error collection workflow exists
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'error-collection.yml');
if (!fs.existsSync(workflowPath)) {
  console.error('❌ Error collection workflow not found at .github/workflows/error-collection.yml');
  process.exit(1);
}

console.log('📋 Available Actions:');
console.log('');
console.log('1. 🔄 Trigger Error Collection Workflow');
console.log('2. 📊 Check Current Error Status');
console.log('3. 🌐 Open GitHub Actions in Browser');
console.log('4. 📁 View Local Error Reports');
console.log('5. ❌ Exit');
console.log('');

// Simple interactive menu
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Select an option (1-5): ', (answer) => {
  switch (answer.trim()) {
    case '1':
      console.log('\n🔄 Triggering Error Collection Workflow...');
      try {
        // Check if gh CLI is available
        execSync('gh --version', { stdio: 'pipe' });
        
        // Trigger the workflow
        execSync('gh workflow run error-collection.yml', { stdio: 'inherit' });
        console.log('\n✅ Error Collection Workflow triggered successfully!');
        console.log('🔗 View progress: https://github.com/naaa-G/react-responsive-easy/actions/workflows/error-collection.yml');
      } catch (error) {
        console.log('\n❌ Failed to trigger workflow. You may need to:');
        console.log('   1. Install GitHub CLI: https://cli.github.com/');
        console.log('   2. Authenticate: gh auth login');
        console.log('   3. Or manually trigger from GitHub Actions page');
        console.log('\n🔗 Manual trigger: https://github.com/naaa-G/react-responsive-easy/actions/workflows/error-collection.yml');
      }
      break;
      
    case '2':
      console.log('\n📊 Checking Current Error Status...');
      try {
        // Run local error collection
        console.log('Running local error collection...');
        execSync('node tools/error-collector.js --skip-e2e', { stdio: 'inherit' });
        
        // Check if reports exist
        const reportPath = path.join(process.cwd(), 'error-report.json');
        const summaryPath = path.join(process.cwd(), 'error-summary.md');
        
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          console.log('\n📈 Error Summary:');
          console.log(`   Total Errors: ${report.summary.totalErrors}`);
          console.log(`   Total Warnings: ${report.summary.totalWarnings}`);
          console.log(`   Packages with Errors: ${report.summary.packagesWithErrors}`);
          console.log(`   Duration: ${report.summary.duration}s`);
        }
        
        if (fs.existsSync(summaryPath)) {
          console.log('\n📄 Detailed report available at: error-summary.md');
        }
      } catch (error) {
        console.log('\n❌ Error collection failed:', error.message);
      }
      break;
      
    case '3':
      console.log('\n🌐 Opening GitHub Actions in browser...');
      try {
        execSync('gh browse --repo naaa-G/react-responsive-easy actions', { stdio: 'inherit' });
      } catch (error) {
        console.log('❌ Could not open browser. Please visit manually:');
        console.log('🔗 https://github.com/naaa-G/react-responsive-easy/actions');
      }
      break;
      
    case '4':
      console.log('\n📁 Local Error Reports:');
      const errorsDir = path.join(process.cwd(), 'errors');
      if (fs.existsSync(errorsDir)) {
        const files = fs.readdirSync(errorsDir);
        if (files.length > 0) {
          files.forEach(file => {
            const filePath = path.join(errorsDir, file);
            const stats = fs.statSync(filePath);
            console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
          });
        } else {
          console.log('   No error reports found.');
        }
      } else {
        console.log('   No errors directory found.');
      }
      break;
      
    case '5':
      console.log('\n👋 Goodbye!');
      break;
      
    default:
      console.log('\n❌ Invalid option. Please select 1-5.');
  }
  
  rl.close();
});
