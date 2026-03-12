if (!window.__pagecontext_extractPage) {
  const NOISE_SELECTOR = "script, style, link[rel='stylesheet'], iframe, noscript, svg";

  window.__pagecontext_stripNoise = (el) => {
    el.querySelectorAll(NOISE_SELECTOR).forEach((n) => n.remove());
    return el;
  };

  window.__pagecontext_extractArticle = () => {
    const article = new Readability(document.cloneNode(true)).parse();
    if (!article) return null;
    const parts = [`# ${article.title}`];
    if (article.byline) parts.push(`*${article.byline}*`);
    parts.push(article.textContent.trim());
    return parts.join("\n\n");
  };

  window.__pagecontext_extractPage = () => {
    const clone = document.documentElement.cloneNode(true);
    window.__pagecontext_stripNoise(clone);
    return clone.outerHTML;
  };
}
