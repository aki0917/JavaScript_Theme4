//----------定義-----------------

class Quiz {
  constructor(){
    this.url = "https://opentdb.com/api.php?amount=10";
    this.correctCount = 0;
    this.currentIndex = 0;
    this.startBtn = document.getElementById("start-button");
    this.genreElm = document.getElementById("genre");
    this.difficultyElm = document.getElementById("difficulty");
    this.genreDisplay = document.getElementById("genre-display");
    this.difficultyDisplay = document.getElementById("difficulty-display");
    this.quizQuestion = document.getElementById('quiz-question'); 
    this.h1Title = document.getElementById('h1-title');
    this.choicesContainer = document.getElementById('choices');
    this.clearQuestion = document.getElementById('quiz-question');
    
    this.addEventListener();
  }

  // クイズデータを取得するクラス
  async getQuizData() {
    const res = await fetch(this.url);
    const quizData = await res.json();
    return quizData.results;
  };

  // 問題と選択肢を表示するクラス
  displayQuestionAndChoices = (quizData, index) => {
    this.updateH1Title(index);
    this.updateQuestion(quizData[index].question);
    this.updateGenreAndDifficulty(quizData[index].category, quizData[index].difficulty);
    this.displayChoices(quizData[index], quizData);
  }

  // 問題タイトルを更新する関数
  updateH1Title = (index) => {
    this.h1Title.innerText = "問題" + (index + 1);
  }

  // 問題文を更新する関数
  updateQuestion = (question) => {
    document.getElementById('quiz-question').value = question;
  }

  // ジャンルと難易度を更新する関数
  updateGenreAndDifficulty = (genre, difficulty) => {
    this.genreElm.innerText = genre;
    this.difficultyElm.innerText = difficulty;
  }

  // 問題データを表示する関数
  displayQuizData = (quizData,index) => {
    if (index < quizData.length) {
      this.displayQuestionAndChoices(quizData, index);
    } else {
      this.showScore(quizData);
    }
  };

  clearQuestionAndChoices = () => {
    this.clearQuestion.value = '';
    while (this.choicesContainer.firstChild) {
      this.choicesContainer.removeChild(this.choicesContainer.firstChild);
    }
  };

  //ジャンルと難易度の表示をクリアする関数
  clearCategoryAndDifficulty = () => {
    this.genreDisplay.style.display = 'none';
    this.difficultyDisplay.style.display = 'none';
  };

  // スコアを表示する関数
  showScore = (quizData) => {
    this.clearQuestionAndChoices();
    this.clearCategoryAndDifficulty();

    // 開始ボタンを表示する
    this.startBtn.style.display = 'block';

    this.h1Title.innerText = "あなたの正答数は" + this.correctCount + "です";
    this.quizQuestion.placeholder = "再度チャレンジしたい場合は以下をクリック";
  };

  // 選択肢を空にする関数
  clearChoices = () => {
    while(this.choicesContainer.firstChild){
      this.choicesContainer.removeChild(this.choicesContainer.firstChild);
    };
  };

  // ボタンを作成し、選択肢として表示する関数
  createChoiceButton = (choice, quiz, quizData) => {
    const choiceButton = document.createElement('button');
    choiceButton.textContent = choice;
    this.choicesContainer.appendChild(choiceButton);

    // ボタンがクリックされたら次の問題を表示する
    choiceButton.addEventListener('click', () => {
      if (choice === quiz.correct_answer) {
        this.correctCount++;
      } 
      this.nextQuiz(quizData);
    });
  };

  //シャッフル関数
  shuffle = (array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i >= 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j],shuffled[i]];
    }
    return shuffled;
  };

  // 選択肢を表示する関数
  displayChoices = (quiz, quizData) => {
    this.clearChoices();

    // 正解と不正解の選択肢を一つの配列にまとめる
    const choices = [...quiz.incorrect_answers, quiz.correct_answer];

    // 選択肢をシャッフル
    const shuffledChoices = this.shuffle(choices);

    // 選択肢を表示する
    shuffledChoices.forEach((choice) => {
      this.createChoiceButton(choice, quiz, quizData);
    });
  }

  //次の問題を表示する関数
  nextQuiz = (quizData) => {
    this.currentIndex++;

    if (this.currentIndex < quizData.length) {
      this.displayQuizData(quizData, this.currentIndex);
    } else {
      this.showScore(quizData);
    };
  };

  //----------イベント-----------------

  addEventListener = () => { 
    this.startBtn.addEventListener("click", async () => {
      await this.startQuiz();
    });
  };

  async startQuiz() {

    this.quizQuestion.placeholder="少々お待ちください"
    this.h1Title.innerHTML="取得中..."


    this.genreDisplay.style.display = 'none';
    this.difficultyDisplay.style.display = 'none';
    this.startBtn.style.display = 'none';

    const quizData = await this.getQuizData();

    this.correctCount = 0;
    this.currentIndex = 0;

    this.displayQuizData(quizData,0)

    this.genreDisplay.style.display = 'block';
    this.difficultyDisplay.style.display = 'block';

    this.h1Title.innerText = '問題1';

    this.quizQuestion.placeholder = '以下のボタンをクリック';
  };
};

new Quiz();