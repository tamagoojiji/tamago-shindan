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
  },
  {
    id: "reservation-sim",
    path: "apps/reservation-sim/",
    icon: "📅",
    title: "予約管理シミュレーション",
    desc: "サンプル予約を入力してカレンダー表示を体験！予約管理の便利さを実感できます。",
    tag: "体験型 / 約1分",
    publishDate: "2026-03-03T00:00:00"
  },
  {
    id: "menu-creator",
    path: "apps/menu-creator/",
    icon: "📝",
    title: "メニュー表作成",
    desc: "メニュー項目を入力するだけでプロ級のメニュー表を作成。画像保存でSNSにも使えます。",
    tag: "体験型 / 約2分",
    publishDate: "2026-03-05T00:00:00"
  },
  {
    id: "sales-report",
    path: "apps/sales-report/",
    icon: "💰",
    title: "売上日報",
    desc: "日々の売上をサクッと入力。週次・月次サマリーで経営を見える化できます。",
    tag: "実用型 / データ保存",
    publishDate: "2026-03-07T00:00:00"
  }
];
