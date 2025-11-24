// 游戏状态
const gameState = {
    player1: {
        score: 0,
        currentQuestion: {},
        progress: 0
    },
    player2: {
        score: 0,
        currentQuestion: {},
        progress: 0
    },
    currentRound: 1,
    totalRounds: 10,
    timeLeft: 60,
    timer: null,
    isActive: false,
    currentPlayer: 1,
    difficulty: 'easy'
};

// DOM元素
const elements = {
    timer: document.getElementById('timer'),
    round: document.getElementById('round'),
    player1Score: document.getElementById('player1-score'),
    player2Score: document.getElementById('player2-score'),
    player1Question: document.getElementById('player1-question'),
    player2Question: document.getElementById('player2-question'),
    player1Answer: document.getElementById('player1-answer'),
    player2Answer: document.getElementById('player2-answer'),
    player1Progress: document.getElementById('player1-progress'),
    player2Progress: document.getElementById('player2-progress'),
    difficulty: document.getElementById('difficulty'),
    resultModal: document.getElementById('result-modal'),
    winner: document.getElementById('winner'),
    player1FinalScore: document.getElementById('player1-final-score'),
    player2FinalScore: document.getElementById('player2-final-score')
};

// 初始化游戏
function init() {
    generateQuestions();
    updateUI();
    
    // 添加键盘事件监听
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (gameState.currentPlayer === 1) {
                checkAnswer(1);
            } else {
                checkAnswer(2);
            }
        }
    });
}

// 开始游戏
function startGame() {
    if (gameState.isActive) return;
    
    gameState.isActive = true;
    gameState.currentRound = 1;
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.player1.progress = 0;
    gameState.player2.progress = 0;
    gameState.timeLeft = 60;
    gameState.difficulty = elements.difficulty.value;
    
    updateUI();
    generateQuestions();
    startTimer();
    
    // 激活玩家1
    setActivePlayer(1);
}

// 重置游戏
function resetGame() {
    clearInterval(gameState.timer);
    gameState.isActive = false;
    gameState.currentRound = 1;
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.player1.progress = 0;
    gameState.player2.progress = 0;
    gameState.timeLeft = 60;
    
    updateUI();
    generateQuestions();
    
    // 清空输入框
    elements.player1Answer.value = '';
    elements.player2Answer.value = '';
    
    // 激活玩家1
    setActivePlayer(1);
}

// 开始计时器
function startTimer() {
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        elements.timer.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 生成题目
function generateQuestions() {
    gameState.player1.currentQuestion = generateQuestion();
    gameState.player2.currentQuestion = generateQuestion();
    
    elements.player1Question.textContent = `${gameState.player1.currentQuestion.a} ${gameState.player1.currentQuestion.operator} ${gameState.player1.currentQuestion.b} = ?`;
    elements.player2Question.textContent = `${gameState.player2.currentQuestion.a} ${gameState.player2.currentQuestion.operator} ${gameState.player2.currentQuestion.b} = ?`;
}

// 根据难度生成题目
function generateQuestion() {
    let a, b, operator, answer;
    const difficulty = gameState.difficulty;
    
    if (difficulty === 'easy') {
        // 简单：10以内加减法
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && a < b) [a, b] = [b, a]; // 确保结果为正数
        answer = operator === '+' ? a + b : a - b;
    } else if (difficulty === 'medium') {
        // 中等：加减乘法
        const rand = Math.random();
        if (rand < 0.4) {
            // 加法
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            operator = '+';
            answer = a + b;
        } else if (rand < 0.8) {
            // 减法
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            operator = '-';
            if (a < b) [a, b] = [b, a];
            answer = a - b;
        } else {
            // 乘法
            a = Math.floor(Math.random() * 9) + 1;
            b = Math.floor(Math.random() * 9) + 1;
            operator = '×';
            answer = a * b;
        }
    } else {
        // 困难：加减乘除法
        const rand = Math.random();
        if (rand < 0.3) {
            // 加法
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * 50) + 10;
            operator = '+';
            answer = a + b;
        } else if (rand < 0.6) {
            // 减法
            a = Math.floor(Math.random() * 50) + 30;
            b = Math.floor(Math.random() * 30) + 10;
            operator = '-';
            answer = a - b;
        } else if (rand < 0.8) {
            // 乘法
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            operator = '×';
            answer = a * b;
        } else {
            // 除法 (确保能整除)
            b = Math.floor(Math.random() * 10) + 1;
            a = b * (Math.floor(Math.random() * 10) + 1);
            operator = '÷';
            answer = a / b;
        }
    }
    
    return { a, b, operator, answer };
}

