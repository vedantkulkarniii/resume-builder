const form = document.getElementById("resumeForm");
const projectsContainer = document.getElementById("projectsContainer");
const previewProjects = document.getElementById("previewProjects");
const addProjectBtn = document.getElementById("addProjectBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

const defaults = {
  name: "YOUR NAME",
  title: "Software Engineer",
  email: "email@example.com",
  phone: "+91-0000000000",
  location: "City, Country",
  github: "github.com/username",
  summary: "Professional summary appears here.",
  degree: "B.Tech - Computer Science",
  college: "College Name",
  eduDuration: "2021 - 2025",
  coursework: "",
  expTitle: "Position Title",
  expOrg: "Organization",
  expDuration: "2023 - Present",
  languages: "JavaScript, Python",
  frameworks: "React, Node.js",
  tools: "Git, Docker"
};

let projectCount = 0;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(value) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function stripProtocol(value) {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function parseBullets(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[•\-]\s*/, ""))
    .filter(Boolean);
}

function createProjectForm(data = {}) {
  projectCount += 1;
  const wrapper = document.createElement("div");
  wrapper.className = "project-card";
  wrapper.dataset.projectId = String(projectCount);

  wrapper.innerHTML = `
    <div class="project-top">
      <strong>Project ${projectCount}</strong>
      <button type="button" class="btn btn-danger remove-project">Remove</button>
    </div>
    <div class="field"><label>Project Title *</label><input type="text" class="project-title" required value="${escapeHtml(data.title || "")}" /></div>
    <div class="field"><label>Tech Stack *</label><input type="text" class="project-stack" required value="${escapeHtml(data.stack || "")}" /></div>
    <div class="field"><label>Year *</label><input type="text" class="project-year" required value="${escapeHtml(data.year || "")}" /></div>
    <div class="field"><label>Description Bullet Points (one per line) *</label><textarea class="project-description" rows="3" required>${escapeHtml(data.description || "")}</textarea></div>
    <div class="field"><label>GitHub Link *</label><input type="url" class="project-github" placeholder="https://github.com/username/repo" required value="${escapeHtml(data.github || "")}" /></div>
    <div class="field"><label>Live Demo Link</label><input type="url" class="project-demo" placeholder="https://project-demo.com" value="${escapeHtml(data.demo || "")}" /></div>
  `;

  projectsContainer.appendChild(wrapper);
}

function getProjectData() {
  const projectCards = [...projectsContainer.querySelectorAll(".project-card")];
  return projectCards.map((card) => ({
    title: card.querySelector(".project-title").value.trim(),
    stack: card.querySelector(".project-stack").value.trim(),
    year: card.querySelector(".project-year").value.trim(),
    description: parseBullets(card.querySelector(".project-description").value),
    github: normalizeUrl(card.querySelector(".project-github").value),
    demo: normalizeUrl(card.querySelector(".project-demo").value)
  }));
}

function getFormData() {
  const formData = new FormData(form);
  return {
    name: formData.get("name")?.toString().trim() || "",
    title: formData.get("title")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    location: formData.get("location")?.toString().trim() || "",
    github: normalizeUrl(formData.get("github")?.toString().trim() || ""),
    summary: formData.get("summary")?.toString().trim() || "",
    degree: formData.get("degree")?.toString().trim() || "",
    college: formData.get("college")?.toString().trim() || "",
    eduDuration: formData.get("eduDuration")?.toString().trim() || "",
    coursework: formData.get("coursework")?.toString().trim() || "",
    expTitle: formData.get("expTitle")?.toString().trim() || "",
    expOrg: formData.get("expOrg")?.toString().trim() || "",
    expDuration: formData.get("expDuration")?.toString().trim() || "",
    expBullets: parseBullets(formData.get("expBullets")?.toString() || ""),
    languages: formData.get("languages")?.toString().trim() || "",
    frameworks: formData.get("frameworks")?.toString().trim() || "",
    tools: formData.get("tools")?.toString().trim() || "",
    projects: getProjectData()
  };
}

