import React, { useState } from 'react';
import { Button } from "../../../../../components/button";

function QuizCard({ chapter }) {
    const [quiz, setQuiz] = useState([]);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const generateQuiz = async () => {
        setLoading(true);
        setStep(0);
        setScore(0);
        setShowResult(false);

        try {
            const resp = await fetch('/api/course/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: chapter?.chapterName || chapter?.ChapterName || "General AI",
                    difficulty: "Beginner",
                    number: 10
                })
            });

            const data = await resp.json();
            console.log(data);
            setQuiz(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = (option) => {
        if (showResult) return;

        setSelectedOption(option);
        const correct = quiz[step]?.answer;
        if (option === correct) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (step < quiz.length - 1) {
            setStep(step + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className='mt-10 p-5 border rounded-lg shadow-sm'>
            <h2 className='font-bold text-lg mb-4'>Quiz Time</h2>

            {quiz.length === 0 && !loading && (
                <div className='text-center'>
                    <p className='text-gray-500 mb-4'>Test your knowledge on this chapter.</p>
                    <Button onClick={generateQuiz}>Start Quiz</Button>
                </div>
            )}

            {loading && <div className='text-center animate-pulse'>Generating Quiz...</div>}

            {quiz.length > 0 && !showResult && (
                <div>
                    <h2 className='font-medium text-xl mb-4 text-center'>
                        Question {step + 1} of {quiz.length}
                    </h2>

                    <h3 className='font-bold text-lg mb-6'>{quiz[step]?.question}</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {quiz[step]?.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => checkAnswer(option)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all
                                ${selectedOption === option
                                        ? option === quiz[step]?.answer
                                            ? 'bg-green-100 border-green-500' // Correct
                                            : 'bg-red-100 border-red-500'     // Wrong
                                        : 'hover:bg-gray-50'
                                    }
                                ${selectedOption && option === quiz[step]?.answer && 'bg-green-100 border-green-500'} 
                            `}
                            >
                                {option}
                            </div>
                        ))}
                    </div>

                    {selectedOption && (
                        <div className='flex justify-end mt-6'>
                            <Button onClick={nextQuestion}>
                                {step < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {showResult && (
                <div className='text-center'>
                    <h2 className='text-2xl font-bold mb-4'>Quiz Completed!</h2>
                    <p className='text-xl mb-6'>
                        You scored <span className='font-bold text-primary'>{score}</span> out of {quiz.length}
                    </p>
                    <Button onClick={generateQuiz} variant="outline">Retake Quiz</Button>
                </div>
            )}
        </div>
    );
}

export default QuizCard;
