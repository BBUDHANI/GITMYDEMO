import React, { useState, useEffect } from 'react';
import {
  Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Chip, TextField, Box, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function TableView({ students, setStudents, columns, setColumns }) {
  const [rows, setRows] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    setRows(students);
  }, [students]);

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
    localStorage.setItem('tableColumns', JSON.stringify(updatedColumns));

    const updatedRows = rows.map(r => ({ ...r, [newAccessor]: '' }));
    setRows(updatedRows);
    setStudents(updatedRows);
    setNewColumnName('');
  };

  const handleEdit = i => {
    setEditRowIndex(i);
    setEditValues({ ...rows[i] });
  };

  const handleChange = (accessor, value) => {
    setEditValues(prev => ({ ...prev, [accessor]: value }));
  };

  const handleSave = () => {
    const updated = [...rows];
    updated[editRowIndex] = editValues;
    setRows(updated);
    setStudents(updated);
    setEditRowIndex(null);
    setEditValues({});
  };

 
  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField label="New Column Name" value={newColumnName} onChange={e => setNewColumnName(e.target.value)} size="small" />
        <Button variant="contained" onClick={handleAddColumn}>Add Column</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>{col.header}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {editRowIndex === rowIndex ? (
                      Array.isArray(editValues[col.accessor]) ? (
                        <TextField
                          value={editValues[col.accessor]?.join(', ') || ''}
                          onChange={e =>
                            handleChange(
                              col.accessor,
                              e.target.value.split(',').map(item => item.trim())
                            )
                          }
                          size="small"
                        />
                      ) : (
                        <TextField
                          value={editValues[col.accessor] ?? ''}
                          onChange={e => handleChange(col.accessor, e.target.value)}
                          size="small"
                        />
                      )
                    ) : Array.isArray(row[col.accessor]) ? (
                      row[col.accessor].map((item, i) => (
                        <Chip key={i} label={item} sx={{ mr: 0.5 }} />
                      ))
                    ) : (
                      row[col.accessor] ?? ''
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editRowIndex === rowIndex ? (
                    <>
                      <IconButton color="primary" onClick={handleSave}><SaveIcon /></IconButton>
                      <IconButton color="error" onClick={() => setEditRowIndex(null)}><CancelIcon /></IconButton>
                    </>
                  ) : (
                    <IconButton color="secondary" onClick={() => handleEdit(rowIndex)}><EditIcon /></IconButton>
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


























