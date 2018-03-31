dotenv-tiered
=============

> loads a tiered dotenv setup based on current node environment

Overview
--------

This package works with a tiered `.env` file project setup (similar to create-react-app)

Example `.env` structure

```js
.env                     // checked into vcs
.env.local               // ignored from vcs

.env.development         // checked into vcs
.env.development.local   // ignored from vcs

.env.production          // checked into vcs
.env.production.local    // checked into vcs

.env.test                // checked into vcs
.env.test.local          // checked into vcs
```

The `.env` files will load in the following order

1. `.env.{NODE_ENV}.local`
2. `.env.{NODE_ENV}`
3. `.env.local`
4. `.env`

The dotenv files will only load if they exist (so you only need to create the variations you need)

This package uses [dotenv](https://github.com/motdotla/dotenv) and [dotenv-expand](https://github.com/motdotla/dotenv-expand) behind the scenes.

Installation
------------

```
yarn add @bristolinfotech/dotenv-tiered
```

Basic Usage
-----------

To load `.env` without configuration, add the following as early as possible:

```js
// for es modules
import '@bristolinfotech/dotenv-tiered/esm/load';

// for commonjs
require('@bristolinfotech/dotenv-tiered/cjs/load');
```

Example programmatic usage:

```js
import {
  loadDotenv,
  loadDotenvSync,
  getFilteredEnv,
  getStringifiedEnv,
  getStringifiedFilteredEnv,
} from '@bristolinfotech/dotenv-tiered';

// load dotenv files sync
loadDotenvSync(
  '.env', // the path to your base .env file e.g. ./some-folder/.env
  {
    expand: true, // enable/disable dotenv-expand
    suffix: '.local', // the suffix to use for local non vcs .env files
  }
);

// load dotenv files async
loadDotenv(); // same args as sync, returns a promise

// get all env variables starting with FOO_, BAR_ or BAZ_
const filteredEnv = getFilteredEnv([
  /^FOO_/i,
  /^BAR_/i,
  /^BAZ_/i,
]);

// stringify env variables ready for systems like webpack DefinePlugin
const stringifiedEnv = getStringifiedEnv(filteredEnv); // can pass env here, defaults to process.env

// get stringified env starting with FOO_, BAR_ or BAZ_
const filteredStringifiedEnv = getStringifiedFilteredEnv([
  /^FOO_/i,
  /^BAR_/i,
  /^BAZ_/i,
]);
```
