document.addEventListener('DOMContentLoaded', () => {
  const postsList = document.getElementById('posts-list');
  const postForm = document.getElementById('post-form');
  const formTitle = document.getElementById('form-title');
  const postIdInput = document.getElementById('post-id');
  const authorSelect = document.getElementById('author-select');
  const titleInput = document.getElementById('title-input');
  const categoryInput = document.getElementById('category-input');
  const contentTextarea = document.getElementById('content-textarea');
  const saveButton = document.getElementById('save-button');
  const cancelButton = document.getElementById('cancel-button');

  let users = [];
  let posts = [];
  let editMode = false;

  // Fetch users for author dropdown
  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      users = await res.json();
      authorSelect.innerHTML = users
        .map(
          (user) =>
            `<option value="${user.id}">${escapeHtml(user.name)}</option>`
        )
        .join('');
    } catch (error) {
      alert('Hiba történt a szerzők betöltésekor.');
    }
  }

  // Escape to prevent XSS
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Fetch posts and render
  async function loadPosts() {
    try {
      const res = await fetch('/api/posts');
      posts = await res.json();
      renderPosts();
    } catch (error) {
      alert('Hiba történt a blog bejegyzések betöltésekor.');
    }
  }

  // Render posts list
  function renderPosts() {
    if (posts.length === 0) {
      postsList.innerHTML = '<p>Nincsenek blog bejegyzések.</p>';
      return;
    }
    postsList.innerHTML = posts
      .map((post) => {
        return `
        <div class="post-card" data-id="${post.id}">
          <div class="post-header">
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <span class="post-category">${escapeHtml(post.category)}</span>
          </div>
          <div class="post-meta">
            <div>Szerző: ${escapeHtml(post.author)}</div>
            <div>Készült: ${new Date(post.created_at).toLocaleString()}</div>
            <div>Utolsó módosítás: ${new Date(post.updated_at).toLocaleString()}</div>
          </div>
          <p class="post-content">${escapeHtml(post.content)}</p>
          <div class="post-actions">
            <button class="edit-btn" title="Szerkesztés">✏️</button>
            <button class="delete-btn" title="Törlés">🗑️</button>
          </div>
        </div>
      `;
      })
      .join('');

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', onEditClick);
    });
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', onDeleteClick);
    });
  }

  // Handle edit button click
  function onEditClick(e) {
    const postId = e.target.closest('.post-card').dataset.id;
    const post = posts.find((p) => p.id == postId);
    if (!post) return alert('Nem található a bejegyzés.');

    // Populate form with post data
    postIdInput.value = post.id;
    authorSelect.value = post.author_id || users.find((u) => u.name === post.author)?.id || '';
    titleInput.value = post.title;
    categoryInput.value = post.category;
    contentTextarea.value = post.content;

    editMode = true;
    formTitle.textContent = 'Blog Bejegyzés Szerkesztése';
    saveButton.textContent = 'Frissítés';
    cancelButton.classList.remove('hidden');
  }

  // Handle delete button click
  async function onDeleteClick(e) {
    if (!confirm('Biztosan törölni szeretnéd a bejegyzést?')) return;

    const postId = e.target.closest('.post-card').dataset.id;

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadPosts();
        // If currently editing this post, reset form
        if (postIdInput.value === postId) resetForm();
      } else {
        alert('A törlés sikertelen volt.');
      }
    } catch (error) {
      alert('Hiba történt a törlés során.');
    }
  }

  // Reset form to initial state
  function resetForm() {
    postIdInput.value = '';
    authorSelect.value = users.length ? users[0].id : '';
    titleInput.value = '';
    categoryInput.value = '';
    contentTextarea.value = '';

    editMode = false;
    formTitle.textContent = 'Új Blog Bejegyzés Létrehozása';
    saveButton.textContent = 'Mentés';
    cancelButton.classList.add('hidden');
  }

  // Handle form submission for create or update
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = postIdInput.value;
    const author_id = authorSelect.value;
    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const content = contentTextarea.value.trim();

    if (!author_id || !title || !category || !content) {
      return alert('Kérlek tölts ki minden mezőt.');
    }

    const payload = { author_id, title, category, content };

    try {
      if (editMode) {
        // Update
        const res = await fetch(`/api/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          return alert(`Hiba: ${err.error || 'Ismeretlen hiba'}`);
        }
      } else {
        // Create
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          return alert(`Hiba: ${err.error || 'Ismeretlen hiba'}`);
        }
      }

      await loadPosts();
      resetForm();
    } catch (error) {
      alert('Hiba történt a mentés során.');
    }
  });

  // Cancel button resets form
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm();
  });

  // Initialize on page load
  (async () => {
    await loadUsers();
    await loadPosts();
    resetForm();
  })();
});
