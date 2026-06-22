var ProgressScreen = {
  render() {
    const el = document.getElementById("screen-progress");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Progress — coming soon</p>`;
  },
};
