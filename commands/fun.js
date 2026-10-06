const axios = require("axios");

module.exports = async (command, { sock, msg, from }) => {
  switch (command) {
    case "joke":
      const joke = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      await sock.sendMessage(from, { text: `😂 ${joke.data.joke}` }, { quoted: msg });
      break;

    case "quote":
      const quote = await axios.get("https://api.quotable.io/random");
      await sock.sendMessage(from, {
        text: `💬 "${quote.data.content}"\n\n— ${quote.data.author}`
      }, { quoted: msg });
      break;

    case "roll":
      const roll = Math.floor(Math.random() * 6) + 1;
      await sock.sendMessage(from, { text: `🎲 You Rolled: ${roll}` }, { quoted: msg });
      break;

    case "flip":
      const flip = Math.random() > 0.5 ? "Heads 👑" : "Tails 🪙";
      await sock.sendMessage(from, { text: `🪙 Coin Flip: ${flip}` }, { quoted: msg });
      break;

    case "truth":
      const truths = [
        "What is your biggest fear?",
        "What is your most embarrassing moment?",
        "Who do you have a crush on?",
        "What is your biggest secret?",
        "What is your biggest regret?",
      ];
      await sock.sendMessage(from, {
        text: `💭 Truth: ${truths[Math.floor(Math.random() * truths.length)]}`
      }, { quoted: msg });
      break;

    case "dare":
      const dares = [
        "Send a funny selfie!",
        "Text your crush right now!",
        "Sing a song in voice note!",
        "Do 10 pushups right now!",
        "Change your status for 1 hour!",
      ];
      await sock.sendMessage(from, {
        text: `🎯 Dare: ${dares[Math.floor(Math.random() * dares.length)]}`
      }, { quoted: msg });
      break;

    case "slot":
      const emojis = ["🍎","🍊","🍋","🍇","💎","⭐"];
      const s1 = emojis[Math.floor(Math.random() * emojis.length)];
      const s2 = emojis[Math.floor(Math.random() * emojis.length)];
      const s3 = emojis[Math.floor(Math.random() * emojis.length)];
      const win = s1 === s2 && s2 === s3;
      await sock.sendMessage(from, {
        text: `🎰 [ ${s1} | ${s2} | ${s3} ]\n${win ? "🎉 YOU WIN!" : "❌ Try Again!"}`
      }, { quoted: msg });
      break;
  }

};
