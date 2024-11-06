// jest.config.ts
import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./__tests__"], // Look for tests in the "tests" folder
    moduleFileExtensions: ["ts", "js", "json", "node"],
}

export default config
