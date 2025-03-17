import { createContext, useContext, useState, useEffect } from 'react';

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
    // Initialisiere State mit Daten aus localStorage, falls vorhanden
    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem('assessmentAnswers');
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });

    const [assessmentInfo, setAssessmentInfo] = useState(() => {
        const savedInfo = localStorage.getItem('assessmentInfo');
        return savedInfo ? JSON.parse(savedInfo) : {
            customerName: '',
            assessmentDate: new Date().toISOString().split('T')[0],
            industry: '',
            employeeCount: '',
            auditFocus: ''      // Neues Feld statt annualRevenue
        };
    });

    const [currentCategory, setCurrentCategory] = useState(() => {
        const savedCategory = localStorage.getItem('currentCategory');
        return savedCategory ? parseInt(savedCategory) : 0;
    });

    const [currentQuestion, setCurrentQuestion] = useState(() => {
        const savedQuestion = localStorage.getItem('currentQuestion');
        return savedQuestion ? parseInt(savedQuestion) : 0;
    });

    // Speichere Änderungen im localStorage
    useEffect(() => {
        localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        localStorage.setItem('assessmentInfo', JSON.stringify(assessmentInfo));
    }, [assessmentInfo]);

    useEffect(() => {
        localStorage.setItem('currentCategory', currentCategory.toString());
    }, [currentCategory]);

    useEffect(() => {
        localStorage.setItem('currentQuestion', currentQuestion.toString());
    }, [currentQuestion]);

    const saveAnswer = (categoryNumber, questionNumber, answer) => {
        setAnswers(prev => ({
            ...prev,
            [`${categoryNumber}-${questionNumber}`]: answer
        }));
    };

    // Optional: Funktion zum Zurücksetzen des Assessments
    const resetAssessment = () => {
        setAnswers({});
        setCurrentCategory(0);
        setCurrentQuestion(0);
        setAssessmentInfo({
            customerName: '',
            assessmentDate: new Date().toISOString().split('T')[0]
        });
        localStorage.removeItem('assessmentAnswers');
        localStorage.removeItem('assessmentInfo');
        localStorage.removeItem('currentCategory');
        localStorage.removeItem('currentQuestion');
    };

    const value = {
        answers,
        currentCategory,
        currentQuestion,
        assessmentInfo,
        setAssessmentInfo,
        setCurrentCategory,
        setCurrentQuestion,
        saveAnswer,
        resetAssessment  // Optional: Füge die Reset-Funktion zum Context hinzu
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