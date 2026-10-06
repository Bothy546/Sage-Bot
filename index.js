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
    const phoneNumber = process.env.PHONENUMBER;
    if (!phoneNumber) {
      console.log("================================");
      console.log("❌ PHONENUMBER Not Found!");
      console.log("Add PHONENUMBER In Secrets!");
      console.log("================================");
      return;
    }

    console.log("================================");
    console.log("📱 Phone: " + phoneNumber);
    console.log("⏳ Getting Pairing Code...");
    console.log("================================");

    await new Promise(r => setTimeout(r, 3000));

    try {
      const code = await sock.requestPairingCode(
        phoneNumber.replace(/[^0-9]/g, "")
      );

      console.log("================================");
      console.log("💎 SAGE BOT PAIRING CODE 💎");
      console.log("================================");
      console.log("🔑 CODE: " + code);
      console.log("================================");
      console.log("Steps:");
      console.log("1. Open WhatsApp");
      console.log("2. Settings");
      console.log("3. Linked Devices");
      console.log("4. Link With Phone Number");
      console.log("5. Enter Code: " + code);
      console.log("================================");
    } catch (err) {
      console.log("❌ Error Getting Code: " + err.message);
    }
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log("🔴 Disconnected! Reconnecting...");
      if (shouldReconnect) startSage();
    } else if (connection === "open") {
      console.log("================================");
      console.log("✅ SAGE BOT Connected!");
      console.log("🟢 Status: Online");
      console.log("⚡ Bot Is Ready!");
      console.log("================================");
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
