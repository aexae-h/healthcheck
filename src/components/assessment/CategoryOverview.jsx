import { 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText,
    LinearProgress,
    Box,
    Collapse,
    Button,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { assessmentData } from '../../data/questions';

function CategoryOverview() {
    const { answers, setCurrentCategory, setCurrentQuestion } = useAssessment();
    const [expandedCategory, setExpandedCategory] = useState(null);

    const calculateCategoryProgress = (categoryNumber) => {
        const category = assessmentData.find(cat => cat.Nummer === categoryNumber);
        if (!category) return 0;

        const totalQuestions = category.Fragen.length;
        const answeredQuestions = category.Fragen.filter(question => 
            answers[`${category.Nummer}-${question.Unternummer}`]
        ).length;

        return (answeredQuestions / totalQuestions) * 100;
    };

    const handleQuestionClick = (categoryIndex, questionIndex) => {
        setCurrentCategory(categoryIndex);
        setCurrentQuestion(questionIndex);
    };

    const isQuestionAnswered = (categoryNumber, questionNumber) => {
        return !!answers[`${categoryNumber}-${questionNumber}`];
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Fortschritt nach Kategorien
                </Typography>
                <List>
                    {assessmentData.map((category, categoryIndex) => (
                        <Box key={category.Nummer}>
                            <ListItem 
                                button 
                                onClick={() => setExpandedCategory(
                                    expandedCategory === category.Nummer ? null : category.Nummer
                                )}
                            >
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {category.Gruppenname}
                                            <IconButton size="small">
                                                {expandedCategory === category.Nummer ? 
                                                    <ExpandLessIcon /> : 
                                                    <ExpandMoreIcon />
                                                }
                                            </IconButton>
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ width: '100%', mt: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={calculateCategoryProgress(category.Nummer)}
                                            />
                                        </Box>
                                    }
                                />
                            </ListItem>
                            
                            <Collapse in={expandedCategory === category.Nummer}>
                                <List component="div" disablePadding>
                                    {category.Fragen.map((frage, questionIndex) => (
                                        <ListItem
                                            key={frage.Unternummer}
                                            button
                                            onClick={() => handleQuestionClick(categoryIndex, questionIndex)}
                                            sx={{ pl: 4 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {isQuestionAnswered(category.Nummer, frage.Unternummer) ? 
                                                            <CheckCircleIcon color="success" fontSize="small" /> :
                                                            <RadioButtonUncheckedIcon fontSize="small" />
                                                        }
                                                        <Typography variant="body2">
                                                            {`${frage.Unternummer}: ${frage.Frage.substring(0, 60)}...`}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default CategoryOverview;