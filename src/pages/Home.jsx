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
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Branche"
                                value={assessmentInfo.industry}
                                onChange={(e) => setAssessmentInfo(prev => ({
                                    ...prev,
                                    industry: e.target.value
                                }))}
                                margin="normal"
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="IT">IT & Telekommunikation</option>
                                <option value="Fertigung">Fertigung & Industrie</option>
                                <option value="Handel">Handel & E-Commerce</option>
                                <option value="Finanzen">Finanzen & Versicherung</option>
                                <option value="Gesundheit">Gesundheitswesen</option>
                                <option value="Dienstleistungen">Dienstleistungen</option>
                                <option value="Andere">Andere</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mitarbeiterzahl"
                                value={assessmentInfo.employeeCount}
                                onChange={(e) => setAssessmentInfo(prev => ({
                                    ...prev,
                                    employeeCount: e.target.value
                                }))}
                                margin="normal"
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="1-10">1-10 Mitarbeiter</option>
                                <option value="11-50">11-50 Mitarbeiter</option>
                                <option value="51-200">51-200 Mitarbeiter</option>
                                <option value="201-500">201-500 Mitarbeiter</option>
                                <option value="501-1000">501-1000 Mitarbeiter</option>
                                <option value="1000+">Über 1000 Mitarbeiter</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fokus für das Audit"
                                value={assessmentInfo.auditFocus}
                                onChange={(e) => setAssessmentInfo(prev => ({
                                    ...prev,
                                    auditFocus: e.target.value
                                }))}
                                margin="normal"
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="Prozessoptimierung">Prozessoptimierung & Effizienz</option>
                                <option value="Digitalisierung">Digitalisierung & Automatisierung</option>
                                <option value="Sicherheit">IT-Sicherheit & Compliance</option>
                                <option value="Kosten">Kostenoptimierung</option>
                                <option value="Innovation">Innovation & Zukunftsfähigkeit</option>
                                <option value="Qualität">Qualitätsmanagement</option>
                                <option value="Mitarbeiter">Mitarbeiterentwicklung & Change Management</option>
                                <option value="Nachhaltigkeit">Nachhaltigkeit & CSR</option>
                                <option value="Andere">Andere Schwerpunkte</option>
                            </TextField>
                        </Grid>

                        {assessmentInfo.auditFocus === 'Andere' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Weitere Anmerkungen zum Audit-Fokus"
                                    value={assessmentInfo.auditFocusNote || ''}
                                    onChange={(e) => setAssessmentInfo(prev => ({
                                        ...prev,
                                        auditFocusNote: e.target.value
                                    }))}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                    placeholder="Bitte beschreiben Sie Ihre spezifischen Schwerpunkte für das Audit..."
                                />
                            </Grid>
                        )}
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
                                    color="error"
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
        </Box>
    );
}

export default Home;