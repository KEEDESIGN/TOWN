import {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";

const VICTORY_IMAGE_URL = 
  "https://cdn.glitch.global/a484bed8-530f-4ee0-9bbf-1625ba3254ba/%E7%84%A1%E9%A1%8C760_20241102132655.jpg?v=1732448858122";

class ZombieGame {
  constructor() {
    this.games = new Map();
    this.criticalHitMessages = [
      "🎯ヘッドショット！致命的なダメージを与えた！",
      "⚡必殺技を繰り出した！",
      "💥強力な爆発で大ダメージ！",
      "🔥火炎放射器で焼き尽くした！",
      "⚔️渾身の一撃が決まった！",
      "🎪サーカスの技で翻弄した！",
      "🌟秘密の必殺技が炸裂！",
      "🚀ロケットランチャーの直撃！"
    ];
    this.normalHitMessages = [
      "🔫銃弾が命中！",
      "🗡️ナイフで切りつけた！",
      "🏏バットでスイング！",
      "🪓斧を振り下ろした！",
      "🔨ハンマーで殴打！",
      "🧪酸を投げつけた！",
      "🪃ブーメランが当たった！",
      "🎳ボウリングの球を投げた！"
    ];
    this.missMessages = [
      "😱転んでしまった！",
      "🌧️雨で視界が悪い！",
      "😫疲れて動きが鈍い！",
      "🦶足がもつれた！",
      "💨霧で見失った！",
      "😅武器の装填に手間取る！",
      "🎭マスクが曇ってよく見えない！",
      "🌪️突風で体勢を崩した！"
    ];
    this.specialAttackMessages = [
      "🌟必殺技！💥メテオストライク！",
      "🌟必殺技！⚡サンダーストーム！",
      "🌟必殺技！🔥フレイムバースト！",
      "🌟必殺技！❄️アイスランス！",
      "🌟必殺技！💎ダイヤモンドダスト！",
      "🌟必殺技！🌪️トルネードアタック！",
      "🌟必殺技！⚡プラズマキャノン！",
      "🌟必殺技！🌟スターバースト！",
      "🌟必殺技！🌋マグマバースト！",
      "🌟必殺技！❄️フリーズブレイク！",
      "🌟必殺技！🌪️トルネードスラッシュ！",
      "🌟必殺技！☢️ニュークリアブラスト！"
    ];
    this.userImages = new Map([
  [
        "panda_fuku23",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E3%81%B5%E3%81%8F%E3%81%B1%E3%82%93%20(2).jpg?v=1720504168004",
      ],
            [
        "papa1975",
        "hhttps://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C699_20240729140343.jpg?v=1722303892455",
      ],
      [
        "katsuo6866",
        "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C685_20240720233321.jpg?v=1722303908160",
      ],
      [
        "rinehihei",
        "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C684_20240720164219.jpg?v=1722303910739",
      ],      
      [
        "eureka com",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C500_20240525081809.jpg?v=1720504168750",
      ],
       [
        "kitoshi4687",
        "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C711_20240804084443.jpg?v=1722754072984",
      ],
      [
        "papicoyoshida",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C500_20240525125907.jpg?v=1720504169582",
      ],
      [
        ".lol88",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/LOL.jpg?v=1720781353088",
      ],

[
        "itsukingu1676",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C671_20240712142452.jpg?v=1720781354245",
      ],

[
        "wat0312",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C668_20240712145819.jpg?v=1720781355017",
      ],
      [
        "yasuoo0",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C501_20240525081726.jpg?v=1720504170316",
      ],
      [
        "m.arukome",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C502_20240525081547.jpg?v=1720504171127",
      ],
      [
        "mao.bkk",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C508_20240526160434.jpg?v=1720504171914",
      ],
      [
        "Michael_neurolauncher",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C510_20240526122404.jpg?v=1720504172671",
      ],
      [
        "itarou1908",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C511_20240526130900.jpg?v=1720504173386",
      ],
      [
        "kuramasa_jp",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C513_20240526155308.jpg?v=1720504174554",
      ],
      [
        "ta mu ta mu",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C519_20240527204836.jpg?v=1720504175286",
      ],
      [
        "inasan2400",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C520_20240527201544.jpg?v=1720504176043",
      ],
      [
        "keenft",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C522_20240528135229.jpg?v=1720504176750",
      ],
      [
        "hiro3734649",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C523_20240528184333.jpg?v=1720504177438",
      ],
      [
        "nawo148",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C527_20240529213945.jpg?v=1720504178169",
      ],
      [
        "becky.jp",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C537_20240531181830.jpg?v=1720504178932",
      ],
      [
        "mayu3.",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C584_20240608145558.jpg?v=1720504179726",
      ],
      [
        "waatee.lingo",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C645.jpg?v=1720504180489",
      ],
      [
        "ponko0320",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C653_20240708113915.jpg?v=1720504181223",
      ],
      [
        "yoki hito",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/629_20240630081407.jpg?v=1720504182012",
      ],
      [
        "apo_0204",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/APO.jpg?v=1720504182859",
      ],
      [
        "taka0157",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C659_20240710211915.jpg?v=1720672405685",
      ],
      [
        "tyozetumeron",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/chozetu.jpg?v=1720504183550",
      ],
      [
        "suisei_rx7",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E3%81%99%E3%81%84%E3%81%9B%E3%81%84.jpg?v=1720504184340",
      ],
    ]);
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        gameStarted: false,
        gameInterval: null,
        roundCount: 0,
        zombieHealth: 1000 // ゾンビの初期HP
      });
    }
    return this.games.get(guildId);
  }

  getGame(guildId) {
    return this.games.get(guildId);
  }

  addParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.gameStarted) {
      game.participants.set(userId, 0); // 0は初期ダメージ値
    }
  }

  removeParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.gameStarted) {
      game.participants.delete(userId);
    }
  }

  getUserImageUrl(userId) {
    return this.userImages.get(userId) || VICTORY_IMAGE_URL;
  }

  async startGame(guildId, channel, interaction) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      channel.send("参加者がいないため作戦中止！");
      this.games.delete(guildId);
      return;
    }

    game.gameStarted = true;
    game.roundCount = 0;
    game.gameInterval = setInterval(async () => {
      game.roundCount++;
      let battleStatus = `\n**===🎤バトルレポート${game.roundCount}🎤===**\n`;
      let zombieDefeated = false;

      // 参加者の攻撃処理
      for (const [userId, totalDamage] of game.participants) {
        const prevDamage = totalDamage;
        let newDamage = totalDamage;
        let message = "";

        // 4%の確率で必殺技
        if (Math.random() < 0.04) {
          const damage = Math.floor(Math.random() * 51) + 100; // 100-150のダメージ
          newDamage += damage;
          message = this.specialAttackMessages[
            Math.floor(Math.random() * this.specialAttackMessages.length)
          ];
        } else {
          const damage = Math.floor(Math.random() * 31) + 10; // 10-40のダメージ
          newDamage += damage;
          message = damage >= 25
            ? this.criticalHitMessages[Math.floor(Math.random() * this.criticalHitMessages.length)]
            : this.normalHitMessages[Math.floor(Math.random() * this.normalHitMessages.length)];
        }

        game.participants.set(userId, newDamage);
        game.zombieHealth -= (newDamage - prevDamage);

        if (game.zombieHealth <= 0) {
          zombieDefeated = true;
        }

        const damageDealt = newDamage - prevDamage;
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        battleStatus += `**${displayName}**は${message}\n💥**${damageDealt}**のダメージを与えた！**総ダメージ:${newDamage}**\n`;
      }

      // 残りゾンビHPの表示
      battleStatus += `\n🧟ゾンビの残りHP: ${Math.max(0, game.zombieHealth)}/1000\n`;

      // ダメージランキングの表示
      const sortedParticipants = Array.from(game.participants.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      battleStatus += "\n⚔️ダメージランキング\n";
      for (let i = 0; i < sortedParticipants.length; i++) {
        const [userId, damage] = sortedParticipants[i];
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        battleStatus += `${i + 1}位:**${displayName}** (${damage}ダメージ)\n`;
      }

      channel.send(battleStatus).catch(console.error);

      if (zombieDefeated) {
        clearInterval(game.gameInterval);
        const mvpUser = sortedParticipants[0][0];
        const mvpMember = await channel.guild.members.fetch(mvpUser);
        const mvpDisplayName = mvpMember ? mvpMember.displayName : "Unknown";
        const mvpUsername = mvpMember ? mvpMember.user.username : "Unknown";
        const mvpImageUrl = this.getUserImageUrl(mvpUsername);

        channel.send({
          content: `\n\n**作戦成功！**\n\n🎉⚔️**${mvpDisplayName}さん (${mvpUsername}) が最も大きな貢献を果たしました**！！⚔️🎉\n\n**🏆MVP獲得おめでとうございます🏆**\n`,
          files: [mvpImageUrl, VICTORY_IMAGE_URL],
        }).catch(console.error);
        this.games.delete(guildId);
      }
    }, 18000);
  }
}

