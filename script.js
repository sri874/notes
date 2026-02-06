document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesGrid = document.getElementById('notesGrid');
    const searchInput = document.getElementById('searchInput');

    // Modal elements
    const editModal = document.getElementById('editModal');
    const editTitle = document.getElementById('editTitle');
    const editContent = document.getElementById('editContent');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const closeModal = document.querySelector('.close-modal');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentEditId = null;

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function renderNotes(filter = '') {
        notesGrid.innerHTML = '';
        
        let filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(filter.toLowerCase()) || 
            note.content.toLowerCase().includes(filter.toLowerCase())
        );

        // Sort: Pinned first, then by date (newest first)
        filteredNotes.sort((a, b) => {
            if (a.pinned === b.pinned) return b.id - a.id;
            return a.pinned ? -1 : 1;
        });

        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = `note-card ${note.pinned ? 'pinned' : ''}`;
            noteCard.innerHTML = `
                <span class="pin-indicator" onclick="togglePin(${note.id})">📌</span>
                <h3>${note.title || 'Untitled'}</h3>
                <p>${note.content}</p>
                <div class="note-card-actions">
                    <button class="action-btn" onclick="openEditModal(${note.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            `;
            notesGrid.appendChild(noteCard);
        });
    }

    function addNote() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (content === '') return;

        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            pinned: false,
            date: new Date().toISOString()
        };

        notes.push(newNote);
        saveNotes();
        renderNotes();

        noteTitle.value = '';
        noteContent.value = '';
    }

    window.deleteNote = (id) => {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes(searchInput.value);
    };

    window.togglePin = (id) => {
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            notes[index].pinned = !notes[index].pinned;
            saveNotes();
            renderNotes(searchInput.value);
        }
    };

    window.openEditModal = (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            currentEditId = id;
            editTitle.value = note.title;
            editContent.value = note.content;
            editModal.style.display = 'block';
        }
    };

    saveEditBtn.onclick = () => {
        const index = notes.findIndex(n => n.id === currentEditId);
        if (index !== -1) {
            notes[index].title = editTitle.value;
            notes[index].content = editContent.value;
            saveNotes();
            renderNotes(searchInput.value);
            closeModalFunc();
        }
    };

    function closeModalFunc() {
        editModal.style.display = 'none';
        currentEditId = null;
    }

    closeModal.onclick = closeModalFunc;
    window.onclick = (event) => {
        if (event.target === editModal) closeModalFunc();
    };

    addNoteBtn.addEventListener('click', addNote);

    searchInput.addEventListener('input', (e) => {
        renderNotes(e.target.value);
    });

    // Initial render
    renderNotes();
});
