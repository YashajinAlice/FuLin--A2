// calculator.js
module.exports = {
    name: '計算',
    description: '簡單的計算機功能',
    execute(num1, operator, num2) {
        // 確保數字是有效的
        if (isNaN(num1) || isNaN(num2)) {
            return '請確保你輸入的是有效的數字';
        }

        // 執行計算
        let result;
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 != 0) {
                    result = num1 / num2;
                } else {
                    return '除數不能為零';
                }
                break;
            default:
                return '未知的運算符號';
        }

        // 回傳結果
        return `結果是 ${result}`;
    },
};
