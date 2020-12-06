import { createStore } from "sagen";

const globalStore = createStore({
  num: 0,
  str: '',
});

export default globalStore;
