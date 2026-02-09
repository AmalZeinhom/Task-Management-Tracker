import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./Slices/userData.js";

export const store = configureStore({
  reducer: {
    // create reducer as an object because it may there more than one reducer (slice)
    user: userReduser //key: value
  }
});
