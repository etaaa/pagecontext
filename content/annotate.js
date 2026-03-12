if (!window.__pagecontext_active) {
  window.__pagecontext_active = true;

  let hovered = null;
  const selected = new Set();

  // Inject styles once
  const style = document.createElement("style");
  style.id = "pagecontext-styles";
  style.textContent = `
    .pagecontext-hover { outline: 2px dashed #8faa83 !important; }
    .pagecontext-selected {
      outline: 2px solid #8faa83 !important;
      background-color: rgba(143, 170, 131, 0.08) !important;
    }
  `;
  document.head.appendChild(style);

  const onMouseOver = (e) => {
    if (e.target === hovered || selected.has(e.target)) return;
    if (hovered) hovered.classList.remove("pagecontext-hover");
    hovered = e.target;
    hovered.classList.add("pagecontext-hover");
  };

  const onMouseOut = () => {
    if (hovered && !selected.has(hovered)) {
      hovered.classList.remove("pagecontext-hover");
    }
    hovered = null;
  };

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    if (selected.has(el)) {
      selected.delete(el);
      el.classList.remove("pagecontext-selected");
    } else {
      selected.add(el);
      el.classList.remove("pagecontext-hover");
      el.classList.add("pagecontext-selected");
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
      clone.querySelectorAll("script, style, link[rel='stylesheet'], iframe, noscript, svg").forEach((n) => n.remove());
      parts.push(clone.outerHTML);
    }
    return parts.join("\n\n");
  };

  window.__pagecontext_clearSelected = () => {
    for (const el of selected) {
      el.classList.remove("pagecontext-selected");
    }
    selected.clear();
  };

  window.__pagecontext_disable = () => {
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("mouseout", onMouseOut, true);
    document.removeEventListener("click", onClick, true);
    document.querySelectorAll(".pagecontext-hover").forEach((el) => el.classList.remove("pagecontext-hover"));
    window.__pagecontext_clearSelected();
    style.remove();
    window.__pagecontext_active = false;
    window.__pagecontext_disable = null;
    window.__pagecontext_getSelected = null;
    window.__pagecontext_clearSelected = null;
  };
}
