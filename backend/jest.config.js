module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', 'smoke\\.test\\.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@scure|@otplib|otplib)/)',
  ],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/database.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testTimeout: 15000,
  verbose: true,
};
