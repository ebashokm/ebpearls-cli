#!/usr/bin/env node

const shell = require('shelljs');
const { checkbox, input, select, confirm } = require('@inquirer/prompts');
const path = require('path');
const os = require('os');
const fs = require('fs');
const constants = require('./constants');
const { API_MODULE_REGISTRY, CMS_MODULE_REGISTRY, CMS_FRONTEND_REGISTRY } = require('./module-registry');

const c = {
  pearl: '\x1b[38;5;255m',
  brand: '\x1b[38;5;214m',
  ocean: '\x1b[38;5;39m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const banner = `
${c.brand}${c.bold}
  ███████╗██████╗     ██████╗ ███████╗ █████╗ ██████╗ ██╗     ███████╗
  ██╔════╝██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝
  █████╗  ██████╔╝    ██████╔╝█████╗  ███████║██████╔╝██║     ███████╗
  ██╔══╝  ██╔══██╗    ██╔═══╝ ██╔══╝  ██╔══██║██╔══██╗██║     ╚════██║
  ███████╗██████╔╝    ██║     ███████╗██║  ██║██║  ██║███████╗███████║
  ╚══════╝╚═════╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝
                                                                      
  ${c.pearl}>> EB PEARLS COMMAND LINE INTERFACE <<
${c.reset}`;


const rawBanner = `
${c.brand}${c.bold}
  ███████╗██████╗ ██████╗ ███████╗ █████╗ ██████╗ ██╗     ███████╗     ██████╗██╗     ██╗
  ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝    ██╔════╝██║     ██║
  █████╗  ██████╔╝██████╔╝█████╗  ███████║██████╔╝██║     ███████╗    ██║     ██║     ██║
  ██╔══╝  ██╔══██╗██╔═══╝ ██╔══╝  ██╔══██║██╔══██╗██║     ╚════██║    ██║     ██║     ██║
  ███████╗██████╔╝██║     ███████╗██║  ██║██║  ██║███████╗███████║    ╚██████╗███████╗██║
  ╚══════╝╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝╚══════╝╚═╝
  
  ${c.pearl}>> EB PEARLS COMMAND LINE INTERFACE <<
${c.reset}`;

/**
 * Checks that the running Node.js version meets the minimum required version.
 * @param {string} currentVersion - e.g. "16.14.0" (from process.versions.node)
 * @param {string} minimumVersion - e.g. ">=18.0.0" or "18.0.0" (from engines.node range)
 */
function checkNodeVersion(currentVersion, minimumVersion) {
  const parse = (v) => v.replace(/^[^0-9]*/, '').split('.').map(Number);
  const [curMaj, curMin, curPat] = parse(currentVersion);
  const [minMaj, minMin, minPat] = parse(minimumVersion);

  const isBelow =
    curMaj < minMaj ||
    (curMaj === minMaj && curMin < minMin) ||
    (curMaj === minMaj && curMin === minMin && curPat < minPat);

  if (isBelow) {
    process.stderr.write(
      `Error: Node.js v${currentVersion} is not supported.\n` +
      `Required: v${minimumVersion} or higher.\n` +
      `Please upgrade Node.js: https://nodejs.org/en/download\n`
    );
    process.exit(1);
  }
}

function expandPath(p) {
  if (p.startsWith('~')) return path.join(os.homedir(), p.slice(1));
  return path.resolve(p);
}

