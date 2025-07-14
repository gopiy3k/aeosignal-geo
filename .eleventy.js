// .eleventy.js

module.exports = function(eleventyConfig) {

    // --- Passthrough Copies (Copy files directly to output) ---
    // ✅ 6. Performance & Technical Health (Image optimization)
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("favicon.png");
    // Ensure all image subdirectories are copied (e.g., 'images/hero/', 'images/placeholders/')
    eleventyConfig.addPassthroughCopy("images/**/*");
    eleventyConfig.addPassthroughCopy("robots.txt");



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
    // ✅ 4. SEO Essentials (Canonical, OpenGraph)
    eleventyConfig.addNunjucksFilter("absoluteUrl", function(url, base) {
        if (!base || typeof base !== 'string') {
            console.warn("absoluteUrl filter: 'base' URL is missing or invalid. Returning original URL.");
            return url;
        }
        try {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            return (new URL(url, base)).toString();
        } catch (e) {
            console.error(`absoluteUrl filter: Error processing URL '${url}' with base '${base}':`, e);
            return url;
        }
    });

    // Add the Nunjucks `range` filter (THIS IS THE NEW ADDITION)
    eleventyConfig.addNunjucksFilter("range", (start, end) => {
        if (end === undefined) {
            end = start;
            start = 0;
        }
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    });


    // --- Eleventy Collections ---
    // Define your 'posts' collection for blog articles
    // ✅ 3. Article Listing (Auto-pull articles)
    eleventyConfig.addCollection("posts", function(collection) {
        // Assuming your blog posts are in a 'blog' subfolder, e.g., 'blog/my-first-post.md'
        // Adjust the glob pattern to match where your actual blog post Markdown files are
        return collection.getFilteredByGlob("./blog/*.md");
    });


    // --- Directory and Template Configuration ---
    return {
        dir: {
            input: ".",
            includes: "_includes",
            data: "_data",
            output: "_site"
        },
        templateFormats: ["html", "njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};