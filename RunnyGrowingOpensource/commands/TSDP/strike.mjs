import { SlashCommandBuilder } from "discord.js";

const GAME_IMAGE_URL =
  "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C670_20240717114721.jpg?v=1721184709387";
const VICTORY_IMAGE_URL =
  "https://cdn.glitch.global/60a83d0b-edab-43dd-83f1-1ac7dc6138d4/%E7%84%A1%E9%A1%8C670_20240717121422.jpg?v=1721186113873";
const IMAGE_URL_1 =
  "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/mizu.png?v=1721804216085";
const IMAGE_URL_2 =
  "https://cdn.glitch.global/b5b496fb-b5d7-411a-8aa4-2c0b3328b119/%E6%B0%B4.png?v=1721804216836";

let gameInProgress = false;
let participants = new Map();
let currentImageUrl = IMAGE_URL_1;

const damageReasons = [
  "強烈な水圧を受けて",
  "ツルッと滑って転んで",
  "水風船爆弾により",
  "真水ではなく海水で",
  "含み損を抱えて",
  "軟水ではなく硬水で",
];

const healReasons = [
  "動物たちに癒されて",
  "アスターのイイ話を見つけて",
  "ZKストライクで楽しんで",
  "大事な人の写真を見て",
  "ナイストレードで",
  "ニューロのAIにより",
];

const commentaryMessages = [
  "＜攻撃者＞が＜防御者＞に突進🚀！",
  "＜攻撃者＞と＜防御者＞の打ち合い💦！",
  "＜攻撃者＞が＜防御者＞を追いまわす💧！",
  "＜攻撃者＞が＜防御者＞に奇襲攻撃🥏！",
  "＜攻撃者＞と＜防御者＞が水を浴びて踊る💃！",
];

export const data = new SlashCommandBuilder()
  .setName("strike")
  .setDescription("ウォータスナップストライクを開始します");

export async function execute(interaction) {
  if (gameInProgress) {
    await interaction.reply("ゲームはすでに進行中です。");
    return;
  }

  gameInProgress = true;
  participants.clear();

  const message = {
    embeds: [
      {
        title: "WATAR SNAP STRIKE",
        image: { url: GAME_IMAGE_URL },
        description:
          "参加者募集中！ 3分間の間に「参加する」ボタンを押して参加しよう",
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: "参加する",
            custom_id: "join_strike",
          },
        ],
      },
    ],
  };

  await interaction.reply(message);
  console.log("Game initialization started. Waiting for participants...");
  setTimeout(
    () => startGame(interaction.client, interaction.channelId),
    180000
  );
}

export async function handleButton(interaction) {
  if (interaction.customId === "join_strike") {
    if (!gameInProgress) {
      await interaction.reply({
        content: "現在、参加可能なゲームはないです。",
        ephemeral: true,
      });
      return;
    }

    const displayName = interaction.member.displayName;

    if (!participants.has(displayName)) {
      participants.set(displayName, { name: displayName, motivation: 100 });
      await interaction.reply(`**${displayName}**さんが参加した！`);
      console.log(
        `${displayName} joined the game. Total participants: ${participants.size}`
      );
    } else {
      await interaction.reply({
        content: "すでに参加しています。",
        ephemeral: true,
      });
    }
  }
}

function divideTeams(participants) {
  const shuffled = Array.from(participants.entries()).sort(
    () => 0.5 - Math.random()
  );

  if (shuffled.length % 2 !== 0) {
    shuffled.push(["John", { name: "John", motivation: 100 }]);
  }

  const teamSize = Math.ceil(shuffled.length / 2);
  const teamA = new Map(shuffled.slice(0, teamSize));
  const teamB = new Map(shuffled.slice(teamSize));

  return { teamA, teamB };
}

async function displayTeams(channel, teamA, teamB) {
  const teamAMembers = Array.from(teamA.values())
    .map((p) => p.name)
    .join(", ");
  const teamBMembers = Array.from(teamB.values())
    .map((p) => p.name)
    .join(", ");

  await channel.send("**【チーム分け決定！】**");
  await channel.send(`**SNAPチーム**: ${teamAMembers}`);
  await channel.send(`**MICHAELチーム**: ${teamBMembers}`);
}

async function displayTurnInfo(channel, commentary, teamA, teamB) {
  const teamAMotivation = Array.from(teamA.values()).reduce(
    (sum, p) => sum + p.motivation,
    0
  );
  const teamBMotivation = Array.from(teamB.values()).reduce(
    (sum, p) => sum + p.motivation,
    0
  );

  const content = `**【実況】**\n${commentary}\n\n**【戦況】**\nSNAPチーム: **🩵${teamAMotivation}**　\nMICHAELチーム: **🩵${teamBMotivation}**`;

  await channel.send({
    embeds: [
      {
        description: content,
        image: { url: currentImageUrl },
      },
    ],
  });
  currentImageUrl = currentImageUrl === IMAGE_URL_1 ? IMAGE_URL_2 : IMAGE_URL_1;
}

