import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  getProjects,
  createProject,
  softDeleteProject
} from "../lib/storage";

export default function Dashboard() {

  const router = useRouter();

  // 🔐 Check if user exists
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
    }
  }, []);

    const [projects, setProjects] = useState([]);

  function load() {
    const list = getProjects()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setProjects(list);
  }

  useEffect(() => {
    load();
  }, []);

  function handleAddProject() {
    const name = prompt("Project Name?");
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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
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
          <h2>{totalBalance.toLocaleString()}</h2>
        </div>

        <div style={{ textAlign: "right" }}>
          <div>Total Projects</div>
          <h2>{projects.length}</h2>
        </div>
      </div>

      <button
        onClick={handleAddProject}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 15,
          background: "black",
          color: "white",
          borderRadius: 10,
          border: "none"
        }}
      >
        + Add Project
      </button>

      <h3 style={{ marginTop: 30 }}>Your Projects</h3>

      {projects.map(p => (
        <div key={p.id} style={{
          border: "1px solid #eee",
          padding: 15,
          borderRadius: 12,
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href={`/project/${p.id}`}>
            <div style={{ cursor: "pointer" }}>
              <b>{p.name}</b>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                Last Activity: {new Date(p.updatedAt).toLocaleString()}
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", gap: 20 }}>
            <b>{p.balance.toLocaleString()}</b>
            <span style={{ cursor: "pointer" }} onClick={() => handleDelete(p.id)}>🗑</span>
          </div>
        </div>
      ))}
    </div>
  );
}