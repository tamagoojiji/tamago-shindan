/**
 * 診断エンジン（共通）
 * 初期化・画面遷移・質問描画・回答処理・スコアリング・結果表示
 */
var ShindanEngine = (function () {
  "use strict";

  var state = {
    questions: [],
    currentIndex: 0,
    answers: [],       // { questionId, category, points, maxPoints }
    totalScore: 0,
    maxScore: 0,
    config: null       // アプリ固有の設定（data.jsから受け取る）
  };

  var screens = {};
  var AUTO_ADVANCE_DELAY = 500; // 選択後0.5秒で次へ

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

    // イベントリスナー
    document.getElementById("start-btn").addEventListener("click", startQuiz);
    document.getElementById("retry-btn").addEventListener("click", retry);

    var backBtn = document.getElementById("back-top-btn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        // apps/xxx/ → ../../ で常にトップへ遷移（ローカル・GitHub Pages両対応）
        window.location.href = "../../";
      });
    }

    showScreen("intro");
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
    showScreen("quiz");
    renderQuestion();
  }

  // === 質問描画 ===
  function renderQuestion() {
    var q = state.questions[state.currentIndex];

    // プログレス
    var total = state.questions.length;
    document.getElementById("question-number").textContent = state.currentIndex + 1;
    document.getElementById("total-questions").textContent = total;
    document.getElementById("progress-fill").style.width =
      ((state.currentIndex + 1) / total * 100) + "%";

    // カテゴリバッジ
    var badge = document.getElementById("question-category");
    if (badge && q.categoryLabel) {
      badge.textContent = q.categoryLabel;
    }

    // 問題文
    document.getElementById("question-text").textContent = q.question;

    // 選択肢
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

    // ボタンをすべて無効化+選択したものをハイライト
    var buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach(function (btn) {
      btn.classList.add("disabled");
    });
    selectedBtn.classList.add("selected");

    // 回答を記録
    state.answers.push({
      questionId: question.id,
      category: question.category,
      categoryLabel: question.categoryLabel,
      points: choice.points,
      maxPoints: 3
    });
    state.totalScore += choice.points;

    // 0.5秒後に自動遷移
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

    // レベル判定
    var level = getLevel(percent);

    // 円グラフ
    var chart = document.getElementById("result-chart");
    var color = percent >= 75 ? "#27AE60" : percent >= 50 ? "#F5A623" : "#E74C3C";
    chart.style.background = "conic-gradient(" + color + " " + (percent * 3.6) + "deg, #E8DDD2 0deg)";

    document.getElementById("result-percent").textContent = percent + "%";
    document.getElementById("result-score").textContent = state.totalScore + " / " + state.maxScore;

    // レベル名・メッセージ
    document.getElementById("result-level").textContent = level.name;
    document.getElementById("result-message").textContent = level.message;

    // レコメンド
    renderRecommendations();

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
  function renderRecommendations() {
    var container = document.getElementById("recommend-section");
    if (!container) return;

    var recommendations = state.config.getRecommendations(state.answers);
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

  // === 外部からアクセス可能なAPI ===
  return {
    init: init,
    getState: function () { return state; }
  };
})();
