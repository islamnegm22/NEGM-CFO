import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TrashPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  const loadTrash = () => {
    const stored =
      JSON.parse(localStorage.getItem("projects")) || [];

    const trash = stored.filter((p) => p.deleted);

    setProjects(trash);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  /* RESTORE */
  const restoreProject = (project) => {
    const stored =
      JSON.parse(localStorage.getItem("projects")) || [];

    const updated = stored.map((p) =>
      p.id === project.id
        ? { ...p, deleted: false, deletedAt: null }
        : p
    );

    localStorage.setItem("projects", JSON.stringify(updated));
    loadTrash();
  };

  /* DELETE FOREVER */
  const deleteForever = (project) => {
    const confirmDelete = window.confirm(
      "Delete forever? This cannot be undone."
    );

    if (!confirmDelete) return;

    const stored =
      JSON.parse(localStorage.getItem("projects")) || [];

    const updated = stored.filter(
      (p) => p.id !== project.id
    );

    localStorage.setItem("projects", JSON.stringify(updated));

    localStorage.removeItem(
      `transactions_${project.id}`
    );

    loadTrash();
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Trash</h2>

      <button
        onClick={() => router.push("/dashboard")}
        style={{ marginBottom: 20 }}
      >
        Back to Dashboard
      </button>

      {projects.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #eee",
            padding: 16,
            borderRadius: 12,
            marginBottom: 10
          }}
        >
          <b>{p.name}</b>

          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 10
            }}
          >
            <button
              onClick={() => restoreProject(p)}
            >
              Restore
            </button>

            <button
              onClick={() => deleteForever(p)}
              style={{ color: "red" }}
            >
              Delete Forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}