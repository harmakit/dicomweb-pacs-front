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
  makeSelectToolsData,
} from './selectors';
import { loadInstanceObject, loadToolsData, updateToolsData } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import Instance from '../../service/dicom/parser/instance';
import { key } from './key';
import imageHelper from '../../service/dicom/wado/imageHelper';
import WADOImageViewer from '../../components/WADOImageViewer';
import DicomObjectInfo from '../../components/DicomObjectInfo';

export function DashboardInstancePage({
  instanceObject,
  toolsData,
  loading,
  errors,
  dispatchLoadInstanceObject,
  dispatchLoadToolsData,
  dispatchUpdateToolsData,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const { instanceId } = useParams();

  const wrongObjectLoaded =
    instanceObject &&
    instanceId !== instanceObject[Instance.getObjectIdField()];

  useEffect(() => {
    dispatchLoadInstanceObject(instanceId);
    dispatchLoadToolsData(instanceId);
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
        {instanceObject && <DicomObjectInfo object={instanceObject} />}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              {url && (
                <WADOImageViewer
                  urls={[url]}
                  toolsData={toolsData}
                  showSingleImageTools
                  onSave={data => dispatchUpdateToolsData(instanceId, data)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardInstancePage.propTypes = {
  instanceObject: PropTypes.instanceOf(Instance),
  toolsData: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchLoadInstanceObject: PropTypes.func.isRequired,
  dispatchLoadToolsData: PropTypes.func.isRequired,
  dispatchUpdateToolsData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  instanceObject: makeSelectInstanceObject(),
  toolsData: makeSelectToolsData(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadInstanceObject: instanceUID =>
      dispatch(loadInstanceObject(instanceUID)),
    dispatchLoadToolsData: instanceUID => dispatch(loadToolsData(instanceUID)),
    dispatchUpdateToolsData: (instanceUID, data) =>
      dispatch(updateToolsData(instanceUID, data)),
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
