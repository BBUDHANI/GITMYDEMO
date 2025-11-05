import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Autocomplete, Checkbox } from '@mui/material';

function StudentApplicationView({ students, setStudents, columns, setColumns }) {
  const [formData, setFormData] = useState({ id: '', name: '', courses: [] });
  const [coursesList, setCoursesList] = useState(['React', 'Java', 'Python', 'Spring Boot', 'Node.js', 'DBMS']);

  const handleAddStudent = () => {
    if (!formData.id || !formData.name) return alert('ID and Name are required!');

    // Detect new keys and add them as columns
    Object.keys(formData).forEach(key => {
      if (!columns.some(col => col.accessor === key)) {
        setColumns(prev => [...prev, { header: key.charAt(0).toUpperCase() + key.slice(1), accessor: key }]);
      }
    });

    setStudents([...students, formData]);
    setFormData({ id: '', name: '', courses: [] });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Add New Student</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <TextField label="Student ID" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} />
        <TextField label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <Autocomplete
          multiple
          freeSolo
          options={coursesList}
          disableCloseOnSelect
          value={formData.courses}
          onChange={(e, newValue) => {
            const lastValue = newValue[newValue.length - 1];
            if (lastValue && !coursesList.includes(lastValue)) {
              setCoursesList([...coursesList, lastValue]);
            }
            setFormData({ ...formData, courses: newValue });
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}><Checkbox checked={selected} sx={{ mr: 1 }} />{option}</li>
          )}
          renderInput={(params) => <TextField {...params} label="Courses" placeholder="Select or type courses" />}
        />
        <Button variant="contained" onClick={handleAddStudent}>Add Student</Button>
      </Box>
    </Container>
  );
}

export default StudentApplicationView;
















