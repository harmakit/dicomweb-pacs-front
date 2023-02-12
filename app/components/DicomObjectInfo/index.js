import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import { generatePath } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { routes } from '../../utils/history';
import Study from '../../services/dicom/parser/study';
import Series from '../../services/dicom/parser/series';
import Instance from '../../services/dicom/parser/instance';
import DicomObjectWithIdAbstract from '../../services/dicom/parser/objectWithId';
import messages from './messages';

export default function DicomObjectInfo({ object }) {
  const [expanded, setExpanded] = React.useState(false);
  const [viewPath, setViewPath] = React.useState('');

  useEffect(() => {
    if (object) {
      const params = {};
      switch (object.constructor) {
        case Study:
          params[0] = 'study';
          params.studyId = object[Study.getObjectIdField()];
          break;
        case Series:
          params[0] = 'study';
          params.studyId = object[Study.getObjectIdField()];
          params[1] = 'series';
          params.seriesId = object[Series.getObjectIdField()];
          break;
        case Instance:
          params[0] = 'study';
          params.studyId = object[Study.getObjectIdField()];
          params[1] = 'series';
          params.seriesId = object[Series.getObjectIdField()];
          params[2] = 'instance';
          params.instanceId = object[Instance.getObjectIdField()];
          break;
        default:
          break;
      }
      const path = generatePath(routes.viewImages, params);
      setViewPath(path);
    }
  }, [object]);

  const handleAccordionToggle = () => {
    setExpanded(!expanded);
  };

  const handlePreviewClick = e => {
    e.preventDefault();
    e.stopPropagation();
    window.open(viewPath, '_blank');
  };

  const getObjectName = () => {
    switch (object.constructor) {
      case Study:
        return 'Study';
      case Series:
        return 'Series';
      case Instance:
        return 'Instance';
      default:
        return '';
    }
  };

  const shouldShowPreviewButton = object.constructor !== Instance;

  return (
    <Accordion expanded={expanded} onChange={handleAccordionToggle}>
      <AccordionSummary>
        <Grid container justifyContent="space-between">
          <Grid xs={10} item>
            <Typography variant="h6" component="h6">
              {getObjectName()}{' '}
              <span style={{ color: 'grey' }}>
                ({object[object.constructor.getObjectIdField()]})
              </span>
            </Typography>
          </Grid>
          <Grid item xs={2} container justifyContent="flex-end">
            {shouldShowPreviewButton && (
              <Grid item>
                <Tooltip title={<FormattedMessage {...messages.viewImage} />}>
                  <IconButton onClick={handlePreviewClick}>
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid>
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />
        {Object.keys(object).map(key => (
          <Typography key={key} variant="body2" component="p">
            {key}: {object[key]}
          </Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

DicomObjectInfo.propTypes = {
  object: PropTypes.instanceOf(DicomObjectWithIdAbstract).isRequired,
};
