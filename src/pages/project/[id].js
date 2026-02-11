import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getProjectTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getProjectById,
  deleteProject
} from "../../lib/storage";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  const [transactions, setTransactions] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [hoveringName, setHoveringName] = useState(false);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income"); // ✅ NEW
  const [withWho, setWithWho] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!id) return;

    setTransactions(getProjectTransactions(id));

    const found = getProjectById(id);
    if (found) {
      setProjectName(found.name);
    }

  }, [id]);

  function handleSubmit() {
    const trimmedAmount = amount.toString().trim();
    const trimmedWith = withWho.trim();
    const trimmedNote = note.trim();

    if (!trimmedAmount || isNaN(trimmedAmount)) return;
    if (!trimmedWith) return;

    const numericAmount = Number(trimmedAmount);

    const finalAmount =
      type === "expense"
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

    if (editingId) {
      updateTransaction(id, {
        id: editingId,
        amount: finalAmount,
        withWho: trimmedWith,
        note: trimmedNote,
        createdAt: new Date().toISOString()
      });
      setEditingId(null);
    } else {
      addTransaction(id, {
        amount: finalAmount,
        withWho: trimmedWith,
        note: trimmedNote
      });
    }

    setTransactions(getProjectTransactions(id));
    setAmount("");
    setWithWho("");
    setNote("");
    setType("income");
  }

  function startEdit(tx) {
    setEditingId(tx.id);
    setAmount(Math.abs(tx.amount));
    setType(tx.amount < 0 ? "expense" : "income");
    setWithWho(tx.withWho);
    setNote(tx.note || "");
  }

  function handleDelete(txId) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    deleteTransaction(id, txId);
    setTransactions(getProjectTransactions(id));
  }

  function handleRename() {
    const currentName = getProjectById(id)?.name || "";
    const newName = prompt("Edit project name:", currentName);

    if (newName === null) return;

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === currentName) return;

    const projects = JSON.parse(
      localStorage.getItem("negm_projects") || "[]"
    );

    const updated = projects.map(p =>
      p.id === Number(id)
        ? { ...p, name: trimmedName }
        : p
    );

    localStorage.setItem("negm_projects", JSON.stringify(updated));
    setProjectName(trimmedName);
  }

  function handleDeleteProject() {
    const confirmDelete = confirm(
      "This will permanently delete the entire project and all its transactions.\n\nAre you sure?"
    );

    if (!confirmDelete) return;

    deleteProject(id);
    router.push("/dashboard");
  }

  const balance = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>

      <div style={{ marginBottom: 50 }}>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </div>

      <h2
        onClick={handleRename}
        onMouseEnter={() => setHoveringName(true)}
        onMouseLeave={() => setHoveringName(false)}
        style={{
          cursor: "pointer",
          marginBottom: 8,
          fontSize: 25,
          fontWeight: 600,
          textDecoration: hoveringName ? "underline" : "none",
          transition: "all 0.15s ease"
        }}
      >
        {projectName || `Project ${id}`}
      </h2>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#888", letterSpacing: 1 }}>
          CURRENT BALANCE
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: balance >= 0 ? "#16a34a" : "#dc2626",
            marginTop: 5
          }}
        >
          {balance >= 0 ? "+" : ""}
          {balance.toLocaleString()}
        </div>
      </div>

      {/* ✅ Income / Expense Selector */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="With (client, supplier...)"
        value={withWho}
        onChange={(e) => setWithWho(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10,
          background: editingId ? "#444" : "black",
          color: "white",
          border: "none",
          borderRadius: 8
        }}
      >
        {editingId ? "Update Transaction" : "Add Transaction"}
      </button>

      <div style={{ marginTop: 20 }}>
        {transactions.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>
                {t.amount > 0 ? "+" : ""}
                {Number(t.amount).toLocaleString()}
              </div>
              <div>{t.withWho}</div>
              <div style={{ fontSize: 12 }}>{t.note}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <button onClick={() => startEdit(t)} style={{ marginRight: 8 }}>
                ✏
              </button>
              <button onClick={() => handleDelete(t.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 50, textAlign: "center" }}>
        <button
          onClick={handleDeleteProject}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
            color: "#555",
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Delete Project
        </button>
      </div>

    </div>
  );
}