const zombieGame = new ZombieGame();

export const data = new SlashCommandBuilder()
  .setName("zombie")
  .setDescription("🧟ゾンビ討伐作戦を開始するぞー🧟");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = zombieGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("討伐隊に参加する")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("⚔️")
    );

    const startImageURL = 
      "https://cdn.glitch.global/a484bed8-530f-4ee0-9bbf-1625ba3254ba/%E5%9B%B32.png?v=1732448854154"; // 作戦開始時の画像URLを設定してください
    const attachment = new AttachmentBuilder(startImageURL, { name: "start.jpg" });

    const replyOptions = {
      content: 
        "**🌟 緊急事態発生！！ 🌟\n\n　　　🧟ゾンビ出現🧟**\n\n**「全員集合！討伐作戦を開始する！」**\n\n　（180秒後に作戦開始）",
      components: [row],
    };

    if (attachment) {
      replyOptions.files = [attachment];
    }

    await interaction.editReply(replyOptions);

    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel
          .send("参加者がいないため作戦中止！")
          .catch(console.error);
        zombieGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel
          .send("**「全員、突撃開始！！！」**\n\n**⚔️作戦開始！！⚔️**")
          .catch(console.error);
        zombieGame.startGame(interaction.guildId, interaction.channel);
      }
    }, 180000);
  } catch (error) {
    console.error("Error in execute function:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "エラーが発生しました。もう一度お試しください。",
        ephemeral: true,
      }).catch(console.error);
    } else {
      await interaction.followUp({
        content: "エラーが発生しました。もう一度お試しください。",
        ephemeral: true,
      }).catch(console.error);
    }
  }
}

export async function handleZombieButton(interaction) {
  const game = zombieGame.getGame(interaction.guildId);
  if (game && !game.gameStarted) {
    zombieGame.addParticipant(interaction.guildId, interaction.user.id);

    await interaction.deferUpdate();

    try {
      await interaction.channel.send(
        `**${interaction.user.displayName}**が討伐隊に参加した⚔️`
      );
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    }
  } else {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "現在の作戦には参加できません！",
        ephemeral: true,
      });
    }
  }
}

export function initializeBot() {
  console.log("ゾンビボットを初期化しました");
}