// warningUtils.js
const fs = require('fs');
const WARN_FILE_PATH = './warn.json';

function readWarnings() {
    try {
        const data = fs.readFileSync(WARN_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('讀取警告文件時出錯:', error);
        return []; // 如果文件不存在或無法解析，返回一個空陣列
    }
}

function writeWarnings(warnings) {
    try {
        fs.writeFileSync(WARN_FILE_PATH, JSON.stringify(warnings, null, 4), 'utf8');
    } catch (error) {
        console.error('寫入警告文件時出錯:', error);
    }
}

module.exports = { readWarnings, writeWarnings };
