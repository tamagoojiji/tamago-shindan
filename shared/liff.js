/**
 * LIFF SDKラッパー（スタブ）
 * 将来LINE統合時に実装する。現在は何もしない。
 */
var ShindanLiff = (function () {
  "use strict";

  var LIFF_ID = ""; // LINE Developers で発行後に設定

  function init() {
    // LIFF未設定時は何もしない
    if (!LIFF_ID) return Promise.resolve();

    // 将来: liff.init({ liffId: LIFF_ID })
    return Promise.resolve();
  }

  function isInLiff() {
    return false; // 将来: liff.isInClient()
  }

  function getProfile() {
    return Promise.resolve(null); // 将来: liff.getProfile()
  }

  return {
    init: init,
    isInLiff: isInLiff,
    getProfile: getProfile
  };
})();
