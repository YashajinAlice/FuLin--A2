// calculator.js
module.exports = {
    // ... 其他代碼保持不變

    execute(args, message) {
        // 確保使用 message 對象的 reply 方法
        try {
            const expression = args.join(' ');
            const result = this.parseExpression(expression);
            message.reply(`結果是 ${result}`);
        } catch (error) {
            message.reply(error.message);
        }
    },
    parseExpression(expression) {
        // 去除空格並檢查是否為方程組
        const cleanedExpression = expression.replace(/\s/g, '');
        if (cleanedExpression.includes(',')) {
            return this.solveSystem(cleanedExpression);
        }

        // 使用 eval 來計算表達式
        try {
            const result = eval(cleanedExpression);
            return result;
        } catch (error) {
            throw new Error('計算出錯，請檢查您的表達式');
        }
    },
    solveSystem(expression) {
        // 解析方程組
        const equations = expression.split(',');
        if (equations.length !== 2) {
            throw new Error('方程組格式不正確');
        }

        // 解析每個方程
        const coeffs = equations.map(eq => eq.match(/([-+]?[\d.]+)|([xy])/g));
        if (coeffs.some(eq => eq.length !== 3)) {
            throw new Error('方程格式不正確');
        }

        // 提取係數
        const [a, b, e] = coeffs[0].map(Number);
        const [c, d, f] = coeffs[1].map(Number);

        // 計算解
        const denominator = a * d - b * c;
        if (denominator === 0) {
            throw new Error('方程組無解或有無限多解');
        }
        const x = (e * d - b * f) / denominator;
        const y = (a * f - e * c) / denominator;
        return { x, y };
    },
};
