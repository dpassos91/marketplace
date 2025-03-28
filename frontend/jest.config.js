module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/javaScript/**/*.test.js', '**/__tests__/**/*.test.js', '**/src/**/*.{test,spec}.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-router-dom)/)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
  
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
