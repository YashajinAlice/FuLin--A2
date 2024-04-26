//導入discord.js
const Discord = require("discord.js")
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

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
//money
const blackjack = require('./commands/game/blackjack');
//機率
const math = require('./commands/fun/math.js');
//yesno
const yesno = require('./commands/fun/yesno.js');
//choice
const cho = require('./commands/fun/choice.js');
//kiss
const kiss = require('./commands/fun/kiss.js');
//slap
const slap = require('./commands/fun/slap.js');
//ban
const ban = require('./commands/mod/ban.js');
//unban
const unban = require('./commands/mod/unban.js');
//mute
const mute = require('./commands/mod/mute.js');
//unmute
const unmute = require('./commands/mod/unmute.js');
//warn
const warn = require('./commands/mod/warn.js');
//DelWarning
const DelWarning = require('./commands/mod/DelWarning.js');


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
});

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

client.on('messageCreate', message => {
    // 檢查消息是否以機器人的前綴開頭，並且不是機器人發送的
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    // 現在我們知道消息是以正確的前綴開頭的，我們可以提取命令和參數
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.content.startsWith('fu.計算')) {
        const args = message.content.slice('fu.計算'.length).trim().split(/ +/);
        // 確保將 message 對象作為第二個參數傳遞給 execute 函數
        calculator.execute(args, message);
    }
});





//查看延遲
client.on('messageCreate', message => {
    // 檢查消息是否以機器人的前綴開頭，並且不是機器人發送的
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    // 現在我們知道消息是以正確的前綴開頭的，我們可以提取命令和參數
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 根據命令名稱執行相應的操作
    if (command === 'ping') {
        ping.execute(message);
    } else if (command === 'fortune') {  // 如果命令是 'fortune'
        fortune.execute(message);  // 執行抽籤命令
    }
    // ... 添加更多命令的處理
});

//抽籤
client.on('messageCreate', message => {
    // 檢查消息是否以機器人的前綴開頭，並且不是機器人發送的
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    // 現在我們知道消息是以正確的前綴開頭的，我們可以提取命令和參數
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '抽籤') {
        fortune.execute(message);
    } else if (command === '抽籤') {  // 如果命令是 'fortune'
        fortune.execute(message);  // 執行抽籤命令
    }
});
/*
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

    message.reply('人家聽不懂你在說什麼耶，誒嘿☆', '我聽不懂你在說什麼，不如你再說一次看看？', '嗯.....我不懂，妳說清楚點');
});
*/

//chat
const targetChannelIds = ['1191950389797470329'];

// 定義回覆
const replies = ['人家聽不懂你在說什麼耶，誒嘿☆', '我聽不懂你在說什麼，不如你再說一次看看？', '嗯.....我不懂，妳說清楚點'];

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

    // 選擇一個隨機的回覆
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    message.reply(randomReply);
});



// main.js

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
    // 檢查消息是否以機器人的前綴開頭，並且不是機器人發送的
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    // 現在我們知道消息是以正確的前綴開頭的，我們可以提取命令和參數
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    // 根據命令名稱執行相應的操作
    switch (command) {
        case '簽到':
            signInCommand.execute(message, args, db);
            break;
        case '比大小':
            ratioSize.execute(message, args);
            break;
        case '經濟':
            money.execute(message, args);
            break;
        case '新增商品':
            shopCommands.addProduct(message, args, db);
            break;
        case '刪除商品':
            shopCommands.deleteProduct(message, args, db);
            break;
        case '購買商品':
            shopCommands.purchaseProduct(message, args, db);
            break;
        // 可以根據需要添加更多商店相關的指令
        default:
            // 如果指令不匹配，可以回復一個錯誤消息或者忽略
            break;
        case '機率':
            math.execute(message, args);
            break;
        case '是否':
            yesno.execute(message, args);
            break;
        case '選擇':
            cho.execute(message, args);
            break;
        case 'kiss':
            kiss.execute(message, args);
            break;
        case 'slap':
            slap.execute(message, args);
            break;
        case 'help':
            help.execute(message, args);
            break;
        case 'ban':
            ban.execute(message, args);
            break;
        case 'unban':
            unban.execute(message, args);
            break;
        case 'mute':
            mute.execute(message, args);
            break;
        case 'unmute':
            unmute.execute(message, args);
            break;
        case 'warn':
            warn.execute(message, args);
            break;
        case 'delwarning':
            DelWarning.execute(message, args);
            break;
    }
});

