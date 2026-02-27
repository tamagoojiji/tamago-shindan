/**
 * 診断エンジン（共通）
 * 初期化・画面遷移・質問描画・回答処理・スコアリング・結果表示・GAS連携
 */
var ShindanEngine = (function () {
  "use strict";

  // GAS Web App URL（デプロイ後に設定）
  var GAS_URL = "https://script.google.com/macros/s/AKfycbyCniP4JeRvGp7K0Hpl2Z0hGyXPEolxcvoabaNOUt0oNverpn4mv-wI3_SlcMFWu075/exec";

  var state = {
    questions: [],
    currentIndex: 0,
    answers: [],
    totalScore: 0,
    maxScore: 0,
    config: null
  };

  var screens = {};
  var AUTO_ADVANCE_DELAY = 500;

  // === 初期化 ===
  function init(config) {
    state.config = config;
    state.questions = config.questions;
    state.maxScore = config.questions.length * 3;

    screens = {
      intro: document.getElementById("intro-screen"),
      quiz: document.getElementById("quiz-screen"),
      result: document.getElementById("result-screen")
    };

    document.getElementById("start-btn").addEventListener("click", startQuiz);
    document.getElementById("retry-btn").addEventListener("click", retry);

    var backBtn = document.getElementById("back-top-btn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        window.location.href = "../../";
      });
    }

    // URLに結果IDがあれば保存済み結果を表示
    var resultId = getUrlParam("id");
    if (resultId && GAS_URL) {
      loadSavedResult(resultId);
    } else {
      showScreen("intro");
    }
  }

  // === URLパラメータ取得 ===
  function getUrlParam(key) {
    var params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  // === ランダムID生成（8文字） ===
  function generateId() {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var id = "";
    for (var i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // === 画面遷移 ===
  function showScreen(name) {
    Object.values(screens).forEach(function (s) {
      s.classList.add("hidden");
    });
    screens[name].classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  // === クイズ開始 ===
  function startQuiz() {
    state.currentIndex = 0;
    state.answers = [];
    state.totalScore = 0;
    // リトライ時にURLパラメータをクリア
    if (window.location.search) {
      history.replaceState(null, "", window.location.pathname);
    }
    showScreen("quiz");
    renderQuestion();
  }

  // === 質問描画 ===
  function renderQuestion() {
    var q = state.questions[state.currentIndex];

    var total = state.questions.length;
    document.getElementById("question-number").textContent = state.currentIndex + 1;
    document.getElementById("total-questions").textContent = total;
    document.getElementById("progress-fill").style.width =
      ((state.currentIndex + 1) / total * 100) + "%";

    var badge = document.getElementById("question-category");
    if (badge && q.categoryLabel) {
      badge.textContent = q.categoryLabel;
    }

    document.getElementById("question-text").textContent = q.question;

    var container = document.getElementById("choices-container");
    container.innerHTML = "";

    q.choices.forEach(function (choice, i) {
      var btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label;
      btn.addEventListener("click", function () {
        handleAnswer(i, q, btn);
      });
      container.appendChild(btn);
    });
  }

  // === 回答処理 ===
  function handleAnswer(selectedIndex, question, selectedBtn) {
    var choice = question.choices[selectedIndex];

    var buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach(function (btn) {
      btn.classList.add("disabled");
    });
    selectedBtn.classList.add("selected");

    state.answers.push({
      questionId: question.id,
      category: question.category,
      categoryLabel: question.categoryLabel,
      points: choice.points,
      maxPoints: 3
    });
    state.totalScore += choice.points;

    setTimeout(function () {
      state.currentIndex++;
      if (state.currentIndex >= state.questions.length) {
        renderResult();
      } else {
        renderQuestion();
      }
    }, AUTO_ADVANCE_DELAY);
  }

  // === 結果表示 ===
  function renderResult() {
    showScreen("result");

    var percent = Math.round((state.totalScore / state.maxScore) * 100);
    var level = getLevel(percent);

    displayResult(percent, level, state.answers);

    // GASに結果を保存
    saveToGas(percent, level);

    // シェア機能の初期化
    if (window.ShindanShare) {
      window.ShindanShare.init({
        appName: state.config.appName,
        levelName: level.name,
        percent: percent,
        score: state.totalScore,
        maxScore: state.maxScore
      });
    }
  }

  // === 結果をDOMに描画（新規・保存済み共通） ===
  function displayResult(percent, level, answers) {
    var chart = document.getElementById("result-chart");
    var color = percent >= 75 ? "#27AE60" : percent >= 50 ? "#F5A623" : "#E74C3C";
    chart.style.background = "conic-gradient(" + color + " " + (percent * 3.6) + "deg, #E8DDD2 0deg)";

    document.getElementById("result-percent").textContent = percent + "%";
    document.getElementById("result-score").textContent =
      Math.round(percent * state.maxScore / 100) + " / " + state.maxScore;

    document.getElementById("result-level").textContent = level.name;
    document.getElementById("result-message").textContent = level.message;

    // レコメンド
    renderRecommendations(answers);
  }

  // === GASに保存 ===
  function saveToGas(percent, level) {
    if (!GAS_URL) return;

    var id = generateId();

    var payload = {
      id: id,
      app: state.config.appName,
      score: state.totalScore,
      maxScore: state.maxScore,
      percent: percent,
      level: level.name,
      answers: state.answers,
      userAgent: navigator.userAgent
    };

    try {
      fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // サイレントに無視
    }

    // URLにIDを付与
    var newUrl = window.location.pathname + "?id=" + id;
    history.replaceState(null, "", newUrl);
  }

  // === 保存済み結果を読み込み（JSONP） ===
  function loadSavedResult(id) {
    // コールバック関数をグローバルに登録
    var callbackName = "_shindanCallback_" + Date.now();
    window[callbackName] = function (response) {
      // クリーンアップ
      delete window[callbackName];
      var scriptEl = document.getElementById("jsonp-loader");
      if (scriptEl) scriptEl.remove();

      if (response.ok && response.data) {
        showSavedResult(response.data);
      } else {
        // 結果が見つからない場合はイントロに戻す
        showScreen("intro");
      }
    };

    // JOSNPスクリプト読み込み
    var script = document.createElement("script");
    script.id = "jsonp-loader";
    script.src = GAS_URL + "?id=" + encodeURIComponent(id) + "&callback=" + callbackName;
    script.onerror = function () {
      delete window[callbackName];
      showScreen("intro");
    };
    document.head.appendChild(script);
  }

  // === 保存済み結果を描画 ===
  function showSavedResult(data) {
    showScreen("result");

    var percent = data.percent;
    var level = getLevel(percent);
    var answers = data.answers || [];

    // スコアを復元
    state.totalScore = data.score;
    state.answers = answers;

    displayResult(percent, level, answers);

    // シェア機能の初期化
    if (window.ShindanShare) {
      window.ShindanShare.init({
        appName: state.config.appName,
        levelName: level.name,
        percent: percent,
        score: data.score,
        maxScore: data.maxScore
      });
    }
  }

  // === レベル判定 ===
  function getLevel(percent) {
    var levels = state.config.levels;
    for (var i = 0; i < levels.length; i++) {
      if (percent <= levels[i].maxPercent) {
        return levels[i];
      }
    }
    return levels[levels.length - 1];
  }

  // === レコメンド描画 ===
  function renderRecommendations(answers) {
    var container = document.getElementById("recommend-section");
    if (!container) return;

    var recommendations = state.config.getRecommendations(answers || state.answers);
    if (recommendations.length === 0) {
      container.classList.add("hidden");
      return;
    }

    var titleEl = container.querySelector(".recommend-title");
    if (titleEl) {
      titleEl.textContent = state.config.recommendTitle || "改善ポイント";
    }

    var listEl = container.querySelector(".recommend-list");
    if (!listEl) return;

    var html = "";
    recommendations.forEach(function (rec, i) {
      html += '<div class="recommend-item fade-in">';
      html += '<div class="recommend-item-header">';
      html += '<span class="recommend-number">' + (i + 1) + '</span>';
      html += '<span class="recommend-category">' + rec.category + '</span>';
      html += '</div>';
      html += '<p class="recommend-advice">' + rec.advice + '</p>';
      html += '</div>';
    });
    listEl.innerHTML = html;
    container.classList.remove("hidden");
  }

  // === リトライ ===
  function retry() {
    startQuiz();
  }

  return {
    init: init,
    getState: function () { return state; }
  };
})();
