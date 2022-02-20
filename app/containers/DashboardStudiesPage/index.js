import React, { memo } from 'react';
import { Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectLoading,
  makeSelectStudies,
  makeSelectStudiesTotalCount,
} from './selectors';
import { loadStudies, loadTotalStudiesCount } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Study from '../../utils/dicom/parser/study';

const key = 'dashboardStudies';

export function DashboardStudiesPage({
  loading,
  errors,
  studies,
  totalCountLoading,
  dispatchLoadStudies,
  dispatchLoadTotalStudiesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const onStudyClick = studyUID => {
    console.log(studyUID);
  };

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              <ObjectsTable
                injectSaga={{ key, saga }}
                objectType={Study}
                objects={studies}
                objectsCount={totalCountLoading}
                dispatchLoadObjects={dispatchLoadStudies}
                dispatchLoadTotalObjectsCount={dispatchLoadTotalStudiesCount}
                onObjectClick={onStudyClick}
              />
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardStudiesPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  studies: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  totalCountLoading: PropTypes.number.isRequired,
  dispatchLoadStudies: PropTypes.func.isRequired,
  dispatchLoadTotalStudiesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  studies: makeSelectStudies(),
  totalCountLoading: makeSelectStudiesTotalCount(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadStudies: options => dispatch(loadStudies(options)),
    dispatchLoadTotalStudiesCount: options =>
      dispatch(loadTotalStudiesCount(options)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardStudiesPage);
