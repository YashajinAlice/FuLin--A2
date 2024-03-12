module.exports = {
    name: "ready",
    run: async (bot) => {
        console.log("Logged in as " + bot.client.user.tag);
        
        // 設置機器人的活動狀態
        bot.client.user.setActivity("fu. | 憂傷酒館", { type: "PLAYING" });

        // 獲取指定的頻道
        const channelId = '1216741774073004053'; // 請將 '你的頻道ID' 替換為你的頻道 ID
        const channel = bot.client.channels.cache.get(channelId);

        // 在指定的頻道中發送一條消息
        if (channel) {
            channel.send(' :warning: 我自動更新啦！順便重啟了。啊對了！因為芙檁在開發機器人中，所以會有很多這個消息喲！');
        } else {
            console.error(`找不到 ID 為 ${channelId} 的頻道`);
        }
    }
};
