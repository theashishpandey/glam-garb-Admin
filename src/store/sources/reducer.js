import {
  SUBMIT_SOURCE,
  SUBMIT_SOURCE_SUCCESS,
  SOURCES_API_ERROR,
  LOAD_SOURCES,
  LOAD_SOURCES_SUCCESS,
  LOAD_SOURCES_BY_TYPE,
  LOAD_SOURCES_BY_TYPE_SUCCESS,
} from "./actionTypes";

const initialState = {
  sources: [],
  error: "",
  loading: false,
};

const sources = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_SOURCE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_SOURCE_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_SOURCES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_SOURCES_SUCCESS:
      state = {
        ...state,
        loading: false,
        sources: action.payload.data,
      };
      break;

    case LOAD_SOURCES_BY_TYPE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_SOURCES_BY_TYPE_SUCCESS:
      state = {
        ...state,
        loading: false,
        sources_by_type: action.payload.data,
      };
      break;

    case SOURCES_API_ERROR:
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

export default sources;
