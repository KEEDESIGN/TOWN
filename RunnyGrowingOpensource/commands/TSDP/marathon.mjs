import { dirname, join } from "path";
import fs from "fs/promises";
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

class MarathonGame {
  constructor() {
    this.games = new Map();
    this.pendingParticipants = new Map();
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
      "📢声援を浴びて加速！",
      "🏍先導のバイクに乗せて貰う",
      "🛣道を間違えた",
      "✨光るロードが現れた",
      "♪サライが流れてきた",
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
      "👦観客に抱きつかれた！",
      "🚙中継車に邪魔された！",
      "👟靴が脱げる！",
      "💦汗で前が見えない！",
      "🌬風に乗ってトラックを逆走",
      "🕳️マンホールに落ちた",
      "📢野次を受けた",
      "🐻が現れて遠回りした",
      "🚽お腹を下してに立ち寄る",
    ];
    this.boostMessages = [
      "**🌟BOOST🌟**🚀ロケットを装着しぶっ飛ぶ！",
      "**🌟BOOST🌟**🌈栄光の架け橋でぶっ飛ぶ！",
      "**🌟BOOST🌟**🦸‍♂️陸上選手に覚醒しぶっ飛ぶ！",
      "**🌟BOOST🌟**🌠流れ星に乗り込みぶっ飛ぶ！",
      "**🌟BOOST🌟**🐉呪いの力を習得してぶっ飛ぶ！",
      "**🌟BOOST🌟**🛩メーヴェに乗ってぶっ飛ぶ！",
    ];
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

  addPendingParticipant(guildId, userId) {
    if (!this.pendingParticipants.has(guildId)) {
      this.pendingParticipants.set(guildId, new Set());
    }
    this.pendingParticipants.get(guildId).add(userId);
  }

  processPendingParticipants(guildId) {
    const game = this.getGame(guildId);
    const pending = this.pendingParticipants.get(guildId) || new Set();
    for (const userId of pending) {
      game.participants.set(userId, 0);
    }
    this.pendingParticipants.delete(guildId);
  }

  removeParticipant(guildId, userId) {
    const game = this.getGame(guildId);
    if (game && !game.raceStarted) {
      game.participants.delete(userId);
    }
  }

  async startRace(guildId, channel, interaction) {
    const game = this.getGame(guildId);
    if (!game || game.participants.size === 0) {
      await channel.send("参加者がいないため解散っ解散っ");
      this.games.delete(guildId);
      return;
    }

    game.raceStarted = true;
    game.raceCount = 0;
    let halfwayReached = false;

    game.raceInterval = setInterval(async () => {
      try {
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
            newDistance += 12.6;
            message =
              this.boostMessages[
                Math.floor(Math.random() * this.boostMessages.length)
              ];
          } else {
            const progress = (Math.floor(Math.random() * 4201) + 2100) / 1000;
            newDistance += progress;
            message =
              progress >= 4.2
                ? this.fastMessages[
                    Math.floor(Math.random() * this.fastMessages.length)
                  ]
                : this.slowMessages[
                    Math.floor(Math.random() * this.slowMessages.length)
                  ];
          }

          game.participants.set(userId, newDistance);

          if (newDistance >= 42.195) {
            winner = userId;
          }

          // 折り返し地点チェック
          if (
            !halfwayReached &&
            prevDistance < 21.0975 &&
            newDistance >= 21.0975
          ) {
            halfwayReached = true;
          }

          const totalProgress = newDistance - prevDistance;
          const user = await channel.guild.members.fetch(userId);
          const displayName = user ? user.displayName : "Unknown";
          raceStatus += `**${displayName}**は${message}\n👟**${totalProgress.toFixed(
            3
          )}km**進んだ**👉現在${newDistance.toFixed(3)}km**\n`;
        }

        // 参加者を距離順にソート
        const sortedParticipants = Array.from(game.participants.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        // ソートされた順番で状況を表示
        raceStatus += "\n🏃現在の順位\n";
        for (let i = 0; i < sortedParticipants.length; i++) {
          const [userId, distance] = sortedParticipants[i];
          const user = await channel.guild.members.fetch(userId);
          const displayName = user ? user.displayName : "Unknown";
          raceStatus += `${i + 1}位:**${displayName}** (${distance.toFixed(
            3
          )}km)\n`;
        }

        // 折り返し地点メッセージ
        if (halfwayReached) {
          let halfwayMessage = "**🏃‍♂️ 折り返し 🏃‍♂️**\n\n現在の順位:\n";
          for (let i = 0; i < sortedParticipants.length; i++) {
            const [userId, distance] = sortedParticipants[i];
            const user = await channel.guild.members.fetch(userId);
            const displayName = user ? user.displayName : "Unknown";
            halfwayMessage += `${
              i + 1
            }位: **${displayName}** (${distance.toFixed(3)}km)\n`;
          }

          const imageAttachment = new AttachmentBuilder(
            "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C633_20240705123322.jpg?v=1720150517109",
            { name: "halfway.jpg" }
          );

          await channel.send({
            content: halfwayMessage,
            files: [imageAttachment],
          });

          halfwayReached = false;
        }

        // 通常の実況メッセージを送信
        await channel.send(raceStatus);

        if (winner) {
          clearInterval(game.raceInterval);

          game.raceStarted = false;
          game.raceInterval = null;
          game.raceCount = 0;

          const winnerUser = await channel.guild.members.fetch(winner);
          const winnerDisplayName = winnerUser
            ? winnerUser.displayName
            : "Unknown";
          const winnerUsername = winnerUser
            ? winnerUser.user.username
            : "Unknown";
          await channel.send({
            content: `\n\n **表彰**　\n\n  🎉🥇**${winnerDisplayName}さん (${winnerUsername}) が1着です**！！🥇🎉　 \n\n **🥇優勝おめでとうございます🥇**\n`,
            files: [
              "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C624_20240705112531.jpg?v=1720146429613",
            ],
          });
          this.games.delete(guildId);
        }
      } catch (error) {
        console.error("Error in race interval:", error);
        await channel
          .send("レース中にエラーが発生しました。")
          .catch(console.error);
      }
    }, 24000);
  }
}

