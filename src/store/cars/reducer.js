import {
  SUBMIT_CAR,
  SUBMIT_CAR_SUCCESS,
  CARS_API_ERROR,
  LOAD_CARS,
  LOAD_CARS_SUCCESS,
  LOAD_CAR_MAKES,
  LOAD_CAR_MAKES_SUCCESS,
  SUBMIT_CAR_MAKE,
  SUBMIT_CAR_MAKE_SUCCESS,
  SUBMIT_CAR_MODEL,
  SUBMIT_CAR_MODEL_SUCCESS,
  SUBMIT_CAR_VARIANT,
  SUBMIT_CAR_VARIANT_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
};

const cars = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_CAR:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_CAR_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;
    case SUBMIT_CAR_MAKE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_CAR_MAKE_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;
    case SUBMIT_CAR_MODEL:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_CAR_MODEL_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;
    case SUBMIT_CAR_VARIANT:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_CAR_VARIANT_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;
    case LOAD_CARS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_CARS_SUCCESS:
      state = {
        ...state,
        loading: false,
        cars: action.payload.data,
      };
      break;

    case LOAD_CAR_MAKES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_CAR_MAKES_SUCCESS:
      state = {
        ...state,
        loading: false,
        car_makes: action.payload.data,
      };

      break;

    case CARS_API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        message: action.payload,
        message_type: "Error",
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default cars;
