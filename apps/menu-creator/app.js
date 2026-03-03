/**
 * メニュー表作成
 * メニュー項目を入力 → テーマ選択 → プロ級メニュー表をDOM描画 → Canvas画像保存
 */
var MenuApp = (function () {
  "use strict";

  // ==================== Step 1: データ定義 ====================

  var THEMES = {
    elegant: {
      id: "elegant",
      label: "エレガント",
      icon: "\u2728",
      font: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
      fontSub: "'Hiragino Sans', sans-serif",
      colors: [
        { primary: "#1B2A4A", accent: "#C9A84C", bg: "#FFFFFF", text: "#333333", sub: "#999999", border: "#E8DDD2" },
        { primary: "#2C1810", accent: "#B8860B", bg: "#FFF8F0", text: "#333333", sub: "#999999", border: "#E0D0C0" },
        { primary: "#1A1A2E", accent: "#E94560", bg: "#FFFFFF", text: "#333333", sub: "#888888", border: "#E0E0E0" },
        { primary: "#2D3436", accent: "#D4A574", bg: "#FFFBF5", text: "#333333", sub: "#999999", border: "#E8DDD2" },
        { primary: "#4A0E2E", accent: "#C49B66", bg: "#FFFFFF", text: "#333333", sub: "#888888", border: "#DDD0C8" },
        { primary: "#1B3A4B", accent: "#F0C987", bg: "#FFFFF5", text: "#333333", sub: "#999999", border: "#E0DDD0" }
      ]
    },
    natural: {
      id: "natural",
      label: "\u30CA\u30C1\u30E5\u30E9\u30EB",
      icon: "\uD83C\uDF3F",
      font: "'Hiragino Sans', sans-serif",
      fontSub: "'Hiragino Sans', sans-serif",
      colors: [
        { primary: "#4A6741", accent: "#8B7355", bg: "#F5F0E8", text: "#3E3E3E", sub: "#8B8B7A", border: "#D4C9B0" },
        { primary: "#5B7553", accent: "#A0855B", bg: "#FAF6F0", text: "#3E3E3E", sub: "#8B8B7A", border: "#DDD5C5" },
        { primary: "#6B705C", accent: "#DDBEA9", bg: "#FFFCF2", text: "#3E3E3E", sub: "#888878", border: "#E0D8C8" },
        { primary: "#3D5A3A", accent: "#C9B97A", bg: "#F8F5ED", text: "#3E3E3E", sub: "#8B8B7A", border: "#D8D0B8" },
        { primary: "#5F6B4E", accent: "#CC8866", bg: "#FFF8F0", text: "#3E3E3E", sub: "#8B8B7A", border: "#E0D0B8" },
        { primary: "#4E6E58", accent: "#D4A87A", bg: "#F5F2EC", text: "#3E3E3E", sub: "#8B8B7A", border: "#D8CCBB" }
      ]
    },
    simple: {
      id: "simple",
      label: "\u30B7\u30F3\u30D7\u30EB",
      icon: "\u25AB\uFE0F",
      font: "'Hiragino Sans', sans-serif",
      fontSub: "'Hiragino Sans', sans-serif",
      colors: [
        { primary: "#222222", accent: "#666666", bg: "#FFFFFF", text: "#222222", sub: "#999999", border: "#E0E0E0" },
        { primary: "#333333", accent: "#888888", bg: "#F8F8F8", text: "#333333", sub: "#AAAAAA", border: "#E8E8E8" },
        { primary: "#111111", accent: "#555555", bg: "#FFFFFF", text: "#222222", sub: "#999999", border: "#DDDDDD" },
        { primary: "#2C2C2C", accent: "#777777", bg: "#FAFAFA", text: "#2C2C2C", sub: "#AAAAAA", border: "#E5E5E5" },
        { primary: "#1A1A1A", accent: "#444444", bg: "#FFFFFF", text: "#222222", sub: "#888888", border: "#D0D0D0" },
        { primary: "#3A3A3A", accent: "#999999", bg: "#F5F5F5", text: "#333333", sub: "#BBBBBB", border: "#E0E0E0" }
      ]
    },
    pop: {
      id: "pop",
      label: "\u30DD\u30C3\u30D7",
      icon: "\uD83C\uDF80",
      font: "'Hiragino Sans', sans-serif",
      fontSub: "'Hiragino Sans', sans-serif",
      colors: [
        { primary: "#E75480", accent: "#FFB6C1", bg: "#FFF5F7", text: "#4A3040", sub: "#B88A9A", border: "#F0D0DA" },
        { primary: "#FF6B6B", accent: "#FFE66D", bg: "#FFFEF5", text: "#4A4040", sub: "#B8A08A", border: "#F0E0C8" },
        { primary: "#6C5CE7", accent: "#A29BFE", bg: "#F8F7FF", text: "#3A3050", sub: "#9A8AB0", border: "#E0D8F0" },
        { primary: "#00B894", accent: "#55EFC4", bg: "#F0FFF8", text: "#2A4A3A", sub: "#7AA898", border: "#C8E8D8" },
        { primary: "#E17055", accent: "#FAB1A0", bg: "#FFF8F5", text: "#4A3830", sub: "#B89888", border: "#F0D8C8" },
        { primary: "#0984E3", accent: "#74B9FF", bg: "#F5F9FF", text: "#2A3A4A", sub: "#8AA0B8", border: "#D0E0F0" }
      ]
    }
  };

  var CATEGORY_ICONS = [
    { keywords: ["\u30AB\u30C3\u30C8", "\u30D8\u30A2", "\u9AEA"], icon: "\u2702\uFE0F" },
    { keywords: ["\u30AB\u30E9\u30FC", "\u67D3\u3081", "\u30EA\u30BF\u30C3\u30C1"], icon: "\uD83C\uDFA8" },
    { keywords: ["\u30D1\u30FC\u30DE", "\u30A6\u30A7\u30FC\u30D6"], icon: "\uD83D\uDC87\u200D\u2640\uFE0F" },
    { keywords: ["\u30C8\u30EA\u30FC\u30C8\u30E1\u30F3\u30C8", "\u30B1\u30A2", "\u30D8\u30C3\u30C9\u30B9\u30D1"], icon: "\uD83D\uDC86" },
    { keywords: ["\u30CD\u30A4\u30EB", "\u30B8\u30A7\u30EB"], icon: "\uD83D\uDC85" },
    { keywords: ["\u30DE\u30C3\u30B5\u30FC\u30B8", "\u6574\u4F53", "\u30DC\u30C7\u30A3"], icon: "\uD83D\uDE4C" },
    { keywords: ["\u30D5\u30FC\u30C9", "\u6599\u7406", "\u30E9\u30F3\u30C1"], icon: "\uD83C\uDF7D\uFE0F" },
    { keywords: ["\u30C9\u30EA\u30F3\u30AF", "\u30B3\u30FC\u30D2\u30FC"], icon: "\u2615" },
    { keywords: ["\u30C7\u30B6\u30FC\u30C8", "\u30B9\u30A4\u30FC\u30C4"], icon: "\uD83C\uDF70" },
    { keywords: ["\u30E8\u30AC", "\u30D5\u30A3\u30C3\u30C8\u30CD\u30B9"], icon: "\uD83E\uDDD8\u200D\u2640\uFE0F" },
    { keywords: ["\u307E\u3064\u6BDB", "\u30A2\u30A4\u30E9\u30C3\u30B7\u30E5"], icon: "\uD83D\uDC41\uFE0F" },
    { keywords: ["\u30A8\u30B9\u30C6", "\u30D5\u30A7\u30A4\u30B7\u30E3\u30EB"], icon: "\uD83C\uDF38" }
  ];

  // State
  var categoryCount = 0;
  var menuData = null;
  var currentTheme = "elegant";
  var currentColorIndex = 0;

  // ==================== Step 4: ヘルパー ====================

  function getActiveColors() {
    var theme = THEMES[currentTheme];
    return theme.colors[currentColorIndex];
  }

  function getActiveTheme() {
    return THEMES[currentTheme];
  }

  function getCategoryIcon(name) {
    for (var i = 0; i < CATEGORY_ICONS.length; i++) {
      var entry = CATEGORY_ICONS[i];
      for (var j = 0; j < entry.keywords.length; j++) {
        if (name.indexOf(entry.keywords[j]) !== -1) {
          return entry.icon;
        }
      }
    }
    return "\u25C6";
  }

  // ==================== テーマ・カラー選択 ====================

  function selectTheme(id) {
    currentTheme = id;
    currentColorIndex = 0;

    // カードのactive切替
    var cards = document.querySelectorAll(".theme-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle("active", cards[i].dataset.theme === id);
    }

    renderColorSwatches();

    // プレビュー表示中なら再描画
    if (menuData) renderPreview(menuData);
  }

  function selectColor(index) {
    currentColorIndex = index;

    var swatches = document.querySelectorAll(".color-swatch");
    for (var i = 0; i < swatches.length; i++) {
      swatches[i].classList.toggle("active", i === index);
    }

    if (menuData) renderPreview(menuData);
  }

  function renderColorSwatches() {
    var container = document.getElementById("color-swatches");
    if (!container) return;
    var theme = THEMES[currentTheme];
    var html = "";
    for (var i = 0; i < theme.colors.length; i++) {
      var c = theme.colors[i];
      var cls = i === currentColorIndex ? " active" : "";
      html += '<button class="color-swatch' + cls + '" onclick="MenuApp.selectColor(' + i + ')" ' +
        'style="background: linear-gradient(135deg, ' + c.primary + ' 50%, ' + c.accent + ' 50%);" ' +
        'aria-label="カラー' + (i + 1) + '"></button>';
    }
    container.innerHTML = html;
  }

  // ==================== 初期化 ====================

  function init() {
    addCategory();
    renderColorSwatches();
    // デフォルトテーマをactive
    var defaultCard = document.querySelector('.theme-card[data-theme="elegant"]');
    if (defaultCard) defaultCard.classList.add("active");
  }

  // ==================== カテゴリ・アイテム管理 ====================

  function addCategory() {
    categoryCount++;
    var id = "cat-" + categoryCount;
    var area = document.getElementById("categories-area");

    var section = document.createElement("div");
    section.id = id;
    section.className = "intro-card";
    section.style.cssText = "text-align:left;margin-top:12px;padding:16px;position:relative;";
    section.innerHTML =
      '<button onclick="MenuApp.removeCategory(\'' + id + '\')" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:18px;color:#ccc;cursor:pointer;">\u00D7</button>' +
      '<div class="form-group">' +
        '<label class="form-label">\u30AB\u30C6\u30B4\u30EA\u540D</label>' +
        '<input type="text" class="form-input cat-name" placeholder="\u4F8B\uFF1A\u30AB\u30C3\u30C8 / \u30AB\u30E9\u30FC / \u30D1\u30FC\u30DE">' +
      '</div>' +
      '<div class="dynamic-list menu-items-list"></div>' +
      '<button class="add-btn" onclick="MenuApp.addItem(\'' + id + '\')">+ \u30E1\u30CB\u30E5\u30FC\u9805\u76EE\u3092\u8FFD\u52A0</button>';

    area.appendChild(section);
    addItem(id);
  }

  function removeCategory(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  function addItem(catId) {
    var section = document.getElementById(catId);
    var list = section.querySelector(".menu-items-list");

    var item = document.createElement("div");
    item.style.cssText = "border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;position:relative;";
    item.innerHTML =
      '<button onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;font-size:16px;color:#ccc;cursor:pointer;">\u00D7</button>' +
      '<div class="form-group" style="margin-bottom:8px;">' +
        '<input type="text" class="form-input item-name" placeholder="\u30E1\u30CB\u30E5\u30FC\u540D\uFF08\u4F8B\uFF1A\u30AB\u30C3\u30C8\uFF09" style="padding:8px 10px;font-size:13px;">' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<input type="number" class="form-input item-price" placeholder="\u4FA1\u683C" style="padding:8px 10px;font-size:13px;">' +
        '</div>' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<input type="text" class="form-input item-desc" placeholder="\u8AAC\u660E\uFF08\u4EFB\u610F\uFF09" style="padding:8px 10px;font-size:13px;">' +
        '</div>' +
      '</div>';

    list.appendChild(item);
  }

  // ==================== サンプルデータ ====================

  function loadSample() {
    document.getElementById("shop-name").value = "Hair Salon TAMAGO";
    document.getElementById("categories-area").innerHTML = "";
    categoryCount = 0;

    var sampleData = [
      { category: "\u30AB\u30C3\u30C8", items: [
        { name: "\u30AB\u30C3\u30C8", price: 4400, desc: "\u30B7\u30E3\u30F3\u30D7\u30FC\u30FB\u30D6\u30ED\u30FC\u8FBC\u307F" },
        { name: "\u524D\u9AEA\u30AB\u30C3\u30C8", price: 550, desc: "" },
        { name: "\u30AD\u30C3\u30BA\u30AB\u30C3\u30C8", price: 2200, desc: "\u5C0F\u5B66\u751F\u4EE5\u4E0B" }
      ]},
      { category: "\u30AB\u30E9\u30FC", items: [
        { name: "\u30EA\u30BF\u30C3\u30C1\u30AB\u30E9\u30FC", price: 4400, desc: "\u6839\u51433cm\u4EE5\u5185" },
        { name: "\u30D5\u30EB\u30AB\u30E9\u30FC", price: 6600, desc: "\u5168\u4F53\u67D3\u3081" },
        { name: "\u30CF\u30A4\u30E9\u30A4\u30C8", price: 3300, desc: "+\u30AB\u30E9\u30FC\u6599\u91D1" }
      ]},
      { category: "\u30D1\u30FC\u30DE", items: [
        { name: "\u30C7\u30B8\u30BF\u30EB\u30D1\u30FC\u30DE", price: 8800, desc: "\u30AB\u30C3\u30C8\u8FBC\u307F" },
        { name: "\u30DD\u30A4\u30F3\u30C8\u30D1\u30FC\u30DE", price: 4400, desc: "" }
      ]},
      { category: "\u30C8\u30EA\u30FC\u30C8\u30E1\u30F3\u30C8", items: [
        { name: "\u30D9\u30FC\u30B7\u30C3\u30AF\u30C8\u30EA\u30FC\u30C8\u30E1\u30F3\u30C8", price: 2200, desc: "" },
        { name: "\u30D7\u30EC\u30DF\u30A2\u30E0\u30C8\u30EA\u30FC\u30C8\u30E1\u30F3\u30C8", price: 4400, desc: "\u96C6\u4E2D\u88DC\u4FEE" }
      ]}
    ];

    for (var i = 0; i < sampleData.length; i++) {
      addCategoryWithData(sampleData[i]);
    }
    FormUtils.showToast("\u30B5\u30F3\u30D7\u30EB\u30C7\u30FC\u30BF\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F");
  }

  function addCategoryWithData(data) {
    categoryCount++;
    var id = "cat-" + categoryCount;
    var area = document.getElementById("categories-area");

    var section = document.createElement("div");
    section.id = id;
    section.className = "intro-card";
    section.style.cssText = "text-align:left;margin-top:12px;padding:16px;position:relative;";
    section.innerHTML =
      '<button onclick="MenuApp.removeCategory(\'' + id + '\')" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:18px;color:#ccc;cursor:pointer;">\u00D7</button>' +
      '<div class="form-group">' +
        '<label class="form-label">\u30AB\u30C6\u30B4\u30EA\u540D</label>' +
        '<input type="text" class="form-input cat-name" value="' + escapeAttr(data.category) + '">' +
      '</div>' +
      '<div class="dynamic-list menu-items-list"></div>' +
      '<button class="add-btn" onclick="MenuApp.addItem(\'' + id + '\')">+ \u30E1\u30CB\u30E5\u30FC\u9805\u76EE\u3092\u8FFD\u52A0</button>';

    area.appendChild(section);

    var list = section.querySelector(".menu-items-list");
    for (var j = 0; j < data.items.length; j++) {
      var it = data.items[j];
      var item = document.createElement("div");
      item.style.cssText = "border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;position:relative;";
      item.innerHTML =
        '<button onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;font-size:16px;color:#ccc;cursor:pointer;">\u00D7</button>' +
        '<div class="form-group" style="margin-bottom:8px;">' +
          '<input type="text" class="form-input item-name" value="' + escapeAttr(it.name) + '" style="padding:8px 10px;font-size:13px;">' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group" style="margin-bottom:0;">' +
            '<input type="number" class="form-input item-price" value="' + it.price + '" style="padding:8px 10px;font-size:13px;">' +
          '</div>' +
          '<div class="form-group" style="margin-bottom:0;">' +
            '<input type="text" class="form-input item-desc" value="' + escapeAttr(it.desc) + '" style="padding:8px 10px;font-size:13px;">' +
          '</div>' +
        '</div>';
      list.appendChild(item);
    }
  }

  // ==================== フォームデータ収集 ====================

  function collectData() {
    var shopName = document.getElementById("shop-name").value.trim();
    if (!shopName) {
      FormUtils.showToast("\u5E97\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
      document.getElementById("shop-name").focus();
      return null;
    }

    var categories = [];
    var catSections = document.querySelectorAll("[id^='cat-']");

    for (var i = 0; i < catSections.length; i++) {
      var section = catSections[i];
      var catName = section.querySelector(".cat-name").value.trim();
      if (!catName) continue;

      var items = [];
      var itemDivs = section.querySelectorAll(".menu-items-list > div");
      for (var j = 0; j < itemDivs.length; j++) {
        var nameInput = itemDivs[j].querySelector(".item-name");
        var priceInput = itemDivs[j].querySelector(".item-price");
        var descInput = itemDivs[j].querySelector(".item-desc");
        var name = nameInput ? nameInput.value.trim() : "";
        var price = priceInput ? priceInput.value : "";
        var desc = descInput ? descInput.value.trim() : "";
        if (name && price) {
          items.push({ name: name, price: Number(price), desc: desc });
        }
      }

      if (items.length > 0) {
        categories.push({ category: catName, icon: getCategoryIcon(catName), items: items });
      }
    }

    if (categories.length === 0) {
      FormUtils.showToast("\u30E1\u30CB\u30E5\u30FC\u9805\u76EE\u30921\u3064\u4EE5\u4E0A\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
      return null;
    }

    return { shopName: shopName, categories: categories };
  }

  // ==================== DOMプレビュー ====================

  function preview() {
    var data = collectData();
    if (!data) return;
    menuData = data;
    FormUtils.showScreen("preview-screen");
    renderPreview(data);
  }

  function renderPreview(data) {
    var area = document.getElementById("menu-preview-area");
    var colors = getActiveColors();
    var theme = getActiveTheme();

    area.style.background = colors.bg;
    area.style.borderTop = "4px solid " + colors.primary;
    area.style.borderBottom = "4px solid " + colors.primary;

    var html = '<div class="menu-preview-header" style="border-bottom-color:' + colors.primary + ';">' +
      '<div class="menu-preview-shop" style="color:' + colors.primary + ';font-family:' + theme.font + ';">' + escapeHtml(data.shopName) + '</div>' +
      '<div class="menu-preview-subtitle" style="color:' + colors.sub + ';">M E N U</div>' +
      '</div>';

    for (var i = 0; i < data.categories.length; i++) {
      var cat = data.categories[i];
      html += '<div class="menu-category-section">' +
        '<div class="menu-category-title" style="color:' + colors.accent + ';border-bottom-color:' + colors.border + ';font-family:' + theme.font + ';">' +
        '<span style="margin-right:6px;">' + cat.icon + '</span>' + escapeHtml(cat.category) + '</div>';

      for (var j = 0; j < cat.items.length; j++) {
        var item = cat.items[j];
        html += '<div class="menu-item-row" style="border-bottom-color:' + colors.border + ';">' +
          '<div>' +
            '<div class="menu-item-name" style="color:' + colors.text + ';">' + escapeHtml(item.name) + '</div>' +
            (item.desc ? '<div class="menu-item-desc" style="color:' + colors.sub + ';">' + escapeHtml(item.desc) + '</div>' : '') +
          '</div>' +
          '<div class="menu-item-price" style="color:' + colors.primary + ';">&yen;' + FormUtils.formatMoney(item.price) + '</div>' +
          '</div>';
      }

      html += '</div>';
    }

    area.innerHTML = html;
  }

  // ==================== Step 5: Canvas描画ヘルパー ====================

  function drawLeaf(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.6, -size * 0.8, size * 0.8, -size * 0.2, 0, size * 0.4);
    ctx.bezierCurveTo(-size * 0.8, -size * 0.2, -size * 0.6, -size * 0.8, 0, -size);
    ctx.fill();
    // 葉脈
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size * 0.3);
    ctx.stroke();
    ctx.restore();
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / spikes;
    ctx.moveTo(cx, cy - outerR);
    for (var i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y - size * 0.3, x - size, y + size * 0.1, x, y + size * 0.8);
    ctx.bezierCurveTo(x + size, y + size * 0.1, x + size * 0.5, y - size * 0.3, x, y + size * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function drawDiamond(ctx, cx, cy, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.lineTo(cx + w, cy);
    ctx.lineTo(cx, cy + h);
    ctx.lineTo(cx - w, cy);
    ctx.closePath();
    ctx.fill();
  }

  // ==================== Step 5: テーマ別Canvas描画 ====================

  // --- エレガント ---
  var elegantDraw = {
    bg: function(ctx, W, H, c) {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
    },
    header: function(ctx, W, H, c, theme, shopName) {
      // 上部装飾 2本線
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, 0, W, 8);
      ctx.fillStyle = c.accent;
      ctx.fillRect(0, 8, W, 4);

      // 店名
      ctx.fillStyle = c.primary;
      ctx.font = "bold 48px " + theme.font;
      ctx.textAlign = "center";
      ctx.fillText(shopName, W / 2, 90);

      // MENU
      ctx.fillStyle = c.sub;
      ctx.font = "20px " + theme.fontSub;
      ctx.fillText("M E N U", W / 2, 126);

      // ダイヤ型ディバイダー
      var divY = 150;
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, divY);
      ctx.lineTo(W / 2 - 30, divY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 + 30, divY);
      ctx.lineTo(W - 80, divY);
      ctx.stroke();
      drawDiamond(ctx, W / 2, divY, 8, 8, c.accent);
    },
    corners: function(ctx, W, H, c) {
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      var m = 40, s = 60;
      // 左上
      ctx.beginPath();
      ctx.moveTo(m, m + s);
      ctx.quadraticCurveTo(m, m, m + s, m);
      ctx.stroke();
      // 右上
      ctx.beginPath();
      ctx.moveTo(W - m - s, m);
      ctx.quadraticCurveTo(W - m, m, W - m, m + s);
      ctx.stroke();
      // 左下
      ctx.beginPath();
      ctx.moveTo(m, H - m - s);
      ctx.quadraticCurveTo(m, H - m, m + s, H - m);
      ctx.stroke();
      // 右下
      ctx.beginPath();
      ctx.moveTo(W - m, H - m - s);
      ctx.quadraticCurveTo(W - m, H - m, W - m - s, H - m);
      ctx.stroke();
    },
    category: function(ctx, W, y, c, theme, catName, icon) {
      // アイコン + カテゴリ名
      ctx.fillStyle = c.accent;
      ctx.font = "bold 28px " + theme.font;
      ctx.textAlign = "left";
      ctx.fillText(icon + " " + catName, 80, y);

      // 装飾下線
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, y + 10);
      ctx.lineTo(W - 80, y + 10);
      ctx.stroke();
      // 小さなダイヤ
      drawDiamond(ctx, 80, y + 10, 4, 4, c.accent);
    },
    itemSep: function(ctx, W, y, c) {
      ctx.strokeStyle = c.border;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, y);
      ctx.lineTo(W - 80, y);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    footer: function(ctx, W, H, footerY, c) {
      ctx.fillStyle = c.accent;
      ctx.fillRect(0, footerY, W, 4);
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, footerY + 4, W, H - footerY - 4);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("made with @tamago.app", W / 2, footerY + 50);
    }
  };

  // --- ナチュラル ---
  var naturalDraw = {
    bg: function(ctx, W, H, c) {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
      // 背景にうっすらドット模様
      ctx.fillStyle = c.border;
      ctx.globalAlpha = 0.3;
      for (var dx = 0; dx < W; dx += 40) {
        for (var dy = 0; dy < H; dy += 40) {
          ctx.beginPath();
          ctx.arc(dx, dy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    header: function(ctx, W, H, c, theme, shopName) {
      // 上部にリーフモチーフ
      var leafY = 30;
      for (var i = 0; i < 5; i++) {
        var lx = W / 2 - 80 + i * 40;
        drawLeaf(ctx, lx, leafY, 12, c.primary);
      }

      ctx.fillStyle = c.primary;
      ctx.font = "bold 44px " + theme.font;
      ctx.textAlign = "center";
      ctx.fillText(shopName, W / 2, 90);

      ctx.fillStyle = c.sub;
      ctx.font = "18px " + theme.fontSub;
      ctx.fillText("M E N U", W / 2, 120);

      // 波型ディバイダー
      var waveY = 146;
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, waveY);
      for (var wx = 80; wx < W - 80; wx += 20) {
        ctx.quadraticCurveTo(wx + 5, waveY - 6, wx + 10, waveY);
        ctx.quadraticCurveTo(wx + 15, waveY + 6, wx + 20, waveY);
      }
      ctx.stroke();
    },
    corners: function(ctx, W, H, c) {
      // 四隅にリーフ
      drawLeaf(ctx, 50, 50, 18, c.primary);
      drawLeaf(ctx, W - 50, 50, 18, c.primary);
      drawLeaf(ctx, 50, H - 50, 18, c.primary);
      drawLeaf(ctx, W - 50, H - 50, 18, c.primary);
    },
    category: function(ctx, W, y, c, theme, catName, icon) {
      ctx.fillStyle = c.primary;
      ctx.font = "bold 28px " + theme.font;
      ctx.textAlign = "left";
      ctx.fillText(icon + " " + catName, 80, y);

      // 波型下線
      var waveY2 = y + 12;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, waveY2);
      for (var wx = 80; wx < W - 80; wx += 16) {
        ctx.quadraticCurveTo(wx + 4, waveY2 - 4, wx + 8, waveY2);
        ctx.quadraticCurveTo(wx + 12, waveY2 + 4, wx + 16, waveY2);
      }
      ctx.stroke();
    },
    itemSep: function(ctx, W, y, c) {
      ctx.strokeStyle = c.border;
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, y);
      ctx.lineTo(W - 80, y);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    footer: function(ctx, W, H, footerY, c) {
      // リーフ列
      for (var i = 0; i < 8; i++) {
        drawLeaf(ctx, 100 + i * 120, footerY + 10, 10, c.primary);
      }
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, footerY + 26, W, H - footerY - 26);

      ctx.fillStyle = c.bg;
      ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("made with @tamago.app", W / 2, footerY + 66);
    }
  };

  // --- シンプル ---
  var simpleDraw = {
    bg: function(ctx, W, H, c) {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
    },
    header: function(ctx, W, H, c, theme, shopName) {
      // ヘアライン
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, 0, W, 3);

      ctx.fillStyle = c.primary;
      ctx.font = "bold 44px " + theme.font;
      ctx.textAlign = "center";
      ctx.fillText(shopName, W / 2, 80);

      ctx.fillStyle = c.accent;
      ctx.font = "300 18px " + theme.fontSub;
      ctx.fillText("M E N U", W / 2, 112);

      // ヘアライン
      ctx.fillStyle = c.primary;
      ctx.fillRect(80, 132, W - 160, 1);
    },
    corners: function(ctx, W, H, c) {
      // L字コーナー
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 2;
      var m = 30, s = 40;

      ctx.beginPath();
      ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W - m - s, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(m, H - m - s); ctx.lineTo(m, H - m); ctx.lineTo(m + s, H - m);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W - m - s, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - s);
      ctx.stroke();
    },
    category: function(ctx, W, y, c, theme, catName, icon) {
      ctx.fillStyle = c.primary;
      ctx.font = "bold 26px " + theme.font;
      ctx.textAlign = "left";
      ctx.fillText(icon + " " + catName, 80, y);

      // ヘアライン
      ctx.fillStyle = c.border;
      ctx.fillRect(80, y + 10, W - 160, 1);
    },
    itemSep: function(ctx, W, y, c) {
      ctx.fillStyle = c.border;
      ctx.fillRect(100, y, W - 180, 1);
    },
    footer: function(ctx, W, H, footerY, c) {
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, footerY, W, 3);
      ctx.fillStyle = c.primary;
      ctx.fillRect(0, footerY + 3, W, H - footerY - 3);

      ctx.fillStyle = c.bg;
      ctx.font = "bold 22px 'Hiragino Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("made with @tamago.app", W / 2, footerY + 46);
    }
  };

  // --- ポップ ---
  var popDraw = {
    bg: function(ctx, W, H, c) {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
      // 背景に散りばめた丸
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = c.primary;
      var rng = [120, 300, 520, 700, 900, 180, 400, 650, 850];
      var rny = [60, 200, 350, 150, 280, 500, 600, 450, 700];
      for (var bi = 0; bi < rng.length; bi++) {
        ctx.beginPath();
        ctx.arc(rng[bi], rny[bi] % H, 20 + (bi % 3) * 15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    header: function(ctx, W, H, c, theme, shopName) {
      // ジグザグ上部
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, 16);
      for (var zx = W; zx >= 0; zx -= 30) {
        ctx.lineTo(zx, zx % 60 === 0 ? 16 : 8);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = c.primary;
      ctx.font = "900 46px " + theme.font;
      ctx.textAlign = "center";
      ctx.fillText(shopName, W / 2, 86);

      ctx.fillStyle = c.accent;
      ctx.font = "bold 20px " + theme.fontSub;
      ctx.fillText("\u2606 M E N U \u2606", W / 2, 118);

      // 星とハートのディバイダー
      var divY2 = 142;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(80, divY2); ctx.lineTo(W / 2 - 40, divY2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 + 40, divY2); ctx.lineTo(W - 80, divY2); ctx.stroke();
      drawStar(ctx, W / 2 - 20, divY2, 5, 8, 4, c.primary);
      drawHeart(ctx, W / 2, divY2 - 8, 10, c.primary);
      drawStar(ctx, W / 2 + 20, divY2, 5, 8, 4, c.primary);
    },
    corners: function(ctx, W, H, c) {
      // 丸・星・ハート
      var cs = 28;
      ctx.beginPath(); ctx.arc(cs + 10, cs + 10, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.accent; ctx.fill();

      drawStar(ctx, W - cs - 10, cs + 10, 5, 12, 6, c.accent);

      drawHeart(ctx, cs + 10, H - cs - 16, 12, c.accent);

      ctx.beginPath(); ctx.arc(W - cs - 10, H - cs - 10, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.accent; ctx.fill();
    },
    category: function(ctx, W, y, c, theme, catName, icon) {
      // フォント設定 → measureText → 丸背景
      ctx.font = "bold 26px " + theme.font;
      var textWidth = ctx.measureText(icon + " " + catName).width || 200;
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.25;
      var rw = Math.min(textWidth + 40, W - 120);
      // roundRect polyfill for older browsers
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(75, y - 24, rw, 34, 17);
      } else {
        var rx = 75, ry = y - 24, rh = 34, r = 17;
        ctx.moveTo(rx + r, ry);
        ctx.lineTo(rx + rw - r, ry);
        ctx.arcTo(rx + rw, ry, rx + rw, ry + r, r);
        ctx.lineTo(rx + rw, ry + rh - r);
        ctx.arcTo(rx + rw, ry + rh, rx + rw - r, ry + rh, r);
        ctx.lineTo(rx + r, ry + rh);
        ctx.arcTo(rx, ry + rh, rx, ry + rh - r, r);
        ctx.lineTo(rx, ry + r);
        ctx.arcTo(rx, ry, rx + r, ry, r);
        ctx.closePath();
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = c.primary;
      ctx.textAlign = "left";
      ctx.fillText(icon + " " + catName, 85, y);
    },
    itemSep: function(ctx, W, y, c) {
      ctx.strokeStyle = c.accent;
      ctx.setLineDash([8, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(100, y);
      ctx.lineTo(W - 80, y);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    footer: function(ctx, W, H, footerY, c) {
      // ジグザグ
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      for (var zx2 = 0; zx2 <= W; zx2 += 30) {
        ctx.lineTo(zx2, zx2 % 60 === 0 ? footerY : footerY + 8);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("made with @tamago.app", W / 2, footerY + 50);
    }
  };

  var THEME_DRAW = {
    elegant: elegantDraw,
    natural: naturalDraw,
    simple: simpleDraw,
    pop: popDraw
  };

  // ==================== Step 6: drawCanvasMenu ====================

  function drawCanvasMenu(data) {
    var theme = getActiveTheme();
    var colors = getActiveColors();
    var draw = THEME_DRAW[currentTheme];

    var canvas = document.createElement("canvas");
    var W = 1080;

    // 高さ計算
    var totalItems = 0;
    var totalDescs = 0;
    for (var c = 0; c < data.categories.length; c++) {
      totalItems += data.categories[c].items.length;
      for (var d = 0; d < data.categories[c].items.length; d++) {
        if (data.categories[c].items[d].desc) totalDescs++;
      }
    }
    var H = 240 + data.categories.length * 60 + totalItems * 50 + totalDescs * 26 + 140;
    if (H < 800) H = 800;

    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext("2d");

    // 1. 背景
    draw.bg(ctx, W, H, colors);

    // 2. コーナー
    draw.corners(ctx, W, H, colors);

    // 3. ヘッダー
    draw.header(ctx, W, H, colors, theme, data.shopName);

    // 4. コンテンツ
    var y = 190;

    for (var ci = 0; ci < data.categories.length; ci++) {
      var cat = data.categories[ci];

      draw.category(ctx, W, y, colors, theme, cat.category, cat.icon);
      y += 44;

      for (var ii = 0; ii < cat.items.length; ii++) {
        var item = cat.items[ii];

        // メニュー名
        ctx.fillStyle = colors.text;
        ctx.font = "24px " + theme.fontSub;
        ctx.textAlign = "left";
        ctx.fillText(item.name, 100, y);

        // 価格
        ctx.fillStyle = colors.primary;
        ctx.font = "bold 24px " + theme.fontSub;
        ctx.textAlign = "right";
        ctx.fillText("\u00A5" + FormUtils.formatMoney(item.price), W - 80, y);

        // 説明
        if (item.desc) {
          y += 26;
          ctx.fillStyle = colors.sub;
          ctx.font = "18px " + theme.fontSub;
          ctx.textAlign = "left";
          ctx.fillText(item.desc, 110, y);
        }

        // 区切り
        draw.itemSep(ctx, W, y + 12, colors);
        y += 44;
      }
      y += 16;
    }

    // 5. フッター
    var footerY = Math.max(y + 20, H - 100);
    draw.footer(ctx, W, H, footerY, colors);

    return canvas;
  }

  // ==================== 画像保存 ====================

  function saveImage() {
    if (!menuData) return;

    var canvas = drawCanvasMenu(menuData);

    canvas.toBlob(function (blob) {
      var file = new File([blob], "menu.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: menuData.shopName + " \u30E1\u30CB\u30E5\u30FC\u8868"
        }).catch(function () {});
      } else {
        var link = document.createElement("a");
        link.download = "menu.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }, "image/png");
  }

  // ==================== XSS対策 ====================

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ==================== 初期化実行 ====================

  init();

  return {
    addCategory: addCategory,
    removeCategory: removeCategory,
    addItem: addItem,
    loadSample: loadSample,
    preview: preview,
    saveImage: saveImage,
    selectTheme: selectTheme,
    selectColor: selectColor
  };
})();
