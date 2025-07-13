// Dynamic imports to avoid syntax issues
let handleSwimButton, handleStrikeButton, handleSnowballButton;
let handleKingyoButton, handleShatekiButton, handleKabuButton;
let handleTrailButton, handleMomijigariButton, handleGeijutsuButton;
let handleSantaButton, handleOmikujiButton;

async function loadHandlers() {
  try {
    const swimModule = await import("../commands/TSDP/swim.mjs");
    handleSwimButton = swimModule.handleButton;

    const strikeModule = await import("../commands/TSDP/strike.mjs");
    handleStrikeButton = strikeModule.handleButton;

    const snowballModule = await import("../commands/TSDP/snowball.mjs");
    handleSnowballButton = snowballModule.handleButton;

    const kingyoModule = await import("../commands/TSDP/kingyo.mjs");
    handleKingyoButton = kingyoModule.handleKingyoButton;

    const shatekiModule = await import("../commands/TSDP/shateki.mjs");
    handleShatekiButton = shatekiModule.handleShatekiButton;

    const kabuModule = await import("../commands/TSDP/kabu.mjs");
    handleKabuButton = kabuModule.handleButton;

    const trailModule = await import("../commands/TSDP/trail.mjs");
    handleTrailButton = trailModule.handleButton;

    const momijigariModule = await import("../commands/TSDP/momijigari.mjs");
    handleMomijigariButton = momijigariModule.handleButton;

    const geijutsuModule = await import("../commands/TSDP/geijutu.mjs");
    handleGeijutsuButton = geijutsuModule.handleButton;

    const santaModule = await import("../commands/TSDP/santa.mjs");
    handleSantaButton = santaModule.handleSantaButton;

    const omikujiModule = await import("../commands/TSDP/omikuji.mjs");
    handleOmikujiButton = omikujiModule.handleOmikujiButton;
  } catch (error) {
    console.error('Error loading handlers:', error);
  }
}

// Load handlers on module initialization
await loadHandlers();

export default async (interaction) => {
  // 修正: isCommand() -> isChatInputCommand()
  if (interaction.isChatInputCommand()) {
    console.log(`Command received: ${interaction.commandName}`);

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`Command ${interaction.commandName} not found`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `Error executing command ${interaction.commandName}:`,
        error
      );
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "コマンド実行中にエラーが発生しました。",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "コマンド実行中にエラーが発生しました。",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isButton()) {
    console.log(`Button pressed: ${interaction.customId}`);

    try {
      if (
        interaction.customId === "join" ||
        interaction.customId.startsWith("swimStyle_")
      ) {
        if (handleSwimButton) await handleSwimButton(interaction);
      } else if (interaction.customId === "join_strike") {
        if (handleStrikeButton) await handleStrikeButton(interaction);
      } else if (interaction.customId === "kingyo_button") {
        if (handleKingyoButton) await handleKingyoButton(interaction);
      } else if (interaction.customId === "shateki_button") {
        if (handleShatekiButton) await handleShatekiButton(interaction);
      } else if (interaction.customId.startsWith("invest_")) {
        if (handleKabuButton) await handleKabuButton(interaction);
      } else if (interaction.customId === "join_trail" || interaction.customId.startsWith("course_")) {
        if (handleTrailButton) await handleTrailButton(interaction);
      } else if (interaction.customId === "join_zombie") {
        const { handleButton: handleZombieButton } = await import("../commands/TSDP/zonbie.mjs");
        await handleZombieButton(interaction);
      } else if (interaction.customId === "momiji" || interaction.customId === "ginkgo" ||
                interaction.customId === "kuri" || interaction.customId === "kinoko") {
        if (handleMomijigariButton) await handleMomijigariButton(interaction);
      } else if (interaction.customId === "sketch" || interaction.customId === "color" ||
                interaction.customId === "detail" || interaction.customId === "rethink") {
        if (handleGeijutsuButton) await handleGeijutsuButton(interaction);
      } else if (interaction.customId === "join_santa") {
        if (handleSantaButton) await handleSantaButton(interaction);
      } else if (interaction.customId === "omikuji_button") {
        if (handleOmikujiButton) await handleOmikujiButton(interaction);
      } else if (interaction.customId === "join_snowball") {
        if (handleSnowballButton) await handleSnowballButton(interaction);
      }
    } catch (error) {
      console.error(
        `Error handling button interaction ${interaction.customId}:`,
        error
      );
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "ボタン操作中にエラーが発生しました。",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "ボタン操作中にエラーが発生しました。",
          ephemeral: true,
        });
      }
    }
  }
};