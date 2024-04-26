module.exports = {
    name: '是否',
    description: '隨機回答是或不是',
    execute(message, args) {
        // 確保提供了內容
        if (!args.length) {
            return message.reply('請提供一個內容。');
        }
        const content = args.join(' '); // 將參數合併為一個字符串
        const answer = Math.random() < 0.5 ? '是' : '不是'; // 隨機選擇是或不是

        // 創建回應消息
        message.reply(`"${content}" 回答結果:${answer}。`);
    }
};
