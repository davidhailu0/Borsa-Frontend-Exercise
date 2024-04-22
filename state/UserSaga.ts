import { call, put, takeEvery } from "redux-saga/effects";
import { fetchUsersSuccess } from "./UserSlice";
import User from "../interfaces/User";

export const GET_USERS = "GET_USERS";

function fetchUser(page: number): any {
  return fetch(
    process.env.EXPO_PUBLIC_API_URL + `/fetch/dummy/user-v2?page=${page}`
  )
    .then((resp: Response) =>
      resp.json().then((js: { count: number; data: User[] }) => js["data"])
    )
    .catch(() => fetchUser(page));
}

function* fetchUsersWorker(action: {
  type: string;
  payload: number;
}): Generator {
  const users = yield call(fetchUser, action.payload);
  yield put(fetchUsersSuccess(users as User[]));
}

export default function* fetchUserSaga() {
  yield takeEvery(GET_USERS, fetchUsersWorker);
}
