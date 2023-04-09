import {
  SUBMIT_SOURCE,
  SUBMIT_SOURCE_SUCCESS,
  SOURCES_API_ERROR,
  LOAD_SOURCES,
  LOAD_SOURCES_SUCCESS,
  LOAD_SOURCES_BY_TYPE,
  LOAD_SOURCES_BY_TYPE_SUCCESS,
} from "./actionTypes";

export const submitSource = (source, history) => {
  return {
    type: SUBMIT_SOURCE,
    payload: { source, history },
  };
};

export const submitSourceSuccess = (source) => {
  return {
    type: SUBMIT_SOURCE_SUCCESS,
    payload: source,
  };
};

export const loadSources = () => {
  return {
    type: LOAD_SOURCES,
    payload: {},
  };
};

export const loadSourcesSuccess = (sources) => {
  return {
    type: LOAD_SOURCES_SUCCESS,
    payload: sources,
  };
};

export const loadSourcesByType = (sourcetype) => {
  return {
    type: LOAD_SOURCES_BY_TYPE,
    payload: { sourcetype },
  };
};

export const loadSourcesByTypeSuccess = (sources_by_type) => {
  return {
    type: LOAD_SOURCES_BY_TYPE_SUCCESS,
    payload: sources_by_type,
  };
};

export const sourcesApiError = (error) => {
  return {
    type: SOURCES_API_ERROR,
    payload: error,
  };
};
