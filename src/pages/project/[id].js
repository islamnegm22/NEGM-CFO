import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getProjectById,
  addTransaction,
  deleteTransaction,
  editTransaction,
  renameProject,
  formatCurrency,
  formatDate
} from "../../lib/storage";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState("");
  const [withValue, setWithValue] = useState("");
  const [note, setNote] = useState("");

  function load() {
    if (!id) return;
    const p = getProjectById(id);
    if (p) setProject(p);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!project) return null;

  function handleAdd() {
    if (!amount) return;

    addTransaction(id, {
      amount: Number(amount),
      with: withValue,
      note
    });

    setAmount("");
    setWithValue("");
    setNote("");

    load();
  }

  function handleDelete(txId) {
    deleteTransaction(id, txId);
    load();
  }

  function handleEdit(tx) {
    const newAmount = prompt("Edit amount", tx.amount);
    if (!newAmount) return;

    editTransaction(id, tx.id, {
      ...tx,
      amount: Number(newAmount)
    });

    load();
  }

  function handleRename() {
    const name = prompt("New project name", project.name);
    if (!name) return;

    renameProject(id, name);
    load();
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <Link href="/dashboard">← Back to Dashboard</Link>

      <h2 style={{ marginTop: 20 }}>
        {project.name}
        <button
          onClick={handleRename}
          style={{ marginLeft: 10 }}
        >
          ✏️
        </button>
      </h2>

      <div style={{ marginBottom: 20 }}>
        Balance: {formatCurrency(project.balance)}
      </div>

      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="With (client, supplier...)"
        value={withValue}
        onChange={e => setWithValue(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Note"
        value={note}
        onChange={e => setNote(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          padding: 12,
          background: "black",
          color: "white",
          borderRadius: 8
        }}
      >
        Add Transaction
      </button>

      <div style={{ marginTop: 30 }}>
        {project.transactions?.map(tx => (
          <div
            key={tx.id}
            style={{
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div>{formatCurrency(tx.amount)}</div>
              <div>{tx.with}</div>
              <div>{tx.note}</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                {formatDate(tx.time)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 15 }}>
              <button onClick={() => handleEdit(tx)}>✏️</button>
              <button onClick={() => handleDelete(tx.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}