const ratioSize = require("./commands/fun/ratio size.js");
const { request } = require("http");

client.on('messageCreate', message => {
    // 檢查消息是否以 "fu.新人" 開頭
    if (message.content.startsWith('fu.新人')) {
        // 獲取提及的用戶
        const member = message.mentions.members.first();
        // 獲取當前伺服器的名稱
        const serverName = message.guild.name;
        // 如果有提及的用戶，回復歡迎信息
        if (member) {
            const embed = new MessageEmbed()
                .setTitle(`歡迎 ${member.displayName} 歡迎光臨 - ${serverName}！`)
                .setDescription(`
                ˊ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  ˋ

                * 以下是入館手續的各頻道 請記得「詳閱規範、進行驗證、領取身份、填寫個資」
                 * ¹https://discord.com/channels/906520813707075634/909259324885467157 
 * ²https://discord.com/channels/906520813707075634/1122377351775404193
 * ³https://discord.com/channels/906520813707075634/986046493028909086
 * ⁴https://discord.com/channels/906520813707075634/908336680333877268

                
                ˋ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  ˊ
                |機器人諾有問題請詢問 <@697783143347781682>|
                |**Ver : ${currentVersion}** |
                `)
                .setColor('#0099ff')
                .setThumbnail(member.user.displayAvatarURL()); // 添加用戶頭像
            
            message.channel.send({ embeds: [embed] });
            member.send(`˗ˋˏ歡迎光臨 憂傷酒館ˎˊ˗
            我是專屬服務生雅琳娜！很高興認識你
            
            以下是幾個比較重要的頻道:
            𖠚 https://discord.com/channels/906520813707075634/908334271691886603 
            如果領取身份組有問題 可以開客服單找管理員！
            𖠚 https://discord.com/channels/906520813707075634/907973306689388655 
            可以找我們聊天！ 沒有你的存在是最憂傷的><
            
            𖠚 https://discord.com/channels/906520813707075634/909259324885467157
            你想永久性跟我們愉快玩耍的話 還務必遵守這個規則喔~
            
            如果看到我出現問題 麻煩找工程師芙芙ෆ
            
            還請遵守規矩！ 恭喜客官成為我們的一員~
            祝每天愉快0‿ฺ<`);
        } else {
            // 如果沒有提及的用戶，提示用戶提及一個新成員
            message.channel.send('請提及一個新成員來歡迎他們！');
        }
    }
});

client.on('messageCreate', message => {
    // 檢查消息是否以 "fu.開發團隊" 開頭
    if (message.content === 'fu.開發團隊') {
        const embed = new MessageEmbed()
            .setTitle('★開發團隊★')
            .setDescription('我們是一群創造『雅蘭娜』的開發團隊，專為本酒館提供更優質的用戶體驗。')
            .setColor('#0099ff')
            .addFields(
                { name: '◆團隊成員：', value: '芙檁 - 主開發工程師\n兩點 - 文字排版設計師\n螞蟻 - 測試專員' },
                { name: '◆聯絡方式：', value: ' Discord —芙檁' },
                { name: '◆反饋：' , value: '如您在使用過程中有任何疑問，或有優化相關的寶貴建議，歡迎與我們聯絡，我們將會盡快處理。' }
            )
            .setFooter( '感謝您對本開發團隊的支持，祝您使用愉快！');
        
        message.channel.send({ embeds: [embed] });
    }
});



// 監聽消息創建事件
client.on('messageCreate', message => {
    // 檢查消息是否以機器人的前綴開頭，並且不是機器人發送的
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    // 現在我們知道消息是以正確的前綴開頭的，我們可以提取命令和參數
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 如果命令是 '生日'
    if (command === '生日') {
        birthday.execute(message, args);
    }

});

//跨平台聊天


let channelA, channelB;