// 检查答案
function checkAnswer(player) {
    if (!gameState.isActive) return;
    
    const answerInput = player === 1 ? elements.player1Answer : elements.player2Answer;
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        alert('请输入有效的数字答案！');
        return;
    }
    
    const currentQuestion = player === 1 ? gameState.player1.currentQuestion : gameState.player2.currentQuestion;
    const isCorrect = userAnswer === currentQuestion.answer;
    
    if (isCorrect) {
        // 回答正确，增加分数
        if (player === 1) {
            gameState.player1.score += 10;
            gameState.player1.progress += 10;
        } else {
            gameState.player2.score += 10;
            gameState.player2.progress += 10;
        }
        
        // 生成新题目
        if (player === 1) {
            gameState.player1.currentQuestion = generateQuestion();
            elements.player1Question.textContent = `${gameState.player1.currentQuestion.a} ${gameState.player1.currentQuestion.operator} ${gameState.player1.currentQuestion.b} = ?`;
        } else {
            gameState.player2.currentQuestion = generateQuestion();
            elements.player2Question.textContent = `${gameState.player2.currentQuestion.a} ${gameState.player2.currentQuestion.operator} ${gameState.player2.currentQuestion.b} = ?`;
        }
        
        // 清空输入框
        answerInput.value = '';
        
        // 切换到下一个玩家
        setActivePlayer(player === 1 ? 2 : 1);
        
        // 更新回合
        gameState.currentRound++;
        if (gameState.currentRound > gameState.totalRounds) {
            endGame();
            return;
        }
        
        updateUI();
    } else {
        // 回答错误，提示
        alert('答案错误，请重新计算！');
        answerInput.value = '';
        answerInput.focus();
    }
}

// 设置当前活跃玩家
function setActivePlayer(player) {
    gameState.currentPlayer = player;
    
    // 更新UI高亮
    document.querySelector('.player-1').classList.toggle('active', player === 1);
    document.querySelector('.player-2').classList.toggle('active', player === 2);
    
    // 聚焦到当前玩家的输入框
    if (player === 1) {
        elements.player1Answer.focus();
    } else {
        elements.player2Answer.focus();
    }
}

// 更新UI
function updateUI() {
    elements.timer.textContent = gameState.timeLeft;
    elements.round.textContent = gameState.currentRound;
    elements.player1Score.textContent = gameState.player1.score;
    elements.player2Score.textContent = gameState.player2.score;
    
    // 更新进度条
    elements.player1Progress.style.width = `${gameState.player1.progress}%`;
    elements.player2Progress.style.width = `${gameState.player2.progress}%`;
}

// 结束游戏
function endGame() {
    clearInterval(gameState.timer);
    gameState.isActive = false;
    
    // 确定获胜者
    let winnerText;
    if (gameState.player1.score > gameState.player2.score) {
        winnerText = '玩家1 获胜!';
        elements.winner.className = 'winner player-1';
    } else if (gameState.player2.score > gameState.player1.score) {
        winnerText = '玩家2 获胜!';
        elements.winner.className = 'winner player-2';
    } else {
        winnerText = '平局!';
        elements.winner.className = 'winner';
    }
    
    elements.winner.textContent = winnerText;
    elements.player1FinalScore.textContent = gameState.player1.score;
    elements.player2FinalScore.textContent = gameState.player2.score;
    
    // 显示结果模态框
    elements.resultModal.style.display = 'flex';
}

// 关闭结果模态框
function closeResult() {
    elements.resultModal.style.display = 'none';
    resetGame();
}

// 启动游戏
window.onload = init;