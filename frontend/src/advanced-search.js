/**
 * Display advanced seach on focus on search
 */

(function init() {
  const form = document.getElementById('search-bar-form');
  const allInput = document.getElementsByClassName('refresh-on-change');

  for (let i = 0; i < allInput.length; i++) {
    allInput[i].addEventListener('change', (e) => {
      form.submit();
    });
  }
})();
