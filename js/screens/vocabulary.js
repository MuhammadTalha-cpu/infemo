var VocabularyScreen = {
  render() {
    const el = document.getElementById("screen-vocabulary");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Vocabulary — coming soon</p>`;
  },
};
