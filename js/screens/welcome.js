var WelcomeScreen = {
  render() {
    const el = document.getElementById("screen-welcome");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Welcome Screen — coming soon</p>`;
  },
};
