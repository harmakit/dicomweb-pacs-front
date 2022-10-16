import React, { memo } from 'react';
import {
  Alert,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectFiles,
  makeSelectLoading,
  makeSelectResponse,
} from './selectors';
import { selectFiles, uploadObjects } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import { key } from './key';
import messages from './messages';

const Input = styled('input')({
  display: 'none',
});

export function DashboardUploadFilePage({
  loading,
  errors,
  dispatchUploadObjects,
  response,
  files,
  dispatchSelectFiles,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const handleFilesInputChange = e => {
    dispatchSelectFiles(Array.from(e.target.files));
  };

  const handleClickUpload = () => {
    Promise.all(files.map(file => file.arrayBuffer()))
      .then(buffers => {
        dispatchUploadObjects(buffers);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const inputId = uuidv4();
  const showUploadButton = files.length > 0;

  const showResult = !loading && response;

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
                  {files.map((file, i) => (
                    <ListItem key={file.name}>
                      <ListItemText primary={file.name} />
                      {showResult && (
                        <Alert severity={response[i] ? 'success' : 'error'}>
                          {response[i] ? (
                            <FormattedMessage {...messages.alert.success} />
                          ) : (
                            <FormattedMessage {...messages.alert.error} />
                          )}
                        </Alert>
                      )}
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

DashboardUploadFilePage.propTypes = {
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchUploadObjects: PropTypes.func.isRequired,
  response: PropTypes.arrayOf(Boolean),
  files: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  dispatchSelectFiles: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  response: makeSelectResponse(),
  files: makeSelectFiles(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchUploadObjects: arrayBuffers =>
      dispatch(uploadObjects(arrayBuffers)),
    dispatchSelectFiles: files => dispatch(selectFiles(files)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardUploadFilePage);
