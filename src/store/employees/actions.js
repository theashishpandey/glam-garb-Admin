import {
  SUBMIT_EMPLOYEE,
  SUBMIT_EMPLOYEE_SUCCESS,
  EMPLOYEES_API_ERROR,
  LOAD_EMPLOYEES,
  LOAD_EMPLOYEES_SUCCESS,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
} from "./actionTypes";

export const submitEmployee = (employee, history) => {
  return {
    type: SUBMIT_EMPLOYEE,
    payload: { employee, history },
  };
};

export const submitEmployeeSuccess = (employee) => {
  return {
    type: SUBMIT_EMPLOYEE_SUCCESS,
    payload: employee,
  };
};

export const loadEmployees = () => {
  return {
    type: LOAD_EMPLOYEES,
    payload: {},
  };
};

export const loadEmployeesSuccess = (employees) => {
  return {
    type: LOAD_EMPLOYEES_SUCCESS,
    payload: employees,
  };
};

export const updateEmployee = (employee, history) => {
  return {
    type: UPDATE_EMPLOYEE,
    payload: { employee, history },
  };
};

export const updateEmployeeSuccess = (employee) => {
  return {
    type: UPDATE_EMPLOYEE_SUCCESS,
    payload: employee,
  };
};

export const employeesApiError = (error) => {
  return {
    type: EMPLOYEES_API_ERROR,
    payload: error,
  };
};
