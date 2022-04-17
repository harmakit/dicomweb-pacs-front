import { initialState } from './reducer';

const selectDashboard = state => state.dashboard || initialState;

export { selectDashboard };
