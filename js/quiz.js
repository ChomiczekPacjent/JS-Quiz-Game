const canvas = document.getElementById('quizCanvas');
const ctx = canvas.getContext('2d');

let userSettings = { numQuestions: 10, timePerQuestion: 15 };
let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 0;
let interval;
let selected = null;
let answered = false;
let started = false;

//loss
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Witaj w quizie o JavaScript!", 120, 100);

  ctx.fillStyle = "#00ccff";
  ctx.fillRect(300, 180, 200, 60);
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Rozpocznij quiz", 320, 220);

  ctx.fillStyle = "#aaaaaa";
  ctx.fillRect(300, 260, 200, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Informacje o quiz", 310, 290);

  ctx.fillStyle = "white";
  ctx.fillText("Liczba pytań:", 300, 350);
  drawOption(450, 330, 50, 30, "10", userSettings.numQuestions === 10);
  drawOption(510, 330, 50, 30, "20", userSettings.numQuestions === 20);
  drawOption(570, 330, 50, 30, "30", userSettings.numQuestions === 30);

  ctx.fillStyle = "white";
  ctx.fillText("Czas na pytanie:", 300, 420);
  drawOption(450, 400, 50, 30, "10s", userSettings.timePerQuestion === 10);
  drawOption(510, 400, 50, 30, "15s", userSettings.timePerQuestion === 15);
  drawOption(570, 400, 50, 30, "20s", userSettings.timePerQuestion === 20);
}

function drawOption(x, y, w, h, text, selected) {
  ctx.fillStyle = selected ? "#00ccff" : "#ccc";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(text, x + 10, y + 22);
}
// wysw
// pytanie

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawQuestion() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Pytanie ${currentQuestion + 1}/${questions.length}`, 20, 40);

 ctx.font = "28px Arial";
 wrapText(ctx, questions[currentQuestion].question, 20, 100, 700, 34);


  ctx.font = "22px Arial";
  questions[currentQuestion].answers.forEach((ans, i) => {
    let color = "#ccc";
    if (answered) {
      if (i === questions[currentQuestion].correct) color = "#6f6";//green
      else if (i === selected) color = "#f66";//red - zle
    }
    //pokazuje odp
    ctx.fillStyle = color;
    ctx.fillRect(50, 150 + i * 80, 700, 60);
    ctx.fillStyle = "black";
    ctx.fillText(ans, 70, 190 + i * 80);
  });

  ctx.fillStyle = "green";
  ctx.fillRect(50, 500, timeLeft * (700 / userSettings.timePerQuestion), 20);
  ctx.strokeStyle = "white";
  ctx.strokeRect(50, 500, 700, 20);

  if (answered) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(700, 540);
    ctx.lineTo(740, 560);
    ctx.lineTo(700, 580);
    ctx.closePath();
    ctx.fill();
  }
}

function nextQuestion() {
  currentQuestion++;
  selected = null;
  answered = false;
  if (currentQuestion >= questions.length) {
    clearInterval(interval);
    showScore();
  } else {
    timeLeft = userSettings.timePerQuestion;
    drawQuestion();
  }
}

function showScore() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(`Koniec quizu! Twój wynik: ${score}/${questions.length}`, 150, 300);

  ctx.fillStyle = "#00ccff";
  ctx.fillRect(300, 350, 200, 60);
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Zagraj ponownie", 320, 390);
}

//przyciski
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (!started) {
    if (x >= 300 && x <= 500 && y >= 180 && y <= 240) {
      startQuiz();
      return;
    }

    if (x >= 300 && x <= 500 && y >= 260 && y <= 310) {
      window.location.href = "quiz.html";
      return;
    }

   
    if (x >= 450 && x <= 500 && y >= 330 && y <= 360) {
      userSettings.numQuestions = 10;
      drawStartScreen();
      return;
    }
    if (x >= 510 && x <= 560 && y >= 330 && y <= 360) {
      userSettings.numQuestions = 20;
      drawStartScreen();
      return;
    }
    if (x >= 570 && x <= 620 && y >= 330 && y <= 360) {
      userSettings.numQuestions = 30;
      drawStartScreen();
      return;
    }

  
    if (x >= 450 && x <= 500 && y >= 400 && y <= 430) {
      userSettings.timePerQuestion = 10;
      drawStartScreen();
      return;
    }
    if (x >= 510 && x <= 560 && y >= 400 && y <= 430) {
      userSettings.timePerQuestion = 15;
      drawStartScreen();
      return;
    }
    if (x >= 570 && x <= 620 && y >= 400 && y <= 430) {
      userSettings.timePerQuestion = 20;
      drawStartScreen();
      return;
    }

    return;
  }

  if (currentQuestion >= questions.length) {
    if (x >= 300 && x <= 500 && y >= 350 && y <= 410) {
      restartQuiz();
    }
    return;
  }

  if (answered) {
    if (x >= 700 && x <= 740 && y >= 540 && y <= 580) {
      nextQuestion();
    }
    return;
  }

  questions[currentQuestion].answers.forEach((ans, i) => {
    const boxY = 150 + i * 80;
    if (x >= 50 && x <= 750 && y >= boxY && y <= boxY + 60) {
      selected = i;
      answered = true;
      if (i === questions[currentQuestion].correct) score++;
      drawQuestion();
    }
  });
});

function startQuiz() {
  started = true;
  questions = shuffleArray([...allQuestions])
    .slice(0, userSettings.numQuestions)
    .map(q => {
      const answers = [...q.answers];
      const correctText = answers[q.correct];
      const shuffledAnswers = shuffleArray(answers);
      const newCorrectIndex = shuffledAnswers.indexOf(correctText);
      return {
        question: q.question,
        answers: shuffledAnswers,
        correct: newCorrectIndex
      };
    });

  currentQuestion = 0;
  score = 0;
  selected = null;
  answered = false;
  timeLeft = userSettings.timePerQuestion;

  interval = setInterval(() => {
    if (!answered) {
      timeLeft--;
      if (timeLeft <= 0) {
        answered = true;
        drawQuestion();
      } else {
        drawQuestion();
      }
    }
  }, 1000);

  drawQuestion();
}


function restartQuiz() {
  clearInterval(interval);
  started = false;
  drawStartScreen();
}

drawStartScreen();
