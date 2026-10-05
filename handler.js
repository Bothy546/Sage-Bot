const config = require("./config");
const general = require("./commands/general");
const fun = require("./commands/fun");
const group = require("./commands/group");
const owner = require("./commands/owner");
const protection = require("./commands/protection");
const utility = require("./commands/utility");

module.exports = async (sock, msg) => {
  try {
    const prefix = config.prefix;
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isOwner = sender.includes(config.ownerNumber.replace("@s.whatsapp.net", ""));
    const isGroup = from.endsWith("@g.us");
    const pushName = msg.pushName || "User";

    const body =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption || "";

    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    const ctx = {
      sock, msg, from, sender,
      isOwner, isGroup, pushName,
      args, body, config,
    };

    if (["menu","ping","alive","botinfo","hello","time"].includes(command)) {
      await general(command, ctx);
    } else if (["joke","quote","roll","flip","truth","dare","quiz","slot"].includes(command)) {
      await fun(command, ctx);

    } else if (["kick","add","promote","demote","tagall","groupinfo","mute","unmute"].includes(command)) 
