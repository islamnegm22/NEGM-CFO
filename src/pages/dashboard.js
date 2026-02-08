import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getProjects,
  createProject,
  softDeleteProject,
  formatCurrency,
  formatDate
} from "../lib/storage";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  function load() {
    const list = getProjects().sort(
      (a, b) => (b.lastActivity || 0) - (a.lastActivity || 0)
    );
    setProjects(list);
  }

  useEffect(() => {
    load();
  }, []);

  function handleAdd() {
    const name = prompt("Project name?");
    if (!name) return;

    createProject(name);
    load();
  }

  function handleDelete(id) {
    if (!confirm("Move project to Trash?")) return;
    softDeleteProject(id);
    load();
  }

  const totalBalance = projects.reduce((s, p) => s + p.balance, 0);
  const lastUpdated =
    projects.length > 0 ? formatDate(projects[0].lastActivity) : "-";

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Dashboard</h2>

      <div style={{
        border: "1px solid #eee",
        padding: 20,
        borderRadius: 12,
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <div>Total Projects Balance</div>
          <h2>{formatCurrency(totalBalance)}</h2>
        </div>

        <div style={{ textAlign: "right" }}>
          <div>Total Projects</div>
          <h2>{projects.length}</h2>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        Last Updated: {lastUpdated}
      </div>

      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 14,
          background: "black",
          color: "white",
          borderRadius: 10
        }}
      >
        + Add Project
      </button>

      <h3 style={{ marginTop: 30 }}>Your Projects</h3>

      {projects.map(p => (
        <div
          key={p.id}
          style={{
            border: "1px solid #eee",
            padding: 15,
            borderRadius: 10,
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>
            <Link href={`/project/${p.id}`}>
              <b style={{ cursor: "pointer" }}>{p.name}</b>
            </Link>

            <div style={{ fontSize: 12, color: "#777" }}>
              Last Activity: {formatDate(p.lastActivity)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 15 }}>
            <div>{formatCurrency(p.balance)}</div>

            <button onClick={() => handleDelete(p.id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}