client.on('messageCreate', message => {
    // 如果消息來自機器人，則直接返回
    if (message.author.bot) return;

    // 綁定頻道 A
    if (message.content.startsWith('綁定頻道 A')) {
        channelA = message.channel;
        message.reply('已綁定此頻道作為頻道 A。');
        return;
    }

    // 綁定頻道 B
    if (message.content.startsWith('綁定頻道 B')) {
        channelB = message.channel;
        message.reply('已綁定此頻道作為頻道 B。');
        return;
    }

    // 解除綁定
    if (message.content.startsWith('解除綁定')) {
        if (channelA && message.channel.id === channelA.id) {
            channelA = null;
            message.reply('已解除綁定頻道 A。');
        } else if (channelB && message.channel.id === channelB.id) {
            channelB = null;
            message.reply('已解除綁定頻道 B。');
        } else {
            message.reply('此頻道未被綁定。');
        }
        return;
    }

    // 監聽頻道誰說話
    if (channelA && channelB) {
        let displayName = message.member.nickname ? message.member.nickname : message.author.username;
        let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor({ name: displayName, iconURL: message.author.displayAvatarURL() })
            .setDescription(message.content)
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

        if (message.channel.id === channelA.id) {
            channelB.send({ embeds: [embed] });
        } else if (message.channel.id === channelB.id) {
            channelA.send({ embeds: [embed] });
        }
    }
});

const codesFile = 'codes.json';

// 讀取兌換號碼
function loadCodes() {
    if (fs.existsSync(codesFile)) {
        let rawdata = fs.readFileSync(codesFile);
        return JSON.parse(rawdata);
    } else {
        return {};
    }
}

// 保存兌換號碼
function saveCodes(codes) {
    let data = JSON.stringify(codes, null, 2);
    fs.writeFileSync(codesFile, data);
}

// 初始化兌換號碼列表
let codes = loadCodes();

client.on('messageCreate', message => {
    // 檢查是否為兌換命令
    if (message.content.startsWith('fu.兌換')) {
        const args = message.content.split(' ').slice(1); // 分割命令和參數
        if (args.length === 0) {
            return message.reply('請提供兌換號碼。');
        }
        const codeToRedeem = args.join(' '); // 將參數合併為一個兌換號碼
        if (codes[codeToRedeem]) {
            if (!codes[codeToRedeem].used) {
                codes[codeToRedeem].used = true; // 標記為已使用
                saveCodes(codes); // 保存更新後的兌換號碼列表到文件
                message.reply(`兌換成功！您獲得了：${codes[codeToRedeem].reward}`);
            } else {
                return message.reply('此兌換號碼已被使用。');
            }
        } else {
            return message.reply('無效的兌換號碼。');
        }
    }

});

client.on('messageCreate', message => {
    // 檢測 Discord 邀請鏈接
    const inviteLinkPattern = /discord\.gg\/[a-zA-Z0-9]+/; // 正則表達式匹配 Discord 邀請鏈接

    // 檢查消息發送者是否為管理員或機器人
    if (inviteLinkPattern.test(message.content) && !message.member.permissions.has('ADMINISTRATOR') && !message.author.bot) {
        const memberName = message.author.tag; // 獲取發送者名稱
        const channelName = message.channel.name; // 獲取頻道名稱
        const timestamp = new Date(message.createdTimestamp); // 獲取消息創建時間戳
        const timeString = `${timestamp.getHours()}時${timestamp.getMinutes()}分`; // 格式化時間

        // 刪除消息
        message.delete().then(() => {
            // 發送警告到頻道
            message.channel.send(`哈嘍(•̀⌄•́)\n你已觸犯到發送伺服器連接的條規喔!\n請等待管理員的懲處\n祝安好`);
            // 通知日誌頻道
            const logChannel = client.channels.cache.get(logChannelID);
            logChannel?.send(`**注意** \n 用戶 **${memberName}** 于 **${timeString}** 在 **${channelName}**\n發送伺服器鏈接/禁詞\n請立即查看並根據情況進行懲處！。`);
        }).catch(error => {
            console.error('刪除消息時發生錯誤:', error);
        });
    }
    // ... 省略其他代碼 ...
});



const versionFile = 'ver.json';
const updateChannelAName = 'dev'; // 更新頻道A的名稱
const updateChannelBID = '1211296578250350653'; // 更新頻道B的 ID

// 讀取版本號
function loadVersion() {
    if (fs.existsSync(versionFile)) {
        let rawdata = fs.readFileSync(versionFile);
        return JSON.parse(rawdata).version;
    } else {
        return 'v1.0.0'; // 默認版本號
    }
}

// 保存版本號
function saveVersion(version) {
    let data = JSON.stringify({ version: version }, null, 2);
    fs.writeFileSync(versionFile, data);
}

