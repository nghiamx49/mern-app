import { LOGIN_SUCCESS, LOGOUT_SUCCESS, UPDATE_AVATAR } from "../costants/";

export const loginSuccess = (payload) => {
  return { type: LOGIN_SUCCESS, payload: payload };
};

export const logout = () => {
  return { type: LOGOUT_SUCCESS };
};

export const updateAvt = (payload) => {
  return { type: UPDATE_AVATAR, payload: payload };
};
