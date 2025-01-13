module.exports = {
    gridUrl: 'local',
    baseUrl: 'http://localhost',
    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,
    sets: {
        desktop: {
            files: [
                'testplane-tests/**/*.testplane.(t|j)s'
            ],
            browsers: [
                'chrome',
                'firefox'
            ]
        }
    },
    browsers: {
        chrome: {
            headless: true,
            desiredCapabilities: {
                browserName: 'chrome'
            }
        },
        firefox: {
            headless: true,
            desiredCapabilities: {
                browserName: 'firefox'
            }
        }
    }
};
