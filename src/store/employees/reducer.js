import {
  SUBMIT_EMPLOYEE,
  SUBMIT_EMPLOYEE_SUCCESS,
  EMPLOYEES_API_ERROR,
  LOAD_EMPLOYEES,
  LOAD_EMPLOYEES_SUCCESS,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
} from "./actionTypes";

const initialState = {
  employees: [],
  error: "",
  loading: false,
};

const employees = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_EMPLOYEE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_EMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_EMPLOYEES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_EMPLOYEES_SUCCESS:
      state = {
        ...state,
        loading: false,
        employees: action.payload.data,
      };
      break;

    case UPDATE_EMPLOYEE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UPDATE_EMPLOYEE_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case EMPLOYEES_API_ERROR:
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

export default employees;
