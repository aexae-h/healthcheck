import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    LinearProgress
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useAssessment } from '../context/AssessmentContext';
import { assessmentData } from '../data/questions';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function Analyzer() {
    const { assessmentInfo, answers } = useAssessment();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const CLAUDE_API_KEY = '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'; // In Produktion über Umgebungsvariablen!
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

    const generateDetailedJSON = () => {
        return {
            metadata: {
                assessmentDate: assessmentInfo.assessmentDate,
                industry: assessmentInfo.industry,
                employeeCount: assessmentInfo.employeeCount,
                auditFocus: assessmentInfo.auditFocus,
                auditFocusNote: assessmentInfo.auditFocusNote
            },
            categories: assessmentData.map(category => ({
                number: category.Nummer,
                name: category.Gruppenname,
                questions: category.Fragen.map(question => ({
                    number: question.Unternummer,
                    question: question.Frage,
                    goal: question.Ziel,
                    selectedAnswer: answers[`${category.Nummer}-${question.Unternummer}`] || null,
                    possibleAnswers: question.Reifegrade,
                    necessary: question.Notwendig,
                    must: question.Muss
                }))
            }))
        };
    };

    const generatePDF = (analysisData) => {
        const doc = new jsPDF();
        
        // Titelseite
        doc.setFontSize(24);
        doc.text('Reifegradassessment', 20, 30);
        doc.text('Analysebericht', 20, 45);
        
        doc.setFontSize(12);
        doc.text('Erstellt von Secudor GmbH', 20, 60);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 20, 70);
        
        // Kundeninformationen
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Kundeninformationen', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Kunde: ${assessmentInfo.customerName}`, 20, 40);
        doc.text(`Assessment Datum: ${assessmentInfo.assessmentDate}`, 20, 50);
        doc.text(`Branche: ${assessmentInfo.industry}`, 20, 60);
        doc.text(`Mitarbeiterzahl: ${assessmentInfo.employeeCount}`, 20, 70);
        doc.text(`Audit-Fokus: ${assessmentInfo.auditFocus}`, 20, 80);
        
        // Zusammenfassung
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Zusammenfassung', 20, 20);
        
        doc.setFontSize(12);
        const summaryText = doc.splitTextToSize(analysisData.summary, 170);
        doc.text(summaryText, 20, 40);
        
        // Detailanalyse pro Kategorie
        analysisData.categories.forEach((category, index) => {
            doc.addPage();
            
            // Kategorie-Überschrift
            doc.setFontSize(18);
            doc.text(category.name, 20, 20);
            
            // Findings der Kategorie
            let yPosition = 40;
            
            category.findings.forEach(finding => {
                // Prüfen, ob genug Platz auf der Seite ist
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(14);
                doc.text(`Frage ${finding.questionNumber}`, 20, yPosition);
                yPosition += 10;
                
                doc.setFontSize(12);
                const questionText = doc.splitTextToSize(finding.question, 170);
                doc.text(questionText, 20, yPosition);
                yPosition += questionText.length * 7;
                
                doc.text(`Aktueller Reifegrad: ${finding.currentLevel}`, 20, yPosition);
                yPosition += 10;
                
                doc.setFontSize(12);
                doc.text('Handlungsempfehlung:', 20, yPosition);
                yPosition += 7;
                const recommendationText = doc.splitTextToSize(finding.recommendation, 170);
                doc.text(recommendationText, 20, yPosition);
                yPosition += recommendationText.length * 7;
                
                doc.text(`Priorität: ${finding.priority}`, 20, yPosition);
                yPosition += 7;
                doc.text(`Zeitrahmen: ${finding.timeline}`, 20, yPosition);
                yPosition += 20;
            });
        });
        
        return doc;
    };

    const analyzeData = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const assessmentData = generateDetailedJSON();
            
            const response = await fetch('http://18.197.9.51:3000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assessmentData: assessmentData
                })
            });
    
            if (!response.ok) {
                throw new Error(`Server Error: ${await response.text()}`);
            }
    
            // Hier die Änderung: Direkte Verwendung der Antwort von Python/Claude
            const analysisData = await response.json();
            console.log("Received data:", analysisData);
    
            // Validiere das Format
            if (!analysisData || typeof analysisData !== 'object') {
                throw new Error('Ungültiges Antwortformat von der API');
            }
    
            // PDF generieren
            const pdf = generatePDF(analysisData);
            pdf.save(`Reifegradassessment_${assessmentInfo.customerName}_${new Date().toISOString().split('T')[0]}.pdf`);
            
            setAnalysis(analysisData);
    
        } catch (err) {
            console.error('Error details:', err);
            setError('Fehler bei der Analyse: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Secudor Audit Analyzer
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        KI-gestützte Analyse
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<AnalyticsIcon />}
                            onClick={analyzeData}
                            disabled={loading}
                        >
                            Analyse starten
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {loading && (
                        <Box sx={{ width: '100%', my: 4 }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Analysiere Assessment...
                            </Typography>
                            <CircularProgress />
                        </Box>
                    )}

                    {analysis && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Analyse erfolgreich abgeschlossen! Das PDF wurde heruntergeladen.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default Analyzer;