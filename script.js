/* script.js
   - Edit the `notesData` below to add/remove notes.
   - Each item should have: title, file (relative path under /pdfs/...), and optional description.
*/

const notesData = {
  sem1: [
    { title: "dbms", file: "dbms_notes.pdf", desc: "Basics of C and program structure." }
  ],
  sem2: [
    { title: "dsa", file: "dsa_notes.pdf", desc: "Arrays, linked lists, trees." }
  ],
  sem3: [
    { title: "Data science", file: "data_science_notes.pdf", desc: "Processes, scheduling, memory." }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // inject year
  document.getElementById("year").textContent = new Date().getFullYear();

  // render each semester list
  renderList("sem1", "sem1-list", notesData.sem1);
  renderList("sem2", "sem2-list", notesData.sem2);
  renderList("sem3", "sem3-list", notesData.sem3);

  // attach search handlers
  setupSearch("search-sem1", "sem1-list", notesData.sem1);
  setupSearch("search-sem2", "sem2-list", notesData.sem2);
  setupSearch("search-sem3", "sem3-list", notesData.sem3);

  // modal controls
  const modal = document.getElementById("pdf-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close");

  closeBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });
});

function renderList(semKey, containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<p>No notes added yet.</p>";
    return;
  }
  list.forEach(item => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.innerHTML = `
      <div>
        <div class="note-title">${escapeHtml(item.title)}</div>
        <div class="note-desc">${escapeHtml(item.desc || "")}</div>
      </div>
      <div style="margin-top:auto;display:flex;gap:8px;">
        <button class="btn btn-primary small" data-file="${encodeURIComponent(item.file)}" aria-label="Preview ${escapeHtml(item.title)}">Preview</button>
        <a class="btn btn-ghost small" href="${item.file}" target="_blank" rel="noopener" download>Download</a>
      </div>
    `;
    // preview button handler
    card.querySelector(".btn-primary").addEventListener("click", (e) => {
      const file = decodeURIComponent(e.currentTarget.getAttribute("data-file"));
      openPdfPreview(file);
    });
    container.appendChild(card);
  });
}

function setupSearch(inputId, containerId, originalList) {
  const input = document.getElementById(inputId);
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const filtered = originalList.filter(it => (it.title + " " + (it.desc||"")).toLowerCase().includes(q));
    renderList(null, containerId, filtered);
  });
}

/* Modal: show pdf in iframe */
function openPdfPreview(filePath) {
  const modal = document.getElementById("pdf-modal");
  const frame = document.getElementById("pdf-frame");
  const downloadLink = document.getElementById("modal-download");

  // set src; add #toolbar=0 to hide toolbars in some viewers if desired
  frame.src = filePath;
  downloadLink.href = filePath;
  downloadLink.setAttribute("download", "");

  modal.setAttribute("aria-hidden", "false");
  // focus for accessibility
  modal.querySelector(".close-btn").focus();
}

function closeModal() {
  const modal = document.getElementById("pdf-modal");
  const frame = document.getElementById("pdf-frame");
  modal.setAttribute("aria-hidden", "true");
  // clear src to stop loading/playing
  frame.src = "";
}

/* minimal helper to avoid XSS when injecting titles/descriptions */
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function (m) {
    return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[m];
  });
}
