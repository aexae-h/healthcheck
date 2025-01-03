import { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
    const [answers, setAnswers] = useState({});
    const [currentCategory, setCurrentCategory] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const saveAnswer = (categoryNumber, questionNumber, answer) => {
        setAnswers(prev => ({
            ...prev,
            [`${categoryNumber}-${questionNumber}`]: answer
        }));
    };

    const value = {
        answers,
        currentCategory,
        currentQuestion,
        setCurrentCategory,
        setCurrentQuestion,
        saveAnswer
    };

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    return useContext(AssessmentContext);
}