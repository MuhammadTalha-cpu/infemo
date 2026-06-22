var FlashcardsScreen = {
  render() {
    const el = document.getElementById("screen-flashcards");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Flashcards — coming soon</p>`;
  },
};
