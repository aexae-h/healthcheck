import { Box, Container } from '@mui/material';
import Navigation from './Navigation';

function Layout({ children }) {
    return (
        <Box>
            <Navigation />
            <Container 
                component="main" 
                maxWidth="xl" 
                sx={{
                    mt: '80px', // Abstand für die Navbar
                    py: 4,
                    minHeight: 'calc(100vh - 80px)',
                    backgroundColor: (theme) => theme.palette.grey[50]
                }}
            >
                {children}
            </Container>
        </Box>
    );
}

export default Layout;