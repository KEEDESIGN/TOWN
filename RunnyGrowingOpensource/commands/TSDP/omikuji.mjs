import { SlashCommandBuilder } from "discord.js";

const fortuneCategories = {
  "大吉": {
    仕事運: [
      "昇進のチャンスが訪れるでしょう！",
      "大きなプロジェクトで成功を収めます",
      "理想的な新しい仕事との出会いがあります",
      "努力が実を結び、高い評価を得られます"
    ],
    金運: [
      "思わぬ臨時収入がありそう！",
      "投資で大きな利益が期待できます",
      "金銭面での心配事が解消されます",
      "経済的な余裕が生まれる一年になります"
    ],
    健康運: [
      "一年を通じて健康で過ごせます",
      "心身ともに充実した状態が続きます",
      "病気の心配はありません",
      "活力に満ちた毎日を送れます"
    ],
    総合運: [
      "全ての願い事が叶う年になります",
      "人生の大きな転機となる出来事が！",
      "周りの人々からの支援で夢が実現",
      "新しい扉が次々と開かれていきます"
    ]
  },
  "中吉": {
    仕事運: [
      "着実な成長が期待できます",
      "コツコツと努力が報われます",
      "良い評価を得られる機会があります",
      "新しいスキルが身につく年になります"
    ],
    金運: [
      "堅実な貯蓄が功を奏します",
      "必要な時に必要なお金が手に入ります",
      "コツコツ積み立てが吉",
      "無駄遣いが減り、資産が増えます"
    ],
    健康運: [
      "体調管理を心がければ問題なし",
      "規則正しい生活で健康増進",
      "軽い運動で健康維持できます",
      "心配な症状も回復に向かいます"
    ],
    総合運: [
      "平穏無事な一年を過ごせます",
      "小さな幸せが続く年になります",
      "地道な努力が実を結びます",
      "周りとの関係が良好に保てます"
    ]
  },
  "小吉": {
    仕事運: [
      "無理せず着実に進めましょう",
      "基礎固めの時期です",
      "経験を積むことを重視して",
      "小さな成功を大切にしましょう"
    ],
    金運: [
      "堅実な運用を心がけましょう",
      "余計な出費に注意が必要です",
      "計画的な支出を心がけて",
      "倹約が身を助けます"
    ],
    健康運: [
      "予防を心がけましょう",
      "早め早めの対策が吉",
      "休養を十分にとることが大切",
      "ストレス解消を忘れずに"
    ],
    総合運: [
      "焦らず一歩一歩前進しましょう",
      "控えめな行動が吉",
      "慎重に物事を進めましょう",
      "基礎固めの年になります"
    ]
  },
  "凶": {
    仕事運: [
      "慎重な判断を心がけましょう",
      "新しいことは控えめに",
      "基本に立ち返ることが大切",
      "助言を素直に受け入れて"
    ],
    金運: [
      "無駄遣いに要注意です",
      "大きな買い物は控えめに",
      "貯蓄を心がけましょう",
      "財布の紐は固く締めて"
    ],
    健康運: [
      "十分な休養を取りましょう",
      "早め早めの健康管理を",
      "無理は禁物です",
      "予防に重点を置いて"
    ],
    総合運: [
      "変化を求めすぎないように",
      "現状維持に努めましょう",
      "焦らず慎重に進めることが大切",
      "謙虚な姿勢が運気を開きます"
    ]
  }
};

export const data = new SlashCommandBuilder()
  .setName("omikuji")
  .setDescription("2024年の運勢を占います");

export function initializeBot() {
  console.log("おみくじボット準備完了");
  return {
    name: "omikuji",
    description: "新年のおみくじを引きます",
  };
}



function getRandomFortune(level, category) {
  const fortunes = fortuneCategories[level][category];
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    // 初期画像の表示
    const initialAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C502_20240525081547.jpg?v=1720308741553", // 初期おみくじ画像のURLに変更してください
      name: "initial_omikuji.jpg",
    };
    await interaction.editReply({ files: [initialAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // おみくじを引くアニメーションGIF
    const gifAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/20240703_092113-ANIMATION.gif?v=1720052997009", // おみくじを引くGIF画像のURLに変更してください
      name: "drawing_omikuji.gif",
    };
    await interaction.editReply({ files: [gifAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    const fortunes = [
      {
        main: `**${interaction.user.username}様**の2024年の運勢は\n\n**『大吉』**\n\n素晴らしい一年になることでしょう！\n全ての願い事が叶う年です！`,
        level: "大吉",
        weight: 2,
        image: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C29_20241216131137.png?v=1734744731940" // 大吉の結果画像URLに変更してください
      },
      {
        main: `**${interaction.user.username}様**の2024年の運勢は\n\n**『中吉』**\n\n良い一年になりそうです！\n着実な成長が期待できます！`,
        level: "中吉",
        weight: 12,
        image: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C31_20241216131333.png?v=1734744735288" // 中吉の結果画像URLに変更してください
      },
      {
        main: `**${interaction.user.username}様**の2024年の運勢は\n\n**『小吉』**\n\n穏やかな一年になりそうです。\n地道な努力が実を結ぶでしょう。`,
        level: "小吉",
        weight: 12,
        image: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C30_20241216131242.png?v=1734744730418" // 小吉の結果画像URLに変更してください
      },
      {
        main: `**${interaction.user.username}様**の2024年の運勢は\n\n**『凶』**\n\n慎重に物事を進めましょう。\n謙虚な姿勢が運気を開きます。`,
        level: "凶",
        weight: 4,
        image: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C32_20241216131501.png?v=1734744751790" // 凶の結果画像URLに変更してください
      }
    ];

    let totalWeight = fortunes.reduce((sum, fortune) => sum + fortune.weight, 0);
    let random = Math.floor(Math.random() * totalWeight);
    let result, fortuneLevel, fortuneImage;

    for (let fortune of fortunes) {
      if (random < fortune.weight) {
        result = fortune.main;
        fortuneLevel = fortune.level;
        fortuneImage = fortune.image;
        break;
      }
      random -= fortune.weight;
    }

    // 結果画像の表示
    const resultAttachment = {
      attachment: fortuneImage,
      name: "fortune_result.png",
    };
    await interaction.editReply({ files: [resultAttachment] });

    // カテゴリー別運勢の追加
    const categories = Object.keys(fortuneCategories[fortuneLevel]);
    const detailedFortune = categories
      .map(category => `■${category}\n　${getRandomFortune(fortuneLevel, category)}`)
      .join("\n");

    setTimeout(async () => {
      const button = {
        type: 2,
        style: 1,
        label: "おみくじを引く",
        custom_id: "omikuji_button",
      };
      const actionRow = {
        type: 1,
        components: [button],
      };
      await interaction.editReply({
        content: `${result}\n\n${detailedFortune}\n\n**明けましておめでとうございます**\n今年も素敵な一年になりますように\n\n**次の方、どうぞ💫**`,
        components: [actionRow],
        files: [],
      });
    }, 4000);
  } catch (error) {
    console.error("Error in execute function:", error);
    await interaction.editReply({ content: "エラーが発生しました。", components: [] })
      .catch(console.error);
  }
}

export async function handleOmikujiButton(interaction) {
  if (interaction.customId === "omikuji_button") {
    await execute(interaction);
  }
}