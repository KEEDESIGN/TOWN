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

const GOAL_IMAGE_URL =
  "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/goal.jpg?v=1719554252118";

class KakekoGame {
  constructor() {
    this.games = new Map();
    this.fastMessages = [
      "🐶ワンコに追いかけられて加速！",
      "🏍バイクに乗ってズルした！",
      "📖走り方の本を熟読してみた！",
      "💭応援してくれる人の顔が浮かぶ！",
      "🚙その辺のおっさんの車に乗った！",
      "🧑隣の人に引っ張ってもらった！",
      "👠から👟に履き替えた!",
      "🐥小鳥が少し前に運んでくれた！",
      "🦅大鷲がつかんで先に進めた！",
      "💧水たまりを一気飛び越えた！",
      "☤足が速くなる魔法がかかった！",
      "🥤エナジードリンクを飲んだ！",
      "👟瞬足を履いた！",
      "🐩ラテさんに吠えられた！",
      "🌟ヘイストを唱えた！",
      "✉【至急】と書かれた✉が来た！",
      "🚃電車に乗り遅れそうだ！",
      "🐗イノシシに追いかけられた！",
      "🐅チーターになりきった！",
      "🎼アガる音楽を聴いた！",
      "🍗焼き肉の匂いを嗅いだ！",
      "💎落とした💎を🐻が拾って加速!",
      "👼エンゼル君が味方した!",
    ];
    this.slowMessages = [
      "🍌バナナの皮で滑った！",
      "👟靴紐が解けて地面に突っ込む！",
      "😴急に眠くなり寝た！",
      "🐜蟻の行列を踏めなかった！",
      "🪮髪型を整え始めた！",
      "🔙30m進んだのに逆走した！",
      "💩踏んだかも！靴裏チェック！",
      "🥴小さな事でクヨクヨした！",
      "🍚お腹が空いて力が出ない！",
      "🐯トラップにかかった！",
      "🍁落ち葉に足を取られた",
      "💛困っている人を助けた!",
      "💰お金を見つけて立ち止まる！",
      "🍃突風に煽られてしまった！",
      "💻スマホを落としてしまった！",
      "🕳️落とし穴に落ちた！",
      "🦆カルガモ親子が横切るのを待つ！",
      "🐈‍⬛黒猫が飛び出て進めない！",
      "🐼道端にパンダがいて見とれた！",
      "🚻おトイレに行きたすぎる！",
      "😿夜泣きがひどくて走れない！",
      "👣運動不足で足腰が痛む！",
      "🔙素敵な人についていく！",
      "🦋肩に止った蝶を逃したくない！",
      "👿デビル君に邪魔された！",
    ];
    this.boostMessages = [
      "🌟BOOST!🚀ロケットを装着しぶっ飛ぶ！",
      "🌟BOOST!🌈栄光の架け橋でぶっ飛ぶ！",
      "🌟BOOST!🦸‍♂️陸上選手に覚醒しぶっ飛ぶ！",
      "🌟BOOST!🌠流れ星に乗り込みぶっ飛ぶ！",
      "🌟BOOST!🐉呪いの力を習得してぶっ飛ぶ！",
      "🌟BOOST!🛩メーヴェに乗ってぶっ飛ぶ！",
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
        "https://cdn.glitch.global/60a83d0b-editch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C668_20240712145819.jpg?v=1720781355017",
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
        raceStarted: false,
        raceInterval: null,
        raceCount: 0,
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

  getUserImageUrl(userId) {
    return this.userImages.get(userId) || GOAL_IMAGE_URL;
  }

  async startRace(guildId, channel, interaction) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      channel.send("参加者がいないため解散っ解散っ");
      this.games.delete(guildId);
      return;
    }

    game.raceStarted = true;
    game.raceCount = 0;
    game.raceInterval = setInterval(async () => {
      game.raceCount++;
      let raceStatus = `\n **===🎤実況${game.raceCount}🎤===**\n`;
      let winner = null;

      // 参加者の進行状況を更新
      for (const [userId, distance] of game.participants) {
        const prevDistance = distance;
        let newDistance = distance;
        let message = "";

        // 4%の確率で大逆転Boostを発動
        if (Math.random() < 0.04) {
          newDistance += 30;
          message =
            this.boostMessages[
              Math.floor(Math.random() * this.boostMessages.length)
            ];
        } else {
          const progress = Math.floor(Math.random() * 11) + 5; // 進行距離を5m～15mに変更
          newDistance += progress;
          message =
            progress >= 10
              ? this.fastMessages[
                  Math.floor(Math.random() * this.fastMessages.length)
                ]
              : this.slowMessages[
                  Math.floor(Math.random() * this.slowMessages.length)
                ];
        }

        game.participants.set(userId, newDistance);

        if (newDistance >= 100) {
          winner = userId;
        }

        const totalProgress = newDistance - prevDistance;
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        raceStatus += `**${displayName}**は${message}\n👟**${totalProgress}m**進んだ**👉現在${newDistance}m**\n`;
      }

      // 参加者を距離順にソート
      const sortedParticipants = Array.from(game.participants.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      // ソートされた順番で状況を表示
      raceStatus += "\n🏃🏻‍♂️現在の順位\n";
      for (let i = 0; i < sortedParticipants.length; i++) {
        const [userId, distance] = sortedParticipants[i];
        const user = await channel.guild.members.fetch(userId);
        const displayName = user ? user.displayName : "Unknown";
        raceStatus += `${i + 1}位:**${displayName}** (${distance}m)\n`;
      }

      channel.send(raceStatus).catch(console.error);

      if (winner) {
        clearInterval(game.raceInterval);
        const winnerUser = await channel.guild.members.fetch(winner);
        const winnerDisplayName = winnerUser
          ? winnerUser.displayName
          : "Unknown";
        const winnerUsername = winnerUser
          ? winnerUser.user.username
          : "Unknown";
        const winnerImageUrl = this.getUserImageUrl(winnerUsername);

        channel
          .send({
            content: `\n\n **表彰**　\n\n  🎉🥇**${winnerDisplayName}さん (${winnerUsername}) が1着です**！！🥇🎉　 \n\n **🥇優勝おめでとうございます🥇**\n`,
            files: [winnerImageUrl, GOAL_IMAGE_URL],
          })
          .catch(console.error);
        this.games.delete(guildId);
      }
    }, 18000);
  }
}

const kakekoGame = new KakekoGame();

export const data = new SlashCommandBuilder()
  .setName("kakeko")
  .setDescription("👟レースを開催するぞー👟");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = kakekoGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("スタートラインにたつ")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("👟")
    );

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const imageURL =
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/start.jpg?v=1719547339368";
    const attachment = new AttachmentBuilder(imageURL, { name: "start.jpg" });

    const replyOptions = {
      content:
        "**🌟 SNAP RUNNING RACE 🌟\n\n　  　　  👟開催👟**　\n\n **「みんなー、いちについてッー！」**　\n\n　（180秒後にスタートだッ）",
      components: [row],
    };

    if (attachment) {
      replyOptions.files = [attachment];
    }

    await interaction.editReply(replyOptions);

    // 60秒後にレースを開始
    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel
          .send("参加者がいないため解散っ解散っ")
          .catch(console.error);
        kakekoGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel
          .send("**「よーいっ・・ドーーン！！！」**\n\n **👟GOGO!!SNAP!!👟**")
          .catch(console.error);
        kakekoGame.startRace(interaction.guildId, interaction.channel);
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

export function initializeBot() {
  console.log("かけっこボットを初期化しました");
}