const personas = [
  { id: "expert-ui-designer", initials: "CO", name: "Camille Ortiz", role: "Expert UI designer", group: "Specialists", descriptor: "The interface craftsperson", quote: "The interface is where the product makes its promises visible.", tags: ["interface craft", "design systems", "accessibility", "visual judgment"], mix: "2 foundational · 3 supporting · 2 edge-case" },
  { id: "operations-lead", initials: "MC", name: "Maya Chen", role: "Operations lead", group: "Operators", descriptor: "The calm orchestrator", quote: "I can make the process work. I just need to see where it is about to break.", tags: ["B2B SaaS", "high ownership", "scaling"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "independent-maker", initials: "TR", name: "Tomás Rivera", role: "Independent maker", group: "Operators", descriptor: "The resourceful beginner", quote: "Tell me what matters first. I’ll figure out the rest.", tags: ["self-serve", "learning", "time-poor"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "people-leader", initials: "NO", name: "Nia Okafor", role: "People leader", group: "Leaders", descriptor: "The context carrier", quote: "The decision is easy. Getting everyone to see the same picture is the hard part.", tags: ["alignment", "teams", "decision-making"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "finance-partner", initials: "JP", name: "Jin Park", role: "Finance partner", group: "Leaders", descriptor: "The evidence keeper", quote: "I’m not trying to slow the team down. I’m trying to make the bet legible.", tags: ["planning", "evidence", "risk"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "research-specialist", initials: "AB", name: "Amina Bello", role: "Research specialist", group: "Specialists", descriptor: "The pattern finder", quote: "The insight is usually in the detail people skip past.", tags: ["research", "qualitative depth"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "frontline-expert", initials: "VA", name: "Victor Adeyemi", role: "Frontline expert", group: "Specialists", descriptor: "The practical skeptic", quote: "If this adds one more step to the day, it needs to earn that step.", tags: ["frontline workflow", "trust"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "ai-orchestrator", initials: "RM", name: "Riley Morgan", role: "AI orchestrator", group: "Specialists", descriptor: "The systems conductor", quote: "The system is only as good as the handoffs, boundaries, and evidence around the model.", tags: ["agentic systems", "orchestration", "AI operations"], mix: "2 foundational · 3 supporting · 2 edge-case" },
  { id: "senior-ux-designer", initials: "JL", name: "Jordan Lee", role: "Senior UX designer", group: "Specialists", descriptor: "The systems-minded advocate", quote: "I need enough evidence to make the decision—and enough clarity for the team to act on it.", tags: ["product design", "systems", "cross-functional"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "job-seeker", initials: "AB", name: "Avery Brooks", role: "Job seeker in transition", group: "Specialists", descriptor: "The evidence translator", quote: "I know I can do valuable work. I need a clear way to show where and why.", tags: ["job search", "career transition", "evidence", "self-development"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "career-search-strategist", initials: "EM", name: "Elena Marin", role: "Career search strategist", group: "Specialists", descriptor: "The possibility shaper", quote: "A search becomes actionable when the person can explain what they want and what evidence supports it.", tags: ["job search", "career strategy", "coaching", "market framing"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "hiring-side-calibrator", initials: "MC", name: "Marcus Chen", role: "Hiring-side role calibrator", group: "Specialists", descriptor: "The signal calibrator", quote: "A strong application makes the decision easier by showing the evidence behind the claim.", tags: ["job search", "hiring", "role calibration", "signal"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "application-editor", initials: "LO", name: "Leah Okafor", role: "Application narrative editor", group: "Specialists", descriptor: "The clarity editor", quote: "The best edit makes the evidence easier to see without making the person sound manufactured.", tags: ["job search", "application writing", "ATS", "editing"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "outreach-coach", initials: "SN", name: "Samira Nguyen", role: "Outreach and interview coach", group: "Specialists", descriptor: "The conversation builder", quote: "Preparation is not memorizing a script. It is knowing which evidence matters and how to make it useful.", tags: ["job search", "outreach", "interviews", "networking"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "knowledge-architect", initials: "MO", name: "Mara Okoye", role: "Knowledge systems architect", group: "Specialists", descriptor: "The boundary keeper", quote: "If we cannot explain what this thing is, where it belongs, and what it connects to, we are not ready to add it.", tags: ["information architecture", "concept modeling", "systems thinking", "governance"], mix: "3 foundational · 2 supporting · 2 edge-case" },
  { id: "context-collaborator", initials: "AR", name: "Alex Rowan", role: "Context-aware systems collaborator", group: "Specialists", descriptor: "The grounded builder", quote: "First understand the goal and the available ground. Then take the smallest useful action and make the result inspectable.", tags: ["context-aware systems", "collaboration", "safe execution", "cross-surface"], mix: "2 foundational · 2 supporting · 2 edge-case" },
  { id: "document-designer", initials: "SC", name: "Sofia Calder", role: "Expert document designer", group: "Specialists", descriptor: "The editorial systems builder", quote: "A document should make the reader’s next move obvious.", tags: ["document design", "information design", "editorial systems", "accessibility"], mix: "3 foundational · 3 supporting · 2 edge-case" }
];

const skills = [
  ["Accessibility and inclusive design", "Identify and reduce barriers in the interface so people with different abilities, devices, and ways of interacting can complete the task.", "DESIGN & INTERACTION", "Camille Ortiz · Jordan Lee"],
  ["Accessible document structure and export", "Preserve meaningful structure, readable contrast, navigable order, and usable content when a document is delivered or exported.", "APPLIED PRACTICE", "Sofia Calder"],
  ["Active listening and question design", "Use the conversation to understand the role, team, expectations, and next decision—not just to perform.", "APPLIED PRACTICE", "Samira Nguyen"],
  ["Adaptive rehearsal", "Practice the reasoning and evidence behind an answer so the candidate can respond when conditions change.", "APPLIED PRACTICE", "Samira Nguyen"],
  ["Agent workflow architecture", "Turn a goal into a bounded workflow or agent system with clear ownership, state, tools, and stopping conditions.", "AI & SYSTEMS", "Riley Morgan"],
  ["Application tool literacy", "Use search, document, ATS, portfolio, and tracking tools without letting the tools distort the search or story.", "AI & SYSTEMS", "Avery Brooks"],
  ["ATS-aware formatting and terminology", "Improve machine readability and terminology alignment while preserving truthful meaning and usable structure.", "APPLIED PRACTICE", "Leah Okafor"],
  ["Candidate communication", "Communicate process, status, and next steps in a way that preserves clarity and respect.", "APPLIED PRACTICE", "Marcus Chen"],
  ["Capability-aware tool selection", "Match a needed capability to the tools, workspaces, permissions, and fallbacks actually available in the current environment.", "AI & SYSTEMS", "Alex Rowan"],
  ["Career assessment and goal framing", "Elicit goals, history, interests, barriers, and preferences so the search starts from the person’s situation.", "APPLIED PRACTICE", "Elena Marin"],
  ["Component and design-system thinking", "Create and apply reusable interface patterns while preserving the context, flexibility, and limits that make them useful.", "DESIGN & INTERACTION", "Camille Ortiz"],
  ["Contextual visual judgment and composition", "Recognize and shape hierarchy, proportion, rhythm, density, typography, color, spacing, contrast, grouping, and visual tone for the product context.", "DESIGN & INTERACTION", "Camille Ortiz · Sofia Calder"],
  ["Evidence-led validation", "Check the result against the request, relevant quality signals, realistic variation, and the limits of what was actually inspected.", "APPLIED PRACTICE", "Alex Rowan"],
  ["Information architecture and concept modeling", "Model the kinds of things a system contains, the boundaries between them, and the relationships that help people find and use them.", "RESEARCH & STRATEGY", "Mara Okoye"],
  ["Interaction states and behavior design", "Design defaults, loading, errors, empty states, transitions, and recovery as one complete behavioral model.", "DESIGN & INTERACTION", "Camille Ortiz"],
  ["Proportionate planning and execution", "Choose the smallest coherent plan and carry it through without speculative scope or unrelated change.", "APPLIED PRACTICE", "Alex Rowan"],
  ["Safe change and version control", "Preserve recoverability and traceability while making changes to shared artifacts or systems.", "APPLIED PRACTICE", "Alex Rowan"],
  ["Taxonomy, labeling, and navigation", "Create labels, groupings, and routes that reflect how people expect to find and understand the system’s contents.", "APPLIED PRACTICE", "Mara Okoye"]
].map(function (item, index) { return { id: "skill-" + index, name: item[0], description: item[1], category: item[2], people: item[3] }; });

const tools = [
  { name: "Figma", status: "WORKING RECORD", kind: "DESIGN WORKSPACE", description: "Inspect interface direction, compare references, prototype behavior, and verify design-to-build fidelity.", actions: ["Inspect", "Prototype", "Verify"], scope: "Named file or draft", risk: "Medium · shared edits review" },
  { name: "Mobbin", status: "WORKING RECORD", kind: "REFERENCE", description: "Find visual and interaction references to inform principles, comparisons, and contextual design judgment.", actions: ["Search", "Compare", "Cite"], scope: "Search session", risk: "Low–medium · source context" },
  { name: "GitHub", status: "NEEDS VALIDATION", kind: "REPOSITORY", description: "Inspect implementation state, propose changes, and preserve branch, review, and merge boundaries.", actions: ["Inspect", "Branch", "Propose"], scope: "Named repository / branch", risk: "High · merge review" },
  { name: "Google Drive + Docs", status: "NEEDS VALIDATION", kind: "KNOWLEDGE", description: "Find, read, draft, organize, or update documents inside an explicit folder and document scope.", actions: ["Search", "Read", "Draft"], scope: "Named folder / document", risk: "Medium · shared edit review" },
  { name: "Notion", status: "NEEDS VALIDATION", kind: "KNOWLEDGE", description: "Read or update structured knowledge while preserving page ownership, relationships, and revision context.", actions: ["Search", "Read", "Update"], scope: "Named workspace / page", risk: "Medium · page edit review" },
  { name: "Local workspace", status: "FALLBACK", kind: "LOCAL ENVIRONMENT", description: "Create folders and artifacts in an explicit approved path for reversible research, drafts, and isolated tests.", actions: ["Create", "Inspect", "Sandbox"], scope: "Explicit local path", risk: "High · path must be named" },
  { name: "MCP capability adapter", status: "PLANNED", kind: "ADAPTER", description: "Resolve a capability to an available MCP without hard-coding a vendor into a persona or skill.", actions: ["Discover", "Resolve", "Probe"], scope: "Capability + approved server", risk: "Varies · permission review" }
];

const playbooks = [
  { type: "OUTCOME PLAYBOOK", name: "Evidence-led job search", description: "Help a person choose a realistic target, create a truthful application packet, prepare for conversations, and learn from the search.", meta: "4 stages · 8 lenses · Search + evidence", steps: ["Define the search", "Calibrate role + evidence", "Make the packet", "Carry it forward"] },
  { type: "SYSTEM PLAYBOOK", name: "Create and integrate a reusable skill", description: "Combine bounded persona perspectives into a reusable capability, formalize it, validate it, and update the surrounding system.", meta: "6 stages · 2 coordinators · Skill formation", steps: ["Scope the capability", "Choose the lenses", "Compare the perspectives", "Use Create-skill", "Test quality and reuse", "Integrate the system"] }
];

const navItems = [
  ["Personas", "index.html", "home"],
  ["Skills", "skills.html", "skills"],
  ["Tools", "tools.html", "tools"],
  ["Playbooks", "playbooks.html", "playbooks"],
  ["Docs", "guide.html", "guide"],
  ["Decisions", "decisions.html", "decisions"],
  ["Prototyping", "prototyping.html", "prototyping"]
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function header(page) {
  return "<header class=\"site-header\"><a class=\"brand\" href=\"index.html\"><span class=\"brand-mark\">PL</span><span>Personas</span></a><nav class=\"nav\" aria-label=\"Primary\">" +
    navItems.map(function (item) { return "<a href=\"" + item[1] + "\" " + (item[2] === page ? "aria-current=\"page\"" : "") + ">" + item[0] + "</a>"; }).join("") +
    "</nav></header>";
}

function hero(eyebrow, title, copy, stats) {
  return "<section class=\"hero\"><div class=\"hero-inner\"><div class=\"hero-grid\"><div><p class=\"eyebrow\">" + eyebrow + "</p><h1>" + title + "</h1><p class=\"hero-copy\">" + copy + "</p></div>" +
    (stats ? "<div class=\"hero-stats\">" + stats.map(function (stat) { return "<span class=\"stat-pill\">" + stat + "</span>"; }).join("") + "</div>" : "") +
    "</div></div></section>";
}

function pageShell(page, content) {
  document.getElementById("app").innerHTML = header(page) + content;
}

function personCard(person) {
  return "<article class=\"persona-card\"><div class=\"card-top\"><span class=\"avatar\">" + esc(person.initials) + "</span><span class=\"record-type\">" + esc(person.role) + "</span></div><h2>" + esc(person.name) + "</h2><p class=\"descriptor\">" + esc(person.descriptor) + " <span class=\"tag\">Working draft</span></p><p class=\"quote\">“" + esc(person.quote) + "”</p><div class=\"tag-row\">" + person.tags.map(function (tag) { return "<span class=\"tag\">" + esc(tag) + "</span>"; }).join("") + "</div><div class=\"card-footer\"><small>" + esc(person.mix) + "</small><button class=\"text-button\" data-person=\"" + esc(person.id) + "\">Open persona →</button></div></article>";
}

function renderHome() {
  var content = hero("FIELD NOTES / PRODUCT RESEARCH", "Make the user visible in the room.", "A shared shelf of working personas for sharper product decisions. Start with a role group, then open a person to see the lifecycle and operating context behind their choices.", ["17 personas", "03 role groups", "Starter set"]);
  content += "<main class=\"page-main\"><section class=\"toolbar\"><label class=\"search-wrap\"><span class=\"sr-only\">Search personas</span><input class=\"search\" id=\"persona-search\" type=\"search\" placeholder=\"Search by name, role, need, or tag...\"></label><span class=\"result-count\" id=\"persona-count\"></span></section><div class=\"content-grid\"><aside class=\"filter-panel\"><p class=\"filter-label\">Role group</p><button class=\"filter-button is-active\" data-group=\"All\">All roles <span>17</span></button><button class=\"filter-button\" data-group=\"Operators\">Operators <span>2</span></button><button class=\"filter-button\" data-group=\"Leaders\">Leaders <span>2</span></button><button class=\"filter-button\" data-group=\"Specialists\">Specialists <span>13</span></button></aside><section class=\"card-grid\" id=\"persona-grid\"></section></div>" +
    "<section class=\"method\"><h2>Use personas as a lens, not a label.</h2><p>These are prompts for better questions, not fictional people to design around blindly.</p><div class=\"steps\"><article class=\"step\"><span class=\"step-index\">01 / FRAME</span><h3>Start with context</h3><p>Choose the persona closest to the decision in front of you.</p></article><article class=\"step\"><span class=\"step-index\">02 / PRESSURE-TEST</span><h3>Ask what changes</h3><p>Use goals and friction to challenge the default solution.</p></article><article class=\"step\"><span class=\"step-index\">03 / ACT</span><h3>Make it concrete</h3><p>Turn one insight into a product or research next step.</p></article></div></section></main>";
  pageShell("home", content);
  var activeGroup = "All";
  function update() {
    var query = (document.getElementById("persona-search").value || "").toLowerCase().trim();
    var filtered = personas.filter(function (person) {
      var haystack = [person.name, person.role, person.descriptor, person.quote, person.tags.join(" ")].join(" ").toLowerCase();
      return (activeGroup === "All" || person.group === activeGroup) && (!query || haystack.indexOf(query) !== -1);
    });
    document.getElementById("persona-grid").innerHTML = filtered.length ? filtered.map(personCard).join("") : "<div class=\"empty\">No personas match that lens yet.</div>";
    document.getElementById("persona-count").textContent = "Showing " + filtered.length + " personas";
  }
  document.getElementById("persona-search").addEventListener("input", update);
  document.querySelectorAll("[data-group]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeGroup = button.getAttribute("data-group");
      document.querySelectorAll("[data-group]").forEach(function (item) { item.classList.toggle("is-active", item === button); });
      update();
    });
  });
  update();
}

function renderSkills() {
  var content = hero("CAPABILITIES / APPLIED PRACTICE", "See the skills behind the work.", "Browse reusable capabilities across Personas. Open a skill to see its triggers, observable practice, workflow context, evidence, and the people who rely on it.", ["72 skills", "11 personas", "69 workflows"]);
  content += "<main class=\"page-main\"><section class=\"toolbar\"><label class=\"search-wrap\"><span class=\"sr-only\">Search skills</span><input class=\"search\" id=\"skill-search\" type=\"search\" placeholder=\"Search skills...\"></label><span class=\"result-count\" id=\"skill-count\"></span></section><div class=\"collection-tools\"><button class=\"chip-button is-active\" data-skill-category=\"All\">All personas · 11</button><button class=\"chip-button\" data-skill-category=\"DESIGN & INTERACTION\">Design & interaction</button><button class=\"chip-button\" data-skill-category=\"AI & SYSTEMS\">AI & systems</button><button class=\"chip-button\" data-skill-category=\"RESEARCH & STRATEGY\">Research & strategy</button></div><section class=\"skill-grid\" id=\"skill-grid\"></section><section class=\"method\"><h2>A capability is a practice, not a label.</h2><p>Skills are connected to the situations, decisions, tools, and quality signals where they become observable.</p><div class=\"steps\"><article class=\"step\"><span class=\"step-index\">01 / NOTICE</span><h3>Start with a trigger</h3><p>Identify the situation that calls the capability into use.</p></article><article class=\"step\"><span class=\"step-index\">02 / INSPECT</span><h3>Look for behavior</h3><p>Separate what someone does from a tool, trait, or job title.</p></article><article class=\"step\"><span class=\"step-index\">03 / VALIDATE</span><h3>Check the context</h3><p>Use evidence and realistic work to test whether the skill holds.</p></article></div></section></main>";
  pageShell("skills", content);
  var category = "All";
  function update() {
    var query = (document.getElementById("skill-search").value || "").toLowerCase().trim();
    var filtered = skills.filter(function (skill) { return (category === "All" || skill.category === category) && (!query || (skill.name + " " + skill.description + " " + skill.people).toLowerCase().indexOf(query) !== -1); });
    document.getElementById("skill-grid").innerHTML = filtered.map(function (skill) {
      return "<article class=\"skill-card\"><span class=\"kicker\">" + esc(skill.category) + " <span class=\"tag\">Synthesized</span></span><h2>" + esc(skill.name) + "</h2><p>" + esc(skill.description) + "</p><div class=\"skill-meta\"><span>1–2 personas</span><span>" + esc(skill.people) + "</span></div></article>";
    }).join("") || "<div class=\"empty\">No skills match that search.</div>";
    document.getElementById("skill-count").textContent = "Showing " + filtered.length + " featured skills";
  }
  document.getElementById("skill-search").addEventListener("input", update);
  document.querySelectorAll("[data-skill-category]").forEach(function (button) { button.addEventListener("click", function () { category = button.getAttribute("data-skill-category"); document.querySelectorAll("[data-skill-category]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); update(); }); });
  update();
}

function renderTools() {
  var content = hero("SHARED SYSTEM RESOURCE", "Tools are capabilities with boundaries.", "A canonical catalog for tools, connectors, workspaces, and MCP adapters. Personas and skills reference this space; playbooks coordinate it; usage records improve it over time.", null);
  content += "<main class=\"page-main\"><div class=\"tool-summary\"><div class=\"summary-cell\"><span class=\"kicker\">Tool records</span><strong>7</strong><p>Connected tools, research references, execution environments, and MCP adapters.</p></div><div class=\"summary-cell\"><span class=\"kicker\">Current state</span><strong>Reference first</strong><p>Availability is explicit; planned or unverified tools do not appear connected.</p></div><div class=\"summary-cell\"><span class=\"kicker\">Learning rule</span><strong>Evidence before reuse</strong><p>One attempt creates a usage note. Repeated or reviewed evidence creates shared guidance.</p></div></div><div class=\"section-intro\"><h2>Tool catalog</h2><p>Browse by what the tool is for, not just by vendor. Each record keeps scope, risk, and fallback visible.</p></div><div class=\"collection-tools\"><button class=\"chip-button is-active\" data-tool-filter=\"All\">All records</button><button class=\"chip-button\" data-tool-filter=\"WORKING RECORD\">Working</button><button class=\"chip-button\" data-tool-filter=\"NEEDS VALIDATION\">Needs validation</button><button class=\"chip-button\" data-tool-filter=\"PLANNED\">Planned</button></div><section class=\"skill-grid\" id=\"tool-grid\"></section><section class=\"recipe-band\"><h2>Tool-use recipes</h2><p>A recipe binds a portable skill to a task in this tool. It keeps vendor-specific instructions reusable without making the core skill tool-dependent.</p></section></main>";
  pageShell("tools", content);
  var filter = "All";
  function update() {
    var list = tools.filter(function (tool) { return filter === "All" || tool.status === filter; });
    document.getElementById("tool-grid").innerHTML = list.map(function (tool) {
      return "<article class=\"tool-card\"><span class=\"tool-status\">" + esc(tool.status) + " · " + esc(tool.kind) + "</span><h2>" + esc(tool.name) + "</h2><p>" + esc(tool.description) + "</p><div class=\"tool-actions\">" + tool.actions.map(function (action) { return "<span class=\"mini-pill\">" + esc(action) + "</span>"; }).join("") + "</div><div class=\"card-footer\"><small>" + esc(tool.scope) + "<br>" + esc(tool.risk) + "</small><button class=\"text-button\" type=\"button\">Record boundary →</button></div></article>";
    }).join("");
  }
  document.querySelectorAll("[data-tool-filter]").forEach(function (button) { button.addEventListener("click", function () { filter = button.getAttribute("data-tool-filter"); document.querySelectorAll("[data-tool-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); update(); }); });
  update();
}

function renderPlaybooks() {
  var content = hero("COMPOSED WORKFLOWS / OUTCOME SYSTEMS", "Playbooks compose the system.", "A playbook coordinates personas, skills, workflows, evidence, artifacts, and quality gates around a meaningful outcome. It is the layer for work that is larger than any one persona or skill.", null);
  content += "<main class=\"page-main\"><div class=\"section-intro\"><h2>Choose a playbook</h2><p>Start with a compact view of the available operating models. Open a preview for the shape of the work, then go deeper only when you need the full sequence.</p></div><section class=\"playbook-grid\">" + playbooks.map(function (book, index) { return "<article class=\"playbook-card\"><span class=\"kicker\">" + book.type + " · WORKING MODEL</span><h2>" + esc(book.name) + "</h2><p>" + esc(book.description) + "</p><div class=\"skill-meta\"><span>" + esc(book.meta) + "</span><button class=\"text-button\" data-preview=\"" + index + "\">Quick preview +</button></div><div class=\"preview\"><ol>" + book.steps.map(function (step) { return "<li>" + esc(step) + "</li>"; }).join("") + "</ol></div></article>"; }).join("") + "</section><section class=\"long-section\"><h2>How the layers fit</h2><p>The library stays understandable when each layer has one job. Personas describe who is operating, skills describe what they can do, tool-use recipes make a capability practical in a named tool, and playbooks coordinate the work.</p><div class=\"layer-grid\"><article class=\"layer\"><span class=\"step-index\">01 / PRIMITIVES</span><h3>Personas + core skills</h3><p>The reusable material of the system.</p></article><article class=\"layer\"><span class=\"step-index\">02 / TRANSLATION</span><h3>Tool-use recipes</h3><p>The task-specific binding that makes a skill usable in a particular tool.</p></article><article class=\"layer\"><span class=\"step-index\">03 / COMPOSITION</span><h3>Workflows + stages</h3><p>The way work is organized and handed off.</p></article><article class=\"layer\"><span class=\"step-index\">04 / INSTANCE</span><h3>Project + evidence</h3><p>The specific situation being worked on.</p></article></div></section></main>";
  pageShell("playbooks", content);
  document.querySelectorAll("[data-preview]").forEach(function (button) { button.addEventListener("click", function () { var card = button.closest(".playbook-card"); card.classList.toggle("is-open"); button.textContent = card.classList.contains("is-open") ? "Close preview −" : "Quick preview +"; }); });
}

const docPages = {
  guide: {
    eyebrow: "DOCUMENTATION / SHARED LANGUAGE",
    title: "The system has a shared language.",
    copy: "A working guide to the objects, boundaries, relationships, and operating loops that keep Personas understandable as the library grows.",
    sections: [
      ["Mental model", "The library has four layers: personas, skills, tool-use recipes, and playbooks. Each layer answers a different question and stays useful because it does not absorb the work of the others."],
      ["Skill contract", "A skill names an observable capability, its triggers, operating loop, quality signals, and boundaries. A strong skill can be applied by more than one person without flattening their context."],
      ["Tool maintenance", "Tool records describe capability, scope, permission, approval, fallback, and evidence. Planned or unverified tools remain visible as such; the catalog never implies access that has not been checked."],
      ["Playbooks", "Playbooks coordinate stages, participants, handoffs, decision rights, shared state, quality gates, and learning loops around a meaningful outcome."]
    ]
  },
  decisions: {
    eyebrow: "DECISIONS / DURABLE CHOICES",
    title: "Decisions keep the system legible.",
    copy: "A small set of explicit choices protects the library from becoming a pile of names, duplicated capabilities, or invisible assumptions.",
    sections: [
      ["Personas are lenses, not labels.", "Records are prompts for better questions. They describe operating context and pressure points; they do not claim to represent every person in a role."],
      ["Skills stay portable.", "A capability belongs in Skills when it can travel across tools and contexts. Vendor-specific instructions belong in a tool-use recipe."],
      ["Availability is explicit.", "A tool is only connected when its access and behavior have been observed. Planned and fallback resources remain clearly marked."],
      ["Changes leave a trace.", "When a record changes, the surrounding relationships, dependent artifacts, and next handoff should remain recoverable."]
    ]
  },
  prototyping: {
    eyebrow: "PROTOTYPING / ISOLATED LEARNING",
    title: "Prototype the behavior before the commitment.",
    copy: "Small, bounded prototypes make questions tangible while keeping uncertain ideas separate from the working system.",
    sections: [
      ["Prototype with a question.", "Start with the decision the prototype should inform. Choose the lightest realistic representation that can produce useful evidence."],
      ["Keep the boundary visible.", "Prototype records are isolated from the canonical library until the concept, language, and behavior have earned a place."],
      ["Inspect the interaction.", "Check the default, loading, empty, error, transition, and recovery states—not only the happy path."],
      ["Close the loop.", "End with a decision, an open question, or a concrete next experiment. Do not let a prototype become an unowned second system."]
    ]
  }
};

function renderDocPage(page) {
  var data = docPages[page];
  var content = hero(data.eyebrow, data.title, data.copy, null);
  content += "<main class=\"page-main\"><div class=\"note-grid\">" + data.sections.map(function (section, index) { return "<article class=\"note-card\"><span class=\"step-index\">0" + (index + 1) + " / NOTE</span><h3>" + esc(section[0]) + "</h3><p>" + esc(section[1]) + "</p></article>"; }).join("") + "</div><section class=\"long-section\"><h2>Make the next move obvious.</h2><p>Every durable record should help a reader answer three questions: where am I, what matters here, and what should happen next?</p><ul class=\"list\"><li>Start with the context and the decision in front of the person.</li><li>Keep evidence, boundaries, and uncertainty visible.</li><li>Leave a trace that another person can inspect and use.</li></ul></section></main>";
  pageShell(page, content);
}

function showPerson(personId) {
  var person = personas.find(function (item) { return item.id === personId; });
  if (!person) return;
  var backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = "<section class=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"person-title\"><button class=\"modal-close\" aria-label=\"Close\">×</button><span class=\"avatar\">" + esc(person.initials) + "</span><h2 id=\"person-title\">" + esc(person.name) + "</h2><p class=\"descriptor\">" + esc(person.role) + " · " + esc(person.descriptor) + "</p><p class=\"quote\">“" + esc(person.quote) + "”</p><div class=\"detail-grid\"><div class=\"detail-box\"><strong>Role group</strong><span>" + esc(person.group) + "</span></div><div class=\"detail-box\"><strong>Workflow mix</strong><span>" + esc(person.mix) + "</span></div><div class=\"detail-box\"><strong>Useful lens</strong><span>" + esc(person.tags.join(" · ")) + "</span></div><div class=\"detail-box\"><strong>Working status</strong><span>Working draft · inspect context before reuse.</span></div></div></section>";
  document.body.appendChild(backdrop);
  function close() { backdrop.remove(); }
  backdrop.addEventListener("click", function (event) { if (event.target === backdrop || event.target.closest(".modal-close")) close(); });
  document.addEventListener("keydown", function onKey(event) { if (event.key === "Escape") { close(); document.removeEventListener("keydown", onKey); } });
}

document.addEventListener("click", function (event) {
  var button = event.target.closest("[data-person]");
  if (button) showPerson(button.getAttribute("data-person"));
});

var currentPage = document.body.getAttribute("data-page") || "home";
if (currentPage === "home") renderHome();
if (currentPage === "skills") renderSkills();
if (currentPage === "tools") renderTools();
if (currentPage === "playbooks") renderPlaybooks();
if (currentPage === "guide" || currentPage === "decisions" || currentPage === "prototyping") renderDocPage(currentPage);

