// Configurações globais
const API_URL = 'https://mock-api.driven.com.br/api/v6/uol';
const UUID = 'e15a17b3-0720-4931-bfee-a7a55a11a703';
let username = '';
let selectedUser = 'Todos';
let messageType = 'message'; // 'message' para público, 'private_message' para reservado

// Estado da aplicação
let participants = [];
let messages = [];

// Elementos do DOM
const messagesContainer = document.querySelector('.messages-container');
const messageInput = document.querySelector('.message-input input');
const sendButton = document.querySelector('.send-button');
const participantsButton = document.querySelector('.participants-button');
const participantsSidebar = document.querySelector('.participants-sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

// Elementos do DOM para o sidebar
const participantsList = document.querySelector('.participants-list');
const visibilityOptions = document.querySelectorAll('.visibility-options .option');
const sendingToText = document.querySelector('.sending-to');

// Função para entrar na sala
async function login() {
    let loginSuccess = false;
    
    while (!loginSuccess) {
        username = prompt('Digite seu nome:');
        
        if (!username) {
            alert('Por favor, digite um nome válido!');
            continue;
        }

        try {
            const response = await fetch(`${API_URL}/participants/${UUID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: username })
            });

            if (response.ok) {
                loginSuccess = true;
                initializeChat();
            } else {
                alert('Este nome já está em uso. Por favor, escolha outro nome.');
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor. Tente novamente.');
        }
    }
}

// Manter conexão ativa
function keepAlive() {
    setInterval(async () => {
        try {
            const response = await fetch(`${API_URL}/status/${UUID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: username })
            });
            
            if (!response.ok) {
                // Se o status não for ok, significa que o usuário foi desconectado
                sendLogoutMessage();
                window.location.reload();
            }
        } catch (error) {
            console.error('Erro ao manter conexão:', error);
            sendLogoutMessage();
            window.location.reload();
        }
    }, 5000);
}

// Buscar mensagens
async function fetchMessages() {
    try {
        const response = await fetch(`${API_URL}/messages/${UUID}`);
        const newMessages = await response.json();
        
        if (JSON.stringify(messages) !== JSON.stringify(newMessages)) {
            messages = newMessages;
            renderMessages();
        }
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
    }
}

// Renderizar mensagens
function renderMessages() {
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        if (shouldDisplayMessage(message)) {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        }
    });

    // Rolar para a última mensagem
    const lastMessage = messagesContainer.lastElementChild;
    if (lastMessage) {
        lastMessage.scrollIntoView();
    }
}

// Verificar se a mensagem deve ser exibida
function shouldDisplayMessage(message) {
    if (message.type === 'message') return true;
    if (message.type === 'status') return true;
    if (message.type === 'private_message' && 
        (message.to === username || message.from === username || message.to === 'Todos')) {
        return true;
    }
    return false;
}

// Criar elemento de mensagem
function createMessageElement(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    // Adicionar classe específica baseada no tipo
    if (message.type === 'status') {
        div.classList.add('status');
    } else if (message.type === 'private_message') {
        div.classList.add('private_message');
    }

    const time = `<span class="time">(${message.time})</span>`;
    
    if (message.type === 'status') {
        div.innerHTML = `${time} <strong>${message.from}</strong> ${message.text}`;
    } else if (message.type === 'private_message') {
        div.innerHTML = `${time} <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>: ${message.text}`;
    } else {
        div.innerHTML = `${time} <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}`;
    }

    return div;
}

// Enviar mensagem
async function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) return;

    try {
        const response = await fetch(`${API_URL}/messages/${UUID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: username,
                to: selectedUser,
                text: text,
                type: messageType
            })
        });

        if (response.ok) {
            messageInput.value = '';
            await fetchMessages();
        } else {
            alert('Erro ao enviar mensagem. Recarregando a página...');
            window.location.reload();
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        window.location.reload();
    }
}

// Função para enviar mensagem de saída
async function sendLogoutMessage() {
    try {
        await fetch(`${API_URL}/participants/${UUID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username })
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem de saída:', error);
    }
}

// Adicionar evento para quando a aba for fechada
window.addEventListener('beforeunload', (event) => {
    sendLogoutMessage();
    
    // Forçar o navegador a esperar a requisição terminar
    event.preventDefault();
    event.returnValue = '';
});

// Buscar participantes ativos
async function fetchParticipants() {
    try {
        const response = await fetch(`${API_URL}/participants/${UUID}`);
        const newParticipants = await response.json();
        
        if (JSON.stringify(participants) !== JSON.stringify(newParticipants)) {
            participants = newParticipants;
            renderParticipants();
        }
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
    }
}

