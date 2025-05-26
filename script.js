// Script principal para o Dashboard com Sheet2DB
// Versão com visual original arredondado e efeitos de hover

// Variáveis globais
let projetosFiltrados = [];
let departamentoAtivo = 'todos';
let projetosCarregados = false;

// Função para obter o nome do site atual dinamicamente
function getSiteName() {
    return window.location.hostname || 'Dashboard de Projetos';
}

// Funções para o modal customizado
function showCustomModal(title, message) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('customModalTitle');
    const modalMessage = document.getElementById('customModalMessage');
    
    // Usar o domínio atual dinamicamente
    modalTitle.textContent = title || `${getSiteName()} diz`;
    modalMessage.textContent = message || '';
    
    modal.classList.add('show');
    
    // Adicionar evento de clique ao botão OK
    document.getElementById('customModalButton').onclick = function() {
        hideCustomModal();
    };
    
    // Fechar modal ao clicar fora dele
    modal.onclick = function(event) {
        if (event.target === modal) {
            hideCustomModal();
        }
    };
}

function hideCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('show');
}

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, inicializando dashboard...");
    console.log("Site atual:", getSiteName());

    const projetosContainer = document.getElementById('projetos-container');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const btnNovoProjeto = document.getElementById('btnNovoProjeto');
    const btnImportarProjetos = document.getElementById('btnImportarProjetos');
    
    // Garantir que os elementos modais existem antes de inicializá-los
    const novoprojetoModalElement = document.getElementById('novoprojetoModal');
    const detalhesModalElement = document.getElementById('detalhesModal');
    
    // Inicializar modais do Bootstrap
    let novoprojetoModal, detalhesModal;
    
    if (novoprojetoModalElement) {
        novoprojetoModal = new bootstrap.Modal(novoprojetoModalElement);
        console.log("Modal de novo projeto inicializado");
    } else {
        console.error("Elemento modal de novo projeto não encontrado");
    }
    
    if (detalhesModalElement) {
        detalhesModal = new bootstrap.Modal(detalhesModalElement);
        console.log("Modal de detalhes inicializado");
    } else {
        console.error("Elemento modal de detalhes não encontrado");
    }

    // Carregar projetos
    carregarProjetos();
    
    // Configurar filtros - CORREÇÃO: Remover event listeners antigos e adicionar novos
    filterButtons.forEach(button => {
        // Remover event listeners antigos para evitar duplicação
        const oldButton = button.cloneNode(true);
        button.parentNode.replaceChild(oldButton, button);
        
        // Adicionar novo event listener
        oldButton.addEventListener('click', function() {
            console.log(`Filtro clicado: ${this.getAttribute('data-filter')}`);
            
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-dark', 'btn-primary', 'btn-success', 'btn-purple', 'btn-orange', 'btn-warning');
                
                // Restaurar classes originais dos botões
                if (btn.getAttribute('data-filter') === 'todos') {
                    btn.classList.add('btn-outline-dark');
                } else if (btn.getAttribute('data-filter') === 'programacao') {
                    btn.classList.add('btn-outline-primary');
                } else if (btn.getAttribute('data-filter') === 'copywriting') {
                    btn.classList.add('btn-outline-success');
                } else if (btn.getAttribute('data-filter') === 'design') {
                    btn.classList.add('btn-outline-purple');
                } else if (btn.getAttribute('data-filter') === 'social-media') {
                    btn.classList.add('btn-outline-orange');
                } else if (btn.getAttribute('data-filter') === 'prospeccao') {
                    btn.classList.add('btn-outline-warning');
                }
            });
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Adicionar classe de cor sólida ao botão ativo
            if (this.getAttribute('data-filter') === 'todos') {
                this.classList.remove('btn-outline-dark');
                this.classList.add('btn-dark');
            } else if (this.getAttribute('data-filter') === 'programacao') {
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
            } else if (this.getAttribute('data-filter') === 'copywriting') {
                this.classList.remove('btn-outline-success');
                this.classList.add('btn-success');
            } else if (this.getAttribute('data-filter') === 'design') {
                this.classList.remove('btn-outline-purple');
                this.classList.add('btn-purple');
            } else if (this.getAttribute('data-filter') === 'social-media') {
                this.classList.remove('btn-outline-orange');
                this.classList.add('btn-orange');
            } else if (this.getAttribute('data-filter') === 'prospeccao') {
                this.classList.remove('btn-outline-warning');
                this.classList.add('btn-warning');
            }
            
            // Atualizar departamento ativo e filtrar projetos
            departamentoAtivo = this.getAttribute('data-filter');
            filtrarProjetos();
        });
    });
    
    // Configurar botão de novo projeto
    if (btnNovoProjeto) {
        btnNovoProjeto.addEventListener('click', () => {
            console.log("Botão Novo Projeto clicado");
            document.getElementById('novoprojetoForm').reset();
            novoprojetoModal.show();
        });
        console.log("Listener do botão Novo Projeto configurado");
    } else {
        console.error("Botão Novo Projeto não encontrado");
    }
    
    // Configurar botão de salvar projeto
    const btnSalvarProjeto = document.getElementById('salvarProjeto');
    if (btnSalvarProjeto) {
        btnSalvarProjeto.addEventListener('click', salvarProjeto);
        console.log("Listener do botão Salvar Projeto configurado");
    } else {
        console.error("Botão Salvar Projeto não encontrado");
    }
    
    // Configurar botão de importar projetos
    if (btnImportarProjetos) {
        btnImportarProjetos.addEventListener('click', () => {
            console.log("Botão Importar Projetos clicado");
            if (confirm('Isso irá adicionar projetos de exemplo à planilha. Continuar?')) {
                importarProjetosExemplo();
            }
        });
        console.log("Listener do botão Importar Projetos configurado");
    } else {
        console.error("Botão Importar Projetos não encontrado");
    }
    
    // Expor funções globalmente para uso nos botões inline
    window.mostrarDetalhes = mostrarDetalhes;
    window.excluirProjeto = excluirProjeto;
    window.enviarEmail = enviarEmail;
});

