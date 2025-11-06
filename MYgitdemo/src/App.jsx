
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton, ListItemText
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentApplicationView from './StudentApplicationView';
import TableView from './TableView';

const drawerWidth = 240;

function App() {
  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState([
    { header: 'Student ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Courses', accessor: 'courses' }
  ]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedColumns = localStorage.getItem('tableColumns');

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('tableColumns', JSON.stringify(columns));
  }, [columns]);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <List>
            <ListItemButton component={Link} to="/">
              <ListItemText primary="Student Application View" />
            </ListItemButton>
            <ListItemButton component={Link} to="/table">
              <ListItemText primary="Table View" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar position="fixed" sx={{ zIndex: 1201 }}>
            <Toolbar>
              <Typography variant="h6">Student Management</Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Routes>
            <Route
              path="/"
              element={
                <StudentApplicationView
                  students={students}
                  setStudents={setStudents}
                  columns={columns}
                  setColumns={setColumns}
                />
              }
            />
            <Route
              path="/table"
              element={
                <TableView
                  students={students}
                  setStudents={setStudents}
                  columns={columns}
                  setColumns={setColumns}
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;