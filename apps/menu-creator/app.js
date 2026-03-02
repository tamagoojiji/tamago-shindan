/**
 * メニュー表作成
 * メニュー項目を入力 → プロ級メニュー表をDOM描画 → 画像保存
 */
var MenuApp = (function () {
  "use strict";

  var categoryCount = 0;
  var menuData = null; // プレビュー用に保持

  // 初期化: カテゴリ1つ追加
  function init() {
    addCategory();
  }

  // カテゴリ追加
  function addCategory() {
    categoryCount++;
    var id = "cat-" + categoryCount;
    var area = document.getElementById("categories-area");

    var section = document.createElement("div");
    section.id = id;
    section.className = "intro-card";
    section.style.cssText = "text-align:left;margin-top:12px;padding:16px;position:relative;";
    section.innerHTML =
      '<button onclick="MenuApp.removeCategory(\'' + id + '\')" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:18px;color:#ccc;cursor:pointer;">×</button>' +
      '<div class="form-group">' +
        '<label class="form-label">カテゴリ名</label>' +
        '<input type="text" class="form-input cat-name" placeholder="例：カット / カラー / パーマ">' +
      '</div>' +
      '<div class="dynamic-list menu-items-list"></div>' +
      '<button class="add-btn" onclick="MenuApp.addItem(\'' + id + '\')">+ メニュー項目を追加</button>';

    area.appendChild(section);
    addItem(id); // 最初の1項目を追加
  }

  // カテゴリ削除
  function removeCategory(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  // メニュー項目追加
  function addItem(catId) {
    var section = document.getElementById(catId);
    var list = section.querySelector(".menu-items-list");

    var item = document.createElement("div");
    item.style.cssText = "border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;position:relative;";
    item.innerHTML =
      '<button onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;font-size:16px;color:#ccc;cursor:pointer;">×</button>' +
      '<div class="form-group" style="margin-bottom:8px;">' +
        '<input type="text" class="form-input item-name" placeholder="メニュー名（例：カット）" style="padding:8px 10px;font-size:13px;">' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<input type="number" class="form-input item-price" placeholder="価格" style="padding:8px 10px;font-size:13px;">' +
        '</div>' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<input type="text" class="form-input item-desc" placeholder="説明（任意）" style="padding:8px 10px;font-size:13px;">' +
        '</div>' +
      '</div>';

    list.appendChild(item);
  }

  // サンプルデータ読み込み
  function loadSample() {
    document.getElementById("shop-name").value = "Hair Salon TAMAGO";

    // 既存カテゴリをクリア
    document.getElementById("categories-area").innerHTML = "";
    categoryCount = 0;

    var sampleData = [
      {
        category: "カット",
        items: [
          { name: "カット", price: 4400, desc: "シャンプー・ブロー込み" },
          { name: "前髪カット", price: 550, desc: "" },
          { name: "キッズカット", price: 2200, desc: "小学生以下" }
        ]
      },
      {
        category: "カラー",
        items: [
          { name: "リタッチカラー", price: 4400, desc: "根元3cm以内" },
          { name: "フルカラー", price: 6600, desc: "全体染め" },
          { name: "ハイライト", price: 3300, desc: "+カラー料金" }
        ]
      },
      {
        category: "パーマ",
        items: [
          { name: "デジタルパーマ", price: 8800, desc: "カット込み" },
          { name: "ポイントパーマ", price: 4400, desc: "" }
        ]
      },
      {
        category: "トリートメント",
        items: [
          { name: "ベーシックトリートメント", price: 2200, desc: "" },
          { name: "プレミアムトリートメント", price: 4400, desc: "集中補修" }
        ]
      }
    ];

    for (var i = 0; i < sampleData.length; i++) {
      addCategoryWithData(sampleData[i]);
    }

    FormUtils.showToast("サンプルデータを読み込みました");
  }

  // データ付きでカテゴリ追加
  function addCategoryWithData(data) {
    categoryCount++;
    var id = "cat-" + categoryCount;
    var area = document.getElementById("categories-area");

    var section = document.createElement("div");
    section.id = id;
    section.className = "intro-card";
    section.style.cssText = "text-align:left;margin-top:12px;padding:16px;position:relative;";
    section.innerHTML =
      '<button onclick="MenuApp.removeCategory(\'' + id + '\')" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:18px;color:#ccc;cursor:pointer;">×</button>' +
      '<div class="form-group">' +
        '<label class="form-label">カテゴリ名</label>' +
        '<input type="text" class="form-input cat-name" value="' + escapeAttr(data.category) + '">' +
      '</div>' +
      '<div class="dynamic-list menu-items-list"></div>' +
      '<button class="add-btn" onclick="MenuApp.addItem(\'' + id + '\')">+ メニュー項目を追加</button>';

    area.appendChild(section);

    var list = section.querySelector(".menu-items-list");
    for (var j = 0; j < data.items.length; j++) {
      var it = data.items[j];
      var item = document.createElement("div");
      item.style.cssText = "border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;position:relative;";
      item.innerHTML =
        '<button onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;font-size:16px;color:#ccc;cursor:pointer;">×</button>' +
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

  // フォームからデータ収集
  function collectData() {
    var shopName = document.getElementById("shop-name").value.trim();
    if (!shopName) {
      FormUtils.showToast("店名を入力してください");
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
        categories.push({ category: catName, items: items });
      }
    }

    if (categories.length === 0) {
      FormUtils.showToast("メニュー項目を1つ以上入力してください");
      return null;
    }

    return { shopName: shopName, categories: categories };
  }

  // DOMプレビュー表示
  function preview() {
    var data = collectData();
    if (!data) return;
    menuData = data;

    FormUtils.showScreen("preview-screen");
    renderPreview(data);
  }

  function renderPreview(data) {
    var area = document.getElementById("menu-preview-area");
    var html = '<div class="menu-preview-header">' +
      '<div class="menu-preview-shop">' + escapeHtml(data.shopName) + '</div>' +
      '<div class="menu-preview-subtitle">MENU</div>' +
      '</div>';

    for (var i = 0; i < data.categories.length; i++) {
      var cat = data.categories[i];
      html += '<div class="menu-category-section">' +
        '<div class="menu-category-title">' + escapeHtml(cat.category) + '</div>';

      for (var j = 0; j < cat.items.length; j++) {
        var item = cat.items[j];
        html += '<div class="menu-item-row">' +
          '<div>' +
            '<div class="menu-item-name">' + escapeHtml(item.name) + '</div>' +
            (item.desc ? '<div class="menu-item-desc">' + escapeHtml(item.desc) + '</div>' : '') +
          '</div>' +
          '<div class="menu-item-price">&yen;' + FormUtils.formatMoney(item.price) + '</div>' +
          '</div>';
      }

      html += '</div>';
    }

    area.innerHTML = html;
  }

  // Canvas画像生成 → 保存
  function saveImage() {
    if (!menuData) return;

    var data = menuData;
    var canvas = document.createElement("canvas");
    var W = 1080;

    // 高さを内容に応じて計算
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

    // 背景
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // 上部装飾線
    ctx.fillStyle = "#1B2A4A";
    ctx.fillRect(0, 0, W, 8);
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, 8, W, 4);

    // 店名
    ctx.fillStyle = "#1B2A4A";
    ctx.font = "bold 48px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(data.shopName, W / 2, 80);

    // MENU
    ctx.fillStyle = "#999";
    ctx.font = "20px 'Hiragino Sans', sans-serif";
    ctx.fillText("M E N U", W / 2, 116);

    // 区切り線
    ctx.strokeStyle = "#1B2A4A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 140);
    ctx.lineTo(W - 80, 140);
    ctx.stroke();

    var y = 180;

    for (var ci = 0; ci < data.categories.length; ci++) {
      var cat = data.categories[ci];

      // カテゴリ名
      ctx.fillStyle = "#E0941A";
      ctx.font = "bold 28px 'Hiragino Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(cat.category, 80, y);

      // カテゴリ下線
      ctx.strokeStyle = "#E8DDD2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, y + 10);
      ctx.lineTo(W - 80, y + 10);
      ctx.stroke();

      y += 40;

      for (var ii = 0; ii < cat.items.length; ii++) {
        var item = cat.items[ii];

        // メニュー名
        ctx.fillStyle = "#333";
        ctx.font = "24px 'Hiragino Sans', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(item.name, 100, y);

        // 価格
        ctx.fillStyle = "#1B2A4A";
        ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("\u00A5" + FormUtils.formatMoney(item.price), W - 80, y);

        // 説明
        if (item.desc) {
          y += 26;
          ctx.fillStyle = "#999";
          ctx.font = "18px 'Hiragino Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(item.desc, 110, y);
        }

        // 点線区切り
        ctx.strokeStyle = "#e0d8cc";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(100, y + 12);
        ctx.lineTo(W - 80, y + 12);
        ctx.stroke();
        ctx.setLineDash([]);

        y += 44;
      }

      y += 16;
    }

    // フッター
    var footerY = Math.max(y + 20, H - 100);
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, footerY, W, 4);
    ctx.fillStyle = "#1B2A4A";
    ctx.fillRect(0, footerY + 4, W, H - footerY - 4);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("made with @tamago.app", W / 2, footerY + 50);

    // 画像保存
    canvas.toBlob(function (blob) {
      var file = new File([blob], "menu.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: data.shopName + " メニュー表"
        }).catch(function () {});
      } else {
        var link = document.createElement("a");
        link.download = "menu.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }, "image/png");
  }

  // XSS対策
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 初期化
  init();

  return {
    addCategory: addCategory,
    removeCategory: removeCategory,
    addItem: addItem,
    loadSample: loadSample,
    preview: preview,
    saveImage: saveImage
  };
})();
