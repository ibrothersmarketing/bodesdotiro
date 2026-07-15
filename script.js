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
    
    // Função para calcular o valor total das passadas selecionadas
    function calcularValorTotal() {
        const quantidadeInputs = document.querySelectorAll('.qtd-input');
        let valorTotal = 0;

        quantidadeInputs.forEach(input => {
            const quantidade = parseInt(input.value, 10) || 0;
            const valorUnitario = parseFloat(input.getAttribute('data-valor'));
            valorTotal += quantidade * valorUnitario;
        });

        // Atualiza o display do valor total
        document.getElementById('valorTotalDisplay').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    // Configura os botões de + e - para cada modalidade (máximo 3 passadas)
    const MAX_PASSADAS = 3;
    const quantidadeInputs = document.querySelectorAll('.qtd-input');

    quantidadeInputs.forEach(input => {
        const prova = input.getAttribute('data-prova');
        const botaoMenos = document.querySelector(`.qtd-menos[data-target="${prova}"]`);
        const botaoMais = document.querySelector(`.qtd-mais[data-target="${prova}"]`);

        botaoMais.addEventListener('click', function() {
            const valorAtual = parseInt(input.value, 10) || 0;
            if (valorAtual < MAX_PASSADAS) {
                input.value = valorAtual + 1;
                calcularValorTotal();
            }
        });

        botaoMenos.addEventListener('click', function() {
            const valorAtual = parseInt(input.value, 10) || 0;
            if (valorAtual > 0) {
                input.value = valorAtual - 1;
                calcularValorTotal();
            }
        });
    });

    // Inicializa o cálculo do valor total
    calcularValorTotal();
});
