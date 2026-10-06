module.exports = async (command, { sock, msg, from, args, isOwner }) => {
  if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only Command!" }, { quoted: msg });

  switch (command) {
    case "broadcast":
      const broadMsg = args.join(" ");
      if (!broadMsg) return sock.sendMessage(from, { text: "❌ Enter Message!" }, { quoted: msg });
      const chats = await sock.groupFetchAllParticipating();
      for (const chat of Object.keys(chats)) {
        await sock.sendMessage(chat, { text: `📢 *SAGE BOT BROADCAST*\n\n${broadMsg}` });
      }
      await sock.sendMessage(from, { text: "✅ Broadcast Sent!" }, { quoted: msg });
      break;

    case "block":
      const blockJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!blockJid) return sock.sendMessage(from, { text: "❌ Mention Someone!" }, { quoted: msg });
      await sock.updateBlockStatus(blockJid, "block");
      await sock.sendMessage(from, { text: "✅ User Blocked!" }, { quoted: msg });
      break;

    case "unblock":
      const unblockJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!unblockJid) return sock.sendMessage(from, { text: "❌ Mention Someone!" }, { quoted: msg });
      await sock.updateBlockStatus(unblockJid, "unblock");
      await sock.sendMessage(from, { text: "✅ User Unblocked!" }, { quoted: msg });
      break;

    case "restart":
      await sock.sendMessage(from, { text: "🔄 Restarting SAGE BOT..." }, { quoted: msg });
      process.exit(0);
      break;
  }

};
