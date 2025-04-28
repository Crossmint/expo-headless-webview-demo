const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// dev: see https://docs.expo.dev/guides/monorepos/

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  // 1. Watch all files within the monorepo
  watchFolders: [monorepoRoot],
  resolver: {
    ...config.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, "node_modules"),
      path.resolve(monorepoRoot, "node_modules"),
    ],
  },
};
