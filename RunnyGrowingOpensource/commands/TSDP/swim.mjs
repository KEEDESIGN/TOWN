import {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";

// クラスレベルで参加処理中のユーザーを追跡
const processingUsers = new Set();

class SwimGame {
  constructor() {
    this.games = new Map();
    this.swimStyles = ["平泳", "クロール", "背泳", "バタフライ"];
    this.fastMessages = [
      "🏊‍♂️完璧なターンで加速！",
      "🌊波に乗る！",
      "🐬イルカに乗る！",
      "💪ポセイドンの力覚醒！",
      "🏄‍♂️サーフィンにのる！",
      "🧜‍♀️人魚に応援してもらった！",
      "🌟息継ぎしなかった！",
      "🚤船にのった！",
      "🐋リバイアサンの力を借りる！",
      "🏄‍♀️水となりきる",
    ];
    this.slowMessages = [
      "💦水を飲んでしまった！",
      "🦀カニとエビに両足をはさまれる",
      "🌿海藻に足をとられる！",
      "👓ゴーグルにひびがはいる！",
      "🐙ポセイドンの怒りを買う！",
      "🐡ウニが刺さった！いたい！",
      "🐚きれいな貝殻に見とれる",
      "🌊リバイアサンの召喚に失敗！",
      "🧜‍♂️人魚の歌で眠る！",
      "🐠レーンを間違えた！",
    ];
    this.boostMessages = [
      "**🌟BOOST!**🚀アクアマン覚醒！",
      "**🌟BOOST!**🌈ニモとポニョが支援！",
      "**🌟BOOST!**🦈JAWSから逃げるのに必死！",
      "**🌟BOOST!**🌊速く泳げる魔法がかかる！",
      "**🌟BOOST!**🧜‍♀️人魚になりきった！",
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
        "papicoyoshida",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C500_20240525125907.jpg?v=1720504169582",
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
        ".lol88",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/LOL.jpg?v=1720781353088",
      ],
       [
        "kitoshi4687",
        "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C711_20240804084443.jpg?v=1722754072984",
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
        "tyozetumeron",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/chozetu.jpg?v=1720504183550",
      ],
      [
        "taka0157",
        "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C659_20240710211915.jpg?v=1720672405685",
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
        raceStarted: false,
        raceInterval: null,
        raceCount: 0,
        swimStyleChoices: new Map(),
      });
    }
    return this.games.get(guildId);
  }

  getGame(guildId) {
    return this.games.get(guildId);
  }

  addParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.raceStarted) {
      game.participants.set(userId, 0);
    }
  }

  removeParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.raceStarted) {
      game.participants.delete(userId);
    }
  }

  async startRace(guildId, channel) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      await channel.send("参加者がいないため大会中止！").catch(console.error);
      this.games.delete(guildId);
      return;
    }

    game.raceStarted = true;
    game.raceCount = 0;

    const imageUrls = [
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C654_20240708191355.jpg?v=1720502590641",
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C654_20240708191244.jpg?v=1720502592908",
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C654_20240708191314.jpg?v=1720502592047",
    ];

    game.raceInterval = setInterval(async () => {
      game.raceCount++;
      const advantageStyle =
        this.swimStyles[Math.floor(Math.random() * this.swimStyles.length)];
      let raceStatus = `\n **===🎤実況${game.raceCount}🎤===**\n`;
      raceStatus += `BOOST泳法: **${advantageStyle}**\n\n`;
      let winner = null;

      for (const [userId, distance] of game.participants) {
        const prevDistance = distance;
        let newDistance = distance;
        let message = "";

        const userStyle =
          game.swimStyleChoices.get(userId) ||
          this.swimStyles[Math.floor(Math.random() * this.swimStyles.length)];
        const progress = Math.floor(Math.random() * 16) + 10;

        if (userStyle === advantageStyle) {
          newDistance += Math.floor(progress * 1.3);
        } else {
          newDistance += progress;
        }

        if (Math.random() < 0.04) {
          newDistance += 30;
          message =
            this.boostMessages[
              Math.floor(Math.random() * this.boostMessages.length)
            ];
        } else {
          message =
            progress >= 20
              ? this.fastMessages[
                  Math.floor(Math.random() * this.fastMessages.length)
                ]
              : this.slowMessages[
                  Math.floor(Math.random() * this.slowMessages.length)
                ];
        }

        game.participants.set(userId, newDistance);

        if (newDistance >= 200) {
          winner = userId;
        }

        const totalProgress = newDistance - prevDistance;
        const user = await channel.guild.members
          .fetch(userId)
          .catch(() => null);
        const displayName = user ? user.displayName : "Unknown";
        raceStatus += `**${displayName}** (${userStyle})は\n${message}\n🏊‍♂️**${totalProgress}m**進んだ**👉現在${newDistance}m**\n`;
      }

      const sortedParticipants = Array.from(game.participants.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      raceStatus += "\n🏊‍♂️現在の順位\n";
      for (let i = 0; i < sortedParticipants.length; i++) {
        const [userId, distance] = sortedParticipants[i];
        const user = await channel.guild.members
          .fetch(userId)
          .catch(() => null);
        const displayName = user ? user.displayName : "Unknown";
        raceStatus += `${i + 1}位:**${displayName}**\n`;
      }

      const swimStyleButtons = new ActionRowBuilder().addComponents(
        ...this.swimStyles.map((style) =>
          new ButtonBuilder()
            .setCustomId(`swimStyle_${style}`)
            .setLabel(style)
            .setStyle(ButtonStyle.Primary)
        )
      );

      // ランダムに画像を選択
      const randomImageUrl =
        imageUrls[Math.floor(Math.random() * imageUrls.length)];
      const attachment = new AttachmentBuilder(randomImageUrl, {
        name: "race_image.jpg",
      });

      await channel
        .send({
          content: raceStatus,
          components: [swimStyleButtons],
          files: [attachment], // ランダムに選択された画像を添付
        })
        .catch(console.error);

      if (winner) {
        clearInterval(game.raceInterval);
        const winnerUser = await channel.guild.members
          .fetch(winner)
          .catch(() => null);
        const winnerDisplayName = winnerUser
          ? winnerUser.displayName
          : "Unknown";
        const winnerUsername = winnerUser
          ? winnerUser.user.username
          : "Unknown";

        // ユーザー名に基づいて画像URLを取得
        const winnerImageUrl = this.userImages.get(winnerUsername);

        // 表示する画像のリストを作成
        const imagesToDisplay = [
          "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C650_20240708011439.jpg?v=1720392300820",
        ];

        // 優勝者の固有の画像がある場合、それも追加
        if (winnerImageUrl) {
          imagesToDisplay.push(winnerImageUrl);
        }

        await channel
          .send({
            content: `\n\n **=====表彰式=====**　\n\n  🎉🥇**${winnerDisplayName}さん (${winnerUsername}) が1着です**！！🥇🎉　 \n\n **🥇優勝おめでとうございます🥇**\n`,
            files: imagesToDisplay,
          })
          .catch(console.error);
        this.games.delete(guildId);
      }
    }, 20000);
  }

  chooseSwimStyle(guildId, userId, style) {
    const game = this.getGame(guildId);
    if (game && game.raceStarted) {
      game.swimStyleChoices.set(userId, style);
    }
  }
}

