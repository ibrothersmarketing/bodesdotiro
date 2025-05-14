document.addEventListener("DOMContentLoaded", function() {
    // Função genérica para copiar texto para a área de transferência
    function setupCopyButton(buttonId, inputId, originalButtonText) {
        const copyButton = document.getElementById(buttonId);
        const textInput = document.getElementById(inputId);

        if (copyButton && textInput) {
            copyButton.addEventListener("click", function() {
                textInput.select(); // Seleciona o texto no campo de input
                textInput.setSelectionRange(0, 99999); // Para dispositivos móveis

                try {
                    // Tenta usar a API de Clipboard moderna
                    navigator.clipboard.writeText(textInput.value)
                        .then(() => {
                            // Sucesso!
                            copyButton.textContent = "Copiado!";
                            setTimeout(() => {
                                copyButton.textContent = originalButtonText;
                            }, 2000); // Volta ao texto original após 2 segundos
                        })
                        .catch(err => {
                            console.warn("Falha ao copiar com a API de Clipboard, tentando execCommand:", err);
                            fallbackCopyTextToClipboard(textInput.value, copyButton, originalButtonText);
                        });
                } catch (err) {
                    console.warn("API de Clipboard não disponível, tentando execCommand:", err);
                    fallbackCopyTextToClipboard(textInput.value, copyButton, originalButtonText);
                }
            });
        }
    }

    // Função de fallback para copiar texto
    function fallbackCopyTextToClipboard(text, buttonElement, originalButtonText) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            if (successful) {
                buttonElement.textContent = "Copiado!";
                setTimeout(() => {
                    buttonElement.textContent = originalButtonText;
                }, 2000);
            } else {
                buttonElement.textContent = "Erro ao Copiar";
                console.error("Fallback: Falha ao copiar o texto.");
                alert("Não foi possível copiar. Por favor, copie manualmente.");
            }
        } catch (err) {
            console.error("Fallback: Erro ao tentar copiar o texto:", err);
            buttonElement.textContent = "Erro ao Copiar";
            alert("Não foi possível copiar. Por favor, copie manualmente.");
        }

        document.body.removeChild(textArea);
    }

    // Configura o botão para o PIX Copia e Cola
    setupCopyButton("copyPixButton", "pixKey", "Copiar Chave PIX");

    // Configura o botão para o PIX CELULAR
    setupCopyButton("copyPixButtonCelular", "pixKeyCelular", "Copiar Celular");
});
