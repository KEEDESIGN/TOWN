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
  "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB.png?v=1722242036046";
const MASTER_IMAGE_URL =
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C708_20240916110233.png?v=1726452242454";

class BonsaiGame {
  constructor() {
    this.games = new Map();
    this.upActions = [
      "枝を愛でるように剪定した✂",
      "葉の配置を少し変えた🍃",
      "盆栽に天然水をかけた💦",
      "突如盆栽からbonsaicoinが生えてきた",
      "盆栽と向きあい己を磨く💫",
      "不要な芽を積み新たな命を吹き込む🌬",
      "シザーハンズの映画を見た✂",
      "見たこともないスピードで切り刻んだ✂",
      "BONSAICOINを大量買い💰",
      "BONSAI師匠の肩をモむ😉",
      "手入れする時「かわいいね」と話しかけてイキイキ",
      "BONSAI師匠の着物を褒める😉",
      "師匠と盆栽の話をしながら将棋を打つ",
      "不要な枝を見事にカット",
      "師匠の髪をいい感じにカット",
    ];
    this.downActions = [
      "枝をえぐるようにカット💣",
      "針金巻きつけ過ぎて枝が変な方向に！",
      "毛虫が出てきて驚いて枝を切り落とす！",
      "アオムシさんを放置🐛",
      "フェイクグリーンをこっそり使う🍃",
      "坊ちゃん刈にしてしまう✂",
      "BONSAICOINを大量売り💰",
      "カラスが巣作り！枝を折って持って行った！",
      "隣の人の盆栽を少しカット🍃",
      "今日のご飯を考えてたらぼーっとする🍚",
      "盆栽ではなくBONSAICOINの値動きしか見てない💰",
      "鉢を作りたくなり陶芸の道へ👉",
      "盆栽をデコって師匠に怒られる⚓",
      "野良猫がやって来て盆栽を倒した🐈",
      "師匠の髪をえぐるようにカット✂",
      "鋏の手入れを怠っていたため、枝が上手く切れない",
      "鋏をどこに置いたか忘れて見つからない👓",
    ];
    this.specialMoves = [
      "🌟奥義：盆栽師匠へ💰",
      "🌟秘技・枝葉輪舞",
      "🌟神技・盆景一閃",
      "🌟極意・樹形操術",
      "🌟奥義・血木共鳴波",
      "🌟秘技・木葉乱舞",
      "🌟絶技・木共呼吸術",
      "🌟寝技・腕菱木一本",
    ];
    this.bonsaiImages = [
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E6%A3%98%E6%A3%98.png?v=1722238466916",
        name: "棘棘",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E7%9B%86%E7%9B%86.png?v=1722238464514",
        name: "盆盆",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E5%AF%8C%E5%A3%AB.png?v=1722238448693",
        name: "富士",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E5%A6%82%E6%9C%A8%E5%A6%82%E6%9C%A8.png?v=1722238422627",
        name: "如木如木",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E5%A4%A9%E6%A9%8B%E7%AB%8B.png?v=1722238419651",
        name: "天橋立",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E9%AB%98%E5%B0%BE.png?v=1722238415451",
        name: "高尾",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E9%AB%98%E5%B0%BE.png?v=1722238415451",
        name: "雅",
      },
      {
        url: "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E9%98%BF%E6%96%B0%E7%9B%AE%E9%B3%A5.png?v=1722238411150",
        name: "阿新目鳥",
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
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C513_20240526155308.jpg?v=1720504174554",
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
      channel.send("参加者がいないため解散っ解散っ");
      this.games.delete(guildId);
      return;
    }

    game.gameStarted = true;
    game.roundCount = 0;

    const runRound = async () => {
      game.roundCount++;
      let roundStatus = `\n**===🌿師匠の見極め${game.roundCount}🌿===**\n`;

      for (const [userId, score] of game.participants) {
        const isUpAction = Math.random() < 0.5;
        const action = isUpAction
          ? this.upActions[Math.floor(Math.random() * this.upActions.length)]
          : this.downActions[
              Math.floor(Math.random() * this.downActions.length)
            ];

        let scoreChange = isUpAction ? 1 : -1;
        let specialMoveText = "";

        // 必殺技の発動チェック（UPの時に5%の確率で発動）
        if (isUpAction && Math.random() < 0.05) {
          const specialMove =
            this.specialMoves[
              Math.floor(Math.random() * this.specialMoves.length)
            ];
          specialMoveText = `**${specialMove}** `;
          scoreChange *= 2; // スコア変更を2倍に
        }

        game.participants.set(userId, score + scoreChange);

        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        roundStatus += `**${displayName}**は${action}\n👉${specialMoveText}師匠の💕が${
          isUpAction ? (scoreChange > 1 ? "大幅up" : "up") : "down"
        }\n`;
      }

      await channel.send(roundStatus).catch(console.error);

      // 5ラウンド後の処理
      if (game.roundCount === 5) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await channel
          .send("**「師匠！！いまんとこ　どんな気分ですか！！？」**")
          .catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        const masterImageAttachment = new AttachmentBuilder(MASTER_IMAGE_URL, {
          name: "master.png",
        });
        await channel
          .send({ files: [masterImageAttachment] })
          .catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 6000));
        await channel
          .send("**「うーむ・・・気分的にはこんな感じぢゃーーっ！！」**")
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
          .send("**師匠の💘ランク**\n" + rankingMessage.join("\n"))
          .catch(console.error);

