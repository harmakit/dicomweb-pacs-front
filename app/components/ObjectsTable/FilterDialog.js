import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

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
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={
            <FormattedMessage
              {...messages.FilterDialog.filterBy}
              values={{ columnLabel }}
            />
          }
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <FormattedMessage {...messages.FilterDialog.cancel} />
        </Button>
        <Button onClick={handleSave}>
          <FormattedMessage {...messages.FilterDialog.save} />
        </Button>
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
