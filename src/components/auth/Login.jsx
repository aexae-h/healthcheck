import { useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    TextField, 
    Button, 
    Typography,
    Alert 
} from '@mui/material';

function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hier das gewünschte Passwort eintragen
        if (password === 'secudor2024') {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'grey.100'
        }}>
            <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Reifegradassessment
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type="password"
                            label="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                Falsches Passwort
                            </Alert>
                        )}
                        <Button 
                            fullWidth 
                            variant="contained" 
                            type="submit"
                            sx={{ mt: 3 }}
                        >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;