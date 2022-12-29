import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
  .currentUser.accessToken;
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
// const TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWFlZGVlY2M0YzdhMjU5ZTFjOWVhZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY3MjMwMzE0MCwiZXhwIjoxNjcyNTYyMzQwfQ.h-P8550dzDostxJ2nzbWxvRep-kDkk4N4ixlGHFMjF4";
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
