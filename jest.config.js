module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['./src/**/*.(t|j)s'],
    coveragePathIgnorePatterns: ['dist', `\.(?:index)\.ts$`, 'e2e'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
}
