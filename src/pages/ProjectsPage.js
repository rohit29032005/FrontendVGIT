import React from 'react';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ProjectsList from '../components/Projects/ProjectsList';

const ProjectsPage = () => {
    const { user, logout } = useAuth();

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        VIT Student Showcase
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" href="/dashboard">
                            Dashboard
                        </Button>
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1">
                            {user?.name}
                        </Typography>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <ProjectsList />
            </Container>
        </Box>
    );
};

export default ProjectsPage;
