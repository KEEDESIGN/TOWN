import {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";

class SnowboardGame {
  constructor() {
    this.games = new Map();
    this.trickMessages = [
      "🏂フロントサイド360を決めた！",
      "🏂バックサイドエアで魅せた！",
      "🏂インディーグラブを披露！",
      "🏂メソッドグラブでスタイリッシュに！",
      "🏂テールグラブで観客を沸かせた！",
      "🏂スイッチスタンスで攻める！",
      "🏂コルクスピンを決めた！",
      "🏂ミューテッドグラブを極める！",
      "🏂バタフライツイストを披露！",
      "🏂フロントフリップで魅せる！",
      "🏂バックフリップで会場が沸く！",
      "🏂ダブルコークを決めた！",
      "🏂ロデオスピンが決まった！",
      "🏂スタイルメソッドを決める！",
      "🏂フロントサイドテイルグラブ！"
    ];

    this.failMessages = [
      "🏂エッジが引っかかった...",
      "🏂着地が少しブレた...",
      "🏂バランスを崩してジョジョポーズ...",
      "🏂スピードが足りない...",
      "🏂回転が足りない...",
      "🏂グラブの形がださい...",
      "🏂着地が少し早すぎた...",
      "🏂テイクオフのタイミングが...",
      "🏂風にあおられて飛ばされた...",
      "🏂雪に突っ込んで漫画のようだ..."
    ];

    this.specialMoves = [
      "🌟SPECIAL!🏂トリプルコーク1440を完璧に決めた！",
      "🌟SPECIAL!🏂スイッチダブルマッキーツイストを極めた！",
      "🌟SPECIAL!🏂バックサイドトリプルロデオを決めた！",
      "🌟SPECIAL!🏂フロントサイドダブルコーク1260を決めた！",
      "🌟SPECIAL!🏂クワッドコークスピンを決めた！"
    ];

    this.trickImages = [
      "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C12_20241204093313.png?v=1733623892774",
      "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C12_20241203200819.png?v=1733623893070",
      "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C12_20241204092839.png?v=1733623894852"
    ];

    this.userImages = new Map([
      // 既存のユーザー画像マッピングをここに追加
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
      ],// 既存のユーザー画像マッピングをここに追加
    ]);
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        gameStarted: false,
        gameInterval: null,
        roundCount: 0
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
      game.participants.set(userId, 0);
    }
  }

  getRandomTrickImage() {
    return this.trickImages[Math.floor(Math.random() * this.trickImages.length)];
  }

  async startGame(guildId, channel) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      channel.send("参加者がいないため大会中止！");
      this.games.delete(guildId);
      return;
    }

    game.gameStarted = true;
    game.roundCount = 0;
    game.gameInterval = setInterval(async () => {
      game.roundCount++;
      let gameStatus = `\n**===🎤実況${game.roundCount}本目🎤===**\n`;
      let winner = null;

      const trickImage = this.getRandomTrickImage();

      for (const [userId, score] of game.participants) {
        const prevScore = score;
        let newScore = score;
        let message = "";

        if (Math.random() < 0.04) {
          const points = Math.floor(Math.random() * 16) + 25; // 25-40点
          newScore += points;
          message = this.specialMoves[Math.floor(Math.random() * this.specialMoves.length)];
        } else {
          const points = Math.floor(Math.random() * 11) + 5; // 5-15点
          newScore += points;
          message = points >= 10
            ? this.trickMessages[Math.floor(Math.random() * this.trickMessages.length)]
            : this.failMessages[Math.floor(Math.random() * this.failMessages.length)];
        }

        game.participants.set(userId, newScore);

        if (newScore >= 100) {
          winner = userId;
        }

        const roundPoints = newScore - prevScore;
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        gameStatus += `**${displayName}**は${message}\n🎯**${roundPoints}点**獲得**👉合計${newScore}点**\n`;
      }

      const sortedParticipants = Array.from(game.participants.entries()).sort((a, b) => b[1] - a[1]);

      gameStatus += "\n🏂現在の順位\n";
      for (let i = 0; i < sortedParticipants.length; i++) {
        const [userId, score] = sortedParticipants[i];
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        gameStatus += `${i + 1}位:**${displayName}** (${score}点)\n`;
      }

      channel.send({ content: gameStatus, files: [trickImage] }).catch(console.error);

      if (winner) {
        clearInterval(game.gameInterval);
        const winnerUser = await channel.guild.members.fetch(winner);
        const winnerDisplayName = winnerUser ? winnerUser.displayName : "Unknown";

        channel.send({
          content: `\n\n**表彰式**\n\n🎉🏆**${winnerDisplayName}さんが優勝です**！！🏆🎉\n\n**🏆おめでとうございます🏆**\n`,
          files: [this.trickImages[0]]
        }).catch(console.error);
        this.games.delete(guildId);
      }
    }, 18000);
  }
}

const snowboardGame = new SnowboardGame();

export const data = new SlashCommandBuilder()
  .setName("snow")
  .setDescription("🏂ハーフパイプ大会を開催するぞー🏂");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = snowboardGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("エントリーする")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🏂")
    );

    const startImageUrl = "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C12_20241204093313.png?v=1733623892774";
    const attachment = new AttachmentBuilder(startImageUrl);

    const replyOptions = {
      content: "**🌟 SNAP SNOWBOARD HALFPIPE 🌟\n\n　　　🏂開催🏂**\n\n**「みんなー、準備はいいかーッ！」**\n\n　（180秒後にスタートだッ）",
      components: [row],
      files: [attachment]
    };

    await interaction.editReply(replyOptions);

    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel.send("参加者がいないため大会中止！").catch(console.error);
        snowboardGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel.send("**「それでは、始めまーす！」**\n\n**🏂GO!!SNAP!!🏂**").catch(console.error);
        snowboardGame.startGame(interaction.guildId, interaction.channel);
      }
    }, 180000);
  } catch (error) {
    console.error("Error in execute function:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "エラーが発生しました。もう一度お試しください。",
        ephemeral: true
      }).catch(console.error);
    } else {
      await interaction.followUp({
        content: "エラーが発生しました。もう一度お試しください。",
        ephemeral: true
      }).catch(console.error);
    }
  }
}

export function initializeBot() {
  console.log("雪ボットを初期化しました");
}