/**
 * 業務効率化診断 - 質問データ + 結果レベル + レコメンドロジック
 */
var SHINDAN_CONFIG = {
  appName: "業務効率化診断",
  recommendTitle: "最初に自動化すべき業務 TOP3",

  questions: [
    {
      id: "q1",
      category: "scheduling",
      categoryLabel: "予約管理",
      question: "予約管理はどうしていますか？",
      choices: [
        { label: "紙の手帳で管理している", points: 0 },
        { label: "スマホカレンダーに手動で入力", points: 1 },
        { label: "予約サイトを使うが確認は手動", points: 2 },
        { label: "予約〜リマインドまで自動化済み", points: 3 }
      ]
    },
    {
      id: "q2",
      category: "invoicing",
      categoryLabel: "請求書",
      question: "請求書の作成・送付はどうしていますか？",
      choices: [
        { label: "手書きまたはExcelで毎回作成", points: 0 },
        { label: "テンプレートをコピーして編集", points: 1 },
        { label: "クラウド請求書サービスを利用", points: 2 },
        { label: "自動作成・自動送付まで設定済み", points: 3 }
      ]
    },
    {
      id: "q3",
      category: "followup",
      categoryLabel: "顧客フォロー",
      question: "お客様へのフォローアップ連絡はどうしていますか？",
      choices: [
        { label: "特にフォローはしていない", points: 0 },
        { label: "思い出したときに個別連絡", points: 1 },
        { label: "リストを作って定期的に連絡", points: 2 },
        { label: "ステップメール等で自動化済み", points: 3 }
      ]
    },
    {
      id: "q4",
      category: "sns",
      categoryLabel: "SNS運用",
      question: "SNSの投稿管理はどうしていますか？",
      choices: [
        { label: "気が向いたときに投稿するだけ", points: 0 },
        { label: "ネタをメモしておいて都度投稿", points: 1 },
        { label: "投稿カレンダーを作って計画的に", points: 2 },
        { label: "予約投稿・分析ツールで効率化", points: 3 }
      ]
    },
    {
      id: "q5",
      category: "accounting",
      categoryLabel: "経理",
      question: "経費の記録・管理はどうしていますか？",
      choices: [
        { label: "レシートを箱に入れておくだけ", points: 0 },
        { label: "Excelや紙の帳簿に手動記入", points: 1 },
        { label: "会計ソフトに手動入力", points: 2 },
        { label: "レシート撮影→自動仕分けまで完了", points: 3 }
      ]
    },
    {
      id: "q6",
      category: "crm",
      categoryLabel: "顧客管理",
      question: "お客様の情報管理はどうしていますか？",
      choices: [
        { label: "特に管理していない・記憶頼り", points: 0 },
        { label: "ノートや紙のカルテに記録", points: 1 },
        { label: "Excelやスプレッドシートで管理", points: 2 },
        { label: "CRMツールで一元管理している", points: 3 }
      ]
    },
    {
      id: "q7",
      category: "inventory",
      categoryLabel: "在庫管理",
      question: "在庫や備品の管理はどうしていますか？",
      choices: [
        { label: "目視で確認・なくなったら注文", points: 0 },
        { label: "在庫リストを紙やメモで管理", points: 1 },
        { label: "スプレッドシートで数量を管理", points: 2 },
        { label: "在庫管理システムで自動発注", points: 3 }
      ]
    },
    {
      id: "q8",
      category: "payment",
      categoryLabel: "決済",
      question: "お客様からの代金回収はどうしていますか？",
      choices: [
        { label: "現金手渡し・振込のみ", points: 0 },
        { label: "現金+たまにPayPay等を使用", points: 1 },
        { label: "キャッシュレス決済を導入済み", points: 2 },
        { label: "オンライン決済+自動請求まで完了", points: 3 }
      ]
    },
    {
      id: "q9",
      category: "marketing",
      categoryLabel: "集客",
      question: "新規のお客様の集客はどうしていますか？",
      choices: [
        { label: "口コミ・紹介のみで特に施策なし", points: 0 },
        { label: "チラシやポスティングがメイン", points: 1 },
        { label: "SNSやブログで情報発信している", points: 2 },
        { label: "広告運用+LP+自動集客の仕組みあり", points: 3 }
      ]
    },
    {
      id: "q10",
      category: "communication",
      categoryLabel: "チーム連絡",
      question: "スタッフとの情報共有はどうしていますか？",
      choices: [
        { label: "口頭での伝達がメイン", points: 0 },
        { label: "LINEグループで個別に連絡", points: 1 },
        { label: "チャットツール+共有ドキュメント", points: 2 },
        { label: "業務管理ツールで一元化済み", points: 3 }
      ]
    }
  ],

  levels: [
    {
      maxPercent: 25,
      name: "手作業マスター",
      message: "ほとんどの業務を手作業でこなしています。まずは1つだけでも自動化してみると、驚くほど時間が生まれますよ！"
    },
    {
      maxPercent: 50,
      name: "デジタル半歩め",
      message: "デジタルツールを使い始めていますが、まだ手動作業が多い状態。次のステップとして「自動化」に挑戦してみましょう！"
    },
    {
      maxPercent: 75,
      name: "効率化チャレンジャー",
      message: "かなり効率的に業務を進めています！あと少し自動化を進めれば、さらに時間とコストを削減できます。"
    },
    {
      maxPercent: 100,
      name: "自動化の達人",
      message: "素晴らしい！業務の自動化がしっかりできています。この仕組みを維持・改善し続けましょう！"
    }
  ],

  getRecommendations: function (answers) {
    var adviceMap = {
      scheduling: "Googleカレンダー+予約システム連携で、ダブルブッキング防止＆リマインド自動送信ができます",
      invoicing: "freeeやMisocaなどのクラウド請求書を使えば、月末の請求作業が10分で完了します",
      followup: "LINE公式アカウントのステップ配信で、来店後のフォローを完全自動化できます",
      sns: "投稿予約ツール（Meta Business Suite等）を使えば、月初にまとめて投稿を仕込めます",
      accounting: "マネーフォワードやfreeeのレシート撮影機能で、経費入力を90%削減できます",
      crm: "顧客管理ツール（Notion・Airtable等）に移行すれば、お客様情報を瞬時に検索できます",
      inventory: "スプレッドシート+GASで在庫が一定数を切ったら自動通知する仕組みが作れます",
      payment: "Square・STORESなどでオンライン決済を導入すれば、未回収リスクもゼロに",
      marketing: "Instagram+LINE公式の組み合わせで、SNS集客→リスト化を自動化できます",
      communication: "Slack・Notion等のツールで「言った言わない」問題を解消できます"
    };

    // スコアが低い順にソート → TOP3
    var sorted = answers.slice().sort(function (a, b) {
      return a.points - b.points;
    });

    var recommendations = [];
    for (var i = 0; i < sorted.length && recommendations.length < 3; i++) {
      if (sorted[i].points <= 1) {
        recommendations.push({
          category: sorted[i].categoryLabel,
          advice: adviceMap[sorted[i].category] || ""
        });
      }
    }
    return recommendations;
  }
};
