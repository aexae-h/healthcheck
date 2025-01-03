import { 
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Start', icon: <HomeIcon />, path: '/' },
        { text: 'Assessment', icon: <AssessmentIcon />, path: '/assessment' },
        { text: 'Ergebnisse', icon: <BarChartIcon />, path: '/results' }
    ];

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                bgcolor: 'grey.900', // Dunkler Hintergrund
                color: 'white'       // Weiße Schrift
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                    <img 
                        src={logo}
                        alt="Logo"
                        style={{ 
                            height: '40px',
                            marginRight: '16px'
                        }}
                    />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Reifegradassessment
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {menuItems.map((item) => (
                        <Button 
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            startIcon={item.icon}
                            sx={{ 
                                mr: 2,
                                borderRadius: 2,
                                color: 'grey.300',
                                '&:hover': {
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                },
                                ...(location.pathname === item.path && {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                })
                            }}
                        >
                            {item.text}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;