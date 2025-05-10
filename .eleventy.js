module.exports = function (eleventyConfig) {
  // Passthrough the compiled CSS and any other static assets
  eleventyConfig.addPassthroughCopy({ "assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "layouts",
      data: "_data",
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
