import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { buildCommand } from './commands/build';
import { analyzeCommand } from './commands/analyze';
import { devCommand } from './commands/dev';
import { version } from '../package.json';

const program = new Command();

// CLI metadata
program
  .name('rre')
  .description('React Responsive Easy - Professional CLI tools for responsive development')
  .version(version, '-v, --version')
  .usage('<command> [options]');

// Add commands
program
  .addCommand(initCommand)
  .addCommand(buildCommand)
  .addCommand(analyzeCommand)
  .addCommand(devCommand);

// Global error handling
program.exitOverride();

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`\n❌ Error: Unknown command '${program.args.join(' ')}'`));
  console.log(chalk.yellow('\n💡 Available commands:'));
  console.log(chalk.cyan('  rre init     ') + 'Scaffold configuration and setup');
  console.log(chalk.cyan('  rre build    ') + 'Run build-time transformations');
  console.log(chalk.cyan('  rre analyze  ') + 'Report scaling insights and warnings');
  console.log(chalk.cyan('  rre dev      ') + 'Development server with live preview');
  console.log(chalk.cyan('  rre --help   ') + 'Show all options');
  process.exit(1);
});

// Parse arguments
try {
  program.parse();
} catch (error) {
  if (error instanceof Error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  } else {
    console.error(chalk.red('\n❌ An unexpected error occurred'));
  }
  process.exit(1);
}
