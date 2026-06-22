var LessonScreen = {
  render() {
    const el = document.getElementById("screen-lesson");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Lesson — coming soon</p>`;
  },
};
