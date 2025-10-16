import { createStore } from 'redux';

// Initial state for the Redux store
const initialState = { auth: { isAuthenticated: false } };

// Basic reducer for now
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
