function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      resolve();
    };
    document.appendChild(script);
  });
}

function redirect(url) {
  window.location.href = url;
}

export { loadScript, redirect };
