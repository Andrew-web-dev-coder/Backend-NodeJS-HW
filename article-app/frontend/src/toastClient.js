let showToast = () => {};

export function registerToast(fn) {
  showToast = fn;
}

export function toast(message) {
  showToast(message);
}
