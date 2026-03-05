import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  const [transactions, setTransactions] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [hoveringName, setHoveringName] = useState(false);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState(false);
  const [withWho, setWithWho] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  if (!id) return;
  loadProject();
  loadTransactions();
}, [id]);

  async function loadProject() {
    const { data } = await supabase
      .from("projects")
      .select("name")
      .eq("id", id)
      .single();

    if (data) setProjectName(data.name);
  }

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("project_id", Number(id))
      .order("updated_at", { ascending: false });

    if (!error && data) setTransactions(data);
  }

  async function handleSubmit() {
    const trimmedAmount = amount.toString().trim();
    const trimmedWith = withWho.trim();
    const trimmedNote = note.trim();

    if (!trimmedAmount || isNaN(trimmedAmount)) return;
    if (!trimmedWith) return;

    if (!type) {
      setTypeError(true);
      return;
    }

    setTypeError(false);

    const numericAmount = Number(trimmedAmount);

    const finalAmount =
      type === "expense"
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

    if (editingId) {
  await supabase
    .from("transactions")
    .update({
      amount: finalAmount,
      with_who: trimmedWith,
      note: trimmedNote
    })
    .eq("id", editingId);

  await supabase
    .from("projects")
    .update({ updated_at: new Date() })
    .eq("id", id);

  setEditingId(null);
} else {
  await supabase.from("transactions").insert([
    {
      project_id: id,
      amount: finalAmount,
      with_who: trimmedWith,
      note: trimmedNote
    }
  ]);

  await supabase
    .from("projects")
    .update({ updated_at: new Date() })
    .eq("id", id);
}

    setAmount("");
    setWithWho("");
    setNote("");
    setType("");

    loadTransactions();
  }

  function startEdit(tx) {
  setEditingId(tx.id);
  setAmount(Math.abs(tx.amount));
  setType(tx.amount < 0 ? "expense" : "income");
  setWithWho(tx.with_who);
  setNote(tx.note || "");
  setTypeError(false);
}

async function handleDelete(txId) {
  const confirmDelete = confirm("Delete transaction?");
  if (!confirmDelete) return;

  await supabase.from("transactions").delete().eq("id", txId);

  await supabase
    .from("projects")
    .update({ updated_at: new Date() })
    .eq("id", id);

  loadTransactions();
}

  async function handleRename() {
    const newName = prompt("Edit project name:", projectName);
    if (!newName) return;

    await supabase
  .from("projects")
  .update({
    name: newName,
    updated_at: new Date()
  })
  .eq("id", id);

setProjectName(newName);
  }

  async function handleDeleteProject() {
    const confirmDelete = confirm("Delete this project?");
    if (!confirmDelete) return;

    await supabase.from("projects").delete().eq("id", id);
    router.push("/dashboard");
  }

  const balance = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
          textDecoration: hoveringName ? "underline" : "none"
        }}
      >
        {projectName}
      </h2>

      {/* BALANCE */}
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

      {/* SUMMARY */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 15,
          marginBottom: 20,
          background: "#fafafa",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>TOTAL INCOME</div>
          <div style={{ color: "#16a34a", fontWeight: 600 }}>
            +{totalIncome.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>TOTAL EXPENSE</div>
          <div style={{ color: "#dc2626", fontWeight: 600 }}>
            -{totalExpense.toLocaleString()}
          </div>
        </div>
      </div>

      {/* TYPE SELECTOR */}
      <div
        style={{
          display: "flex",
          marginTop: 10,
          borderRadius: 999,
          overflow: "hidden",
          border: typeError ? "1px solid #dc2626" : "1px solid #ddd",
          background: "#f5f5f5"
        }}
      >
        <button
          onClick={() => { setType("income"); setTypeError(false); }}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            background: type === "income" ? "#16a34a" : "transparent",
            color: type === "income" ? "#fff" : "#333",
            fontWeight: 600
          }}
        >
          💰 Income
        </button>

        <button
          onClick={() => { setType("expense"); setTypeError(false); }}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            background: type === "expense" ? "#dc2626" : "transparent",
            color: type === "expense" ? "#fff" : "#333",
            fontWeight: 600
          }}
        >
          🧾 Expense
        </button>
      </div>

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
        disabled={!type}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 8
        }}
      >
        {editingId ? "Update Transaction" : "Add Transaction"}
      </button>

      {/* TRANSACTIONS */}
      <div style={{ marginTop: 30 }}>
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
              <div
                style={{
                  fontWeight: "bold",
                  color: t.amount > 0 ? "#16a34a" : "#dc2626"
                }}
              >
                {t.amount > 0 ? "+" : ""}
                {Number(t.amount).toLocaleString()}
              </div>

              <div>{t.with_who}</div>

              <div style={{ fontSize: 12 }}>{t.note}</div>

              <div style={{ fontSize: 11, opacity: 0.6 }}>
                {new Date(t.updated_at).toLocaleString()}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
  <button onClick={() => startEdit(t)}>✏</button>
  <button onClick={() => handleDelete(t.id)}>🗑</button>
</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 50, textAlign: "center" }}>
        <button onClick={handleDeleteProject}>
          Delete Project
        </button>
      </div>

    </div>
  );
}