import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

class ChristmasPresentGame {
  constructor() {
    this.games = new Map();
    this.secretMissions = [
      "🏠 静かに屋根に忍び込み",
      "🎄 クリスマスツリーになり切って",
      "🧦 暖炉の靴下にそっと入れて",
      "🌟 忍者のような身のこなしで",
      "🍪 サンタステップを習得して",
      "❄️ 煙突から豪快に落ちて"
    ];
    this.stealthMessages = [
      "🤫 全く音を立てずにプレゼントを置いた！",
      "👻 まるで幽霊のようにプレゼントを置く！",
      "🐱 猫のように静かにプレゼントを置くぅ！",
      "🦉 フクロウのように配達ぅ！",
      "🌙 サンタワンコに運ばせた！",
      "❄️ 雪のような優しさと一緒に置いた！"
    ];
    this.challengeMessages = [
      "🚪 玄関ドアを豪快にガチャガチャ！",
      "🐶 番犬に気づかれた！わんわん！",
      "👀 子供たちが起きてた！鉢合わせ！！",
      "🛋️ リビング豪快にすっころんだ！！！",
      "🕰️ 1週間に届けるのが遅かった！！！",
      "🔊 プレゼント持ってくんの忘れてた！！"
    ];
    this.christmasImages = {
      gameStart: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E5%9B%B31.png?v=1732796542189",
      gameEnd: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/2.png?v=1732753027181",
      round1: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C5_20241127212607.png?v=1732712460039",
      round2: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C3_20241127211836.png?v=1732712472270",
      round3: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C4_20241127212138.png?v=1732712463008",
      round4: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C7_20241127213114.png?v=1732712442204"
    };
    this.christmasMusicUrls = [
      "https://www.youtube.com/watch?v=7zBeQezaz4U", //backnumber
      "https://www.youtube.com/watch?v=aHIR33pOUv0&list=PLoY0enzhPx2chNhpDoMXk8YsHcC7Lb6Hp&index=3", // MISIA
      "https://www.youtube.com/watch?v=gEX21myCfU8&list=PLoY0enzhPx2chNhpDoMXk8YsHcC7Lb6Hp&index=10", // 桑田
      "https://www.youtube.com/watch?v=IzqLX_KVK0Q&list=PLnAaVDXIC5AgSbLrYDVtxg1snQqHhA7rH", // GRAY
      "https://www.youtube.com/watch?v=QZFEnfBmfqg",  // Bz
      "https://www.youtube.com/watch?v=aAkMkVFwAoo",  // マライヤ
      "https://www.youtube.com/watch?v=vBpDfOtqIh4&list=PL96LZ3C1QEdW68uqgQQ1HVQIc_BxlR9LJ&index=2",  // ワム
      "https://www.youtube.com/watch?v=Z0ajuTaHBtM&list=PL96LZ3C1QEdW68uqgQQ1HVQIc_BxlR9LJ&index=3",  // ロビー     
      "https://youtu.be/-Xo64Q2ucQ8?si=Njab7e2F-nPW9MGV"
    ];
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        gameStarted: false,
        gameInterval: null,
        roundCount: 0,
        totalMissions: 5
      });
    }
    return this.games.get(guildId);
  }

  addParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.gameStarted) {
      game.participants.set(userId, {
        stealth: 0,
        successCount: 0,
        secretMission: this.getRandomSecretMission(),
        completed: false
      });
      return true;
    }
    return false;
  }

  getGame(guildId) {
    return this.games.get(guildId);
  }

  getRandomSecretMission() {
    return this.secretMissions[Math.floor(Math.random() * this.secretMissions.length)];
  }
}

const christmasPresentGame = new ChristmasPresentGame();

export const data = new SlashCommandBuilder()
  .setName("santa")
  .setDescription("🎅 サンタさんプレゼントミッションを開始！");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = christmasPresentGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join_santa")
        .setLabel("サンタさんにチャレンジ")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎅")
    );

    await interaction.editReply({
      content: "🎄 **メリークリスマス！** 🎅\n\nサンタさん大募集！子供たちに気づかれずにプレゼントを届けろ！",
      files: [christmasPresentGame.christmasImages.gameStart],
      components: [row]
    });

    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel.send("サンタさんが誰も集まらず、クリスマスは中止...😢");
        christmasPresentGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel.send("🎄 **クリスマスミッション、スタート！** 🎅");
        startGame(interaction.guildId, interaction.channel);
      }
    }, 60000);
  } catch (error) {
    console.error("Error in execute function:", error);
    await interaction.followUp({
      content: "エラーが発生しました。もう一度お試しください。",
      ephemeral: true,
    });
  }
}

