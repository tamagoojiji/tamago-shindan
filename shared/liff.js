/**
 * LIFF SDKラッパー
 * ルートページで初期化 → sessionStorageに保存
 * サブページではsessionStorageから読み取り（LIFF SDK不要）
 */
var ShindanLiff = (function () {
  "use strict";

  var LIFF_ID = "2009264772-rQRYx6nQ";
  var STORAGE_KEY = "tamago_liff_profile";
  var STORAGE_FLAG = "tamago_liff_initialized";
  var _profile = null;
  var _isInClient = false;

  function init() {
    // LIFF SDKが読み込まれていない場合（サブページ）→ sessionStorageから復元
    if (typeof liff === "undefined") {
      return _restoreFromStorage();
    }

    if (!LIFF_ID) return Promise.resolve();

    return liff.init({ liffId: LIFF_ID }).then(function () {
      _isInClient = liff.isInClient();
      sessionStorage.setItem(STORAGE_FLAG, _isInClient ? "liff" : "browser");

      if (liff.isLoggedIn()) {
        return liff.getProfile().then(function (profile) {
          _profile = profile;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        }).catch(function () {
          // プロフィール取得失敗は無視
        });
      }
    }).catch(function (err) {
      console.warn("LIFF init failed:", err);
    });
  }

  function _restoreFromStorage() {
    try {
      var flag = sessionStorage.getItem(STORAGE_FLAG);
      if (flag) {
        _isInClient = (flag === "liff");
        var saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) _profile = JSON.parse(saved);
      }
    } catch (e) {
      // sessionStorage失敗は無視
    }
    return Promise.resolve();
  }

  function isInLiff() {
    return _isInClient;
  }

  function getProfile() {
    return _profile ? Promise.resolve(_profile) : Promise.resolve(null);
  }

  function closeLiff() {
    if (typeof liff !== "undefined" && _isInClient) {
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
