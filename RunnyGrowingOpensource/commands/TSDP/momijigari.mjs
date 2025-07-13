import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

const GAME_DURATION = 100000; // 100秒
const ROUNDS = 5;
const AUTUMN_LEAVES = ["🍁", "🍂", "🌾", "🌰", "🍄"];
const GRANDMA_IMAGE =
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C723_20240823120454.jpg?v=1724412754372";
const RESULT_GRANDMA_IMAGE =
  "https://cdn.glitch.global/9a91b578-7de9-4397-9b3e-00cee59333ba/%E7%84%A1%E9%A1%8C723_20240901092329.jpg?v=1725150262186";

const GRANDMA_COMMENTS = [
  "うっひょーーきれいじゃの！！",
  "うけけけ　面白い。やるじゃないか",
  "むはははは　豪快な収穫じゃの",
  "わーい、素敵な秋じゃな。おーたむ　じゃよ",
  "おやおや、これは珍しい形じゃな。これアンタのか？",
  "ほっほっほ、この実がおいしそうじゃなぁ",
  "ほう、これをどこで！？なんて大きいんじゃ",
  "ふむふむ、で、そろそろご飯にするかい？",
  "まあ、なんて鮮やか色なんでしょう",
  "ふむふむ、この金色の色合いが素晴らしいのう",
  "ぶひゃっひゃっひゃ、あんた頭にたくさん🍂がついとる！",
  "ゴホゴホ、これは匂いがひどいのう・・・",
  "この形は・・・・祟りじゃぁー！！！",
  "ほーれみたことか。わしは反対じゃったんじゃ",
  "おっふ、これは毒じゃ・・・！！",
  "ほーらよくご覧、この模様が面白いだろう",
];

const PLAYER_IMAGES = [
  [
    "panda_fuku23",
    "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E3%81%B5%E3%81%8F%E3%81%B1%E3%82%93%20(2).jpg?v=1720504168004",
  ],
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
    "https://cdn.glitch.global/3ee2c63f-7c9b-4447-bb4d-d89b1a094c27/%E7%84%A1%E9%A1%8C699_20240729140343.jpg?v=1722303892455",
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
];

let currentGame = null;

export const data = new SlashCommandBuilder()
  .setName("momijigari")
  .setDescription(
    "モミジばあちゃんの「小さい秋見つけた」大会がスタートするよ～"
  );

export async function execute(interaction) {
  if (currentGame) {
    await interaction.reply("既にゲームが進行中です。");
    return;
  }
  await startGame(interaction);
}

async function startGame(interaction) {
  const startEmbed = new EmbedBuilder()
    .setColor("#FFA500")
    .setTitle("モミジばあちゃんの紅葉狩りゲーム")
    .setDescription(
      "**「今年の紅葉はどんなかねぇ～～。」**さあ、おばあちゃんのために素敵な秋を見つけてあげよう。"
    )
    .setImage(GRANDMA_IMAGE)
    .addFields({
      name: "参加方法",
      value:
        "**このメッセージに好きな絵文字でリアクションするだけ！180秒の間ね**",
    });

  const startMessage = await interaction.reply({
    embeds: [startEmbed],
    fetchReply: true,
  });
  await startMessage.react("🍂");

  try {
    await new Promise((resolve) => setTimeout(resolve, 180000));
    const reactions = await startMessage.reactions.cache.first().users.fetch();
    const participants = reactions
      .filter((user) => !user.bot)
      .map((user) => ({
        id: user.id.toString(),
        name: user.displayName || user.username,
        love: 0,
        lastAction: null,
        lastComment: null,
        lastLoveIncrease: 0,
      }));

    if (participants.length === 0) {
      await interaction.followUp("参加者がいないためゲームを中止します。");
      return;
    }

    currentGame = {
      participants,
      round: 0,
      channel: interaction.channel,
      roundActions: {},
    };

    await interaction.followUp("参加受付を終了しました。ゲームを開始します！");
    await startRound();
  } catch (error) {
    console.error("ゲーム開始中にエラーが発生しました:", error);
    await interaction.followUp(
      "ゲームの開始中にエラーが発生しました。もう一度お試しください。"
    );
  }
}

async function startRound() {
  currentGame.round++;
  currentGame.roundActions[currentGame.round] = {};

  let embed;
  let buttons;

  if (currentGame.round === 1) {
    // For the first round, we only need to show the round start information
    embed = createRoundEmbed();
    buttons = createActionButtons();
  } else {
    // For subsequent rounds, we show both the previous round results and the new round start
    embed = createCombinedEmbed(currentGame.round - 1, currentGame.round);
    buttons = createActionButtons();
  }

  try {
    const roundMessage = await currentGame.channel.send({ embeds: [embed], components: [buttons] });

    await new Promise((resolve) => setTimeout(resolve, GAME_DURATION / ROUNDS));

    // Remove buttons after the round ends
    await roundMessage.edit({ components: [] });

    if (currentGame.round < ROUNDS) {
      await startRound();
    } else {
      // For the last round, we need to show only the results
      const finalRoundEmbed = createRoundSummaryEmbed(currentGame.round);
      await currentGame.channel.send({ embeds: [finalRoundEmbed] });
      await announceResults();
    }
  } catch (error) {
    console.error('ラウンド進行中にエラーが発生しました:', error);
    await currentGame.channel.send('ゲームの進行中にエラーが発生しました。ゲームを終了します。');
    currentGame = null;
  }
}

function createActionButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("momiji")
      .setLabel("🍁を拾う")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("ginkgo")
      .setLabel("🌾を刈る")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("kuri")
      .setLabel("🌰を拾う")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("kinoko")
      .setLabel("🍄を採る")
      .setStyle(ButtonStyle.Secondary)
  );
}

