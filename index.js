const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const handler = require("./handler");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) =>
  new Promise((resolve) => rl.question(text, resolve));

async function startSage() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
  });

  if (!sock.authState.creds.registered) {
    const phoneNumber = await question(
      "📱 Enter Your WhatsApp Number:\nExample: 263783766205\n➤ "
    );
    const code = await sock.requestPairingCode(
      phoneNumber.trim().replace(/[^0-9]/g, "")
    );
    console.log(`\n🔑 YOUR PAIRING CODE: ${code}\n`);
    console.log(`1. Open WhatsApp`);
    console.log(`2. Settings → Linked Devices`);
    console.log(`3. Link With Phone Number`);
    console.log(`4. Enter Code: ${code}\n`);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) startSage();
    } else if (connection === "open") {
      console.log(`
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
⚡🌌  S A G E  B O T  🌌⚡
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
✅ Bot Connected Successfully!
🟢 Status : Online
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
      `);
      rl.close();
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const msg = messages[0];
    if (!msg.message) return;
    handler(sock, msg);
  });
}


startSage();
