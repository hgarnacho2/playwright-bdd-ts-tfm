const config = {
  default: {
    require: [
      'dist/tests/support/world.js',
      'dist/tests/support/hooks.js',
      'dist/tests/step_definitions/**/*.js'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    publishQuiet: true,
    dryRun: false,
    failFast: false
  }
};

module.exports = config;
