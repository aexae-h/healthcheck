import { 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Grid,
    Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { assessmentData } from '../data/questions';

function Home() {
    const navigate = useNavigate();
    const totalQuestions = assessmentData.reduce(
        (sum, category) => sum + category.Fragen.length, 
        0
    );

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Willkommen zum Reifegradassessment
            </Typography>
            
            <Typography variant="body1" paragraph>
                Dieses Assessment hilft Ihnen dabei, den Reifegrad Ihres Unternehmens in verschiedenen 
                Bereichen zu evaluieren.
            </Typography>

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
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => navigate('/assessment')}
                                sx={{ mt: 2 }}
                            >
                                Assessment starten
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Home;