/**
 * 自分へのご褒美タイプ診断 — エンジン（自己完結・タイプ判定型）
 * 画面遷移／質問描画／回答／タイプ集計／結果／シェア画像(1080)／リンクコピー
 */
(function () {
  "use strict";

  var data = REWARD_DATA;
  var AUTO_ADVANCE_DELAY = 350;

  var state = { index: 0, counts: {} };
  var screens = {};

  function init() {
    screens = {
      intro: document.getElementById("intro-screen"),
      quiz: document.getElementById("quiz-screen"),
      result: document.getElementById("result-screen")
    };
    document.getElementById("start-btn").addEventListener("click", start);
    document.getElementById("retry-btn").addEventListener("click", start);
    document.getElementById("share-save").addEventListener("click", saveImage);
    document.getElementById("share-copy").addEventListener("click", copyLink);
    document.getElementById("total-questions").textContent = data.questions.length;
    showScreen("intro");
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.add("hidden"); });
    screens[name].classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  function start() {
    state.index = 0;
    state.counts = {};
    Object.keys(data.types).forEach(function (k) { state.counts[k] = 0; });
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    var q = data.questions[state.index];
    var total = data.questions.length;

    document.getElementById("question-number").textContent = state.index + 1;
    document.getElementById("progress-fill").style.width =
      ((state.index + 1) / total * 100) + "%";
    document.getElementById("question-text").textContent = q.q;

    var container = document.getElementById("choices-container");
    container.replaceChildren();
    q.choices.forEach(function (choice) {
      var btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label;
      btn.addEventListener("click", function () { answer(choice, btn); });
      container.appendChild(btn);
    });
  }

  function answer(choice, btn) {
    var buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach(function (b) { b.classList.add("disabled"); });
    btn.classList.add("selected");

    state.counts[choice.type] += 1;

    setTimeout(function () {
      state.index += 1;
      if (state.index >= data.questions.length) {
        renderResult();
      } else {
        renderQuestion();
      }
    }, AUTO_ADVANCE_DELAY);
  }

  function decideType() {
    var best = null, bestCount = -1;
    data.tieOrder.forEach(function (key) {
      if (state.counts[key] > bestCount) {
        bestCount = state.counts[key];
        best = key;
      }
    });
    return data.types[best];
  }

  function renderResult() {
    var t = decideType();
    showScreen("result");

    document.getElementById("result-emoji").textContent = t.emoji;
    document.getElementById("result-name").textContent = t.name;
    document.getElementById("result-catch").textContent = t.catch;
    document.getElementById("result-comment").textContent = t.comment;
    document.getElementById("result-tip").textContent = t.tip;
    document.querySelector(".result-card").style.borderTopColor = t.color;

    state.resultType = t;
  }

  // === シェア画像（1080×1080） ===
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = text.split("");
    var line = "";
    var cy = y;
    for (var i = 0; i < chars.length; i++) {
      var test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, cy);
        line = chars[i];
        cy += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, cy);
    return cy + lineHeight;
  }

  function generateImage(callback) {
    var t = state.resultType;
    var canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    var ctx = canvas.getContext("2d");

    // 背景
    ctx.fillStyle = "#FFF6F2";
    ctx.fillRect(0, 0, 1080, 1080);

    // 上下のアクセント帯
    ctx.fillStyle = t.color;
    ctx.fillRect(0, 0, 1080, 14);
    ctx.fillRect(0, 1066, 1080, 14);

    ctx.textAlign = "center";

    // タイトル
    ctx.fillStyle = "#8A7A74";
    ctx.font = "34px 'Hiragino Sans', sans-serif";
    ctx.fillText(data.appName, 540, 120);

    // 絵文字
    ctx.font = "220px 'Hiragino Sans', sans-serif";
    ctx.fillText(t.emoji, 540, 380);

    // キャッチ
    ctx.fillStyle = "#8A7A74";
    ctx.font = "30px 'Hiragino Sans', sans-serif";
    ctx.fillText(t.catch, 540, 470);

    // タイプ名
    ctx.fillStyle = t.color;
    ctx.font = "bold 60px 'Hiragino Sans', sans-serif";
    var nameY = wrapText(ctx, "あなたは「" + t.name + "」", 540, 560, 960, 76);

    // コメント
    ctx.fillStyle = "#5A4A45";
    ctx.font = "30px 'Hiragino Sans', sans-serif";
    var cy = wrapText(ctx, t.comment, 540, nameY + 30, 860, 48);

    // おすすめごほうび
    ctx.fillStyle = t.color;
    ctx.font = "bold 30px 'Hiragino Sans', sans-serif";
    wrapText(ctx, t.tip, 540, cy + 40, 900, 44);

    // フッター
    ctx.fillStyle = "#B8A8A2";
    ctx.font = "28px 'Hiragino Sans', sans-serif";
    ctx.fillText("@tamago.app", 540, 1030);

    callback(canvas);
  }

  function saveImage() {
    generateImage(function (canvas) {
      canvas.toBlob(function (blob) {
        var file = new File([blob], "reward-type.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: data.appName + "の結果" }).catch(function () {});
        } else {
          var link = document.createElement("a");
          link.download = "reward-type.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }, "image/png");
    });
  }

  function copyLink() {
    // 結果ではなくアプリ本体URLをコピー（受け取った人が自分で診断＝拡散向き）
    var url = window.location.href.split("?")[0].split("#")[0];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast("リンクをコピーしました！"); })
        .catch(function () { toast("リンクをコピーしました！"); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast("リンクをコピーしました！");
    }
  }

  function toast(msg) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 300);
    }, 2000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
