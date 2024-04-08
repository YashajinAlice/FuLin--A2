const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./path/fulin/Nee6.db');

// 比大小遊戲的指令
module.exports = {
    name: '比大小',
    description: '與機器人比大小，每次玩耍需要支付 30 點數，贏了送 50 點數，平手退回 10 點數',
    execute(message, args) {
        const userId = message.author.id;
        const betAmount = 30; // 每次遊戲的費用
        const winPoints = 50; // 贏了獎勵的點數
        const tieRefund = 10; // 平手退回的點數

        // 從數據庫中獲取用戶的點數
        db.get('SELECT points FROM economy WHERE userId = ?', [userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return message.reply('處理事件出問題拉，請通知開發者來處理');
            }
            if (!row || row.points < betAmount) {
                return message.reply('你的點數不足以支付這筆金額。');
            }

            // 從用戶的點數中扣除遊戲費用
            const newPoints = row.points - betAmount;

            // 更新用戶的點數
            db.run('UPDATE economy SET points = ? WHERE userId = ?', [newPoints, userId], (err) => {
                if (err) {
                    console.error(err.message);
                    return message.reply('處理事件出問題拉，請通知開發者來處理');
                }

                // 用戶選擇
                const userGuess = parseInt(args[0]);
                if (isNaN(userGuess) || userGuess < 1 || userGuess > 20) {
                    return message.reply('請輸入 1 到 20 之間的數字。');
                }
                message.reply(`您猜得是 ${userGuess}。`);

                // 機器人的對話
                setTimeout(() => message.reply('你想跟我比大小??'), 2000);
                setTimeout(() => message.reply('但會需要支付20點點數唷!'),3000);
                setTimeout(() => message.reply('雖然我只是女僕，但我可不是簡單的對手唷!'), 4000);
                setTimeout(() => message.reply('我想想...'), 6000);

                // 電腦思考中
                setTimeout(() => {
                    const botNumber = Math.floor(Math.random() * 20) + 1; // 隨機生成 1 到 20 的數字
                    setTimeout(() => message.reply(`我猜 ${botNumber}`), 8000);

                    // 判斷勝負
                    setTimeout(() => {
                        if (userGuess > botNumber) {
                            // 用戶贏了，獎勵點數
                            const updatedPoints = newPoints + winPoints;
                            db.run('UPDATE economy SET points = ? WHERE userId = ?', [updatedPoints, userId], (err) => {
                                if (err) {
                                    console.error(err.message);
                                    return message.reply('處理事件出問題拉，請通知開發者來處理');
                                }
                                message.reply(`甚麼你竟然猜 ${userGuess}，是人家輸了，送你50點作為獎金QAQ`);
                            });
                        } else if (userGuess < botNumber) {
                            // 用戶輸了
                            message.reply(`甚麼你竟然猜 ${userGuess}，人家贏了uwu，點數給我喽~~好耶`);
                        } else {
                            // 平手，退回點數
                            const updatedPoints = newPoints + tieRefund;
                            db.run('UPDATE economy SET points = ? WHERE userId = ?', [updatedPoints, userId], (err) => {
                                if (err) {
                                    console.error(err.message);
                                    return message.reply('處理事件出問題拉，請通知開發者來處理');
                                }
                                message.reply(`平手！退回了 ${tieRefund} 點數。`);
                            });
                        }
                    }, 10000);
                }, 8000); // 電腦思考的時間
            });
        });
    },
};
