let showToast = () => {};

export function registerToast(fn) {
  showToast = fn;
}

export function toast(message) {
  if (showToast) showToast(message);
}
