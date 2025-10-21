import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { deliveryGuidesAPI } from '../services/api';

const DeliveryGuideForm = ({ guide, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    order_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
    postal_code: '',
    delivery_date: '',
    delivery_time: '',
    status: 'pending',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (guide) {
      setFormData({
        order_id: guide.order_id || '',
        customer_name: guide.customer_name || '',
        customer_email: guide.customer_email || '',
        customer_phone: guide.customer_phone || '',
        address: guide.address || '',
        city: guide.city || '',
        postal_code: guide.postal_code || '',
        delivery_date: guide.delivery_date || '',
        delivery_time: guide.delivery_time || '',
        status: guide.status || 'pending',
        notes: guide.notes || '',
      });
    } else {
      // Reset form for new guide
      setFormData({
        order_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        address: '',
        city: '',
        postal_code: '',
        delivery_date: '',
        delivery_time: '',
        status: 'pending',
        notes: '',
      });
    }
  }, [guide]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (guide) {
        await deliveryGuidesAPI.update(guide.id, formData);
      } else {
        await deliveryGuidesAPI.create(formData, selectedFile);
      }
      onSave();
    } catch (err) {
      console.error('Error saving delivery guide:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al guardar la guía de entrega');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {guide ? 'Editar Guía de Entrega' : 'Crear Nueva Guía de Entrega'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID del Pedido (Opcional)"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="in_transit">En Tránsito</MenuItem>
                <MenuItem value="delivered">Entregado</MenuItem>
                <MenuItem value="failed">Fallido</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre del Cliente"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono del Cliente"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Correo Electrónico"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              type="email"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Dirección de Entrega"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Entrega"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora de Entrega"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notas Adicionales"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">Foto del Recibo (Opcional)</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="receipt-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="receipt-file">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                  {selectedFile.name}
                </Typography>
              )}
            </Box>
            {filePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={filePreview}
                  alt="Vista previa del recibo"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DeliveryGuideForm;
