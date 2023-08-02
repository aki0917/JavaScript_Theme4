//----------定義-----------------

const url = "https://opentdb.com/api.php?amount=10";

let correctCount = 0;
let currentIndex = 0;

const startBtn = document.getElementById("start-button");
const genreElm = document.getElementById("genre");
const difficultyElm = document.getElementById("difficulty");
const genreDisplay = document.getElementById("genre-display");
const difficultyDisplay = document.getElementById("difficulty-display");


//----------関数-----------------

// クイズデータを取得する関数
const getQuizData = async () => {
  const res = await fetch(url);
  const quizData = await res.json();
  return quizData.results;
};

// 問題と選択肢を表示する関数
const displayQuestionAndChoices = (quizData, index) => {
  updateH1Title(index);
  updateQuestion(quizData[index].question);
  updateGenreAndDifficulty(quizData[index].category, quizData[index].difficulty);
  displayChoices(quizData[index], quizData);
}

// 問題タイトルを更新する関数
const updateH1Title = (index) => {
  const h1Title = document.getElementById('h1-title');
  h1Title.innerText = "問題" + (index + 1);
}

// 問題文を更新する関数
const updateQuestion = (question) => {
  document.getElementById('quiz-question').value = question;
}

// ジャンルと難易度を更新する関数
const updateGenreAndDifficulty = (genre, difficulty) => {
  genreElm.innerText = genre;
  difficultyElm.innerText = difficulty;
}

// 問題データを表示する関数
const displayQuizData = (quizData,index) => {
  if (index < quizData.length) {
    displayQuestionAndChoices(quizData, index);
  } else {
    showScore(quizData);
  }
};

// 全て回答後、選択肢と問題をクリアする関数
const clearQuestionAndChoices = () => {
  document.getElementById('quiz-question').value = '';
  const choicesContainer = document.getElementById('choices');
  while (choicesContainer.firstChild) {
    choicesContainer.removeChild(choicesContainer.firstChild);
  }
};

//ジャンルと難易度の表示をクリアする関数
const clearCategoryAndDifficulty = () => {
  genreDisplay.style.display = 'none';
  difficultyDisplay.style.display = 'none';
};

// スコアを表示する関数
const showScore = (quizData) => {
  clearQuestionAndChoices();
  clearCategoryAndDifficulty();

  // 開始ボタンを表示する
  startBtn.style.display = 'block';

  const h1Title = document.getElementById('h1-title');
  h1Title.innerText = "あなたの正答数は" + correctCount + "です";

  document.getElementById('quiz-question').placeholder = "再度チャレンジしたい場合は以下をクリック";
};

// 選択肢を空にする関数
const clearChoices = () => {
  const choicesContainer = document.getElementById('choices');
  while(choicesContainer.firstChild){
    choicesContainer.removeChild(choicesContainer.firstChild);
  };
};

// ボタンを作成し、選択肢として表示する関数
const createChoiceButton = (choice, quiz, quizData) => {
  const choicesContainer = document.getElementById('choices');
  const choiceButton = document.createElement('button');
  choiceButton.textContent = choice;
  choicesContainer.appendChild(choiceButton);

  // ボタンがクリックされたら次の問題を表示する
  choiceButton.addEventListener('click', () => {
    if (choice === quiz.correct_answer) {
      correctCount++;
    } 
    nextQuiz(quizData);
  });
};

// 選択肢を表示する関数
const displayChoices = (quiz, quizData) => {
  clearChoices();

  // 正解と不正解の選択肢を一つの配列にまとめる
  const choices = [...quiz.incorrect_answers, quiz.correct_answer];

  // 選択肢をシャッフル
  choices.sort(() => Math.random() - 0.5);

  // 選択肢を表示する
  choices.forEach((choice) => {
    createChoiceButton(choice, quiz, quizData);
  });
}

//次の問題を表示する関数
const nextQuiz = (quizData) => {
  currentIndex++;

  if (currentIndex < quizData.length) {
    displayQuizData(quizData, currentIndex);
  } else {
    showScore(quizData);
  };
};

//----------イベント-----------------

startBtn.addEventListener("click",async () => {
  document.getElementById("quiz-question").placeholder="少々お待ちください"
  document.getElementById("h1-title").innerHTML="取得中..."


  genreDisplay.style.display = 'none';
  difficultyDisplay.style.display = 'none';

  startBtn.style.display = 'none';

  const quizData = await getQuizData();

  correctCount = 0;
  currentIndex = 0;

  displayQuizData(quizData,0)

  genreDisplay.style.display = 'block';
  difficultyDisplay.style.display = 'block';

  document.getElementById('h1-title').innerText = '問題1';

  document.getElementById('quiz-question').placeholder = '以下のボタンをクリック';
});
