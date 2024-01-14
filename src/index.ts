import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf("");
const gameOptionMatrix = [["Carta 📄"], ["Forbice ✂️"], ["Sasso 🪨"]];
const gameOptions = gameOptionMatrix.flat();
let userScore = 0;
let botScore = 0;
bot.start((ctx) => {
  ctx.reply(
    `Benvenuto al gioco di Morracinese! 🎲 Fai la tua mossa!`,
    Markup.keyboard(gameOptionMatrix).resize(),
  );
});

bot.hears(gameOptions, async (ctx) => {
  const userChoice = ctx.message.text;
  const botChoice = gameOptions[Math.floor(Math.random() * 3)];
  const result = determineWinner(userChoice, botChoice);
  if (result === "Hai vinto!") {
    userScore++;
  } else if (result === "Il bot vince!") {
    botScore++;
  }
  ctx.reply(`Hai scelto: ${userChoice}\nIl bot sceglie: ${botChoice}`);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  await delay(200);

  ctx.telegram.sendMessage(
    ctx.chat.id,
    `
    <b>Risultato</b>: ${result}\n
<b>Tabellone dei Punteggi</b>:\n 
<code>Tu: ${userScore}</code> 🏆  -   <code>Bot: ${botScore}</code> 🤖
    `,
    { parse_mode: "HTML" },
  );
});

export function determineWinner(userChoice: string, botChoice: string): string {
  if (userChoice === botChoice) {
    return "Pareggio!";
  }

  if (
    (userChoice === "Carta 📄" && botChoice === "Sasso 🪨") ||
    (userChoice === "Forbice ✂️" && botChoice === "Carta 📄") ||
    (userChoice === "Sasso 🪨" && botChoice === "Forbice ✂️")
  ) {
    return "Hai vinto!";
  }

  return "Il bot vince!";
}
bot.launch();
