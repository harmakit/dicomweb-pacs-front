import React, {memo} from 'react';
import {Button, Grid, List, ListItem, ListItemText, Paper, Typography,} from '@mui/material';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {styled} from '@mui/material/styles';
import {v4 as uuidv4} from 'uuid';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {makeSelectErrors, makeSelectLoading} from './selectors';
import {uploadObjects} from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import {key} from './key';

const Input = styled('input')({
  display: 'none',
});

export function DashboardViewImagesPage({
  loading,
  errors,
  dispatchUploadObjects,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [files, setFiles] = React.useState([]);

  const handleFilesInputChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleClickUpload = () => {
    dispatchUploadObjects(files);
  };

  const inputId = uuidv4();
  const showUploadButton = files.length > 0;

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}

        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <label htmlFor={inputId}>
              <Input
                id={inputId}
                accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
                multiple
                type="file"
                onChange={handleFilesInputChange}
              />
              <Button variant="contained" component="span">
                Select DICOM files
              </Button>
            </label>
          </Grid>
          {showUploadButton && (
            <Grid item xs={12}>
              <Paper sx={{ p: 1, overflow: 'auto', maxHeight: 200 }}>
                <Typography variant="h6">Selected files:</Typography>
                <List dense>
                  {files.map(file => (
                    <ListItem key={file.name}>
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
          {showUploadButton && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickUpload}
              >
                Upload
              </Button>
            </Grid>
          )}
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardViewImagesPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchUploadObjects: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchUploadObjects: options => dispatch(uploadObjects(options)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardViewImagesPage);
