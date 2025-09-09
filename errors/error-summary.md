# Error Collection Report

**Generated:** 2025-09-09T00:26:10.167Z
**Duration:** 238s
**Total Errors:** 54
**Total Warnings:** 0

## Root Level Checks

| Check | Status |
|-------|--------|
| Install | ✅ |
| Build | ❌ |
| Test | ❌ |
| Lint | ❌ |
| Type Check | ✅ |

## Package Results

| Package | Tests | Build | Lint | Type Check |
|---------|-------|-------|------|------------|
| ai-optimizer | ✅ | ❌ | ❌ | ✅ |
| babel-plugin | ❌ | ✅ | ❌ | ✅ |
| browser-extension | ✅ | ✅ | ❌ | ✅ |
| cli | ❌ | ❌ | ❌ | ❌ |
| core | ✅ | ✅ | ❌ | ✅ |
| figma-plugin | ❌ | ✅ | ❌ | ✅ |
| next-plugin | ❌ | ❌ | ❌ | ❌ |
| performance-dashboard | ✅ | ❌ | ❌ | ✅ |
| postcss-plugin | ✅ | ✅ | ❌ | ✅ |
| storybook-addon | ❌ | ❌ | ❌ | ❌ |
| vite-plugin | ❌ | ❌ | ❌ | ❌ |

## Error Details

### Root Level: build

**Command:** `pnpm build`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy@1.0.0 build /home/runner/work/react-responsive-easy/react-responsive-easy
> pnpm -r build

