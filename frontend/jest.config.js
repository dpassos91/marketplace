export const testEnvironment = 'node';
export const testMatch = ['**/javaScript/**/*.test.js'];
export const transform = {
  '^.+\\.jsx?$': 'babel-jest',
};
export const transformIgnorePatterns = ['/node_modules/'];
