const LevelsScreen = {
  render() {
    const el = document.getElementById("screen-levels");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Levels — coming soon</p>`;
  },
};
