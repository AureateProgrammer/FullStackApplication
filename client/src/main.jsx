import React from "react";
import { createRoot } from "react-dom/client";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const completedCount = tasks.filter((task) => task.completed).length;

  async function request(path, options) {
    const response = await fetch(`${apiUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Request failed");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadTasks() {
    try {
      setError("");
      const data = await request("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      const task = await request("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: nextTitle })
      });
      setTasks((current) => [task, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    try {
      setError("");
      const updated = await request(`/api/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed })
      });
      setTasks((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      setError("");
      await request(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Simple MERN</p>
            <h1>Tasks</h1>
          </div>
          <div className="stats" aria-label="Task completion">
            <span>{completedCount}</span>
            <small>done of {tasks.length}</small>
          </div>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <input
            aria-label="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task"
            maxLength={120}
          />
          <button type="submit" disabled={saving || !title.trim()}>
            {saving ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
            <span>Add</span>
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <section className="task-list" aria-live="polite">
          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={28} />
              <p>Loading tasks</p>
            </div>
          ) : tasks.length ? (
            tasks.map((task) => (
              <article className="task-item" key={task._id}>
                <button
                  className={`check-button ${task.completed ? "checked" : ""}`}
                  onClick={() => toggleTask(task)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  type="button"
                >
                  {task.completed && <Check size={18} />}
                </button>
                <p className={task.completed ? "completed" : ""}>{task.title}</p>
                <button
                  className="icon-button"
                  onClick={() => deleteTask(task._id)}
                  aria-label="Delete task"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks yet</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
