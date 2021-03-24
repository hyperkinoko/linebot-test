const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
require("dotenv").config();
const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

exports.linebot = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    for (const event of req.body.events) {
      let message;
      switch (event.type) {
        case "message":
          message = await messageFunc(event);
          break;
        case "follow":
          message = { type: "text", text: "友達登録ありがとう！" };
          break;
        default:
          message = {};
          break;
      }
      if (message !== {}) {
        await client.replyMessage(event.replyToken, message);
      }
    }
    res.json({});
  });

async function messageFunc(event) {
  let message;
  switch (event.message.type) {
    case "text":
      message = await textFunc(event);
      break;
    case "image":
      message = { type: "text", text: "画像をありがとう！" };
      break;
    case "sticker":
      message = { type: "text", text: "スランプをありがとう！" };
      break;
    default:
      message = { type: "text", text: "メッセージありがとう！" };
      break;
  }
  return message;
}

async function textFunc(event) {
  let message;
  switch (event.message.text) {
    case "＞レッスン履歴":
      message = { type: "text", text: "レッスン履歴です！" };
    case "＞レッスン予約確認":
      message = { type: "text", text: "レッスン予約確認です！" };
    default:
      message = { type: "text", text: `${event.message.text}を受け取ったよ！` };
      break;
  }
  return message;
}

//リッチメニューを切り替える関数
//req.body:{userId:'xxxxxxxxxx'}
exports.changeMenu = functions.https.onRequest(async (req, res) => {
  const userId = req.body.userId;
  //1or2
  const array = [1, 2];
  const randomId = array[Math.floor(Math.random() * array.length)];
  let menuId;
  switch (randomId) {
    case 1:
      menuId = "richmenu-2f36fcd44da48af5bd26276b0f79e43e";
      break;
    case 2:
      menuId = "richmenu-fc9f09ef5de0722388863b1f9147d067";
      break;
  }

  //メニューを変える
  await client.linkRichMenuToUser(userId, menuId);

  console.log(`-----------------------`);
  console.log(req.body);
  console.log(`-----------------------`);

  //CORS用にAccess-Control-Allow系ヘッダを追加
  //許可するサイトを指定
  res.set("Access-Control-Allow-Origin", "http://google.com");
  //DELETEだけは拒否
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
  //Content-Typeのみを許可
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.json("ok");
});