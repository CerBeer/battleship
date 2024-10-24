module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "front"],
  testMatch: ["**/?(*.)+(test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  restoreMocks: true,
  resetMocks: true,
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
