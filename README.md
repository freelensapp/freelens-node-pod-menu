# @freelensapp/freelens-node-pod-menu

<!-- markdownlint-disable MD013 -->

[![Home](https://img.shields.io/badge/%F0%9F%8F%A0-freelens.app-02a7a0)](https://freelens.app)
[![GitHub](https://img.shields.io/github/stars/freelensapp/freelens?style=flat&label=GitHub%20%E2%AD%90)](https://github.com/freelensapp/freelens)
[![release](https://img.shields.io/github/v/release/freelensapp/freelens-node-pod-menu?display_name=tag&sort=semver)](https://github.com/freelensapp/freelens-node-pod-menu)
[![Integration tests](https://github.com/freelensapp/freelens-node-pod-menu/actions/workflows/integration-tests.yaml/badge.svg?branch=main)](https://github.com/freelensapp/freelens-node-pod-menu/actions/workflows/integration-tests.yaml)
[![npm](https://img.shields.io/npm/v/@freelensapp/freelens-node-pod-menu.svg)](https://www.npmjs.com/package/@freelensapp/freelens-node-pod-menu)

<!-- markdownlint-enable MD013 -->

**Warning! This extension is deprecated.**

This Freelens extension added back the node and pod menu functionality.

Currently this is an empty package that does not provide any functionlity.

## How to build this extension locally

Use [NVM](https://github.com/nvm-sh/nvm) or
[mise-en-place](https://mise.jdx.dev/) to install required Node.js version.

From the root of this repository:

```sh
nvm install
# or
mise install

npm ci
npm run build
npm pack
```

The tarball for the extension will be placed in the current directory. In
Freelens, navigate to the Extensions list and provide the path to the tarball
to be loaded, or drag and drop the extension tarball into the Freelens
window. After loading for a moment, the extension should appear in the list
of enabled extensions.

## License

This repository is a fork of
[openlens-node-pod-menu](https://github.com/alebcay/openlens-node-pod-menu),
with the aim of carrying forward a version of it for
[Freelens](https://github.com/freelensapp/freelens).

Copyright (c) 2024-2025 Freelens Authors.

Copyright (c) 2022 OpenLens Authors.

[MIT License](https://opensource.org/licenses/MIT)
