export default async (message) => {
  const morningResponse = "GOOD MORNING!!!運勢占いにチャレンジして一日のスタートだ！https://discord.com/channels/1240921271110467615/1252867581342126100";

  // ステッカーの確認
  if (
    message.stickers.size > 0 &&
    message.stickers.first().id === "1248195235570384968"
  ) {
    await message.reply(morningResponse);
    return; // ステッカーに対応した後は他の処理を行わない
  }

  // 既存の文字列マッチング
    if (message.content.match(/今年もよろしく/)) {
    await message.reply("Happy new year!!");
  }
  
    if (message.content.match(/あけましておめでとう/)) {
    await message.reply("Happy new year!!");
  }
  if (message.content.match(/ねえねえ/)) {
    await message.reply("Hi!!");
  }
  if (message.content.match(/はじめまして/)) {
    await message.reply("Nice to meet you!!!");
  }
  if (message.content.match(/おはよう/)) {
    await message.reply(morningResponse);
  }
  if (message.content.match(/こんにちは/)) {
    await message.reply("Hello～!!!");
  }
  if (message.content.match(/おやすみ/)) {
    await message.reply("Good night～");
  }
  if (message.content.match(/おめでとう/)) {
    await message.reply("CONGRATULATION!!!!");
  }
  if (message.content.match(/さみし/)) {
    await message.reply("DON'T MIND !!!!");
  }
  if (message.content.match(/くるし/)) {
    await message.reply("May the Force be with you");
  }
  if (message.content.match(/苦し/)) {
    await message.reply("May the Force be with you");
  }
  if (message.content.match(/かなし/)) {
    await message.reply("OK!OK！Cheer up!!!");
  }
  if (message.content.match(/悲し/)) {
    await message.reply("OK!OK！Cheer up!!!");
  }
  if (message.content.match(/しまった/)) {
    await message.reply("GOOD LUCK!!!!");
  }
};
