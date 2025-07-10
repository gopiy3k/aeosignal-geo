// .eleventy.js

module.exports = function(eleventyConfig) {

    // --- Passthrough Copies (Copy files directly to output) ---
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("favicon.png");
    // Add any other static assets you need to copy
    // eleventyConfig.addPassthroughCopy("path/to/your/asset");


    // --- Custom Nunjucks Filters ---

    // Limit filter for arrays (e.g., collections.posts | limit(5))
    eleventyConfig.addNunjucksFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });

    // Truncate filter for text (e.g., post.content | truncate(150, true, '...'))
    eleventyConfig.addNunjucksFilter("truncate", function(text, limit, useWordBoundary, ellipsis) {
        if (!text || typeof text !== 'string') return '';
        if (text.length <= limit) return text;

        const _ellipsis = ellipsis || '...';
        const _useWordBoundary = typeof useWordBoundary === 'boolean' ? useWordBoundary : true;

        if (_useWordBoundary) {
            const truncatedText = text.slice(0, limit);
            const lastSpace = truncatedText.lastIndexOf(' ');
            if (lastSpace > -1) {
                return truncatedText.slice(0, lastSpace) + _ellipsis;
            }
        }
        return text.slice(0, limit) + _ellipsis;
    });

    // absoluteUrl filter for making relative URLs absolute (for canonical, OG, etc.)
    eleventyConfig.addNunjucksFilter("absoluteUrl", function(url, base) {
        // Ensure base is provided and is a string for the URL constructor
        if (!base || typeof base !== 'string') {
            console.warn("absoluteUrl filter: 'base' URL is missing or invalid.");
            return url; // Return original URL if base is not provided/invalid
        }
        try {
            // Handle cases where `url` might already be absolute or just a path
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url; // Already an absolute URL
            }
            return (new URL(url, base)).toString();
        } catch (e) {
            console.error(`absoluteUrl filter: Error processing URL '${url}' with base '${base}':`, e);
            return url; // Fallback to original URL on error
        }
    });

    // --- End Custom Nunjucks Filters ---


    // --- Directory and Template Configuration ---
    return {
        dir: {
            input: ".",         // Eleventy will look for files in the current directory
            includes: "_includes", // This is where layouts and partials live
            data: "_data",      // Optional: For global data files
            output: "_site"     // This is where the compiled site will be built
        },
        templateFormats: ["html", "njk", "md"], // Ensure .html files are processed
        htmlTemplateEngine: "njk", // Treat .html files as Nunjucks templates
        markdownTemplateEngine: "njk" // Process markdown using Nunjucks for front matter, etc.
        // You can add other template engine options here if needed
    };
};