module.exports = function(eleventyConfig) {

    // Copy `css/` to `_site/css/`
    eleventyConfig.addPassthroughCopy("css");

    // Copy `js/` to `_site/js/`
    eleventyConfig.addPassthroughCopy("js");

    // Copy `images/` to `_site/images/`
    eleventyConfig.addPassthroughCopy("images");

    // Copy `favicon.png` to `_site/favicon.png`
    eleventyConfig.addPassthroughCopy("favicon.png");
    
    // You might also have other static assets like PDF, etc.
    // eleventyConfig.addPassthroughCopy("path/to/your/asset");

    return {
        dir: {
            input: ".",         // Eleventy will look for files in the current directory
            includes: "_includes", // This is where layouts and partials live
            data: "_data",      // Optional: For global data files
            output: "_site"     // This is where the compiled site will be built
        },
        templateFormats: ["html", "njk", "md"], // Add 'html' so it processes .html files
        htmlTemplateEngine: "njk", // Treat .html files as Nunjucks templates
        markdownTemplateEngine: "njk"
    };
};