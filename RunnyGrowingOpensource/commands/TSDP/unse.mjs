import { SlashCommandBuilder } from "discord.js";

// 運勢レベルごとのカテゴリー別運勢リストの定義
const fortuneCategories = {
  "GREAT SNAP": {
    金運: [
      "宝くじが当たるかもしれない！",
      "TOTOにチャレンジ！！",
      "おっと、なぜか札束さんが落ちてるかも！",
      "損した分が返ってくるよ！",
      "けっこう生々しく儲かるかも！",
      "思わぬ高額収入のチャンス到来！",
      "投資で大きな利益が期待できる日だ！",
      "5円が5万円になるレベルのことが起きる可能性だって、ある",
    ],
    デジタル運: [
      "MacBookProが欲しいと願うことでもしかたらワンチャン降ってきてます",
      "バズるね。まちがいなくバズるね。",
      "安くていいもの手に入りそうな予感",
      "インターネットの速度がなぜかめちゃくちゃいい！",
      "スタイリッシュなガジェットに出会える！",
      "新しいガジェットとの出会いが幸運を呼ぶかも！",
      "SNSで大チャンス到来！フォロワー爆増の予感",
      "すごくいい人が現れて色々教えてくれるかも！",
      "端末のスペックが急に上がる可能性だってある！",
      "オンラインでの活動全てが吉",
    ],
    人間関係運: [
     "めんどうだった関係を大清算！スッキリだよ",
      "奇想天外な友達ができるかも！アラブの金持ちかも！",
      "自分のままでいいんです。すべて周りが合わせてくれます。",
      "周りの人に頼りまくりましょう。いいことがあります",
      "あなたの魅力が爆発して人間関係が最高潮に達します",      
      "新しい出会いが人生を変える予感",
      "昔お世話になった人のことを思い出すとまさかのいいことが",
      "どんなあなたでもみんなが受け入れてくれるよ",
      "周りの人々があなたを助けてくれる日",
      "誰とでも打ち解けられる魅力満開の1日",
    ],
    恋愛運: [
      "運命の人との出会いがあるかも！",
      "いいことしかないっすよ！",
      "告白大成功間違いなし！",
      "パートナーとの絆が一層深まる日",
    ],
    健康運: [
      "みなぎるエネルギーで何でもこなせる1日",
      "筋肉と脂肪の割合が理想のバランスに早変わり！",
      "少し歩けばいつもより消費カロリーがUP！",
      "心頭滅却火もまた涼し！気持ち涼しい！",
      "免疫力アップ！病気知らずの体に",
      "新しい健康法との出会いで人生が変わる",
    ],
  },
  "NICE SNAP": {
    金運: [
      "コツコツ貯金が報われる日",
      "思わぬところからお小遣いGet!",
      "棚から1000円出てきたラッキー",
      "堅実な投資が実を結ぶ",
    ],
    デジタル運: [
      "新しいアプリとの出会いが〇",
      "じわじわと前進するエアドロ効果を実感",
      "オンラインでの人脈が広がるぞ",
      "PCの調子が気持ち少しイイ日だよ",
      "デジタルスキルが大幅アップか",
    ],
    人間関係運: [
      "友人との絆が深まる良い機会だ",
      "職場での人間関係が円滑だ",
      "人はそれぞれ個性が大事。大丈夫",
      "今日の感謝が明日の感謝",
      "家族との時間を大切にしよう",
    ],
    恋愛運: [
      "初恋の人を想い続ける必要はなかろう",
      "パートナーとの素敵なデートを期待",
      "好きにしてよし！",
      "自己肯定感アップで魅力倍増だ",
    ],
    健康運: [
      "適度な運動で心身ともにリフレッシュ",
      "おや、、なぜか今日は腸の調子が抜群だ",
      "ストレスがなぜかたまらない！？",
      "バランスの良い食生活で体調絶好調",
      "ストレス解消法が見つかる日",
    ],
  },
  "DO YOUR BEST SNAP": {
    金運: [
      "意外な出費に要注意だ",
      "倹約を心がければ安定だ",
       "財布に穴が開いてないかチェックだ",
      "5円と間違えて50円を出さないように！",
      "小さな工夫が将来の財産だよ",
    ],
    デジタル運: [
      "セキュリティに気をつけてね",
      "デジタルデトックスを心がけると◎",
      "ちょっとまって。ＵＲＬを要チェック",
      "ネット情報に惑わされないようにね",
    ],
    人間関係運: [
      "誤解を招きやすい日、言動に注意だ",
      "一人の時間を大切にしないとね",
      "変な人に絡まれないように少しコミュ控えめに",
      "相手の立場に立って考えると吉だけど無になること",
    ],
    恋愛運: [
      "焦らず自分のペースを保つことが大切だね",
      "危険な人に近づいたらダメ",
      "八方美人は危ないぞ",
      "友情から恋愛に発展するかもね",
      "自己分析の時期、内面を磨こうね",
    ],
    健康運: [
      "睡眠時間を十分に取ろうね",
      "軽い体操から始めるのがおすすめだ", 
      "仕事を早く切り上げて！！なんかヤな予感！",
      "食生活の見直しで体調改善だ",
    ],
  },
  "SOSO SNAP": {
    金運: [
      "買いは控えめにね",
      "財布の紐は固く締めようね",
      "お金入ってる？",
      "今日の倹約が明日の余裕に",
      "お金より大事なものがあるからさ。気にすんなよ",
      "失敗するときもある。前を向こう",
    ],
    デジタル運: [
      "SNSでのトラブルに要注意だよ",
      "デジタル機器の故障に気をつけてね",
      "パスワードもこまめに変えようね",
      "無線ＬＡＮに要注意だ",
      "オンラインショッピングは慎重にね",
    ],
    人間関係運: [
      "人付き合いで疲れやすい日だね",
      "ひとはひと、自分は自分、気にしないで",
      "良い人に見えて悪い人もおおいぞ",
      "自分の時間を大切にね",
      "無理せず素直な気持ちで接すると◎",
    ],
    恋愛運: [
      "恋愛よりも自分磨きに集中だね",
      "相手の気持ちを深読みしないようにね",
      "できるだけ人ごみに行かないようにね",
      "んな良いことは起きないぞ",
      "一時の感情に流されないようにね",
    ],
    健康運: [
      "無理は禁物、ゆっくり休養を",
      "軽い散歩で気分転換だね",
      "急に走らないように。腱に注意だ",
      "深呼吸をなるべく多めに",
      "飲みすぎはダメダメ",
      "腕を急に上にあげるとちょっとよくない",
      "バランスの取れた食事を心がけよ",
    ],
  },
};

