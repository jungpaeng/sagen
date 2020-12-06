import { createStore } from "../lib/store";

const globalStore = createStore({
  num: 0,
  str: '',
});

export default globalStore;