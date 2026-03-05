import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
        return;
      }

      loadProjects();
    };

    checkUser();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        name,
        updated_at,
        transactions ( amount )
      `)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map(p => {
        const balance = p.transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        return { ...p, balance };
      });

      setProjects(formatted);
    }
  }

  async function handleCreate() {
    const name = prompt("Project name?");
    if (!name) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("projects").insert([
      {
        name,
        user_id: user.id
      }
    ]);

    if (!error) loadProjects();
  }

  const totalBalance = projects.reduce(
    (sum, p) => sum + (p.balance || 0),
    0
  );

  return (
    <div style={{ maxWidth: 750, margin: "50px auto" }}>
      <h2 style={{ marginBottom: 25 }}>Dashboard</h2>

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
        const balance = p.balance || 0;

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
              background: "#fff"
            }}
          >
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
                  {p.updated_at
                    ? `Updated ${new Date(p.updated_at).toLocaleString()}`
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