export const data = new SlashCommandBuilder()
  .setName("unse")
  .setDescription("今日の運勢だよー");

function getRandomFortune(level, category) {
  const fortunes = fortuneCategories[level][category];
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    // まず新しい画像を表示
    const initialAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C502_20240525081547.jpg?v=1720308741553",
      name: "initial_fortune.jpg",
    };
    await interaction.editReply({ files: [initialAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // GIF画像の表示
    const gifAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/20240703_092113-ANIMATION.gif?v=1720052997009",
      name: "fortune.gif",
    };
    await interaction.editReply({ files: [gifAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    const arr = [
      {
        main: `今日の**${interaction.user.username}さん**の運勢は \n\n **『GREAT SNAP!』** \n **最高です**\n 空から大金が降ってくる縁起の良さ！\n **最高の気分で一日をすごちゃお！**`,
        level: "GREAT SNAP",
        weight: 2,
        image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E5%9B%B34.png?v=1720510592210"
      },
      {
        main: `今日の**${interaction.user.username}さん**の運勢は \n\n **『NICE SNAP!』** \n **中々いい感じですよ** \n 何をやっても前向きになれます! \n **気持ちよく１日をすごしちゃお**`,
        level: "NICE SNAP",
        weight: 12,
        image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E5%9B%B33.png?v=1720510594715"
      },
      {
        main: `今日の**${interaction.user.username}さん**の運勢は \n\n **『DO YOUR BEST SNAP!』** \n **そこそこですね**\n ときどきいいことがある！\n　**いい１日になることを祈ってる**`,
        level: "DO YOUR BEST SNAP",
        weight: 12,
        image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E5%9B%B32.png?v=1720510593683"
      },
      {
        main: `今日の**${interaction.user.username}さん**の運勢は \n\n **『SOSO SNAP!』** \n うーん \n **うん。がんばろ** \n **熊やイノシシ出没に注意だ！**`,
        level: "SOSO SNAP",
        weight: 4,
        image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E5%9B%B31.png?v=1720510592907"
      },
    ];

    let totalWeight = arr.reduce((sum, fortune) => sum + fortune.weight, 0);
    let random = Math.floor(Math.random() * totalWeight);
    let result, fortuneLevel, fortuneImage;

    for (let fortune of arr) {
      if (random < fortune.weight) {
        result = fortune.main;
        fortuneLevel = fortune.level;
        fortuneImage = fortune.image;
        break;
      }
      random -= fortune.weight;
    }

    // 占い結果に合わせた画像を表示
    const resultAttachment = {
      attachment: fortuneImage,
      name: "fortune_result.png",
    };
    await interaction.editReply({ files: [resultAttachment] });

    // カテゴリー別運勢の追加
    const categories = Object.keys(fortuneCategories[fortuneLevel]);
    const detailedFortune = categories
      .map(
        (category) =>
          `■${category}\n　${getRandomFortune(fortuneLevel, category)}`
      )
      .join("\n");

    setTimeout(async () => {
      try {
        const button = {
          type: 2,
          style: 1,
          label: "おみくじ",
          custom_id: "unse_button",
        };
        const actionRow = {
          type: 1,
          components: [button],
        };
        await interaction.editReply({
          content: `${result}\n\n${detailedFortune}\n\n 天気やガス代が知りたかったからこっちもチェック\n👉https://discord.com/channels/1240921271110467615/1242716278209122365\n\n **今日も一日張り切っていきましょう**\n\n\n **次の方、どうぞ💁🏻**`,
          components: [actionRow],
          files: [],
        });
      } catch (error) {
        console.error("Error in setTimeout callback:", error);
      }
    }, 4000);
  } catch (error) {
    console.error("Error in execute function:", error);
    await interaction
      .editReply({ content: "エラーが発生しました。", components: [] })
      .catch(console.error);
  }
}
export async function handleUnseButton(interaction) {
  if (interaction.customId.startsWith("unse_")) {
    await execute(interaction);
  }
}