        await new Promise((resolve) => setTimeout(resolve, 7000));
      }

      if (game.roundCount < 10) {
        setTimeout(runRound, 15000); // 15秒後に次のラウンドを実行
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
        .send("**「BONSAI師匠っ、いかがでしたか！！？」**")
        .catch(console.error);

      const masterImageAttachment = new AttachmentBuilder(MASTER_IMAGE_URL, {
        name: "master.png",
      });
      await channel
        .send({ files: [masterImageAttachment] })
        .catch(console.error);

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const winner = Array.from(game.participants.entries()).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      const winnerUser = await channel.guild.members.fetch(winner[0]);
      const winnerDisplayName = winnerUser ? winnerUser.displayName : "Unknown";
      const winnerUsername = winnerUser ? winnerUser.user.username : "Unknown";
      const winnerImageUrl = this.getUserImageUrl(winnerUsername);
      const winnerBonsai =
        this.bonsaiImages[Math.floor(Math.random() * this.bonsaiImages.length)];

      const files = [
        new AttachmentBuilder(winnerImageUrl, { name: "winner.png" }),
        new AttachmentBuilder(winnerBonsai.url, { name: "bonsai.png" }),
      ];

      await channel
        .send({
          content: `「勝者は**${winnerDisplayName}**さん　ぢゃっ！！免許皆伝ぢゃ～いっ！」\n作品名：**${winnerBonsai.name}**`,
          files,
        })
        .catch(console.error);

      setTimeout(async () => {
        await channel
          .send(
            "CMぢゃっ！アスターといったらマイケル。マイケルといえばアスターぢゃ\n" +
              "フラっと寄ってみるのぢゃ\n" +
              "✅https://discord.gg/UVkAWQTvSQ\n\n" +
              "CMじゃっ！！BONSAI NFT CLUBは日本発の盆栽NFTのコミュニティぢゃ。覗いてみるんぢゃ！\n" +
              "✅https://discord.gg/DE3vN6m3Rt"
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

const bonsaiGame = new BonsaiGame();

export const data = new SlashCommandBuilder()
  .setName("bonsai")
  .setDescription("盆栽剪定コンテストを開催するぞ！");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = bonsaiGame.createGame(interaction.guildId);

    // 最初は無効なボタンを作成
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
        "**🌟アゲろ！BONSAI師匠の気分🎵イケてる！剪定する自分♪ おぬしの実力を見せるんぢゃっ**\n\n準備中ぢゃ。しば待たれい...",
      components: [row],
      files: [attachment],
    };

    const reply = await interaction.editReply(replyOptions);

    // 30秒後にボタンを有効化
    setTimeout(async () => {
      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("join")
          .setLabel("剪定する")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("✂️")
      );

      await interaction.editReply({
        content:
          "**🌟BONSAI師匠「わしの気分アゲアゲゲームぢゃ！ おぬしの実力を見せてみぃっ！」**\n\n剪定するボタンで参加できます！120秒後にスタートします！",
        components: [updatedRow],
      });

      // 90秒後にゲーム開始
      setTimeout(async () => {
        if (game.participants.size === 0) {
          await interaction.channel
            .send("参加者がいないため解散っ解散っ")
            .catch(console.error);
          bonsaiGame.games.delete(interaction.guildId);
        } else {
          await interaction.channel
            .send(
              "**「さぁ、腕の見せどころぢゃ～！！」**\n\n**🌿BONSAIコンテスト開始！🌿**"
            )
            .catch(console.error);
          bonsaiGame.startGame(interaction.guildId, interaction.channel);
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
  console.log("盆栽ボットを初期化しました");
}