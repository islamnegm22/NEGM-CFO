// src/lib/storage.js

const STORAGE_KEY = "negm_projects";
const TRASH_KEY = "negm_trash";

// ---------------- LOAD / SAVE ----------------

function load() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadTrash() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(TRASH_KEY) || "[]");
}

function saveTrash(data) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(data));
}

// ---------------- HELPERS ----------------

function recalcBalance(project) {
  return project.transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );
}

export function formatCurrency(num) {
  return Number(num || 0).toLocaleString();
}

export function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString();
}

// ---------------- PROJECT CRUD ----------------

export function getProjects() {
  return load().sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
}

export function getProjectById(id) {
  return load().find(p => String(p.id) === String(id));
}

export function createProject(name) {
  const data = load();

  const newProject = {
    id: Date.now().toString(),
    name: name || `Project ${Date.now()}`,
    balance: 0,
    transactions: [],
    lastActivity: Date.now(),
  };

  data.unshift(newProject);
  save(data);

  return newProject;
}

export function renameProject(id, newName) {
  const data = load();
  const project = data.find(p => p.id === id);
  if (!project) return;

  project.name = newName;
  project.lastActivity = Date.now();

  save(data);
}

export function softDeleteProject(id) {
  const data = load();
  const trash = loadTrash();

  const project = data.find(p => p.id === id);
  if (!project) return;

  saveTrash([project, ...trash]);
  save(data.filter(p => p.id !== id));
}

// ---------------- TRANSACTIONS ----------------

export function addTransaction(projectId, tx) {
  const data = load();
  const project = data.find(p => p.id === projectId);
  if (!project) return;

  if (!project.transactions) project.transactions = [];

  const newTx = {
    id: Date.now().toString(),
    amount: Number(tx.amount),
    with: tx.with || "",
    note: tx.note || "",
    time: Date.now(),
  };

  project.transactions.unshift(newTx);

  project.balance = recalcBalance(project);
  project.lastActivity = Date.now();

  save(data);
}

export function deleteTransaction(projectId, txId) {
  const data = load();
  const project = data.find(p => p.id === projectId);
  if (!project) return;

  project.transactions = project.transactions.filter(t => t.id !== txId);

  project.balance = recalcBalance(project);
  project.lastActivity = Date.now();

  save(data);
}

export function editTransaction(projectId, txId, newData) {
  const data = load();
  const project = data.find(p => p.id === projectId);
  if (!project) return;

  const tx = project.transactions.find(t => t.id === txId);
  if (!tx) return;

  tx.amount = Number(newData.amount);
  tx.with = newData.with;
  tx.note = newData.note;
  tx.time = Date.now();

  project.balance = recalcBalance(project);
  project.lastActivity = Date.now();

  save(data);
}

// ---------------- DASHBOARD HELPERS ----------------

export function getTotalBalance() {
  return load().reduce((sum, p) => sum + Number(p.balance || 0), 0);
}

export function getLastUpdatedTime() {
  const projects = load();
  if (!projects.length) return null;

  return Math.max(...projects.map(p => p.lastActivity || 0));
}

// ---------------- TRASH ----------------

export function getTrash() {
  return loadTrash();
}

export function restoreProject(id) {
  const trash = loadTrash();
  const data = load();

  const project = trash.find(p => p.id === id);
  if (!project) return;

  save([project, ...data]);
  saveTrash(trash.filter(p => p.id !== id));
}

export function deleteProjectForever(id) {
  const trash = loadTrash();
  saveTrash(trash.filter(p => p.id !== id));
}