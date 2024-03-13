//導入discord.js
const Discord = require("discord.js")
require("dotenv").config()
//圖像設置
const generateImage = require("./generateImage")
//--------------------------------------------------------------
//此區域禁止修改，全歸芙檁所有.
//作者 : 芙檁
//版本 : 1.1.1（1 大版本、0 中度版本 、 7 小型更新（如修復或新增小功能等））
//更新 : 20240312
//--------------------------------------------------------------

//額外製作功能
// 在 index.js 中引入 sqlite3 和簽到命令模組
const sqlite3 = require('sqlite3').verbose();
const signInCommand = require('./commands/fun/sign-in');
//fun
const calculator = require('./commands/fun/calculator');
const fortune = require('./commands/fun/fortune');
//info
const ping = require('./commands/info/ping');
//chat
const fs = require('fs');
const responses = JSON.parse(fs.readFileSync('./responses.json', 'utf8'));
//help
const help = require('./commands/info/help');
//play
const play = require('./commands/fun/play');
//birthday
const birthday = require('./commands/fun/birthday');
//money
const money = require('./commands/fun/money.js');

//權限--------------------------------------------------------------
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})
//以bot物件設置前綴以及擁有者ID
let bot = {
    client, 
    prefix: "fu.",
    owners: ["697783143347781682"]
}
//new重置
client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashcommands = new Discord.Collection()
client.buttons = new Discord.Collection()
//引導檔案位置
client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadButtons = (bot, reload) => require("./handlers/buttons")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)
client.loadButtons(bot, false)


module.exports = bot

// client.on("ready", () => {
//     console.log(`Logged in as ${client.user.tag}`)
// })

// client.on("messageCreate", (message) => {
//     if (message.content == "hi"){
//         message.reply("Hello World!")
//     }
// })

// const welcomeChannelId = "926530810008453120"

// client.on("guildMemberAdd", async (member) => {
//     const img = await generateImage(member)
//     member.guild.channels.cache.get(welcomeChannelId).send({
//         content: `<@${member.id}> Welcome to the server!`,
//         files: [img]
//     })
// })

//處理前綴指令專區--------------------------------------------------------------

// 創建或連接到數據庫
const db = new sqlite3.Database('./path/fulin/Nee6.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the Nee6 database.');
    }
});


db.serialize(() => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS economy (
            ID INTEGER PRIMARY KEY,
            userId VARCHAR(100), -- 添加 userId 欄位
            points INTEGER
        );
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('資料表已成功建立！');
    });
});

// 初始化數據庫表
db.run('CREATE TABLE IF NOT EXISTS sign_ins (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, date TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

//機器人啟動文件中加載 sign-in.js 命令
const sign_in = require('./commands/fun/sign-in.js');
client.commands.set(sign_in.name, sign_in);

//歡迎頻道設置
const welcomeChannelId = "906520813707075637"
client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `歡迎 <@${member.id}> 加入本酒館🎉`,
        files: [img]
    })
})

//成員退出後的通知頻道設置
client.on('guildMemberRemove', async member => {
    // 取得頻道
    const channel = member.guild.channels.cache.get('1030833960151953509');
    if (!channel) return;

    // 獲取成員數量
    let memberCount = member.guild.memberCount;

    // 發送消息到頻道
    channel.send(`<@${member.id}> 離開了酒館，目前還有 ${memberCount} 個客官！`);
});

//成員進入後的通知頻道設置
client.on('guildMemberAdd', async member => {
    // 取得頻道
    const channel = member.guild.channels.cache.get('1030833960151953509');
    if (!channel) return;

    // 獲取成員數量
    let memberCount = member.guild.memberCount;

    // 發送消息到頻道
    channel.send(`<@${member.id}> 加入了酒館，現在有 ${memberCount} 個客官！`);
});

//計算機
client.on('messageCreate', message => {
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '計算') {
        const num1 = parseFloat(args[0]);
        const operator = args[1];
        const num2 = parseFloat(args[2]);
        const result = calculator.execute(num1, operator, num2);
        message.reply(result);
    }
});



//查看延遲
client.on('messageCreate', message => {
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        ping.execute(message);
    } else if (command === 'fortune') {  // 如果命令是 'fortune'
        fortune.execute(message);  // 執行抽籤命令
    }
});
//抽籤
client.on('messageCreate', message => {
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '抽籤') {
        fortune.execute(message);
    } else if (command === '抽籤') {  // 如果命令是 'fortune'
        fortune.execute(message);  // 執行抽籤命令
    }
});

//chat
const targetChannelIds = ['1191950389797470329', '1215230003600560179'];

client.on('messageCreate', message => {
    // 如果訊息是由機器人發送的，或者不是在目標頻道中發送的，則忽略
    if (message.author.bot || !targetChannelIds.includes(message.channel.id)) return;

    // 檢查訊息是否包含貼圖
    if (message.attachments.size > 0) {
        message.reply('你覺得我看得懂貼圖嗎，你個笨笨？');
        return;
    }
    // 檢查訊息是否只包含數字
    if (/^\d+$/.test(message.content)) {
        message.reply('你覺得我看得懂數字嗎？');
        return;
    }    
    // 檢查訊息是否包含表情符號
    if (message.content.match(/[\u{1F600}-\u{1F64F}]/u)) {
        message.reply('你覺得我看得懂表情符號嗎？');
        return;
    }
    // 檢查訊息中是否包含關鍵字
    for (const keyword in responses) {
        if (message.content.includes(keyword)) {
            message.reply(responses[keyword]);
            return;
        }
    }

    message.reply('我聽不懂你在說什麼，誒嘿☆');
});

//help.js
// main.js


client.on('messageCreate', message => {
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        help.execute(message);
    }
    // 其他的命令...
});

//play


client.on('messageCreate' , message => {
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        play.execute(message);
    }

});

// 監聽消息創建事件
client.on('messageCreate', message => {
    // 確保消息不是由機器人發送的，並且以設定的前綴開頭
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 如果命令是 '簽到'
    if (command === '簽到') {
        signInCommand.execute(message, args, db);
    }
    // 如果命令是 '經濟'
    if (command === '經濟') {
        money.execute(message, args);
    }
});

client.on('messageCreate', message => {
    // 檢查消息是否以 "fu.新人" 開頭
    if (message.content.startsWith('fu.新人')) {
        // 獲取提及的用戶
        const member = message.mentions.members.first();
        // 獲取當前伺服器的名稱
        const serverName = message.guild.name;
        // 如果有提及的用戶，回復歡迎信息
        if (member) {
            message.channel.send(` ${member.displayName} 歡迎光臨 - ${serverName}！`);
            message.channel.send(` 1.有任何疑問可請至 https://discord.com/channels/906520813707075634/908334271691886603 查詢`);
            message.channel.send(` 2.來這自我介紹唷 https://discord.com/channels/906520813707075634/908336680333877268 ！`);
            message.channel.send(` 3.可以透過** fu.簽到 **來進行打卡唷！(功能屬於BATA測試中)`);
            message.channel.send(` 4.機器人相關問題可詢問開發者<@697783143347781682>`);
        } else {
            // 如果沒有提及的用戶，提示用戶提及一個新成員
            message.channel.send('請提及一個新成員來歡迎他們！');
        }
    }
});

// 監聽消息創建事件
client.on('messageCreate', message => {
    // 確保消息不是由機器人發送的，並且以設定的前綴開頭
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 如果命令是 '生日'
    if (command === '生日') {
        birthday.execute(message, args);
    }

    // 其他命令...
});

client.login(process.env.TOKEN)