/**
 * 自分へのご褒美タイプ診断 — データ
 * 4タイプ × 10問。各選択肢が1タイプに加点。最多タイプが結果。
 */
var REWARD_DATA = {
  appName: "自分へのご褒美タイプ診断",

  types: {
    home: {
      key: "home",
      emoji: "🛋️",
      name: "おうちで充電インドア派",
      catch: "何もしない時間が、最高のごほうび",
      comment: "外で頑張るぶん、おうちでゆるむ時間が何より大事なあなた。「何もしない」を罪悪感なく楽しめるのは、立派な才能です。ちゃんと充電して、また明日からの自分を労わってあげてくださいね。",
      tip: "おすすめごほうび：お気に入りの入浴剤 ＋ 早寝",
      color: "#C7837E"
    },
    sweets: {
      key: "sweets",
      emoji: "🍰",
      name: "ご自愛スイーツ派",
      catch: "甘いもので心を満たす天才",
      comment: "頑張った自分を、おいしいものでちゃんと労われる人。小さな幸せを見つけるのが上手で、まわりも自然と笑顔にしちゃうタイプ。ただ、食べすぎだけはほどほどに…！",
      tip: "おすすめごほうび：ちょっと贅沢な専門店のケーキ",
      color: "#D98AA6"
    },
    active: {
      key: "active",
      emoji: "💪",
      name: "自分磨きアクティブ派",
      catch: "ごほうびすら成長に変える前向きさん",
      comment: "休むより動くほうが回復するタイプ。ごほうびも「自分のためになること」を選べる、芯の強い人です。頑張りすぎちゃう日は、たまには何もしない日もあっていいんですよ。",
      tip: "おすすめごほうび：気になってた習い事の体験レッスン",
      color: "#E0A35E"
    },
    shopping: {
      key: "shopping",
      emoji: "🛍️",
      name: "ぱーっと発散ショッピング派",
      catch: "“欲しい” を我慢しないストレス解消上手",
      comment: "ピンときたものを手に入れる瞬間が、最高のごほうび。気持ちの切り替えが上手で、まわりから見ても一緒にいて楽しい人です。お財布とだけは、たまに相談してあげて…！",
      tip: "おすすめごほうび：前から狙ってた、あの一品",
      color: "#B98AD1"
    }
  },

  questions: [
    {
      q: "一日頑張ったごほうび、理想は？",
      choices: [
        { label: "予定のない、ぼーっとする夜", type: "home" },
        { label: "評判のスイーツを取り寄せて開封", type: "sweets" },
        { label: "ヨガやサウナでリフレッシュ", type: "active" },
        { label: "カートに入れてた物をついに購入", type: "shopping" }
      ]
    },
    {
      q: "自由に使える3時間、どう過ごす？",
      choices: [
        { label: "録りためたドラマを一気見", type: "home" },
        { label: "カフェでケーキとお茶", type: "sweets" },
        { label: "美容院かネイルで自分磨き", type: "active" },
        { label: "モールをぶらぶらお買い物", type: "shopping" }
      ]
    },
    {
      q: "ストレスが溜まったとき、まずどうする？",
      choices: [
        { label: "とにかく寝る・家でゴロゴロ", type: "home" },
        { label: "甘いものを食べる", type: "sweets" },
        { label: "体を動かして発散", type: "active" },
        { label: "ぱーっと買い物でスッキリ", type: "shopping" }
      ]
    },
    {
      q: "ごほうびに使えるのは、ぶっちゃけ？",
      choices: [
        { label: "お金より「何もしない時間」が欲しい", type: "home" },
        { label: "数百円のプチ贅沢で十分", type: "sweets" },
        { label: "自分への投資なら惜しまない", type: "active" },
        { label: "欲しいと思ったら金額は見ない…！", type: "shopping" }
      ]
    },
    {
      q: "旅行に行くなら？",
      choices: [
        { label: "温泉宿でひたすらのんびり", type: "home" },
        { label: "ご当地グルメを食べ歩き", type: "sweets" },
        { label: "アクティビティ満載のプラン", type: "active" },
        { label: "お土産・お買い物がメイン", type: "shopping" }
      ]
    },
    {
      q: "コンビニでつい買っちゃうのは？",
      choices: [
        { label: "入浴剤やリラックスグッズ", type: "home" },
        { label: "新作スイーツ", type: "sweets" },
        { label: "プロテインやヘルシー系", type: "active" },
        { label: "限定コスメや雑貨", type: "shopping" }
      ]
    },
    {
      q: "自分へのごほうび、頻度は？",
      choices: [
        { label: "疲れたら「家で休む」が定番", type: "home" },
        { label: "週末にちょこっと甘いもの", type: "sweets" },
        { label: "目標を達成したときにドンと", type: "active" },
        { label: "気分が上がったら、いつでも", type: "shopping" }
      ]
    },
    {
      q: "「最近頑張ったね」と言われたら、欲しいのは？",
      choices: [
        { label: "ひとりの静かな時間", type: "home" },
        { label: "お気に入りのデザート", type: "sweets" },
        { label: "応援の言葉と、次の目標", type: "active" },
        { label: "やっぱり物としてのプレゼント", type: "shopping" }
      ]
    },
    {
      q: "SNSでつい見ちゃうのは？",
      choices: [
        { label: "おうち時間・インテリア", type: "home" },
        { label: "スイーツ・カフェ巡り", type: "sweets" },
        { label: "美容・健康・自分磨き", type: "active" },
        { label: "ファッション・購入品紹介", type: "shopping" }
      ]
    },
    {
      q: "ごほうびを選ぶときの決め手は？",
      choices: [
        { label: "心からリラックスできるか", type: "home" },
        { label: "食べて幸せになれるか", type: "sweets" },
        { label: "自分のためになるか", type: "active" },
        { label: "気分が上がるか・可愛いか", type: "shopping" }
      ]
    }
  ],

  // 同点時の優先順位
  tieOrder: ["home", "sweets", "active", "shopping"]
};
