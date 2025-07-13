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

const TITLE_IMAGE_URL =
  "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E3%81%8A%E3%82%82%E3%81%A1.png?v=1735279850779";
const MASTER_IMAGE_URL =
  "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C763_20241102161756.jpg?v=1735274330704";

class MochiGame {
  constructor() {
    this.games = new Map();
    this.upActions = [
      "凄まじい二重の極みで餅を突く🔨",
      "リズミカルにペッタンペッタン💫",
      "汗水混ぜて情熱的に打った🎵",
      "突如もちから声が聞こえてきた✨",
      "大将の掛け声に合わせて打った🎶",
      "もちと一体となった💪",
      "水を絶妙なタイミングでぶっかけた💦",
      "周りの応援をうまく利用した👊",
      "もちの声が聞こえた！💭",
      "師匠直伝の極意で打つ✨",
      "打つ時「おいしくなーれ」と話しかけてイキイキ",
      "大将の前掛けを褒める😉",
      "大将とお茶を飲みながら昔話を聞く☕",
      "もちの角を綺麗に整えた✨",
      "お餅に愛を込めて打つ❤️",
    ];
    this.downActions = [
      "力加減を間違えて餅がふっ飛んだ💨",
      "もちが顔にくっついて大変！😱",
      "手が滑ってスネを打つ😅",
      "つい考え事をして手が止まる💭",
      "餅に頭から突っ込んだ！😫",
      "大事なものを置いてきちまったぜ😶",
      "隣の人のもちと混ざりそうに！😱",
      "正月番組に夢中になってやめちゃう🍚",
      "エアドロに夢中で大将怒る📱",
      "モチもモモも同じでしょって言っちゃう📦",
      "杵だと思ったらマイクだった🎤",
      "原材料をグミにしてしまった💦",
      "風邪ひいてモチれない😔",
      "かわいい猫が現る😺",
      "大将の顔面に餅を投げつけた😱",
      "水の代わりにコーラを入れた💦",
      "腰を痛めてダウン👴",
    ];
    this.specialMoves = [
      "🌟奥義：餅神サンダー",
      "🌟秘技・餅月千手観音",
      "🌟神技・餅餅パンチ",
      "🌟極意・餅手裏剣",
      "🌟奥義・餅覇急烈波",
      "🌟秘技・餅魂注入拳",
      "🌟絶技・餅との調和・融合",
      "🌟寝技・餅固め",
    ];
    this.mochiTypes = [
      {
        url: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C36_20241216132602%20-%20%E3%82%B3%E3%83%94%E3%83%BC.png?v=1735259524419",
        name: "ねずみもち",
      },
      {
        url: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C34_20241216132040%20-%20%E3%82%B3%E3%83%94%E3%83%BC.png?v=1735259530368",
        name: "へびもち",
      },
      {
        url: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C35_20241216132143%20-%20%E3%82%B3%E3%83%94%E3%83%BC.png?v=1735259526020",
        name: "とらもち",
      },
      {
        url: "https://cdn.glitch.global/534e2ea2-a596-4dc3-aef1-6a2426358047/%E7%84%A1%E9%A1%8C33_20241216131917%20-%20%E3%82%B3%E3%83%94%E3%83%BC.png?v=1735259533440",
        name: "うさぎもち",
      },
    ];
    this.userImages = new Map([
     [
        "panda_fuku23",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E3%81%B5%E3%81%8F%E3%81%B1%E3%82%93%20(2).jpg?v=1720504168004",
      ],
      [
        "eureka com",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C500_20240525081809.jpg?v=1720504168750",
      ],
      [
        "papicoyoshida",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C500_20240525125907.jpg?v=1720504169582",
      ],
       [
        "kitoshi4687",
        "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C711_20240804084443.jpg?v=1722754072984",
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
        "michael_neurolauncher",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C510_20240526122404.jpg?v=1720504172671",
      ],
      [
        "itarou1908",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C511_20240526130900.jpg?v=1720504173386",
      ],
      [
        "kuramasa_jp",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1_8C513_20240526155308.jpg?v=1720504174554",
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
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1_8C537_20240531181830.jpg?v=1720504178932",
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
      ], // ユーザー画像のマッピングは同じ
    ]);
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        gameStarted: false,
        gameInterval: null,
        roundCount: 0,
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

  getUserImageUrl(userId) {
    return this.userImages.get(userId) || MASTER_IMAGE_URL;
  }

  async startGame(guildId, channel) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      channel.send("参加者がいないため解散っ！また来てね！");
      this.games.delete(guildId);
      return;
    }

    game.gameStarted = true;
    game.roundCount = 0;

