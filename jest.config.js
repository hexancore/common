/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  "runner": "groups",
  "moduleFileExtensions": ["js", "json", "ts"],
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "moduleNameMapper": {
    "^@$": "<rootDir>/src",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/helper/(.*)$": "<rootDir>/test/helper/$1"
  },
  "testMatch": ["<rootDir>/test/unit/**/*.test.ts", "<rootDir>/test/integration/**/*.test.ts"],
  "setupFilesAfterEnv": ["<rootDir>/test/config.ts"],
  "coverageDirectory": "./test/coverage",
  "testEnvironment": "node"
};