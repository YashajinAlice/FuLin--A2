module.exports = {
    name: '神社抽籤',
    description: '抽籤功能',
    execute(message, args) {
        const fortunes = [
            '大吉',
            '中吉',
            '小吉',
            '吉',
            '末吉',
            '凶',
            '大凶'
        ];

        const index = Math.floor(Math.random() * fortunes.length);
        const fortune = fortunes[index];

        message.channel.send(`你抽到的籤是：${fortune}`);
    }
};
