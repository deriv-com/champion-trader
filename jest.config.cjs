module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react|@lottiefiles).+\\.js$'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