// 比較版本號
function compareVersions(v1, v2) {
    const nums1 = v1.slice(1).split('.').map(Number);
    const nums2 = v2.slice(1).split('.').map(Number);

    for (let i = 0; i < Math.max(nums1.length, nums2.length); i++) {
        const num1 = nums1[i] || 0;
        const num2 = nums2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

// 初始化版本號
let currentVersion = loadVersion();

client.on('messageCreate', message => {
    // 檢查是否在更新頻道A中輸入了更新日記
    if (message.channel.name === updateChannelAName && message.content.startsWith('fu.ver')) {
        const args = message.content.split(' '); // 分割命令和參數
        if (args.length >= 2) {
            const newVersion = args[1];
            const comparisonResult = compareVersions(newVersion, currentVersion);
            const updateContent = message.content.slice(args[0].length + args[1].length + 2);
            const updateChannelB = client.channels.cache.get(updateChannelBID);
            let statusMessage;

            if (comparisonResult === 1) {
                // 新版本高於當前版本
                currentVersion = newVersion; // 更新版本號
                saveVersion(currentVersion); // 保存版本號到文件
                statusMessage = `已更新至 **${currentVersion}** 版本\n${updateContent}`;
            } else if (comparisonResult === -1) {
                // 新版本低於當前版本
                currentVersion = newVersion; // 更新版本號
                saveVersion(currentVersion); // 保存版本號到文件
                statusMessage = `已降級至 **${currentVersion}** 版本\n${updateContent}`;
            } else {
                // 版本號未變化
                statusMessage = `版本號未變化，仍為 **${currentVersion}**\n${updateContent}`;
            }

            // 將更新日記和版本狀態發送到更新頻道B
            updateChannelB.send(statusMessage).catch(error => {
                console.error('發送消息時發生錯誤:', error);
            });
        } else {
            message.reply('請提供正確的版本號和更新內容。');
        }
    }

    // ... 省略其他代碼 ...
});

bot.client.on('messageCreate', message => {
    if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'blackjack') {
        blackjack.execute(message, args, bot);
    }
    // 這裡可以添加更多命令...
});
const gameSessions = new Map();

// 在你的主檔案中
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // 獲取或創建這個頻道的遊戲會話狀態
    let gameSession = gameSessions.get(interaction.channelId);
    if (!gameSession) {
        gameSession = { players: new Set(), deck: [], playerHands: {}, dealerHand: [] };
        gameSessions.set(interaction.channelId, gameSession);
    }

    if (interaction.customId === 'join_game') {
        // 檢查玩家是否已經加入
        if (gameSession.players.has(interaction.user.id)) {
            await interaction.reply({ content: '你已經加入了遊戲。', ephemeral: true });
        } else {
            gameSession.players.add(interaction.user.id);
            await interaction.reply({ content: `${interaction.user.username} 加入了遊戲。`, ephemeral: false });
        }
    } else if (interaction.customId === 'start_game') {
        await interaction.deferReply(); // 延遲回復以進行後續處理
        // 確認是否有足夠的玩家加入遊戲
        if (gameSession.players.size < 2) {
            await interaction.editReply({ content: '至少需要2名玩家才能開始遊戲。' });
            return;
        }

        // 初始化遊戲狀態，比如發牌等
        const deck = createDeck();
        shuffleDeck(deck);
        gameSession.deck = deck;
        gameSession.dealerHand = [deck.pop(), deck.pop()];

        // 為每位玩家發兩張牌
        const playersArray = Array.from(gameSession.players);
        playersArray.forEach(playerId => {
            gameSession.playerHands[playerId] = [deck.pop(), deck.pop()];
            // 嘗試私密消息發送給玩家他們的牌
            const user = client.users.cache.get(playerId);
            if (user) {
                let handMessage = `你的起始牌是：${gameSession.playerHands[playerId][0].rank}${gameSession.playerHands[playerId][0].suit} 和 ${gameSession.playerHands[playerId][1].rank}${gameSession.playerHands[playerId][1].suit}`;
                user.send(handMessage).catch(error => {
                    console.error(`無法發送私信給用戶 ${playerId}:`, error);
                    // 可以在這裡添加更多的錯誤處理邏輯
                });
            }
        });

        // 通知所有玩家遊戲開始
        await interaction.editReply({ content: '遊戲開始！現在由系統隨機選擇先手玩家。' });

        // 隨機選擇一名玩家作為先手
        const firstPlayerId = playersArray[Math.floor(Math.random() * playersArray.length)];
        // 通知先手玩家
        await interaction.followUp({ content: `<@${firstPlayerId}> 是先手。請檢查你的私人訊息以查看你的牌。` });

        // 發送 'hit' 或 'stand' 的按鈕給先手玩家
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('hit')
                    .setLabel('Hit')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('stand')
                    .setLabel('Stand')
                    .setStyle('SECONDARY')
            );
        await interaction.followUp({ content: '請選擇你的動作：', components: [row] });
    }
});

