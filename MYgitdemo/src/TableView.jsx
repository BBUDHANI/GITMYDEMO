import React, { useState, useEffect } from 'react';
import {
  Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Chip, TextField, Box, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

function TableView() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('tableColumns');
    return savedColumns ? JSON.parse(savedColumns) : [];
  });

  const [newColumnName, setNewColumnName] = useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('tableColumns', JSON.stringify(columns));
  }, [columns]);

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;

    const newAccessor = newColumnName.toLowerCase().replace(/\s+/g, '_');
    if (columns.some(col => col.accessor === newAccessor)) {
      alert('Column already exists!');
      return;
    }

    const newCol = { header: newColumnName, accessor: newAccessor };
    const updatedColumns = [...columns, newCol];
    setColumns(updatedColumns);

    const updatedStudents = students.map(s => ({ ...s, [newAccessor]: '' }));
    setStudents(updatedStudents);
    setNewColumnName('');
  };

  const handleEdit = (index) => {
    setEditRowIndex(index);
    setEditValues({ ...students[index] });
  };

  const handleChange = (accessor, value) => {
    setEditValues(prev => ({ ...prev, [accessor]: value }));
  };

  const handleSave = () => {
    const updated = [...students];
    updated[editRowIndex] = editValues;
    setStudents(updated);
    setEditRowIndex(null);
    setEditValues({});
  };

  const handleDelete = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  const handleSaveAll = () => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('tableColumns', JSON.stringify(columns));
    alert('Table content saved successfully!');
  };

  const handleExportToNotepad = () => {
    if (columns.length === 0 || students.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = columns.map(col => col.header).join('\t');
    const rows = students.map(student =>
      columns.map(col => student[col.accessor] || '').join('\t')
    );
    const tableText = [headers, ...rows].join('\n');

    const blob = new Blob([tableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_table_data.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Box display="flex" gap={2} my={2}>
        <TextField
          label="New Column Name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <Button type="button" variant="contained" onClick={handleAddColumn}>
          Add Column
        </Button>
        <Button type="button" variant="outlined" onClick={handleSaveAll}>
          Save All
        </Button>
        <Button type="button" variant="outlined" onClick={handleExportToNotepad}>
          View Saved Table
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col.header}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                {columns.map((col, idx) => (
                  <TableCell key={idx}>
                    {editRowIndex === index ? (
                      <TextField
                        value={editValues[col.accessor] || ''}
                        onChange={(e) => handleChange(col.accessor, e.target.value)}
                      />
                    ) : (
                      <Chip label={student[col.accessor]} />
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editRowIndex === index ? (
                    <>
                      <IconButton type="button" onClick={handleSave}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton type="button" onClick={() => setEditRowIndex(null)}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton type="button" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton type="button" onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TableView;