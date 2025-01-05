import {
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { assessmentData } from '../data/questions';
import { useAssessment } from '../context/AssessmentContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';


function Home() {
    const navigate = useNavigate();
    const { assessmentInfo, setAssessmentInfo, resetAssessment } = useAssessment();
    const [openDialog, setOpenDialog] = useState(false);
    const totalQuestions = assessmentData.reduce(
        (sum, category) => sum + category.Fragen.length,
        0
    );

    const handleReset = () => {
        resetAssessment();
        setOpenDialog(false);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Willkommen zum Reifegradassessment
            </Typography>

            <Typography variant="body1" paragraph>
                Dieses Assessment hilft Ihnen dabei, den Reifegrad Ihres Unternehmens in verschiedenen
                Bereichen zu evaluieren.
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kundenname"
                                value={assessmentInfo.customerName}
                                onChange={(e) => setAssessmentInfo(prev => ({
                                    ...prev,
                                    customerName: e.target.value
                                }))}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Datum des Assessments"
                                value={assessmentInfo.assessmentDate}
                                onChange={(e) => setAssessmentInfo(prev => ({
                                    ...prev,
                                    assessmentDate: e.target.value
                                }))}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Überblick
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • {assessmentData.length} Kategorien
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • {totalQuestions} Fragen insgesamt
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • 5 Reifegrade pro Frage
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Starten Sie jetzt
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Beginnen Sie mit dem Assessment, um eine detaillierte Analyse
                                Ihres Unternehmens zu erhalten.
                            </Typography>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    color="info"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Zurücksetzen
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/assessment')}
                                >
                                    Assessment starten
                                </Button>
                            </Box>

                            {/* Bestätigungsdialog */}
                            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                <DialogTitle>
                                    Assessment zurücksetzen?
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Sind Sie sicher, dass Sie das Assessment zurücksetzen möchten?
                                        Alle bisherigen Antworten werden gelöscht.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)}>
                                        Abbrechen
                                    </Button>
                                    <Button onClick={handleReset} color="error" variant="contained">
                                        Zurücksetzen
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Home;