function detectPackageManager(projectPath) {
  if (shell.test('-f', path.join(projectPath, 'bun.lockb')) || shell.test('-f', path.join(projectPath, 'bun.lock'))) return 'bun';
  if (shell.test('-f', path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (shell.test('-f', path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (shell.test('-f', path.join(projectPath, 'package-lock.json'))) return 'npm';

  const pkgPath = path.join(projectPath, 'package.json');
  if (shell.test('-f', pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.packageManager) {
        const name = pkg.packageManager.split('@')[0];
        if (['bun', 'pnpm', 'yarn', 'npm'].includes(name)) return name;
      }
    } catch (_) {}
  }

  if (shell.which('bun')) return 'bun';
  if (shell.which('pnpm')) return 'pnpm';
  if (shell.which('yarn')) return 'yarn';
  if (shell.which('npm')) return 'npm';

  return 'npm';
}

function getRunCmd(pm, script) {
  if (pm === 'npm') return `npm run ${script}`;
  return `${pm} ${script}`;
}

function getInstallCmd(pm) {
  return `${pm} install`;
}

function collectApiModuleInfo(selectedModules) {
  const importLines = [];
  const registrationNames = [];
  const graphqlIncludeNames = [];
  const contextServices = [];

  for (const mod of selectedModules) {
    const entry = API_MODULE_REGISTRY[mod];
    if (!entry) continue;

    for (const m of entry.modules) {
      importLines.push(`import { ${m.className} } from '${m.importPath}';`);
      registrationNames.push(m.className);
      if (entry.graphqlInclude) {
        graphqlIncludeNames.push(m.className);
      }
    }

    if (entry.contextFactory) {
      contextServices.push(entry.contextFactory);
    }
  }

  return { importLines, registrationNames, graphqlIncludeNames, contextServices };
}

function buildGraphqlBlock(graphqlIncludeNames, contextServices) {
  const includeStr = graphqlIncludeNames
    .map(n => `          ${n},`)
    .join('\n');

  if (contextServices.length === 0) {
    return `GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        validationRules: [depthLimit(5)],
        autoSchemaFile: 'schema1234.gql',
        resolvers: { JSON: GraphQLJSON },
        sortSchema: true,
        path: '/api',
        playground: false,
        introspection: true,
        context: ({ req, res }) => ({ req, res }),
        csrfPrevention: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        include: [
${includeStr}
        ],
        formatError: formatGraphQLError,
      }),
    })`;
  }

  const moduleWithCtx = [];
  const injectNames = [];
  const factoryParams = [];
  const contextArgs = [];

  for (const ctx of contextServices) {
    const paramName = ctx.service.className.charAt(0).toLowerCase() + ctx.service.className.slice(1);
    const parentEntry = Object.values(API_MODULE_REGISTRY).find(e =>
      e.contextFactory && e.contextFactory.service.className === ctx.service.className
    );
    if (parentEntry) {
      moduleWithCtx.push(parentEntry.modules[0].className);
    }
    injectNames.push(ctx.service.className);
    factoryParams.push(`        ${paramName}: ${ctx.service.className},`);
    contextArgs.push(`            ${paramName},`);
  }

  return `GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [${moduleWithCtx.join(', ')}],
      inject: [${injectNames.join(', ')}],
      useFactory: (
${factoryParams.join('\n')}
      ) => ({
        validationRules: [depthLimit(5)],
        autoSchemaFile: 'schema1234.gql',
        resolvers: { JSON: GraphQLJSON },
        sortSchema: true,
        path: '/api',
        playground: false,
        introspection: true,
        context: ({ req, res }) =>
          createGqlContext({
            req,
            res,
${contextArgs.join('\n')}
          }),
        csrfPrevention: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        include: [
${includeStr}
        ],
        formatError: formatGraphQLError,
      }),
    })`;
}

function injectApiModules(projectPath, selectedModules) {
  const appModulePath = path.join(projectPath, 'apps/api/src/app.module.ts');
  let content = fs.readFileSync(appModulePath, 'utf8');

  const { importLines, registrationNames, graphqlIncludeNames, contextServices } = collectApiModuleInfo(selectedModules);

  if (contextServices.length > 0) {
    for (const ctx of contextServices) {
      importLines.push(`import { ${ctx.service.className} } from '${ctx.service.importPath}';`);
    }
  }

  content = content.replace(
    '// __MODULE_IMPORTS__',
    importLines.join('\n')
  );

  content = content.replace(
    '// __MODULE_REGISTRATIONS__',
    registrationNames.map(n => `    ${n},`).join('\n')
  );

  const gqlBlock = buildGraphqlBlock(graphqlIncludeNames, contextServices);
  content = content.replace(
    '// __GRAPHQL_MODULE__',
    gqlBlock + ','
  );

  fs.writeFileSync(appModulePath, content, 'utf8');

  if (contextServices.length > 0) {
    updateContextFactory(projectPath, contextServices);
  }
}

function updateContextFactory(projectPath, contextServices) {
  const factoryPath = path.join(projectPath, 'apps/api/src/graphql/context.factory.ts');

  const imports = ["import DataLoader from 'dataloader';"];
  const typeFields = ['  req: any;', '  res?: any;'];
  const fnParams = ['  req,', '  res,'];
  const fnParamTypes = ['  req: any;', '  res?: any;'];
  const contextReturn = ['    req,', '    res,'];
  const loaderCreations = [];

  for (const ctx of contextServices) {
    const svc = ctx.service;
    imports.push(`import { ${svc.className} } from '../${svc.importPath.replace('./', '')}';`);

    const paramName = svc.className.charAt(0).toLowerCase() + svc.className.slice(1);
    fnParams.push(`  ${paramName},`);
    fnParamTypes.push(`  ${paramName}: ${svc.className};`);

    if (ctx.loaderName === 'userLoader') {
      typeFields.push(`  ${ctx.loaderName}: DataLoader<${ctx.loaderKeyType}, ${ctx.loaderValueType}>;`);
      loaderCreations.push(`  const ${ctx.loaderName} = new DataLoader<${ctx.loaderKeyType}, ${ctx.loaderValueType}>(async (userIds) => {
    const users = await ${paramName}.findByIds(userIds as string[], {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
      bio: 1,
    });
    const byId = new Map(users.map((u: any) => [String(u?._id), u]));
    return (userIds as string[]).map((id) => byId.get(String(id)) ?? null);
  });`);
      contextReturn.push(`    ${ctx.loaderName},`);
    } else if (ctx.loaderName) {
      typeFields.push(`  ${ctx.loaderName}: DataLoader<${ctx.loaderKeyType}, ${ctx.loaderValueType}, string>;`);
      loaderCreations.push(`  const ${ctx.loaderName} = new DataLoader<
    ${ctx.loaderKeyType},
    ${ctx.loaderValueType},
    string
  >(
    async (keys) => {
      const userId = keys[0]?.userId;
      const ${ctx.loaderBatchKeyField}s = keys.map((k) => k.${ctx.loaderBatchKeyField});
      const likedSet = await ${paramName}.getLikeStatusForMany(userId, ${ctx.loaderBatchKeyField}s);
      return keys.map((k) => likedSet.has(k.${ctx.loaderBatchKeyField}));
    },
    { cacheKeyFn: (k) => ${ctx.loaderKeySerializer} },
  );`);
      contextReturn.push(`    ${ctx.loaderName},`);
    }
  }

  const loaderBlock = loaderCreations.length > 0
    ? '\n' + loaderCreations.join('\n\n') + '\n'
    : '';

  const output = `${imports.join('\n')}

export type GqlContext = {
${typeFields.join('\n')}
};

export function createGqlContext({
${fnParams.join('\n')}
}: {
${fnParamTypes.join('\n')}
}): GqlContext {${loaderBlock}
  return {
${contextReturn.join('\n')}
  };
}
`;

  fs.writeFileSync(factoryPath, output, 'utf8');
}

function injectCmsModules(projectPath, selectedModules) {
  const appModulePath = path.join(projectPath, 'apps/cms-api/src/app.module.ts');
  let content = fs.readFileSync(appModulePath, 'utf8');

  const importLines = [];
  const registrationNames = [];

  for (const mod of selectedModules) {
    const entry = CMS_MODULE_REGISTRY[mod];
    if (!entry) continue;

    importLines.push(`import { ${entry.className} } from '${entry.importPath}';`);
    registrationNames.push(entry.className);
  }

  content = content.replace(
    '// __MODULE_IMPORTS__',
    importLines.join('\n')
  );

  content = content.replace(
    '// __MODULE_REGISTRATIONS__',
    registrationNames.map(n => `    ${n},`).join('\n')
  );

  fs.writeFileSync(appModulePath, content, 'utf8');
}

function injectCmsFrontendRoutes(projectPath, selectedModules) {
  const routesIndexPath = path.join(projectPath, 'src/routes/index.tsx');
  let content = fs.readFileSync(routesIndexPath, 'utf8');

  const importLines = [];
  const routeNames = [];

  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry || !entry.route) continue;
    importLines.push(`import ${entry.route.exportName} from './${entry.route.file.replace('.tsx', '')}';`);
    routeNames.push(entry.route.exportName);
  }

  content = content.replace(
    /\/\/import start\n/,
    '//import start\n' + (importLines.length ? importLines.join('\n') + '\n' : '')
  );

  content = content.replace(
    /\/\/module start\n/,
    '//module start\n' + (routeNames.length ? routeNames.map(n => `        ${n},`).join('\n') + '\n' : '')
  );

  fs.writeFileSync(routesIndexPath, content, 'utf8');
}

function injectCmsFrontendMenuItems(projectPath, selectedModules) {
  const menuIndexPath = path.join(projectPath, 'src/menu-items/index.tsx');
  let content = fs.readFileSync(menuIndexPath, 'utf8');

  const importLines = [];
  const menuNames = [];

  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry || !entry.menuItem) continue;
    importLines.push(`import ${entry.menuItem.exportName} from './${entry.menuItem.file.replace('.tsx', '')}';`);
    menuNames.push(entry.menuItem.exportName);
  }

  content = content.replace(
    /\/\/import start\n/,
    '//import start\n' + (importLines.length ? importLines.join('\n') + '\n' : '')
  );

  content = content.replace(
    /\/\/module start\n/,
    '//module start\n' + (menuNames.length ? menuNames.map(n => `        ${n},`).join('\n') + '\n' : '')
  );

  fs.writeFileSync(menuIndexPath, content, 'utf8');
}

