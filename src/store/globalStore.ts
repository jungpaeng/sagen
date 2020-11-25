import createStore from "../lib/createStore";

const globalStore = createStore({
  num: 0,
  str: '',
});

export default globalStore;