async function startGame(client, channelId) {
  try {
    console.log("Starting game...");
    console.log("Participants:", Array.from(participants.entries()));

    const channel = await client.channels.fetch(channelId);

    if (participants.size < 1) {
      await channel.send("参加者が足りないためゲームを中止します。");
      gameInProgress = false;
      return;
    }

    const { teamA, teamB } = divideTeams(participants);
    console.log("Teams divided:", {
      teamA: Array.from(teamA.entries()),
      teamB: Array.from(teamB.entries()),
    });

    await displayTeams(channel, teamA, teamB);

    await channel.send("**🔫🔫水鉄砲で争うチームバトルのスタート！💦💦**");

    const totalParticipants = teamA.size + teamB.size;
    const maxDamage = totalParticipants >= 6 ? 50 : 30;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10秒待機

      const activeParticipants = [...teamA.values(), ...teamB.values()].filter(
        (p) => p.motivation > 0
      );
      if (activeParticipants.length <= 1) break;

      let commentary = "";
      for (let i = 0; i < 3; i++) {
        const event = Math.random() < 0.67 ? "damage" : "heal"; // 攻撃の確率を2/3に変更
        const actor =
          activeParticipants[
            Math.floor(Math.random() * activeParticipants.length)
          ];
        const target = activeParticipants.filter((p) => p !== actor)[
          Math.floor(Math.random() * (activeParticipants.length - 1))
        ];

        const commentaryMessage = commentaryMessages[
          Math.floor(Math.random() * commentaryMessages.length)
        ]
          .replace("＜攻撃者＞", actor.name)
          .replace("＜防御者＞", target.name);
        commentary += `${commentaryMessage}\n`;

        if (event === "damage") {
          const damage = Math.floor(Math.random() * maxDamage) + 10;
          target.motivation = Math.max(0, target.motivation - damage);
          const reason =
            damageReasons[Math.floor(Math.random() * damageReasons.length)];
          commentary += `🥏 ${target.name}が${reason}${damage}❌ (残り🩵 ${target.motivation})\n`;
        } else {
          const heal = Math.floor(Math.random() * 20) + 5;
          actor.motivation = Math.min(100, actor.motivation + heal);
          const reason =
            healReasons[Math.floor(Math.random() * healReasons.length)];
          commentary += `✨ ${actor.name}が${reason}${heal}⏫ (残り🩵 ${actor.motivation})\n`;
        }

        if (target.motivation === 0) {
          commentary += `🤸🔚${target.name}がゲームから離脱！\n`;
        }
      }

      await displayTurnInfo(channel, commentary, teamA, teamB);

      const teamAAlive = Array.from(teamA.values()).some(
        (p) => p.motivation > 0
      );
      const teamBAlive = Array.from(teamB.values()).some(
        (p) => p.motivation > 0
      );
      if (!teamAAlive || !teamBAlive) break;
    }

    const teamAsurvivors = Array.from(teamA.values()).filter(
      (p) => p.motivation > 0
    ).length;
    const teamBsurvivors = Array.from(teamB.values()).filter(
      (p) => p.motivation > 0
    ).length;

    const victoryMessage = {
      embeds: [
        {
          title: "**サバイバルゲーム終了―**",
          image: { url: VICTORY_IMAGE_URL },
        },
      ],
    };

    let winningTeam;
    let winningTeamMembers;

    if (teamAsurvivors.length > teamBsurvivors.length) {
      await channel.send(victoryMessage);
      await channel.send("**🏆 SNAPチームの勝利！おめでとうございます！**");
      winningTeam = teamA;
      winningTeamMembers = Array.from(teamA.values());
      await channel.send(`チームメンバー: ${winningTeamMembers.map(p => p.name).join(', ')}`);
    } else if (teamBsurvivors.length > teamAsurvivors.length) {
      await channel.send(victoryMessage);
      await channel.send("**🏆 MICHAELチームの勝利！おめでとうございます！**");
      winningTeam = teamB;
      winningTeamMembers = Array.from(teamB.values());
      await channel.send(`/nチームメンバー:**${winningTeamMembers.map(p => p.name).join(', ')}**`);
    } else {
      await channel.send("**🤝 両チーム同数生存！引き分けです！**");
      winningTeamMembers = [...Array.from(teamA.values()), ...Array.from(teamB.values())];
      await channel.send(`全参加者: ${winningTeamMembers.map(p => p.name).join(', ')}`);
    }

    await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒待機
    await channel.send("\n**ちょっと待って！様子がおかしいぞ！？**");
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒待機
    await channel.send("\n**突如として勝者たちの間で仲間割れが始まったようだ！**");

    await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒待機

    while (winningTeamMembers.length > 1) {
      const attacker = winningTeamMembers[Math.floor(Math.random() * winningTeamMembers.length)];
      const victim = winningTeamMembers.filter(p => p !== attacker)[Math.floor(Math.random() * (winningTeamMembers.length - 1))];

      const damage = Math.floor(Math.random() * 50) + 20;
      victim.motivation = Math.max(0, victim.motivation - damage);

      const attackReason = [
        "水鉄砲で強烈な一撃を放ち",
        "突然裏切りの水風船を投げつけ",
        "くすぐり攻撃を仕掛け",
        "冷水シャワーを浴びせ",
        "水中から奇襲を仕掛け"
      ][Math.floor(Math.random() * 5)];

      await channel.send(`**${attacker.name}**が${attackReason}**${victim.name}**に${damage}のダメージ！`);
      
      if (victim.motivation <= 0) {
        await channel.send(`**${victim.name}**が大泣き😭`);
        winningTeamMembers = winningTeamMembers.filter(p => p !== victim);
      }

      await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒待機
    }

    const ultimateWinner = winningTeamMembers[0];
    await channel.send(`\n🎉🎉最終勝者は**${ultimateWinner.name}**さんです！おめでとうございます！🎉🎉**`);

    await channel.send(
      "\n\n**（宣伝です）**\n✅Michael FamilyはAstar・neuro最新情報を追うのに最適！時々遊びに来てね"
    );
    await channel.send("https://discord.gg/qQ66nEZrFp");
  } catch (error) {
    console.error("Error in startGame:", error);
    const channel = await client.channels.fetch(channelId);
    await channel.send(
    "ゲーム進行中にエラーが発生しました。申し訳ありませんが、もう一度お試しください。"
    );
  } finally {
    gameInProgress = false;
    console.log("Game ended.");
  }
}

export function initializeBot() {
  console.log("Strike game initialized");
}