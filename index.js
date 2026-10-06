const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const handler = require("./handler");

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
    const phoneNumber = process.env.PHONE_NUMBER;
    if (!phoneNumber) {
      console.log("❌ Set PHONE_NUMBER in Railway Variables!");
      console.log("Example: 263783766205");
      return;
    }
    await new Promise(r => setTimeout(r, 3000));
    const code = await sock.requestPairingCode(
      phoneNumber.replace(/[^0-9]/g, "")
    );
    console.log(`
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
🔑 YOUR PAIRING CODE: ${code}
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎

1. Open WhatsApp
2. Settings
3. Linked Devices
4. Link With Phone Number
5. Enter Code: ${code} ✅
    `);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log("🔴 Connection Closed. Reconnecting...");
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
