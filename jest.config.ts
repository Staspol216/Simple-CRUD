export default {
    coverageProvider: "v8",
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    extensionsToTreatAsEsm: [".ts"],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
}