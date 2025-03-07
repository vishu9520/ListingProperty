if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
      const forms = document.querySelectorAll('.needs-validation');

      Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
              if (!form.checkValidity()) {
                  event.preventDefault();
                  event.stopPropagation();
              }
              form.classList.add('was-validated');
          });
      });
  });
} else {
  console.log("This script is meant to run in a browser, not Node.js.");
}
