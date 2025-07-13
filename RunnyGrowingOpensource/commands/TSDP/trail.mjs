import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Client,
  GatewayIntentBits,
} from "discord.js";

const GOAL_DISTANCE = 1000; // ゴールまでの距離（メートル）
const DEFAULT_COURSE = "お花畑コース"; // デフォルトのコース

class TrailGame {
  constructor() {
    this.games = new Map();
    this.playerImages = new Map([
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

    this.courses = [
      "お花畑コース",
      "クライミングコース",
      "緩やかな丘コース",
      "森林コース",
      "獣道コース",
    ];
    this.courseMessages = {
      お花畑コース: {
        below100: [
          "🌸美しい花に見とれて小休止！",
          "🌺色とりどりの世界にめまいがするぅ。",
          "🍃葉っぱに足を取られてすっころぶ！",
          "🍁紅葉にみとれて転んじゃいました",
          "🚽いきたくなっちゃった",
          "草むらから蛇🐍が現れ足に絡みつく",
          "急におなかがすいてピクニックシートを広げてお食事🍚",
          "突如UFOが現れ動画撮影に夢中に🛸",
          "☺マイケルさんが話しかけてきて足が止まる",
        ],
        above100: [
          "🌸桜の花びらが舞い散る中、前進中！",
          "🌺色とりどりの花に励まされ、ぐんぐん進んじゃう。",
          "🌸花より団子！団子食いたい早くいこう！",
          "🌺花びら餅を食べて速度アップ！！",
          "👨かっこいい人見つけて大急ぎでおっかける！！",
          "👨ラテさんがお花畑に現れて一緒に走ってくれた🐶",
        ],
      },
      クライミングコース: {
        below100: [
          "🪨つかんだ岩が剥がれ落ちて危ない！目に！！",
          "🏔️クライミングシューズに穴があいた！！",
          "🪨つかみどころがない！！！！",
          "🏔️命綱のおかげで九死に一生をえた！",
          "🚽いきたくなっちゃった",
          "突如UFOが現れ動画撮影に夢中に🛸",
          "☺マイケルさんが話しかけてきて足が止まる",
        ],
        above100: [
          "🪨大きな岩を乗り越えました！",
          "🏔️高度を上げるにつれ、景色が広がります。",
          "🪨オブザーブ大成功。最速のコースどり！",
          "🏔️最新のクライミングシューズでぐんぐん駆け上がる",
        ],
      },
      緩やかな丘コース: {
        below100: [
          "🏞️なだらかな坂道を着実に進んでいます。",
          "🚶‍♂️ゆったりとしたペースで前進中。",
          "🏞️景色がよくてうっとり見とれてしまう",
          "🚶‍♂️足が少し痛む",
          "🚽いきたくなっちゃった",
           "草むらから蛇🐍が現れ足に絡みつく",
          "急におなかがすいてピクニックシートを広げてお食事🍚",
          "突如UFOが現れ動画撮影に夢中に🛸",
          "☺マイケルさんが話しかけてきて足が止まる",
        ],
        above100: [
          "🌄丘の上から美しい景色が見えて加速！",
          "🌅高原の爽やかな風を感じます",
          "🌄天気良好、足取りさいこう！！",
          "🌅夕焼けに向かって走り加速。",
          "👨ラテさんがお花畑に現れて一緒に走ってくれた🐶",
        ],
      },
      森林コース: {
        below100: [
          "🌳森の🐻さんに遭遇。死んだフリして減速",
          "🍃涼しい木陰の中、順調に登っています。",
          "🌳ガサガサっと音がする！何かいる、コワイ！！ｓ",
          "🍃木の葉乱舞！道を見失った",
          "🚽いきたくなっちゃった",
          "急におなかがすいてピクニックシートを広げてお食事🍚",
          "突如UFOが現れ動画撮影に夢中に🛸",
          "☺マイケルさんが話しかけてきて足が止まる",
        ],
        above100: [
          "🌿森の香りに包まれながら前進中！",
          "🦉森の奥深くに分け入り、高度を上げています。",
          "🌿森の恵みに感謝することでマイナスイオンパワー加速！",
          "🦉森から湧き出る天然水を飲んで加速！！",
　         "👨ラテさんがお花畑に現れて一緒に走ってくれた🐶",
        ],
      },
      獣道コース: {
        below100: [
          "🐾目の前を動物たちの群れが邪魔してきます。",
          "🦌鹿のツノに刺さらないように注意深く走る！",
          "🐾右に🦁、左に🐯、前方に🐺、後方に🐗",
          "🦌🐼に見とれて動けない！！",
          "突如UFOが現れ動画撮影に夢中に🛸",
          "☺マイケルさんが話しかけてきて足が止まる",
        ],
        above100: [
          "🐺狼の遠吠えが聞こえる中、慎重に前進。",
          "🦅高度を上げ、鷹の視点に近づいています。",
          "🦁ライオンにまたがり加速。",
          "🦅につかまれて一気に加速。",
        ],
      },
    };
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        started: false,
        interval: null,
        advantageCourse: null,
      });
    }
    return this.games.get(guildId);
  }

  addParticipant(guildId, userId) {
    const game = this.games.get(guildId);
    if (game && !game.started) {
      game.participants.set(userId, { distance: 0, course: null });
    }
  }

  setCourse(guildId, userId, course) {
    const game = this.games.get(guildId);
    if (game) {
      const participant = game.participants.get(userId);
      if (participant) {
        participant.course = course;
      }
    }
  }

  async startGame(guildId, channel) {
    const game = this.games.get(guildId);
    if (!game || game.participants.size === 0) {
      await channel.send("参加者がいないため、ゲームを開始できません。");
      this.games.delete(guildId);
      return;
    }

    // コース未選択の参加者にデフォルトコースを割り当てる
    for (const [userId, participant] of game.participants) {
      if (!participant.course) {
        participant.course = DEFAULT_COURSE;
        const user = await channel.guild.members.fetch(userId);
        await channel.send(
          `${user.displayName} さんはコースを選択しなかったため、${DEFAULT_COURSE} に進みます。`
        );
      }
    }

    // ラン兄ちゃんのスタートメッセージと画像を表示
    const startEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("ラン兄ちゃん")
      .setDescription("**みんな俺についてこれるか！？いくぞスタートだ！！**")
      .setImage(
        "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C722_20240818124744.jpg?v=1723977698575"
      )
      .setTimestamp();

    await channel.send({ embeds: [startEmbed] });

    game.started = true;
    game.interval = setInterval(() => this.updateGame(guildId, channel), 18000);
  }

  async updateGame(guildId, channel) {
    try {
      const game = this.games.get(guildId);
      let gameStatus = "";
      let winner = null;

      game.advantageCourse =
        this.courses[Math.floor(Math.random() * this.courses.length)];

      for (const [userId, participant] of game.participants) {
        let progress;
        if (participant.course === game.advantageCourse) {
          progress = 150;
        } else {
          progress = Math.floor(Math.random() * 101) + 50;
        }
        participant.distance += progress;

        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";

        const courseMessages =
          this.courseMessages[participant.course] ||
          this.courseMessages[DEFAULT_COURSE];
        const messageList =
          participant.distance >= 100
            ? courseMessages.above100
            : courseMessages.below100;
        const message =
          messageList[Math.floor(Math.random() * messageList.length)];

        gameStatus += `**${displayName}** (${participant.course}): ${message}\n`;
        gameStatus += `🏃‍♂️ **${progress}m** 登り、現在 **${participant.distance}m** 地点\n\n`;

        if (participant.distance >= GOAL_DISTANCE && !winner) {
          winner = userId;
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("🏔️ トレイルラン実況 🏃‍♂️")
        .setDescription(gameStatus)
        .addFields({ name: "🎯コース", value: game.advantageCourse })
        .setTimestamp();

      const courseButtons = this.courses.map((course) =>
        new ButtonBuilder()
          .setCustomId(`course_${course}`)
          .setLabel(course)
          .setStyle(ButtonStyle.Secondary)
      );

      const courseRow = new ActionRowBuilder().addComponents(courseButtons);

      await channel.send({
        embeds: [embed],
        components: [courseRow],
        content: "コースを変更する場合は、以下のボタンから選択してください。",
      });

      if (winner) {
        clearInterval(game.interval);

        // ラン兄ちゃんの優勝者決定前メッセージと画像を表示
        const finishEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("ラン兄ちゃん")
          .setDescription(
            "**ゴホゴホ・・!!** \nなかなかやるな・・!\n**ハァハァ・・**\nえ？俺？全然疲れてないから！ゴファッ・・！\nか、かんちがいすんなｸﾞﾊﾞｧよなっ! \nまあ**今日の勝者はキミや**\n 次は敗けへんで！！へへーんだ \n**ゴフ！**"
          )
          .setImage(
            "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C722_20240818125021.jpg?v=1723977707089"
          )
          .setTimestamp();

        await channel.send({ embeds: [finishEmbed] });

        const winnerUser = await channel.guild.members.fetch(winner);
        const winnerDisplayName = winnerUser
          ? winnerUser.displayName
          : "Unknown";

        // 優勝者の画像を取得
        const winnerImageUrl =
          this.playerImages.get(winnerUser.user.username) ||
          "https://example.com/default-image.jpg";

        const winnerEmbed = new EmbedBuilder()
          .setColor(0xffd700)
          .setTitle(`🎉 優勝者: ${winnerDisplayName} 🏆`)
          .setDescription(`${winnerDisplayName} が一番最初に山頂に到達！！優勝だ！`)
          .setImage(winnerImageUrl)
          .setTimestamp();

        await channel.send({ embeds: [winnerEmbed] });
        this.games.delete(guildId);
      }
    } catch (error) {
      console.error("Error in updateGame:", error);
      await channel.send(
        "ゲームの更新中にエラーが発生しました。管理者に連絡してください。"
      );
    }
  }
}

const trailGame = new TrailGame();

export const data = new SlashCommandBuilder()
  .setName("trail")
  .setDescription("🏔️ トレイルランを開催します 🏃‍♂️");

export async function execute(interaction) {
  await interaction.deferReply();

  const game = trailGame.createGame(interaction.guildId);

  const createEmbed = (timeLeft) => {
    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🏔️ **SNAP TRAIL RUN 開催！** 🏃‍♂️")
      .setDescription(
        `**SNAPトレイルランに参加して美しい山々を駆け抜けろっ！！！**\n参加登録受付中！\n\n残り時間: ${timeLeft}秒`
      )
      .setImage(
        "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/trail.jpg?v=1723869140645"
      )
      .setTimestamp()
      .setFooter({ text: `${timeLeft}秒後に参加受付を締め切ります` });
  };

  const createRow = () => {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join_trail")
        .setLabel("参加する")
        .setStyle(ButtonStyle.Primary)
    );
  };

  const initialEmbed = createEmbed(180);
  const initialRow = createRow();

  const message = await interaction.editReply({
    embeds: [initialEmbed],
    components: [initialRow],
  });

  const updateMessage = async (timeLeft) => {
    const updatedEmbed = createEmbed(timeLeft);
    const updatedRow = createRow();
    await message.edit({ embeds: [updatedEmbed], components: [updatedRow] });
  };

  setTimeout(() => updateMessage(120), 60000); // 60秒後
  setTimeout(() => updateMessage(80), 100000); // 100秒後
  setTimeout(() => updateMessage(30), 150000); // 150秒後

  setTimeout(async () => {
    if (game.participants.size === 0) {
      await interaction.channel.send(
        "参加者がいないため、ゲームを開始できません。"
      );
      trailGame.games.delete(interaction.guildId);
    } else {
      const courseButtons = trailGame.courses.map((course) =>
        new ButtonBuilder()
          .setCustomId(`course_${course}`)
          .setLabel(course)
          .setStyle(ButtonStyle.Secondary)
      );

      const courseRow = new ActionRowBuilder().addComponents(courseButtons);

      const courseSelectionEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("🏔️ コース選択 🏃‍♂️")
        .setDescription(
          "最初のコースを選択してください。30秒後にスタートです！"
        )
        .setImage(
          "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/trail.jpg?v=1723869140645"
        )
        .setTimestamp();

      await interaction.channel.send({
        embeds: [courseSelectionEmbed],
        components: [courseRow],
      });

      setTimeout(
        () => trailGame.startGame(interaction.guildId, interaction.channel),
        30000
      );
    }
  }, 180000);
}

export function handleButton(interaction) {
  if (interaction.customId === "join_trail") {
    trailGame.addParticipant(interaction.guildId, interaction.user.id);
    interaction.reply({
      content: `${interaction.user.username} がトレイルランに参加しました！`,
      ephemeral: true,
    });
  } else if (interaction.customId.startsWith("course_")) {
    const course = interaction.customId.replace("course_", "");
    trailGame.setCourse(interaction.guildId, interaction.user.id, course);
    interaction.reply({ content: `${course}を選択！`, ephemeral: true });
  }
}

export function initializeBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "trail") {
      await execute(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  });

  // ここでクライアントにコマンドを追加する処理を行う
  // 例: client.application?.commands.create(data);

  // Botのログイン処理は main.mjs で行うため、ここでは行わない
}
