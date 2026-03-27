import Cookies from "js-cookie";

export const isAuthenticated = () => {
  return !!Cookies.get("access_token");
};

//! !! => Double dot is a common JavaScript idiom used to convert a value to a boolean.
