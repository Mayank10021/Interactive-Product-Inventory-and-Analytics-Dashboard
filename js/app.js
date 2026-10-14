// JavaScript Practice Lab: page behaviour
// Change the name below and it shows up in the footer and the hero badge.
const STUDENT = { name: "Mayank Aneja", course: "JavaScript Web Development Internship" };

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */

  function toast(message) {
    const box = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    box.appendChild(el);
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 380);
    }, 2800);
  }

  function confetti() {
    if (reduceMotion) return;
    const colors = ["#5b5bf0", "#ff7a59", "#12b886", "#f5a623", "#8b7bff"];
    for (let i = 0; i < 46; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti";
      bit.style.left = Math.random() * 100 + "vw";
      bit.style.background = colors[i % colors.length];
      bit.style.animationDuration = 2 + Math.random() * 2 + "s";
      bit.style.animationDelay = Math.random() * 0.6 + "s";
      bit.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      document.body.appendChild(bit);
      setTimeout(() => bit.remove(), 4800);
    }
  }

  // Ripple on buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || reduceMotion) return;
    const rect = btn.getBoundingClientRect();
    const dot = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    dot.className = "ripple";
    dot.style.width = dot.style.height = size + "px";
    dot.style.left = e.clientX - rect.left - size / 2 + "px";
    dot.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });

  // Reveal on scroll
  const revealer = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealer.unobserve(en.target); } }),
    { threshold: 0.08 }
  );
  $$(".reveal").forEach((el) => revealer.observe(el));

  // Count-up numbers
  function animateNumber(el, to, opts) {
    const prefix = (opts && opts.prefix) || "";
    const decimals = (opts && opts.decimals) || 0;
    const from = parseFloat(el.dataset.value || "0");
    el.dataset.value = String(to);
    if (reduceMotion || from === to) {
      el.textContent = prefix + to.toFixed(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");
      return;
    }
    const start = performance.now();
    const dur = 700;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (to - from) * eased;
      el.textContent = prefix + val.toFixed(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ------------------------------------------------------------------ */
  /* Footer / hero text                                                  */
  /* ------------------------------------------------------------------ */
  $("#footName").textContent = STUDENT.name;
  $("#studentLine").textContent = STUDENT.name === "Your Name" ? STUDENT.course : STUDENT.name + " · " + STUDENT.course;

  // Hero typing demo
  (function heroTyper() {
    const box = $("#heroType");
    const demos = [
      { code: "console.log('Hello, trainer!')", out: "Hello, trainer!" },
      { code: "[1, 2, 3].map(n => n * 2)", out: "[ 2, 4, 6 ]" },
      { code: "typeof 'JavaScript'", out: "string" },
      { code: "5 * 5", out: "25" },
    ];
    let i = 0;
    function type() {
      const demo = demos[i % demos.length];
      box.innerHTML = '<div class="in">&gt; <span id="ht"></span><span class="caret"></span></div>';
      const target = $("#ht");
      let n = 0;
      const timer = setInterval(() => {
        n++;
        target.textContent = demo.code.slice(0, n);
        if (n >= demo.code.length) {
          clearInterval(timer);
          setTimeout(() => {
            box.insertAdjacentHTML("beforeend", '<div class="out">' + esc(demo.out) + "</div>");
            i++;
            setTimeout(type, 2200);
          }, 350);
        }
      }, reduceMotion ? 1 : 55);
    }
    type();
  })();

  /* ------------------------------------------------------------------ */
  /* Syntax highlighting + editor                                        */
  /* ------------------------------------------------------------------ */
  const KEYWORDS = "const|let|var|function|return|if|else|switch|case|break|continue|default|for|while|do|typeof|new|try|catch|of|true|false|null|undefined";
  const TOKEN = new RegExp(
    "(\\/\\/.*$)|(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)|\\b(" + KEYWORDS + ")\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Za-z_$][\\w$]*)(?=\\()",
    "gm"
  );

  function highlight(code) {
    let out = "";
    let last = 0;
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));
      const text = esc(m[0]);
      if (m[1]) out += '<span class="tk-com">' + text + "</span>";
      else if (m[2]) out += '<span class="tk-str">' + text + "</span>";
      else if (m[3]) out += '<span class="tk-kw">' + text + "</span>";
      else if (m[4]) out += '<span class="tk-num">' + text + "</span>";
      else out += '<span class="tk-fn">' + text + "</span>";
      last = m.index + m[0].length;
      if (m[0].length === 0) TOKEN.lastIndex++;
    }
    out += esc(code.slice(last));
    return out + "\n";
  }

  const codeBox = $("#code");
  const hlBox = $("#hl");
  const editor = $("#editor");

  function syncEditor() {
    hlBox.innerHTML = highlight(codeBox.value);
    const lines = codeBox.value.split("\n").length;
    editor.style.height = Math.min(Math.max(lines * 22.3 + 34, 190), 460) + "px";
    hlBox.parentElement.scrollTop = codeBox.scrollTop;
    hlBox.parentElement.scrollLeft = codeBox.scrollLeft;
  }
  codeBox.addEventListener("input", syncEditor);
  codeBox.addEventListener("scroll", () => {
    hlBox.parentElement.scrollTop = codeBox.scrollTop;
    hlBox.parentElement.scrollLeft = codeBox.scrollLeft;
  });
  codeBox.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = codeBox.selectionStart;
      codeBox.setRangeText("  ", s, codeBox.selectionEnd, "end");
      syncEditor();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCurrent();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Running code safely and capturing console.log                       */
  /* ------------------------------------------------------------------ */
  function inspect(value, nested) {
    if (typeof value === "string") return nested ? "'" + value + "'" : value;
    if (Array.isArray(value)) return value.length ? "[ " + value.map((v) => inspect(v, true)).join(", ") + " ]" : "[]";
    if (value && typeof value === "object") {
      const keys = Object.keys(value);
      return keys.length ? "{ " + keys.map((k) => k + ": " + inspect(value[k], true)).join(", ") + " }" : "{}";
    }
    if (typeof value === "function") return "[Function]";
    return String(value);
  }

  function runCode(code, answers) {
    const lines = [];
    const queue = answers.slice();
    // Every console.log in the student's code goes to the on-page panel AND the real browser console (F12)
    const fakeConsole = {
      log: (...args) => { lines.push({ type: "log", text: args.map((a) => inspect(a, false)).join(" ") }); console.log(...args); },
      error: (...args) => { lines.push({ type: "error", text: args.map((a) => inspect(a, false)).join(" ") }); console.error(...args); },
      warn: (...args) => { lines.push({ type: "log", text: args.map((a) => inspect(a, false)).join(" ") }); console.warn(...args); },
    };
    const fakePrompt = (message, fallback) => {
      const value = queue.length ? queue.shift() : fallback === undefined ? "" : fallback;
      lines.push({ type: "prompt", text: message + "  →  " + value });
      console.log("prompt(\"" + message + "\") → " + value);
      return String(value);
    };
    try {
      new Function("console", "prompt", code)(fakeConsole, fakePrompt);
    } catch (err) {
      lines.push({ type: "error", text: err.name + ": " + err.message });
    }
    return lines;
  }

  /* ------------------------------------------------------------------ */
  /* The six assignments                                                 */
  /* ------------------------------------------------------------------ */
  const ASSIGNMENTS = [
    {
      key: "a1", title: "Variables & Data Types",
      task: "<b>Task:</b> Declare variables with <code>var</code>, <code>let</code> and <code>const</code> for a name, age, employment status and a list of skills. Use <code>typeof</code> to check each one and log it.",
      inputs: [],
      expected: ["Name: Alice (Type: string)", "Age: 25 (Type: number)", "Is Employed: true (Type: boolean)", 'Skills: ["HTML", "CSS", "JavaScript"] (Type: object)'],
    },
    {
      key: "a2", title: "Operators & Input",
      task: "<b>Task:</b> Use <code>prompt()</code> to get a bill amount and tip percentage. Convert with <code>Number()</code>, work out the total with arithmetic and assignment operators, and log a tidy summary.",
      inputs: [{ label: "Bill amount ($)", value: "100" }, { label: "Tip percentage (%)", value: "15" }],
      expected: ["Subtotal: $100", "Tip Percentage: 15%", "Calculated Tip: $15", "Total Amount to Pay: $115"],
    },
    {
      key: "a3", title: "Conditional Logic",
      task: "<b>Task:</b> Check a test score with <code>if...else</code>, turn it into a letter grade with <code>switch</code>, and use a ternary operator to print Passed or Failed.",
      inputs: [{ label: "Test score (0-100)", value: "85" }],
      expected: ["Score: 85", "Grade: B", "Status: Passed"],
    },
    {
      key: "a4", title: "Loop Control",
      task: "<b>Task:</b> Print the 5 times table with a <code>for</code> loop, find the first number over 10 divisible by 6 with <code>while</code> and <code>break</code>, then use <code>do...while</code> with <code>continue</code> to skip numbers.",
      inputs: [],
      expected: ["-- Multiplication Table of 5 --", "5 x 1 = 5", "5 x 2 = 10", "5 x 3 = 15", "5 x 4 = 20", "5 x 5 = 25", "-- First number > 10 divisible by 6 --", "Found: 12"],
    },
    {
      key: "a5", title: "Functions & Scope",
      task: "<b>Task:</b> Write a standard function and an arrow function with default parameters to find a rectangle's area, then show what function scope and block scope do.",
      inputs: [],
      expected: ["Standard Function Area (Default 5x4): 20", "Arrow Function Area (Custom 10x3): 30", "Scope Test Error: ReferenceError: blockVar is not defined (when accessed outside block)"],
    },
    {
      key: "a6", title: "Arrays, Objects & Methods",
      task: "<b>Task:</b> Build an array of product objects. Use <code>forEach()</code> to print them, <code>filter()</code> for the cheap ones, and <code>map()</code> to create formatted strings.",
      inputs: [],
      expected: [
        "-- All Products (forEach) --", "Item: Laptop - Price: $800", "Item: Mouse - Price: $25", "Item: Keyboard - Price: $45",
        "-- Filtered Products (Price < $50) --", "[ { name: 'Mouse', price: 25 }, { name: 'Keyboard', price: 45 } ]",
        "-- Mapped Product Tags (map) --", '[ "LAPTOP costs $800", "MOUSE costs $25", "KEYBOARD costs $45" ]',
      ],
    },
  ];

  const done = new Set();
  let current = 0;
  let runToken = 0;

  const list = $("#asgList");
  ASSIGNMENTS.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "asg";
    btn.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="t">' + esc(a.title) + '</span><span class="tick">&#10003;</span>';
    btn.addEventListener("click", () => loadAssignment(i));
    list.appendChild(btn);
  });

  function setChip(kind, text) {
    const chip = $("#matchChip");
    chip.className = "badge " + kind;
    chip.textContent = text;
  }

  function renderOutput(lines) {
    const box = $("#out");
    box.innerHTML = "";
    if (!lines.length) {
      box.innerHTML = '<div class="empty">The code ran but printed nothing.</div>';
      return;
    }
    lines.forEach((ln, i) => {
      const row = document.createElement("div");
      let cls = "ln";
      if (ln.type === "prompt") cls += " prompt";
      if (ln.type === "error") cls += " error";
      if (ln.type === "log" && /^-- .* --$/.test(ln.text)) cls += " hd";
      row.className = cls;
      row.style.animationDelay = (reduceMotion ? 0 : i * 70) + "ms";
      row.textContent = ln.text;
      box.appendChild(row);
    });
  }

  function loadAssignment(i) {
    current = i;
    const a = ASSIGNMENTS[i];
    $$(".asg").forEach((b, idx) => b.classList.toggle("active", idx === i));
    $("#asgKicker").textContent = "Assignment " + (i + 1);
    $("#asgTitle").textContent = a.title;
    $("#asgTask").innerHTML = a.task;
    $("#expected").textContent = a.expected.join("\n");

    const inputs = $("#asgInputs");
    inputs.innerHTML = "";
    a.inputs.forEach((inp, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "field";
      wrap.innerHTML = '<label for="in' + idx + '">' + esc(inp.label) + '</label><input id="in' + idx + '" type="text" value="' + esc(inp.value) + '" />';
      inputs.appendChild(wrap);
    });
    $("#runHint").textContent = a.inputs.length ? "These values answer the prompt() boxes in the code. Ctrl + Enter runs it too." : "Tip: Ctrl + Enter runs it too.";

    codeBox.value = window.SNIPPETS[a.key];
    syncEditor();
    $("#out").innerHTML = '<div class="empty">Nothing yet. Hit Run and let\'s see what happens.</div>';
    setChip("idle", "Not run yet");

    const work = $("#work");
    work.classList.remove("swap");
    void work.offsetWidth;
    work.classList.add("swap");
  }

  function matchesExpected(lines, expected) {
    const logs = lines.filter((l) => l.type === "log").map((l) => l.text);
    let at = 0;
    for (let i = 0; i < logs.length && at < expected.length; i++) {
      if (logs[i] === expected[at]) at++;
    }
    return at === expected.length;
  }

  function runCurrent() {
    const a = ASSIGNMENTS[current];
    const btn = $("#runBtn");
    const token = ++runToken;
    btn.disabled = true;
    btn.innerHTML = "Running…";

    const answers = $$("#asgInputs input").map((el) => el.value);
    console.log("%c===== Assignment " + (current + 1) + ": " + a.title + " =====", "color:#5b5bf0;font-weight:bold");
    const lines = runCode(codeBox.value, answers);

    setTimeout(() => {
      if (token !== runToken) return;
      renderOutput(lines);
      btn.disabled = false;
      btn.innerHTML = "&#9654; Run code";

      const hasError = lines.some((l) => l.type === "error");
      const edited = codeBox.value !== window.SNIPPETS[a.key] || a.inputs.some((inp, idx) => $$("#asgInputs input")[idx].value !== inp.value);

      if (hasError) {
        setChip("warn", "Something broke. Check the red line");
      } else if (matchesExpected(lines, a.expected)) {
        setChip("ok", "✓ Matches the expected output");
        if (!done.has(current)) {
          done.add(current);
          $$(".asg")[current].classList.add("done");
          const n = done.size;
          $("#progressText").textContent = n + " / " + ASSIGNMENTS.length;
          $("#progressBar").style.width = (n / ASSIGNMENTS.length) * 100 + "%";
          if (n === ASSIGNMENTS.length) {
            confetti();
            toast("All six assignments done. Nicely done!");
          }
        }
      } else if (edited) {
        setChip("info", "Custom run: output differs from the sample");
      } else {
        setChip("warn", "Doesn't match the sample yet");
      }
    }, reduceMotion ? 0 : 280);
  }

  $("#runBtn").addEventListener("click", runCurrent);
  $("#resetBtn").addEventListener("click", () => { loadAssignment(current); toast("Code reset to the original."); });
  $("#copyBtn").addEventListener("click", () => {
    const text = codeBox.value;
    const ok = () => toast("Code copied to clipboard.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, () => { codeBox.select(); document.execCommand("copy"); ok(); });
    } else {
      codeBox.select(); document.execCommand("copy"); ok();
    }
  });

  loadAssignment(0);

  /* ------------------------------------------------------------------ */
  /* Capstone dashboard                                                  */
  /* ------------------------------------------------------------------ */
  const Inv = window.Inventory;
  let inventory = Inv.seed();
  let lastAdded = null;
  let freshName = null;
  let filter = "All";
  let reportLogged = false;

  const AVATAR_COLORS = ["#5b5bf0", "#ff7a59", "#12b886", "#f5a623", "#8b7bff", "#e5484d", "#2f9bd6"];
  const avatarColor = (name) => AVATAR_COLORS[(name.charCodeAt(0) + name.length) % AVATAR_COLORS.length];

  const num = (id, fallback) => {
    const v = Number($(id).value);
    return isNaN(v) ? fallback : v;
  };
  const settings = () => ({ tax: num("#tax", 0), discount: num("#disc", 0), limit: num("#limit", 200) > 0 ? num("#limit", 200) : 200 });

  // Filter chips
  const filterBox = $("#filters");
  ["All", "Budget", "Standard", "Premium"].forEach((name) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chipbtn" + (name === filter ? " on" : "");
    b.textContent = name;
    b.addEventListener("click", () => {
      filter = name;
      $$(".chipbtn", filterBox).forEach((x) => x.classList.toggle("on", x === b));
      renderTable();
    });
    filterBox.appendChild(b);
  });

  function renderTable() {
    const body = $("#rows");
    body.innerHTML = "";
    const shown = inventory.filter((p) => filter === "All" || p.category === filter);
    $("#emptyState").hidden = shown.length > 0;
    $("#emptyState").textContent = inventory.length ? "No products in this category yet." : "Nothing here yet. Add your first product on the left.";

    shown.forEach((p) => {
      const tr = document.createElement("tr");
      if (p.name === freshName) tr.className = "enter";
      tr.innerHTML =
        '<td><div class="prodname"><span class="avatar" style="background:' + avatarColor(p.name) + '">' + esc(p.name.charAt(0).toUpperCase()) + "</span>" + esc(p.name) + "</div></td>" +
        '<td class="price">' + Inv.money(p.price) + "</td>" +
        '<td><span class="cat ' + p.category + '">' + p.category + "</span></td>" +
        '<td style="text-align:right"><button class="x" type="button" aria-label="Remove ' + esc(p.name) + '">&#10005;</button></td>';
      $(".x", tr).addEventListener("click", () => {
        tr.classList.add("leaving");
        setTimeout(() => {
          const idx = Inv.findProduct(inventory, p.name);
          if (idx !== -1) inventory.splice(idx, 1);
          if (lastAdded && lastAdded.name === p.name) lastAdded = null;
          freshName = null;
          refresh();
        }, reduceMotion ? 0 : 280);
      });
      body.appendChild(tr);
    });
  }

  function renderStats() {
    const s = settings();
    const total = Inv.calculateTotal(inventory);
    const avg = inventory.length ? total / inventory.length : 0;
    animateNumber($("#sCount"), inventory.length);
    animateNumber($("#sTotal"), total, { prefix: "$", decimals: 2 });
    animateNumber($("#sAvg"), avg, { prefix: "$", decimals: 2 });
    animateNumber($("#sFinal"), Inv.applyTaxAndDiscount(total, s.tax, s.discount), { prefix: "$", decimals: 2 });
  }

  function renderReport(animated) {
    const s = settings();
    const lines = Inv.buildReport(inventory, { limit: s.limit, tax: s.tax, discount: s.discount, lastAdded: lastAdded });
    // animated === true means the user just did something, so print the report in the real console too
    if (animated || !reportLogged) {
      reportLogged = true;
      lines.forEach((text) => console.log(text));
    }
    const box = $("#report");
    box.innerHTML = "";
    lines.forEach((text, i) => {
      const row = document.createElement("div");
      row.className = "ln" + (text.indexOf("---") === 0 ? " hd" : "");
      row.style.animationDelay = (animated && !reduceMotion ? i * 90 : 0) + "ms";
      if (!animated) row.style.animation = "none";
      row.textContent = text;
      box.appendChild(row);
    });
  }

  function refresh() {
    renderTable();
    renderStats();
    renderReport(false);
    freshName = null;
  }

  function showError(message) {
    const el = $("#formErr");
    el.textContent = message;
    el.classList.remove("shake");
    void el.offsetWidth;
    if (message) el.classList.add("shake");
  }

  function handleAdd(name, price) {
    const result = Inv.addProduct(inventory, name, price);
    if (!result.ok) {
      showError(result.message);
      return false;
    }
    showError("");
    lastAdded = result.product;
    freshName = result.product.name;
    filter = "All";
    $$(".chipbtn", filterBox).forEach((x, i) => x.classList.toggle("on", i === 0));
    renderTable();
    renderStats();
    renderReport(true);
    freshName = null;
    toast(result.message);
    return true;
  }

  $("#addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (handleAdd($("#pName").value, $("#pPrice").value)) {
      $("#pName").value = "";
      $("#pPrice").value = "";
      $("#pName").focus();
    }
  });

  $("#promptBtn").addEventListener("click", () => {
    const name = window.prompt("Enter the new product name:");
    if (name === null) return;
    const price = window.prompt("Enter its price ($):");
    if (price === null) return;
    handleAdd(name, price);
  });

  $("#sampleBtn").addEventListener("click", () => {
    $("#pName").value = "Monitor";
    $("#pPrice").value = "150";
    const ok = handleAdd("Monitor", "150");
    if (ok) { $("#pName").value = ""; $("#pPrice").value = ""; }
  });

  $("#messyBtn").addEventListener("click", () => {
    const messy = [
      { name: "Keyboard", price: "45" },
      { name: "", price: "10" },
      { name: "Cable", price: "abc" },
      { name: "Webcam", price: "-5" },
      { name: "laptop", price: "900" },
      { name: "Headset", price: "$60" },
    ];
    const report = Inv.addMany(inventory, messy);
    if (report.added.length) {
      lastAdded = report.added[report.added.length - 1];
      freshName = lastAdded.name;
    }
    renderTable();
    renderStats();
    renderReport(true);
    freshName = null;

    const skipped = report.skipped.map((s) => "<li>" + esc(s.entry.name || "(no name)") + " &rarr; " + esc(s.reason) + "</li>").join("");
    $("#importReport").innerHTML =
      '<div class="import-report"><b class="g">' + report.added.length + " added</b> &middot; <b class=\"r\">" + report.skipped.length + " skipped</b>" +
      "<ul>" + skipped + "</ul></div>";
    toast("Import finished. Bad rows were skipped with continue.");
  });

  $("#resetInvBtn").addEventListener("click", () => {
    inventory = Inv.seed();
    lastAdded = null;
    freshName = null;
    filter = "All";
    $$(".chipbtn", filterBox).forEach((x, i) => x.classList.toggle("on", i === 0));
    $("#importReport").innerHTML = "";
    showError("");
    refresh();
    toast("Inventory reset.");
  });

  $("#replayBtn").addEventListener("click", () => renderReport(true));

  $("#tax").addEventListener("input", () => { $("#taxVal").textContent = $("#tax").value + "%"; renderStats(); renderReport(false); });
  $("#disc").addEventListener("input", () => { $("#discVal").textContent = $("#disc").value + "%"; renderStats(); renderReport(false); });
  $("#limit").addEventListener("input", () => renderReport(false));

  refresh();
})();
