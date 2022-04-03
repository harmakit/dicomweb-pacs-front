import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
export default history;
export const routes = {
  home: '/',
  studyList: '/studies',
  study: '/studies/:studyId/series',
  series: '/studies/:studyId/series/:seriesId/instances',
  instance: '/studies/:studyId/series/:seriesId/instances/:instanceId',
};
