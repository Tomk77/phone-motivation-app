#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const testDir = path.join(projectRoot, 'src', '__tests__');

const findTestFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return findTestFiles(resolved);
    }
    if (/\.test\.(ts|tsx)$/.test(entry.name)) {
      return [resolved];
    }
    return [];
  });
};

const suiteStack = [];

const createSuite = (name) => ({
  name,
  tests: [],
  beforeAll: [],
  afterAll: [],
  beforeEach: [],
  afterEach: [],
});

const rootSuite = createSuite('root');
suiteStack.push(rootSuite);

global.describe = (name, fn) => {
  const suite = createSuite(name);
  const parent = suiteStack[suiteStack.length - 1];
  parent.tests.push(suite);
  suiteStack.push(suite);
  fn();
  suiteStack.pop();
};

global.it = (name, fn) => {
  const suite = suiteStack[suiteStack.length - 1];
  suite.tests.push({ name, fn });
};

global.beforeAll = (fn) => {
  suiteStack[suiteStack.length - 1].beforeAll.push(fn);
};

global.afterAll = (fn) => {
  suiteStack[suiteStack.length - 1].afterAll.push(fn);
};

global.beforeEach = (fn) => {
  suiteStack[suiteStack.length - 1].beforeEach.push(fn);
};

global.afterEach = (fn) => {
  suiteStack[suiteStack.length - 1].afterEach.push(fn);
};

const matchers = {
  toBe(received, expected) {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}`);
    }
  },
  toEqual(received, expected) {
    const rec = JSON.stringify(received);
    const exp = JSON.stringify(expected);
    if (rec !== exp) {
      throw new Error(`Expected ${exp} but received ${rec}`);
    }
  },
  toMatchObject(received, expected) {
    for (const key of Object.keys(expected)) {
      if (typeof expected[key] === 'object' && expected[key] !== null) {
        matchers.toMatchObject(received[key], expected[key]);
      } else if (received[key] !== expected[key]) {
        throw new Error(`Expected property ${key} to equal ${expected[key]} but received ${received[key]}`);
      }
    }
  },
  toBeTruthy(received) {
    if (!received) {
      throw new Error('Expected value to be truthy');
    }
  },
  toHaveLength(received, expected) {
    if (!received || received.length !== expected) {
      throw new Error(`Expected length ${expected} but received ${received ? received.length : 'n/a'}`);
    }
  },
};

global.expect = (received) => ({
  toBe: (expected) => matchers.toBe(received, expected),
  toEqual: (expected) => matchers.toEqual(received, expected),
  toMatchObject: (expected) => matchers.toMatchObject(received, expected),
  toBeTruthy: () => matchers.toBeTruthy(received),
  toHaveLength: (expected) => matchers.toHaveLength(received, expected),
});

const transpile = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.React,
    },
    fileName: filePath,
  });
  return transpiled.outputText;
};

const aliasMap = {
  '@testing-library/react-native': path.join(
    projectRoot,
    'src/testing/react-native-testing-library.tsx',
  ),
  'react-native': path.join(projectRoot, 'src/testing/react-native-mock.ts'),
  'react-native-safe-area-context': path.join(
    projectRoot,
    'src/testing/react-native-safe-area-mock.ts',
  ),
  'expo-sqlite/next': path.join(projectRoot, 'src/testing/expo-sqlite-mock.ts'),
  'expo-notifications': path.join(projectRoot, 'src/testing/expo-notifications-mock.ts'),
  'expo-secure-store': path.join(projectRoot, 'src/testing/expo-secure-store-mock.ts'),
  'expo-file-system': path.join(projectRoot, 'src/testing/expo-file-system-mock.ts'),
  'expo-sharing': path.join(projectRoot, 'src/testing/expo-sharing-mock.ts'),
  'expo-haptics': path.join(projectRoot, 'src/testing/expo-haptics-mock.ts'),
};

const resolveModulePath = (moduleId, parentDir) => {
  if (aliasMap[moduleId]) {
    return aliasMap[moduleId];
  }
  if (moduleId.startsWith('.')) {
    const base = path.resolve(parentDir, moduleId);
    const extensions = ['.ts', '.tsx', '.js', '.json'];
    for (const ext of extensions) {
      if (fs.existsSync(base + ext)) {
        return base + ext;
      }
    }
    if (fs.existsSync(base)) {
      return base;
    }
  }
  return null;
};

const moduleCache = new Map();

const loadModule = (modulePath, parentDir) => {
  const resolved = resolveModulePath(modulePath, parentDir);
  if (!resolved) {
    return require(modulePath);
  }

  if (moduleCache.has(resolved)) {
    return moduleCache.get(resolved);
  }

  if (resolved.endsWith('.json')) {
    const value = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    moduleCache.set(resolved, value);
    return value;
  }

  if (resolved.endsWith('.js')) {
    const value = require(resolved);
    moduleCache.set(resolved, value);
    return value;
  }

  const code = transpile(resolved);
  const moduleObj = { exports: {} };
  const localRequire = (id) => loadModule(id, path.dirname(resolved));
  const context = vm.createContext({
    require: localRequire,
    module: moduleObj,
    console,
    __dirname: path.dirname(resolved),
    __filename: resolved,
    exports: moduleObj.exports,
    process,
    Buffer,
    setTimeout,
    clearTimeout,
  });
  vm.runInContext(code, context, { filename: resolved });
  moduleCache.set(resolved, moduleObj.exports);
  return moduleObj.exports;
};

const runFile = (filePath) => {
  const code = transpile(filePath);
  const moduleObj = { exports: {} };
  const localRequire = (id) => loadModule(id, path.dirname(filePath));
  const context = vm.createContext({
    require: localRequire,
    module: moduleObj,
    console,
    __dirname: path.dirname(filePath),
    __filename: filePath,
    exports: moduleObj.exports,
    process,
    Buffer,
    setTimeout,
    clearTimeout,
    describe,
    it,
    beforeAll,
    afterAll,
    beforeEach,
    afterEach,
    expect,
  });
  vm.runInContext(code, context, { filename: filePath });
};

const runSuite = async (suite, depth = 0, parentHooks = { beforeEach: [], afterEach: [] }) => {
  let passed = 0;
  let failed = 0;

  const invoke = async (fns) => {
    for (const fn of fns) {
      const result = fn();
      if (result && typeof result.then === 'function') {
        await result;
      }
    }
  };

  if (suite !== rootSuite) {
    await invoke(suite.beforeAll);
  }

  for (const test of suite.tests) {
    if (test.tests) {
      const child = await runSuite(test, depth + 1, {
        beforeEach: [...parentHooks.beforeEach, ...suite.beforeEach],
        afterEach: [...suite.afterEach, ...parentHooks.afterEach],
      });
      passed += child.passed;
      failed += child.failed;
      continue;
    }
    try {
      await invoke(parentHooks.beforeEach);
      await invoke(suite.beforeEach);
      const result = test.fn();
      if (result && typeof result.then === 'function') {
        await result;
      }
      await invoke(suite.afterEach);
      await invoke(parentHooks.afterEach);
      console.log(`✓ ${'  '.repeat(depth)}${test.name}`);
      passed += 1;
    } catch (error) {
      console.error(`✗ ${'  '.repeat(depth)}${test.name}`);
      console.error(error.message);
      failed += 1;
    }
  }

  if (suite !== rootSuite) {
    await invoke(suite.afterAll);
  }

  return { passed, failed };
};

const main = async () => {
  const files = findTestFiles(testDir);
  files.forEach(runFile);
  const { passed, failed } = await runSuite(rootSuite);
  console.log(`\nTest summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