    const runRound = async () => {
      game.roundCount++;
      let roundStatus = `\n**===🔨餅つき${game.roundCount}回目🔨===**\n`;

      for (const [userId, score] of game.participants) {
        const isUpAction = Math.random() < 0.5;
        const action = isUpAction
          ? this.upActions[Math.floor(Math.random() * this.upActions.length)]
          : this.downActions[Math.floor(Math.random() * this.downActions.length)];

        let scoreChange = isUpAction ? 1 : -1;
        let specialMoveText = "";

        if (isUpAction && Math.random() < 0.05) {
          const specialMove = this.specialMoves[
            Math.floor(Math.random() * this.specialMoves.length)
          ];
          specialMoveText = `**${specialMove}** `;
          scoreChange *= 2;
        }

        game.participants.set(userId, score + scoreChange);

        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        roundStatus += `**${displayName}**は${action}\n👉${specialMoveText}大将：${
          isUpAction ? (scoreChange > 1 ? "絶賛" : "感心") : "心配"
        }した！\n`;
      }

      await channel.send(roundStatus).catch(console.error);

      if (game.roundCount === 5) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await channel
          .send("**「おお！大将！もち具合はどうですかい！？」**")
          .catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        const masterImageAttachment = new AttachmentBuilder(MASTER_IMAGE_URL, {
          name: "master.png",
        });
        await channel.send({ files: [masterImageAttachment] }).catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 6000));
        await channel
          .send("**「えっとねえ...こんな感じだなぁ！」**")
          .catch(console.error);

        const ranking = Array.from(game.participants.entries())
          .sort((a, b) => b[1] - a[1])
          .map(async ([userId, score], index) => {
            const user = await channel.guild.members.fetch(userId);
            const displayName = user ? user.displayName : "Unknown";
            return `${index + 1}. **${displayName}** `;
          });

        const rankingMessage = await Promise.all(ranking);
        await channel
          .send("**大将の採点ランキング**\n" + rankingMessage.join("\n"))
          .catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 7000));
      }

      if (game.roundCount < 10) {
        setTimeout(runRound, 15000);
      } else {
        this.endGame(guildId, channel);
      }
    };

    runRound();
  }

  async endGame(guildId, channel) {
    const game = this.getGame(guildId);
    if (!game) return;

    try {
      await channel
        .send("**「さあ、大将！出来上がった餅の出来栄えはどうよ？てやんでぇ」**")
        .catch(console.error);

      const masterImageAttachment = new AttachmentBuilder(MASTER_IMAGE_URL, {
        name: "master.png",
      });
      await channel.send({ files: [masterImageAttachment] }).catch(console.error);

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const winner = Array.from(game.participants.entries()).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      const winnerUser = await channel.guild.members.fetch(winner[0]);
      const winnerDisplayName = winnerUser ? winnerUser.displayName : "Unknown";
      const winnerUsername = winnerUser ? winnerUser.user.username : "Unknown";
      const winnerImageUrl = this.getUserImageUrl(winnerUsername);
      const winnerMochi = this.mochiTypes[Math.floor(Math.random() * this.mochiTypes.length)];

      const files = [
        new AttachmentBuilder(winnerImageUrl, { name: "winner.png" }),
        new AttachmentBuilder(winnerMochi.url, { name: "mochi.png" }),
      ];

      await channel
        .send({
          content: `「優勝は**${winnerDisplayName}**！素晴らしい出来栄えだわ！」\n作品名：**${winnerMochi.name}**`,
          files,
        })
        .catch(console.error);

      setTimeout(async () => {
        await channel
          .send(
            "2025もよろしく～～～～"
          )
          .catch(console.error);
      }, 2000);
    } catch (error) {
      console.error("Error in endGame function:", error);
    } finally {
      this.games.delete(guildId);
    }
  }
}

const mochiGame = new MochiGame();

export const data = new SlashCommandBuilder()
  .setName("mochi")
  .setDescription("餅つきコンテストを開催するぞ！");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = mochiGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("準備中...")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⏳")
        .setDisabled(true)
    );

    const attachment = new AttachmentBuilder(TITLE_IMAGE_URL, {
      name: "title.png",
    });

    const replyOptions = {
      content:
        "**🌟餅つき大会開催！腕に自信のある者は集まれ～！大将は厳しいぞ！**\n\n準備中。もうしばし待たれぃ...",
      components: [row],
      files: [attachment],
    };

    const reply = await interaction.editReply(replyOptions);

    setTimeout(async () => {
      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("join")
          .setLabel("餅つきに参加")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🔨")
      );

      await interaction.editReply({
        content:
          "**🌟大将「さあさあ、集まってきたな！腕前を見せてみろ！あけましておめでとう！」**\n\n参加ボタンで受付開始！120秒後にスタートします！",
        components: [updatedRow],
      });

      setTimeout(async () => {
        if (game.participants.size === 0) {
          await interaction.channel
            .send("参加者がいないため解散！また来てくれよ！")
            .catch(console.error);
          mochiGame.games.delete(interaction.guildId);
        } else {
          await interaction.channel
            .send(
              "**「よーい、スタート！」**\n\n**🔨餅つきコンテスト開始！🔨**"
            )
            .catch(console.error);
          mochiGame.startGame(interaction.guildId, interaction.channel);
        }
      }, 120000);
    }, 30000);
  } catch (error) {
    console.error("Error in execute function:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction
      .reply({
          content: "エラーが発生しました。もう一度お試しください。",
          ephemeral: true,
        })
        .catch(console.error);
    } else {
      await interaction
        .followUp({
          content: "エラーが発生しました。もう一度お試しください。",
          ephemeral: true,
        })
        .catch(console.error);
    }
  }
}

export function initializeBot() {
  console.log("餅つきボットを初期化しました");
}