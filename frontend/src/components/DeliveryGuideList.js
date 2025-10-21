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
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Edit, Delete, Upload, Visibility, Phone, Email, LocationOn } from '@mui/icons-material';
import { deliveryGuidesAPI } from '../services/api';

const DeliveryGuideList = ({ onEdit, refreshTrigger }) => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, guide: null });
  const [uploadDialog, setUploadDialog] = useState({ open: false, guide: null });
  const [selectedFile, setSelectedFile] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await deliveryGuidesAPI.getAll();
      setGuides(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las guías de entrega');
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
      setError('Error al eliminar la guía de entrega');
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
      setError('Error al subir el comprobante');
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
      case 'pending': return 'Pendiente';
      case 'in_transit': return 'En Tránsito';
      case 'delivered': return 'Entregado';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  if (loading) return <Typography>Cargando guías de entrega...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Guías de Entrega
      </Typography>

      {isMobile ? (
        // Mobile view - Cards
        <Grid container spacing={2}>
          {guides.map((guide) => (
            <Grid item xs={12} key={guide.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">Guía #{guide.id}</Typography>
                    <Chip
                      label={getStatusLabel(guide.status)}
                      color={getStatusColor(guide.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {guide.customer_name}
                  </Typography>

                  {guide.customer_phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{guide.customer_phone}</Typography>
                    </Box>
                  )}

                  {guide.customer_email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{guide.customer_email}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, fontSize: 16, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2">{guide.address}</Typography>
                      {guide.city && <Typography variant="body2">{guide.city}, {guide.postal_code}</Typography>}
                    </Box>
                  </Box>

                  {(guide.delivery_date || guide.delivery_time) && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Entrega:</strong> {formatDate(guide.delivery_date)} {formatTime(guide.delivery_time)}
                    </Typography>
                  )}

                  {guide.notes && (
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      {guide.notes}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => onEdit(guide)}
                      variant="outlined"
                    >
                      Editar
                    </Button>

                    {guide.receipt_path ? (
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open(`http://localhost:5000/uploads/${guide.receipt_path}`, '_blank')}
                        variant="outlined"
                      >
                        Ver Comprobante
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<Upload />}
                        onClick={() => setUploadDialog({ open: true, guide })}
                        variant="outlined"
                      >
                        Subir Comprobante
                      </Button>
                    )}

                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialog({ open: true, guide })}
                      color="error"
                      variant="outlined"
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop view - Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Entrega</TableCell>
                <TableCell>Comprobante</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell>{guide.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {guide.customer_name}
                      </Typography>
                      {guide.customer_phone && (
                        <Typography variant="caption" color="text.secondary">
                          {guide.customer_phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{guide.address}</Typography>
                      {guide.city && (
                        <Typography variant="caption" color="text.secondary">
                          {guide.city}, {guide.postal_code}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(guide.status)}
                      color={getStatusColor(guide.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {guide.delivery_date && (
                      <Typography variant="body2">
                        {formatDate(guide.delivery_date)}
                      </Typography>
                    )}
                    {guide.delivery_time && (
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(guide.delivery_time)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {guide.receipt_path ? (
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open(`http://localhost:5000/uploads/${guide.receipt_path}`, '_blank')}
                      >
                        Ver
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<Upload />}
                        onClick={() => setUploadDialog({ open: true, guide })}
                      >
                        Subir
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
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, guide: null })}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar la guía de entrega de {deleteDialog.guide?.customer_name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, guide: null })}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Receipt Dialog */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ open: false, guide: null })}>
        <DialogTitle>Subir Comprobante</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Subir comprobante para {uploadDialog.guide?.customer_name}
          </Typography>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog({ open: false, guide: null })}>Cancelar</Button>
          <Button onClick={handleFileUpload} disabled={!selectedFile}>Subir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryGuideList;
