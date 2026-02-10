function isMobileOS() {
  const ua = navigator.userAgent;

  // iOS
  if (/iPhone|iPad|iPod/i.test(ua)) return true;

  // Android
  if (/Android/i.test(ua)) return true;

  return false;
}

export { isMobileOS };
