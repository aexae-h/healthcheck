import { useState, useEffect } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    RadioGroup, 
    FormControlLabel, 
    Radio, 
    Button, 
    Box,
    Tooltip,
    IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useAssessment } from '../../context/AssessmentContext';
import { assessmentData } from '../../data/questions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Question() {
    const { 
        currentCategory, 
        currentQuestion, 
        setCurrentQuestion, 
        setCurrentCategory,
        saveAnswer,
        answers 
    } = useAssessment();

    const category = assessmentData[currentCategory];
    const question = category?.Fragen[currentQuestion];
    
    // Spezifischer Schlüssel für die aktuelle Frage
    const questionKey = `${category?.Nummer}-${question?.Unternummer}`;
    const [selectedValue, setSelectedValue] = useState(
        answers[questionKey] || ''
    );

    const getBackgroundColor = (grade) => {
        const level = parseInt(grade.split(' ')[1]);
        if (level <= 2) return 'rgba(254, 226, 226, 0.6)';     // helles Rot
        if (level === 3) return 'rgba(254, 249, 195, 0.6)';    // helles Gelb
        return 'rgba(220, 252, 231, 0.6)';                     // helles Grün
    };

    // Reset selectedValue wenn sich die Frage ändert
    useEffect(() => {
        setSelectedValue(answers[questionKey] || '');
    }, [currentCategory, currentQuestion, answers, questionKey]);

    const handleNext = () => {
        if (currentQuestion < category.Fragen.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else if (currentCategory < assessmentData.length - 1) {
            setCurrentCategory(currentCategory + 1);
            setCurrentQuestion(0);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        } else if (currentCategory > 0) {
            setCurrentCategory(currentCategory - 1);
            setCurrentQuestion(assessmentData[currentCategory - 1].Fragen.length - 1);
        }
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        saveAnswer(category.Nummer, question.Unternummer, value);
    };

    if (!question) return null;

    return (
        <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 4 }}>
                {/* Progress indicator */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: -20, 
                    left: 32, 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    py: 1,
                    px: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}>
                    <Typography variant="subtitle2">
                        {category.Gruppenname}
                    </Typography>
                </Box>

                <Box sx={{ mt: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Frage {question.Unternummer}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                        {question.Frage}
                        <Tooltip title={question.Ziel} placement="top">
                            <IconButton size="small" sx={{ ml: 1, color: 'primary.main' }}>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </Box>

                <RadioGroup 
                    value={selectedValue} 
                    onChange={handleChange}
                    sx={{ '& .MuiFormControlLabel-root': { mb: 2 } }}
                >
                    {Object.entries(question.Reifegrade).map(([grade, description]) => (
                        <FormControlLabel 
                            key={grade}
                            value={grade}
                            control={
                                <Radio 
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'primary.main',
                                        }
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ 
                                    p: 2, 
                                    borderRadius: 2,
                                    bgcolor: selectedValue === grade ? 'primary.light' : 'grey.50',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: selectedValue === grade ? 'primary.light' : 'grey.100',
                                    }
                                }}>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: selectedValue === grade ? 'white' : 'text.primary'
                                        }}
                                    >
                                        {grade}
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{ 
                                            color: selectedValue === grade ? 'white' : 'text.secondary'
                                        }}
                                    >
                                        {description}
                                    </Typography>
                                </Box>
                            }
                            sx={{ 
                                margin: 0,
                                width: '100%',
                            }}
                        />
                    ))}
                </RadioGroup>

                <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderTop: 1,
                    borderColor: 'grey.200',
                    pt: 3
                }}>
                    <Button 
                        onClick={handlePrevious}
                        disabled={currentCategory === 0 && currentQuestion === 0}
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: 'text.secondary' }}
                    >
                        Zurück
                    </Button>
                    <Button 
                        onClick={handleNext}
                        variant="contained"
                        disabled={!selectedValue}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Weiter
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Question;