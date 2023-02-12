import React, { memo, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import { loadSummaryData } from './actions';
import {
  makeSelectErrors,
  makeSelectLoading,
  makeSelectSummaryData,
} from './selectors';
import { useInjectSaga } from '../../utils/injectSaga';
import saga from './saga';
import ErrorAlert from '../../components/ErrorAlert';
import { key } from './key';
import Backdrop from '../../components/Backdrop';
import messages from './messages';

function DashboardHomePage({
  summaryData,
  loading,
  errors,
  dispatchLoadSummaryData,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    dispatchLoadSummaryData();
  }, []);

  let disableCharts = false;

  const dicomObjectsData = [];
  if (
    summaryData.studyCount &&
    summaryData.seriesCount &&
    summaryData.instanceCount
  ) {
    dicomObjectsData.push(summaryData.studyCount);
    dicomObjectsData.push(summaryData.seriesCount);
    dicomObjectsData.push(summaryData.instanceCount);
  } else {
    dicomObjectsData.push(1);
    dicomObjectsData.push(1);
    dicomObjectsData.push(1);
    disableCharts = true;
  }

  const modalitiesLabels = [];
  const modalitiesData = [];
  if (summaryData.modalitiesCounts) {
    summaryData.modalitiesCounts.forEach(modalityCount => {
      modalitiesLabels.push(modalityCount.modality);
      modalitiesData.push(modalityCount.count);
    });
  } else {
    modalitiesLabels.push('No data');
    modalitiesData.push(1);
    disableCharts = true;
  }

  return (
    <React.Fragment>
      <Backdrop
        loading={loading}
        style={{ position: 'initial', width: '100%', display: 'contents' }}
      >
        <Grid container textAlign="center" sx={{ minWidth: '100%' }}>
          {errors.map(error => (
            <ErrorAlert key={error.id} error={error} />
          ))}
          <Grid
            item
            container
            sx={{
              minWidth: '100%',
              display: 'flex',
              opacity: disableCharts ? 0.2 : 1,
            }}
            justifyContent="space-between"
          >
            <Grid item xs={5}>
              <Paper
                sx={{
                  p: 3,
                  width: '100%',
                }}
              >
                <FormattedMessage {...messages.dicomObjects} />
                <Doughnut
                  data={{
                    labels: ['Study', 'Series', 'Instance'],
                    datasets: [
                      {
                        data: dicomObjectsData,
                        backgroundColor: [
                          'rgb(255, 99, 132)',
                          'rgb(54, 162, 235)',
                          'rgb(255, 205, 86)',
                        ],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
              </Paper>
            </Grid>
            <Grid container item xs={6}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, width: '100%' }}>
                  <FormattedMessage {...messages.patientsCount} />
                  <div style={{ fontSize: 50 }}>
                    {summaryData.patientsCount}
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, width: '100%' }}>
                  <FormattedMessage {...messages.modalities} />
                  <Bar
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    data={{
                      labels: modalitiesLabels,
                      datasets: [
                        {
                          data: modalitiesData,
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)',
                          ],
                          borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Backdrop>

      <Paper
        sx={{
          marginTop: 'calc(10% + 60px)',
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '100%',
        }}
        component="footer"
      >
        <Box sx={{ justifyContent: 'center', display: 'flex', mb: 1, mt: 1 }}>
          <Typography variant="caption" color="initial">
            {'{ '}
            made with ❤️ by harmakit;{' '}
            <a target="_blank" href="https://github.com/harmakit/dicomweb-pacs">
              github
            </a>
            {' }'}
          </Typography>
        </Box>
      </Paper>
    </React.Fragment>
  );
}

DashboardHomePage.propTypes = {
  summaryData: PropTypes.object,
  loading: PropTypes.bool,
  errors: PropTypes.array,
  dispatchLoadSummaryData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  summaryData: makeSelectSummaryData(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadSummaryData: () => dispatch(loadSummaryData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardHomePage);
