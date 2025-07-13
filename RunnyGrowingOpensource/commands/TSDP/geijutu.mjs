import {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";

const GAME_DURATION = 300000; // 5分（実際のゲーム時間）
const ROUNDS = 5;
const AUTUMN_THEMES = ["山の風景", "海の風景", "空の風景"];
const ART_STYLES = ["印象派", "水彩画", "抽象画"];
const ARTIST_IMAGE =
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C737_20240901110516.jpg?v=1725156408800";
const ARTWORK_IMAGES = [
  "",
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C742_20240901193900.png?v=1725187284103",
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C741_20240901193744.png?v=1725187288513",
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C740_20240901193502.png?v=1725187293223",
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C738_20240901193106.png?v=1725187296041",
];

let currentGame = null;

export const data = new SlashCommandBuilder()
  .setName("autumn-art")
  .setDescription("SNAP ART FESTIVALが開催されるよ～");

export async function execute(interaction) {
  if (currentGame) {
    await interaction.reply("既に芸術祭が進行中です。");
    return;
  }
  await startGame(interaction);
}

async function startGame(interaction) {
  const startEmbed = new EmbedBuilder()
    .setColor("#FFA500")
    .setTitle("SNAP ART FESTIVAL")
    .setDescription(
      "**「秋は芸術の季節ですよ。みんなで素晴らしい作品を生み出そう」**\n芸術の秋、SNAP画伯と一緒に秋をテーマにした作品を制作しよう。"
    )
    .setImage(ARTIST_IMAGE)
    .addFields({
      name: "参加方法",
      value: "**このメッセージに好きな絵文字でリアクションするだけ！**",
    });

  const startMessage = await interaction.reply({
    embeds: [startEmbed],
    fetchReply: true,
  });
  await startMessage.react("🎨");

  // 1分間の参加受付
  setTimeout(async () => {
    const reactions = await startMessage.reactions.cache.first().users.fetch();
    const participants = reactions
      .filter((user) => !user.bot)
      .map((user) => ({
        id: user.id.toString(),
        name: user.username,
        inspiration: 0,
        technique: 0,
        creativity: 0,
        hasActed: false,
      }));

    if (participants.length === 0) {
      await interaction.followUp("参加者がいないため芸術祭を中止します。");
      return;
    }

    currentGame = {
      participants,
      round: 0,
      message: null,
      theme: AUTUMN_THEMES[Math.floor(Math.random() * AUTUMN_THEMES.length)],
      style: ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)],
    };

    await interaction.followUp("参加受付を終了しました。芸術祭を開始します！");
    await startRound(interaction);
  }, 60000);
}

async function startRound(interaction) {
  currentGame.round++;
  
  // 各ラウンドの開始時に全プレイヤーの行動フラグをリセット
  currentGame.participants.forEach(p => p.hasActed = false);
  
  const buttons = createActionButtons();
  const embed = createRoundEmbed();

  if (currentGame.message) {
    await currentGame.message.edit({ embeds: [embed], components: [buttons] });
  } else {
    currentGame.message = await interaction.channel.send({
      embeds: [embed],
      components: [buttons],
    });
  }

  // 30秒後に未行動プレイヤーにリマインダーを送信
  setTimeout(() => sendReminders(interaction), 30000);

  // ラウンドの制限時間を設定（例：1分）
  setTimeout(async () => {
    await endRound(interaction);
    if (currentGame.round < ROUNDS) {
      await startRound(interaction);
    } else {
      await announceResults(interaction);
    }
  }, 60000); // 1分後にラウンド終了
}

async function sendReminders(interaction) {
  const inactivePlayers = currentGame.participants.filter(p => !p.hasActed);
  
  for (const player of inactivePlayers) {
    try {
      const user = await interaction.client.users.fetch(player.id);
      await user.send(`みんなが君の行動を待っているよ！ SNAP ART FESTIVALで素晴らしい芸術作品を作ろう！`);
    } catch (error) {
      console.error(`Failed to send reminder to ${player.name}: ${error}`);
    }
  }

  if (inactivePlayers.length > 0) {
    const embed = createRoundEmbed();
    embed.addFields({ 
      name: 'リマインダー', 
      value: `${inactivePlayers.map(p => p.name).join(', ')} さん、まだ行動していません。みんなが待っています！` 
    });
    await currentGame.message.edit({ embeds: [embed] });
  }
}

async function endRound(interaction) {
  const embed = createRoundEmbed();
  const inactivePlayers = currentGame.participants.filter(p => !p.hasActed);
  
  // Add default actions for inactive players
  inactivePlayers.forEach(player => {
    // Randomly select a default action
    const defaultActions = ['sketch', 'color', 'detail', 'rethink'];
    const defaultAction = defaultActions[Math.floor(Math.random() * defaultActions.length)];
    
    let increase = Math.floor(Math.random() * 2) + 1; // Slightly lower increase for default actions
    
    switch (defaultAction) {
      case "sketch":
        player.inspiration += increase;
        break;
      case "color":
        player.technique += increase;
        break;
      case "detail":
        player.creativity += increase;
        break;
      case "rethink":
        player.inspiration += Math.floor(increase / 2);
        player.technique += Math.floor(increase / 2);
        player.creativity += Math.floor(increase / 2);
        break;
    }
    
    player.hasActed = true;
  });
  
  if (inactivePlayers.length > 0) {
    embed.addFields({ 
      name: 'デフォルトアクション', 
      value: `${inactivePlayers.map(p => p.name).join(', ')} さんは自動的にデフォルトのアクションを実行しました。` 
    });
  } else {
    embed.addFields({ name: 'ラウンド終了', value: '全員が行動を完了しました。次のラウンドに進みます。' });
  }
  
  await currentGame.message.edit({ embeds: [embed], components: [] });
}

function createActionButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("sketch")
      .setLabel("スケッチ")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("color")
      .setLabel("彩色")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("detail")
      .setLabel("細部の作り込み")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("rethink")
      .setLabel("「芸術は爆発だ」")
      .setStyle(ButtonStyle.Secondary)
  );
}

function createRoundEmbed() {
  const embed = new EmbedBuilder()
    .setColor("#FF4500")
    .setTitle(`制作時間 ${currentGame.round}/${ROUNDS}`)
    .setDescription(
      `**テーマ: ${currentGame.theme}、スタイル: ${currentGame.style}**\n画伯の言葉: 「芸術は自由でわがままなものよ。感性に従いなさい。」`
    );

  currentGame.participants.forEach((p) => {
    const total = p.inspiration + p.technique + p.creativity;
    embed.addFields({
      name: p.name,
      value: `インスピレーション: ${p.inspiration}, 技術力: ${p.technique}, 創造性: ${p.creativity} (総合: ${total})`,
    });
  });

  return embed;
}

async function announceResults(interaction) {
  const winner = currentGame.participants.reduce((prev, current) => {
    const prevTotal = prev.inspiration + prev.technique + prev.creativity;
    const currentTotal =
      current.inspiration + current.technique + current.creativity;
    return prevTotal > currentTotal ? prev : current;
  });

  const resultEmbed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("**SNAP ART FESTIVAL 結果発表！**")
    .setDescription(
      `**最も素晴らしい作品を制作した芸術家**: **${winner.name}**`
    )
    .addFields({
      name: "**最終結果**",
      value: `**インスピレーション: ${winner.inspiration}, 技術力: ${winner.technique}, 創造性: ${winner.creativity}**`,
    })
    .setImage(
      ARTWORK_IMAGES[Math.floor(Math.random() * ARTWORK_IMAGES.length)]
    );

  resultEmbed.addFields({
    name: "**画伯評**",
    value: `**「${winner.name}君の作品は${currentGame.theme}を${currentGame.style}で見事に表現してる。素晴らしい才能だ！」**`,
  });

  await interaction.channel.send({ embeds: [resultEmbed] });
  currentGame = null;
}

export async function handleButton(interaction) {
  if (!currentGame || !currentGame.participants.some((p) => p.id === interaction.user.id)) {
    await interaction.reply({
      content: "このフェスに参加していません",
      ephemeral: true,
    });
    return;
  }

  const player = currentGame.participants.find(p => p.id === interaction.user.id);

  // プレイヤーが既に行動済みかチェック
  if (player.hasActed) {
    await interaction.reply({
      content: "このラウンドでは既に行動済みです。次のラウンドをお待ちください。",
      ephemeral: true,
    });
    return;
  }

  const action = interaction.customId;

  // 芸術性向上ロジック
  let increase = Math.floor(Math.random() * 3) + 1;

  switch (action) {
    case "sketch":
      player.inspiration += increase;
      break;
    case "color":
      player.technique += increase;
      break;
    case "detail":
      player.creativity += increase;
      break;
    case "rethink":
      player.inspiration += Math.floor(increase / 2);
      player.technique += Math.floor(increase / 2);
      player.creativity += Math.floor(increase / 2);
      break;
  }

  // 行動済みフラグを立てる
  player.hasActed = true;

  await interaction.reply({
    content: `行動が完了しました: ${action}。このラウンドでの行動は終了です。次のラウンドをお待ちください。`,
    ephemeral: true,
  });

  // 全員が行動を終えたかチェック
  if (currentGame.participants.every(p => p.hasActed)) {
    const embed = createRoundEmbed();
    embed.addFields({ name: '全員行動完了', value: '次のラウンドに進みます' });
    await currentGame.message.edit({ embeds: [embed], components: [] });
    
    // 次のラウンドを即座に開始
    if (currentGame.round < ROUNDS) {
      await startRound(interaction);
    } else {
      await announceResults(interaction);
    }
  } else {
    // まだ全員が行動していない場合は、現在の状態を更新
    const embed = createRoundEmbed();
    const inactivePlayers = currentGame.participants.filter(p => !p.hasActed);
    if (inactivePlayers.length > 0) {
      embed.addFields({ 
        name: '待機中', 
        value: `${inactivePlayers.map(p => p.name).join(', ')} さんの行動を待っています。` 
      });
    }
    await currentGame.message.edit({ embeds: [embed] });
  }
}

export function initializeBot() {
  console.log("SNAPARTFESTIVALゲームが初期化されました");
}