function copyCmsFrontendModules(projectPath, selectedModules) {
  const cmsTemplatePath = path.join(__dirname, 'cliRepoPath/cms');

  const coreViewDirs = ['profile', 'user-management', 'pages'];
  const viewDirsToCopy = new Set(coreViewDirs);

  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry) continue;
    if (entry.viewDirs) entry.viewDirs.forEach(d => viewDirsToCopy.add(d));
  }

  for (const dir of viewDirsToCopy) {
    const src = path.join(cmsTemplatePath, 'src/views', dir);
    const dest = path.join(projectPath, 'src/views', dir);
    if (shell.test('-d', src)) {
      shell.mkdir('-p', path.dirname(dest));
      shell.cp('-R', src, dest);
    }
  }

  const coreRouteFiles = ['MainRoutes.tsx', 'LoginRoutes.tsx'];
  for (const f of coreRouteFiles) {
    const src = path.join(cmsTemplatePath, 'src/routes', f);
    const dest = path.join(projectPath, 'src/routes', f);
    if (shell.test('-f', src)) shell.cp(src, dest);
  }
  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry || !entry.route) continue;
    const src = path.join(cmsTemplatePath, 'src/routes', entry.route.file);
    const dest = path.join(projectPath, 'src/routes', entry.route.file);
    if (shell.test('-f', src)) shell.cp(src, dest);
  }

  const coreMenuFiles = ['userManagement.tsx'];
  for (const f of coreMenuFiles) {
    const src = path.join(cmsTemplatePath, 'src/menu-items', f);
    const dest = path.join(projectPath, 'src/menu-items', f);
    if (shell.test('-f', src)) shell.cp(src, dest);
  }
  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry || !entry.menuItem) continue;
    const src = path.join(cmsTemplatePath, 'src/menu-items', entry.menuItem.file);
    const dest = path.join(projectPath, 'src/menu-items', entry.menuItem.file);
    if (shell.test('-f', src)) shell.cp(src, dest);
  }

  for (const mod of selectedModules) {
    const entry = CMS_FRONTEND_REGISTRY[mod];
    if (!entry || !entry.apiFiles) continue;
    for (const f of entry.apiFiles) {
      const src = path.join(cmsTemplatePath, 'src/api', f);
      const dest = path.join(projectPath, 'src/api', f);
      if (shell.test('-f', src)) {
        shell.mkdir('-p', path.dirname(dest));
        shell.cp(src, dest);
      }
    }
  }
}

