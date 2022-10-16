import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DashboardUploadFilePage';

export default defineMessages({
  alert: {
    success: {
      id: `${scope}.alert.success`,
    },
    error: {
      id: `${scope}.alert.error`,
    },
    selectedFiles: {
      id: `${scope}.selectedFiles`,
    },
  },
});
