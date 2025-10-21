import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import { Edit, Delete, Upload, Visibility } from '@mui/icons-material';
import { deliveryGuidesAPI } from '../services/api';

const DeliveryGuideList = ({ onEdit, refreshTrigger }) => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, guide: null });
  const [uploadDialog, setUploadDialog] = useState({ open: false, guide: null });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await deliveryGuidesAPI.getAll();
      setGuides(response.data);
      setError('');
    } catch (err) {
      setError('Error loading delivery guides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    try {
      await deliveryGuidesAPI.delete(deleteDialog.guide.id);
      setDeleteDialog({ open: false, guide: null });
      fetchGuides();
    } catch (err) {
      setError('Error deleting delivery guide');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      await deliveryGuidesAPI.uploadReceipt(uploadDialog.guide.id, selectedFile);
      setUploadDialog({ open: false, guide: null });
      setSelectedFile(null);
      fetchGuides();
    } catch (err) {
      setError('Error uploading receipt');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_transit': return 'info';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Delivery Guides
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Receipt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>{guide.id}</TableCell>
                <TableCell>{guide.order_id || 'N/A'}</TableCell>
                <TableCell>{guide.customer_name}</TableCell>
                <TableCell>{guide.address}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(guide.status)}
                    color={getStatusColor(guide.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {guide.receipt_path ? (
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => window.open(`http://localhost:5000/uploads/${guide.receipt_path}`, '_blank')}
                    >
                      View
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<Upload />}
                      onClick={() => setUploadDialog({ open: true, guide })}
                    >
                      Upload
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(guide)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setDeleteDialog({ open: true, guide })} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, guide: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the delivery guide for {deleteDialog.guide?.customer_name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, guide: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Receipt Dialog */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ open: false, guide: null })}>
        <DialogTitle>Upload Receipt</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Upload receipt for {uploadDialog.guide?.customer_name}
          </Typography>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog({ open: false, guide: null })}>Cancel</Button>
          <Button onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryGuideList;