// Renderizar lista de participantes
function renderParticipants() {
    participantsList.innerHTML = `
        <div class="participant" data-user="Todos">
            <div class="participant-info">
                <img src="assets/people.svg" alt="Todos">
                <span>Todos</span>
            </div>
            <img src="assets/check.svg" alt="Selecionado" class="check ${selectedUser === 'Todos' ? 'visible' : ''}">
        </div>
    `;

    participants.forEach(participant => {
        if (participant.name !== username) {
            participantsList.innerHTML += `
                <div class="participant" data-user="${participant.name}">
                    <div class="participant-info">
                        <img src="assets/person.svg" alt="Participante">
                        <span>${participant.name}</span>
                    </div>
                    <img src="assets/check.svg" alt="Selecionado" class="check ${selectedUser === participant.name ? 'visible' : ''}">
                </div>
            `;
        }
    });

    // Atualizar o HTML das opções de visibilidade
    document.querySelector('.visibility-options').innerHTML = `
        <div class="option" data-visibility="public">
            <div class="visibility-info">
                <img src="assets/public.svg" alt="Público">
                <span>Público</span>
            </div>
            <img src="assets/check.svg" alt="Selecionado" class="check ${messageType === 'message' ? 'visible' : ''}">
        </div>
        <div class="option ${selectedUser === 'Todos' ? 'disabled' : ''}" data-visibility="private">
            <div class="visibility-info">
                <img src="assets/private.svg" alt="Reservadamente">
                <span>Reservadamente</span>
            </div>
            <img src="assets/check.svg" alt="Selecionado" class="check ${messageType === 'private_message' ? 'visible' : ''}">
        </div>
    `;

    // Readicionar eventos
    addEventListeners();
}

// Selecionar participante
function selectParticipant(user) {
    selectedUser = user;
    
    // Se selecionar "Todos", força a visibilidade para "Público"
    if (user === 'Todos') {
        messageType = 'message';
    }
    
    updateVisibilityOptions();
    updateSendingToText();
    renderParticipants();
}

// Selecionar visibilidade
function selectVisibility(type) {
    // Não permite selecionar "Reservadamente" se "Todos" estiver selecionado
    if (selectedUser === 'Todos' && type === 'private') {
        return;
    }

    messageType = type === 'private' ? 'private_message' : 'message';
    updateVisibilityOptions();
    updateSendingToText();
}

// Atualizar opções de visibilidade
function updateVisibilityOptions() {
    const publicOption = document.querySelector('.option[data-visibility="public"]');
    const privateOption = document.querySelector('.option[data-visibility="private"]');
    
    if (publicOption && privateOption) {
        // Atualiza os checks de visibilidade
        publicOption.querySelector('.check').classList.toggle('visible', messageType === 'message');
        privateOption.querySelector('.check').classList.toggle('visible', messageType === 'private_message');
        
        // Desabilita a opção "Reservadamente" se "Todos" estiver selecionado
        privateOption.classList.toggle('disabled', selectedUser === 'Todos');
    }
}

// Atualizar texto de "enviando para"
function updateSendingToText() {
    const visibility = messageType === 'private_message' ? 'Reservadamente' : 'Público';
    sendingToText.textContent = `Enviando para ${selectedUser} (${visibility})`;
}

// Eventos do sidebar
participantsButton.addEventListener('click', () => {
    participantsSidebar.classList.remove('hidden');
});

sidebarOverlay.addEventListener('click', () => {
    participantsSidebar.classList.add('hidden');
});

// Adicionar event listeners
function addEventListeners() {
    // Event listeners para participantes
    document.querySelectorAll('.participant').forEach(participant => {
        participant.addEventListener('click', () => {
            selectParticipant(participant.dataset.user);
        });
    });

    // Event listeners para opções de visibilidade
    document.querySelectorAll('.visibility-options .option').forEach(option => {
        option.addEventListener('click', () => {
            if (!option.classList.contains('disabled')) {
                selectVisibility(option.dataset.visibility);
            }
        });
    });
}

// Inicializar chat
function initializeChat() {
    keepAlive();
    fetchMessages();
    fetchParticipants(); // Buscar participantes iniciais
    setInterval(fetchMessages, 1000);
    setInterval(fetchParticipants, 1000); // Atualizar lista de participantes a cada 10 segundos
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Iniciar aplicação
login(); 