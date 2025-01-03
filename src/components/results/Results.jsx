import { useState } from 'react';
import { 
    Box, 
    Tabs,
    Tab,
} from '@mui/material';
import SpiderChart from '../components/results/SpiderChart';

function Results() {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box>
            <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                sx={{ mb: 3 }}
            >
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