function createRoundEmbed() {
  const embed = new EmbedBuilder()
    .setColor("#FF4500")
    .setTitle(`ラウンド ${currentGame.round}/${ROUNDS}`)
    .setDescription("**おばあちゃんが喜ぶような素敵な紅葉を見つけよう！**");

  currentGame.participants.forEach((p) => {
    embed.addFields({ name: p.name, value: `ばあちゃんの💕: ${p.love}` });
  });

  return embed;
}

function createRoundSummaryEmbed(roundNumber) {
  const embed = new EmbedBuilder()
    .setColor("#FFA07A")
    .setTitle(`ラウンド ${roundNumber} 結果`)
    .setDescription("**ばあちゃんの反応**");

  const totalLoveIncrease = currentGame.participants.reduce((sum, p) => {
    const action = currentGame.roundActions[roundNumber][p.id];
    return sum + (action ? action.loveIncrease : 0);
  }, 0);

  embed.addFields({
    name: "💕",
    value: `ばあちゃんの💕が合計 ${totalLoveIncrease} 増えた！`,
  });

  const randomComment = GRANDMA_COMMENTS[Math.floor(Math.random() * GRANDMA_COMMENTS.length)];
  embed.addFields({
    name: "感想",
    value: `「${randomComment}」`,
  });

  return embed;
}

function createCombinedEmbed(previousRound, currentRound) {
  const embed = new EmbedBuilder()
    .setColor("#FFA07A")
    .setTitle(`ラウンド ${previousRound} 結果 & ラウンド ${currentRound} 開始`)
    .setDescription("**ばあちゃんの反応 & 次のラウンド**");

  // Previous round summary
  const totalLoveIncrease = currentGame.participants.reduce((sum, p) => {
    const action = currentGame.roundActions[previousRound][p.id];
    return sum + (action ? action.loveIncrease : 0);
  }, 0);

  embed.addFields({
    name: `💕`,
    value: `ばあちゃんの💕が合計 ${totalLoveIncrease} 増えた！`,
  });

  const randomComment = GRANDMA_COMMENTS[Math.floor(Math.random() * GRANDMA_COMMENTS.length)];
  embed.addFields({
    name: `ばあちゃん感想`,
    value: `「**${randomComment}**」`,
  });
  
  currentGame.participants.forEach((p) => {
    embed.addFields({ name: p.name, value: `ばあちゃんの💕: ${p.love}` });
  });
  
  // Current round start
  embed.addFields({
    name: `ラウンド ${currentRound} 開始`,
    value: "ばあちゃんが喜ぶような素敵な紅葉を探せ！",
  });



  return embed;
}

async function announceResults() {
    const winner = currentGame.participants.reduce((prev, current) => 
        (prev.love > current.love) ? prev : current
    );

    const winnerImageInfo = PLAYER_IMAGES.find(player => 
        player[0].toLowerCase() === winner.name.toLowerCase() ||
        player[0] === winner.id
    );
    const winnerImage = winnerImageInfo ? winnerImageInfo[1] : 'https://example.com/default-image.jpg';

    const resultEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('**紅葉狩りの時間終了！**')
        .setDescription(`**ばあちゃんを最も喜ばせた人**: **${winner.name}**`)
        .addFields({ name: '**最終結果**', value: `**ばあちゃんの💕: ${winner.love}**` })
        .setImage(RESULT_GRANDMA_IMAGE);

    const randomLeaf = AUTUMN_LEAVES[Math.floor(Math.random() * AUTUMN_LEAVES.length)];
    resultEmbed.addFields({ name: '**おばあちゃん**', value: `**「まぁ、なんて素敵な紅葉狩りだったんだろうね～～！おばあちゃん、とってもうれしいよ～～みんなありがと～！」**` });

    const winnerEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`優勝者: ${winner.name}`)
        .setImage(winnerImage);

    console.log(`Winner: ${winner.name}, Image: ${winnerImage}`);

    // 結果と優勝者の画像を別々のEmbedで送信
    await currentGame.channel.send({ embeds: [resultEmbed, winnerEmbed] });
    currentGame = null;
}

export const handleButton = async (interaction) => {
  if (
    !currentGame ||
    !currentGame.participants.some((p) => p.id === interaction.user.id)
  ) {
    await interaction.reply({
      content: "このゲームに参加していません",
      ephemeral: true,
    });
    return;
  }

  const player = currentGame.participants.find(
    (p) => p.id === interaction.user.id
  );
  const currentRound = currentGame.round;

  if (currentGame.roundActions[currentRound][player.id]) {
    await interaction.reply({
      content:
        "このラウンドでは既に行動しています。次のラウンドをお待ちください。",
      ephemeral: true,
    });
    return;
  }

  const action = interaction.customId;

  const loveIncrease = Math.floor(Math.random() * 5) + 1;
  player.love += loveIncrease;

  const comment =
    GRANDMA_COMMENTS[Math.floor(Math.random() * GRANDMA_COMMENTS.length)];

  currentGame.roundActions[currentRound][player.id] = {
    action: action,
    comment: comment,
    loveIncrease: loveIncrease,
  };

  await interaction.reply({
    content: `あなたの行動: ${getActionName(action)}`,
    ephemeral: true,
  });
};

function getActionName(action) {
  switch (action) {
    case "momiji":
      return "モミジを拾う";
    case "ginkgo":
      return "稲を刈る";
    case "kuri":
      return "栗を拾う";
    case "kinoko":
      return "キノコを採る";
    default:
      return "不明な行動";
  }
}

export function initializeBot() {
  console.log("紅葉狩りおばあちゃんのSNAPゲームが初期化されました");
}