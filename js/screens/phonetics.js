const PhoneticsScreen = {
  render() {
    const el = document.getElementById("screen-phonetics");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Phonetics — coming soon</p>`;
  },
};
