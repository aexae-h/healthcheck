import { 
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics'
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Start', icon: <HomeIcon />, path: '/' },
        { text: 'Assessment', icon: <AssessmentIcon />, path: '/assessment' },
        { text: 'Ergebnisse', icon: <BarChartIcon />, path: '/results' },
        { text: 'Secudor', icon: <AnalyticsIcon />, path: '/analyzer', align: 'right' } // Neuer Menüpunkt
    ];

    return (
        <AppBar position="fixed" sx={{ bgcolor: 'grey.900' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                    <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Reifegradassessment
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        {menuItems.filter(item => !item.align).map((item) => (
                            <Button 
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                startIcon={item.icon}
                                sx={{ 
                                    mr: 2,
                                    color: location.pathname === item.path ? 'white' : 'grey.300',
                                    bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent'
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        {menuItems.filter(item => item.align === 'right').map((item) => (
                            <Button 
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                startIcon={item.icon}
                                sx={{ 
                                    color: location.pathname === item.path ? 'white' : 'grey.300',
                                    bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent'
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;