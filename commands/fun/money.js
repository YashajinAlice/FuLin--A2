const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./path/fulin/Nee6.db');

module.exports = {
    name: '經濟',
    description: '查看金額，簽到獲得點數，管理員贈送或扣除點數',
    execute(message, args) {
        const userId = message.author.id;
        const isAdmin = message.member.permissions.has('ADMINISTRATOR');
        let targetUser;
        let points;

        switch (args[0]) {
            case '查詢金額':
                db.get('SELECT points FROM economy WHERE userId = ?', [userId], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return message.reply('查詢金額時出錯，請稍後再試。');
                    }
                    points = row ? row.points : 0;
                    return message.reply(`你目前有 ${points} 點數。`);
                });
                break;
            case '贈送點數':
                if (!isAdmin) {
                    return message.reply('只有管理員可以使用這個指令。');
                }
                targetUser = message.mentions.users.first();
                points = Number(args[2]);

                if (!targetUser) {
                    return message.reply('請提起一名用戶。');
                }
                if (!points) {
                    return message.reply('請提供點數金額。');
                }

                // 在這裡處理贈送點數的邏輯
                db.get('SELECT points FROM economy WHERE userId = ?', [targetUser.id], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return message.reply('查詢金額時出錯，請稍後再試。');
                    }
                    if (!row) {
                        db.run('INSERT INTO economy(userId, points) VALUES(?, ?)', [targetUser.id, points], function(err) {
                            if (err) {
                                console.error(err.message);
                                return message.reply('創建新用戶時出錯，請稍後再試。');
                            }
                            return message.reply(`已成功贈送 ${points} 點數給 ${targetUser.username}。`);
                        });
                    } else {
                        db.run('UPDATE economy SET points = points + ? WHERE userId = ?', [points, targetUser.id],
                            function(err) {
                                if (err) {
                                    console.error(err.message);
                                    return message.reply('贈送點數時出錯，請稍後再試。');
                                }
                                return message.reply(`已成功贈送 ${points} 點數給 ${targetUser.username}。`);
                            });
                    }
                });    
                break;
            case '扣除點數':
                if (!isAdmin) {
                    return message.reply('只有管理員可以使用這個指令。');
                }
                targetUser = message.mentions.users.first();
                points = Number(args[2]);

                if (!targetUser) {
                    return message.reply('請提起一名用戶。');
                }
                if (!points) {
                    return message.reply('請提供點數金額。');
                }

                // 在這裡處理扣除點數的邏輯
                db.get('SELECT points FROM economy WHERE userId = ?', [targetUser.id], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return message.reply('查詢金額時出錯，請稍後再試。');
                    }
                    if (!row || row.points < points) {
                        return message.reply('該用戶的點數不足。');
                    } else {
                        db.run('UPDATE economy SET points = points - ? WHERE userId = ?', [points, targetUser.id],
                            function(err) {
                                if (err) {
                                    console.error(err.message);
                                    return message.reply('扣除點數時出錯，請稍後再試。');
                                }
                                return message.reply(`已成功從 ${targetUser.username} 扣除 ${points} 點數。`);
                            });
                    }
                }); 
//工作   
            case 'work':
    db.get('SELECT points FROM economy WHERE userId = ?', [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            return message.reply('查詢工作狀態時出錯，請稍後再試。');
        }
        // 檢查用戶是否已經有點數記錄
        if (!row) {
            db.run('INSERT INTO economy(userId, points) VALUES(?, 0)', [userId], function(err) {
                if (err) {
                    console.error(err.message);
                    return message.reply('創建新用戶時出錯，請稍後再試。');
                }
                // 用戶記錄創建後再次執行工作指令
                message.reply('你的賬戶已創建，請再次嘗試 "work" 指令。');
            });
        } else {
            // 生成一個 0 到 1 的隨機數來決定工作是否成功
            if (Math.random() < 0.5) {
                // 工作失敗
                return message.reply('由於狀態不佳，工作無法完成。');
            } else {
                // 工作成功，生成隨機點數
                const earnedPoints = Math.floor(Math.random() * (150 - 10 + 1)) + 10;
                db.run('UPDATE economy SET points = points + ? WHERE userId = ?', [earnedPoints, userId],
                    function(err) {
                        if (err) {
                            console.error(err.message);
                            return message.reply('更新點數時出錯，請稍後再試。');
                        }
                        return message.reply(`你成功完成工作了！並得到了 ${earnedPoints} 點數。`);
                    });
            }
        }
    });
        break;
    
    

            default:
                return message.reply('無效的指令。請使用「fu.經濟 查詢金額」或其他有效指令。');
        }
    }
};