async function startGame(guildId, channel) {
  const game = christmasPresentGame.getGame(guildId);
  if (!game || game.participants.size === 0) {
    channel.send("🎅 サンタさんが誰もいないので、今年のクリスマスは中止！");
    christmasPresentGame.games.delete(guildId);
    return;
  }

  // ゲーム開始時にランダムなクリスマス音楽のURLを送信
  const randomMusicUrl = christmasPresentGame.christmasMusicUrls[
    Math.floor(Math.random() * christmasPresentGame.christmasMusicUrls.length)
  ];
  await channel.send(`🎵 クリスマスミュージックで気分盛り上げて！\n${randomMusicUrl}`);

  game.gameStarted = true;
  game.roundCount = 0;

  game.gameInterval = setInterval(async () => {
    game.roundCount++;
    
    // ラウンドごとの画像を選択
    let roundImage;
    switch(game.roundCount) {
      case 1: roundImage = christmasPresentGame.christmasImages.round1; break;
      case 2: roundImage = christmasPresentGame.christmasImages.round2; break;
      case 3: roundImage = christmasPresentGame.christmasImages.round3; break;
      case 4: roundImage = christmasPresentGame.christmasImages.round4; break;
      case 5: roundImage = christmasPresentGame.christmasImages.gameEnd; break;
      default: roundImage = christmasPresentGame.christmasImages.gameStart;
    }

let gameStatus = `\n**===🎄 サンタさんミッション ${game.roundCount} 🎄===**\n`;
for (const [userId, participant] of game.participants) {
  if (!participant.completed) {
    const stealthRoll = Math.random() * 100;
    const successChance = 40 + (participant.stealth * 10);
    const user = await channel.guild.members.fetch(userId);
    const displayName = user ? user.displayName : "Unknown";

    if (stealthRoll < successChance) {
      participant.stealth++;
      participant.successCount++;
      participant.secretMission = christmasPresentGame.getRandomSecretMission();
      gameStatus += `🎉 **${displayName}** が 成功！ ${participant.secretMission}  ${christmasPresentGame.stealthMessages[Math.floor(Math.random() * christmasPresentGame.stealthMessages.length)]} 成功！\n`;
    } else {
      const challengeMessage = christmasPresentGame.challengeMessages[Math.floor(Math.random() * christmasPresentGame.challengeMessages.length)];
      gameStatus += `❌ **${displayName}** のチャレンジ失敗！ ${challengeMessage}\n`;
    }
  }
}

    // ラウンドイメージを含めてメッセージを送信
    const roundMessage = await channel.send({
      content: gameStatus,
      files: [roundImage]
    });

    if (game.roundCount >= 5) {
      clearInterval(game.gameInterval);
      
      const successfulSantas = Array.from(game.participants.entries());
      successfulSantas.sort((a, b) => b[1].successCount - a[1].successCount);

      const topSuccessCount = successfulSantas[0][1].successCount;
      const topSantas = successfulSantas.filter(([_, participant]) => participant.successCount === topSuccessCount);

      let winner;
      if (topSantas.length > 1) {
        // 同点の場合、ランダムに勝者を選ぶ
        winner = topSantas[Math.floor(Math.random() * topSantas.length)];
      } else {
        winner = topSantas[0];
      }

      const winnerUser = await channel.guild.members.fetch(winner[0]);
      const winnerName = winnerUser ? winnerUser.displayName : "Unknown";

      const resultMessage = 
        `🎄 **クリスマスミッション完了！** 🎅\n\n` +
        `🏆 **最優秀サンタ: ${winnerName}**\n` +
        `🎁 プレゼント成功回数: ${winner[1].successCount}回\n\n` +
        `成績:\n` +
        successfulSantas.map(([userId, participant], index) => {
          const member = channel.guild.members.cache.get(userId);
          const name = member ? member.displayName : "Unknown";
          return `${index + 1}. ${name}: ${participant.successCount}回`;
        }).join("\n");

      // 最終結果を送信
      await channel.send({
        content: resultMessage,
        files: [
          winnerUser ? winnerUser.displayAvatarURL() : christmasPresentGame.christmasImages.gameEnd
        ]
      });

      christmasPresentGame.games.delete(guildId);
    }
  }, 15000);
}

export async function handleSantaButton(interaction) {
  try {
    // ゲームインスタンスを取得
    const game = christmasPresentGame.getGame(interaction.guildId);
    
    if (!game || game.gameStarted) {
      await interaction.reply({
        content: "このゲームには参加できません。",
        ephemeral: true
      });
      return;
    }

    // 参加者を追加
    const added = christmasPresentGame.addParticipant(interaction.guildId, interaction.user.id);
    
    if (added) {
      await interaction.reply({
        content: `🎅 **${interaction.user.displayName}**サンタが参加！`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: "参加できませんでした。",
        ephemeral: true
      });
    }
  } catch (error) {
    console.error("サンタゲーム参加エラー:", error);
    await interaction.reply({
      content: "参加中にエラーが発生しました。",
      ephemeral: true
    });
  }
}

export function initializeBot() {
  console.log("サンタボットを初期化しました");
}