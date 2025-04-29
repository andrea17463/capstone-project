// frontend/src/store/user-connections.js
// Action Types
const SET_CONNECTIONS = 'SET_CONNECTIONS';
const ADD_CONNECTION = 'ADD_CONNECTION';
const UPDATE_CONNECTION = 'UPDATE_CONNECTION';
const DELETE_CONNECTION = 'DELETE_CONNECTION';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Action Creators
export const setConnections = (connections) => ({
    type: SET_CONNECTIONS,
    payload: connections,
});

export const addConnection = (connection) => ({
    type: ADD_CONNECTION,
    payload: connection,
});

export const updateConnection = (connection) => ({
    type: UPDATE_CONNECTION,
    payload: connection,
});

export const deleteConnection = (id) => ({
    type: DELETE_CONNECTION,
    payload: id,
});

export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

// // Thunk Action Creators
// export const fetchAllSpots = () => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await fetch('/api/spots');
//     if (!response.ok) {
//       throw new Error('Failed to fetch spots');
//     }
//     const spotsdata = await response.json();
//     // console.log("Fetched spots:", spotsdata);

//     if (!Array.isArray(spotsdata.Spots)) {
//       throw new Error('Invalid data received for spots');
//     }

//     dispatch(setSpots(spotsdata.Spots));
//   } catch (error) {
//     console.error(error);
//     dispatch(setError(error.message));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const fetchSpotById = (id) => async (dispatch) => {
// //   console.log('fetchSpotById called with id:', id);
// //   console.log('Call stack:', new Error().stack);

//   if (!id) return;
//   dispatch(setLoading(true));
//   try {
//     const response = await fetch(`/api/spots/${id}`);
//     if (response.ok) {
//       const spotdata = await response.json();
//       console.log('SPOT DATA:', spotdata);
//       dispatch(setSpots({spotdata}));
//     } else {
//       dispatch(setError('Spot not found'));
//     }
//   } catch (error) {
//     dispatch(setError('Error fetching spot by ID'));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// const initialState = {
//   spots: [],
//   loading: false,
//   error: null,
// };

// // Reducer
// const spotsReducer = (state = initialState, action) => {
//   let spotsData;
//   switch (action.type) {

//     case SET_SPOTS:
//     //   console.log('SET_SPOTS action received with payload:', action.payload);
//     //   console.log('Payload type:', typeof action.payload);
//     //   console.log('Is Array?', Array.isArray(action.payload));
//       spotsData = Array.isArray(action.payload)
//         ? action.payload
//         : [action.payload];
//       return { ...state, spots: spotsData, error: null };

//     case ADD_SPOT:
//       return { ...state, spots: [...state.spots, action.payload] };

//     case UPDATE_SPOT:
//       return {
//         ...state,
//         spots: state.spots.map(spot =>
//           spot.id === action.payload.id ? action.payload : spot
//         ),
//       };

//     case DELETE_SPOT:
//       return {
//         ...state,
//         spots: state.spots.filter(spot => spot.id !== action.payload),
//       };

//     case SET_LOADING:
//       return { ...state, loading: action.payload };

//     case SET_ERROR:
//       return { ...state, error: action.payload };

//     default:
//       return state;
//   }
// };

// export default spotsReducer;

export default userConnectionsReducer;