Scope: 14 of 15 workspace projects
packages/core build$ rollup -c
packages/core build: [36m
packages/core build: [1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
packages/core build: [1m[33m(!) [plugin typescript] @rollup/plugin-typescript TS6304: Composite projects may not disable declaration emit.[39m[22m
packages/core build: [1m[33m(!) [plugin typescript] @rollup/plugin-typescript: outputToFilesystem option is defaulting to true.[39m[22m
packages/core build: [32mcreated [1mdist/index.js, dist/index.esm.js[22m in [1m2.3s[22m[39m
packages/core build: [36m
packages/core build: [1msrc/index.ts[22m → [1mdist/index.d.ts[22m...[39m
packages/core build: [32mcreated [1mdist/index.d.ts[22m in [1m536ms[22m[39m
packages/core build: Done
apps/test-app build$ vite build
packages/ai-optimizer build$ rollup -c
packages/babel-plugin build$ rollup -c
packages/browser-extension build$ webpack --mode=production
apps/test-app build: [36mvite v4.5.14 [32mbuilding for production...[36m[39m
apps/test-app build: transforming...
packages/babel-plugin build: [36m
packages/babel-plugin build: [1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
packages/ai-optimizer build: [36m
packages/ai-optimizer build: [1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
apps/test-app build: [32m✓[39m 32 modules transformed.
apps/test-app build: rendering chunks...
apps/test-app build: computing gzip size...
apps/test-app build: [2mdist/[22m[32mindex.html                 [39m[1m[2m  0.47 kB[22m[1m[22m[2m │ gzip:  0.31 kB[22m
apps/test-app build: [2mdist/[22m[2massets/[22m[35mindex-64a40ff4.css  [39m[1m[2m  0.27 kB[22m[1m[22m[2m │ gzip:  0.22 kB[22m
apps/test-app build: [2mdist/[22m[2massets/[22m[36mindex-1645fa0e.js   [39m[1m[2m157.38 kB[22m[1m[22m[2m │ gzip: 50.65 kB[22m
apps/test-app build: [32m✓ built in 2.52s[39m
apps/test-app build: Done
packages/figma-plugin build$ webpack --mode production
packages/babel-plugin build: [1m[33m(!) Mixing named and default exports[39m[22m
packages/babel-plugin build: [90mhttps://rollupjs.org/configuration-options/#output-exports[39m
packages/babel-plugin build: [1mThe following entry modules are using named and default exports together:[22m
packages/babel-plugin build: src/index.ts
packages/babel-plugin build: Consumers of your bundle will have to use chunk.default to access their default export, which may not be what you want. Use `output.exports: "named"` to disable this warning.
packages/babel-plugin build: [32mcreated [1mdist/index.js, dist/index.esm.js[22m in [1m8s[22m[39m
packages/babel-plugin build: [36m
packages/babel-plugin build: [1msrc/index.ts[22m → [1mdist/index.d.ts[22m...[39m
packages/figma-plugin build: asset [1m[32mui.js[39m[22m 9.71 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: ui)
packages/figma-plugin build: asset [1m[32mui.html[39m[22m 9.08 KiB [1m[32m[emitted][39m[22m
packages/figma-plugin build: asset [1m[32mcode.js[39m[22m 8.8 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: code)
packages/figma-plugin build: [1m./src/code.ts[39m[22m 19.1 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/figma-plugin build: [1m./src/ui.ts[39m[22m 19.4 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/figma-plugin build: webpack 5.101.3 compiled [1m[32msuccessfully[39m[22m in 5147 ms
packages/figma-plugin build: Done
packages/postcss-plugin build$ rollup -c
packages/postcss-plugin build: [36m
packages/postcss-plugin build: [1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
packages/browser-extension build: assets by path [1m[32m*.js[39m[22m 51.6 KiB
packages/browser-extension build:   asset [1m[32minjected-script.js[39m[22m 18.4 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: injected-script)
packages/browser-extension build:   asset [1m[32mdevtools-panel.js[39m[22m 10.9 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: devtools-panel)
packages/browser-extension build:   asset [1m[32mpopup.js[39m[22m 9.25 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: popup)
packages/browser-extension build:   asset [1m[32mbackground.js[39m[22m 7.33 KiB [1m[32m[emitted][39m[22m [1m[32m[minimized][39m[22m (name: background)
packages/browser-extension build:   + 2 assets
packages/browser-extension build: assets by path [1m[32m*.html[39m[22m 5.67 KiB
packages/browser-extension build:   asset [1m[32mdevtools-panel.html[39m[22m 2.71 KiB [1m[32m[emitted][39m[22m
packages/browser-extension build:   asset [1m[32mpopup.html[39m[22m 2.68 KiB [1m[32m[emitted][39m[22m
packages/browser-extension build:   asset [1m[32mdevtools.html[39m[22m 282 bytes [1m[32m[emitted][39m[22m
packages/browser-extension build: assets by path [1m[32m*.css[39m[22m 15.4 KiB
packages/browser-extension build:   asset [1m[32moverlay-styles.css[39m[22m 8.44 KiB [1m[32m[emitted][39m[22m [from: src/styles/overlay-styles.css] [1m[32m[copied][39m[22m
packages/browser-extension build:   asset [1m[32mpopup.css[39m[22m 6.99 KiB [1m[32m[emitted][39m[22m [from: src/styles/popup.css] [1m[32m[copied][39m[22m
packages/browser-extension build: asset [1m[32mmanifest.json[39m[22m 1.18 KiB [1m[32m[emitted][39m[22m [from: manifest.json] [1m[32m[copied][39m[22m
packages/browser-extension build: asset [1m[32micons/icon-16.png[39m[22m 75 bytes [1m[32m[emitted][39m[22m [from: src/icons/icon-16.png] [1m[32m[copied][39m[22m
packages/browser-extension build: runtime modules 792 bytes 4 modules
packages/browser-extension build: orphan modules 22.3 KiB [1m[33m[orphan][39m[22m 1 module
packages/browser-extension build: cacheable modules 87.1 KiB
packages/browser-extension build:   modules by path [1m./src/devtools/*.ts[39m[22m 15.2 KiB
packages/browser-extension build:     [1m./src/devtools/devtools.ts[39m[22m 588 bytes [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build:     [1m./src/devtools/devtools-panel.ts[39m[22m 14.6 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build:   [1m./src/background/background.ts[39m[22m 13.4 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build:   [1m./src/content/content-script.ts[39m[22m 10.7 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build:   [1m./src/injected/injected-script.ts + 1 modules[39m[22m 33.3 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build:   [1m./src/popup/popup.ts[39m[22m 14.5 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
packages/browser-extension build: webpack 5.101.3 compiled [1m[32msuccessfully[39m[22m in 10399 ms
packages/browser-extension build: Done
packages/babel-plugin build: [32mcreated [1mdist/index.d.ts[22m in [1m2.9s[22m[39m
packages/babel-plugin build: Done
packages/ai-optimizer build: [1m[33m(!) [plugin typescript] @rollup/plugin-typescript: outputToFilesystem option is defaulting to true.[39m[22m
packages/ai-optimizer build: [32mcreated [1mdist/index.js, dist/index.esm.js[22m in [1m12s[22m[39m
packages/ai-optimizer build: [36m
packages/ai-optimizer build: [1mdist/index.d.ts[22m → [1mdist/index.d.ts[22m...[39m
packages/ai-optimizer build: [1m[31m[!] [1mRollupError: Could not resolve entry module "dist/index.d.ts".[22m[1m[39m[22m
packages/ai-optimizer build: [2m    at getRollupError (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:285:41)
packages/ai-optimizer build:     at Object.error (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:281:42)
packages/ai-optimizer build:     at ModuleLoader.loadEntryModule (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/rollup.js:22783:32)
packages/ai-optimizer build:     at async Promise.all (index 0)[22m
packages/ai-optimizer build: Failed
/home/runner/work/react-responsive-easy/react-responsive-easy/packages/ai-optimizer:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @yaseratiar/react-responsive-easy-ai-optimizer@2.0.0 build: `rollup -c`
Exit status 1
 ELIFECYCLE  Command failed with exit code 1.

```

### Root Level: test

**Command:** `pnpm test`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy@1.0.0 test /home/runner/work/react-responsive-easy/react-responsive-easy
> pnpm -r test

Scope: 14 of 15 workspace projects
packages/core test$ vitest
packages/core test: [7m[1m[36m RUN [39m[22m[27m [36mv1.6.1[39m [90m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/core[39m
packages/core test:  [32m✓[39m src/__tests__/ScalingEngine.test.ts [2m ([22m[2m8 tests[22m[2m)[22m[90m 9[2mms[22m[39m
packages/core test:  [32m✓[39m src/__tests__/ResponsiveProvider.test.tsx [2m ([22m[2m6 tests[22m[2m)[22m[90m 85[2mms[22m[39m
packages/core test:  [32m✓[39m src/__tests__/hooks.test.tsx [2m ([22m[2m18 tests[22m[2m)[22m[90m 75[2mms[22m[39m
packages/core test: [90mstderr[2m | src/__tests__/hooks.test.tsx[2m > [22m[2mReact Hooks[2m > [22m[2museResponsiveValue[2m > [22m[2mshould scale value for non-base breakpoints[22m[39m
packages/core test: Warning: Cannot update a component (`ResponsiveProvider`) while rendering a different component (`TestComponent`). To locate the bad setState() call inside `TestComponent`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
packages/core test:     at TestComponent (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@testing-library+react@16.3.0_@testing-library+dom@10.4.1_@types+react-dom@19.1.9_@type_179c02f13ce0032fce24a994ed15290a/node_modules/@testing-library/react/dist/pure.js:329:5)
packages/core test:     at ResponsiveProvider (/home/runner/work/react-responsive-easy/react-responsive-easy/packages/core/src/provider/ResponsiveContext.tsx:17:3)
packages/core test:     at /home/runner/work/react-responsive-easy/react-responsive-easy/packages/core/src/__tests__/hooks.test.tsx:14:13
packages/core test: [2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
packages/core test: [2m      Tests [22m [1m[32m32 passed[39m[22m[90m (32)[39m
packages/core test: [2m   Start at [22m 00:22:48
packages/core test: [2m   Duration [22m 1.43s[2m (transform 278ms, setup 263ms, collect 735ms, tests 169ms, environment 1.81s, prepare 369ms)[22m
packages/core test: Done
packages/ai-optimizer test$ vitest
packages/babel-plugin test$ vitest
packages/browser-extension test$ jest
packages/postcss-plugin test$ vitest
packages/ai-optimizer test: [7m[1m[36m RUN [39m[22m[27m [36mv1.6.1[39m [90m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/ai-optimizer[39m
packages/babel-plugin test: [7m[1m[36m RUN [39m[22m[27m [36mv1.6.1[39m [90m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin[39m
packages/postcss-plugin test: [7m[1m[36m RUN [39m[22m[27m [36mv1.6.1[39m [90m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/postcss-plugin[39m
packages/browser-extension test: ts-jest[config] (WARN) 
packages/browser-extension test:     The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/work/react-responsive-easy/react-responsive-easy/packages/browser-extension/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
packages/browser-extension test:   
packages/browser-extension test: 🔧 Setting up global test environment for React Responsive Easy Browser Extension
packages/babel-plugin test:  [32m✓[39m src/__tests__/hook-transformers.test.ts [2m ([22m[2m25 tests[22m[2m)[22m[90m 161[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould work correctly in GitHub Actions environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould handle GitHub Actions resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould provide consistent results in GitHub Actions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitLab CI Environment[2m > [22mshould work correctly in GitLab CI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitLab CI Environment[2m > [22mshould handle GitLab CI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mJenkins Environment[2m > [22mshould work correctly in Jenkins environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mJenkins Environment[2m > [22mshould handle Jenkins resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCircleCI Environment[2m > [22mshould work correctly in CircleCI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCircleCI Environment[2m > [22mshould handle CircleCI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mTravis CI Environment[2m > [22mshould work correctly in Travis CI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mTravis CI Environment[2m > [22mshould handle Travis CI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mAzure DevOps Environment[2m > [22mshould work correctly in Azure DevOps environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mAzure DevOps Environment[2m > [22mshould handle Azure DevOps resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mLocal Development Environment[2m > [22mshould work correctly in local development environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mLocal Development Environment[2m > [22mshould handle local development resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mProduction Environment[2m > [22mshould work correctly in production environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mProduction Environment[2m > [22mshould handle production resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould meet CI/CD performance requirements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould provide consistent performance across environments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould generate comprehensive performance report
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Error Handling[2m > [22mshould handle errors gracefully in CI/CD environments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Error Handling[2m > [22mshould provide meaningful error messages in CI/CD
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Test Aggregation[2m > [22mshould aggregate test results correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Test Aggregation[2m > [22mshould track performance metrics across CI/CD runs
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Configuration Tests[2m > [22mshould work with different CI/CD configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Configuration Tests[2m > [22mshould handle CI/CD environment-specific configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Integration Validation[2m > [22mshould validate CI/CD integration requirements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/ci-cd-tests.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Integration Validation[2m > [22mshould provide CI/CD-compatible output
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a complete component stylesheet
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a grid layout system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a typography system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with multiple nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with pseudo-selectors and pseudo-elements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with complex calc() expressions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould handle large CSS files efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould maintain performance with complex CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould handle multiple transformations efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mConfiguration Integration[2m > [22mshould work with different configuration combinations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mConfiguration Integration[2m > [22mshould handle custom property prefix correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mError Recovery Integration[2m > [22mshould recover from malformed CSS gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mError Recovery Integration[2m > [22mshould handle CSS with syntax errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for basic transformation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for complex CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for performance
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Scenarios[2m > [22mshould process a complete design system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/integration-tests.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Scenarios[2m > [22mshould process a component library stylesheet
packages/babel-plugin test:  [32m✓[39m src/__tests__/fixtures.test.ts [2m ([22m[2m8 tests[22m[2m)[22m[33m 1897[2mms[22m[39m
packages/browser-extension test: ts-jest[config] (WARN) 
packages/browser-extension test:     The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/work/react-responsive-easy/react-responsive-easy/packages/browser-extension/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
packages/browser-extension test:   
packages/babel-plugin test:  [32m✓[39m src/__tests__/scaling-engine.test.ts [2m ([22m[2m31 tests[22m[2m)[22m[90m 119[2mms[22m[39m
packages/browser-extension test: ts-jest[config] (WARN) 
packages/browser-extension test:     The "ts-jest" config option "isolatedModules" is deprecated and will be removed in v30.0.0. Please use "isolatedModules: true" in /home/runner/work/react-responsive-easy/react-responsive-easy/packages/browser-extension/tsconfig.json instead, see https://www.typescriptlang.org/tsconfig/#isolatedModules
packages/browser-extension test:   
packages/ai-optimizer test:  [32m✓[39m src/__tests__/integration/AIOptimizerIntegration.test.ts [2m ([22m[2m22 tests[22m[2m)[22m[33m 1762[2mms[22m[39m
packages/browser-extension test: PASS src/__tests__/background/background.test.ts
packages/browser-extension test: PASS src/__tests__/content/content-script.test.ts
packages/browser-extension test: PASS src/__tests__/integration/extension-integration.test.ts
packages/browser-extension test: PASS src/__tests__/popup/popup.test.ts
packages/babel-plugin test:  [33m❯[39m src/__tests__/transformation.test.ts [2m ([22m[2m37 tests[22m [2m|[22m [31m2 failed[39m[2m)[22m[33m 2246[2mms[22m[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled[39m
packages/babel-plugin test: [31m     → expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museScaledStyle transformations[2m > [22mshould not transform when precompute is disabled[39m
packages/babel-plugin test: [31m     → expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/AIOptimizer.test.ts [2m ([22m[2m27 tests[22m[2m)[22m[33m 655[2mms[22m[39m
packages/browser-extension test: PASS src/__tests__/core/ResponsiveDebugger.test.ts
packages/browser-extension test: Test Suites: 5 passed, 5 total
packages/browser-extension test: Tests:       152 passed, 152 total
packages/browser-extension test: Snapshots:   0 total
packages/browser-extension test: Time:        8.699 s
packages/browser-extension test: Ran all test suites.
packages/browser-extension test: 🧹 Cleaning up global test environment for React Responsive Easy Browser Extension
packages/browser-extension test: Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
packages/browser-extension test: Done
packages/babel-plugin test:  [33m❯[39m src/__tests__/ci-cd.test.ts [2m ([22m[2m23 tests[22m [2m|[22m [31m1 failed[39m[2m)[22m[33m 8536[2mms[22m[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/ci-cd.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mKubernetes environment[2m > [22mshould handle Kubernetes resource limits[39m
packages/babel-plugin test: [31m     → expected 586.5001850000117 to be less than 300[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/performance/PerformanceTests.test.ts [2m ([22m[2m19 tests[22m[2m)[22m[33m 7235[2mms[22m[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/ModelTrainer.test.ts [2m ([22m[2m30 tests[22m[2m)[22m[33m 616[2mms[22m[39m
packages/babel-plugin test:  [32m✓[39m src/__tests__/integration.test.ts [2m ([22m[2m16 tests[22m[2m)[22m[33m 1846[2mms[22m[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/FeatureExtractor.test.ts [2m ([22m[2m24 tests[22m[2m)[22m[90m 33[2mms[22m[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/PredictionEngine.test.ts [2m ([22m[2m15 tests[22m[2m)[22m[90m 68[2mms[22m[39m
packages/babel-plugin test:  [33m❯[39m src/__tests__/snapshots.test.ts [2m ([22m[2m23 tests[22m [2m|[22m [31m1 failed[39m[2m)[22m[33m 1321[2mms[22m[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/snapshots.test.ts[2m > [22mSnapshot Tests[2m > [22mconfiguration options[2m > [22mshould generate consistent output with precompute disabled[39m
packages/babel-plugin test: [31m     → Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched[39m
packages/babel-plugin test:  [33m❯[39m src/__tests__/performance.test.ts [2m ([22m[2m17 tests[22m [2m|[22m [31m2 failed[39m[2m)[22m[33m 3419[2mms[22m[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/performance.test.ts[2m > [22mPerformance Tests[2m > [22mTransformation speed[2m > [22mshould transform useScaledStyle calls efficiently[39m
packages/babel-plugin test: [31m     → expected 44.52642700000433 to be less than 30[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/performance.test.ts[2m > [22mPerformance Tests[2m > [22mMemory usage[2m > [22mshould handle large input files efficiently[39m
packages/babel-plugin test: [31m     → expected 196.90368400001898 to be less than 100[39m
packages/babel-plugin test:  [32m✓[39m src/__tests__/cache-manager.test.ts [2m ([22m[2m21 tests[22m[2m)[22m[90m 65[2mms[22m[39m
packages/babel-plugin test:  [32m✓[39m src/__tests__/config-loader.test.ts [2m ([22m[2m19 tests[22m[2m)[22m[90m 53[2mms[22m[39m
packages/babel-plugin test:  [33m❯[39m src/__tests__/babel-plugin.test.ts [2m ([22m[2m15 tests[22m [2m|[22m [31m1 failed[39m[2m)[22m[33m 613[2mms[22m[39m
packages/babel-plugin test: [31m   [33m❯[31m src/__tests__/babel-plugin.test.ts[2m > [22m@react-responsive-easy/babel-plugin[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled[39m
packages/babel-plugin test: [31m     → expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'[39m
packages/ai-optimizer test:  [32m✓[39m src/__tests__/error-handling/ErrorHandlingTests.test.ts [2m ([22m[2m42 tests[22m[2m)[22m[33m 14224[2mms[22m[39m
packages/ai-optimizer test: [2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
packages/ai-optimizer test: [2m      Tests [22m [1m[32m179 passed[39m[22m[90m (179)[39m
packages/ai-optimizer test: [2m   Start at [22m 00:22:50
packages/ai-optimizer test: [2m   Duration [22m 18.32s[2m (transform 1.86s, setup 705ms, collect 4.38s, tests 24.59s, environment 10.88s, prepare 2.17s)[22m
packages/ai-optimizer test: Done
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle 1000 simple transformations efficiently[33m 488[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle 500 complex transformations efficiently[33m 4554[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle very large CSS files[33m 4973[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle mixed content efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould not leak memory with repeated processing[33m 829[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould not leak memory with large CSS processing[33m 1307[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould clean up memory after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould handle memory pressure gracefully[33m 3908[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle concurrent processing efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle mixed concurrent processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle high concurrency without errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle many malformed CSS gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle CSS with many syntax errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle CSS with mixed valid and invalid content
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould maintain performance with repeated processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould maintain performance with increasing CSS size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould handle performance under memory pressure[33m 321[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many calc() expressions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very deep nesting
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very long property names
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very long values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mStress Test Results[2m > [22mshould provide comprehensive stress test metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/stress-tests.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mStress Test Results[2m > [22mshould maintain quality under stress
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle empty rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with invalid parameters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with too many parameters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with invalid token names gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with special characters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle unmatched braces gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle unmatched parentheses gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle invalid CSS properties gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle CSS with syntax errors gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only whitespace
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only at-rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle mixed valid and invalid rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle CSS with nested errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle CSS with pseudo-selector errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle invalid configuration options gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle missing configuration gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle extreme configuration values gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle very large CSS files gracefully[33m 835[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very long property names gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very long values gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very deep nesting gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould recover from errors and continue processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould maintain CSS structure despite errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould preserve original CSS when errors occur
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould validate CSS syntax after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould validate custom properties after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould handle validation errors gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mPerformance Under Error Conditions[2m > [22mshould maintain performance with many errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mPerformance Under Error Conditions[2m > [22mshould handle error recovery efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Reporting[2m > [22mshould provide meaningful error information
packages/postcss-plugin test:  [32m✓[39m src/__tests__/error-handling-tests.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Reporting[2m > [22mshould handle error reporting gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould transform simple rre() function calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() with token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() with numeric token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle multiple rre() calls in one declaration
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() in calc() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould preserve non-rre() values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate :root rule with custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate responsive variants in media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould not generate custom properties when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould use custom property prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22m@custom-media Rules Generation[2m > [22mshould generate @custom-media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22m@custom-media Rules Generation[2m > [22mshould not generate @custom-media when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mDevelopment Mode[2m > [22mshould add comments in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mDevelopment Mode[2m > [22mshould not add comments in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle malformed rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle CSS without rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mConfiguration Options[2m > [22mshould use default options when none provided
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mConfiguration Options[2m > [22mshould respect all configuration options
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mValue Scaling and Calculations[2m > [22mshould scale values correctly for different breakpoints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mValue Scaling and Calculations[2m > [22mshould apply token-specific scaling
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Validation[2m > [22mshould generate valid CSS syntax
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Validation[2m > [22mshould handle complex CSS structures
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mPerformance Characteristics[2m > [22mshould process small CSS quickly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mPerformance Characteristics[2m > [22mshould handle moderate CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould count rre() functions correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract custom properties correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract media queries correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract rre() functions correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mTest Case Management[2m > [22mshould create and run test cases correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mTest Case Management[2m > [22mshould handle failing test cases
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with existing custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with existing media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/unit-tests.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process small CSS quickly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process medium CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process large CSS within acceptable time
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould handle complex CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark simple transformations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark multiple transformations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark complex CSS processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark large CSS processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould not leak memory with repeated processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould handle memory efficiently with large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould clean up memory after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom properties enabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom properties disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom media enabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom media disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould scale linearly with CSS size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould handle concurrent processing efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould handle very large CSS files[33m 545[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould provide accurate performance metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould meet performance thresholds
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould provide consistent performance metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould optimize CSS output size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould minimize custom property generation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould optimize media query generation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle rapid successive processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle mixed CSS content efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle edge case CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with simple CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with medium CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/performance-tests.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Comparison Tests[2m > [22mshould compare performance between configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for simple rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for rre() with tokens
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for multiple rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for rre() in calc()
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent custom properties with custom prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent responsive variants
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mMedia Query Generation[2m > [22mshould generate consistent media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mMedia Query Generation[2m > [22mshould generate consistent custom media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output with custom properties disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output with custom media disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for existing media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for existing custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for malformed rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for mixed valid and invalid CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for CSS with comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for CSS without rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for component stylesheet
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for grid system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for typography system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for design system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mConfiguration Variations[2m > [22mshould generate consistent output with different prefixes
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mConfiguration Variations[2m > [22mshould generate consistent output with different configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output across versions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output for complex scenarios
packages/postcss-plugin test:  [32m✓[39m src/__tests__/snapshot-tests.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output for large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould transform rre() function calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould handle rre() with token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould generate responsive media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould not transform when generateCustomProperties is false
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mCSS custom properties generation[2m > [22mshould generate :root rule with custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mCSS custom properties generation[2m > [22mshould generate responsive variants in media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22m@custom-media rules generation[2m > [22mshould generate @custom-media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22m@custom-media rules generation[2m > [22mshould not generate @custom-media when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mdevelopment mode[2m > [22mshould add comments in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mdevelopment mode[2m > [22mshould not add comments in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould handle multiple rre() calls in one declaration
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould handle rre() in calc() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould preserve non-rre() values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22merror handling[2m > [22mshould handle malformed rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22merror handling[2m > [22mshould handle empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mconfiguration[2m > [22mshould use default options when none provided
packages/postcss-plugin test:  [32m✓[39m src/__tests__/postcss-plugin.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mconfiguration[2m > [22mshould respect custom prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould transform rre() function calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould handle rre() with token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould generate responsive media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mrre() function processing[2m > [22mshould not transform when generateCustomProperties is false
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mCSS custom properties generation[2m > [22mshould generate :root rule with custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mCSS custom properties generation[2m > [22mshould generate responsive variants in media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22m@custom-media rules generation[2m > [22mshould generate @custom-media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22m@custom-media rules generation[2m > [22mshould not generate @custom-media when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mdevelopment mode[2m > [22mshould add comments in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mdevelopment mode[2m > [22mshould not add comments in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould handle multiple rre() calls in one declaration
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould handle rre() in calc() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mcomplex CSS handling[2m > [22mshould preserve non-rre() values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22merror handling[2m > [22mshould handle malformed rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22merror handling[2m > [22mshould handle empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mconfiguration[2m > [22mshould use default options when none provided
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22m@react-responsive-easy/postcss-plugin[2m > [22mconfiguration[2m > [22mshould respect custom prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould transform simple rre() function calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() with token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() with numeric token parameter
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle multiple rre() calls in one declaration
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould handle rre() in calc() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mBasic rre() Function Processing[2m > [22mshould preserve non-rre() values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate :root rule with custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate responsive variants in media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould not generate custom properties when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould use custom property prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22m@custom-media Rules Generation[2m > [22mshould generate @custom-media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22m@custom-media Rules Generation[2m > [22mshould not generate @custom-media when disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mDevelopment Mode[2m > [22mshould add comments in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mDevelopment Mode[2m > [22mshould not add comments in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle malformed rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mError Handling[2m > [22mshould handle CSS without rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mConfiguration Options[2m > [22mshould use default options when none provided
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mConfiguration Options[2m > [22mshould respect all configuration options
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mValue Scaling and Calculations[2m > [22mshould scale values correctly for different breakpoints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mValue Scaling and Calculations[2m > [22mshould apply token-specific scaling
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Validation[2m > [22mshould generate valid CSS syntax
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mCSS Validation[2m > [22mshould handle complex CSS structures
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mPerformance Characteristics[2m > [22mshould process small CSS quickly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mPerformance Characteristics[2m > [22mshould handle moderate CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould count rre() functions correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract custom properties correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract media queries correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mUtility Functions[2m > [22mshould extract rre() functions correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mTest Case Management[2m > [22mshould create and run test cases correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mTest Case Management[2m > [22mshould handle failing test cases
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with existing custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with existing media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Unit Tests[2m > [22mEdge Cases[2m > [22mshould handle pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a complete component stylesheet
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a grid layout system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Component Scenarios[2m > [22mshould process a typography system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with multiple nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with pseudo-selectors and pseudo-elements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mComplex CSS Patterns[2m > [22mshould handle CSS with complex calc() expressions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould handle large CSS files efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould maintain performance with complex CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mPerformance Integration[2m > [22mshould handle multiple transformations efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mConfiguration Integration[2m > [22mshould work with different configuration combinations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mConfiguration Integration[2m > [22mshould handle custom property prefix correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mError Recovery Integration[2m > [22mshould recover from malformed CSS gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mError Recovery Integration[2m > [22mshould handle CSS with syntax errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for basic transformation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for complex CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mEnterprise Test Cases[2m > [22mshould pass enterprise test case for performance
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Scenarios[2m > [22mshould process a complete design system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Integration Tests[2m > [22mReal-World Scenarios[2m > [22mshould process a component library stylesheet
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process small CSS quickly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process medium CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould process large CSS within acceptable time
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mBasic Performance Benchmarks[2m > [22mshould handle complex CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark simple transformations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark multiple transformations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark complex CSS processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Benchmarking[2m > [22mshould benchmark large CSS processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould not leak memory with repeated processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould handle memory efficiently with large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mMemory Usage Tests[2m > [22mshould clean up memory after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom properties enabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom properties disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom media enabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well with custom media disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mConfiguration Performance Impact[2m > [22mshould perform well in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould scale linearly with CSS size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould handle concurrent processing efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mScalability Tests[2m > [22mshould handle very large CSS files[33m 509[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould provide accurate performance metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould meet performance thresholds
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Metrics[2m > [22mshould provide consistent performance metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould optimize CSS output size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould minimize custom property generation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mOptimization Tests[2m > [22mshould optimize media query generation
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle rapid successive processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle mixed CSS content efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mStress Tests[2m > [22mshould handle edge case CSS efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with simple CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with medium CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Regression Tests[2m > [22mshould maintain performance with large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Performance Tests[2m > [22mPerformance Comparison Tests[2m > [22mshould compare performance between configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle 1000 simple transformations efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle 500 complex transformations efficiently[33m 1026[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle very large CSS files[33m 1402[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mHigh Volume Processing[2m > [22mshould handle mixed content efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould not leak memory with repeated processing[33m 547[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould not leak memory with large CSS processing[33m 522[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould clean up memory after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mMemory Leak Detection[2m > [22mshould handle memory pressure gracefully[33m 2722[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle concurrent processing efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle mixed concurrent processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mConcurrent Processing Stress[2m > [22mshould handle high concurrency without errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle many malformed CSS gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle CSS with many syntax errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mError Recovery Stress[2m > [22mshould handle CSS with mixed valid and invalid content
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould maintain performance with repeated processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould maintain performance with increasing CSS size
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mPerformance Under Stress[2m > [22mshould handle performance under memory pressure
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mEdge Case Stress Tests[2m > [22mshould handle CSS with many calc() expressions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very deep nesting
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very long property names
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mResource Exhaustion Tests[2m > [22mshould handle very long values
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mStress Test Results[2m > [22mshould provide comprehensive stress test metrics
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Stress Tests[2m > [22mStress Test Results[2m > [22mshould maintain quality under stress
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould work correctly in GitHub Actions environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould handle GitHub Actions resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitHub Actions Environment[2m > [22mshould provide consistent results in GitHub Actions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitLab CI Environment[2m > [22mshould work correctly in GitLab CI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mGitLab CI Environment[2m > [22mshould handle GitLab CI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mJenkins Environment[2m > [22mshould work correctly in Jenkins environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mJenkins Environment[2m > [22mshould handle Jenkins resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCircleCI Environment[2m > [22mshould work correctly in CircleCI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCircleCI Environment[2m > [22mshould handle CircleCI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mTravis CI Environment[2m > [22mshould work correctly in Travis CI environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mTravis CI Environment[2m > [22mshould handle Travis CI resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mAzure DevOps Environment[2m > [22mshould work correctly in Azure DevOps environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mAzure DevOps Environment[2m > [22mshould handle Azure DevOps resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mLocal Development Environment[2m > [22mshould work correctly in local development environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mLocal Development Environment[2m > [22mshould handle local development resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mProduction Environment[2m > [22mshould work correctly in production environment
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mProduction Environment[2m > [22mshould handle production resource constraints
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould meet CI/CD performance requirements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould provide consistent performance across environments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Performance Benchmarks[2m > [22mshould generate comprehensive performance report
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Error Handling[2m > [22mshould handle errors gracefully in CI/CD environments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Error Handling[2m > [22mshould provide meaningful error messages in CI/CD
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Test Aggregation[2m > [22mshould aggregate test results correctly
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Test Aggregation[2m > [22mshould track performance metrics across CI/CD runs
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Configuration Tests[2m > [22mshould work with different CI/CD configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Configuration Tests[2m > [22mshould handle CI/CD environment-specific configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Integration Validation[2m > [22mshould validate CI/CD integration requirements
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mCI/CD Integration Validation[2m > [22mshould provide CI/CD-compatible output
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for simple rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for rre() with tokens
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for multiple rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mBasic CSS Transformations[2m > [22mshould generate consistent output for rre() in calc()
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent custom properties with custom prefix
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mCSS Custom Properties Generation[2m > [22mshould generate consistent responsive variants
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mMedia Query Generation[2m > [22mshould generate consistent media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mMedia Query Generation[2m > [22mshould generate consistent custom media rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output in development mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output in production mode
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output with custom properties disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mDevelopment vs Production Modes[2m > [22mshould generate consistent output with custom media disabled
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for nested selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for pseudo-selectors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for existing media queries
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mComplex CSS Structures[2m > [22mshould generate consistent output for existing custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for malformed rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for mixed valid and invalid CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for CSS with comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for empty CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mEdge Cases[2m > [22mshould generate consistent output for CSS without rre() functions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for component stylesheet
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for grid system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for typography system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mReal-World Scenarios[2m > [22mshould generate consistent output for design system
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mConfiguration Variations[2m > [22mshould generate consistent output with different prefixes
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mConfiguration Variations[2m > [22mshould generate consistent output with different configurations
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output across versions
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output for complex scenarios
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Snapshot Tests[2m > [22mRegression Tests[2m > [22mshould maintain consistent output for large CSS
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle empty rre() calls gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with invalid parameters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with too many parameters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with invalid token names gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMalformed rre() Function Calls[2m > [22mshould handle rre() with special characters gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle unmatched braces gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle unmatched parentheses gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle invalid CSS properties gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mCSS Syntax Errors[2m > [22mshould handle CSS with syntax errors gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only comments
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only whitespace
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only at-rules
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mEdge Cases[2m > [22mshould handle CSS with only custom properties
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle mixed valid and invalid rre() calls
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle CSS with nested errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mComplex Error Scenarios[2m > [22mshould handle CSS with pseudo-selector errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle invalid configuration options gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle missing configuration gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mConfiguration Error Handling[2m > [22mshould handle extreme configuration values gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle very large CSS files gracefully[33m 732[2mms[22m[39m
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very long property names gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very long values gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mMemory and Resource Error Handling[2m > [22mshould handle CSS with very deep nesting gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould recover from errors and continue processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould maintain CSS structure despite errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mRecovery and Resilience[2m > [22mshould preserve original CSS when errors occur
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould validate CSS syntax after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould validate custom properties after processing
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Validation[2m > [22mshould handle validation errors gracefully
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mPerformance Under Error Conditions[2m > [22mshould maintain performance with many errors
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mPerformance Under Error Conditions[2m > [22mshould handle error recovery efficiently
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Reporting[2m > [22mshould provide meaningful error information
packages/postcss-plugin test:  [32m✓[39m src/__tests__/index.test.ts[2m > [22mPostCSS Plugin Error Handling Tests[2m > [22mError Reporting[2m > [22mshould handle error reporting gracefully
packages/postcss-plugin test: [2m Test Files [22m [1m[32m9 passed[39m[22m[90m (9)[39m
packages/postcss-plugin test: [2m      Tests [22m [1m[32m444 passed[39m[22m[90m (444)[39m
packages/postcss-plugin test: [2m   Start at [22m 00:22:51
packages/postcss-plugin test: [2m   Duration [22m 33.86s[2m (transform 923ms, setup 147ms, collect 1.14s, tests 31.72s, environment 0ms, prepare 241ms)[22m
packages/postcss-plugin test: JSON report written to /home/runner/work/react-responsive-easy/react-responsive-easy/packages/postcss-plugin/test-results/results.json
packages/postcss-plugin test: Done
packages/babel-plugin test:  [32m✓[39m src/__tests__/stress.test.ts [2m ([22m[2m19 tests[22m[2m)[22m[33m 36217[2mms[22m[39m
packages/babel-plugin test: [31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Failed Tests 7 [27m[22m⎯⎯⎯⎯⎯⎯⎯[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/babel-plugin.test.ts[2m > [22m@react-responsive-easy/babel-plugin[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled
packages/babel-plugin test: [31m[1mAssertionError[22m: expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'[39m
packages/babel-plugin test: - Expected
packages/babel-plugin test: + Received
packages/babel-plugin test: - useResponsiveValue(24)
packages/babel-plugin test: + const currentBreakpoint = useBreakpoint();
packages/babel-plugin test: + import { useBreakpoint } from "react-responsive-easy";
packages/babel-plugin test: + import { useMemo } from "react";
packages/babel-plugin test: + const fontSize = useMemo(() => {
packages/babel-plugin test: +   switch (currentBreakpoint.name) {
packages/babel-plugin test: +     case "mobile":
packages/babel-plugin test: +       return "5px";
packages/babel-plugin test: +     case "tablet":
packages/babel-plugin test: +       return "9.5px";
packages/babel-plugin test: +     case "laptop":
packages/babel-plugin test: +       return "17px";
packages/babel-plugin test: +     case "desktop":
packages/babel-plugin test: +       return "24px";
packages/babel-plugin test: +     default:
packages/babel-plugin test: +       return "24px";
packages/babel-plugin test: +   }
packages/babel-plugin test: + }, [currentBreakpoint.name]);
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/babel-plugin.test.ts:[2m42:22[22m[39m
packages/babel-plugin test:     [90m 40| [39m      [35mconst[39m output [33m=[39m [34mtransformCode[39m(input[33m,[39m { precompute[33m:[39m [35mfalse[39m })[33m;[39m
packages/babel-plugin test:     [90m 41| [39m      
packages/babel-plugin test:     [90m 42| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useResponsiveValue(24)'[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                     [31m^[39m
packages/babel-plugin test:     [90m 43| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'useMemo'[39m)[33m;[39m
packages/babel-plugin test:     [90m 44| [39m    })[33m;[39m
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/babel-plugin.test.ts,title=src/__tests__/babel-plugin.test.ts > @react-responsive-easy/babel-plugin > useResponsiveValue transformations > should not transform when precompute is disabled,line=42,column=22::AssertionError: expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'%0A%0A- Expected%0A+ Received%0A%0A- useResponsiveValue(24)%0A+ const currentBreakpoint = useBreakpoint();%0A+ import { useBreakpoint } from "react-responsive-easy";%0A+ import { useMemo } from "react";%0A+ const fontSize = useMemo(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "5px";%0A+     case "tablet":%0A+       return "9.5px";%0A+     case "laptop":%0A+       return "17px";%0A+     case "desktop":%0A+       return "24px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);%0A%0A ❯ src/__tests__/babel-plugin.test.ts:42:22%0A%0A
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯[22m[39m
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/ci-cd.test.ts,title=src/__tests__/ci-cd.test.ts > CI/CD Integration Tests > Kubernetes environment > should handle Kubernetes resource limits,line=518,column=20::AssertionError: expected 586.5001850000117 to be less than 300%0A ❯ src/__tests__/ci-cd.test.ts:518:20%0A%0A
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/ci-cd.test.ts[2m > [22mCI/CD Integration Tests[2m > [22mKubernetes environment[2m > [22mshould handle Kubernetes resource limits
packages/babel-plugin test: [31m[1mAssertionError[22m: expected 586.5001850000117 to be less than 300[39m
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/ci-cd.test.ts:[2m518:20[22m[39m
packages/babel-plugin test:     [90m516| [39m
packages/babel-plugin test:     [90m517| [39m      [90m// Should complete 50 transformations in less than 300ms[39m
packages/babel-plugin test:     [90m518| [39m      [34mexpect[39m(time)[33m.[39m[34mtoBeLessThan[39m([34m300[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                   [31m^[39m
packages/babel-plugin test:     [90m519| [39m      
packages/babel-plugin test:     [90m520| [39m      [90m// Memory usage should be reasonable (less than 30MB)[39m
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/performance.test.ts,title=src/__tests__/performance.test.ts > Performance Tests > Transformation speed > should transform useScaledStyle calls efficiently,line=94,column=29::AssertionError: expected 44.52642700000433 to be less than 30%0A ❯ src/__tests__/performance.test.ts:94:29%0A%0A
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯[22m[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/performance.test.ts[2m > [22mPerformance Tests[2m > [22mTransformation speed[2m > [22mshould transform useScaledStyle calls efficiently
packages/babel-plugin test: [31m[1mAssertionError[22m: expected 44.52642700000433 to be less than 30[39m
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/performance.test.ts:[2m94:29[22m[39m
packages/babel-plugin test:     [90m 92| [39m      
packages/babel-plugin test:     [90m 93| [39m      [90m// Should complete transformation in less than 30ms (enterprise [39m…
packages/babel-plugin test:     [90m 94| [39m      [34mexpect[39m(transformTime)[33m.[39m[34mtoBeLessThan[39m([34m30[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                            [31m^[39m
packages/babel-plugin test:     [90m 95| [39m    })[33m;[39m
packages/babel-plugin test:     [90m 96| [39m
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯[22m[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/performance.test.ts[2m > [22mPerformance Tests[2m > [22mMemory usage[2m > [22mshould handle large input files efficiently
packages/babel-plugin test: [31m[1mAssertionError[22m: expected 196.90368400001898 to be less than 100[39m
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/performance.test.ts:[2m185:29[22m[39m
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/performance.test.ts,title=src/__tests__/performance.test.ts > Performance Tests > Memory usage > should handle large input files efficiently,line=185,column=29::AssertionError: expected 196.90368400001898 to be less than 100%0A ❯ src/__tests__/performance.test.ts:185:29%0A%0A
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/snapshots.test.ts,title=src/__tests__/snapshots.test.ts > Snapshot Tests > configuration options > should generate consistent output with precompute disabled,line=204,column=22::Error: Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched%0A%0A- Expected%0A+ Received%0A%0A  ""use strict";%0A%0A- const fontSize = useResponsiveValue(24, {%0A-   token: 'fontSize'%0A- });"%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const fontSize = (0, _react.useMemo)(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "12px";%0A+     case "tablet":%0A+       return "12px";%0A+     case "laptop":%0A+       return "14.5px";%0A+     case "desktop":%0A+       return "20.5px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);"%0A%0A ❯ src/__tests__/snapshots.test.ts:204:22%0A%0A
packages/babel-plugin test:     [90m183| [39m      
packages/babel-plugin test:     [90m184| [39m      [90m// Should complete transformation in less than 100ms[39m
packages/babel-plugin test:     [90m185| [39m      [34mexpect[39m(transformTime)[33m.[39m[34mtoBeLessThan[39m([34m100[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                            [31m^[39m
packages/babel-plugin test:     [90m186| [39m    })[33m;[39m
packages/babel-plugin test:     [90m187| [39m  })[33m;[39m
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯[22m[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/snapshots.test.ts[2m > [22mSnapshot Tests[2m > [22mconfiguration options[2m > [22mshould generate consistent output with precompute disabled
packages/babel-plugin test: [31m[1mError[22m: Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched[39m
packages/babel-plugin test: - Expected
packages/babel-plugin test: + Received
packages/babel-plugin test:   ""use strict";
packages/babel-plugin test: - const fontSize = useResponsiveValue(24, {
packages/babel-plugin test: -   token: 'fontSize'
packages/babel-plugin test: - });"
packages/babel-plugin test: + var _reactResponsiveEasy = require("react-responsive-easy");
packages/babel-plugin test: + var _react = require("react");
packages/babel-plugin test: + const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
packages/babel-plugin test: + const fontSize = (0, _react.useMemo)(() => {
packages/babel-plugin test: +   switch (currentBreakpoint.name) {
packages/babel-plugin test: +     case "mobile":
packages/babel-plugin test: +       return "12px";
packages/babel-plugin test: +     case "tablet":
packages/babel-plugin test: +       return "12px";
packages/babel-plugin test: +     case "laptop":
packages/babel-plugin test: +       return "14.5px";
packages/babel-plugin test: +     case "desktop":
packages/babel-plugin test: +       return "20.5px";
packages/babel-plugin test: +     default:
packages/babel-plugin test: +       return "24px";
packages/babel-plugin test: +   }
packages/babel-plugin test: + }, [currentBreakpoint.name]);"
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/snapshots.test.ts:[2m204:22[22m[39m
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/transformation.test.ts,title=src/__tests__/transformation.test.ts > Transformation Logic > useResponsiveValue transformations > should not transform when precompute is disabled,line=168,column=22::AssertionError: expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'%0A%0A- Expected%0A+ Received%0A%0A- useResponsiveValue(24)%0A+ "use strict";%0A+%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const fontSize = (0, _react.useMemo)(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "5px";%0A+     case "tablet":%0A+       return "9.5px";%0A+     case "laptop":%0A+       return "17px";%0A+     case "desktop":%0A+       return "24px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);%0A%0A ❯ src/__tests__/transformation.test.ts:168:22%0A%0A
packages/babel-plugin test: ::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/transformation.test.ts,title=src/__tests__/transformation.test.ts > Transformation Logic > useScaledStyle transformations > should not transform when precompute is disabled,line=298,column=26::AssertionError: expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'%0A%0A- Expected%0A+ Received%0A%0A- mobile%0A+ "use strict";%0A+%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const styles = useScaledStyle({%0A+   fontSize: {%0A+     "mobile": "12px",%0A+     "tablet": "12px",%0A+     "laptop": "12px",%0A+     "desktop": "15.5px"%0A+   },%0A+   padding: {%0A+     "mobile": "2px",%0A+     "tablet": "6px",%0A+     "laptop": "10px",%0A+     "desktop": "14px"%0A+   }%0A+ });%0A%0A ❯ src/__tests__/transformation.test.ts:298:26%0A%0A
packages/babel-plugin test:     [90m202| [39m      [35mconst[39m output [33m=[39m [34mtransformCode[39m(input[33m,[39m { precompute[33m:[39m [35mfalse[39m })[33m;[39m
packages/babel-plugin test:     [90m203| [39m      
packages/babel-plugin test:     [90m204| [39m      [34mexpect[39m(output)[33m.[39m[34mtoMatchSnapshot[39m()[33m;[39m
packages/babel-plugin test:     [90m   | [39m                     [31m^[39m
packages/babel-plugin test:     [90m205| [39m    })[33m;[39m
packages/babel-plugin test:     [90m206| [39m
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯[22m[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled
packages/babel-plugin test: [31m[1mAssertionError[22m: expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'[39m
packages/babel-plugin test: - Expected
packages/babel-plugin test: + Received
packages/babel-plugin test: - useResponsiveValue(24)
packages/babel-plugin test: + "use strict";
packages/babel-plugin test: +
packages/babel-plugin test: + var _reactResponsiveEasy = require("react-responsive-easy");
packages/babel-plugin test: + var _react = require("react");
packages/babel-plugin test: + const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
packages/babel-plugin test: + const fontSize = (0, _react.useMemo)(() => {
packages/babel-plugin test: +   switch (currentBreakpoint.name) {
packages/babel-plugin test: +     case "mobile":
packages/babel-plugin test: +       return "5px";
packages/babel-plugin test: +     case "tablet":
packages/babel-plugin test: +       return "9.5px";
packages/babel-plugin test: +     case "laptop":
packages/babel-plugin test: +       return "17px";
packages/babel-plugin test: +     case "desktop":
packages/babel-plugin test: +       return "24px";
packages/babel-plugin test: +     default:
packages/babel-plugin test: +       return "24px";
packages/babel-plugin test: +   }
packages/babel-plugin test: + }, [currentBreakpoint.name]);
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/transformation.test.ts:[2m168:22[22m[39m
packages/babel-plugin test:     [90m166| [39m      [35mconst[39m output [33m=[39m [34mtransformCodeForSnapshots[39m(input[33m,[39m { precompute[33m:[39m [35mfa[39m…
packages/babel-plugin test:     [90m167| [39m      
packages/babel-plugin test:     [90m168| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useResponsiveValue(24)'[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                     [31m^[39m
packages/babel-plugin test:     [90m169| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'useMemo'[39m)[33m;[39m
packages/babel-plugin test:     [90m170| [39m    })[33m;[39m
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯[22m[39m
packages/babel-plugin test: [31m[1m[7m FAIL [27m[22m[39m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museScaledStyle transformations[2m > [22mshould not transform when precompute is disabled
packages/babel-plugin test: [31m[1mAssertionError[22m: expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'[39m
packages/babel-plugin test: - Expected
packages/babel-plugin test: + Received
packages/babel-plugin test: - mobile
packages/babel-plugin test: + "use strict";
packages/babel-plugin test: +
packages/babel-plugin test: + var _reactResponsiveEasy = require("react-responsive-easy");
packages/babel-plugin test: + var _react = require("react");
packages/babel-plugin test: + const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
packages/babel-plugin test: + const styles = useScaledStyle({
packages/babel-plugin test: +   fontSize: {
packages/babel-plugin test: +     "mobile": "12px",
packages/babel-plugin test: +     "tablet": "12px",
packages/babel-plugin test: +     "laptop": "12px",
packages/babel-plugin test: +     "desktop": "15.5px"
packages/babel-plugin test: +   },
packages/babel-plugin test: +   padding: {
packages/babel-plugin test: +     "mobile": "2px",
packages/babel-plugin test: +     "tablet": "6px",
packages/babel-plugin test: +     "laptop": "10px",
packages/babel-plugin test: +     "desktop": "14px"
packages/babel-plugin test: +   }
packages/babel-plugin test: + });
packages/babel-plugin test: [36m [2m❯[22m src/__tests__/transformation.test.ts:[2m298:26[22m[39m
packages/babel-plugin test:     [90m296| [39m      
packages/babel-plugin test:     [90m297| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useScaledStyle({'[39m)[33m;[39m
packages/babel-plugin test:     [90m298| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'mobile'[39m)[33m;[39m
packages/babel-plugin test:     [90m   | [39m                         [31m^[39m
packages/babel-plugin test:     [90m299| [39m    })[33m;[39m
packages/babel-plugin test:     [90m300| [39m
packages/babel-plugin test: [31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯[22m[39m
packages/babel-plugin test: [2m  Snapshots [22m [1m[31m1 failed[39m[22m
packages/babel-plugin test: [2m Test Files [22m [1m[31m5 failed[39m[22m[2m | [22m[1m[32m7 passed[39m[22m[90m (12)[39m
packages/babel-plugin test: [2m      Tests [22m [1m[31m7 failed[39m[22m[2m | [22m[1m[32m247 passed[39m[22m[90m (254)[39m
packages/babel-plugin test: [2m   Start at [22m 00:22:50
packages/babel-plugin test: [2m   Duration [22m 39.36s[2m (transform 1.46s, setup 513ms, collect 6.17s, tests 56.49s, environment 12ms, prepare 3.60s)[22m
packages/babel-plugin test: Failed
/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @yaseratiar/react-responsive-easy-babel-plugin@1.0.1 test: `vitest`
Exit status 1
 ELIFECYCLE  Test failed. See above for more details.

```

### Root Level: lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy@1.0.0 lint /home/runner/work/react-responsive-easy/react-responsive-easy
> pnpm -r lint

Scope: 14 of 15 workspace projects
packages/babel-plugin lint$ eslint src --ext .ts,.tsx
packages/browser-extension lint$ eslint src --ext .ts,.tsx
packages/postcss-plugin lint$ eslint src --ext .ts,.tsx
packages/browser-extension lint: Oops! Something went wrong! :(
packages/browser-extension lint: ESLint: 8.57.1
packages/browser-extension lint: ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.
packages/browser-extension lint: The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".
packages/browser-extension lint: If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.
packages/browser-extension lint: Failed
/home/runner/work/react-responsive-easy/react-responsive-easy/packages/browser-extension:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @yaseratiar/react-responsive-easy-browser-extension@1.0.2 lint: `eslint src --ext .ts,.tsx`
Exit status 2
packages/babel-plugin lint: Oops! Something went wrong! :(
packages/babel-plugin lint: ESLint: 8.57.1
packages/babel-plugin lint: ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.
packages/babel-plugin lint: The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".
packages/babel-plugin lint: If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.
packages/babel-plugin lint: Failed
packages/postcss-plugin lint: Oops! Something went wrong! :(
packages/postcss-plugin lint: ESLint: 8.57.1
packages/postcss-plugin lint: ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.
packages/postcss-plugin lint: The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".
packages/postcss-plugin lint: If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.
 ELIFECYCLE  Command failed with exit code 2.

```

### Package: ai-optimizer

#### build

**Command:** `pnpm build`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-ai-optimizer@2.0.0 build /home/runner/work/react-responsive-easy/react-responsive-easy/packages/ai-optimizer
> rollup -c

 ELIFECYCLE  Command failed with exit code 1.

```

**STDERR:**
```
[36m
[1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
[32mcreated [1mdist/index.js, dist/index.esm.js[22m in [1m2.8s[22m[39m
[36m
[1mdist/index.d.ts[22m → [1mdist/index.d.ts[22m...[39m
[1m[31m[!] [1mRollupError: Could not resolve entry module "dist/index.d.ts".[22m[1m[39m[22m
[2m    at getRollupError (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:285:41)
    at Object.error (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:281:42)
    at ModuleLoader.loadEntryModule (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/rollup.js:22783:32)
    at async Promise.all (index 0)[22m



```

### Package: babel-plugin

#### tests

**Command:** `pnpm test`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-babel-plugin@1.0.1 test /home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin
> vitest


[7m[1m[36m RUN [39m[22m[27m [36mv1.6.1[39m [90m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin[39m

 [32m✓[39m src/__tests__/hook-transformers.test.ts [2m ([22m[2m25 tests[22m[2m)[22m[90m 35[2mms[22m[39m
 [32m✓[39m src/__tests__/fixtures.test.ts [2m ([22m[2m8 tests[22m[2m)[22m[33m 760[2mms[22m[39m
 [32m✓[39m src/__tests__/scaling-engine.test.ts [2m ([22m[2m31 tests[22m[2m)[22m[90m 22[2mms[22m[39m
 [33m❯[39m src/__tests__/transformation.test.ts [2m ([22m[2m37 tests[22m [2m|[22m [31m2 failed[39m[2m)[22m[33m 747[2mms[22m[39m
[31m   [33m❯[31m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled[39m
[31m     → expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'[39m
[31m   [33m❯[31m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museScaledStyle transformations[2m > [22mshould not transform when precompute is disabled[39m
[31m     → expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'[39m
 [32m✓[39m src/__tests__/ci-cd.test.ts [2m ([22m[2m23 tests[22m[2m)[22m[33m 2809[2mms[22m[39m
 [32m✓[39m src/__tests__/integration.test.ts [2m ([22m[2m16 tests[22m[2m)[22m[33m 875[2mms[22m[39m
 [32m✓[39m src/__tests__/performance.test.ts [2m ([22m[2m17 tests[22m[2m)[22m[33m 1560[2mms[22m[39m
 [32m✓[39m src/__tests__/cache-manager.test.ts [2m ([22m[2m21 tests[22m[2m)[22m[90m 37[2mms[22m[39m
 [33m❯[39m src/__tests__/snapshots.test.ts [2m ([22m[2m23 tests[22m [2m|[22m [31m1 failed[39m[2m)[22m[33m 735[2mms[22m[39m
[31m   [33m❯[31m src/__tests__/snapshots.test.ts[2m > [22mSnapshot Tests[2m > [22mconfiguration options[2m > [22mshould generate consistent output with precompute disabled[39m
[31m     → Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched[39m
 [32m✓[39m src/__tests__/config-loader.test.ts [2m ([22m[2m19 tests[22m[2m)[22m[90m 32[2mms[22m[39m
 [33m❯[39m src/__tests__/babel-plugin.test.ts [2m ([22m[2m15 tests[22m [2m|[22m [31m1 failed[39m[2m)[22m[33m 390[2mms[22m[39m
[31m   [33m❯[31m src/__tests__/babel-plugin.test.ts[2m > [22m@react-responsive-easy/babel-plugin[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled[39m
[31m     → expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'[39m
 [32m✓[39m src/__tests__/stress.test.ts [2m ([22m[2m19 tests[22m[2m)[22m[33m 24923[2mms[22m[39m


::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/babel-plugin.test.ts,title=src/__tests__/babel-plugin.test.ts > @react-responsive-easy/babel-plugin > useResponsiveValue transformations > should not transform when precompute is disabled,line=42,column=22::AssertionError: expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'%0A%0A- Expected%0A+ Received%0A%0A- useResponsiveValue(24)%0A+ const currentBreakpoint = useBreakpoint();%0A+ import { useBreakpoint } from "react-responsive-easy";%0A+ import { useMemo } from "react";%0A+ const fontSize = useMemo(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "5px";%0A+     case "tablet":%0A+       return "9.5px";%0A+     case "laptop":%0A+       return "17px";%0A+     case "desktop":%0A+       return "24px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);%0A%0A ❯ src/__tests__/babel-plugin.test.ts:42:22%0A%0A

::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/snapshots.test.ts,title=src/__tests__/snapshots.test.ts > Snapshot Tests > configuration options > should generate consistent output with precompute disabled,line=204,column=22::Error: Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched%0A%0A- Expected%0A+ Received%0A%0A  ""use strict";%0A%0A- const fontSize = useResponsiveValue(24, {%0A-   token: 'fontSize'%0A- });"%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const fontSize = (0, _react.useMemo)(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "12px";%0A+     case "tablet":%0A+       return "12px";%0A+     case "laptop":%0A+       return "14.5px";%0A+     case "desktop":%0A+       return "20.5px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);"%0A%0A ❯ src/__tests__/snapshots.test.ts:204:22%0A%0A

::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/transformation.test.ts,title=src/__tests__/transformation.test.ts > Transformation Logic > useResponsiveValue transformations > should not transform when precompute is disabled,line=168,column=22::AssertionError: expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'%0A%0A- Expected%0A+ Received%0A%0A- useResponsiveValue(24)%0A+ "use strict";%0A+%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const fontSize = (0, _react.useMemo)(() => {%0A+   switch (currentBreakpoint.name) {%0A+     case "mobile":%0A+       return "5px";%0A+     case "tablet":%0A+       return "9.5px";%0A+     case "laptop":%0A+       return "17px";%0A+     case "desktop":%0A+       return "24px";%0A+     default:%0A+       return "24px";%0A+   }%0A+ }, [currentBreakpoint.name]);%0A%0A ❯ src/__tests__/transformation.test.ts:168:22%0A%0A

::error file=/home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin/src/__tests__/transformation.test.ts,title=src/__tests__/transformation.test.ts > Transformation Logic > useScaledStyle transformations > should not transform when precompute is disabled,line=298,column=26::AssertionError: expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'%0A%0A- Expected%0A+ Received%0A%0A- mobile%0A+ "use strict";%0A+%0A+ var _reactResponsiveEasy = require("react-responsive-easy");%0A+ var _react = require("react");%0A+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();%0A+ const styles = useScaledStyle({%0A+   fontSize: {%0A+     "mobile": "12px",%0A+     "tablet": "12px",%0A+     "laptop": "12px",%0A+     "desktop": "15.5px"%0A+   },%0A+   padding: {%0A+     "mobile": "2px",%0A+     "tablet": "6px",%0A+     "laptop": "10px",%0A+     "desktop": "14px"%0A+   }%0A+ });%0A%0A ❯ src/__tests__/transformation.test.ts:298:26%0A%0A
[2m  Snapshots [22m [1m[31m1 failed[39m[22m
[2m Test Files [22m [1m[31m3 failed[39m[22m[2m | [22m[1m[32m9 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[31m4 failed[39m[22m[2m | [22m[1m[32m250 passed[39m[22m[90m (254)[39m
[2m   Start at [22m 00:23:47
[2m   Duration [22m 26.10s[2m (transform 686ms, setup 166ms, collect 2.85s, tests 32.92s, environment 3ms, prepare 1.61s)[22m

 ELIFECYCLE  Test failed. See above for more details.

```

**STDERR:**
```
[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Failed Tests 4 [27m[22m⎯⎯⎯⎯⎯⎯⎯[39m

[31m[1m[7m FAIL [27m[22m[39m src/__tests__/babel-plugin.test.ts[2m > [22m@react-responsive-easy/babel-plugin[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled
[31m[1mAssertionError[22m: expected 'const currentBreakpoint = useBreakpoi…' to contain 'useResponsiveValue(24)'[39m

- Expected
+ Received

- useResponsiveValue(24)
+ const currentBreakpoint = useBreakpoint();
+ import { useBreakpoint } from "react-responsive-easy";
+ import { useMemo } from "react";
+ const fontSize = useMemo(() => {
+   switch (currentBreakpoint.name) {
+     case "mobile":
+       return "5px";
+     case "tablet":
+       return "9.5px";
+     case "laptop":
+       return "17px";
+     case "desktop":
+       return "24px";
+     default:
+       return "24px";
+   }
+ }, [currentBreakpoint.name]);

[36m [2m❯[22m src/__tests__/babel-plugin.test.ts:[2m42:22[22m[39m
    [90m 40| [39m      [35mconst[39m output [33m=[39m [34mtransformCode[39m(input[33m,[39m { precompute[33m:[39m [35mfalse[39m })[33m;[39m
    [90m 41| [39m      
    [90m 42| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useResponsiveValue(24)'[39m)[33m;[39m
    [90m   | [39m                     [31m^[39m
    [90m 43| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'useMemo'[39m)[33m;[39m
    [90m 44| [39m    })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/__tests__/snapshots.test.ts[2m > [22mSnapshot Tests[2m > [22mconfiguration options[2m > [22mshould generate consistent output with precompute disabled
[31m[1mError[22m: Snapshot `Snapshot Tests > configuration options > should generate consistent output with precompute disabled 1` mismatched[39m

- Expected
+ Received

  ""use strict";

- const fontSize = useResponsiveValue(24, {
-   token: 'fontSize'
- });"
+ var _reactResponsiveEasy = require("react-responsive-easy");
+ var _react = require("react");
+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
+ const fontSize = (0, _react.useMemo)(() => {
+   switch (currentBreakpoint.name) {
+     case "mobile":
+       return "12px";
+     case "tablet":
+       return "12px";
+     case "laptop":
+       return "14.5px";
+     case "desktop":
+       return "20.5px";
+     default:
+       return "24px";
+   }
+ }, [currentBreakpoint.name]);"

[36m [2m❯[22m src/__tests__/snapshots.test.ts:[2m204:22[22m[39m
    [90m202| [39m      [35mconst[39m output [33m=[39m [34mtransformCode[39m(input[33m,[39m { precompute[33m:[39m [35mfalse[39m })[33m;[39m
    [90m203| [39m      
    [90m204| [39m      [34mexpect[39m(output)[33m.[39m[34mtoMatchSnapshot[39m()[33m;[39m
    [90m   | [39m                     [31m^[39m
    [90m205| [39m    })[33m;[39m
    [90m206| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museResponsiveValue transformations[2m > [22mshould not transform when precompute is disabled
[31m[1mAssertionError[22m: expected '"use strict";\n\nvar _reactResponsive…' to contain 'useResponsiveValue(24)'[39m

- Expected
+ Received

- useResponsiveValue(24)
+ "use strict";
+
+ var _reactResponsiveEasy = require("react-responsive-easy");
+ var _react = require("react");
+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
+ const fontSize = (0, _react.useMemo)(() => {
+   switch (currentBreakpoint.name) {
+     case "mobile":
+       return "5px";
+     case "tablet":
+       return "9.5px";
+     case "laptop":
+       return "17px";
+     case "desktop":
+       return "24px";
+     default:
+       return "24px";
+   }
+ }, [currentBreakpoint.name]);

[36m [2m❯[22m src/__tests__/transformation.test.ts:[2m168:22[22m[39m
    [90m166| [39m      [35mconst[39m output [33m=[39m [34mtransformCodeForSnapshots[39m(input[33m,[39m { precompute[33m:[39m [35mfa[39m…
    [90m167| [39m      
    [90m168| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useResponsiveValue(24)'[39m)[33m;[39m
    [90m   | [39m                     [31m^[39m
    [90m169| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'useMemo'[39m)[33m;[39m
    [90m170| [39m    })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/__tests__/transformation.test.ts[2m > [22mTransformation Logic[2m > [22museScaledStyle transformations[2m > [22mshould not transform when precompute is disabled
[31m[1mAssertionError[22m: expected '"use strict";\n\nvar _reactResponsive…' not to contain 'mobile'[39m

- Expected
+ Received

- mobile
+ "use strict";
+
+ var _reactResponsiveEasy = require("react-responsive-easy");
+ var _react = require("react");
+ const currentBreakpoint = (0, _reactResponsiveEasy.useBreakpoint)();
+ const styles = useScaledStyle({
+   fontSize: {
+     "mobile": "12px",
+     "tablet": "12px",
+     "laptop": "12px",
+     "desktop": "15.5px"
+   },
+   padding: {
+     "mobile": "2px",
+     "tablet": "6px",
+     "laptop": "10px",
+     "desktop": "14px"
+   }
+ });

[36m [2m❯[22m src/__tests__/transformation.test.ts:[2m298:26[22m[39m
    [90m296| [39m      
    [90m297| [39m      [34mexpect[39m(output)[33m.[39m[34mtoContain[39m([32m'useScaledStyle({'[39m)[33m;[39m
    [90m298| [39m      [34mexpect[39m(output)[33m.[39mnot[33m.[39m[34mtoContain[39m([32m'mobile'[39m)[33m;[39m
    [90m   | [39m                         [31m^[39m
    [90m299| [39m    })[33m;[39m
    [90m300| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯[22m[39m


```

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-babel-plugin@1.0.1 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/babel-plugin
> eslint src --ext .ts,.tsx

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.


```

### Package: browser-extension

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-browser-extension@1.0.2 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/browser-extension
> eslint src --ext .ts,.tsx

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.


```

### Package: cli

#### build

**Command:** `pnpm build`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-cli@2.0.0 prebuild /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli
> pnpm clean && pnpm type-check


> @yaseratiar/react-responsive-easy-cli@2.0.0 clean /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli
> rimraf dist coverage test-results.json lint-report.json


> @yaseratiar/react-responsive-easy-cli@2.0.0 type-check /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli
> tsc --noEmit

src/core/EnterpriseCLI.ts(9,42): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
src/core/EnterpriseCLI.ts(17,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
src/services/AIIntegrationService.ts(10,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
src/services/AIIntegrationService.ts(11,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'ComponentUsageData'.
src/services/AIIntegrationService.ts(12,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'PerformanceMetrics'.
src/services/AIIntegrationService.ts(13,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'AIModelConfig'.
src/services/AIIntegrationService.ts(197,15): error TS18046: 'suggestion' is of type 'unknown'.
src/services/AIIntegrationService.ts(263,53): error TS7006: Parameter 'v' implicitly has an 'any' type.
src/services/AIIntegrationService.ts(264,71): error TS7006: Parameter 'v' implicitly has an 'any' type.
src/services/PerformanceIntegrationService.ts(19,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
src/services/PerformanceIntegrationService.ts(405,40): error TS7006: Parameter 'a' implicitly has an 'any' type.
 ELIFECYCLE  Command failed with exit code 2.
 ELIFECYCLE  Command failed with exit code 2.

```

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-cli@2.0.0 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli
> eslint src --ext .ts,.tsx --max-warnings 0

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

Error [ERR_REQUIRE_ESM]: require() of ES Module /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli/.eslintrc.js from /home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs not supported.
.eslintrc.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.
Instead either rename .eslintrc.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli/package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).

    at module.exports [as default] (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/import-fresh@3.3.1/node_modules/import-fresh/index.js:33:91)
    at loadJSConfigFile (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:2583:47)
    at loadConfigFile (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:2667:20)
    at ConfigArrayFactory.loadInDirectory (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:2877:34)
    at CascadingConfigArrayFactory._loadConfigInAncestors (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:3871:46)
    at CascadingConfigArrayFactory._loadConfigInAncestors (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:3890:20)
    at CascadingConfigArrayFactory.getConfigArrayForFile (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@eslint+eslintrc@2.1.4/node_modules/@eslint/eslintrc/dist/eslintrc.cjs:3792:18)
    at FileEnumerator._iterateFilesRecursive (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/lib/cli-engine/file-enumerator.js:486:49)
    at _iterateFilesRecursive.next (<anonymous>)
    at FileEnumerator.iterateFiles (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/lib/cli-engine/file-enumerator.js:299:49)
    at iterateFiles.next (<anonymous>)
    at CLIEngine.executeOnFiles (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/lib/cli-engine/cli-engine.js:797:48)
    at ESLint.lintFiles (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/lib/eslint/eslint.js:551:23)
    at Object.execute (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/lib/cli.js:421:36)
    at async main (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/eslint@8.57.1/node_modules/eslint/bin/eslint.js:152:22)

```

#### typeCheck

**Command:** `pnpm type-check`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-cli@2.0.0 type-check /home/runner/work/react-responsive-easy/react-responsive-easy/packages/cli
> tsc --noEmit

src/core/EnterpriseCLI.ts(9,42): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
src/core/EnterpriseCLI.ts(17,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
src/services/AIIntegrationService.ts(10,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
src/services/AIIntegrationService.ts(11,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'ComponentUsageData'.
src/services/AIIntegrationService.ts(12,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'PerformanceMetrics'.
src/services/AIIntegrationService.ts(13,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'AIModelConfig'.
src/services/AIIntegrationService.ts(197,15): error TS18046: 'suggestion' is of type 'unknown'.
src/services/AIIntegrationService.ts(263,53): error TS7006: Parameter 'v' implicitly has an 'any' type.
src/services/AIIntegrationService.ts(264,71): error TS7006: Parameter 'v' implicitly has an 'any' type.
src/services/PerformanceIntegrationService.ts(19,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
src/services/PerformanceIntegrationService.ts(405,40): error TS7006: Parameter 'a' implicitly has an 'any' type.
 ELIFECYCLE  Command failed with exit code 2.

```

### Package: core

### Package: figma-plugin

### Package: next-plugin

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-next-plugin@1.0.1 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/next-plugin
> eslint src --ext .ts,.tsx

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.


```

#### typeCheck

**Command:** `pnpm type-check`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-next-plugin@1.0.1 type-check /home/runner/work/react-responsive-easy/react-responsive-easy/packages/next-plugin
> tsc --noEmit

../ai-optimizer/src/__tests__/AIOptimizer.test.ts(184,50): error TS2345: Argument of type '({ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; ...' is not assignable to parameter of type 'TrainingData[]'.
  Type '{ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; }...' is not assignable to type 'TrainingData'.
    Type '{ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; }...' is not assignable to type 'TrainingData'.
      The types of 'features.usage.componentFrequencies' are incompatible between these types.
        Type '{ Button: number; Card?: undefined; }' is not assignable to type 'Record<string, number>'.
          Property 'Card' is incompatible with index signature.
            Type 'undefined' is not assignable to type 'number'.
../ai-optimizer/src/__tests__/error-handling/ErrorHandlingTests.test.ts(118,59): error TS2345: Argument of type '{ strategy: { tokens: {}; origin: "width" | "height" | "min" | "max" | "diagonal" | "area"; mode: "linear" | "exponential" | "logarithmic" | "golden-ratio" | "custom"; rounding: { mode: "nearest" | "up" | "down" | "custom"; precision: number; }; accessibility: { minFontSize: number; minTapTarget: number; contrastPre...' is not assignable to parameter of type 'ResponsiveConfig'.
  The types of 'strategy.tokens' are incompatible between these types.
    Type '{}' is missing the following properties from type '{ fontSize: ScalingToken; spacing: ScalingToken; radius: ScalingToken; lineHeight: ScalingToken; shadow: ScalingToken; border: ScalingToken; }': fontSize, spacing, radius, lineHeight, and 2 more.
../ai-optimizer/src/__tests__/error-handling/ErrorHandlingTests.test.ts(296,49): error TS2345: Argument of type '{ features: { config: null; usage: null; performance: null; context: null; }; labels: ModelLabels; metadata: TrainingMetadata; }[]' is not assignable to parameter of type 'TrainingData[]'.
  Type '{ features: { config: null; usage: null; performance: null; context: null; }; labels: ModelLabels; metadata: TrainingMetadata; }' is not assignable to type 'TrainingData'.
    The types of 'features.config' are incompatible between these types.
      Type 'null' is not assignable to type 'ConfigurationFeatures'.
../babel-plugin/src/__tests__/hook-transformers.test.ts(482,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: null[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: null[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(501,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(525,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(550,37): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 733 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(579,29): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/utils/test-helpers.ts(275,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(276,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(277,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(281,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(282,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(286,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(287,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(291,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(295,5): error TS2304: Cannot find name 'expect'.
../cli/src/core/EnterpriseCLI.ts(9,42): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
../cli/src/core/EnterpriseCLI.ts(17,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
../cli/src/services/AIIntegrationService.ts(10,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
../cli/src/services/AIIntegrationService.ts(11,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'ComponentUsageData'.
../cli/src/services/AIIntegrationService.ts(12,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'PerformanceMetrics'.
../cli/src/services/AIIntegrationService.ts(13,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'AIModelConfig'.
../cli/src/services/AIIntegrationService.ts(197,15): error TS18046: 'suggestion' is of type 'unknown'.
../cli/src/services/AIIntegrationService.ts(263,53): error TS7006: Parameter 'v' implicitly has an 'any' type.
../cli/src/services/AIIntegrationService.ts(264,71): error TS7006: Parameter 'v' implicitly has an 'any' type.
../cli/src/services/PerformanceIntegrationService.ts(19,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
../cli/src/services/PerformanceIntegrationService.ts(405,40): error TS7006: Parameter 'a' implicitly has an 'any' type.
../cli/vitest.config.ts(52,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, but 'reporter' does not exist in type 'InlineConfig'. Did you mean to write 'reporters'?
../performance-dashboard/src/components/collaboration/CollaborationPanel.tsx(56,5): error TS2345: Argument of type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to parameter of type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/components/collaboration/CollaborationPanel.tsx(61,5): error TS2345: Argument of type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to parameter of type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/hooks/useErrorBoundary.tsx(114,17): error TS2786: 'FallbackComponent' cannot be used as a JSX component.
  Its type 'ComponentType<{ error: Error; resetError: () => void; }>' is not a valid JSX element type.
    Type 'ComponentClass<{ error: Error; resetError: () => void; }, any>' is not assignable to type 'ElementType'.
      Type 'ComponentClass<{ error: Error; resetError: () => void; }, any>' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
        Property 'refs' is missing in type 'Component<{ error: Error; resetError: () => void; }, any, any>' but required in type 'Component<any, any, any>'.
../performance-dashboard/src/hooks/useErrorBoundary.tsx(137,13): error TS2786: 'Component' cannot be used as a JSX component.
  Its type 'ComponentType<P>' is not a valid JSX element type.
    Type 'ComponentClass<P, any>' is not assignable to type 'ElementType'.
      Type 'ComponentClass<P, any>' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
        Property 'refs' is missing in type 'Component<P, any, any>' but required in type 'Component<any, any, any>'.
../performance-dashboard/src/hooks/useVirtualScrolling.ts(275,5): error TS2322: Type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/hooks/useVirtualScrolling.ts(276,5): error TS2322: Type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../postcss-plugin/src/__tests__/setup.ts(10,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
../postcss-plugin/src/__tests__/setup.ts(22,10): error TS2704: The operand of a 'delete' operator cannot be a read-only property.
../postcss-plugin/vitest.config.ts(42,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, but 'reporter' does not exist in type 'InlineConfig'. Did you mean to write 'reporters'?
 ELIFECYCLE  Command failed with exit code 2.

```

### Package: performance-dashboard

#### build

**Command:** `pnpm build`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-performance-dashboard@2.1.0 build /home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard
> rollup -c && npm run build:dashboard

 ELIFECYCLE  Command failed with exit code 1.

```

**STDERR:**
```
[36m
[1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
[1m[31m[!] [1m(plugin postcss) Error: require() of ES Module /home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/postcss.config.js from /home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/lilconfig@2.1.0/node_modules/lilconfig/dist/index.js not supported.
Instead change the require of postcss.config.js in /home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/lilconfig@2.1.0/node_modules/lilconfig/dist/index.js to a dynamic import() which is available in all CommonJS modules.[22m[1m[39m[22m
src/components/visualizations/VirtualScrollingList.css
[2mError [ERR_REQUIRE_ESM]: require() of ES Module /home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/postcss.config.js from /home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/lilconfig@2.1.0/node_modules/lilconfig/dist/index.js not supported.
Instead change the require of postcss.config.js in /home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/lilconfig@2.1.0/node_modules/lilconfig/dist/index.js to a dynamic import() which is available in all CommonJS modules.
    at Object.search (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/lilconfig@2.1.0/node_modules/lilconfig/dist/index.js:130:43)[22m



```

### Package: postcss-plugin

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-postcss-plugin@1.0.1 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/postcss-plugin
> eslint src --ext .ts,.tsx

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.


```

### Package: storybook-addon

#### build

**Command:** `pnpm build`

**Exit Code:** 1

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-storybook-addon@1.0.2 build /home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon
> rollup -c

 ELIFECYCLE  Command failed with exit code 1.

```

**STDERR:**
```
[36m
[1msrc/index.ts[22m → [1mdist/index.js, dist/index.esm.js[22m...[39m
[1m[33m(!) [plugin typescript] src/decorators/ResponsiveDecorator.tsx (12:36): @rollup/plugin-typescript TS6305: Output file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/dist/index.d.ts' has not been built from source file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/src/index.ts'.[39m[22m
[1m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon/src/decorators/ResponsiveDecorator.tsx:12:36[22m
[90m
[7m12[0m import { PerformanceMonitor } from '@react-responsive-easy/performance-dashboard';
[7m  [0m [91m                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[39m
[1m[33m(!) [plugin typescript] src/decorators/ResponsiveDecorator.tsx (38:58): @rollup/plugin-typescript TS7006: Parameter 'metrics' implicitly has an 'any' type.[39m[22m
[1m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon/src/decorators/ResponsiveDecorator.tsx:38:58[22m
[90m
[7m38[0m       const unsubscribe = monitor.on('metrics-updated', (metrics) => {
[7m  [0m [91m                                                         ~~~~~~~[0m
[39m
[1m[33m(!) [plugin typescript] @rollup/plugin-typescript: outputToFilesystem option is defaulting to true.[39m[22m
[32mcreated [1mdist/index.js, dist/index.esm.js[22m in [1m3.4s[22m[39m
[36m
[1msrc/manager.tsx[22m → [1mmanager.js[22m...[39m
[1m[33m(!) [plugin typescript] src/decorators/ResponsiveDecorator.tsx (12:36): @rollup/plugin-typescript TS6305: Output file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/dist/index.d.ts' has not been built from source file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/src/index.ts'.[39m[22m
[1m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon/src/decorators/ResponsiveDecorator.tsx:12:36[22m
[90m
[7m12[0m import { PerformanceMonitor } from '@react-responsive-easy/performance-dashboard';
[7m  [0m [91m                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[39m
[1m[33m(!) [plugin typescript] src/decorators/ResponsiveDecorator.tsx (38:58): @rollup/plugin-typescript TS7006: Parameter 'metrics' implicitly has an 'any' type.[39m[22m
[1m/home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon/src/decorators/ResponsiveDecorator.tsx:38:58[22m
[90m
[7m38[0m       const unsubscribe = monitor.on('metrics-updated', (metrics) => {
[7m  [0m [91m                                                         ~~~~~~~[0m
[39m
[32mcreated [1mmanager.js[22m in [1m1.3s[22m[39m
[36m
[1mdist/index.d.ts[22m → [1mdist/index.d.ts[22m...[39m
[1m[31m[!] [1mRollupError: Could not resolve entry module "dist/index.d.ts".[22m[1m[39m[22m
[2m    at getRollupError (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:285:41)
    at Object.error (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/parseAst.js:281:42)
    at ModuleLoader.loadEntryModule (/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/rollup@4.49.0/node_modules/rollup/dist/shared/rollup.js:22783:32)
    at async Promise.all (index 0)[22m



```

#### typeCheck

**Command:** `pnpm type-check`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-storybook-addon@1.0.2 type-check /home/runner/work/react-responsive-easy/react-responsive-easy/packages/storybook-addon
> tsc --noEmit

src/decorators/ResponsiveDecorator.tsx(12,36): error TS6305: Output file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/dist/index.d.ts' has not been built from source file '/home/runner/work/react-responsive-easy/react-responsive-easy/packages/performance-dashboard/src/index.ts'.
src/decorators/ResponsiveDecorator.tsx(38,58): error TS7006: Parameter 'metrics' implicitly has an 'any' type.
 ELIFECYCLE  Command failed with exit code 2.

```

### Package: vite-plugin

#### lint

**Command:** `pnpm lint`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-vite-plugin@1.0.1 lint /home/runner/work/react-responsive-easy/react-responsive-easy/packages/vite-plugin
> eslint src --ext .ts,.tsx

 ELIFECYCLE  Command failed with exit code 2.

```

**STDERR:**
```

Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/react-responsive-easy/react-responsive-easy/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.


```

#### typeCheck

**Command:** `pnpm type-check`

**Exit Code:** 2

**STDOUT:**
```

> @yaseratiar/react-responsive-easy-vite-plugin@1.0.1 type-check /home/runner/work/react-responsive-easy/react-responsive-easy/packages/vite-plugin
> tsc --noEmit

../ai-optimizer/src/__tests__/AIOptimizer.test.ts(184,50): error TS2345: Argument of type '({ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; ...' is not assignable to parameter of type 'TrainingData[]'.
  Type '{ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; }...' is not assignable to type 'TrainingData'.
    Type '{ features: { config: { breakpointCount: number; breakpointRatios: number[]; tokenComplexity: number; originDistribution: { width: number; height: number; min: number; max: number; diagonal: number; area: number; }; }; usage: { ...; }; performance: { ...; }; context: { ...; }; }; labels: { ...; }; metadata: { ...; }...' is not assignable to type 'TrainingData'.
      The types of 'features.usage.componentFrequencies' are incompatible between these types.
        Type '{ Button: number; Card?: undefined; }' is not assignable to type 'Record<string, number>'.
          Property 'Card' is incompatible with index signature.
            Type 'undefined' is not assignable to type 'number'.
../ai-optimizer/src/__tests__/error-handling/ErrorHandlingTests.test.ts(118,59): error TS2345: Argument of type '{ strategy: { tokens: {}; origin: "width" | "height" | "min" | "max" | "diagonal" | "area"; mode: "linear" | "exponential" | "logarithmic" | "golden-ratio" | "custom"; rounding: { mode: "nearest" | "up" | "down" | "custom"; precision: number; }; accessibility: { minFontSize: number; minTapTarget: number; contrastPre...' is not assignable to parameter of type 'ResponsiveConfig'.
  The types of 'strategy.tokens' are incompatible between these types.
    Type '{}' is missing the following properties from type '{ fontSize: ScalingToken; spacing: ScalingToken; radius: ScalingToken; lineHeight: ScalingToken; shadow: ScalingToken; border: ScalingToken; }': fontSize, spacing, radius, lineHeight, and 2 more.
../ai-optimizer/src/__tests__/error-handling/ErrorHandlingTests.test.ts(296,49): error TS2345: Argument of type '{ features: { config: null; usage: null; performance: null; context: null; }; labels: ModelLabels; metadata: TrainingMetadata; }[]' is not assignable to parameter of type 'TrainingData[]'.
  Type '{ features: { config: null; usage: null; performance: null; context: null; }; labels: ModelLabels; metadata: TrainingMetadata; }' is not assignable to type 'TrainingData'.
    The types of 'features.config' are incompatible between these types.
      Type 'null' is not assignable to type 'ConfigurationFeatures'.
../babel-plugin/src/__tests__/hook-transformers.test.ts(482,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: null[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: null[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(501,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(525,31): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(550,37): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 733 more.
../babel-plugin/src/__tests__/hook-transformers.test.ts(579,29): error TS2345: Argument of type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is not assignable to parameter of type 'NodePath<any>'.
  Type '{ node: { type: string; callee: { type: string; name: string; }; arguments: { type: string; value: number; }[]; }; replaceWith: Mock<any, any>; }' is missing the following properties from type 'NodePath<any>': parent, hub, data, context, and 732 more.
../babel-plugin/src/__tests__/utils/test-helpers.ts(275,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(276,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(277,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(281,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(282,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(286,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(287,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(291,5): error TS2304: Cannot find name 'expect'.
../babel-plugin/src/__tests__/utils/test-helpers.ts(295,5): error TS2304: Cannot find name 'expect'.
../cli/src/core/EnterpriseCLI.ts(9,42): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
../cli/src/core/EnterpriseCLI.ts(17,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
../cli/src/services/AIIntegrationService.ts(10,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'OptimizationSuggestions'.
../cli/src/services/AIIntegrationService.ts(11,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'ComponentUsageData'.
../cli/src/services/AIIntegrationService.ts(12,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'PerformanceMetrics'.
../cli/src/services/AIIntegrationService.ts(13,3): error TS2305: Module '"@yaseratiar/react-responsive-easy-ai-optimizer"' has no exported member 'AIModelConfig'.
../cli/src/services/AIIntegrationService.ts(197,15): error TS18046: 'suggestion' is of type 'unknown'.
../cli/src/services/AIIntegrationService.ts(263,53): error TS7006: Parameter 'v' implicitly has an 'any' type.
../cli/src/services/AIIntegrationService.ts(264,71): error TS7006: Parameter 'v' implicitly has an 'any' type.
../cli/src/services/PerformanceIntegrationService.ts(19,8): error TS2307: Cannot find module '@yaseratiar/react-responsive-easy-performance-dashboard' or its corresponding type declarations.
../cli/src/services/PerformanceIntegrationService.ts(405,40): error TS7006: Parameter 'a' implicitly has an 'any' type.
../cli/vitest.config.ts(52,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, but 'reporter' does not exist in type 'InlineConfig'. Did you mean to write 'reporters'?
../performance-dashboard/src/components/collaboration/CollaborationPanel.tsx(56,5): error TS2345: Argument of type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to parameter of type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/components/collaboration/CollaborationPanel.tsx(61,5): error TS2345: Argument of type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to parameter of type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/hooks/useErrorBoundary.tsx(114,17): error TS2786: 'FallbackComponent' cannot be used as a JSX component.
  Its type 'ComponentType<{ error: Error; resetError: () => void; }>' is not a valid JSX element type.
    Type 'ComponentClass<{ error: Error; resetError: () => void; }, any>' is not assignable to type 'ElementType'.
      Type 'ComponentClass<{ error: Error; resetError: () => void; }, any>' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
        Property 'refs' is missing in type 'Component<{ error: Error; resetError: () => void; }, any, any>' but required in type 'Component<any, any, any>'.
../performance-dashboard/src/hooks/useErrorBoundary.tsx(137,13): error TS2786: 'Component' cannot be used as a JSX component.
  Its type 'ComponentType<P>' is not a valid JSX element type.
    Type 'ComponentClass<P, any>' is not assignable to type 'ElementType'.
      Type 'ComponentClass<P, any>' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
        Property 'refs' is missing in type 'Component<P, any, any>' but required in type 'Component<any, any, any>'.
../performance-dashboard/src/hooks/useVirtualScrolling.ts(275,5): error TS2322: Type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../performance-dashboard/src/hooks/useVirtualScrolling.ts(276,5): error TS2322: Type 'import("/home/runner/work/react-responsive-easy/react-responsive-easy/node_modules/.pnpm/@types+react@18.3.24/node_modules/@types/react/index").RefObject<HTMLElement>' is not assignable to type 'React.RefObject<HTMLElement>'.
  Types of property 'current' are incompatible.
    Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
      Type 'null' is not assignable to type 'HTMLElement'.
../postcss-plugin/src/__tests__/setup.ts(10,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
../postcss-plugin/src/__tests__/setup.ts(22,10): error TS2704: The operand of a 'delete' operator cannot be a read-only property.
../postcss-plugin/vitest.config.ts(42,5): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, but 'reporter' does not exist in type 'InlineConfig'. Did you mean to write 'reporters'?
 ELIFECYCLE  Command failed with exit code 2.

```

## Recommendations

1. **Fix Critical Errors First**: Address build and type-check failures before tests
2. **Package-by-Package**: Fix one package at a time to avoid cascading failures
3. **Dependencies**: Ensure all dependencies are properly installed
4. **Environment**: Verify Node.js version and environment setup
5. **Incremental Fixes**: Make small, focused changes and test frequently

