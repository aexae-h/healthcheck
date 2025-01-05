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
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import { useAssessment } from '../context/AssessmentContext';
import { assessmentData } from '../data/questions';
import SpiderChart from '../components/results/SpiderChart'
import { useNavigate } from 'react-router-dom';

function Results() {
    const navigate = useNavigate();
    const { answers, saveAnswer, assessmentInfo, setAssessmentInfo } = useAssessment();
    const [currentTab, setCurrentTab] = useState(0);


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                
                let isMetadata = false;
                let isData = false;
                const newAnswers = {};
                
                lines.forEach(line => {
                    if (line.trim() === '#METADATA') {
                        isMetadata = true;
                        isData = false;
                        return;
                    }
                    if (line.trim() === '#DATA') {
                        isMetadata = false;
                        isData = true;
                        return;
                    }
                    
                    if (isMetadata) {
                        const [key, value] = line.split(',');
                        if (key === 'Kundenname') {
                            setAssessmentInfo(prev => ({ ...prev, customerName: value }));
                        } else if (key === 'Datum') {
                            setAssessmentInfo(prev => ({ ...prev, assessmentDate: value }));
                        }
                    }
                    
                    if (isData && line.trim() && !line.startsWith('Kategorie')) {
                        const [category, question, grade] = line.split(',');
                        if (grade && grade.trim() && grade.trim() !== 'Nicht beantwortet') {
                            const categoryData = assessmentData.find(cat => 
                                cat.Gruppenname === category.trim()
                            );
                            
                            if (categoryData) {
                                const questionData = categoryData.Fragen.find(q => 
                                    q.Frage.replace(/,/g, ';').replace(/\n/g, ' ') === question.trim()
                                );
                                
                                if (questionData) {
                                    const key = `${categoryData.Nummer}-${questionData.Unternummer}`;
                                    newAnswers[key] = grade.trim();
                                }
                            }
                        }
                    }
                });

                // Setze alle Antworten
                Object.entries(newAnswers).forEach(([key, value]) => {
                    const [categoryNum, questionNum] = key.split('-');
                    saveAnswer(categoryNum, questionNum, value);
                });

                alert(`Import erfolgreich abgeschlossen! ${Object.keys(newAnswers).length} Antworten importiert.`);
                navigate('/assessment');
            };
            reader.readAsText(file);
        }
    };

    const downloadCSV = () => {
        // Metadata Header
        let csvContent = `#METADATA\n`;
        csvContent += `Kundenname,${assessmentInfo.customerName}\n`;
        csvContent += `Datum,${assessmentInfo.assessmentDate}\n`;
        csvContent += `#DATA\n`;
        csvContent += "Kategorie,Frage,Reifegrad\n";

        // Daten sammeln
        assessmentData.forEach(category => {
            category.Fragen.forEach(question => {
                const answer = answers[`${category.Nummer}-${question.Unternummer}`] || 'Nicht beantwortet';
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
                <Box>
                    {/* Neuer Import-Button */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        sx={{ mr: 2 }}
                    >
                        CSV importieren
                        <input
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                    </Button>
                    {/* Existierender Export-Button */}
                    <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                        onClick={downloadCSV}
                    >
                        Als CSV exportieren
                    </Button>
                </Box>
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