function renderProjects(projects) {
  const validProjects = projects.filter((project) => project.title || project.stack || project.description.length);
  if (!validProjects.length) {
    previewProjects.innerHTML = "<p class='muted-line'>Add projects to display them here.</p>";
    return;
  }

  previewProjects.innerHTML = validProjects
    .map((project) => {
      const links = [];
      if (project.github) {
        links.push(`<a href="${project.github}" target="_blank" rel="noopener noreferrer">🔗 GitHub Repo</a>`);
      }
      if (project.demo) {
        links.push(`<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>`);
      }

      const bullets = project.description.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
      return `
        <article class="project-preview">
          <div class="row">
            <strong>${escapeHtml(project.title || "Untitled Project")} <span class="muted-line">| ${escapeHtml(project.stack || "Tech Stack")}</span></strong>
            <span>${escapeHtml(project.year || "")}</span>
          </div>
          <ul>${bullets || "<li>Project description</li>"}</ul>
          ${links.length ? `<p class="project-links">${links.join(" | ")}</p>` : ""}
        </article>
      `;
    })
    .join("");
}

function updatePreview() {
  const data = getFormData();

  document.getElementById("previewName").textContent = (data.name || defaults.name).toUpperCase();
  document.getElementById("previewTitle").textContent = data.title || defaults.title;
  document.getElementById("previewContact").textContent = [
    data.email || defaults.email,
    data.phone || defaults.phone,
    data.location || defaults.location,
    data.github ? stripProtocol(data.github) : defaults.github
  ].join(" | ");

  document.getElementById("previewSummary").textContent = data.summary || defaults.summary;
  document.getElementById("previewDegree").textContent = data.degree || defaults.degree;
  document.getElementById("previewCollege").textContent = data.college || defaults.college;
  document.getElementById("previewEduDuration").textContent = data.eduDuration || defaults.eduDuration;
  document.getElementById("previewCoursework").textContent = data.coursework ? `Coursework: ${data.coursework}` : "";

  document.getElementById("previewExpTitle").textContent = data.expTitle || defaults.expTitle;
  document.getElementById("previewExpOrg").textContent = data.expOrg || defaults.expOrg;
  document.getElementById("previewExpDuration").textContent = data.expDuration || defaults.expDuration;

  const expList = document.getElementById("previewExpBullets");
  expList.innerHTML = "";
  const expBullets = data.expBullets.length ? data.expBullets : ["Add achievements and impact here."];
  expBullets.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    expList.appendChild(li);
  });

  document.getElementById("previewLanguages").textContent = data.languages || defaults.languages;
  document.getElementById("previewFrameworks").textContent = data.frameworks || defaults.frameworks;
  document.getElementById("previewTools").textContent = data.tools || defaults.tools;

  renderProjects(data.projects);
}

