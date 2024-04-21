import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import AuthReducer from "./authSlice";
import UserReducer from "./UserSlice";
import UserSaga from "./UserSaga";
const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    auth: AuthReducer,
    users: UserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(UserSaga);

export default store;
