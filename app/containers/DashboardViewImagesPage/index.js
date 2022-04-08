import React, { memo, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectInstances,
  makeSelectLoading,
} from './selectors';
import { loadInstances } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import Instance from '../../utils/dicom/parser/instance';
import { key } from './key';
import imageHelper from '../../utils/dicom/wado/imageHelper';
import WADOImageViewer from '../../components/WADOImageViewer';
import Study from '../../utils/dicom/parser/study';
import Series from '../../utils/dicom/parser/series';

export function DashboardViewImagesPage({
  instances,
  loading,
  errors,
  dispatchLoadInstances,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const { studyId, seriesId, instanceId } = useParams();

  useEffect(() => {
    const loadInstancesPayload = { queryParams: {} };
    if (studyId) {
      loadInstancesPayload.queryParams[
        Study.getFieldAttribute(Study.getObjectIdField())
      ] = studyId;
    }
    if (seriesId) {
      loadInstancesPayload.queryParams[
        Series.getFieldAttribute(Series.getObjectIdField())
      ] = seriesId;
    }
    if (instanceId) {
      loadInstancesPayload.queryParams[
        Instance.getFieldAttribute(Instance.getObjectIdField())
      ] = instanceId;
    }
    if (Object.keys(loadInstancesPayload.queryParams).length > 0) {
      dispatchLoadInstances(loadInstancesPayload);
    }
  }, [instanceId, studyId, seriesId]);

  const viewers = [];
  const instancesSeriesIds = [
    ...new Set(instances.map(instance => instance[Series.getObjectIdField()])),
  ];

  instancesSeriesIds.forEach(instancesSeriesId => {
    const seriesInstances = instances.filter(
      instance => instance[Series.getObjectIdField()] === instancesSeriesId,
    );
    const urls = seriesInstances.map(instance =>
      imageHelper.buildImageUrl(instance),
    );
    viewers.push({
      key: instancesSeriesId,
      header: `Series ${instancesSeriesId}`,
      viewer: <WADOImageViewer urls={urls} />,
    });
  });

  const singleViewer = viewers.length === 1;

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}

        <Grid container spacing={3}>
          {viewers.map(viewer => (
            <Grid item xs={12} key={viewer.key}>
              <Paper sx={{ mt: 2 }}>
                <Accordion expanded={singleViewer || undefined}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" component="h6">
                      {viewer.header}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{viewer.viewer}</AccordionDetails>
                </Accordion>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardViewImagesPage.propTypes = {
  instances: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchLoadInstances: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  instances: makeSelectInstances(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadInstances: options => dispatch(loadInstances(options)),
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