async function scaffoldApi(projectName, targetBaseDir, sourceType, repoUrl) {
  const finalProjectPath = path.join(targetBaseDir, projectName);

  if (!shell.test('-d', targetBaseDir)) {
    shell.mkdir('-p', targetBaseDir);
  }

  const selectedApiModules = await checkbox({
    message: 'Select API modules:',
    choices: constants.API_MODULES.map(m => ({ name: m, value: m })),
    pageSize: 10
  });

  const selectedCmsModules = await checkbox({
    message: 'Select CMS-API modules:',
    choices: constants.CMS_MODULES.map(m => ({ name: m, value: m })),
    pageSize: 10
  });

  console.log(`\n${c.ocean}🚀 Creating ${projectName} at ${finalProjectPath}...${c.reset}`);

  if (sourceType === 'git') {
    shell.exec(`git clone ${repoUrl} ${projectName} --quiet`, { cwd: targetBaseDir });
  } else {
    const templatePath = path.join(__dirname, 'cliRepoPath/api');
    shell.cp('-R', templatePath, path.join(targetBaseDir, projectName));
  }

  shell.rm('-rf', path.join(finalProjectPath, '.git'));
  shell.rm('-rf', path.join(finalProjectPath, 'apps/api/src/modules'));
  shell.rm('-rf', path.join(finalProjectPath, 'apps/cms-api/src/modules'));
  shell.mkdir('-p', path.join(finalProjectPath, 'apps/api/src/modules'));
  shell.mkdir('-p', path.join(finalProjectPath, 'apps/cms-api/src/modules'));

  if (shell.test('-f', path.join(finalProjectPath, 'package.json'))) {
    shell.sed('-i', /"name": ".*"/, `"name": "${projectName}"`, path.join(finalProjectPath, 'package.json'));
  }

  const copyModules = (modules, type) => {
    const subPath = type === 'api' ? 'apps/api/src/modules' : 'apps/cms-api/src/modules';
    const sourceBase = path.join(__dirname, 'cliRepoPath/api', subPath);

    modules.forEach(mod => {
      const src = path.join(sourceBase, mod);
      const dest = path.join(finalProjectPath, subPath, mod);
      if (shell.test('-d', src)) {
        shell.mkdir('-p', path.dirname(dest));
        shell.cp('-R', src, dest);
        console.log(`${c.gray}  [+] Module ${mod} added to ${type}${c.reset}`);
      }
    });
  };

  copyModules(selectedApiModules, 'api');
  copyModules(selectedCmsModules, 'cms');

  console.log(`\n${c.ocean}🔧 Wiring modules into app configuration...${c.reset}`);

  injectApiModules(finalProjectPath, selectedApiModules);
  injectCmsModules(finalProjectPath, selectedCmsModules);

  console.log(`${c.gray}  [✓] API app.module.ts updated with ${selectedApiModules.length} module(s)${c.reset}`);
  console.log(`${c.gray}  [✓] CMS app.module.ts updated with ${selectedCmsModules.length} module(s)${c.reset}`);

  console.log(`\n${c.ocean}📦 Installing dependencies...${c.reset}\n`);
  const apiPm = detectPackageManager(finalProjectPath);
  console.log(`${c.gray}  Using ${apiPm}${c.reset}`);
  const installResult = shell.exec(getInstallCmd(apiPm), { cwd: finalProjectPath });
  if (installResult.code !== 0) {
    console.error(`${c.brand}${getInstallCmd(apiPm)} failed. Fix errors above then run manually:${c.reset}`);
    console.error(`  cd ${finalProjectPath} && ${getInstallCmd(apiPm)}`);
    return finalProjectPath;
  }
  console.log(`${c.gray}  [✓] Dependencies installed${c.reset}`);

  console.log(`
${c.brand}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${c.pearl}${c.bold}  EB PEARLS API: SETUP COMPLETE
${c.brand}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
  ${c.bold}Location:${c.reset} ${finalProjectPath}
  ${c.bold}API Mods:${c.reset} ${selectedApiModules.length} installed
  ${c.bold}CMS Mods:${c.reset} ${selectedCmsModules.length} installed
  `);

  const apiDevCmd = getRunCmd(apiPm, 'start:dev');
  const runDev = await confirm({
    message: `Start dev server now? (${apiDevCmd})`,
    default: true,
  });

  if (runDev) {
    console.log(`\n${c.ocean}🚀 Starting dev server...${c.reset}\n`);
    const { execSync } = require('child_process');
    execSync(apiDevCmd, { cwd: finalProjectPath, stdio: 'inherit' });
  }

  return finalProjectPath;
}

