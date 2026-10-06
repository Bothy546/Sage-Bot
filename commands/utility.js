const axios = require("axios");

module.exports = async (command, { sock, msg, from, args }) => {
  switch (command) {
    case "calc":
      try {
        const result = eval(args.join(" "));
        await sock.sendMessage(from, {
          text: `🧮 Result: ${result}`
        }, { quoted: msg });
      } catch {
        await sock.sendMessage(from, { text: "❌ Invalid Math!" }, { quoted: msg });
      }
      break;

    case "define":
      const word = args[0];
      if (!word) return sock.sendMessage(from, { text: "❌ Enter A Word!" }, { quoted: msg });
      const def = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const meaning = def.data[0]?.meanings[0]?.definitions[0]?.definition;
      await sock.sendMessage(from, {
        text: `📖 *${word}*\n\n${meaning}`
      }, { quoted: msg });
      break;
  }
};
