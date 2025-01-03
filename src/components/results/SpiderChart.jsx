import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { useAssessment } from '../../context/AssessmentContext';
import { assessmentData } from '../../data/questions';

function SpiderChart() {
    const { answers } = useAssessment();

    // Berechne den durchschnittlichen Reifegrad für jede Kategorie
    const chartData = assessmentData.map(category => {
        const categoryAnswers = category.Fragen.map(question => {
            const answer = answers[`${category.Nummer}-${question.Unternummer}`];
            if (answer) {
                // Extrahiere die Nummer aus "Reifegrad X"
                return parseInt(answer.split(' ')[1]);
            }
            return 0;
        });

        const answeredQuestions = categoryAnswers.filter(grade => grade > 0);
        const average = answeredQuestions.length > 0
            ? categoryAnswers.reduce((sum, grade) => sum + grade, 0) / answeredQuestions.length
            : 0;

        return {
            category: category.Gruppenname,
            value: Number(average.toFixed(2))
        };
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Reifegradübersicht
                </Typography>
                <ResponsiveContainer width="100%" height={500}>
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis 
                            dataKey="category"
                            tick={{ 
                                fill: '#666',
                                fontSize: 12,
                            }}
                        />
                        <PolarRadiusAxis 
                            angle={90}
                            domain={[0, 5]}
                        />
                        <Radar
                            name="Reifegrad"
                            dataKey="value"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default SpiderChart;