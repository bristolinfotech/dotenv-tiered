import { pathExistsSync, pathExists } from 'fs-extra';

export interface LoadDotenvOptions {
  expand: boolean;
  suffix: string;
}

const defaultLoadDotenvOptions: LoadDotenvOptions = {
  expand: true,
  suffix: '.local',
};

export async function loadDotenv(dotenvPath: string, options: Partial<LoadDotenvOptions> = {}) {
  const mergedOptions: LoadDotenvOptions = Object.assign({}, defaultLoadDotenvOptions, options);
  const dotenvFiles = getDotenvFiles(dotenvPath, mergedOptions.suffix);
  await Promise.all(dotenvFiles.map(dotenvFile => new Promise(async (resolve) => {
    if (await pathExists(dotenvFile)) {
      const loadedEnv = require('dotenv').config({
        path: dotenvFile,
      });
      if (mergedOptions.expand) {
        require('dotenv-expand')(loadedEnv);
      }
    }
    resolve();
  })));
}

export function loadDotenvSync(dotenvPath: string, options: Partial<LoadDotenvOptions> = {}) {
  const mergedOptions: LoadDotenvOptions = Object.assign({}, defaultLoadDotenvOptions, options);
  const dotenvFiles = getDotenvFiles(dotenvPath, mergedOptions.suffix);
  dotenvFiles.forEach((dotenvFile) => {
    if (pathExistsSync(dotenvFile)) {
      const loadedEnv = require('dotenv').config({
        path: dotenvFile,
      });
      if (mergedOptions.expand) {
        require('dotenv-expand')(loadedEnv);
      }
    }
  });
}

function getDotenvFiles(dotenvPath: string, localSuffix: string): string[] {
  return [
    `${dotenvPath}.${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}${localSuffix}`,
    `${dotenvPath}.${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}`,
    `${dotenvPath}${localSuffix}`,
    dotenvPath,
  ];
}

export function getFilteredEnv(whitelist: (string | RegExp)[] = []) {
  const tests = whitelist.map((whitelistItem) => {
    let regexp;
    if (typeof whitelistItem === 'string') {
      regexp = new RegExp(whitelistItem);
    } else {
      regexp = whitelistItem;
    }
    return regexp;
  });

  return Object.keys(process.env)
  .filter((key) => {
    if (tests.length > 0) {
      for (const test of tests) {
        if (test.test(key)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  })
  .reduce(
    (env: any, key: string) => {
      env[key] = process.env[key];
      return env;
    },
    {},
  );
}

export function getStringifiedFilteredEnv(whitelist: (string | RegExp)[] = []) {
  const env = getFilteredEnv(whitelist);
  return getStringifiedEnv(env);
}

export function getStringifiedEnv(env: { [key: string]: any } | null = null) {
  const rawEnv = env ? env : process.env;
  return Object.keys(rawEnv).reduce(
    (rawEnv: any, key) => {
      rawEnv[key] = JSON.stringify(rawEnv[key]);
      return env;
    },
    {},
  );
}
