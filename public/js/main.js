/* ===============================
   CONFIRM ACTIONS (delete etc.)
=============================== */
document.addEventListener('click', (e) => {
  const confirmEl = e.target.closest('[data-confirm]');
  if (!confirmEl) return;

  const message = confirmEl.getAttribute('data-confirm') || 'Are you sure?';
  if (!window.confirm(message)) {
    e.preventDefault();
  }
});

/* ===============================
   DROPDOWNS (Post + Profile)
=============================== */
document.addEventListener('click', function (e) {
  const profile = document.getElementById('profileDropdown');
  const profileToggle = document.getElementById('profileToggle');

  const post = document.getElementById('postDropdown');
  const postToggle = document.getElementById('postToggle');

  /* ---------- PROFILE ---------- */
  if (profile && profileToggle) {
    if (profileToggle.contains(e.target)) {
      e.stopPropagation();
      profile.classList.toggle('open');
    } else if (!profile.contains(e.target)) {
      profile.classList.remove('open');
    }
  }

  /* ---------- POST ---------- */
  if (post && postToggle) {
    if (postToggle.contains(e.target)) {
      e.stopPropagation();
      post.classList.toggle('open');
    } else if (!post.contains(e.target)) {
      post.classList.remove('open');
    }
  }
});
