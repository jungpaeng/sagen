import { createStore } from "../lib";

const globalStore = createStore({
  num: 0,
  str: '',
});

export default globalStore;
