document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emitir-senha-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        fetch('/emitir_senha', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});
