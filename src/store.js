import { createStore } from 'redux';

const initialState = {
  battles: [],
};

function battleReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_BATTLE':
      return {
        ...state,
        battles: [...state.battles, action.payload],
      };
    default:
      return state;
  }
}

const store = createStore(battleReducer);

export default store;
