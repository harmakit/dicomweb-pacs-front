import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DashboardPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
  },
  menu: {
    home: {
      id: `${scope}.menu.home`,
    },
    studies: {
      id: `${scope}.menu.studies`,
    },
  },
});
