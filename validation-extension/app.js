const tableBody = document.querySelector("#results tbody");
document.getElementById("btnLoad").addEventListener("click", loadValidationData);

async function loadValidationData() {
  tableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    // 1️⃣ Get the active project
    const project = await TCProjects.getCurrentProject();
    const files = await project.getFiles();

    // 2️⃣ Filter to files that contain your "Val" feature code
    const valFiles = files.filter(f => f.name.includes("Val"));

    tableBody.innerHTML = "";

    for (const f of valFiles) {
      // Example: reading attributes stored as metadata
      const attrs = await f.getAttributes();

      const initial = parseFloat(attrs.Initial) || 0;
      const final = parseFloat(attrs.Final) || 0;
      const diff = initial - final;
      const result = Math.abs(diff) > 5 ? "Fail" : "Pass";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${f.name}</td>
        <td>${initial.toFixed(2)}</td>
        <td>${final.toFixed(2)}</td>
        <td>${diff.toFixed(2)}</td>
        <td class="${result.toLowerCase()}">${result}</td>
      `;
      tableBody.appendChild(row);
    }
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan='5'>Error loading data</td></tr>`;
  }
}
