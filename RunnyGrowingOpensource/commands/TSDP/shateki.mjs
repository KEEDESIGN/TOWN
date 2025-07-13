import { SlashCommandBuilder } from "discord.js";
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'shateki_data.json');

// 射的の景品と確率の定義
const prizeTypes = [
  { name: "Rikaのピンバッチ", weight: 258, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C571_20240715095734.png?v=1721005491479" },
  { name: "DASYのピンバッチ", weight: 258, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C563_20240715095635.png?v=1721005519525" },
  { name: "JACKのピンバッチ", weight: 258, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C569_20240715100003.png?v=1721005487719" },
  { name: "Johnのぬいぐるみ", weight: 10, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C551_20240715100135.png?v=1721005514314" }
];

// ユーザーの最後のプレイ時間を追跡するMap
const lastPlayTime = new Map();

export const data = new SlashCommandBuilder()
  .setName("shateki")
  .setDescription("射的ゲームに挑戦！");

function getRandomPrize() {
  const totalWeight = prizeTypes.reduce((sum, type) => sum + type.weight, 0);
  let random = Math.floor(Math.random() * totalWeight);
  
  for (let type of prizeTypes) {
    if (random < type.weight) {
      return type;
    }
    random -= type.weight;
  }
}

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};  // ファイルが存在しない場合は空のオブジェクトを返す
    }
    throw error;
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function execute(interaction) {
  try {
    const userId = interaction.user.id;
    const now = Date.now();
    const lastPlay = lastPlayTime.get(userId) || 0;

    if (now - lastPlay < 24 * 60 * 60 * 1000) {
      return await interaction.reply({ 
        content: "1日1回しか遊べないよ！また明日チャレンジしてね！", 
        ephemeral: true 
      });
    }

    await interaction.deferReply();

    lastPlayTime.set(userId, now);

    // 初期画像の表示（タイトル画像がない場合はコメントアウトまたは削除してください）
     const initialAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C679_20240716160430.jpg?v=1721184710898",
     };
     await interaction.editReply({ files: [initialAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // GIF画像の表示（射的をする様子のアニメーション）
    const gifAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/20240715_101237-ANIMATION.gif?v=1721006763528",
      name: "shateki_shooting.gif",
    };
    await interaction.editReply({ files: [gifAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 結果の取得と表示
    const result = getRandomPrize();
    const resultAttachment = {
      attachment: result.image,
      name: "shateki_result.png",
    };
    await interaction.editReply({ files: [resultAttachment] });

    // ユーザーデータの更新
    try {
      const data = await loadData();
      if (!data[userId]) {
        data[userId] = {};
      }
      if (!data[userId][result.name]) {
        data[userId][result.name] = 0;
      }
      data[userId][result.name]++;
      await saveData(data);
    } catch (error) {
      console.error("Error updating user data:", error);
      // エラーが発生した場合でもゲームは続行
    }

    // 結果メッセージの作成
    let resultMessage = `**${interaction.user.username}さん**が獲得したのは...\n\n**『${result.name}』**です！`;
    if (result.name === "Johnのぬいぐるみ") {
      resultMessage += "\n\nおめでとう！🎉 キーにメンションして連絡してね！";
    }

    // 最終的な結果表示
    setTimeout(async () => {
      try {
        const button = {
          type: 2,
          style: 1,
          label: "次の方どうぞ🔫",
          custom_id: "shateki_button",
        };
        const actionRow = {
          type: 1,
          components: [button],
        };

        
         const titleAttachment = {
           attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C679_20240716160430.jpg?v=1721184710898",
           name: "shateki_title.jpg",
         };

        await interaction.editReply({
          content: resultMessage,
           files: [titleAttachment],  
          components: [actionRow],
        });
      } catch (error) {
        console.error("Error in setTimeout callback:", error);
      }
    }, 4000);

  } catch (error) {
    console.error("Error in execute function:", error);
    await interaction.editReply({ content: "景品を獲得できませんでした。もう一度挑戦してください。", components: [] }).catch(console.error);
  }
}

export async function handleShatekiButton(interaction) {
  if (interaction.customId === "shateki_button") {
    await execute(interaction);
  }
}