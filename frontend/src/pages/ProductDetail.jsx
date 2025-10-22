import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const ProductDetail = () => {
    const { id } = useParams();
    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4">Detalle del Perfume</Typography>
            <Typography variant="h6">Mostrando el detalle del producto con ID: {id}</Typography>
        </Container>
    );
};
//aloh
export default ProductDetail;