import { LOGIN_SUCCESS, LOGOUT_SUCCESS, UPDATE_AVATAR } from "../constants";
const initialState = {
  user: {
    username: "",
    fullName: "",
    dateOfBirth: "",
    role: "",
    avatar: "",
  },
  token: "",
  isLoggedIn: false,
};

const authenticationReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      const { user, token } = payload;
      const { avatar } = user;
      return {
        ...state,
        isLoggedIn: true,
        token,
        user: { ...user, avatar: avatar.imageUrl },
      };
    case LOGOUT_SUCCESS:
      return {
        user: {
          username: "",
          fullName: "",
          dateOfBirth: "",
          role: "",
          avatar: "",
        },
        token: "",
        isLoggedIn: false,
      };
    case UPDATE_AVATAR:
      let newState = { ...state };
      newState.user.avatar = payload;
      return { ...state, ...newState };
    default:
      return state;
  }
};

export default authenticationReducer;
