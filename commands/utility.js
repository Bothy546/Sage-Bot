const axios = require("axios");

module.exports = async (command, { sock, msg, from, args }) => {
  switch (command) {
    case "calc": {
      const expr = args.join(" ");
      if (!expr || !/^[0-9+\-*/().%\s]+$/.test(expr)) {
        return sock.sendMessage(from, { text: "❌ Invalid Math!" }, { quoted: msg });
      }
      try {
        const result = Function(`"use strict"; return (${expr})`)();
        if (typeof result !== "number" || !isFinite(result)) throw new Error();
        await sock.sendMessage(from, { text: `🧮 Result: ${result}` }, { quoted: msg });
      } catch {
        await sock.sendMessage(from, { text: "❌ Invalid Math!" }, { quoted: msg });
      }
      break;
    }

    case "define": {
      const word = args[0];
      if (!word) return sock.sendMessage(from, { text: "❌ Enter A Word!" }, { quoted: msg });
      try {
        const def = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );
        const meaning = def.data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        if (!meaning) throw new Error();
        await sock.sendMessage(from, { text: `📖 *${word}*\n\n${meaning}` }, { quoted: msg });
      } catch {
        await sock.sendMessage(from, { text: "❌ Word Not Found!" }, { quoted: msg });
      }
      break;
    }
  }

};
