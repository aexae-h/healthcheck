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
                try {
                    const importData = JSON.parse(e.target.result);

                    // Metadaten importieren
                    setAssessmentInfo(importData.metadata);

                    // Antworten importieren
                    Object.entries(importData.answers).forEach(([key, value]) => {
                        saveAnswer(...key.split('-'), value);
                    });

                    alert('Import erfolgreich abgeschlossen!');
                    navigate('/assessment');
                } catch (error) {
                    alert('Fehler beim Import der Datei. Bitte überprüfen Sie das Dateiformat.');
                }
            };
            reader.readAsText(file);
        }
    };

    const downloadJSON = () => {
        const exportData = {
            metadata: {
                customerName: assessmentInfo.customerName,
                assessmentDate: assessmentInfo.assessmentDate,
                industry: assessmentInfo.industry,
                employeeCount: assessmentInfo.employeeCount,
                auditFocus: assessmentInfo.auditFocus,
                auditFocusNote: assessmentInfo.auditFocusNote
            },
            answers: answers
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'reifegradassessment_ergebnisse.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateCategoryProgress = (category) => {
        const totalQuestions = category.Fragen.length;
        const answeredQuestions = category.Fragen.filter(question =>
            answers[`${category.Nummer}-${question.Unternummer}`]
        ).length;

        return (answeredQuestions / totalQuestions) * 100;
    };

    const calculateCategoryScore = (category) => {
        let totalScore = 0;
        let answeredQuestions = 0;

        category.Fragen.forEach(question => {
            const answer = answers[`${category.Nummer}-${question.Unternummer}`];
            if (answer) {
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
                    Übersicht der Kategorien
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kategorie</TableCell>
                            <TableCell>Durchschnittlicher Reifegrad</TableCell>
                            <TableCell>Bearbeitungsfortschritt</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assessmentData.map(category => {
                            const score = calculateCategoryScore(category);
                            const progress = calculateCategoryProgress(category);
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
                                                    flexGrow: 1
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {Math.round(progress)}%
                                            </Typography>
                                        </Box>
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
                        JSON importieren
                        <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                    </Button>
                    {/* Existierender Export-Button */}
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadJSON}
                        sx={{ mr: 2 }}
                    >
                        Als JSON exportieren
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