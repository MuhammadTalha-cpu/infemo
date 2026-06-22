const StoriesScreen = {
  render() {
    const el = document.getElementById("screen-stories");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Stories — coming soon</p>`;
  },
};