const marathonGame = new MarathonGame();

export const data = new SlashCommandBuilder()
  .setName("marathon")
  .setDescription("🏃マラソンを開催するぞー🏃");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = marathonGame.createGame(interaction.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("スタートラインにたつ")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🏃")
        .setDisabled(false) // 初期状態では活性化
    );

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const imageURL =
      "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C624_20240705112452.jpg?v=1720146430350";
    const attachment = new AttachmentBuilder(imageURL, { name: "start.jpg" });

    const replyOptions = {
      content:
        "**🌟 SNAP MARATHON 🌟\n\n　  　　  🏃開催🏃**　\n\n **「みんなー、いちについてッー！」**　\n\n　（180秒後にスタートだッ）",
      components: [row],
    };

    if (attachment) {
      replyOptions.files = [attachment];
    }

    const sentMessage = await interaction.editReply(replyOptions);

    // 60秒後にレースを開始
    setTimeout(async () => {
      marathonGame.processPendingParticipants(interaction.guildId);
      if (game.participants.size === 0) {
        await interaction.channel
          .send("参加者がいないため解散っ解散っ")
          .catch(console.error);
        marathonGame.games.delete(interaction.guildId);
      } else {
        // ボタンを非活性化
        row.components[0].setDisabled(true);
        await sentMessage.edit({ components: [row] });

        await interaction.channel
          .send("**「よーいっ・・ドーーン！！！」**\n\n **🏃GOGO!!SNAP!!🏃**")
          .catch(console.error);
        marathonGame.startRace(interaction.guildId, interaction.channel);
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

async function handleJoinButton(interaction) {
  const game = marathonGame.getGame(interaction.guildId);
  if (game && !game.raceStarted) {
    try {
      await interaction.deferUpdate();

      marathonGame.addPendingParticipant(interaction.guildId, interaction.user.id);

      const userDisplayName = interaction.member
        ? interaction.member.displayName
        : "Unknown";

      // 全員に見えるメッセージを送信
      await interaction.channel.send(`**${userDisplayName}**さんがスタートラインに立った✅`);

      // 参加者本人にのみ見えるメッセージ
      await interaction.followUp({
        content: `スタートラインに立ちました。レース開始をお待ちください。`,
        ephemeral: true
      });

    } catch (error) {
      console.error("ボタン処理エラー:", error);
      await interaction.followUp({
        content: "参加処理中にエラーが発生しました。",
        ephemeral: true
      }).catch(console.error);
    }
  } else {
    await interaction.reply({
      content: "レースが既に始まっているか、エラーが発生しました。",
      ephemeral: true,
    }).catch(console.error);
  }
}

export function initializeBot() {
  console.log("マラソンボットを初期化しました");
}