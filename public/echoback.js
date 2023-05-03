var botui = new BotUI('echoback');

async function playAudio(text) {
  const id = 4;
  const response = await fetch("/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play();
}

async function main() {
  //botui.message.bot('フロントメッセージ');
  while (true) {
    var result = await botui.action.text({
      delay: 1000,
      action: {
        size: 30,
        placeholder: '入力してください'
      }
    });
    console.log(result.value);
    botui.message.bot(result.value);
    await playAudio(result.value);
  }
}

main();

/*
botui.message.add({
  content: 'Hello World from bot!'
});

botui.message.add({
  human: true,
  content: 'Hello World from human!'
});
*/
