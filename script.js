const style1 = `
* {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: sans-serif;
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f7f7f7;
  position: relative;
}

a {
  color: #666666;
}

a:hover {
  color: #CD0000;
}

h1 {
  font-size: 21px;
  color: #666666;
  margin: 0px;
  padding: 0px;
  border-bottom: 1px solid #CCCCCC;
}

h2 {
  font-size: 16px;
  color: #666666;
  margin: 5px;
  padding: 50px 0 0 0;
  border-bottom: 1px dotted #CCCCCC;
}

label {
  transition: all 0.2s;
}

#toggle {
  display: none;
}

#label_toggle {
  display: block;
  width: 100px;
  text-align: center;
  padding: 0;
  border: 2px solid #CD0000;
  background-color: #FFFFFF;
  color: #CD0000;
  border-radius: 15px;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1005;
}

#label_toggle:hover {
  background-color: #CD0000;
  color: #FFFFFF;
}

header {
  display: block;
  width: 0px;
  height: 100%;
  position: fixed;
  background-color: #FFFFFF;
  border-left: 1px solid #CCCCCC;
  z-index: 2;
  top: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.2s;
  padding: 50px 0 0 0;
  box-sizing: border-box;
}

#toggle:checked+header {
  width: 200px;
}

header label {
  display: block;
  width: 180px;
  margin: 0 5px;
  padding: 5px;
  border-bottom: 1px dotted #EFEFEF;
}

header label input[type="checkbox"] {
  margin-right: 5px;
}

label:hover {
  cursor: pointer;
  background-color: #EFEFEF;
}

.wrapper {
  display: block;
  width: calc(100% - 30px);
  max-width: 1100px;
  padding: 30px 15px 100px 15px;
  margin: 0 AUTO;
  overflow: hidden;
  position: relative;
  background-color: #FFFFFF;
}

/* ログ部分 */
dl {
  display: block;
  margin: 0;
  padding: 3px;
  box-sizing: border-box;
}

dl::after {
  display: block;
  content: "";
  clear: both;
}

dt {
  display: block;
  font-size: 0.8em;
  font-weight: bold;
  float: left;
  width: 100px;
  margin: 0;
  padding: 5px 5px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

dd {
  display: block;
  width: calc(100% - 120px);
  margin: 0;
  padding: 2px;
  float: right;
  line-height: 1.8em;
}

.zatsudan {
  width: 95%;
  margin: 0 0 0 AUTO;
  background: #f7f7f7;
  border-left: 1px solid #CCCCCC;
}

.other {
  background-color: #fff7ef;
}

.secret {
  width: 98%;
  margin: 0 0 0 AUTO;
  border-left: 3px solid #CCCCCC;
}

.group {
  background: #f9f9f9;
  border-left: 1px solid #CCCCCC;
}

@media (max-width:480px) {
  dt {
    display: inline-block;
    float: none;
    width: calc(100% - 6px);
    margin: 0;
    padding: 3px 0 0 3px;
    text-align: left;
  }
  dd {
    display: inline-block;
    width: calc(100% - 6px);
    padding: 3px;
    float: none;
  }
}
`;

const style2 = `
.tab_0 {
  background-color: #fffddf;
  border-color: #cd2b2b;
}

.tab_0.selected {
  display: none;
}

.tab_1 {
  background-color: #ffdfea;
  border-color: #E91E63;
}

.tab_1.selected {
  display: none;
}

.tab_2 {
  background-color: #ebf7ff;
  border-color: #63b7ff;
}

.tab_2.selected {
  display: none;
}

.tab_3 {
  background-color: #f1ffea;
  border-color: #8ed92b;
}

.tab_3.selected {
  display: none;
}
`;

const hideScript = `const Hide = (checkbox) => {
  const targets = document.getElementsByClassName(checkbox.id);
  for (let el of targets) {
    const contexts = el.className.split(' ');
    let hide = checkbox.checked;
    contexts.forEach(c => {
      const cb = document.getElementById(c);
      if (cb) hide &= cb.checked;
    });
    el.style.display = hide ? 'none' : '';
  }
}`;

let outputHTML = "";

function buildOutput(doc) {
  const out = document.implementation.createHTMLDocument(doc.title);
  out.head.innerHTML = `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${doc.title}</title><style>${style1}</style><style>${style2}</style>`;
  const body = out.body;
  body.innerHTML = `<label for="toggle" id="label_toggle">表示/非表示</label><input type="checkbox" id="toggle"><header><label>▽ 非表示にするタブ</label><label for="main"><input type="checkbox" onclick="Hide(this)" id="main">メイン</label><label for="zatsudan"><input type="checkbox" onclick="Hide(this)" id="zatsudan">雑談</label><label for="tab_0"><input type="checkbox" onclick="Hide(this)" id="tab_0">GM発言</label></header><div class="wrapper"><h1>${doc.title}</h1><h2>セッション開始</h2></div><footer></footer><script>${hideScript}</script>`;
  return out;
}

function parseLog(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const out = buildOutput(doc);
  const wrapper = out.body.querySelector(".wrapper");
  const articles = doc.querySelectorAll("article.p-bl__session-post");

  function formatDiceExpression(exprNode) {
    if (!exprNode) return { formula: "", result: "" };

    const label = exprNode.querySelector(".p-exp__dice-exp");
    const pip = exprNode.querySelector(".p-exp__pip");

    let formula = "";
    let result = "";

    // ダイス式の抽出
    if (label) {
      const nums = label.querySelectorAll(".p-exp__number");
      const op = label.querySelector(".p-exp__operator");
      if (nums.length === 2 && op) {
        const left = nums[0].textContent.trim();
        const operator = op.textContent.trim();
        const right = nums[1].textContent.trim();
        formula = `${left}${operator}${right}`;
      }
    }

    // 出目の抽出
    if (pip) {
      result = pip.textContent.trim();
    }
    return { formula, result };
  }

  articles.forEach((a, idx) => {
    const nameSpan = a.querySelector("header span");
    const nameRaw = nameSpan ? nameSpan.textContent.trim() : "";

    let name = nameRaw;
    let text = "";
    let cls = "zatsudan";

    const p = a.querySelector("p");
    const actspan = a.querySelector(".act_role_as");
    const spokenDiv = a.querySelector("div.p-sp__spoken-container");
    const expr = a.querySelector(".p-expression");

    if (p && p.textContent.trim()) {
      text = p.textContent.trim();

      if (spokenDiv || actspan) {
        cls = "main";
      }
      if (nameRaw === "GM") {
        cls = "group tab_0";
      }
    } else if (expr) {
      name = `${nameRaw}`;
      cls = "main";
      const { formula, result } = formatDiceExpression(expr);
      text = formula && result ? `${formula}=${result}` : "[ダイス結果不明]";
    } else {
      return;
    }

    const dl = out.createElement("dl");
    dl.setAttribute("style", `color: ${color};`);
    dl.className = cls;

    const dt = out.createElement("dt");
    dt.textContent = name;
    const dd = out.createElement("dd");
    dd.textContent = text;

    dl.appendChild(dt);
    dl.appendChild(dd);
    wrapper.appendChild(dl);
  });

  outputHTML = "<!DOCTYPE html>\n" + out.documentElement.outerHTML;
}

function handleFix() {
  const file = document.getElementById("logFile").files[0];
  if (!file) {
    alert("log.html を選択してください");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    parseLog(reader.result);
    const blob = new Blob([outputHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const dl = document.getElementById("downloadBtn");
    dl.href = url;
    dl.classList.remove("d-none");
  };
  reader.readAsText(file);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fixBtn").addEventListener("click", handleFix);
});
