import React, { memo } from 'react';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import UploadIcon from '@mui/icons-material/Upload';
import HomeIcon from '@mui/icons-material/Home';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useHistory } from 'react-router-dom';
import messages from './messages';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import { makeSelectIsDrawerOpen } from './selectors';
import { closeDrawer, openDrawer } from './actions';
import { routes } from '../../utils/history';
import Breadcrumbs from '../../components/Breadcrumbs';

const key = 'dashboard';

function DashboardPage({
  onDrawerOpen,
  onDrawerClose,
  isDrawerOpen,
  children,
}) {
  useInjectReducer({ key, reducer });
  const history = useHistory();
  const onDrawerItemClick = route => {
    history.push(route);
    onDrawerClose();
  };

  return (
    <Box>
      <AppBar position="absolute">
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onDrawerOpen}
            sx={{
              marginRight: '36px',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
            <FormattedMessage {...messages.header} />
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={isDrawerOpen} onClose={onDrawerClose}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem button onClick={() => onDrawerItemClick(routes.home)}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.menu.home} />}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => onDrawerItemClick(routes.studyList)}
            >
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText
                primary=<FormattedMessage {...messages.menu.studies} />
              />
            </ListItem>
            <ListItem button onClick={() => onDrawerItemClick(routes.upload)}>
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText
                primary=<FormattedMessage {...messages.menu.upload} />
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Breadcrumbs />
        </Container>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

DashboardPage.propTypes = {
  children: PropTypes.element,
  onDrawerOpen: PropTypes.func.isRequired,
  onDrawerClose: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isDrawerOpen: makeSelectIsDrawerOpen(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onDrawerOpen: () => dispatch(openDrawer()),
    onDrawerClose: () => dispatch(closeDrawer()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardPage);
