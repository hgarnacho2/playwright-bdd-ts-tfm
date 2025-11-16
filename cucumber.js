const config = {
  default: {
    requireModule: ['tsx'],
    require: [
      'tests/support/world.ts',
      'tests/support/hooks.ts',
      'tests/step_definitions/**/*.ts'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    dryRun: false,
    failFast: false
  }
};

module.exports = config;