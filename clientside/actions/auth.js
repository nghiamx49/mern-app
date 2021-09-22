import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../costants/";

export const loginSuccess = (payload) => {
  return { type: LOGIN_SUCCESS, payload: payload };
};

export const logout = () => {
  return { type: LOGOUT_SUCCESS };
};
