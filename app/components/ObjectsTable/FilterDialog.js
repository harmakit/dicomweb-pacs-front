import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';

export default function FilterDialog({ open, column, onClose, onSave, value }) {
  const columnLabel = column?.label;
  const [filterValue, setFilterValue] = React.useState(value);

  useEffect(() => {
    setFilterValue(value);
  }, [value]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(filterValue);
    handleClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`Filter ${columnLabel} by:`}
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  column: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  value: PropTypes.string,
};
