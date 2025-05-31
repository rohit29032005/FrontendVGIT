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
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Delete, Star, StarBorder, Security } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const SecureAdminPage = () => {
    const { user, logout } = useAuth();
    const [data, setData] = useState({
        stats: {},
        projects: [],
        users: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', name: '' });

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'admin') {
            setError('Access Denied: Admin privileges required');
            return;
        }
        fetchAdminData();
    }, [user]);

    const fetchAdminData = async () => {
        try {
            const response = await adminAPI.getStats();
            setData(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (deleteDialog.type === 'project') {
                await adminAPI.deleteProject(deleteDialog.id);
            } else if (deleteDialog.type === 'user') {
                await adminAPI.deleteUser(deleteDialog.id);
            }
            
            setDeleteDialog({ open: false, type: '', id: '', name: '' });
            fetchAdminData(); // Refresh data
        } catch (error) {
            setError(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleFeatureProject = async (projectId) => {
        try {
            await adminAPI.featureProject(projectId);
            fetchAdminData(); // Refresh data
        } catch (error) {
            setError(error.response?.data?.message || 'Feature toggle failed');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            fetchAdminData(); // Refresh data
        } catch (error) {
            setError(error.response?.data?.message || 'Role update failed');
        }
    };

    // Access control check
    if (user?.role !== 'admin') {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Security sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" gutterBottom color="error">
                            Access Denied
                        </Typography>
                        <Typography variant="body1" paragraph>
                            You need administrator privileges to access this page.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your current role: <strong>{user?.role || 'user'}</strong>
                        </Typography>
                        <Button 
                            variant="contained" 
                            href="/dashboard" 
                            sx={{ mt: 2 }}
                        >
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Loading admin data...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Security sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        🔐 Secure Admin Dashboard
                    </Typography>
                    <Chip 
                        label={`Admin: ${user?.name}`} 
                        color="secondary" 
                        sx={{ mr: 2 }} 
                    />
                    <Button color="inherit" href="/dashboard">
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Typography variant="h3" gutterBottom>
                    🛡️ Admin Control Panel
                </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Users
                                </Typography>
                                <Typography variant="h4">
                                    {data.stats.totalUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Projects
                                </Typography>
                                <Typography variant="h4">
                                    {data.stats.totalProjects}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Admins
                                </Typography>
                                <Typography variant="h4">
                                    {data.stats.totalAdmins}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Likes
                                </Typography>
                                <Typography variant="h4">
                                    {data.stats.totalLikes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Comments
                                </Typography>
                                <Typography variant="h4">
                                    {data.stats.totalComments}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Users Management */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            👥 User Management
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Branch</TableCell>
                                        <TableCell>Joined</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.users.map((userData) => (
                                        <TableRow key={userData._id}>
                                            <TableCell>{userData.name}</TableCell>
                                            <TableCell>{userData.email}</TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 100 }}>
                                                    <Select
                                                        value={userData.role}
                                                        onChange={(e) => handleRoleChange(userData._id, e.target.value)}
                                                    >
                                                        <MenuItem value="user">User</MenuItem>
                                                        <MenuItem value="admin">Admin</MenuItem>
                                                        <MenuItem value="moderator">Moderator</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>{userData.branch}</TableCell>
                                            <TableCell>
                                                {new Date(userData.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        type: 'user',
                                                        id: userData._id,
                                                        name: userData.name
                                                    })}
                                                    disabled={userData._id === user._id}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Projects Management */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            📁 Project Management
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Likes</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Featured</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.projects.map((project) => (
                                        <TableRow key={project._id}>
                                            <TableCell>{project.title}</TableCell>
                                            <TableCell>{project.author?.name}</TableCell>
                                            <TableCell>
                                                <Chip label={project.category} size="small" />
                                            </TableCell>
                                            <TableCell>{project.likes?.length || 0}</TableCell>
                                            <TableCell>{project.comments?.length || 0}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    onClick={() => handleFeatureProject(project._id)}
                                                    color={project.featured ? "warning" : "default"}
                                                >
                                                    {project.featured ? <Star /> : <StarBorder />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        type: 'project',
                                                        id: project._id,
                                                        name: project.title
                                                    })}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {deleteDialog.type} "{deleteDialog.name}"?
                        {deleteDialog.type === 'user' && ' This will also delete all their projects.'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SecureAdminPage;
