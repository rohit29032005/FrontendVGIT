import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    AppBar,
    Toolbar,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, authAPI } from '../services/api';

const AdminPage = () => {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalUsers: 0,
        totalLikes: 0,
        totalComments: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projectsResponse = await projectsAPI.getAllProjects();
            const projects = projectsResponse.data.projects;
            setProjects(projects);

            // Calculate stats
            const totalLikes = projects.reduce((sum, project) => sum + (project.likes?.length || 0), 0);
            const totalComments = projects.reduce((sum, project) => sum + (project.comments?.length || 0), 0);

            setStats({
                totalProjects: projects.length,
                totalUsers: new Set(projects.map(p => p.author._id)).size,
                totalLikes,
                totalComments
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MongoDB Admin Dashboard
                    </Typography>
                    <Button color="inherit" href="/dashboard">
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h3" gutterBottom>
                    📊 Database Analytics
                </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Projects
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalProjects}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Active Users
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Likes
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalLikes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Comments
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalComments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Projects Table */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            📁 Projects Database
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Technologies</TableCell>
                                        <TableCell>Likes</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Created</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project._id}>
                                            <TableCell>{project.title}</TableCell>
                                            <TableCell>{project.author?.name}</TableCell>
                                            <TableCell>
                                                <Chip label={project.category} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                {project.technologies.slice(0, 2).join(', ')}
                                                {project.technologies.length > 2 && '...'}
                                            </TableCell>
                                            <TableCell>{project.likes?.length || 0}</TableCell>
                                            <TableCell>{project.comments?.length || 0}</TableCell>
                                            <TableCell>
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Raw JSON Data */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            🔍 Raw MongoDB Data
                        </Typography>
                        <Box sx={{ 
                            backgroundColor: '#f5f5f5', 
                            p: 2, 
                            borderRadius: 1,
                            maxHeight: 400,
                            overflow: 'auto'
                        }}>
                            <pre style={{ fontSize: '12px' }}>
                                {JSON.stringify(projects, null, 2)}
                            </pre>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AdminPage;
