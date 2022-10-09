import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export default history;
export const routes = {
  home: '/',
  upload: '/upload',
  studyList: '/studies',
  seriesList: '/studies/:studyId/series',
  instanceList: '/studies/:studyId/series/:seriesId/instances',
  instance: '/studies/:studyId/series/:seriesId/instances/:instanceId',
  viewImages:
    '/view/(study)?/:studyId?/(series)?/:seriesId?/(instance)?/:instanceId?',
};
