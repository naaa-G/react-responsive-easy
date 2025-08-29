// Main entry point for React Responsive Easy CLI

export { initCommand } from './commands/init';
export { buildCommand } from './commands/build';
export { analyzeCommand } from './commands/analyze';
export { devCommand } from './commands/dev';

// CLI version and information
export const CLI_VERSION = '0.0.1';
export const CLI_NAME = '@react-responsive-easy/cli';

// Re-export types for convenience
export type { Command } from 'commander';
