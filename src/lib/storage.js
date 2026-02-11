const PROJECTS_KEY = "negm_projects";

/* ========= PROJECTS ========= */

export function getProjects() {
  return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
}

export function getProjectById(id) {
  const projects = getProjects();
  return projects.find(p => p.id === Number(id));
}

export function saveProjects(list) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
}

export function createProject(name) {
  const list = getProjects();

  const newProject = {
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  list.push(newProject);
  saveProjects(list);
  return newProject;
}

export function touchProject(projectId) {
  const projects = getProjects();

  const updated = projects.map(p =>
    p.id === Number(projectId)
      ? { ...p, updatedAt: new Date().toISOString() }
      : p
  );

  saveProjects(updated);
}

/* ========= TRANSACTIONS ========= */

function txKey(id) {
  return `project-transactions-${id}`;
}

export function getProjectTransactions(projectId) {
  return JSON.parse(localStorage.getItem(txKey(projectId)) || "[]");
}

export function saveProjectTransactions(projectId, list) {
  localStorage.setItem(txKey(projectId), JSON.stringify(list));
  touchProject(projectId);
}

export function addTransaction(projectId, tx) {
  const list = getProjectTransactions(projectId);

  const newTx = {
    id: Date.now(),
    ...tx,
    createdAt: new Date().toISOString()
  };

  list.unshift(newTx);

  saveProjectTransactions(projectId, list);
}

export function updateTransaction(projectId, updatedTx) {
  const list = getProjectTransactions(projectId);

  const updated = list.map(t =>
    t.id === updatedTx.id ? updatedTx : t
  );

  saveProjectTransactions(projectId, updated);
}

export function deleteTransaction(projectId, txId) {
  const list = getProjectTransactions(projectId);

  const filtered = list.filter(t => t.id !== txId);

  saveProjectTransactions(projectId, filtered);
}

export function getProjectBalance(projectId) {
  const tx = getProjectTransactions(projectId);

  return tx.reduce((sum, t) => {
    return sum + Number(t.amount || 0);
  }, 0);
}

/* ========= DELETE PROJECT ========= */

export function deleteProject(projectId) {
  const projects = getProjects();

  const filtered = projects.filter(
    p => p.id !== Number(projectId)
  );

  saveProjects(filtered);

  // remove its transactions
  localStorage.removeItem(`project-transactions-${projectId}`);
}