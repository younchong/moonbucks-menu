export const store = {
  setLocalStorage(item) {
    localStorage.setItem("menu", JSON.stringify(item));
  },

  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  }
}

export default store;