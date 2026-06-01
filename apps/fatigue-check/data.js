/**
 * 隠れ疲れ度チェック — データ
 * 10問・各選択肢0〜3点。合計→疲れ度%→4レベル判定。
 * どの結果も「頑張ってる証拠」とねぎらう明るい締めにする。
 */
var FATIGUE_DATA = {
  appName: "隠れ疲れ度チェック",
  maxScore: 30, // 10問 × 最大3点

  // percent <= maxPercent の最初のレベルを採用
  levels: [
    {
      maxPercent: 25,
      emoji: "🌷",
      name: "元気チャージ満タンさん",
      color: "#5BB89B",
      comment: "今、心と体のバランスがとっても上手にとれている状態。自分の機嫌のとり方を知っている証拠です。この調子で、頑張りすぎる前にちゃんと休む習慣を大事にしてね。",
      tip: "今日のひとこと：好きな飲み物で、ゆっくりひと息つこう☕"
    },
    {
      maxPercent: 50,
      emoji: "☕",
      name: "ちょい疲れ・がんばりモードさん",
      color: "#E0A35E",
      comment: "毎日きちんとこなしてる、頑張り屋さん。まだ大丈夫だけど、小さな疲れがちょこっと顔を出し始めてるみたい。早めのこまめな休憩が、いちばんの予防になりますよ。",
      tip: "今日のひとこと：5分だけ、何もしない時間をつくってみて🍵"
    },
    {
      maxPercent: 75,
      emoji: "🛁",
      name: "隠れ疲れ気味さん",
      color: "#D98AA6",
      comment: "自分では気づきにくいけど、けっこう頑張ってきた証拠の疲れがたまり気味。「まだいける」と思えるあなたは本当にすごい。でも今日くらいは、自分を最優先にしてもいいんです。",
      tip: "今日のひとこと：湯船にゆっくり、早めに布団へ🛌"
    },
    {
      maxPercent: 100,
      emoji: "🌙",
      name: "全力投球・がんばりすぎさん",
      color: "#B98AD1",
      comment: "それだけ毎日を全力で生きてきた証拠です。ここまで本当によく頑張りました。今のあなたに必要なのは反省じゃなくて、休息。「何もしない」を自分に許可してあげてくださいね。",
      tip: "今日のひとこと：今日は“何もしない日”。それで大丈夫🌙"
    }
  ],

  questions: [
    { q: "朝、目が覚めたときの感じは？", choices: [
      { label: "スッキリ起きられる", points: 0 },
      { label: "まあ、普通", points: 1 },
      { label: "だるいけど起きる", points: 2 },
      { label: "起き上がるのがしんどい", points: 3 } ] },
    { q: "最近、夜の寝つきは？", choices: [
      { label: "すぐ眠れる", points: 0 },
      { label: "たまに寝つけない", points: 1 },
      { label: "考えごとで眠れない日が多い", points: 2 },
      { label: "疲れてるのに眠れない", points: 3 } ] },
    { q: "好きなこと・趣味の時間は？", choices: [
      { label: "ちゃんと楽しめてる", points: 0 },
      { label: "ときどきできてる", points: 1 },
      { label: "やる気が出ない", points: 2 },
      { label: "時間も気力もない", points: 3 } ] },
    { q: "ちょっとしたことで…", choices: [
      { label: "あまり動じない", points: 0 },
      { label: "たまにイラッとする", points: 1 },
      { label: "すぐイライラする", points: 2 },
      { label: "涙が出そうになる", points: 3 } ] },
    { q: "休んだ次の日、疲れは？", choices: [
      { label: "スッキリ取れる", points: 0 },
      { label: "だいたい取れる", points: 1 },
      { label: "あまり取れない", points: 2 },
      { label: "休んでも取れない", points: 3 } ] },
    { q: "「やらなきゃ」が口ぐせに…", choices: [
      { label: "なってない", points: 0 },
      { label: "たまに言う", points: 1 },
      { label: "よく言ってる", points: 2 },
      { label: "いつも何かに追われてる感じ", points: 3 } ] },
    { q: "鏡で自分の顔を見て…", choices: [
      { label: "元気そう", points: 0 },
      { label: "普通かな", points: 1 },
      { label: "疲れて見える", points: 2 },
      { label: "顔を見る余裕もない", points: 3 } ] },
    { q: "甘いもの・カフェインの量は？", choices: [
      { label: "いつも通り", points: 0 },
      { label: "ちょっと増えた", points: 1 },
      { label: "かなり頼ってる", points: 2 },
      { label: "これがないと動けない", points: 3 } ] },
    { q: "誰かに「大丈夫？」と聞かれたら…", choices: [
      { label: "大丈夫！と即答できる", points: 0 },
      { label: "大丈夫…と答える", points: 1 },
      { label: "つい無理してると気づく", points: 2 },
      { label: "ちょっと泣きそうになる", points: 3 } ] },
    { q: "自分のための時間、最近とれてる？", choices: [
      { label: "とれてる", points: 0 },
      { label: "ときどき", points: 1 },
      { label: "ほとんどない", points: 2 },
      { label: "まったくない", points: 3 } ] }
  ]
};
