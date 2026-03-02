/**
 * 売上日報
 * 日々の売上入力 → データ永続化（GAS + localStorage） → 週次/月次サマリー
 */
var SalesApp = (function () {
  "use strict";

  var GAS_URL = "https://script.google.com/macros/s/AKfycbwj9jiMfcW7Z07L3v4Vx0_AMEQFgUzNzR1M9FQPhrqbN8ulzJgGnU3739G8YukLW8-FWA/exec";
  var sales = [];
  var userId = "";

  function start() {
    userId = FormUtils.getUserId();
    loadData();
    FormUtils.showScreen("main-screen");

    // 今日の日付セット
    var dateInput = document.getElementById("sale-date");
    if (dateInput) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }

    renderToday();
  }

  // === データ永続化 ===
  function loadData() {
    // localStorageから読み込み
    try {
      var stored = localStorage.getItem("tamago_sales_" + userId);
      if (stored) {
        sales = JSON.parse(stored);
      }
    } catch (e) {}

    // GASからも取得（マージ）
    if (GAS_URL) {
      FormUtils.gasGet(GAS_URL, { action: "list", userId: userId })
        .then(function (data) {
          if (data.ok && data.sales) {
            mergeSales(data.sales);
            saveLocal();
            renderToday();
          }
        })
        .catch(function () {});
    }
  }

  function mergeSales(remoteSales) {
    var localIds = {};
    for (var i = 0; i < sales.length; i++) {
      localIds[sales[i].id] = true;
    }
    for (var j = 0; j < remoteSales.length; j++) {
      if (!localIds[remoteSales[j].id] && !remoteSales[j].deleted) {
        sales.push(remoteSales[j]);
      }
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem("tamago_sales_" + userId, JSON.stringify(sales));
    } catch (e) {}
  }

  function saveToGas(entry) {
    if (!GAS_URL) return;
    FormUtils.gasPost(GAS_URL, {
      action: "add",
      userId: userId,
      sale: entry
    });
  }

  // === 売上追加 ===
  function addSale() {
    var dateEl = document.getElementById("sale-date");
    var itemEl = document.getElementById("sale-item");
    var amountEl = document.getElementById("sale-amount");
    var paymentEl = document.getElementById("sale-payment");

    if (!FormUtils.validateRequired([dateEl, itemEl, amountEl])) return;

    var entry = {
      id: FormUtils.generateId(),
      date: dateEl.value,
      item: itemEl.value.trim(),
      amount: Number(amountEl.value),
      paymentMethod: paymentEl.value,
      timestamp: new Date().toISOString()
    };

    sales.push(entry);
    saveLocal();
    saveToGas(entry);

    itemEl.value = "";
    amountEl.value = "";
    renderToday();
    FormUtils.showToast("売上を追加しました");
  }

  // === 削除 ===
  function deleteSale(id) {
    sales = sales.filter(function (s) { return s.id !== id; });
    saveLocal();

    if (GAS_URL) {
      FormUtils.gasPost(GAS_URL, {
        action: "delete",
        userId: userId,
        saleId: id
      });
    }

    renderToday();
    FormUtils.showToast("削除しました");
  }

  // === タブ切り替え ===
  function switchTab(tabName) {
    var tabs = document.querySelectorAll(".tab-content");
    var btns = document.querySelectorAll(".tab-btn");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
      btns[i].classList.remove("active");
    }
    document.getElementById("tab-" + tabName).classList.add("active");

    // ボタンのアクティブ化
    var tabOrder = ["input", "daily", "summary"];
    var idx = tabOrder.indexOf(tabName);
    if (idx >= 0) btns[idx].classList.add("active");

    if (tabName === "daily") renderDaily();
    if (tabName === "summary") renderSummary();
  }

  // === 今日の売上表示 ===
  function renderToday() {
    var today = document.getElementById("sale-date").value || new Date().toISOString().split("T")[0];
    var container = document.getElementById("today-sales");
    var totalEl = document.getElementById("today-total");

    var todaySales = sales.filter(function (s) { return s.date === today; });

    if (todaySales.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><p class="empty-state-text">まだ売上がありません</p></div>';
      totalEl.innerHTML = "";
      return;
    }

    var total = 0;
    var html = "";
    for (var i = 0; i < todaySales.length; i++) {
      var s = todaySales[i];
      total += s.amount;
      html += '<div class="data-card">' +
        '<div class="data-card-icon" style="background:#FFF3E0;">💰</div>' +
        '<div class="data-card-body">' +
          '<div class="data-card-title">' + escapeHtml(s.item) + '</div>' +
          '<div class="data-card-sub">' + escapeHtml(s.paymentMethod) + '</div>' +
        '</div>' +
        '<div class="data-card-right">' +
          '<div class="data-card-amount">&yen;' + FormUtils.formatMoney(s.amount) + '</div>' +
        '</div>' +
        '<button class="data-card-delete" onclick="SalesApp.deleteSale(\'' + s.id + '\')">&times;</button>' +
        '</div>';
    }
    container.innerHTML = html;
    totalEl.innerHTML = '<div class="stat-card" style="margin:0 auto;max-width:200px;">' +
      '<div class="stat-label">合計</div>' +
      '<div class="stat-value">&yen;' + FormUtils.formatMoney(total) + '</div>' +
      '</div>';
  }

  // === 日次ビュー ===
  function renderDaily() {
    var container = document.getElementById("daily-view");

    // 日付ごとに集計
    var byDate = {};
    for (var i = 0; i < sales.length; i++) {
      var s = sales[i];
      if (!byDate[s.date]) byDate[s.date] = { total: 0, count: 0 };
      byDate[s.date].total += s.amount;
      byDate[s.date].count++;
    }

    var dates = Object.keys(byDate).sort().reverse();

    if (dates.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p class="empty-state-text">データがありません</p></div>';
      return;
    }

    var html = "";
    for (var d = 0; d < dates.length && d < 14; d++) {
      var date = dates[d];
      var info = byDate[date];
      html += '<div class="data-card">' +
        '<div class="data-card-icon" style="background:#E8F5E9;">📅</div>' +
        '<div class="data-card-body">' +
          '<div class="data-card-title">' + FormUtils.formatDate(date) + '</div>' +
          '<div class="data-card-sub">' + info.count + '件</div>' +
        '</div>' +
        '<div class="data-card-right">' +
          '<div class="data-card-amount">&yen;' + FormUtils.formatMoney(info.total) + '</div>' +
        '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // === サマリービュー ===
  function renderSummary() {
    var container = document.getElementById("summary-view");

    if (sales.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><p class="empty-state-text">データがありません</p></div>';
      return;
    }

    var now = new Date();
    var thisMonth = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

    // 今週の開始日（月曜）
    var weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    var weekStartStr = weekStart.toISOString().split("T")[0];

    var weekTotal = 0, weekCount = 0;
    var monthTotal = 0, monthCount = 0;
    var dayTotals = {};

    for (var i = 0; i < sales.length; i++) {
      var s = sales[i];

      // 月次
      if (s.date.substring(0, 7) === thisMonth) {
        monthTotal += s.amount;
        monthCount++;

        if (!dayTotals[s.date]) dayTotals[s.date] = 0;
        dayTotals[s.date] += s.amount;
      }

      // 週次
      if (s.date >= weekStartStr) {
        weekTotal += s.amount;
        weekCount++;
      }
    }

    var dayValues = Object.values(dayTotals);
    var avgDay = dayValues.length > 0 ? Math.round(monthTotal / dayValues.length) : 0;
    var maxDay = dayValues.length > 0 ? Math.max.apply(null, dayValues) : 0;

    var html = '<div class="stat-row">' +
      '<div class="stat-card">' +
        '<div class="stat-label">今週</div>' +
        '<div class="stat-value">&yen;' + FormUtils.formatMoney(weekTotal) + '</div>' +
        '<div class="stat-unit">' + weekCount + '件</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-label">今月</div>' +
        '<div class="stat-value">&yen;' + FormUtils.formatMoney(monthTotal) + '</div>' +
        '<div class="stat-unit">' + monthCount + '件</div>' +
      '</div>' +
      '</div>';

    html += '<div class="stat-row">' +
      '<div class="stat-card">' +
        '<div class="stat-label">日平均</div>' +
        '<div class="stat-value">&yen;' + FormUtils.formatMoney(avgDay) + '</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-label">最高日</div>' +
        '<div class="stat-value">&yen;' + FormUtils.formatMoney(maxDay) + '</div>' +
      '</div>' +
      '</div>';

    // 日別棒グラフ（直近7日）
    var last7 = Object.keys(dayTotals).sort().slice(-7);
    if (last7.length > 0) {
      var maxVal = Math.max.apply(null, last7.map(function (d) { return dayTotals[d]; }));

      html += '<h3 class="section-title">日別売上</h3>';
      html += '<div class="bar-chart">';
      for (var d = 0; d < last7.length; d++) {
        var date = last7[d];
        var val = dayTotals[date];
        var pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
        html += '<div class="bar-row">' +
          '<div class="bar-label">' + FormUtils.formatDate(date).split("(")[0] + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="bar-value">&yen;' + FormUtils.formatMoney(val) + '</div>' +
          '</div>';
      }
      html += '</div>';
    }

    container.innerHTML = html;
  }

  // XSS対策
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    start: start,
    addSale: addSale,
    deleteSale: deleteSale,
    switchTab: switchTab
  };
})();
