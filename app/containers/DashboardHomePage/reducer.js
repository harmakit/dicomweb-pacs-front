import produce from 'immer';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  // eslint-disable-next-line no-unused-vars
  produce(state, draft => {
    // eslint-disable-next-line no-empty
    switch (action.type) {
    }
  });

export default reducer;
