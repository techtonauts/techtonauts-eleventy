const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = function (eleventyConfig) {
  // Watch CSS source files for changes during development
  eleventyConfig.addWatchTarget("./src/assets/css");

  // Watch JS source files for changes
  eleventyConfig.addWatchTarget("./src/assets/js/");

  // Copy asset directories
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  // eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });

  // Process Tailwind CSS before Eleventy build
  eleventyConfig.on("eleventy.before", async () => {
    // Create directory structure if it doesn't exist
    const cssDir = path.join("_site", "assets", "css");
    const jsDir = path.join("_site", "assets", "js");

    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }

    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Build CSS with @tailwindcss/cli
    console.log("Processing Tailwind CSS...");
    try {
      // For development: standard build
      if (process.env.ELEVENTY_ENV === "development") {
        execSync(
          "npx @tailwindcss/cli -i src/assets/css/style.css -o _site/assets/css/style.css",
          {
            stdio: "inherit",
          }
        );
      }
      // For production: minify CSS output
      else if (process.env.ELEVENTY_ENV === "production") {
        execSync(
          "npx @tailwindcss/cli -i src/assets/css/style.css -o _site/assets/css/style.css --minify",
          {
            stdio: "inherit",
          }
        );
        console.log("CSS minified for production");
      }
    } catch (error) {
      console.error("Error processing Tailwind CSS:", error);
    }

    // Build JS with esbuild
    console.log("Building JavaScript...");
    try {
      const esbuildCmd =
        process.env.ELEVENTY_ENV === "production"
          ? "npx esbuild src/assets/js/main.js --bundle --minify --outfile=_site/assets/js/main.js"
          : "npx esbuild src/assets/js/main.js --bundle --outfile=_site/assets/js/main.js";

      execSync(esbuildCmd, { stdio: "inherit" });
    } catch (error) {
      console.error("Error building JavaScript:", error);
    }
  });

  // Add shortcodes, filters, transforms here
  // Example: Add a date formatting filter
  eleventyConfig.addFilter("formatDate", function (dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // BrowserSync Settings
  eleventyConfig.setBrowserSyncConfig({
    files: ["_site/assets/css/**/*.css", "_site/assets/js/**/*.js"],
    open: true,
    ui: false,
    ghostMode: false,
  });

  // Return Eleventy configuration object
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    cleanOutput: true,
  };
};
