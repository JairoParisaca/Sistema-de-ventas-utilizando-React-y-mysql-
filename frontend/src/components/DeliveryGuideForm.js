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
} from '@mui/material';
import { deliveryGuidesAPI } from '../services/api';

const DeliveryGuideForm = ({ guide, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    order_id: '',
    customer_name: '',
    address: '',
    status: 'pending',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guide) {
      setFormData({
        order_id: guide.order_id || '',
        customer_name: guide.customer_name || '',
        address: guide.address || '',
        status: guide.status || 'pending',
      });
    }
  }, [guide]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (guide) {
        await deliveryGuidesAPI.update(guide.id, formData);
      } else {
        await deliveryGuidesAPI.create(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving delivery guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {guide ? 'Edit Delivery Guide' : 'Create Delivery Guide'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Order ID"
          name="order_id"
          value={formData.order_id}
          onChange={handleChange}
          type="number"
          required
          fullWidth
        />

        <TextField
          label="Customer Name"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Delivery Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          multiline
          rows={3}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_transit">In Transit</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DeliveryGuideForm;