async function scaffoldCmsFrontend(projectName, targetBaseDir) {
  const finalProjectPath = path.join(targetBaseDir, projectName);

  if (!shell.test('-d', targetBaseDir)) {
    shell.mkdir('-p', targetBaseDir);
  }

  const selectedModules = await checkbox({
    message: 'Select CMS frontend modules:',
    choices: constants.CMS_FRONTEND_MODULES.map(m => ({ name: m, value: m })),
    pageSize: 15
  });

  console.log(`\n${c.ocean}🚀 Creating ${projectName} at ${finalProjectPath}...${c.reset}`);

  const cmsTemplatePath = path.join(__dirname, 'cliRepoPath/cms');
  shell.cp('-R', cmsTemplatePath, finalProjectPath);

  shell.rm('-rf', path.join(finalProjectPath, '.git'));

  shell.rm('-rf', path.join(finalProjectPath, 'src/views'));
  shell.rm('-rf', path.join(finalProjectPath, 'src/api'));
  shell.mkdir('-p', path.join(finalProjectPath, 'src/views'));
  shell.mkdir('-p', path.join(finalProjectPath, 'src/api'));

  const routeFiles = fs.readdirSync(path.join(finalProjectPath, 'src/routes'))
    .filter(f => f !== 'index.tsx');
  for (const f of routeFiles) {
    shell.rm('-f', path.join(finalProjectPath, 'src/routes', f));
  }

  const menuFiles = fs.readdirSync(path.join(finalProjectPath, 'src/menu-items'))
    .filter(f => f !== 'index.tsx');
  for (const f of menuFiles) {
    shell.rm('-f', path.join(finalProjectPath, 'src/menu-items', f));
  }

  if (shell.test('-f', path.join(finalProjectPath, 'package.json'))) {
    shell.sed('-i', /"name": ".*"/, `"name": "${projectName}"`, path.join(finalProjectPath, 'package.json'));
  }

  console.log(`\n${c.ocean}📂 Copying selected modules...${c.reset}`);
  copyCmsFrontendModules(finalProjectPath, selectedModules);

  for (const mod of selectedModules) {
    console.log(`${c.gray}  [+] ${mod}${c.reset}`);
  }

  console.log(`\n${c.ocean}🔧 Wiring routes and menu items...${c.reset}`);
  injectCmsFrontendRoutes(finalProjectPath, selectedModules);
  injectCmsFrontendMenuItems(finalProjectPath, selectedModules);
  console.log(`${c.gray}  [✓] routes/index.tsx updated${c.reset}`);
  console.log(`${c.gray}  [✓] menu-items/index.tsx updated${c.reset}`);

  console.log(`\n${c.ocean}📦 Installing dependencies...${c.reset}\n`);
  const cmsPm = detectPackageManager(finalProjectPath);
  console.log(`${c.gray}  Using ${cmsPm}${c.reset}`);
  const installResult = shell.exec(getInstallCmd(cmsPm), { cwd: finalProjectPath });
  if (installResult.code !== 0) {
    console.error(`${c.brand}${getInstallCmd(cmsPm)} failed. Fix errors above then run manually:${c.reset}`);
    console.error(`  cd ${finalProjectPath} && ${getInstallCmd(cmsPm)}`);
    return finalProjectPath;
  }
  console.log(`${c.gray}  [✓] Dependencies installed${c.reset}`);

  console.log(`
${c.brand}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${c.pearl}${c.bold}  EB PEARLS CMS: SETUP COMPLETE
${c.brand}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
  ${c.bold}Location:${c.reset} ${finalProjectPath}
  ${c.bold}Modules:${c.reset}  ${selectedModules.length} installed
  `);

  const cmsDevCmd = getRunCmd(cmsPm, 'start');
  const runDev = await confirm({
    message: `Start dev server now? (${cmsDevCmd})`,
    default: true,
  });

  if (runDev) {
    console.log(`\n${c.ocean}🚀 Starting dev server...${c.reset}\n`);
    const { execSync } = require('child_process');
    execSync(cmsDevCmd, { cwd: finalProjectPath, stdio: 'inherit' });
  }

  return finalProjectPath;
}

