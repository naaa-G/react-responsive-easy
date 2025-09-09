# Error Collection System

This directory contains tools for comprehensive error collection and reporting in the React Responsive Easy project.

## Overview

The error collection system is designed to run all tests and builds without crashing, collecting all errors and generating detailed reports. This allows you to fix all issues at once rather than one error at a time.

## Files

- `error-collector.js` - Main error collection script
- `README.md` - This documentation

## Usage

### Local Testing

```bash
# Run error collection locally
pnpm collect-errors

# Or run the collector directly
node tools/error-collector.js
```

### GitHub Actions

The error collection system is integrated into GitHub Actions via `.github/workflows/error-collection.yml`. This workflow:

1. Runs error collection on multiple Node.js versions (18, 20, 22)
2. Generates detailed reports for each version
3. Consolidates all reports into a single summary
4. Uploads all reports as artifacts
5. Comments on PRs with the error summary

## Output Files

The error collection system generates several output files:

### `error-report.json`
Detailed JSON report containing:
- Summary statistics
- Environment information
- Root-level check results
- Package-level results
- E2E test results
- All errors and warnings with full details

### `error-summary.md`
Human-readable markdown summary containing:
- Quick overview table
- Error details by category
- Recommendations for fixing issues

### `consolidated-error-report.md` (GitHub Actions only)
Combined report from all Node.js versions with:
- Cross-version comparison
- Common error patterns
- Version-specific issues

## Features

### Comprehensive Coverage
- Root-level checks (install, build, test, lint, type-check)
- Package-level checks for each workspace package
- E2E tests (Playwright)
- Environment detection and reporting

### Error Classification
- **Errors**: Critical issues that prevent success
- **Warnings**: Non-critical issues that should be addressed
- **Success**: Operations that completed successfully

### Detailed Reporting
- Full command output (stdout/stderr)
- Exit codes
- Execution timing
- Environment information
- Package-specific results

### GitHub Actions Integration
- Multi-version testing (Node.js 18, 20, 22)
- Artifact uploads for detailed analysis
- PR comments with error summaries
- Never-failing workflow (collects all errors)

## Workflow

1. **Discovery**: Automatically discovers all packages in the workspace
2. **Root Checks**: Runs root-level commands (install, build, test, lint, type-check)
3. **Package Checks**: Runs package-specific commands for each discovered package
4. **E2E Tests**: Runs Playwright tests
5. **Report Generation**: Creates detailed JSON and markdown reports
6. **Consolidation**: (GitHub Actions) Combines reports from all Node.js versions

## Error Categories

### Root Level
- `install` - Dependency installation
- `build` - Project building
- `test` - Test execution
- `lint` - Code linting
- `typeCheck` - TypeScript type checking

### Package Level
- `tests` - Package-specific tests
- `build` - Package-specific builds
- `lint` - Package-specific linting
- `typeCheck` - Package-specific type checking

### E2E Level
- `playwright` - Playwright test execution
- `devServer` - Development server startup

## Recommendations

When using the error collection system:

1. **Review all reports** before starting fixes
2. **Focus on common errors** across all versions first
3. **Fix version-specific issues** after addressing common problems
4. **Test incrementally** - fix one package at a time
5. **Use the detailed JSON reports** for programmatic analysis
6. **Re-run collection** after fixes to verify improvements

## Integration

The error collection system integrates with:

- **pnpm workspaces** - Automatically discovers packages
- **GitHub Actions** - Comprehensive CI/CD integration
- **Playwright** - E2E test execution
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Vitest** - Test execution

## Benefits

- **No more one-by-one fixes** - See all errors at once
- **Comprehensive coverage** - Tests everything systematically
- **Detailed reporting** - Full context for each error
- **CI/CD integration** - Automated error collection
- **Multi-version testing** - Catches version-specific issues
- **Never fails** - Always collects all errors

## Troubleshooting

### Common Issues

1. **Permission errors**: Ensure scripts are executable (`chmod +x`)
2. **Timeout errors**: Increase timeout values for slow operations
3. **Missing dependencies**: Run `pnpm install` before error collection
4. **Path issues**: Ensure you're running from the project root

### Debug Mode

For debugging, you can modify the error collector to add more verbose logging or adjust timeout values.

## Future Enhancements

Potential improvements to the error collection system:

- **Parallel execution** - Run package checks in parallel
- **Caching** - Cache results to speed up repeated runs
- **Error categorization** - Automatically categorize errors by type
- **Fix suggestions** - Provide automated fix suggestions
- **Trend analysis** - Track error trends over time
- **Integration with issue tracking** - Automatically create GitHub issues
