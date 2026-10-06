module.exports = async (command, { sock, msg, from, isOwner, isGroup }) => {
  if (!isGroup) return sock.sendMessage(from, { text: "❌ Group Only Command!" }, { quoted: msg });

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  switch (command) {
    case "kick":
      if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });
      if (!mentioned.length) return sock.sendMessage(from, { text: "❌ Mention Someone!" }, { quoted: msg });
      await sock.groupParticipantsUpdate(from, mentioned, "remove");
      await sock.sendMessage(from, { text: "✅ Member Kicked!" }, { quoted: msg });
      break;

    case "promote":
      if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });
      if (!mentioned.length) return sock.sendMessage(from, { text: "❌ Mention Someone!" }, { quoted: msg });
      await sock.groupParticipantsUpdate(from, mentioned, "promote");
      await sock.sendMessage(from, { text: "✅ Member Promoted!" }, { quoted: msg });
      break;

    case "demote":
      if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });
      if (!mentioned.length) return sock.sendMessage(from, { text: "❌ Mention Someone!" }, { quoted: msg });
      await sock.groupParticipantsUpdate(from, mentioned, "demote");
      await sock.sendMessage(from, { text: "✅ Admin Demoted!" }, { quoted: msg });
      break;

    case "mute":
      if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });
      await sock.groupSettingUpdate(from, "announcement");
      await sock.sendMessage(from, { text: "🔇 Group Muted!" }, { quoted: msg });
      break;

    case "unmute":
      if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner Only!" }, { quoted: msg });
      await sock.groupSettingUpdate(from, "not_announcement");
      await sock.sendMessage(from, { text: "🔊 Group Unmuted!" }, { quoted: msg });
      break;

    case "tagall":
      const groupData = await sock.groupMetadata(from);
      const members = groupData.participants.map(m => m.id);
      const tagText = members.map(m => `@${m.split("@")[0]}`).join(" ");
      await sock.sendMessage(from, {
        text: `📢 *Attention Everyone!*\n${tagText}`,
        mentions: members,
      }, { quoted: msg });
      break;

    case "groupinfo":
      const meta = await sock.groupMetadata(from);
      await sock.sendMessage(from, {
        text: `💎 GROUP INFO 💎\n\n◈ Name: ${meta.subject}\n◈ Members: ${meta.participants.length}\n◈ Created: ${new Date(meta.creation * 1000).toLocaleDateString()}`
      }, { quoted: msg });
      break;
  }

};
