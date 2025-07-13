const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://notes-serverless-app.com",
    env: {
      viewportWidthBreakpoint: 768,
    },
    chromeWebSecurity: false,
    video: true,
  },
  projectId: "di337f",
});
