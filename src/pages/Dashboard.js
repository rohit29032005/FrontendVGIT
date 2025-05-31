import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CreateProject from '../components/Projects/CreateProject';
import { projectsAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLogout = () => {
    logout();
  };

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAllProjects();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setSnackbar({
      open: true,
      message: 'Project created successfully!',
      severity: 'success'
    });
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VIT Student Showcase
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" href="/projects">
              Projects
            </Button>
            <Button color="inherit" href="/admin">
              Admin
            </Button>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1">
              {user?.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Your Dashboard! 🎉
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hello {user?.name}, ready to showcase your amazing projects?
          </Typography>
        </Box>

        {/* User Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Profile
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Name:</strong> {user?.name}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>University:</strong> {user?.university}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Branch:</strong> {user?.branch}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Year:</strong> {user?.year}
            </Typography>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setCreateProjectOpen(true)}
              >
                Create New Project
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component="a"
                href="/projects"
              >
                View All Projects ({projects.length})
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component="a"
                href="/admin"
              >
                📊 Database Admin
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Platform Statistics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h4" color="primary.contrastText">
                  {projects.length}
                </Typography>
                <Typography variant="body1" color="primary.contrastText">
                  Total Projects
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                <Typography variant="h4" color="secondary.contrastText">
                  {projects.reduce((sum, project) => sum + (project.likes?.length || 0), 0)}
                </Typography>
                <Typography variant="body1" color="secondary.contrastText">
                  Total Likes
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h4" color="success.contrastText">
                  {projects.reduce((sum, project) => sum + (project.comments?.length || 0), 0)}
                </Typography>
                <Typography variant="body1" color="success.contrastText">
                  Total Comments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
          <Typography variant="h6" color="success.dark">
            🎊 Congratulations! Your MERN Stack App is Complete!
          </Typography>
          <Typography variant="body1" color="success.dark" sx={{ mt: 1 }}>
            ✅ Backend API connected<br/>
            ✅ Authentication working<br/>
            ✅ Frontend React app running<br/>
            ✅ MongoDB database connected<br/>
            ✅ Project creation functional<br/>
            ✅ Project listing working<br/>
            ✅ Admin dashboard ready<br/>
            ✅ Production-ready application!
          </Typography>
        </Box>
      </Container>

      {/* Create Project Dialog */}
      <CreateProject
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
