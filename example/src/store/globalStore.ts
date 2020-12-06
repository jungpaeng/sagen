import { createStore } from "../../../src/store";

const globalStore = createStore({
  num: 0,
  str: '',
});

export default globalStore;
