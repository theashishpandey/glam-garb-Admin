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

export const submitCar = (car, history) => {
  return {
    type: SUBMIT_CAR,
    payload: { car, history },
  };
};

export const submitCarSuccess = (car) => {
  return {
    type: SUBMIT_CAR_SUCCESS,
    payload: car,
  };
};

export const submitCarMake = (carmake, history) => {
  return {
    type: SUBMIT_CAR_MAKE,
    payload: { carmake, history },
  };
};

export const submitCarMakeSuccess = (carmake) => {
  return {
    type: SUBMIT_CAR_MAKE_SUCCESS,
    payload: carmake,
  };
};

export const submitCarModel = (carmodel, history) => {
  return {
    type: SUBMIT_CAR_MODEL,
    payload: { carmodel, history },
  };
};

export const submitCarModelSuccess = (carmodel) => {
  return {
    type: SUBMIT_CAR_MODEL_SUCCESS,
    payload: carmodel,
  };
};

export const submitCarVariant = (carvariant, history) => {
  return {
    type: SUBMIT_CAR_VARIANT,
    payload: { carvariant, history },
  };
};

export const submitCarVariantSuccess = (carvariant) => {
  return {
    type: SUBMIT_CAR_VARIANT_SUCCESS,
    payload: carvariant,
  };
};

export const loadCars = () => {
  return {
    type: LOAD_CARS,
    payload: {},
  };
};

export const loadCarsSuccess = (cars) => {
  return {
    type: LOAD_CARS_SUCCESS,
    payload: cars,
  };
};

export const loadCarMakes = () => {
  return {
    type: LOAD_CAR_MAKES,
    payload: {},
  };
};

export const loadCarMakesSuccess = (carmakes) => {
  return {
    type: LOAD_CAR_MAKES_SUCCESS,
    payload: carmakes,
  };
};

export const carsApiError = (error) => {
  return {
    type: CARS_API_ERROR,
    payload: error,
  };
};
