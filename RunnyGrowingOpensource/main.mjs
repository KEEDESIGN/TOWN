import { Client, Collection, Events, GatewayIntentBits, ActivityType } from "discord.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import path from "path";

// Bot initialization imports
// Bot initialization imports
let initializeSnowBot, initializeKakekoBot, initializeZonbieBot, initializeSantaBot;
let initializeMarathonBot, initializeSwimBot, initializeKabuBot, initializeTrailBot;
let initializeStrikeBot, initializeSnowballBot, initializeBonsaiBot, initializeMochiBot;
let initializeMomijigariBot, initializeGeijutuBot, initializeOmikujiBot;

// Dynamic imports to avoid potential syntax issues
async function loadBotModules() {
    try {
        const snowModule = await import("./commands/TSDP/snow.mjs");
        initializeSnowBot = snowModule.initializeBot;

        const kakekoModule = await import("./commands/TSDP/kakeko.mjs");
        initializeKakekoBot = kakekoModule.initializeBot;

        const zonbieModule = await import("./commands/TSDP/zonbie.mjs");
        initializeZonbieBot = zonbieModule.initializeBot;

        const santaModule = await import("./commands/TSDP/santa.mjs");
        initializeSantaBot = santaModule.initializeBot;

        const marathonModule = await import("./commands/TSDP/marathon.mjs");
        initializeMarathonBot = marathonModule.initializeBot;

        const swimModule = await import("./commands/TSDP/swim.mjs");
        initializeSwimBot = swimModule.initializeBot;

        const kabuModule = await import("./commands/TSDP/kabu.mjs");
        initializeKabuBot = kabuModule.initializeBot;

        const trailModule = await import("./commands/TSDP/trail.mjs");
        initializeTrailBot = trailModule.initializeBot;

        const strikeModule = await import("./commands/TSDP/strike.mjs");
        initializeStrikeBot = strikeModule.initializeBot;

        const snowballModule = await import("./commands/TSDP/snowball.mjs");
        initializeSnowballBot = snowballModule.initializeBot;

        const bonsaiModule = await import("./commands/TSDP/bonsai.mjs");
        initializeBonsaiBot = bonsaiModule.initializeBot;

        const mochiModule = await import("./commands/TSDP/mochi.mjs");
        initializeMochiBot = mochiModule.initializeBot;

        const momijigariModule = await import("./commands/TSDP/momijigari.mjs");
        initializeMomijigariBot = momijigariModule.initializeBot;

        const geijutuModule = await import("./commands/TSDP/geijutu.mjs");
        initializeGeijutuBot = geijutuModule.initializeBot;

        const omikujiModule = await import("./commands/TSDP/omikuji.mjs");
        initializeOmikujiBot = omikujiModule.initializeBot;
    } catch (error) {
        console.error('Error loading bot modules:', error);
    }
}

import { initializeAutoGameScheduler } from "./auto-game-scheduler.mjs";
import CommandsRegister from "./regist-commands.mjs";

// Client configuration
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Commands and handlers initialization
async function initializeCommandsAndHandlers() {
    client.commands = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Load commands
    const categoryFoldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(categoryFoldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(categoryFoldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".mjs"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const module = await import(filePath);
            if (module.data) {
                client.commands.set(module.data.name, module);
            }
        }
    }

    // Load handlers
    const handlers = new Map();
    const handlersPath = path.join(__dirname, "handlers");
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith(".mjs"));

    for (const file of handlerFiles) {
        const filePath = path.join(handlersPath, file);
        const module = await import(filePath);
        handlers.set(file.slice(0, -4), module);
    }

    return handlers;
}

// Event handlers
async function setupEventHandlers(handlers) {
    client.on("interactionCreate", async interaction => {
        await handlers.get("interactionCreate").default(interaction);
    });

    client.on("voiceStateUpdate", async (oldState, newState) => {
        await handlers.get("voiceStateUpdate").default(oldState, newState);
    });

    client.on("messageCreate", async message => {
        if (message.author.id === client.user.id || message.author.bot) return;
        await handlers.get("messageCreate").default(message);
    });

    client.on("ready", async () => {
        await client.user.setActivity("🎲", {
            type: ActivityType.Custom,
            state: "ゲーム準備中",
        });
        console.log(`${client.user.tag} がログインしました！`);

        // Initialize auto game scheduler
        initializeAutoGameScheduler(client);
    });
}

// Initialize all game bots
async function initializeGameBots() {
    if (initializeKakekoBot) initializeKakekoBot();
    if (initializeZonbieBot) initializeZonbieBot();
    if (initializeSantaBot) initializeSantaBot();
    if (initializeMarathonBot) initializeMarathonBot();
    if (initializeSwimBot) initializeSwimBot();
    if (initializeStrikeBot) initializeStrikeBot();
    if (initializeKabuBot) initializeKabuBot();
    if (initializeBonsaiBot) initializeBonsaiBot();
    if (initializeMochiBot) initializeMochiBot();
    if (initializeTrailBot) initializeTrailBot();
    if (initializeMomijigariBot) initializeMomijigariBot();
    if (initializeGeijutuBot) initializeGeijutuBot();
    if (initializeOmikujiBot) initializeOmikujiBot();
    if (initializeSnowBot) initializeSnowBot();
    if (initializeSnowballBot) initializeSnowballBot();
}

// Main initialization
async function initialize() {
    try {
        await loadBotModules();
        const handlers = await initializeCommandsAndHandlers();
        await setupEventHandlers(handlers);
        await CommandsRegister();
        await initializeGameBots();
        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}

initialize();