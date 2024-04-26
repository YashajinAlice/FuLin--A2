module.exports = {
    name: '機率',
    description: '計算給定內容的機率',
    execute(message, args) {
        // 確保提供了內容
        if (!args.length) {
            return message.reply('請提供一個內容。');
        }
        const content = args.join(' '); // 將參數合併為一個字符串
        const probability = Math.floor(Math.random() * 101); // 隨機生成 0 到 100 的數字

        // 創建回應消息
        message.reply(`你的 "${content}" 的機率為 ${probability}%。`);
    }
};
