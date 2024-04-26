const { MessageEmbed } = require('discord.js');
const os = require('os');
const osUtils = require('os-utils');
const verjson = require(`../../ver.json`);

module.exports = {
    name: 'ping',
    description: '顯示目前的延遲以及其他機器人資訊',
    execute(message) {
        const timeSent = Date.now();
        message.reply('Pinging...').then(sentMessage => {
            const timeTaken = Date.now() - timeSent;
            const uptime = process.uptime(); // 機器人的運行時間，以秒為單位
            const owner = `FuLin`;
            const cpuName = os.cpus()[0].model; // 獲取第一個 CPU 的名稱

            // 格式化運行時間為天、時、分
            const days = Math.floor(uptime / (24 * 60 * 60));
            const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptime % (60 * 60)) / 60);

            // 使用 os-utils 獲取 CPU 佔用率
            osUtils.cpuUsage(function(cpuPercent) {
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('機器人狀態')
                    .addFields(
                        { name: '延遲', value: `${timeTaken}ms`, inline: true },
                        { name: '運行時間', value: `${days}天 ${hours}時 ${minutes}分`, inline: true },
                        { name: 'CPU名稱', value: cpuName, inline: true },
                        { name: 'CPU佔用率', value: `${(cpuPercent * 100).toFixed(2)}%`, inline: true },
                        { name: '擁有者', value: owner, inline: true },
                        { name: '版本', value: `v${verjson.version}`, inline: true }
                        // 其他欄位...
                    );
                // 更新回應的內容
                sentMessage.edit({ content: ' ', embeds: [embed] });
            });
        });
    }
};
