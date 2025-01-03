import { useState } from 'react';
import { 
    Box, 
    Button,
    Card, 
    CardContent, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow,
    Tabs,
    Tab,
    Rating,
    LinearProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAssessment } from '../context/AssessmentContext';
import { assessmentData } from '../data/questions';
import SpiderChart from '../components/results/SpiderChart'

function Results() {
    const { answers } = useAssessment();
    const [currentTab, setCurrentTab] = useState(0);

    const downloadCSV = () => {
        // CSV Header
        let csvContent = "Kategorie,Frage,Reifegrad\n";

        // Daten sammeln
        assessmentData.forEach(category => {
            category.Fragen.forEach(question => {
                const answer = answers[`${category.Nummer}-${question.Unternummer}`] || 'Nicht beantwortet';
                // Bereinige Texte von Kommas und Zeilenumbrüchen
                const cleanQuestion = question.Frage.replace(/,/g, ';').replace(/\n/g, ' ');
                csvContent += `${category.Gruppenname},${cleanQuestion},${answer}\n`;
            });
        });

        // Download initiieren
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'reifegradassessment_ergebnisse.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateCategoryScore = (category) => {
        let totalScore = 0;
        let answeredQuestions = 0;

        category.Fragen.forEach(question => {
            const answer = answers[`${category.Nummer}-${question.Unternummer}`];
            if (answer) {
                // Extrahiere die Nummer aus "Reifegrad X"
                const grade = parseInt(answer.split(' ')[1]);
                totalScore += grade;
                answeredQuestions++;
            }
        });

        return answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
    };

    const renderOverview = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Gesamtübersicht
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kategorie</TableCell>
                            <TableCell>Durchschnittlicher Reifegrad</TableCell>
                            <TableCell>Visualisierung</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assessmentData.map(category => {
                            const score = calculateCategoryScore(category);
                            return (
                                <TableRow key={category.Nummer}>
                                    <TableCell>{category.Gruppenname}</TableCell>
                                    <TableCell>
                                        <Rating 
                                            value={score} 
                                            readOnly 
                                            max={5}
                                            precision={0.1}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(score/5)*100}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    const renderDetailedAnalysis = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Detailanalyse
                </Typography>
                {assessmentData.map(category => (
                    <Box key={category.Nummer} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {category.Gruppenname}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Frage</TableCell>
                                    <TableCell>Bewertung</TableCell>
                                    <TableCell>Beschreibung</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {category.Fragen.map(question => {
                                    const answer = answers[`${category.Nummer}-${question.Unternummer}`];
                                    return (
                                        <TableRow key={question.Unternummer}>
                                            <TableCell>{question.Frage}</TableCell>
                                            <TableCell>
                                                {answer || 'Nicht beantwortet'}
                                            </TableCell>
                                            <TableCell>
                                                {answer && question.Reifegrade[answer]}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );

    return (
        <Box>

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4">
                    Ergebnisse des Assessments
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />}
                    onClick={downloadCSV}
                    sx={{ ml: 2 }}
                >
                    Als CSV exportieren
                </Button>
            </Box>
            
            <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Übersicht" />
                <Tab label="Detailanalyse" />
                <Tab label="Spider Chart" />
            </Tabs>

            {currentTab === 0 && renderOverview()}
            {currentTab === 1 && renderDetailedAnalysis()}
            {currentTab === 2 && <SpiderChart />}
        </Box>
    );
}

export default Results;