import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    IconButton,
    Avatar
} from '@mui/material';
import { GitHub, Launch, Favorite, Comment } from '@mui/icons-material';
import { projectsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAllProjects();
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (projectId) => {
        try {
            await projectsAPI.likeProject(projectId);
            fetchProjects(); // Refresh to get updated likes
        } catch (error) {
            console.error('Failed to like project:', error);
        }
    };

    if (loading) {
        return <Typography>Loading projects...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Projects ({projects.length})
            </Typography>
            
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} md={6} lg={4} key={project._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {project.title}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {project.description.substring(0, 150)}
                                    {project.description.length > 150 ? '...' : ''}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Chip 
                                        label={project.category} 
                                        size="small" 
                                        color="primary" 
                                        sx={{ mr: 1 }}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    {project.technologies.slice(0, 3).map((tech) => (
                                        <Chip 
                                            key={tech} 
                                            label={tech} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <Chip 
                                            label={`+${project.technologies.length - 3} more`} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                        {project.author?.name?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                        {project.author?.name} • {project.author?.branch}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions>
                                <IconButton 
                                    onClick={() => handleLike(project._id)}
                                    color="primary"
                                >
                                    <Favorite />
                                </IconButton>
                                <Typography variant="body2">
                                    {project.likes?.length || 0}
                                </Typography>

                                <IconButton>
                                    <Comment />
                                </IconButton>
                                <Typography variant="body2">
                                    {project.comments?.length || 0}
                                </Typography>

                                <Box sx={{ ml: 'auto' }}>
                                    {project.githubUrl && (
                                        <IconButton 
                                            component="a" 
                                            href={project.githubUrl} 
                                            target="_blank"
                                        >
                                            <GitHub />
                                        </IconButton>
                                    )}
                                    {project.liveUrl && (
                                        <IconButton 
                                            component="a" 
                                            href={project.liveUrl} 
                                            target="_blank"
                                        >
                                            <Launch />
                                        </IconButton>
                                    )}
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {projects.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No projects yet. Be the first to showcase your work! 🚀
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProjectsList;
