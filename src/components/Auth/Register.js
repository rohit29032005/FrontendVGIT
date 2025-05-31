import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
    MenuItem
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        branch: '',
        year: ''
    });
    const [error, setError] = useState('');
    
    const { register, loading } = useAuth();

    const branches = [
        'Computer Science',
        'Information Technology',
        'Electronics and Communication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Chemical Engineering',
        'Biotechnology'
    ];

    const years = [1, 2, 3, 4];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.branch || !formData.year) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const result = await register(formData);
        if (!result.success) {
            setError(result.error || 'Registration failed');
        }
    };

    return (
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Register
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                    Join VIT Student Showcase Platform
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        autoComplete="email"
                    />
                    
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        autoComplete="new-password"
                    />

                    <TextField
                        fullWidth
                        select
                        label="Branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch} value={branch}>
                                {branch}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        select
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                Year {year}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>

                    <Box textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={onSwitchToLogin}
                                sx={{ cursor: 'pointer' }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Register;
