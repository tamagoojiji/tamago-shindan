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

    // 円グラフ
    var centerX = 540;
    var centerY = 420;
    var radius = 150;

    // 背景円
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#E8DDD2";
    ctx.fill();

    // スコア円
    var angle = (shareData.percent / 100) * Math.PI * 2;
    var color = shareData.percent >= 75 ? "#27AE60" : shareData.percent >= 50 ? "#F5A623" : "#E74C3C";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // 中央の白い円
    ctx.beginPath();
    ctx.arc(centerX, centerY, 110, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF8F0";
    ctx.fill();

    // パーセント
    ctx.fillStyle = "#F5A623";
    ctx.font = "bold 64px 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(shareData.percent + "%", centerX, centerY - 10);

    // スコア
    ctx.fillStyle = "#888";
    ctx.font = "28px 'Hiragino Sans', sans-serif";
    ctx.fillText(shareData.score + " / " + shareData.maxScore, centerX, centerY + 40);

    // レベル名
    ctx.fillStyle = "#1B2A4A";
    ctx.font = "bold 48px 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(shareData.levelName, 540, 660);

    // フッター帯
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, 960, 1080, 6);
    ctx.fillStyle = "#1B2A4A";
    ctx.fillRect(0, 966, 1080, 114);

    // フッターテキスト
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px 'Hiragino Sans', sans-serif";
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
