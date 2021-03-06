const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
require("dotenv").config();

exports.linebot = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.CHANNEL_SECRET,
    });

    for (const event of req.body.events) {
      console.log(event);
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
      message = await getLessonHistory("hoge");
      break;
    case "＞レッスン予約確認":
      message = { type: "text", text: "レッスン予約確認です！" };
      break;
    case "テスト":
      message = { type: "text", text: event.source.userId };
      break;
    default:
      message = { type: "text", text: `${event.message.text}を受け取ったよ！` };
      break;
  }
  return message;
}

//リッチメニューを切り替える関数
//req.body:{userId:'xxxxxxxxxx'}
exports.changeMenu = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.CHANNEL_SECRET,
    });

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

async function getLessonHistory(user) {
  return {
    type: "flex",
    altText: "レッスン履歴一覧",
    contents: {
      type: "bubble",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "予約済みレッスン一覧",
            align: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "lg",
        contents: [
          {
            type: "text",
            text: "3/12 14:00-15:50",
            align: "start",
            contents: [],
          },
          {
            type: "text",
            text: "3/15 14:00-15:50",
            contents: [],
          },
          {
            type: "text",
            text: "3/20 14:00-15:50",
            contents: [],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "詳細を確認",
              uri: "https://kinokodata.net",
            },
          },
        ],
      },
    },
  };
}

//pushメッセージを投げる関数
//req.body:{userId:'xxxxxxxxxx'}
exports.pushMessage = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.CHANNEL_SECRET,
    });

    const userId = req.body.userId;

    //pushメッセージを
    await client.pushMessage(userId, {
      type: "text",
      text: "レッスン15分前になりました。準備をお願いします。",
    });

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
