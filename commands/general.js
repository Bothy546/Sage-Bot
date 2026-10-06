module.exports = async (command, { sock, msg, from, pushName, config }) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  switch (command) {
    case "menu":
      await sock.sendMessage(from, {
        text: `💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
⚡🌌  S • A • G • E  B • O • T  🌌⚡
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎

  ⟦ 👤 ⟧ User    »  ${pushName}
  ⟦ 📅 ⟧ Date    »  ${date}
  ⟦ ⏰ ⟧ Time    »  ${time}
  ⟦ ⌨️ ⟧ Prefix  »  ${config.prefix}
  ⟦ 🟢 ⟧ Status  »  Online

🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 📌 GENERAL
    ▸ .menu ▸ .ping ▸ .alive
    ▸ .botinfo ▸ .time ▸ .hello
🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 🎮 GAMES
    ▸ .truth ▸ .dare ▸ .quiz
    ▸ .slot ▸ .roll ▸ .flip
🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 👥 GROUP
    ▸ .kick ▸ .add ▸ .promote
    ▸ .demote ▸ .tagall ▸ .mute
🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 🛡️ PROTECTION
    ▸ .antidelete ▸ .viewonce
    ▸ .antilink ▸ .antispam
🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 🔧 UTILITY
    ▸ .calc ▸ .define
🌟❖━━━━━━━━━━━━━━━━━━━━━━━━❖🌟
  ⟐ 👑 OWNER
    ▸ .broadcast ▸ .restart
    ▸ .block ▸ .unblock
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎
  ⚡🌌 Powered By SAGE BOT v1.0.0 🌌⚡
💎꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂💎`
      }, { quoted: msg });
      break;

    case "ping":
      const start = Date.now();
      await sock.sendMessage(from, {
        text: `🏓 Pong!\n⚡ Speed: ${Date.now() - start}ms`
      }, { quoted: msg });
      break;

    case "alive":
      await sock.sendMessage(from, {
        text: `💎 SAGE BOT IS ALIVE! 💎\n\n◈ Status  ◈ 🟢 Online\n◈ Version ◈ v1.0.0\n◈ Prefix  ◈ ${config.prefix}\n◈ Time    ◈ ${time}`
      }, { quoted: msg });
      break;

    case "botinfo":
      await sock.sendMessage(from, {
        text: `💎 SAGE BOT INFO 💎\n\n◈ Name    ◈ ${config.botName}\n◈ Version ◈ ${config.version}\n◈ Prefix  ◈ ${config.prefix}\n◈ Owner   ◈ ${config.ownerName}\n◈ Status  ◈ 🟢 Online`
      }, { quoted: msg });
      break;

    case "hello":
      await sock.sendMessage(from, {
        text: `👋 Hello ${pushName}!\n⚡ Welcome To SAGE BOT!\n💎 Type .menu to see commands!`
      }, { quoted: msg });
      break;

    case "time":
      await sock.sendMessage(from, {
        text: `⏰ Time: ${time}\n📅 Date: ${date}`
      }, { quoted: msg });
      break;
  }
};
