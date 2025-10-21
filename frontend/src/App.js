import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';
import { Add } from '@mui/icons-material';
import DeliveryGuideList from './components/DeliveryGuideList';
import DeliveryGuideForm from './components/DeliveryGuideForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingGuide, setEditingGuide] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewGuide = () => {
    setEditingGuide(null);
    setCurrentView('form');
  };

  const handleEditGuide = (guide) => {
    setEditingGuide(guide);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSave = () => {
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingGuide(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Entregas
          </Typography>
          {currentView === 'list' && (
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={handleNewGuide}
            >
              Nueva Guía
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentView === 'list' ? (
          <DeliveryGuideList
            onEdit={handleEditGuide}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <DeliveryGuideForm
            guide={editingGuide}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
