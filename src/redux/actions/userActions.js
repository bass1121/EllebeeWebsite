import { SET_ERROR, SET_USER, CLEAR_ERROR, CLEAR_USER } from "../types";

export const clearError = () => dispatch => {
  dispatch({ type: CLEAR_ERROR });
};

export const logoutUser = () => dispatch => {
  dispatch({ type: CLEAR_USER });

  localStorage.removeItem("AuthToken");
};

export const loginUser = credentials => dispatch => {
  fetch("http://localhost:5000/api/users", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async res => {
      if (!res.ok) {
        // check if error exists
        const result = await res.json(); // gain access to error message

        throw new Error(result.message);
      }

      return res.json();
    })
    .then(data => {
      dispatch({ type: SET_USER, payload: data.user });

      setAuthHeader(data.token);
    })
    .catch(error => {
      dispatch({ type: SET_ERROR, payload: error.message });
    });
};

export const signupUser = credentials => dispatch => {
  if (credentials.password !== credentials.confirmPassword) {
    dispatch({ type: SET_ERROR, payload: "Passwords must match" });
    return;
  }

  fetch("http://localhost:5000/api/users", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async res => {
      if (!res.ok) {
        // check if error exists
        const result = await res.json(); // gain access to error message

        throw new Error(result.message);
      }

      return res.json();
    })
    .then(data => {
      dispatch({ type: SET_USER, payload: data.savedUser });

      setAuthHeader(data.token);
    })
    .catch(error => {
      dispatch({ type: SET_ERROR, payload: error.message });
    });
};

const setAuthHeader = token => {
  const AuthToken = `Bearer ${token}`;
  localStorage.setItem("AuthToken", AuthToken);
};
