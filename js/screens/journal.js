const JournalScreen = {
  render() {
    const el = document.getElementById("screen-journal");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Journal — coming soon</p>`;
  },
};
