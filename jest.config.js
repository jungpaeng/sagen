module.exports = {
  testRegex: 'test.(js|ts|tsx)$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text', 'text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', 'tests/**/*.{js,ts,tsx}'],
};
