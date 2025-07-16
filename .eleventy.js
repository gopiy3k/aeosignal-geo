const { execSync } = require("child_process");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

    // --- Passthrough Copies ---
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("favicon.png");
    eleventyConfig.addPassthroughCopy("images/**/*");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addFilter("date", function(dateObj, format = "DDD") {
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
});// Split filter for Nunjucks (needed for schema breadcrumb)
eleventyConfig.addNunjucksFilter("split", function(str, separator) {
    if (!str || typeof str !== "string") return [];
    return str.split(separator);
    });

    // --- Custom Nunjucks Filters ---
    eleventyConfig.addNunjucksFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });

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

    // Git last modified date filter
    eleventyConfig.addFilter("gitLastModified", function(filepath) {
        try {
            const stdout = execSync(`git log -1 --format="%ad" -- "${filepath}"`, {
                encoding: "utf-8"
            }).trim();
            return new Date(stdout).toISOString().slice(0, 10);
        } catch (error) {
            console.error(`Error getting git log for ${filepath}:`, error);
            return "";
        }
    });

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

    // --- Collections ---
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("./blog/*.md");
    });

    // --- Directory and Template Config ---
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
