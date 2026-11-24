// Renders the "All work" page from data/work-items.json.
// This is the starting point of the assignment: change anything you like.

const STATUS_LABELS = {
  todo: "To do",
  in_progress: "In progress",
  client_review: "Client review",
  blocked: "Blocked",
  done: "Done",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDue(iso) {
  const [, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function renderRow(item, today) {
  const done = item.status === "done";
  const overdue = !done && item.due < today;
  return `
    <tr class="${done ? "is-done" : ""}">
      <td class="id">${escapeHtml(item.id)}</td>
      <td class="title">${escapeHtml(item.title)}</td>
      <td class="client">${escapeHtml(item.client)}</td>
      <td class="brand-cell">${escapeHtml(item.brand)}</td>
      <td class="type">${escapeHtml(item.type)}</td>
      <td><span class="status ${item.status === "todo" ? "todo" : done ? "done" : ""}">${STATUS_LABELS[item.status]}</span></td>
      <td><span class="priority ${item.priority}">${escapeHtml(item.priority)}</span></td>
      <td class="owners">${item.owners.map(escapeHtml).join(" · ")}</td>
      <td class="due ${overdue ? "is-overdue" : ""}">${formatDue(item.due)}</td>
    </tr>`;
}

async function main() {
  const res = await fetch("data/work-items.json");
  const { today, items } = await res.json();

  const clients = [...new Set(items.map((i) => i.client))];
  document.getElementById("subtitle").textContent = `${items.length} items across ${clients.length} clients`;
  document.getElementById("client-links").innerHTML = clients
    .map((c) => `<a class="nav-link" href="#">${escapeHtml(c)}</a>`)
    .join("");
  document.getElementById("rows").innerHTML = items.map((item) => renderRow(item, today)).join("");
}

main();
