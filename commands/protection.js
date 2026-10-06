const store = {};

module.exports = async (command, { sock, msg, from, args, isOwner }) => {
  if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });

  const setting = args[0]?.toLowerCase();

  switch (command) {
    case "antidelete":
      store.antidelete = setting === "on";
      await sock.sendMessage(from, {
        text: `🛡️ Anti-Delete: ${setting === "on" ? "✅ ON" : "❌ OFF"}`
      }, { quoted: msg });
      break;

    case "viewonce":
      store.viewonce = setting === "on";
      await sock.sendMessage(from, {
        text: `👁️ View Once: ${setting === "on" ? "✅ ON" : "❌ OFF"}`
      }, { quoted: msg });
      break;

    case "antilink":
      store.antilink = setting === "on";
      await sock.sendMessage(from, {
        text: `🚫 Anti-Link: ${setting === "on" ? "✅ ON" : "❌ OFF"}`
      }, { quoted: msg });
      break;

    case "antispam":
      store.antispam = setting === "on";
      await sock.sendMessage(from, {
        text: `🚫 Anti-Spam: ${setting === "on" ? "✅ ON" : "❌ OFF"}`
      }, { quoted: msg });
      break;
  }
};


module.exports.store = store;
