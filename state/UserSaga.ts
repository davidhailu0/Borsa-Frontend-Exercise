import { call, put, takeLatest } from "redux-saga/effects";

const GET_USERS = "GET_USERS";
const GET_USERS_FETCH = "GET_USERS_FETCH";
function fetchUser(page: number) {
  return fetch(
    process.env.EXPO_PUBLIC_API_URL + `/fetch/dummy/user-v2?page=${page}`
  ).then((resp) => resp.json().then((js) => js["data"]));
}

function* fetchUsersWorker(): Generator {
  let page = 1;
  const users = yield call(fetchUser, page);
  yield put({ type: GET_USERS, users });
}

export default function* fetchUserSaga() {
  yield takeLatest(GET_USERS_FETCH, fetchUsersWorker);
}
