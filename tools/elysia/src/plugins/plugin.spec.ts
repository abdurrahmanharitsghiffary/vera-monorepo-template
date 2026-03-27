import { CreateNodesContextV2 } from '@nx/devkit';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

vi.mock('@nx/devkit/src/utils/calculate-hash-for-create-nodes', () => ({
  calculateHashForCreateNodes: vi.fn().mockResolvedValue('test-hash'),
}));

const CACHE_DIR = vi.hoisted(() => '/tmp/nx-elysia-plugin-test');

vi.mock('nx/src/utils/cache-directory', () => ({
  workspaceDataDirectory: CACHE_DIR,
}));

vi.mock('nx/src/devkit-internals', () => ({
  hashObject: vi.fn().mockReturnValue('test-options-hash'),
}));

import { createNodesV2 } from './plugin';

describe('@vera-monorepo/elysia plugin', () => {
  let createNodesFunction = createNodesV2[1];
  let context: CreateNodesContextV2;
  let tempDir: string;

  beforeEach(() => {
    // Fresh cache dir per test to prevent hash collision across tests
    mkdirSync(CACHE_DIR, { recursive: true });
    tempDir = mkdtempSync(join(tmpdir(), 'elysia-test-'));
    context = {
      nxJsonConfiguration: {
        namedInputs: {
          default: ['{projectRoot}/**/*'],
          production: ['!{projectRoot}/**/*.spec.ts'],
        },
      },
      workspaceRoot: tempDir,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
    rmSync(CACHE_DIR, { recursive: true, force: true });
  });

  describe('root projects', () => {
    beforeEach(() => {
      writeFileSync(
        join(tempDir, 'package.json'),
        JSON.stringify({ name: 'my-app', dependencies: { elysia: '^1.0.0' } }),
      );
    });

    it('should create nodes with default target names', async () => {
      const nodes = await createNodesFunction(['package.json'], {}, context);
      expect(nodes).toMatchSnapshot();
    });

    it('should create nodes with custom target names', async () => {
      const nodes = await createNodesFunction(
        ['package.json'],
        {
          buildTargetName: 'my-build',
          devTargetName: 'my-dev',
          startTargetName: 'my-start',
        },
        context,
      );
      expect(nodes).toMatchSnapshot();
    });

    it('should use src/index.ts as entry point by default', async () => {
      const nodes = await createNodesFunction(['package.json'], {}, context);
      const targets = (nodes[0][1] as any).projects['.'].targets;
      expect(targets['dev'].command).toContain('src/index.ts');
    });

    it('should use src/main.ts as entry point when it exists', async () => {
      mkdirSync(join(tempDir, 'src'), { recursive: true });
      writeFileSync(join(tempDir, 'src', 'main.ts'), '');

      const nodes = await createNodesFunction(['package.json'], {}, context);
      const targets = (nodes[0][1] as any).projects['.'].targets;
      expect(targets['dev'].command).toContain('src/main.ts');
    });
  });

  describe('integrated projects', () => {
    beforeEach(() => {
      mkdirSync(join(tempDir, 'my-app'), { recursive: true });
      writeFileSync(
        join(tempDir, 'my-app', 'project.json'),
        JSON.stringify({ name: 'my-app' }),
      );
      writeFileSync(
        join(tempDir, 'my-app', 'package.json'),
        JSON.stringify({ name: 'my-app', dependencies: { elysia: '^1.0.0' } }),
      );
    });

    it('should create nodes', async () => {
      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        {
          buildTargetName: 'build',
          devTargetName: 'dev',
          startTargetName: 'start',
        },
        context,
      );
      expect(nodes).toMatchSnapshot();
    });

    it('should not create nodes when elysia is not a dependency', async () => {
      writeFileSync(
        join(tempDir, 'my-app', 'package.json'),
        JSON.stringify({ name: 'my-app', dependencies: { express: '^4.0.0' } }),
      );

      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        {},
        context,
      );
      expect(nodes).toEqual([['my-app/package.json', {}]]);
    });

    it('should detect elysia in devDependencies', async () => {
      writeFileSync(
        join(tempDir, 'my-app', 'package.json'),
        JSON.stringify({ name: 'my-app', devDependencies: { elysia: '^1.0.0' } }),
      );

      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        {},
        context,
      );
      expect(nodes[0][1]).not.toEqual({});
    });

    it('should use src/main.ts as entry point when it exists', async () => {
      mkdirSync(join(tempDir, 'my-app', 'src'), { recursive: true });
      writeFileSync(join(tempDir, 'my-app', 'src', 'main.ts'), '');

      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        {},
        context,
      );
      const targets = (nodes[0][1] as any).projects['my-app'].targets;
      expect(targets['dev'].command).toContain('src/main.ts');
    });

    it('should use default port 3000', async () => {
      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        {},
        context,
      );
      const targets = (nodes[0][1] as any).projects['my-app'].targets;
      expect(targets['dev'].options.env.PORT).toBe('3000');
    });

    it('should use custom port when specified', async () => {
      const nodes = await createNodesFunction(
        ['my-app/package.json'],
        { port: 8080 },
        context,
      );
      const targets = (nodes[0][1] as any).projects['my-app'].targets;
      expect(targets['dev'].options.env.PORT).toBe('8080');
    });
  });

  describe('node_modules filtering', () => {
    it('should skip packages inside node_modules', async () => {
      mkdirSync(join(tempDir, 'node_modules', 'elysia'), { recursive: true });
      writeFileSync(
        join(tempDir, 'node_modules', 'elysia', 'package.json'),
        JSON.stringify({ name: 'elysia', dependencies: { elysia: '^1.0.0' } }),
      );

      const nodes = await createNodesFunction(
        ['node_modules/elysia/package.json'],
        {},
        context,
      );
      expect(nodes).toEqual([['node_modules/elysia/package.json', {}]]);
    });
  });
});
