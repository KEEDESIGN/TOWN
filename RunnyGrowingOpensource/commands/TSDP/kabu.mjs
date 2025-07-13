import {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";

class InvestmentGame {
  constructor() {
    this.games = new Map();
    this.companies = ["Sコイン", "Nコイン", "Aコイン", "Pコイン"];
    this.newsMessages = [
      "新製品の発表で変動！",
      "業績不振のニュースで変動...",
      "大型契約獲得で急変動！",
      "競合他社の台頭で変動",
      "革新的技術の特許取得で変動",
      "市場予想を上回る決算で変動",
      "CEO交代のうわさで変動",
      "不祥事発生に伴い変動",
      "競合優位性をアピールし変動",
      "新市場への参入で変動",
      "国内需要の冷え込みにより変動",
      "海外投資家の人気銘柄になり変動",
      "製品リコールで変動",
      "好調な業績見通しで変動",
    ];
  }

  createGame(guildId) {
    if (!this.games.has(guildId)) {
      this.games.set(guildId, {
        participants: new Map(),
        stocks: new Map(this.companies.map(company => [company, 100])),
        round: 0,
        gameInterval: null,
        investedThisRound: new Set(),
      });
    }
    return this.games.get(guildId);
  }

  addParticipant(guildId, userId) {
    const game = this.games.get(guildId);
    if (game && game.round === 0) {
      game.participants.set(userId, {
        stocks: new Map(this.companies.map(company => [company, 0])),
        cash: 1000,
        lastTotalAssets: 1000,
      });
    }
  }

  async startGame(guildId, channel) {
    const game = this.games.get(guildId);
    if (!game || game.participants.size === 0) {
      await channel.send("参加者がいないためゲーム中止！");
      this.games.delete(guildId);
      return;
    }

    game.gameInterval = setInterval(async () => {
      game.round++;
      if (game.round > 10) {
        clearInterval(game.gameInterval);
        await this.endGame(guildId, channel);
        return;
      }

      await this.playRound(guildId, channel);
    }, 18000); // 18秒ごとにラウンドを進行
  }

  async playRound(guildId, channel) {
    const game = this.games.get(guildId);
    game.investedThisRound.clear();
    let roundStatus = `\n**===📈 ${game.round} 日目📈===**\n\n`;

    // 株価の変動と理由を生成
    for (const company of this.companies) {
      const change = Math.floor(Math.random() * 41) - 20; 
      const newPrice = Math.max(1, game.stocks.get(company) + change); // 最低価格を1に設定
      game.stocks.set(company, newPrice);
      const reason = this.newsMessages[Math.floor(Math.random() * this.newsMessages.length)];
      roundStatus += `**${company}**: ${newPrice}$ (${change >= 0 ? '+' : ''}${change}$) - ${reason}\n`;
    }

    // 投資ボタンを作成
    const row = new ActionRowBuilder().addComponents(
      ...this.companies.map(company => 
        new ButtonBuilder()
          .setCustomId(`invest_${company}`)
          .setLabel(`${company}を購入`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    // ラウンドごとの画像を追加
    const roundImageURL = "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C693_20240726083130.png?v=1721950467955"; // ラウンドごとの画像URLを設定
    const roundAttachment = new AttachmentBuilder(roundImageURL, { name: "round.png" });

    await channel.send({
      content: roundStatus + "\n今日購入するコインを1つ選択！",
      components: [row],
      files: [roundAttachment]
    });
  }

  async endGame(guildId, channel) {
    const game = this.games.get(guildId);
    await channel.send("**決算中...**");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒間待機

    let results = "**===🏆 最終結果 🏆===**\n\n";

    // 各参加者の総資産を計算
    const finalResults = await Promise.all(Array.from(game.participants.entries()).map(async ([userId, data]) => {
      let totalAssets = data.cash;
      for (const [company, shares] of data.stocks) {
        totalAssets += shares * game.stocks.get(company);
      }
      const user = await channel.guild.members.fetch(userId);
      return { userId, displayName: user.displayName, totalAssets };
    }));

    finalResults.sort((a, b) => b.totalAssets - a.totalAssets);

    // 結果を表示
    for (const [index, result] of finalResults.entries()) {
      results += `${index + 1}位: ${result.displayName} - 総資産: ${result.totalAssets}$\n`;
    }

    // コングラチュレーション画像を追加
    const congratsImageURL = "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%A8692_20240726083322.png?v=1721950467000"; // コングラチュレーション画像のURLを設定
    const congratsAttachment = new AttachmentBuilder(congratsImageURL, { name: "congrats.png" });

    await channel.send({
      content: results,
      files: [congratsAttachment]
    });
    this.games.delete(guildId);
  }

  invest(guildId, userId, company) {
    const game = this.games.get(guildId);
    if (game.investedThisRound.has(userId)) {
      return { success: false, reason: "already_invested" };
    }

    const participant = game.participants.get(userId);
    const stockPrice = game.stocks.get(company);

    if (participant.cash >= stockPrice) {
      participant.cash -= stockPrice;
      participant.stocks.set(company, (participant.stocks.get(company) || 0) + 1);
      game.investedThisRound.add(userId);

      const newTotalAssets = this.calculateTotalAssets(guildId, userId);
      const difference = newTotalAssets - participant.lastTotalAssets;
      participant.lastTotalAssets = newTotalAssets;

      return { success: true, totalAssets: newTotalAssets, difference };
    }
    return { success: false, reason: "insufficient_funds" };
  }

  calculateTotalAssets(guildId, userId) {
    const game = this.games.get(guildId);
    const participant = game.participants.get(userId);
    let totalAssets = participant.cash;
    for (const [company, shares] of participant.stocks) {
      totalAssets += shares * game.stocks.get(company);
    }
    return totalAssets;
  }
}

const investmentGame = new InvestmentGame();

export const data = new SlashCommandBuilder()
  .setName("kabu")
  .setDescription("📈SNAPインベストゲームを開始する📈");

export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const game = investmentGame.createGame(interaction.guildId);

    const imageURL = "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C692_20240725160438.png?v=1721891226250";
    const attachment = new AttachmentBuilder(imageURL, { name: "start.jpg" });

    await interaction.editReply({
      content: "**🌟 SNAPインベストゲーム 🌟\n\n　  　　  📈準備中📈**　\n\n **「みんなー、準備はいいかー？」**　\n\n　",
      files: [attachment],
    });

    await new Promise(resolve => setTimeout(resolve, 10000));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("参加する")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📈")
    );

    await interaction.editReply({
      content: "**🌟 SNAPインベストゲーム 🌟\n\n　  　　  📈開催📈**　\n\n **「みんなー、参加だー！」**　\n\n　（60秒後に開始します）",
      components: [row],
    });

    setTimeout(async () => {
      if (game.participants.size === 0) {
        await interaction.channel.send("参加者がいないためゲーム中止！").catch(console.error);
        investmentGame.games.delete(interaction.guildId);
      } else {
        await interaction.channel.send("**「ゲーム開始！」**\n\n **📈マーケットオープン！📈**").catch(console.error);
        investmentGame.startGame(interaction.guildId, interaction.channel);
      }
    }, 60000);
  } catch (error) {
    console.error("Error in execute function:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "エラーが発生しました。もう一度お試しください。", ephemeral: true }).catch(console.error);
    } else {
      await interaction.followUp({ content: "エラーが発生しました。もう一度お試しください。", ephemeral: true }).catch(console.error);
    }
  }
}

export async function handleButton(interaction) {
  try {
    const game = investmentGame.games.get(interaction.guildId);
    if (interaction.customId === "join") {
      if (game && game.round === 0) {
        await interaction.deferUpdate();
        investmentGame.addParticipant(interaction.guildId, interaction.user.id);
        await interaction.followUp({
          content: `**${interaction.user.username}**さんが参加しました！📈`,
          ephemeral: false
        });
      } else {
        await interaction.deferUpdate();
      }
    } else if (interaction.customId.startsWith("invest_")) {
      const company = interaction.customId.split("_")[1];
      if (game && game.round > 0 && game.round <= 10 && game.participants.has(interaction.user.id)) {
        await interaction.deferUpdate();
        const result = investmentGame.invest(interaction.guildId, interaction.user.id, company);
        if (result.success) {
          const differenceText = result.difference >= 0 ? `+${result.difference}` : result.difference;
          await interaction.followUp({
            content: `${company}を購入しました！\n現在の総資産: ${result.totalAssets}$ (${differenceText}$)`,
            ephemeral: true,
          });
        } else if (result.reason === "already_invested") {
          await interaction.followUp({
            content: `このラウンドではすでに投資しています。次のラウンドをお待ちください。`,
            ephemeral: true,
          });
        } else {
          await interaction.followUp({
            content: `資金が足りません！`,
            ephemeral: true,
          });
        }
      } else {
        await interaction.deferUpdate();
      }
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    if (!interaction.deferred) {
      await interaction.deferUpdate().catch(console.error);
    }
  }
}

export function initializeBot() {
  console.log("株ボットを初期化しました");
}