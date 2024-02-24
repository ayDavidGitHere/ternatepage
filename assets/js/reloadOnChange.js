function reloadOnFileChange(url, interval) {
  let lastModified = null;

  function checkFileChange() {
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const newLastModified = response.headers.get('Content-Length');
          if (lastModified && lastModified !== newLastModified) {
            console.log('File has changed. Reloading the page...');
            window.location.href = window.location.href;
          }
          lastModified = newLastModified;
        }
      })
      .catch(error => {
        console.error('Error checking file change:', error);
      });
  }

  setInterval(checkFileChange, interval);
}

// Example usage: Check for file change every 5 seconds
reloadOnFileChange('docs/main.js', 10000);



/*<script src="./assets/js/reloadOnChange.js"></script>*/