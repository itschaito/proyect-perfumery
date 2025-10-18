import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4, p: 3, textAlign: 'center' }}>
            <Typography variant="h1" component="h1" gutterBottom color="error">
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Página no encontrada.
            </Typography>
            <Box mt={3}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/"
                >
                    Ir a Inicio
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;