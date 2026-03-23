var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var API_BASE = "https://coderoute90-api.coderoute90.workers.dev";
var SITE_URL = "https://programming.coderoute90.workers.dev";
var SITE_NAME = "CodeRoute 90";
var DEFAULT_META = {
  title: "\u8A18\u4E8B\u8A73\u7D30 - CodeRoute 90",
  description: "CodeRoute 90 - 40\u6B73\u30FB\u6587\u7CFB\u304B\u308990\u65E5\u3067\u30A8\u30F3\u30B8\u30CB\u30A2\u8EE2\u8077\u3057\u305F\u904B\u55B6\u8005\u304C\u3001\u6700\u77ED\u30EB\u30FC\u30C8\u3092\u4E8B\u5B9F\u30D9\u30FC\u30B9\u3067\u516C\u958B\u3059\u308B\u30E1\u30C7\u30A3\u30A2\u3002",
  image: SITE_URL + "/assets/images/ogp.png"
};
function stripHtml(html) {
  return (html ?? "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}
__name(stripHtml, "stripHtml");
function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
async function fetchArticle(id) {
  const res = await fetch(API_BASE + "?limit=100&orders=-publishedAt");
  if (!res.ok) {
    console.log("fetch\u5931\u6557 status:", res.status);
    return null;
  }
  const data = await res.json();
  console.log("\u53D6\u5F97\u30C7\u30FC\u30BF\u4EF6\u6570:", data.contents ? data.contents.length : 0);
  if (data && Array.isArray(data.contents)) {
    const found = data.contents.find(function(item) {
      return item && item.id === id;
    });
    console.log("\u691C\u7D22\u7D50\u679C:", found ? found.title : "null");
    return found || null;
  }
  return null;
}
__name(fetchArticle, "fetchArticle");
var TitleRewriter = class {
  static {
    __name(this, "TitleRewriter");
  }
  constructor(title) {
    this.title = title;
  }
  element(el) {
    el.setInnerContent(this.title);
  }
};
var ExistingMetaRemover = class {
  static {
    __name(this, "ExistingMetaRemover");
  }
  element(el) {
    const prop = el.getAttribute("property") ?? "";
    const name = el.getAttribute("name") ?? "";
    if (prop.startsWith("og:") || name.startsWith("twitter:") || name === "description") el.remove();
  }
};
var CanonicalRewriter = class {
  static {
    __name(this, "CanonicalRewriter");
  }
  constructor(url) {
    this.url = url;
  }
  element(el) {
    if (el.getAttribute("rel") === "canonical") el.setAttribute("href", this.url);
  }
};
var OgpInjector = class {
  static {
    __name(this, "OgpInjector");
  }
  constructor(meta, url) {
    this.meta = meta;
    this.url = url;
    this._done = false;
  }
  element(el) {
    if (this._done) return;
    this._done = true;
    const m = this.meta;
    const u = this.url;
    el.append(
      '\n<meta name="description" content="' + escapeHtml(m.description) + '">\n<meta property="og:title" content="' + escapeHtml(m.title) + '">\n<meta property="og:description" content="' + escapeHtml(m.description) + '">\n<meta property="og:image" content="' + escapeHtml(m.image) + '">\n<meta property="og:url" content="' + escapeHtml(u) + '">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="' + escapeHtml(SITE_NAME) + '">\n<meta property="og:locale" content="ja_JP">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="' + escapeHtml(m.title) + '">\n<meta name="twitter:description" content="' + escapeHtml(m.description) + '">\n<meta name="twitter:image" content="' + escapeHtml(m.image) + '">',
      { html: true }
    );
  }
};
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/post") {
      const id = url.searchParams.get("id");
      if (!id) return env.ASSETS.fetch(request);
      const assetResponse = await env.ASSETS.fetch(
        new Request(SITE_URL + "/post.html")
      );
      if (!assetResponse.ok) return assetResponse;
      const article = await fetchArticle(id);
      const meta = article ? {
        title: article.title + " - " + SITE_NAME,
        description: stripHtml(article.content).slice(0, 120),
        image: article.eyecatch && article.eyecatch.url ? article.eyecatch.url : DEFAULT_META.image
      } : DEFAULT_META;
      const canonicalUrl = SITE_URL + "/post?id=" + encodeURIComponent(id);
      return new HTMLRewriter().on("title", new TitleRewriter(meta.title)).on("meta", new ExistingMetaRemover()).on('link[rel="canonical"]', new CanonicalRewriter(canonicalUrl)).on("head", new OgpInjector(meta, canonicalUrl)).transform(assetResponse);
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