// 玩家選擇 'hit' 或 'stand' 的邏輯
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const gameSession = gameSessions.get(interaction.channelId);

    if (interaction.customId === 'hit' || interaction.customId === 'stand') {
        const playerId = interaction.user.id;
        const playerHand = gameSession.playerHands[playerId];

        if (interaction.customId === 'hit') {
            // 玩家選擇 'hit'，從牌組中抽一張牌
            const card = gameSession.deck.pop();
            playerHand.push(card);
            const handValue = calculateHandValue(playerHand); // 計算手牌總值

            // 私密消息發送給玩家他們新抽的牌和目前的總分
            const user = client.users.cache.get(playerId);
            if (user) {
                let handMessage = `你抽到了一張牌：${card.rank}${card.suit}，目前總分為：${handValue}。`;
                user.send(handMessage).catch(console.error);
            }

            // 如果總分超過21點，玩家爆牌
            if (handValue > 21) {
                await interaction.reply({ content: `爆牌了！你的總分為：${handValue}，你的回合結束。`, ephemeral: true });
                endTurn(gameSession, playerId);
            } else {
                // 提供 'hit' 或 'stand' 的按鈕讓玩家選擇
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('hit')
                            .setLabel('再抽一張')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('stand')
                            .setLabel('停止抽牌')
                            .setStyle('SECONDARY')
                    );
                await interaction.update({ content: '請選擇你的動作：', components: [row], ephemeral: true });
            }
        } else if (interaction.customId === 'stand') {
            // 玩家選擇 'stand'，回合結束
            await interaction.reply({ content: '你選擇了 stand。你的回合結束。', ephemeral: true });
            endTurn(gameSession, playerId);
        }
    }
});


// 處理回合結束後的邏輯
function endTurn(gameSession, playerId) {
    // 標記玩家回合結束
    gameSession.turnsEnded.add(playerId);

    // 檢查是否所有玩家的回合都結束了
    if (gameSession.turnsEnded.size === gameSession.players.size) {
        // 雙方回合都結束，亮牌並宣布勝者
        revealCardsAndAnnounceWinner(gameSession);
    } else {
        // 通知對方玩家等待
        const otherPlayerId = Array.from(gameSession.players).find(id => id !== playerId);
        const otherUser = client.users.cache.get(otherPlayerId);
        if (otherUser) {
            otherUser.send('對方玩家已經結束回合，請準備你的回合。').catch(console.error);
        }
    }
}

// 亮牌並宣布勝者的函數
function revealCardsAndAnnounceWinner(gameSession) {
    let winnerId = null;
    let highestValue = 0;
    let isTie = false;

    // 計算每位玩家的手牌總值並找出勝者
    gameSession.players.forEach(playerId => {
        const handValue = calculateHandValue(gameSession.playerHands[playerId]);
        const user = client.users.cache.get(playerId);
        if (user) {
            user.send(`你的牌是 ${handToString(gameSession.playerHands[playerId])}，總值為 ${handValue}。`).catch(console.error);
        }
        if (handValue > highestValue && handValue <= 21) {
            highestValue = handValue;
            winnerId = playerId;
            isTie = false;
        } else if (handValue === highestValue) {
            isTie = true;
        }
    });

    // 通知所有玩家結果
    gameSession.players.forEach(playerId => {
        const user = client.users.cache.get(playerId);
        if (user) {
            if (isTie) {
                user.send('遊戲結果是平局！').catch(console.error);
            } else if (playerId === winnerId) {
                user.send('恭喜你贏得了遊戲！').catch(console.error);
            } else {
                user.send('很遺憾，你輸了遊戲。').catch(console.error);
            }
        }
    });
}

// 將手牌轉換為字符串的函數
function handToString(hand) {
    return hand.map(card => `${card.rank}${card.suit}`).join(' ');
}

// ...創建牌組和洗牌的函數...
function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            value += 10;
        } else if (card.rank === 'A') {
            aceCount++;
            value += 11;
        } else {
            value += parseInt(card.rank);
        }
    });

    // 將 A 的值從 11 調整為 1，直到手牌總值不超過 21 或沒有更多的 A
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
}
// 創建一副新牌並洗牌的函數
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}


client.login(process.env.TOKEN)