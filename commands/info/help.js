const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'help',
    description: '顯示所有的指令列表',
    execute(message) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('顯示所有的指令列表')
            .setDescription('請在每個指令名稱的前面加上［fu.］')
            .addFields(
                { name: '===============娛樂===============', value: '\u200B' },
                { name: '抽籤', value: '參考于神社裡面的 大吉、中吉、大凶、小凶等', inline: true },
                { name: '計算', value: 'discord上面的計算機 我用最強大腦幫你計算題目~ 但能力有限 還請給我簡單的+-*/，記得要空格才放符號~', inline: true },
                { name: '簽到 / 簽到 今日名單', value: '打卡就有點數喲，每日只能打卡一次，今日名單則是查看打卡了多少人', inline: true },
                { name: '比大小', value: '請隨機在指令後面加一個1-20之間的數字，機器人不會狡猾看你答案喲！一切只看命運', inline: true },
                { name: '自動回復', value: '有什麼問題 <@&1199316883535577100> 即可，雅蘭娜有些問題會回答不上來喲', inline: true },
                { name: '經濟系統', value: '給予點數，查閱點數，移除點數等功能，可从每日打卡中獲得', inline: true },
                { name: '===============管理===============', value: '\u200B' },
                { name: '監聽成員出入', value: '你是否消失又是否存在我們都看得到喲◝ᴗ◜', inline: true },
                { name: '監聽禁用關鍵字及伺服器鏈接', value: '會觸犯到酒館規則的字眼 基本上都會禁用，請謹言慎行\n不要發伺服器鏈接 算是在群內宣傳，要的話請移步私信', inline: true }
            )
            .setTimestamp()
            .setFooter('by FuLin | Ver 1.3.1');

        message.channel.send({ embeds: [embed] });
    }
};