const swimGame = new SwimGame();

export const data = new SlashCommandBuilder()
  .setName("swim")
  .setDescription("🏊‍♂️水泳大会を開催するぞー🏊‍♂️");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = swimGame.createGame(interaction.guildId);

    const imageURL =
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C650_20240708010257.jpg?v=1720392300092";
    const attachment = new AttachmentBuilder(imageURL, { name: "start.jpg" });

    // 初期メッセージを送信（ボタンなし）
    await interaction.editReply({
      content:
        "**🌟 SNAP SWIMMING RACE 🌟\n\n　  　　  🏊‍♂️開催準備中🏊‍♂️**　\n\n **「みんなー、準備はいいかー？」**　\n\n　",
      files: [attachment],
    });

    // 10秒待機
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // ボタンを含むメッセージを編集
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("スタート台に立つ")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🏊‍♂️")
    );

    await interaction.editReply({
      content:
        "**🌟 SNAP SWIMMING RACE 🌟\n\n　  　　  🏊‍♂️開催🏊‍♂️**　\n\n **「みんなー、スタート台に上がれー！」**　\n\n　（180秒後にスタートだッ）",
      components: [row],
    });

    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel
          .send("参加者がいないため大会中止！")
          .catch(console.error);
        swimGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel
          .send(
            "**「よーいっ・・ドーーン！！！」**\n\n **🏊‍♂️LET'S SNAP SWIM!!🏊‍♂️**"
          )
          .catch(console.error);
        swimGame.startRace(interaction.guildId, interaction.channel);
      }
    }, 180000);
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

export async function handleButton(interaction) {
  try {
    const game = swimGame.getGame(interaction.guildId);
    if (interaction.customId === "join") {
      const userId = interaction.user.id;

      // ユーザーが既に処理中でないことを確認
      if (processingUsers.has(userId)) {
        await interaction.deferUpdate();
        return;
      }

      processingUsers.add(userId);

      try {
        if (game && !game.raceStarted) {
          // ユーザーが既に参加しているかチェック
          if (!game.participants.has(userId)) {
            await interaction.deferUpdate();
            swimGame.addParticipant(interaction.guildId, userId);
            await interaction.followUp({
              content: `**${interaction.user.username}**さんがスタート台に立ちました！🏊‍♂️`,
              ephemeral: false
            });
          } else {
            // 既に参加している場合は静かに無視
            await interaction.deferUpdate();
          }
        } else {
          // レースが開始されている場合も静かに無視
          await interaction.deferUpdate();
        }
      } finally {
        // 処理が完了したらフラグを解除
        processingUsers.delete(userId);
      }
    } else if (interaction.customId.startsWith("swimStyle_")) {
      const style = interaction.customId.split("_")[1];
      if (
        game &&
        game.raceStarted &&
        game.participants.has(interaction.user.id)
      ) {
        await interaction.deferUpdate();
        swimGame.chooseSwimStyle(
          interaction.guildId,
          interaction.user.id,
          style
        );

        await interaction.followUp({
          content: `${style}に切り替えるぞっ！`,
          ephemeral: true,
        });
      } else {
        await interaction.deferUpdate();
      }
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    // エラーが発生した場合も静かに処理
    if (!interaction.deferred) {
      await interaction.deferUpdate().catch(console.error);
    }
  }
}

export function initializeBot() {
  console.log("水泳ボットを初期化しました");
}