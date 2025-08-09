/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/API/**/*.test.js'],
  reporters: [
    'default',
    // JUnit XML for CI
    ['jest-junit', { outputDirectory: 'reports/api', outputName: 'junit.xml' }],
    // Pretty HTML report
    ['jest-html-reporter', {
      outputPath: 'reports/api/index.html',
      pageTitle: 'API Test Report',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ]
};
