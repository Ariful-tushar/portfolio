const fs = require("fs");

module.exports = function (eleventyConfig) {
  // ---- Passthrough: static assets ----
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "content/blog/images": "assets/blog" });

  // Per-project screenshots: each project is a folder —
  // content/projects/<slug>/index.md + content/projects/<slug>/images/*
  // Images ship to /assets/projects/<slug>/ (referenced by filename only in
  // front matter/body, e.g. cover: cover.png).
  const projectsRoot = "content/projects";
  if (fs.existsSync(projectsRoot)) {
    for (const slug of fs.readdirSync(projectsRoot)) {
      const imagesDir = `${projectsRoot}/${slug}/images`;
      if (fs.existsSync(imagesDir) && fs.statSync(imagesDir).isDirectory()) {
        eleventyConfig.addPassthroughCopy({ [imagesDir]: `assets/projects/${slug}` });
      }
    }
  }

  // Portrait: drop photo.png (or photo.jpg) in the project root; it ships to /assets/img/
  for (const file of ["photo.png", "photo.jpg", "photo.webp"]) {
    if (fs.existsSync(file)) {
      eleventyConfig.addPassthroughCopy({ [file]: `assets/img/${file}` });
    }
  }

  // CV / resume: drop the PDF in the project root; it ships to /assets/cv/
  for (const file of ["Md_Ariful_Islam.pdf", "cv.pdf", "resume.pdf"]) {
    if (fs.existsSync(file)) {
      eleventyConfig.addPassthroughCopy({ [file]: `assets/cv/${file}` });
    }
  }

  // Reference photos: drop them in a "references/" folder in the project root;
  // they ship to /assets/references/ (the "photo" field in each reference's
  // front matter is "references/<file>" and is rewritten in the template).
  if (fs.existsSync("references")) {
    eleventyConfig.addPassthroughCopy({ references: "assets/references" });
  }

  // Certificate images: drop them in a "certificates/" folder in the project root;
  // they ship to /assets/certificates/ (paths in certificates.json stay as
  // "certificates/<file>" and are rewritten in the template).
  if (fs.existsSync("certificates")) {
    eleventyConfig.addPassthroughCopy({ certificates: "assets/certificates" });
  }

  // ---- Watch content while running `npm start` ----
  eleventyConfig.addWatchTarget("content/");

  // ---- Collections (each is "add a file, it shows up") ----
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("content/projects/*/index.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );


  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("content/blog/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  eleventyConfig.addCollection("references", (api) =>
    api
      .getFilteredByGlob("content/references/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  // ---- Filters ----
  eleventyConfig.addFilter("readableDate", (value) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  eleventyConfig.addFilter("featured", (arr) =>
    (arr || []).filter((item) => item.data && item.data.featured)
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // True when a "phone" value looks like a dialable number (vs. a note)
  eleventyConfig.addFilter("isPhoneNumber", (s) => /^[+\d]/.test(String(s || "")));
  eleventyConfig.addFilter("telHref", (s) =>
    "tel:" + String(s || "").replace(/[^+\d]/g, "")
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "src/_includes",
      data: "src/_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
