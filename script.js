document.addEventListener('DOMContentLoaded', function() {
    const copyPixButton = document.getElementById('copyPixButton');
    const pixKeyInput = document.getElementById('pixKey');

    if (copyPixButton && pixKeyInput) {
        copyPixButton.addEventListener('click', function() {
            pixKeyInput.select(); // Seleciona o texto no campo de input
            pixKeyInput.setSelectionRange(0, 99999); // Para dispositivos móveis

            try {
                // Tenta usar a API de Clipboard moderna
                navigator.clipboard.writeText(pixKeyInput.value)
                    .then(() => {
                        // Sucesso!
                        copyPixButton.textContent = 'Copiado!';
                        setTimeout(() => {
                            copyPixButton.textContent = 'Copiar Chave PIX';
                        }, 2000); // Volta ao texto original após 2 segundos
                    })
                    .catch(err => {
                        // Fallback para o método execCommand (mais antigo, menos seguro)
                        console.warn('Falha ao copiar com a API de Clipboard, tentando execCommand:', err);
                        fallbackCopyTextToClipboard(pixKeyInput.value);
                    });
            } catch (err) {
                // Fallback se navigator.clipboard não estiver disponível
                console.warn('API de Clipboard não disponível, tentando execCommand:', err);
                fallbackCopyTextToClipboard(pixKeyInput.value);
            }
        });
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Evita rolar a página para baixo ao adicionar o textarea
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyPixButton.textContent = 'Copiado!';
                setTimeout(() => {
                    copyPixButton.textContent = 'Copiar Chave PIX';
                }, 2000);
            } else {
                copyPixButton.textContent = 'Erro ao Copiar';
                 console.error('Fallback: Falha ao copiar o texto.');
                 alert('Não foi possível copiar a chave PIX. Por favor, copie manualmente.');
            }
        } catch (err) {
            console.error('Fallback: Erro ao tentar copiar o texto:', err);
            copyPixButton.textContent = 'Erro ao Copiar';
            alert('Não foi possível copiar a chave PIX. Por favor, copie manualmente.');
        }

        document.body.removeChild(textArea);
    }
});
