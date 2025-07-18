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
  width: 110px;
  margin: 0;
  padding: 5px 8px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

dd {
  display: block;
  width: calc(100% - 140px);
  margin: 0;
  padding: 2px;
  float: right;
  line-height: 1.8em;
}

.zatsudan {
  width: 85%;
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
  width: 85%;
  margin: 0 0 0 AUTO;
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
  body.innerHTML = `<label for="toggle" id="label_toggle">表示/非表示</label><input type="checkbox" id="toggle"><header><label>▽ 非表示にするタブ</label><label for="main"><input type="checkbox" onclick="Hide(this)" id="main">発言</label><label for="zatsudan"><input type="checkbox" onclick="Hide(this)" id="zatsudan">ノーマル</label></header><div class="wrapper"><h1>${doc.title}</h1><h2>セッション開始</h2></div><footer></footer><script>${hideScript}</script>`;
  return out;
}

function parseLog(text) {
  // 1) パースして出力用ドキュメントを組み立て
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const out = buildOutput(doc); // out は Document オブジェクト想定
  const wrapper = out.body.querySelector(".wrapper");

  // 2) ダイス式の計算ヘルパー
  function formatDiceExpression(node) {
    const label = node.querySelector(".p-exp__dice-exp");
    let formula = "";
    if (label) {
      const nums = label.querySelectorAll(".p-exp__number");
      const op = label.querySelector(".p-exp__operator");
      if (nums.length === 2 && op) {
        formula = `${nums[0].textContent.trim()}${op.textContent.trim()}${nums[1].textContent.trim()}`;
      }
    }

    const total = Array.from(node.querySelectorAll(".p-exp__pip"))
      .map((el) => parseInt(el.textContent.trim(), 10) || 0)
      .reduce((s, n) => s + n, 0);

    return { formula, result: String(total) };
  }

  // 3) 各記事を走査して出力用に整形
  const articles = doc.querySelectorAll("article.p-bl__session-post");
  articles.forEach((a) => {
    const span =
      a.querySelector("span.act_role_as") || a.querySelector(".p-sp__name");
    const spanName = span ? span.textContent.trim() : "";
    const spanColor = span
      ? span.style.color || getComputedStyle(span).color
      : "";

    // — ダイス式がある場合
    const exprs = a.querySelectorAll(".p-expression");
    exprs.forEach((expr) => {
      const { formula, result } = formatDiceExpression(expr);
      if (!formula) return; // ラベルが取れなかった場合はスキップ

      const dl = out.createElement("dl");
      dl.className = "main tab_2";
      if (spanColor) dl.style.color = spanColor;

      const dt = out.createElement("dt");
      dt.textContent = spanName;
      const dd = out.createElement("dd");
      dd.textContent = `${formula}=${result}`;

      dl.append(dt, dd);
      wrapper.appendChild(dl);
    });

    // — ダイス式がまったくなければ通常の発言として処理
    if (exprs.length === 0) {
      const p = a.querySelector("p");
      const spokenDiv = a.querySelector(".p-sp__spoken-container");
      if (p && p.textContent.trim()) {
        let cls = "zatsudan";
        if (spokenDiv || spanName === "GM") cls = "main";

        const dl = out.createElement("dl");
        dl.className = cls;
        if (spanColor) dl.style.color = spanColor;

        const dt = out.createElement("dt");
        dt.textContent = spanName;
        const dd = out.createElement("dd");
        dd.innerHTML = p.innerHTML.trim();

        dl.append(dt, dd);
        wrapper.appendChild(dl);
      }
    }
  });

  // 4) 完成した HTML を文字列で返す
  return "<!DOCTYPE html>\n" + out.documentElement.outerHTML;
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
    const filename = file.name.replace(/\.html?$/, "") + "_fixed.html";
    dl.href = url;
    dl.download = filename;
    dl.classList.remove("d-none");
  };
  reader.readAsText(file);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fixBtn").addEventListener("click", handleFix);
});
