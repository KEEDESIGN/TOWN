import { SlashCommandBuilder } from "discord.js";
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'kingyo_data.json');

// 金魚の種類と確率の定義
const kingyoTypes = [
  { name: "赤の出目金", weight: 199, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C676_20240715085421.png?v=1721002085322" },
  { name: "黒の出目金", weight: 199, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C676_20240715085305.png?v=1721002083850" },
  { name: "白の出目金", weight: 199, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C676_20240715085427.png?v=1721002086754" },
  { name: "赤の金魚", weight: 199, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C677_20240715085815.png?v=1721002076780" },
  { name: "黒の金魚", weight: 199, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C677_20240715085921.png?v=1721002077687" },
  { name: "白の金魚", weight: 100, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C677_20240715085711.png?v=1721002075787" },
  { name: "最高級の金魚", weight: 10, image: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C675_20240715084944.png?v=1721002082218" }
];

// ユーザーの最後のプレイ時間を追跡するMap
const lastPlayTime = new Map();

export const data = new SlashCommandBuilder()
  .setName("kingyo")
  .setDescription("金魚すくいゲームに挑戦！");

function getRandomKingyo() {
  const totalWeight = kingyoTypes.reduce((sum, type) => sum + type.weight, 0);
  let random = Math.floor(Math.random() * totalWeight);
  
  for (let type of kingyoTypes) {
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

    // 初期画像の表示
    const initialAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C678_20240715090552.jpg?v=1721002081098",
      name: "kingyo_game_start.jpg",
    };
    await interaction.editReply({ files: [initialAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // GIF画像の表示（金魚をすくうアニメーション）
    const gifAttachment = {
      attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/20240715_091945-ANIMATION.gif?v=1721002843040",
      name: "kingyo_scooping.gif",
    };
    await interaction.editReply({ files: [gifAttachment] });

    // 2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 結果の取得と表示
    const result = getRandomKingyo();
    const resultAttachment = {
      attachment: result.image,
      name: "kingyo_result.png",
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
    if (result.name === "最高級の金魚") {
      resultMessage += "\n\nおめでとう！🎉 キーにメンションして連絡してね！";
    }

    // 最終的な結果表示
    setTimeout(async () => {
      try {
        const button = {
          type: 2,
          style: 1,
          label: "お次の方どうぞ～🐟",
          custom_id: "kingyo_button",
        };
        const actionRow = {
          type: 1,
          components: [button],
        };

        // タイトル画像を再度表示
        const titleAttachment = {
          attachment: "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C678_20240715090552.jpg?v=1721002081098",
          name: "kingyo_title.jpg",
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
    await interaction.editReply({ content: "金魚を獲得できませんでした。もう一度挑戦してください。", components: [] }).catch(console.error);
  }
}

export async function handleKingyoButton(interaction) {
  if (interaction.customId === "kingyo_button") {
    await execute(interaction);
  }
}