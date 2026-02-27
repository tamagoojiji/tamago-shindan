/**
 * シェア機能（Canvas画像生成→写真ライブラリ保存・結果URLコピー）
 */
var ShindanShare = (function () {
  "use strict";

  var shareData = null;
  var initialized = false;

  function init(data) {
    shareData = data;

    if (initialized) return;
    initialized = true;

    var saveBtn = document.getElementById("share-save");
    var copyBtn = document.getElementById("share-copy");

    if (saveBtn) saveBtn.addEventListener("click", saveImage);
    if (copyBtn) copyBtn.addEventListener("click", copyLink);
  }

  // === テキスト折り返し描画 ===
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = text.split("");
    var line = "";
    var currentY = y;
    var isCenter = (ctx.textAlign === "center");

    for (var i = 0; i < chars.length; i++) {
      var testLine = line + chars[i];
      var metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  // === Canvas画像生成（1080×1080） ===
  function generateImage(callback) {
    var canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    var ctx = canvas.getContext("2d");

    // 背景
    ctx.fillStyle = "#FFF8F0";
    ctx.fillRect(0, 0, 1080, 1080);

    // ヘッダー帯
    ctx.fillStyle = "#1B2A4A";
    ctx.fillRect(0, 0, 1080, 120);
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, 120, 1080, 6);

    // ヘッダーテキスト
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shareData.appName, 540, 76);

    // 円グラフ（小さめに上寄せ）
    var centerX = 540;
    var centerY = 310;
    var radius = 120;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#E8DDD2";
    ctx.fill();

    var angle = (shareData.percent / 100) * Math.PI * 2;
    var color = shareData.percent >= 75 ? "#27AE60" : shareData.percent >= 50 ? "#F5A623" : "#E74C3C";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 88, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF8F0";
    ctx.fill();

    ctx.fillStyle = "#F5A623";
    ctx.font = "bold 52px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(shareData.percent + "%", centerX, centerY - 8);

    ctx.fillStyle = "#888";
    ctx.font = "22px 'Hiragino Sans', sans-serif";
    ctx.fillText(shareData.score + " / " + shareData.maxScore, centerX, centerY + 30);

    // レベル名
    ctx.fillStyle = "#1B2A4A";
    ctx.font = "bold 44px 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(shareData.levelName, 540, 510);

    // メッセージ（折り返し）
    ctx.fillStyle = "#666";
    ctx.font = "24px 'Hiragino Sans', sans-serif";
    var msgY = wrapText(ctx, shareData.message, 540, 555, 900, 36);

    // レコメンド
    var recs = shareData.recommendations || [];
    if (recs.length > 0) {
      var recY = msgY + 30;

      ctx.fillStyle = "#1B2A4A";
      ctx.font = "bold 26px 'Hiragino Sans', sans-serif";
      ctx.fillText(shareData.recommendTitle || "改善ポイント", 540, recY);
      recY += 36;

      ctx.textAlign = "left";
      for (var i = 0; i < recs.length; i++) {
        // 番号バッジ
        ctx.fillStyle = "#F5A623";
        ctx.beginPath();
        ctx.arc(120, recY - 8, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px 'Hiragino Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(String(i + 1), 120, recY - 6);

        // カテゴリ名
        ctx.textAlign = "left";
        ctx.fillStyle = "#1B2A4A";
        ctx.font = "bold 24px 'Hiragino Sans', sans-serif";
        ctx.fillText(recs[i].category, 150, recY);

        // アドバイス
        recY += 32;
        ctx.fillStyle = "#888";
        ctx.font = "20px 'Hiragino Sans', sans-serif";
        recY = wrapText(ctx, recs[i].advice, 150, recY, 860, 28);
        recY += 16;
      }
      ctx.textAlign = "center";
    }

    // フッター帯
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, 960, 1080, 6);
    ctx.fillStyle = "#1B2A4A";
    ctx.fillRect(0, 966, 1080, 114);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("@tamago.app", 540, 1030);

    callback(canvas);
  }

  // === 画像保存（Web Share API → iOSの写真ライブラリへ） ===
  function saveImage() {
    generateImage(function (canvas) {
      canvas.toBlob(function (blob) {
        var file = new File([blob], "shindan-result.png", { type: "image/png" });

        // Web Share API（iOS Safari対応 → 共有シートから「画像を保存」）
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: shareData.appName + "の結果"
          }).catch(function () {
            // キャンセル時は何もしない
          });
        } else {
          // フォールバック: ダウンロード
          var link = document.createElement("a");
          link.download = "shindan-result.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }, "image/png");
    });
  }

  // === 結果URLコピー ===
  function copyLink() {
    var url = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        showToast("URLをコピーしました！");
      });
    } else {
      var textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("URLをコピーしました！");
    }
  }

  // === トースト表示 ===
  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  return {
    init: init,
    showToast: showToast
  };
})();
