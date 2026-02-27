/**
 * 確定申告準備度チェック - 質問データ + 結果レベル + レコメンドロジック
 */
var SHINDAN_CONFIG = {
  appName: "確定申告準備度チェック",
  recommendTitle: "不足している準備項目",

  questions: [
    {
      id: "q1",
      category: "receipt",
      categoryLabel: "レシート保管",
      question: "レシートや領収書の管理はどうしていますか？",
      choices: [
        { label: "ほとんど捨ててしまっている", points: 0 },
        { label: "財布や引き出しにためている", points: 1 },
        { label: "月ごとに封筒で分けて保管", points: 2 },
        { label: "撮影してクラウドに保存済み", points: 3 }
      ]
    },
    {
      id: "q2",
      category: "revenue",
      categoryLabel: "売上把握",
      question: "毎月の売上はどの程度把握していますか？",
      choices: [
        { label: "正直あまり把握できていない", points: 0 },
        { label: "だいたいの金額は分かる", points: 1 },
        { label: "月ごとの売上を記録している", points: 2 },
        { label: "日次で売上をリアルタイム管理", points: 3 }
      ]
    },
    {
      id: "q3",
      category: "expense",
      categoryLabel: "経費記録",
      question: "経費の記録はどうしていますか？",
      choices: [
        { label: "確定申告の時期にまとめて思い出す", points: 0 },
        { label: "ノートやメモに都度記録", points: 1 },
        { label: "Excelやスプレッドシートで管理", points: 2 },
        { label: "会計ソフトに自動連携している", points: 3 }
      ]
    },
    {
      id: "q4",
      category: "bank-account",
      categoryLabel: "事業用口座",
      question: "事業用の銀行口座はありますか？",
      choices: [
        { label: "個人口座のみで混在している", points: 0 },
        { label: "分けたいと思っているが未対応", points: 1 },
        { label: "事業用口座を開設済み", points: 2 },
        { label: "事業用口座+会計ソフトに連携済み", points: 3 }
      ]
    },
    {
      id: "q5",
      category: "software",
      categoryLabel: "会計ソフト",
      question: "会計ソフトは使っていますか？",
      choices: [
        { label: "使っていない", points: 0 },
        { label: "聞いたことはあるが未導入", points: 1 },
        { label: "導入済みだが活用しきれていない", points: 2 },
        { label: "日常的にフル活用している", points: 3 }
      ]
    },
    {
      id: "q6",
      category: "deduction",
      categoryLabel: "控除の知識",
      question: "使える控除をどの程度把握していますか？",
      choices: [
        { label: "控除が何かよく分からない", points: 0 },
        { label: "基礎控除くらいは知っている", points: 1 },
        { label: "医療費控除やふるさと納税は把握", points: 2 },
        { label: "小規模企業共済・iDeCo等も活用中", points: 3 }
      ]
    },
    {
      id: "q7",
      category: "blue-return",
      categoryLabel: "青色申告",
      question: "青色申告についてはどうですか？",
      choices: [
        { label: "白色と青色の違いが分からない", points: 0 },
        { label: "青色の方が得と聞くが白色で申告", points: 1 },
        { label: "青色申告の届出は済んでいる", points: 2 },
        { label: "青色で複式簿記・65万円控除を適用", points: 3 }
      ]
    },
    {
      id: "q8",
      category: "invoice",
      categoryLabel: "インボイス",
      question: "インボイス制度への対応はどうですか？",
      choices: [
        { label: "インボイスが何か分からない", points: 0 },
        { label: "制度は知っているが未対応", points: 1 },
        { label: "登録番号を取得済み", points: 2 },
        { label: "適格請求書の発行体制も整備済み", points: 3 }
      ]
    },
    {
      id: "q9",
      category: "schedule",
      categoryLabel: "申告スケジュール",
      question: "確定申告の準備スケジュールはどうですか？",
      choices: [
        { label: "毎年ギリギリ or 期限を過ぎがち", points: 0 },
        { label: "2月に入ってから慌てて準備", points: 1 },
        { label: "年末から少しずつ準備を開始", points: 2 },
        { label: "毎月の帳簿づけで申告時は提出のみ", points: 3 }
      ]
    },
    {
      id: "q10",
      category: "expert",
      categoryLabel: "専門家相談",
      question: "税理士や専門家に相談していますか？",
      choices: [
        { label: "相談したことがない", points: 0 },
        { label: "無料相談に行ったことがある程度", points: 1 },
        { label: "確定申告の時期だけ依頼している", points: 2 },
        { label: "顧問税理士がいる or 年間契約中", points: 3 }
      ]
    }
  ],

  levels: [
    {
      maxPercent: 25,
      name: "確定申告迷子",
      message: "準備がほとんどできていない状態です。まずは経費の記録と会計ソフトの導入から始めましょう！"
    },
    {
      maxPercent: 50,
      name: "準備スタート段階",
      message: "意識は向き始めていますが、まだやるべきことが多い状態です。下の項目を1つずつクリアしていきましょう！"
    },
    {
      maxPercent: 75,
      name: "準備進行中",
      message: "かなり準備が進んでいます！あと少し足りない部分を補えば、スムーズに申告できます。"
    },
    {
      maxPercent: 100,
      name: "準備バッチリ",
      message: "素晴らしい！確定申告の準備は万全です。この良い習慣を来年も続けていきましょう！"
    }
  ],

  getRecommendations: function (answers) {
    var adviceMap = {
      receipt: "スマホのカメラでレシートを撮影→freee・マネーフォワードに取り込む習慣をつけましょう",
      revenue: "売上は発生したらすぐ記録。会計ソフトと銀行口座を連携すれば自動で記録されます",
      expense: "経費は「使ったその日に記録」がコツ。溜めると確定申告が地獄になります",
      "bank-account": "事業用口座は三菱UFJ・楽天などで無料開設OK。会計ソフト連携で仕分けも自動化",
      software: "freee・マネーフォワード・弥生の無料プランから試してみましょう。確定申告が劇的にラクに",
      deduction: "ふるさと納税・iDeCo・小規模企業共済は節税効果大。まずは調べるだけでもOK",
      "blue-return": "青色申告にすれば最大65万円の控除が受けられます。届出は税務署に用紙を出すだけ",
      invoice: "取引先が法人の場合はインボイス登録が必要な場合も。国税庁のサイトで簡単に登録できます",
      schedule: "毎月15分だけ帳簿をつける習慣で、申告時期の地獄が解消されます",
      expert: "年商が増えてきたら税理士に相談を。初回無料の事務所も多いです"
    };

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
