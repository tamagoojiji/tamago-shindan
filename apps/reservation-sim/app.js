/**
 * 予約管理シミュレーション
 * サンプル予約を入力 → カレンダー＋リスト表示で体験
 */
var ReservationApp = (function () {
  "use strict";

  var reservations = [];

  // 今日の日付をデフォルトセット
  function init() {
    var dateInput = document.getElementById("res-date");
    if (dateInput) {
      var today = new Date();
      dateInput.value = today.toISOString().split("T")[0];
    }
  }

  // サンプルデータ読み込み
  function loadSample() {
    var today = new Date();
    var samples = [
      { name: "山田花子", date: offsetDate(today, 0), time: "10:00", menu: "カット+カラー" },
      { name: "鈴木太郎", date: offsetDate(today, 0), time: "13:00", menu: "カット" },
      { name: "田中美咲", date: offsetDate(today, 1), time: "11:00", menu: "パーマ" },
      { name: "佐藤健一", date: offsetDate(today, 2), time: "14:00", menu: "整体60分" },
      { name: "高橋ゆき", date: offsetDate(today, 3), time: "10:30", menu: "トリートメント" },
      { name: "伊藤愛", date: offsetDate(today, 5), time: "15:00", menu: "ヘッドスパ" },
      { name: "渡辺翔", date: offsetDate(today, 7), time: "09:30", menu: "骨盤矯正" }
    ];

    reservations = [];
    for (var i = 0; i < samples.length; i++) {
      reservations.push(samples[i]);
    }

    renderPreview();
    FormUtils.showToast("サンプル7件を追加しました");
  }

  function offsetDate(base, days) {
    var d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  // 予約追加
  function addReservation() {
    var nameEl = document.getElementById("res-name");
    var dateEl = document.getElementById("res-date");
    var timeEl = document.getElementById("res-time");
    var menuEl = document.getElementById("res-menu");

    if (!FormUtils.validateRequired([nameEl, dateEl, timeEl])) return;

    reservations.push({
      name: nameEl.value.trim(),
      date: dateEl.value,
      time: timeEl.value,
      menu: menuEl.value
    });

    nameEl.value = "";
    renderPreview();
    FormUtils.showToast("予約を追加しました");
  }

  // 入力画面のプレビューリスト
  function renderPreview() {
    var container = document.getElementById("reservation-preview");
    var countEl = document.getElementById("reservation-count");
    var showBtn = document.getElementById("show-result-btn");

    if (reservations.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p class="empty-state-text">予約を追加してください</p></div>';
      countEl.textContent = "";
      showBtn.classList.add("hidden");
      return;
    }

    countEl.textContent = "現在 " + reservations.length + " 件の予約";
    showBtn.classList.remove("hidden");

    // 日付・時間順にソート
    var sorted = reservations.slice().sort(function (a, b) {
      return (a.date + a.time).localeCompare(b.date + b.time);
    });

    var html = "";
    for (var i = 0; i < sorted.length; i++) {
      var r = sorted[i];
      html += '<div class="reservation-item">' +
        '<div class="reservation-time">' + FormUtils.formatDate(r.date) + " " + r.time + '</div>' +
        '<div class="reservation-name">' + escapeHtml(r.name) + '</div>' +
        '<div class="reservation-menu">' + escapeHtml(r.menu) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // 結果画面表示
  function showResult() {
    FormUtils.showScreen("result-screen");
    renderCalendar();
    renderResultList();
  }

  // カレンダー描画
  function renderCalendar() {
    var area = document.getElementById("calendar-area");
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();

    // 予約がある日を集計
    var eventDays = {};
    for (var i = 0; i < reservations.length; i++) {
      var d = new Date(reservations[i].date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        var dayKey = d.getDate();
        if (!eventDays[dayKey]) eventDays[dayKey] = 0;
        eventDays[dayKey]++;
      }
    }

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = now.getDate();

    var weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    var html = '<div class="calendar-header">' +
      '<span class="calendar-title">' + year + "年 " + (month + 1) + "月</span>" +
      '</div>';

    html += '<div class="calendar-weekdays">';
    for (var w = 0; w < 7; w++) {
      html += "<div>" + weekdays[w] + "</div>";
    }
    html += "</div>";

    html += '<div class="calendar-days">';

    // 前月の空白
    for (var blank = 0; blank < firstDay; blank++) {
      html += '<div class="calendar-day other-month"></div>';
    }

    // 今月の日付
    for (var day = 1; day <= daysInMonth; day++) {
      var classes = "calendar-day";
      if (day === today) classes += " today";
      if (eventDays[day]) classes += " has-event";
      html += '<div class="' + classes + '">' + day;
      if (eventDays[day]) {
        html += '<span style="position:absolute;top:2px;right:4px;font-size:9px;color:var(--primary-dark);">' + eventDays[day] + '</span>';
      }
      html += "</div>";
    }

    html += "</div>";
    area.innerHTML = html;
  }

  // 結果画面の予約リスト
  function renderResultList() {
    var container = document.getElementById("result-list");
    var sorted = reservations.slice().sort(function (a, b) {
      return (a.date + a.time).localeCompare(b.date + b.time);
    });

    var html = "";
    var currentDate = "";
    for (var i = 0; i < sorted.length; i++) {
      var r = sorted[i];
      if (r.date !== currentDate) {
        currentDate = r.date;
        html += '<h4 style="font-size:14px;font-weight:700;color:var(--secondary);margin:16px 0 8px;">' + FormUtils.formatDate(r.date) + '</h4>';
      }
      html += '<div class="reservation-item">' +
        '<div class="reservation-time">' + r.time + '</div>' +
        '<div class="reservation-name">' + escapeHtml(r.name) + '</div>' +
        '<div class="reservation-menu">' + escapeHtml(r.menu) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // リセット
  function reset() {
    reservations = [];
    renderPreview();
    FormUtils.showScreen("input-screen");
  }

  // XSS対策
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // 初期化
  init();

  return {
    loadSample: loadSample,
    addReservation: addReservation,
    showResult: showResult,
    reset: reset
  };
})();
