/**
 * 隠れ疲れ度チェック — エンジン（自己完結・スコア/レベル型）
 * 画面遷移／質問描画／回答（加点）／疲れ度%算出／レベル判定／結果／シェア画像(1080)／リンクコピー
 */
(function () {
  "use strict";

  var data = FATIGUE_DATA;
  var AUTO_ADVANCE_DELAY = 350;

  var state = { index: 0, total: 0 };
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
    state.total = 0;
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

    state.total += choice.points;

    setTimeout(function () {
      state.index += 1;
      if (state.index >= data.questions.length) {
        renderResult();
      } else {
        renderQuestion();
      }
    }, AUTO_ADVANCE_DELAY);
  }

  function getLevel(percent) {
    for (var i = 0; i < data.levels.length; i++) {
      if (percent <= data.levels[i].maxPercent) return data.levels[i];
    }
    return data.levels[data.levels.length - 1];
  }

  function renderResult() {
    var percent = Math.round((state.total / data.maxScore) * 100);
    var lv = getLevel(percent);
    showScreen("result");

    var ring = document.getElementById("result-ring");
    ring.style.background = "conic-gradient(" + lv.color + " " + (percent * 3.6) + "deg, #F0E2DC 0deg)";
    document.getElementById("result-percent").textContent = percent + "%";

    document.getElementById("result-emoji").textContent = lv.emoji;
    document.getElementById("result-name").textContent = lv.name;
    document.getElementById("result-comment").textContent = lv.comment;
    document.getElementById("result-tip").textContent = lv.tip;
    document.querySelector(".result-card").style.borderTopColor = lv.color;

    state.result = { percent: percent, level: lv };
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
    var r = state.result;
    var lv = r.level;
    var canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFF6F2";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = lv.color;
    ctx.fillRect(0, 0, 1080, 14);
    ctx.fillRect(0, 1066, 1080, 14);

    ctx.textAlign = "center";

    // タイトル
    ctx.fillStyle = "#8A7A74";
    ctx.font = "34px 'Hiragino Sans', sans-serif";
    ctx.fillText(data.appName, 540, 110);

    // 疲れ度リング
    var cx = 540, cy = 320, radius = 130;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#F0E2DC";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (r.percent / 100) * Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = lv.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 96, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF6F2";
    ctx.fill();

    ctx.fillStyle = lv.color;
    ctx.font = "bold 64px 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(r.percent + "%", cx, cy - 6);
    ctx.fillStyle = "#8A7A74";
    ctx.font = "24px 'Hiragino Sans', sans-serif";
    ctx.fillText("疲れ度", cx, cy + 40);
    ctx.textBaseline = "alphabetic";

    // 絵文字＋レベル名
    ctx.font = "90px 'Hiragino Sans', sans-serif";
    ctx.fillText(lv.emoji, 540, 560);
    ctx.fillStyle = lv.color;
    ctx.font = "bold 52px 'Hiragino Sans', sans-serif";
    var nameY = wrapText(ctx, lv.name, 540, 640, 960, 64);

    // コメント
    ctx.fillStyle = "#5A4A45";
    ctx.font = "29px 'Hiragino Sans', sans-serif";
    var commentY = wrapText(ctx, lv.comment, 540, nameY + 24, 880, 46);

    // tip
    ctx.fillStyle = lv.color;
    ctx.font = "bold 28px 'Hiragino Sans', sans-serif";
    wrapText(ctx, lv.tip, 540, commentY + 36, 920, 40);

    // フッター
    ctx.fillStyle = "#B8A8A2";
    ctx.font = "28px 'Hiragino Sans', sans-serif";
    ctx.fillText("@tamago.app", 540, 1030);

    callback(canvas);
  }

  function saveImage() {
    generateImage(function (canvas) {
      canvas.toBlob(function (blob) {
        var file = new File([blob], "fatigue-check.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: data.appName + "の結果" }).catch(function () {});
        } else {
          var link = document.createElement("a");
          link.download = "fatigue-check.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }, "image/png");
    });
  }

  function copyLink() {
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
