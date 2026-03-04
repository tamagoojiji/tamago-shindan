/**
 * 値段設定シミュレーター
 * 原価・作業時間・目標月収から適正価格を逆算
 */
var PricingApp = (function () {
  "use strict";

  var WORK_MINUTES_PER_DAY = 480; // 8時間固定
  var RATES = [
    { rate: 1.0, label: "100%" },
    { rate: 0.8, label: "80%" },
    { rate: 0.6, label: "60%" }
  ];

  // サンプルデータ読み込み
  function loadSample() {
    document.getElementById("menu-name").value = "カット+カラー";
    document.getElementById("cost").value = "500";
    document.getElementById("work-time").value = "90";
    document.getElementById("target-income").value = "300000";
    document.getElementById("work-days").value = "22";
    FormUtils.showToast("サンプルデータをセットしました");
  }

  // 計算実行
  function calculate() {
    var nameEl = document.getElementById("menu-name");
    var costEl = document.getElementById("cost");
    var timeEl = document.getElementById("work-time");
    var incomeEl = document.getElementById("target-income");
    var daysEl = document.getElementById("work-days");

    // バリデーション
    if (!FormUtils.validateRequired([nameEl, costEl, timeEl, incomeEl, daysEl])) return;

    var menuName = nameEl.value.trim();
    var cost = parseInt(costEl.value, 10);
    var workTime = parseInt(timeEl.value, 10);
    var targetIncome = parseInt(incomeEl.value, 10);
    var workDays = parseInt(daysEl.value, 10);

    if (workTime <= 0) {
      FormUtils.showToast("作業時間は1分以上を入力してください");
      timeEl.classList.add("input-error");
      timeEl.focus();
      return;
    }
    if (workDays <= 0) {
      FormUtils.showToast("営業日数は1日以上を入力してください");
      daysEl.classList.add("input-error");
      daysEl.focus();
      return;
    }
    if (cost < 0) {
      FormUtils.showToast("原価は0以上を入力してください");
      costEl.classList.add("input-error");
      costEl.focus();
      return;
    }
    if (targetIncome <= 0) {
      FormUtils.showToast("目標月収は1円以上を入力してください");
      incomeEl.classList.add("input-error");
      incomeEl.focus();
      return;
    }

    // 計算
    var maxPerDay = Math.floor(WORK_MINUTES_PER_DAY / workTime);
    if (maxPerDay <= 0) {
      FormUtils.showToast("作業時間が長すぎます（1日に1件も施術できません）");
      timeEl.classList.add("input-error");
      timeEl.focus();
      return;
    }
    var maxPerMonth = maxPerDay * workDays;

    var tiers = [];
    for (var i = 0; i < RATES.length; i++) {
      var r = RATES[i];
      var clients = Math.round(maxPerMonth * r.rate);
      var price = Math.ceil((targetIncome / clients) + cost);
      var profitRate = Math.round(((price - cost) / price) * 100);
      var clientsPerDay = Math.ceil(clients / workDays);
      var monthlySales = price * clients;

      tiers.push({
        rateLabel: r.label,
        rate: r.rate,
        price: price,
        profitRate: profitRate,
        clientsPerDay: clientsPerDay,
        clientsPerMonth: clients,
        monthlySales: monthlySales
      });
    }

    var result = {
      menuName: menuName,
      cost: cost,
      tiers: tiers,
      maxPerDay: maxPerDay
    };

    FormUtils.showScreen("result-screen");
    renderResult(result);
  }

  // 結果描画
  function renderResult(result) {
    var area = document.getElementById("result-area");
    var main = result.tiers[1]; // 稼働率80%をメイン表示
    var maxPrice = result.tiers[2].price; // 最大値（60%時）をバー幅の基準に

    // ヘッダー
    var html = '<h2 style="font-size:18px;font-weight:800;color:var(--secondary);text-align:center;margin-bottom:16px;">' +
      escapeHtml(result.menuName) + ' の適正価格</h2>';

    // メイン stat-card（2列）
    html += '<div class="stat-row">' +
      '<div class="stat-card">' +
        '<div class="stat-label">適正価格（稼働率80%）</div>' +
        '<div class="stat-value">¥' + FormUtils.formatMoney(main.price) + '</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-label">利益率</div>' +
        '<div class="stat-value">' + main.profitRate + '<span class="stat-unit">%</span></div>' +
      '</div>' +
    '</div>';

    // 稼働率別 比較表
    html += '<div style="background:var(--card-bg);border-radius:16px;padding:20px;box-shadow:var(--shadow);margin-bottom:16px;">';
    html += '<h3 style="font-size:15px;font-weight:700;color:var(--secondary);margin-bottom:14px;text-align:center;">稼働率別の比較</h3>';

    for (var i = 0; i < result.tiers.length; i++) {
      var t = result.tiers[i];
      var barWidth = Math.round((t.price / maxPrice) * 100);
      var isRecommended = t.rate === 0.8;

      html += '<div style="margin-bottom:14px;' + (isRecommended ? 'background:#FFF8F0;border-radius:10px;padding:10px;border:2px solid var(--primary);' : '') + '">';

      // ラベル行
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
        '<span style="font-size:13px;font-weight:700;color:' + (isRecommended ? 'var(--primary-dark)' : 'var(--text-light)') + ';">' +
          '稼働率' + t.rateLabel +
          (isRecommended ? ' ⭐おすすめ' : '') +
        '</span>' +
        '<span style="font-size:11px;color:var(--text-light);">' + t.clientsPerDay + '人/日</span>' +
      '</div>';

      // バー
      html += '<div class="bar-row" style="margin-bottom:0;">' +
        '<div class="bar-track" style="height:28px;">' +
          '<div class="bar-fill" style="width:' + barWidth + '%;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;">' +
            '<span style="font-size:12px;font-weight:700;color:#fff;">¥' + FormUtils.formatMoney(t.price) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';

      html += '</div>';
    }

    html += '</div>';

    // ひとこと分析
    var analysis = getAnalysis(result);
    html += '<div style="background:var(--card-bg);border-radius:12px;padding:16px 20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:16px;">' +
      '<div style="font-size:14px;font-weight:700;color:var(--secondary);margin-bottom:6px;">💡 ひとこと分析</div>' +
      '<div style="font-size:13px;color:var(--text-light);line-height:1.7;">' + escapeHtml(analysis) + '</div>' +
    '</div>';

    // 詳細データ
    html += '<div style="background:var(--card-bg);border-radius:12px;padding:16px 20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">' +
      '<div style="font-size:14px;font-weight:700;color:var(--secondary);margin-bottom:10px;">📊 計算詳細</div>' +
      '<div style="font-size:12px;color:var(--text-light);line-height:2;">' +
        '1日の最大施術数：' + result.maxPerDay + '人<br>' +
        '原価：¥' + FormUtils.formatMoney(result.cost) + '<br>' +
        '月の売上目安（80%稼働）：¥' + FormUtils.formatMoney(main.monthlySales) +
      '</div>' +
    '</div>';

    area.innerHTML = html;
  }

  // ひとこと分析の条件分岐
  function getAnalysis(result) {
    var main = result.tiers[1]; // 稼働率80%

    if (main.profitRate <= 30) {
      return "原価が高めです。仕入れの見直しも検討してみましょう。";
    }
    if (main.clientsPerDay >= 7) {
      return "必要客数が多めです。単価アップか時短の工夫を検討してみましょう。";
    }
    if (main.price >= 15000) {
      return "高単価メニューです。付加価値で差別化するのがポイントです。";
    }
    return "バランスの良い価格設定です。この価格帯で集客を頑張りましょう！";
  }

  // リセット
  function reset() {
    document.getElementById("menu-name").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("work-time").value = "";
    document.getElementById("target-income").value = "";
    document.getElementById("work-days").value = "";
    FormUtils.showScreen("input-screen");
  }

  // XSS対策
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    loadSample: loadSample,
    calculate: calculate,
    reset: reset
  };
})();
