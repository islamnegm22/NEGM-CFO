import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  getProjects,
  createProject,
  getProjectBalance
} from "../lib/storage";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/login");
      return;
    }

    loadProjects();
  }, []);

  function loadProjects() {
    const list = getProjects() || [];

    list.sort(
      (a, b) =>
        new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );

    setProjects(list);
  }

  function handleCreate() {
    const name = prompt("Project name?");
    if (!name) return;

    createProject(name);
    loadProjects();
  }

  const totalBalance = projects.reduce(
    (sum, p) => sum + getProjectBalance(p.id),
    0
  );

  return (
    <div style={{ maxWidth: 750, margin: "50px auto" }}>
      <h2 style={{ marginBottom: 25 }}>Dashboard</h2>

      {/* 🔥 Bigger Professional Card */}
      <div
        style={{
          border: "1px solid #eee",
          padding: 30,
          borderRadius: 16,
          marginBottom: 30,
          background: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              opacity: 0.6,
              marginBottom: 8
            }}
          >
            TOTAL PROJECTS BALANCE
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: "700",
              color: totalBalance >= 0 ? "#2e7d32" : "#d32f2f"
            }}
          >
            {totalBalance >= 0 ? "+" : ""}
            {totalBalance.toLocaleString()}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              opacity: 0.6,
              marginBottom: 8
            }}
          >
            TOTAL PROJECTS
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: "600"
            }}
          >
            {projects.length}
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        style={{
          width: "100%",
          padding: 15,
          background: "black",
          color: "white",
          borderRadius: 10,
          marginBottom: 35
        }}
      >
        + Add Project
      </button>

      {projects.map(p => {
        const balance = getProjectBalance(p.id);

        return (
          <div
            key={p.id}
            style={{
              position: "relative",
              border: "1px solid #eee",
              padding: 20,
              borderRadius: 16,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.15s ease",
              background: "#fff",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Page Fold Effect */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                borderLeft: "18px solid transparent",
                borderTop: "18px solid #f5f5f5"
              }}
            />

            <Link href={`/project/${p.id}`}>
              <div style={{ cursor: "pointer" }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 6
                  }}
                >
                  {p.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#777"
                  }}
                >
                  {p.updatedAt
                    ? `Updated ${new Date(p.updatedAt).toLocaleString()}`
                    : "No activity yet"}
                </div>
              </div>
            </Link>

            <div
              style={{
                color: balance >= 0 ? "#2e7d32" : "#d32f2f",
                fontWeight: 700,
                fontSize: 18,
                minWidth: 120,
                textAlign: "right"
              }}
            >
              {balance >= 0 ? "+" : ""}
              {balance.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}