import {
  CreateDependencies,
  CreateNodesContextV2,
  createNodesFromFiles,
  CreateNodesV2,
  detectPackageManager,
  NxJsonConfiguration,
  readJsonFile,
  TargetConfiguration,
  writeJsonFile,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs';
import { getLockFileName } from '@nx/js';
import { existsSync, readdirSync } from 'fs';
import { hashObject } from 'nx/src/devkit-internals';
import { workspaceDataDirectory } from 'nx/src/utils/cache-directory';
import { dirname, join } from 'path';

export interface ElysiaPluginOptions {
  devTargetName?: string;
  buildTargetName?: string;
  startTargetName?: string;
  port?: number;
}

const defaultOptions: Required<ElysiaPluginOptions> = {
  devTargetName: 'dev',
  buildTargetName: 'build',
  startTargetName: 'start',
  port: 3000,
};

const packageJsonGlob = '**/package.json';

function readTargetsCache(
  cachePath: string,
): Record<string, Record<string, TargetConfiguration<ElysiaPluginOptions>>> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(
  cachePath: string,
  targetsCache: Record<string, TargetConfiguration<ElysiaPluginOptions>>,
) {
  const oldCache = readTargetsCache(cachePath);
  writeJsonFile(cachePath, {
    ...oldCache,
    ...targetsCache,
  });
}

/**
 * @deprecated The 'createDependencies' function is now a no-op. This functionality is included in 'createNodesV2'.
 */
export const createDependencies: CreateDependencies = () => {
  return [];
};

export const createNodes: CreateNodesV2<ElysiaPluginOptions> = [
  packageJsonGlob,
  async (configFiles, options = defaultOptions, context) => {
    const optionsHash = hashObject(options);
    const cachePath = join(
      workspaceDataDirectory,
      `elysia-${optionsHash}.json`,
    );
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options = defaultOptions, context) =>
          createNodesInternal(configFile, options, context, targetsCache),
        configFiles,
        options,
        context,
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

export const createNodesV2 = createNodes;

async function createNodesInternal(
  configFilePath: string,
  options: ElysiaPluginOptions,
  context: CreateNodesContextV2,
  targetsCache: Record<
    string,
    Record<string, TargetConfiguration<ElysiaPluginOptions>>
  >,
) {
  const projectRoot = dirname(configFilePath);

  // Skip node_modules
  if (projectRoot.includes('node_modules')) {
    return {};
  }

  // Do not create a project if package.json and project.json isn't there.
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (
    !siblingFiles.includes('package.json') &&
    !siblingFiles.includes('project.json')
  ) {
    return {};
  }

  // Only apply to projects that have elysia as a dependency
  const packageJson = readJsonFile(join(context.workspaceRoot, configFilePath));
  const hasElysia =
    packageJson?.dependencies?.['elysia'] !== undefined ||
    packageJson?.devDependencies?.['elysia'] !== undefined;

  if (!hasElysia) {
    return {};
  }

  options = normalizeOptions(options);

  const hash = await calculateHashForCreateNodes(
    projectRoot,
    options,
    context,
    [getLockFileName(detectPackageManager(context.workspaceRoot))],
  );

  targetsCache[hash] ??= buildElysiaTargets(projectRoot, options, context);

  return {
    projects: {
      [projectRoot]: {
        root: projectRoot,
        targets: targetsCache[hash],
      },
    },
  };
}

function buildElysiaTargets(
  projectRoot: string,
  options: ElysiaPluginOptions,
  context: CreateNodesContextV2,
) {
  const namedInputs = getNamedInputs(projectRoot, context);

  // Detect entry point — prefer src/main.ts then src/index.ts
  const entryPoint = existsSync(
    join(context.workspaceRoot, projectRoot, 'src/main.ts'),
  )
    ? 'src/main.ts'
    : 'src/index.ts';

  const targets: Record<string, TargetConfiguration> = {};

  targets[options.devTargetName ?? defaultOptions.devTargetName] =
    getDevTargetConfig(
      projectRoot,
      entryPoint,
      options.port ?? defaultOptions.port,
    );

  targets[options.buildTargetName ?? defaultOptions.buildTargetName] =
    getBuildTargetConfig(namedInputs, projectRoot, entryPoint);

  targets[options.startTargetName ?? defaultOptions.startTargetName] =
    getStartTargetConfig(projectRoot, options);

  return targets;
}

function getDevTargetConfig(
  projectRoot: string,
  entryPoint: string,
  port: number,
): TargetConfiguration {
  return {
    continuous: true,
    command: `bun run --hot ${entryPoint}`,
    options: {
      cwd: projectRoot,
      env: {
        PORT: String(port),
      },
    },
  };
}

function getBuildTargetConfig(
  namedInputs: NxJsonConfiguration['namedInputs'],
  projectRoot: string,
  entryPoint: string,
): TargetConfiguration {
  return {
    command: `bun build --compile --minify-whitespace --minify-syntax --target bun --outfile dist/server ${entryPoint}`,
    options: {
      cwd: projectRoot,
    },
    dependsOn: ['^build'],
    cache: true,
    inputs: getInputs(namedInputs),
    outputs: [`{workspaceRoot}/${projectRoot}/dist/server`],
  };
}

function getStartTargetConfig(
  projectRoot: string,
  options: ElysiaPluginOptions,
): TargetConfiguration {
  return {
    continuous: true,
    command: `./dist/server`,
    options: {
      cwd: projectRoot,
    },
    dependsOn: [options.buildTargetName ?? defaultOptions.buildTargetName],
  };
}

function normalizeOptions(options: ElysiaPluginOptions): ElysiaPluginOptions {
  options ??= {};
  options.devTargetName ??= 'dev';
  options.buildTargetName ??= 'build';
  options.startTargetName ??= 'start';
  options.port ??= 3000;
  return options;
}

function getInputs(
  namedInputs: NxJsonConfiguration['namedInputs'],
): TargetConfiguration['inputs'] {
  return [
    ...('production' in (namedInputs ?? {})
      ? ['default', '^production']
      : ['default', '^default']),
    {
      externalDependencies: ['elysia'],
    },
  ];
}