function validateBeforeDownload() {
  if (!form.reportValidity()) return false;

  const projectCards = [...projectsContainer.querySelectorAll(".project-card")];
  if (!projectCards.length) {
    alert("Please add at least one project.");
    return false;
  }

  for (const card of projectCards) {
    const requiredFields = card.querySelectorAll("[required]");
    for (const input of requiredFields) {
      if (!input.value.trim()) {
        input.focus();
        alert("Please fill all required project fields before downloading.");
        return false;
      }
    }
  }
  return true;
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5.5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function generatePdf() {
  if (!validateBeforeDownload()) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const data = getFormData();

  const left = 16;
  const right = 194;
  const width = right - left;
  const pageBottom = 285;
  let y = 16;

  const ensureSpace = (needed = 10) => {
    if (y + needed <= pageBottom) return;
    doc.addPage();
    y = 16;
  };

  const addWrappedTextSafe = (text, x = left, maxWidth = width, lineHeight = 5.5) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      ensureSpace(lineHeight + 1);
      doc.text(line, x, y);
      y += lineHeight;
    });
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text((data.name || defaults.name).toUpperCase(), 105, y, { align: "center" });
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text(data.title || defaults.title, 105, y, { align: "center" });
  y += 6;

  doc.setFontSize(10.5);
  doc.setTextColor(55, 55, 55);
  const contact = [
    data.email || defaults.email,
    data.phone || defaults.phone,
    data.location || defaults.location,
    data.github ? stripProtocol(data.github) : defaults.github
  ].join(" | ");
  doc.text(contact, 105, y, { align: "center" });
  y += 8;

  // Section title and divider helper
  const addSectionTitle = (title) => {
    ensureSpace(12);
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, left, y);
    y += 1.8;
    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.25);
    doc.line(left, y + 1.3, right, y + 1.3);
    y += 4.6;
  };

  addSectionTitle("PROFESSIONAL SUMMARY");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.3);
  addWrappedTextSafe(data.summary || defaults.summary);
  y += 2.2;

  addSectionTitle("EDUCATION");
  ensureSpace(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.degree || defaults.degree, left, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.eduDuration || defaults.eduDuration, right, y, { align: "right" });
  y += 5;
  doc.text(data.college || defaults.college, left, y);
  y += 5;
  if (data.coursework) {
    addWrappedTextSafe(`Coursework: ${data.coursework}`);
    y += 1.8;
  }

  addSectionTitle("KEY PROJECTS");
  const projects = data.projects.filter((project) => project.title || project.description.length);
  doc.setFontSize(10);

  projects.forEach((project) => {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.text(project.title || "Untitled Project", left, y);
    doc.setFont("helvetica", "normal");
    doc.text(project.year || "", right, y, { align: "right" });
    y += 4.8;

    doc.setTextColor(70, 70, 70);
    doc.text(project.stack || "", left, y);
    doc.setTextColor(20, 20, 20);
    y += 4.8;

    project.description.forEach((point) => {
      const bulletText = `- ${point}`;
      addWrappedTextSafe(bulletText, left + 1, width - 1);
    });
    y += 1.6;

    if (project.github) {
      ensureSpace(8);
      const githubLabel = "GitHub Repo";
      doc.setTextColor(0, 0, 180);
      doc.textWithLink(githubLabel, left, y, { url: project.github });
      let nextX = left + doc.getTextWidth(githubLabel) + 4;
      if (project.demo) {
        const sep = "|";
        doc.setTextColor(80, 80, 80);
        doc.text(sep, nextX, y);
        nextX += doc.getTextWidth(sep) + 4;
        doc.setTextColor(0, 0, 180);
        doc.textWithLink("Live Demo", nextX, y, { url: project.demo });
      }
      doc.setTextColor(20, 20, 20);
      y += 5.2;
    } else if (project.demo) {
      doc.setTextColor(0, 0, 180);
      doc.textWithLink("Live Demo", left, y, { url: project.demo });
      doc.setTextColor(20, 20, 20);
      y += 5.2;
    }

    y += 1.4;
  });

  addSectionTitle("EXPERIENCE / LEADERSHIP");
  ensureSpace(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.expTitle || defaults.expTitle, left, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.expDuration || defaults.expDuration, right, y, { align: "right" });
  y += 4.8;
  doc.text(data.expOrg || defaults.expOrg, left, y);
  y += 4.8;
  (data.expBullets.length ? data.expBullets : ["Add achievements and impact here."]).forEach((point) => {
    addWrappedTextSafe(`- ${point}`, left + 1, width - 1);
  });
  y += 2;

  addSectionTitle("SKILLS");
  ensureSpace(18);
  doc.text(`Languages: ${data.languages || defaults.languages}`, left, y);
  y += 4.8;
  doc.text(`Frameworks: ${data.frameworks || defaults.frameworks}`, left, y);
  y += 4.8;
  doc.text(`Tools: ${data.tools || defaults.tools}`, left, y);

  doc.save("resume.pdf");
}

function clearAll() {
  form.reset();
  projectsContainer.innerHTML = "";
  projectCount = 0;
  createProjectForm();
  updatePreview();
}

addProjectBtn.addEventListener("click", () => {
  createProjectForm();
  updatePreview();
});

projectsContainer.addEventListener("click", (event) => {
  if (!event.target.classList.contains("remove-project")) return;
  const cards = projectsContainer.querySelectorAll(".project-card");
  if (cards.length === 1) {
    alert("At least one project section is required.");
    return;
  }
  event.target.closest(".project-card")?.remove();
  updatePreview();
});

form.addEventListener("input", updatePreview);
clearBtn.addEventListener("click", clearAll);
downloadBtn.addEventListener("click", generatePdf);

createProjectForm({
  title: "Developer Portfolio",
  stack: "HTML, CSS, JavaScript",
  year: "2026",
  description: "Built a responsive portfolio website\nIntegrated contact form and project showcase",
  github: "https://github.com/username/portfolio",
  demo: "https://portfolio-demo.com"
});
updatePreview();
