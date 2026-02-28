/**
 * LIFF SDKラッパー
 * LINE内で開いた場合はLIFF初期化、ブラウザではスキップ
 */
var ShindanLiff = (function () {
  "use strict";

  var LIFF_ID = "2009264772-rQRYx6nQ";
  var _profile = null;
  var _initialized = false;

  function init() {
    if (!LIFF_ID) return Promise.resolve();
    if (typeof liff === "undefined") return Promise.resolve();

    return liff.init({ liffId: LIFF_ID }).then(function () {
      _initialized = true;
      if (liff.isLoggedIn()) {
        return liff.getProfile().then(function (profile) {
          _profile = profile;
        }).catch(function () {
          // プロフィール取得失敗は無視
        });
      }
    }).catch(function (err) {
      console.warn("LIFF init failed:", err);
    });
  }

  function isInLiff() {
    if (typeof liff === "undefined") return false;
    return _initialized && liff.isInClient();
  }

  function getProfile() {
    return _profile ? Promise.resolve(_profile) : Promise.resolve(null);
  }

  function closeLiff() {
    if (isInLiff()) {
      liff.closeWindow();
    }
  }

  return {
    init: init,
    isInLiff: isInLiff,
    getProfile: getProfile,
    closeLiff: closeLiff
  };
})();
