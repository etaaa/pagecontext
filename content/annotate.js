if (!window.__pagecontext_active) {
  window.__pagecontext_active = true;

  let hovered = null;
  const selected = new Set();

  const HOVER_OUTLINE = "2px dashed #2563eb";
  const SELECTED_OUTLINE = "2px solid #2563eb";
  const SELECTED_BG = "rgba(37, 99, 235, 0.08)";

  const onMouseOver = (e) => {
    if (selected.has(e.target)) return;
    if (hovered) hovered.style.outline = "";
    hovered = e.target;
    hovered.style.outline = HOVER_OUTLINE;
  };

  const onMouseOut = (e) => {
    if (hovered && !selected.has(hovered)) {
      hovered.style.outline = "";
    }
    hovered = null;
  };

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target;

    if (selected.has(el)) {
      selected.delete(el);
      el.style.outline = "";
      el.style.backgroundColor = "";
    } else {
      selected.add(el);
      el.style.outline = SELECTED_OUTLINE;
      el.style.backgroundColor = SELECTED_BG;
    }
  };

  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mouseout", onMouseOut, true);
  document.addEventListener("click", onClick, true);

  window.__pagecontext_getSelected = () => {
    if (selected.size === 0) return null;
    const parts = [];
    for (const el of selected) {
      const clone = el.cloneNode(true);
      clone.querySelectorAll("script, style, iframe, noscript, svg").forEach((n) => n.remove());
      parts.push(clone.outerHTML);
    }
    return parts.join("\n\n");
  };

  window.__pagecontext_clearSelected = () => {
    for (const el of selected) {
      el.style.outline = "";
      el.style.backgroundColor = "";
    }
    selected.clear();
  };

  window.__pagecontext_disable = () => {
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("mouseout", onMouseOut, true);
    document.removeEventListener("click", onClick, true);
    if (hovered) hovered.style.outline = "";
    window.__pagecontext_clearSelected();
    window.__pagecontext_active = false;
    window.__pagecontext_disable = null;
    window.__pagecontext_getSelected = null;
    window.__pagecontext_clearSelected = null;
  };
}
