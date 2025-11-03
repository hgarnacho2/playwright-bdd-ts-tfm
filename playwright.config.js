"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './tests',
    timeout: 30000,
    workers: 4,
    fullyParallel: true,
    expect: {
        timeout: 5000
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...test_1.devices['Desktop Chrome'],
                headless: process.env.HEADLESS !== 'false',
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
            },
        },
        {
            name: 'firefox',
            use: {
                ...test_1.devices['Desktop Firefox'],
                headless: process.env.HEADLESS !== 'false',
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
            },
        },
        {
            name: 'webkit',
            use: {
                ...test_1.devices['Desktop Safari'],
                headless: process.env.HEADLESS !== 'false',
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
            },
        },
    ],
    reporter: [
        ['html', { outputFolder: 'reports/playwright-report' }],
        ['json', { outputFile: 'reports/results.json' }],
        ['list']
    ],
    use: {
        baseURL: 'file://' + process.cwd(),
        trace: 'on-first-retry',
        actionTimeout: 0,
        navigationTimeout: 30000,
    },
    outputDir: 'reports/test-results/',
});
//# sourceMappingURL=playwright.config.js.map