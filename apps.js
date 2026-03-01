/**
 * アプリ一覧と公開スケジュール
 * publishDate が現在日時より前のアプリのみ一覧に表示される
 * 新しいアプリを追加するときはこの配列に追加するだけ
 */
var APP_LIST = [
  {
    id: "efficiency",
    path: "apps/efficiency/",
    icon: "⚡",
    title: "業務効率化診断",
    desc: "あなたのビジネスの「自動化レベル」を診断。今すぐ効率化すべき業務がわかります。",
    tag: "10問 / 約2分",
    publishDate: "2026-02-28T00:00:00"
  },
  {
    id: "tax-prep",
    path: "apps/tax-prep/",
    icon: "📋",
    title: "確定申告準備度チェック",
    desc: "確定申告の準備がどれくらいできているかをチェック。不足項目がひと目でわかります。",
    tag: "10問 / 約2分",
    publishDate: "2026-02-28T00:00:00"
  },
  {
    id: "repeat-rate",
    path: "apps/repeat-rate/",
    icon: "🔄",
    title: "リピート率診断",
    desc: "お店のリピート施策がどれくらいできているかを診断。改善ポイントがすぐにわかります。",
    tag: "10問 / 約2分",
    publishDate: "2026-02-28T00:00:00"
  }
];
