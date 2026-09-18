import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "http://localhost:5000/api/notes";

function App() {
  // State orchestration
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notes on initial component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please verify your backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Controlled Submission Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const response = await axios.post(API_URL, { title, content });
      // Prepend the new note to retain chronologically descending order
      setNotes((prevNotes) => [response.data, ...prevNotes]);
      // Clear inputs
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating note:", err);
      alert("Could not save the note. Try again.");
    }
  };

  // Handle Interactive Deletion with immediate local state reconciliation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Synchronize local state instantly
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Could not complete note deletion.");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Student Notes Micro-App</h1>
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="notes-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Note Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cloud Architecture Design Patterns"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study notes here..."
              required
              rows="4"
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-btn">
            Add Note
          </button>
        </form>
      </section>

      <main className="notes-section">
        <h2>Saved Notes Log</h2>

        {loading ? (
          <div className="loading-container">
            <p className="loading-text">
              📥 Fetching notes from database, please wait...
            </p>
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>💡 No notes yet — add one above!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-card-content">
                  <h3 className="note-card-title">{note.title}</h3>
                  <p className="note-card-body">{note.content}</p>
                </div>
                <div className="note-card-footer">
                  <span className="note-date">
                    📅 {new Date(note.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
