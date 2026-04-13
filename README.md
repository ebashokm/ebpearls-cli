# EB Pearls CLI (`ebp`)

Scaffold NestJS API and React CMS projects with a single interactive command.

## Requirements

- Node.js >= 18

## Installation

Pick any package manager:

```sh
npm install -g @ebpearls/cli
```

```sh
bun add -g @ebpearls/cli
```

```sh
pnpm add -g @ebpearls/cli
```

```sh
yarn global add @ebpearls/cli
```

Or use the one-liner shell script (no package manager selection needed):

```sh
curl -fsSL https://raw.githubusercontent.com/ebashokm/ebpearls-cli/refs/heads/main/install.sh | sh
```

## Quick Start

```sh
ebp
```

The CLI will prompt you to choose what to scaffold:

- **API (NestJS Backend)** — generates a NestJS API project with selectable modules
- **CMS (React Frontend)** — generates a React CMS project with selectable modules
- **Both (API + CMS)** — scaffolds both projects in one run

Follow the interactive prompts to set a project name, install path, and select the modules you need.

## Publishing (for maintainers)

1. Bump the version in `package.json` (follow semver: `1.0.0` → `1.1.0` etc.)
2. Run `npm publish` — this will execute `npm pack --dry-run` first as a pre-publish check, then push to the registry
3. Verify the new version is live at https://www.npmjs.com/package/@ebpearls/cli
