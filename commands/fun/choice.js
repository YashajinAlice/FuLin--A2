module.exports = {
    name: '選擇',
    description: '從給定的選項中隨機選擇一個',
    execute(message, args) {
        // 確保提供了選項
        if (!args.length) {
            return message.reply('請至少提供兩個選項。');
        }
        // 隨機選擇一個選項
        const choice = args[Math.floor(Math.random() * args.length)];

        // 創建回應消息
        message.reply(`隨機選擇的結果是: "${choice}"。`);
    }
};
