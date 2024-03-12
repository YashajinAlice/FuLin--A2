// ping.js
module.exports = {
    name: 'ping',
    description: '顯示目前的延遲',
    execute(message) {
        // 發送一個回應並記錄時間
        const timeSent = Date.now();
        message.reply('Pinging...').then(message => {
            // 當回應被送出後，計算延遲
            const timeTaken = Date.now() - timeSent;
            // 更新回應的內容
            message.edit(`Ping: ${timeTaken}ms`);
        });
    }
};
