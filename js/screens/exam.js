const ExamScreen = {
  render() {
    const el = document.getElementById("screen-exam");
    if (!el) return;
    el.innerHTML = `<p style="padding:2rem;color:var(--text-primary);">Exam — coming soon</p>`;
  },
};
