import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("aisatsu")
  .setDescription("SNAP KIDSたちのお出迎え");

export async function execute(interaction) {
  await interaction.reply("Hello , This is SNAP TOWN. Have a GOOD TIME with friends!! ");
}
