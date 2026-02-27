/**
 * リピート率診断 - 質問データ + 結果レベル + レコメンドロジック
 */
var SHINDAN_CONFIG = {
  appName: "リピート率診断",
  recommendTitle: "改善ポイント",

  questions: [
    {
      id: "q1",
      category: "name-greeting",
      categoryLabel: "名前呼び接客",
      question: "お客様をお名前で呼んでいますか？",
      choices: [
        { label: "名前を覚えていない・聞かない", points: 0 },
        { label: "常連さんだけ名前で呼ぶ", points: 1 },
        { label: "初回からお名前を聞いて呼ぶ", points: 2 },
        { label: "名前+前回の話題も覚えて接客", points: 3 }
      ]
    },
    {
      id: "q2",
      category: "followup",
      categoryLabel: "フォローアップ",
      question: "来店後のフォローアップはしていますか？",
      choices: [
        { label: "特に何もしていない", points: 0 },
        { label: "たまにDMやメッセージを送る", points: 1 },
        { label: "来店後にお礼メッセージを送る", points: 2 },
        { label: "お礼+アフターケア情報を自動送信", points: 3 }
      ]
    },
    {
      id: "q3",
      category: "loyalty",
      categoryLabel: "リピーター特典",
      question: "リピーター向けの特典はありますか？",
      choices: [
        { label: "特典は特にない", points: 0 },
        { label: "口頭で値引きすることがある", points: 1 },
        { label: "ポイントカードやスタンプカード", points: 2 },
        { label: "会員制度や回数券で囲い込み済み", points: 3 }
      ]
    },
    {
      id: "q4",
      category: "next-booking",
      categoryLabel: "次回予約促進",
      question: "次回予約の促進はしていますか？",
      choices: [
        { label: "お客様に任せている", points: 0 },
        { label: "帰り際に「またお待ちしてます」程度", points: 1 },
        { label: "次回予約の提案を必ずしている", points: 2 },
        { label: "次回予約+リマインド通知も自動化", points: 3 }
      ]
    },
    {
      id: "q5",
      category: "feedback",
      categoryLabel: "お客様の声",
      question: "お客様の感想やフィードバックを集めていますか？",
      choices: [
        { label: "特に集めていない", points: 0 },
        { label: "口コミを見る程度", points: 1 },
        { label: "アンケートを実施している", points: 2 },
        { label: "定期的に収集し改善に活用している", points: 3 }
      ]
    },
    {
      id: "q6",
      category: "sns-line",
      categoryLabel: "LINE・SNS活用",
      question: "LINE公式やSNSでお客様とつながっていますか？",
      choices: [
        { label: "SNSは個人用のみ・LINE公式なし", points: 0 },
        { label: "SNSはあるが更新は不定期", points: 1 },
        { label: "LINE公式 or SNSで定期的に発信", points: 2 },
        { label: "LINE+SNSで情報発信+予約導線あり", points: 3 }
      ]
    },
    {
      id: "q7",
      category: "dormant",
      categoryLabel: "休眠顧客対策",
      question: "しばらく来ていないお客様への対策はありますか？",
      choices: [
        { label: "特に何もしていない", points: 0 },
        { label: "来なくなったことに気づく程度", points: 1 },
        { label: "手動で「お久しぶり」連絡をする", points: 2 },
        { label: "一定期間経過で自動クーポン配信", points: 3 }
      ]
    },
    {
      id: "q8",
      category: "experience",
      categoryLabel: "体験づくり",
      question: "お客様の「また来たい」体験づくりはしていますか？",
      choices: [
        { label: "特に意識していない", points: 0 },
        { label: "感じの良い接客を心がけている", points: 1 },
        { label: "サプライズや季節のおもてなしあり", points: 2 },
        { label: "体験設計を仕組みとして構築済み", points: 3 }
      ]
    },
    {
      id: "q9",
      category: "referral",
      categoryLabel: "紹介制度",
      question: "お客様からの紹介の仕組みはありますか？",
      choices: [
        { label: "紹介制度はない", points: 0 },
        { label: "お願いベースで紹介をもらう程度", points: 1 },
        { label: "紹介カードや特典を用意している", points: 2 },
        { label: "紹介制度+自動お礼まで仕組み化", points: 3 }
      ]
    },
    {
      id: "q10",
      category: "data-analysis",
      categoryLabel: "データ分析",
      question: "リピート率やお客様データを分析していますか？",
      choices: [
        { label: "データは取っていない", points: 0 },
        { label: "感覚で「最近減ったかな」程度", points: 1 },
        { label: "来店回数や売上をExcel等で管理", points: 2 },
        { label: "リピート率・LTVを数値で把握済み", points: 3 }
      ]
    }
  ],

  levels: [
    {
      maxPercent: 25,
      name: "リピート施策ゼロ",
      message: "まだリピート対策ができていない状態です。まずは「来店後のお礼メッセージ」から始めてみましょう！"
    },
    {
      maxPercent: 50,
      name: "リピート施策の卵",
      message: "いくつかの施策は始めていますが、まだ仕組み化が不十分です。下のポイントを改善するとリピート率がグッと上がります！"
    },
    {
      maxPercent: 75,
      name: "リピート上手",
      message: "かなりリピート施策ができています！あと少し自動化・仕組み化を進めれば、安定した売上基盤が作れます。"
    },
    {
      maxPercent: 100,
      name: "リピートの達人",
      message: "素晴らしい！リピート対策が完璧です。この仕組みをさらに磨き上げて、お客様との絆を深めていきましょう！"
    }
  ],

  getRecommendations: function (answers) {
    var adviceMap = {
      "name-greeting": "予約時に名前を記録→カルテに前回の話題もメモしておくと「覚えてくれてる！」感動が生まれます",
      followup: "LINE公式のステップ配信を使えば、来店翌日にお礼＋3日後にケア情報を自動送信できます",
      loyalty: "スタンプカードよりLINEショップカードがおすすめ。お客様の手間ゼロでポイントが貯まります",
      "next-booking": "「次はいつ頃がベストですか？」と聞くだけでOK。帰り際の一言で次回予約率が3倍に",
      feedback: "来店後にLINEでアンケートを送れば回答率UP。お客様の声は最強の改善材料です",
      "sns-line": "LINE公式アカウントは無料で始められます。まずは友だち追加→お礼クーポンの流れを作りましょう",
      dormant: "「90日来店なし」で自動クーポン配信する仕組みを作ると、休眠顧客の30%が戻ってきます",
      experience: "誕生月の特別サービスや季節のドリンクなど、小さな「想定外」が記憶に残ります",
      referral: "紹介者と被紹介者の両方に特典を。「友達に教えたくなる」仕掛けがリピートの連鎖を生みます",
      "data-analysis": "まずは月次のリピート率だけでもOK。数字が見えると「何をすべきか」が明確になります"
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
