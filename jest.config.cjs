module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react|@lottiefiles).+\\.js$'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