async function main() {
  checkNodeVersion(process.versions.node, require('./package.json').engines.node);
  process.stdout.write('\x1Bc');
  console.log(rawBanner);

  const projectType = await select({
    message: 'What would you like to scaffold?',
    choices: [
      { name: 'API (NestJS Backend)', value: 'api' },
      { name: 'CMS (React Frontend)', value: 'cms' },
      { name: 'Both (API + CMS)', value: 'both' }
    ]
  });

  const projectName = await input({
    message: 'Project Name:',
    default: projectType === 'cms' ? 'ebp-cms' : 'ebp-api',
    transformer: (val) => val.toLowerCase().replace(/\s+/g, '-')
  });

  const installPath = await input({
    message: 'Setup Path (leave blank for current folder):',
    default: '.',
  });

  const targetBaseDir = expandPath(installPath);

  if (projectType === 'api' || projectType === 'both') {
    const sourceType = await select({
      message: 'Select API Source Type:',
      choices: [
        { name: 'Local Template', value: 'local' },
        { name: 'Git Repository', value: 'git' }
      ]
    });

    let repoUrl = '';
    if (sourceType === 'git') {
      repoUrl = await input({
        message: 'Enter Git Repository URL:',
        default: 'https://github.com/eb-pearls/nest-standard-template.git'
      });
    }

    const apiName = projectType === 'both' ? `${projectName}-api` : projectName;
    await scaffoldApi(apiName, targetBaseDir, sourceType, repoUrl);
  }

  if (projectType === 'cms' || projectType === 'both') {
    const cmsName = projectType === 'both' ? `${projectName}-cms` : projectName;
    await scaffoldCmsFrontend(cmsName, targetBaseDir);
  }
}

main().catch(err => {
  if (err.name === 'ExitPromptError') {
    console.log(`\n${c.gray}Setup cancelled.${c.reset}`);
  } else {
    console.error(err);
  }
});

module.exports = { checkNodeVersion };