// Função para enviar email (simulada)
function enviarEmail(email) {
    console.log(`Enviando email para: ${email}`);
    showCustomModal(null, `Email enviado com sucesso para ${email}!`);
}

// Funções CRUD
async function carregarProjetos() {
    const projetosContainer = document.getElementById('projetos-container');
    try {
        console.log("Carregando projetos do Sheet2DB...");
        
        // Usar a função do sheet2db.js para buscar projetos
        const data = await buscarProjetos();
        
        console.log(`${data ? data.length : 0} projetos carregados`);
        
        if (data && data.length > 0) {
            projetosFiltrados = data;
            projetosCarregados = true;
            filtrarProjetos();
        } else {
            projetosContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum projeto encontrado. Clique em "Novo Projeto" para adicionar ou use o botão "Importar Projetos Originais".</div></div>';
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        projetosContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao carregar projetos. Verifique suas credenciais do Sheet2DB e tente novamente.</div></div>`;
    }
}

async function salvarProjeto() {
    console.log("Função salvarProjeto iniciada");
    try {
        const nome = document.getElementById('nome_projeto').value;
        const departamento = document.getElementById('departamento').value;
        const status = document.getElementById('status').value;
        const dataInicio = document.getElementById('data_inicio').value;
        const dataConclusao = document.getElementById('data_conclusao').value;
        const descricao = document.getElementById('descricao').value;
        const arquivosText = document.getElementById('arquivos').value;
        const emailNotificacoes = document.getElementById('email_notificacoes').value;
        
        console.log("Valores dos campos:", {
            nome, departamento, status, dataInicio, dataConclusao, 
            descricao, arquivosText, emailNotificacoes
        });
        
        // Validar campos obrigatórios
        if (!nome || !departamento || !status || !dataInicio || !dataConclusao || !descricao || !emailNotificacoes) {
            console.log("Validação falhou: campos obrigatórios não preenchidos");
            showCustomModal(null, 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Processar arquivos
        let arquivos = [];
        if (arquivosText && arquivosText.trim() !== '') {
            arquivos = arquivosText.split(/[,\n]/).map(url => url.trim()).filter(url => url);
        }
        console.log("Arquivos processados:", arquivos);
        
         // REMOVED: Date formatting logic as API expects YYYY-MM-DD from input
        // const dataInicioFormatada = formatarData(dataInicio);
        // const dataConclusaoFormatada = formatarData(dataConclusao);
        // console.log("Datas formatadas:", { dataInicioFormatada, dataConclusaoFormatada });

        const novoProjeto = {
            nome: nome.trim(),
            departamento: departamento.trim(),
            status: status.trim(),
            dataInicio: dataInicio, // Use original value from input (YYYY-MM-DD)
            dataConclusao: dataConclusao, // Use original value from input (YYYY-MM-DD)
            descricao: descricao.trim(),
            arquivos: arquivos,
            emailNotificacoes: emailNotificacoes.trim()
        };     };
        
        console.log("Objeto novoProjeto completo:", novoProjeto);
        
        // Usar a função do sheet2db.js para adicionar projeto
        const data = await adicionarProjeto(novoProjeto);
        
        if (!data) {
            throw new Error("Falha ao adicionar projeto");
        }
        
        console.log("Projeto salvo com sucesso:", data);
        
        const novoprojetoModal = bootstrap.Modal.getInstance(document.getElementById('novoprojetoModal'));
        novoprojetoModal.hide();
        
        // Mostrar mensagem de sucesso com modal customizado
        showCustomModal(null, `Projeto "${nome}" adicionado com sucesso!`);
        
        // Recarregar projetos após salvar
        setTimeout(() => {
            carregarProjetos();
        }, 500);
    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        showCustomModal(null, 'Erro ao salvar projeto. Por favor, tente novamente.');
    }
}

async function excluirProjeto(id) {
    console.log(`Excluindo projeto ID: ${id}`);
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            // Usar a função do sheet2db.js para excluir projeto
            const success = await excluirProjeto(id);
            
            if (!success) {
                throw new Error("Falha ao excluir projeto");
            }
            
            // Mostrar mensagem de sucesso com modal customizado
            showCustomModal(null, 'Projeto excluído com sucesso!');
            
            carregarProjetos();
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showCustomModal(null, 'Erro ao excluir projeto. Por favor, tente novamente.');
        }
    }
}

async function mostrarDetalhes(id) {
    try {
        console.log(`Buscando detalhes do projeto ID: ${id}`);
        
        // Usar a função do sheet2db.js para buscar projeto por ID
        const projeto = await buscarProjetoPorId(id);
        
        if (!projeto) {
            throw new Error("Projeto não encontrado");
        }
        
        console.log("Mostrando detalhes do projeto:", projeto.nome);
        const detalhesConteudo = document.getElementById('detalhes-conteudo');
        
        let arquivosHTML = '';
        let arquivosArray = [];

        if (projeto.arquivos) {
            if (Array.isArray(projeto.arquivos)) {
                // Filter empty items if it's already an array
                arquivosArray = projeto.arquivos.filter(a => a && String(a).trim() !== ''); 
            } else if (typeof projeto.arquivos === 'string' && projeto.arquivos.trim() !== '') {
                // Split by comma or newline, trim whitespace, filter empty items
                arquivosArray = projeto.arquivos.split(/[\n,]/) 
                                         .map(a => a.trim())      
                                         .filter(a => a !== ''); 
            }
        }

        if (arquivosArray.length > 0) {
            arquivosHTML = `
                <h6>Arquivos:</h6>
                <ul>
                    ${arquivosArray.map(arquivo => {
                        // Simple check if it looks like a URL
                        if (typeof arquivo === 'string' && (arquivo.startsWith('http://') || arquivo.startsWith('https://'))) {
                            let linkName = arquivo;
                            try {
                                // Attempt to create a more readable link name from URL
                                const url = new URL(arquivo);
                                linkName = url.hostname + (url.pathname !== '/' ? url.pathname : '');
                            } catch (e) { 
                                // If URL parsing fails, use the original string
                                linkName = arquivo; 
                            }
                            return `<li><a href="${arquivo}" target="_blank">${linkName}</a></li>`;
                        } else {
                            // If it's not a URL, just display the text
                            return `<li>${arquivo}</li>`;
                        }
                    }).join('')}
                </ul>
            `;
        }
        
        detalhesConteudo.innerHTML = `
            <h4>${projeto.nome}</h4>
            <div class="badge status-badge status-${projeto.status} mb-3">${getStatusLabel(projeto.status)}</div>
            <p><strong>Departamento:</strong> ${getDepartamentoLabel(projeto.departamento)}</p>
            <p><strong>Data de Início:</strong> ${projeto.dataInicio}</p>
            <p><strong>Data de Conclusão:</strong> ${projeto.dataConclusao}</p>
            <p><strong>Descrição:</strong> ${projeto.descricao}</p>
            ${arquivosHTML}
            <p><strong>E-mail para Notificações:</strong> ${projeto.emailNotificacoes}</p>
        `;
        
        const detalhesModal = bootstrap.Modal.getInstance(document.getElementById('detalhesModal')) || 
                            new bootstrap.Modal(document.getElementById('detalhesModal'));
        detalhesModal.show();
    } catch (error) {
        console.error('Erro ao mostrar detalhes do projeto:', error);
        showCustomModal(null, 'Erro ao carregar detalhes do projeto. Por favor, tente novamente.');
    }
}

// Funções auxiliares
function filtrarProjetos() {
    if (!projetosCarregados) return;
    
    console.log(`Filtrando projetos por departamento: ${departamentoAtivo}`);
    const projetosFiltradosPorDepartamento = departamentoAtivo === 'todos' 
        ? projetosFiltrados 
        : projetosFiltrados.filter(projeto => projeto.departamento === departamentoAtivo);
    
    renderizarProjetos(projetosFiltradosPorDepartamento);
}

function renderizarProjetos(projetos) {
    console.log(`Renderizando ${projetos.length} projetos`);
    const projetosContainer = document.getElementById('projetos-container');
    
    if (projetos.length === 0) {
        projetosContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum projeto encontrado para o filtro selecionado.</div></div>';
        return;
    }
    
    let html = '';
    
    projetos.forEach(projeto => {
        // Determinar classe de cabeçalho com base no status
        const headerClass = `card-header-${projeto.status}`;
        
        // Criar HTML para o card do projeto
        html += `
            <div class="col">
                <div class="card h-100">
                    <div class="card-header ${headerClass}">
                        <h5 class="card-title">${projeto.nome}</h5>
                    </div>
                    <div class="card-body">
                        <div class="departamento">${getDepartamentoLabel(projeto.departamento)}</div>
                        <p class="card-text">${truncateText(projeto.descricao, 100)}</p>
                        <div class="datas">
                            <i class="bi bi-calendar"></i> ${projeto.dataInicio} - ${projeto.dataConclusao}
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-email" onclick="enviarEmail('${projeto.emailNotificacoes}')">
                                <i class="bi bi-envelope"></i> Email
                            </button>
                            <button class="btn btn-detalhes" onclick="mostrarDetalhes('${projeto.id}')">
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </button>
                            <button class="btn btn-excluir" onclick="excluirProjeto('${projeto.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    projetosContainer.innerHTML = html;
}

async function importarProjetosExemplo() {
    try {
        console.log("Importando projetos de exemplo...");
        
        // Usar a função do sheet2db.js para importar projetos de exemplo
        const projetos = await importarProjetosExemplo();
        
        if (projetos && projetos.length > 0) {
            showCustomModal(null, `${projetos.length} projetos de exemplo importados com sucesso!`);
            carregarProjetos();
        } else {
            showCustomModal(null, 'Nenhum projeto foi importado. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao importar projetos de exemplo:', error);
        showCustomModal(null, 'Erro ao importar projetos de exemplo. Por favor, tente novamente.');
    }
}

// Funções utilitárias
function formatarData(dataString) {
    if (!dataString) return '';
    
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dataString;
    }
}

function getStatusLabel(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'concluido': 'Concluído'
    };
    
    return statusMap[status] || status;
}

function getDepartamentoLabel(departamento) {
    const departamentoMap = {
        'programacao': 'Programação',
        'copywriting': 'Copywriting',
        'design': 'Design',
        'social-media': 'Social Media',
        'prospeccao': 'Prospecção/SDR'
    };
    
    return departamentoMap[departamento] || departamento;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}


