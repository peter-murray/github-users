#!/usr/bin/env node

const commander = require('commander')
  , pkgInfo = require('../package.json')
  , usersToCsv = require('../usersToCsv')
  , userProcessor = require('../index')
;

const program = new commander.Command();

program.version(pkgInfo.version)
  .requiredOption('-t --token <token>', 'GitHub Personal Access Token')
  .requiredOption('-o --organization <name>', 'GitHub Organization to get the users from')
  .option('--reset')
  ;

program.parse(process.argv);
userProcessor.run(program.token, program.organization, program.reset);