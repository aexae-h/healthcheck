import { Grid, Paper } from '@mui/material';
import Question from '../components/assessment/Question';
import CategoryOverview from '../components/assessment/CategoryOverview';

function Assessment() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Question />
            </Grid>
            <Grid item xs={12} md={4}>
                <CategoryOverview />
            </Grid>
        </Grid>
    );
}

export default Assessment;