import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Chip,
    Box,
    Typography,
    Alert
} from '@mui/material';
import { projectsAPI } from '../../services/api';

const CreateProject = ({ open, onClose, onProjectCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: [],
        category: '',
        githubUrl: '',
        liveUrl: ''
    });
    const [techInput, setTechInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        'Web Development',
        'Mobile App',
        'AI/ML',
        'Data Science',
        'Game Development',
        'IoT',
        'Blockchain',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddTech = (e) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!formData.technologies.includes(techInput.trim())) {
                setFormData({
                    ...formData,
                    technologies: [...formData.technologies, techInput.trim()]
                });
            }
            setTechInput('');
        }
    };

    const handleRemoveTech = (techToRemove) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter(tech => tech !== techToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await projectsAPI.createProject(formData);
            onProjectCreated(response.data.project);
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                technologies: [],
                category: '',
                githubUrl: '',
                liveUrl: ''
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Project Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />

                <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    margin="normal"
                    required
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    label="Add Technologies (Press Enter)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={handleAddTech}
                    margin="normal"
                    helperText="Type a technology and press Enter to add"
                />

                <Box sx={{ mt: 1, mb: 2 }}>
                    {formData.technologies.map((tech) => (
                        <Chip
                            key={tech}
                            label={tech}
                            onDelete={() => handleRemoveTech(tech)}
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))}
                </Box>

                <TextField
                    fullWidth
                    label="GitHub URL (Optional)"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Live Demo URL (Optional)"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={loading || !formData.title || !formData.description || !formData.category}
                >
                    {loading ? 'Creating...' : 'Create Project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateProject;
