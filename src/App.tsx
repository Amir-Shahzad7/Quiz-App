import React, { useState } from "react";
import QuestionCard from "./Components/QuestionCard";
import { fetchQuestions } from "./Services/API";
import { Difficulty, QuestionState } from "./Services/API";
import { GlobalStyle, Wrapper } from "./App.styles";
import Logo from "./Images/quiz-logo.png";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const Total_Questions = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuestions(Total_Questions, Difficulty.Easy);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users Answer
      const answer = e.currentTarget.value;
      // Check Answer
      const correct = questions[number].correct_answer === answer;
      // Add Score if Answer is Correct
      if (correct) setScore((prev) => prev + 1);
      // Save answer in array for user answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === Total_Questions) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <img className="Image" src={Logo} alt="React Quiz" />
        {gameOver || userAnswers.length === Total_Questions ? (
          <button className="Start" onClick={startQuiz}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className="Score">Score: {score}</p> : null}
        {loading ? <p>Loading Questions....</p> : null}
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={Total_Questions}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!loading &&
        !gameOver &&
        userAnswers.length === number + 1 &&
        number !== Total_Questions - 1 ? (
          <button className="Next" onClick={nextQuestion}>
            Next
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
