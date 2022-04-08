import React, { memo, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectInstanceObject,
  makeSelectLoading,
} from './selectors';
import { loadInstanceObject } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import Instance from '../../utils/dicom/parser/instance';
import { key } from './key';
import imageHelper from '../../utils/dicom/wado/imageHelper';
import WADOImageViewer from '../../components/WADOImageViewer';

export function DashboardInstancePage({
  instanceObject,
  loading,
  errors,
  dispatchLoadInstanceObject,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const { instanceId } = useParams();

  const wrongObjectLoaded =
    instanceObject &&
    instanceId !== instanceObject[Instance.getObjectIdField()];

  useEffect(() => {
    dispatchLoadInstanceObject(instanceId);
  }, [instanceId]);

  if (wrongObjectLoaded) {
    return null;
  }

  const url = instanceObject ? imageHelper.buildImageUrl(instanceObject) : null;

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              {url && <WADOImageViewer urls={[url]} />}
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardInstancePage.propTypes = {
  instanceObject: PropTypes.instanceOf(Instance),
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchLoadInstanceObject: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  instanceObject: makeSelectInstanceObject(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadInstanceObject: instanceUID =>
      dispatch(loadInstanceObject(instanceUID)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardInstancePage);
