#!/usr/bin/env node

/**
 * Local Error Collection Script
 * 
 * This script runs the error collection system locally for testing
 * before pushing to GitHub Actions.
 */

const ErrorCollector = require('../tools/error-collector');
const path = require('path');

async function main() {
  console.log('🔍 Starting local error collection...\n');
  
  const collector = new ErrorCollector();
  
  try {
    const report = await collector.run();
    
    console.log('\n✅ Error collection completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Total errors: ${report.summary.totalErrors}`);
    console.log(`   - Total warnings: ${report.summary.totalWarnings}`);
    console.log(`   - Packages checked: ${report.summary.packagesChecked}`);
    console.log(`   - Packages with errors: ${report.summary.packagesWithErrors}`);
    console.log(`   - Duration: ${Math.round(report.summary.duration / 1000)}s`);
    
    console.log(`\n📁 Reports generated:`);
    console.log(`   - JSON: ${path.resolve('error-report.json')}`);
    console.log(`   - Markdown: ${path.resolve('error-summary.md')}`);
    
    if (report.summary.totalErrors > 0) {
      console.log(`\n⚠️  Found ${report.summary.totalErrors} errors that need attention.`);
      console.log(`   Review the reports above for detailed information.`);
    } else {
      console.log(`\n🎉 No errors found! Your project is in good shape.`);
    }
    
  } catch (error) {
    console.error('❌ Error collection failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = main;
