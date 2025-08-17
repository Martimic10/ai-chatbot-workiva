const API_URL = 'http://localhost:3001/api/chat';

let chatHistory = [];
let chatSessions = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    const el = {
        messages: document.getElementById('chatMessages'),
        prompt: document.getElementById('messageInput'),
        send: document.getElementById('sendButton'),
        clear: document.getElementById('clearButton'),
        welcomeScreen: document.getElementById('welcomeScreen'),
        chatHistory: document.getElementById('chatHistory'),
        newChatBtn: document.querySelector('.new-chat-btn')
    };

    console.log('Elements found:', {
        messages: !!el.messages,
        prompt: !!el.prompt,
        send: !!el.send,
        clear: !!el.clear,
        welcomeScreen: !!el.welcomeScreen,
        chatHistory: !!el.chatHistory,
        newChatBtn: !!el.newChatBtn
    });

    const missingElements = [];
    if (!el.messages) missingElements.push('chatMessages');
    if (!el.prompt) missingElements.push('messageInput');
    if (!el.send) missingElements.push('sendButton');
    
    if (missingElements.length > 0) {
        console.error('Missing critical elements:', missingElements);
        alert('Missing HTML elements: ' + missingElements.join(', ') + '. Please check your HTML structure.');
        return;
    }

    const state = {
        messages: [],
        loading: false,
        error: null,
        currentChatId: null,
        chatSessions: []
    };

    function uid() { 
        return Math.random().toString(36).slice(2); 
    }

    function createChatSession(firstMessage) {
        const chatId = uid();
        const title = firstMessage.length > 30 ? firstMessage.slice(0, 30) + '...' : firstMessage;
        const session = {
            id: chatId,
            title: title,
            messages: [],
            createdAt: Date.now()
        };
        state.chatSessions.unshift(session);
        state.currentChatId = chatId;
        renderChatHistory();
        return session;
    }

    function renderChatHistory() {
        if (!el.chatHistory) return;
        
        el.chatHistory.innerHTML = '';
        
        state.chatSessions.forEach(session => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.innerHTML = `<span class="chat-title">${session.title}</span>`;
            chatItem.style.cursor = 'pointer';
            chatItem.style.padding = '8px 12px';
            chatItem.style.borderRadius = '4px';
            chatItem.style.marginBottom = '4px';
            chatItem.addEventListener('click', () => loadChatSession(session.id));
            chatItem.addEventListener('mouseenter', () => {
                chatItem.style.backgroundColor = '#f0f0f0';
            });
            chatItem.addEventListener('mouseleave', () => {
                chatItem.style.backgroundColor = 'transparent';
            });
            el.chatHistory.appendChild(chatItem);
        });
    }

    function loadChatSession(chatId) {
        const session = state.chatSessions.find(s => s.id === chatId);
        if (session) {
            state.currentChatId = chatId;
            state.messages = [...session.messages];
            render();
        }
    }

    function updateCurrentSession() {
        if (state.currentChatId) {
            const session = state.chatSessions.find(s => s.id === state.currentChatId);
            if (session) {
                session.messages = [...state.messages];
            }
        }
    }

    function startNewChat() {
        console.log('Starting new chat...');
        state.messages = [];
        state.currentChatId = null;
        state.error = null;
        render();
    }

    function showLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.id = 'loading-indicator';
        loadingDiv.style.padding = '16px';
        loadingDiv.style.textAlign = 'center';
        loadingDiv.style.color = '#666';
        loadingDiv.innerHTML = `
            <span>AI is thinking...</span>
        `;
        el.messages.appendChild(loadingDiv);
        el.messages.scrollTop = el.messages.scrollHeight;
    }

    function removeLoadingMessage() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
    }

    function render() {
        console.log('Rendering... Messages count:', state.messages.length);
        
        if (state.messages.length === 0) {
            if (el.welcomeScreen) {
                el.welcomeScreen.style.display = 'flex';
            }
            el.messages.style.display = 'none';
        } else {
            if (el.welcomeScreen) {
                el.welcomeScreen.style.display = 'none';
            }
            el.messages.style.display = 'block';
        }

        el.messages.innerHTML = '';
        
        if (state.error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.padding = '16px';
            errorDiv.style.color = '#d32f2f';
            errorDiv.style.backgroundColor = '#ffebee';
            errorDiv.style.borderRadius = '8px';
            errorDiv.style.margin = '8px';
            errorDiv.textContent = state.error;
            el.messages.appendChild(errorDiv);
        }

        state.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.role}`;
            messageDiv.style.padding = '12px 16px';
            messageDiv.style.margin = '8px';
            messageDiv.style.borderRadius = '8px';
            
            if (message.role === 'user') {
                messageDiv.style.backgroundColor = '#007bff';
                messageDiv.style.color = 'white';
                messageDiv.style.marginLeft = '20%';
                messageDiv.style.textAlign = 'right';
            } else {
                messageDiv.style.backgroundColor = '#f8f9fa';
                messageDiv.style.color = '#333';
                messageDiv.style.marginRight = '20%';
            }
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = message.content;
            
            messageDiv.appendChild(contentDiv);
            el.messages.appendChild(messageDiv);
        });

        if (el.messages.style.display !== 'none') {
            el.messages.scrollTop = el.messages.scrollHeight;
        }

        const hasText = el.prompt.value.trim().length > 0;
        el.send.disabled = state.loading || !hasText;
        
        if (state.loading) {
            el.send.innerHTML = '...';
        } else {
            el.send.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
            `;
        }
    }

    async function onSubmit() {
        const text = el.prompt.value.trim();
        console.log('onSubmit called with text:', text);
        
        if (!text || state.loading) {
            console.log('Submission blocked - no text or loading');
            return;
        }

        console.log('Processing submission...');

        if (state.messages.length === 0) {
            console.log('Creating new chat session');
            createChatSession(text);
        }

        const userMessage = { 
            id: uid(), 
            role: 'user', 
            content: text, 
            createdAt: Date.now() 
        };
        
        state.messages.push(userMessage);
        updateCurrentSession();
        
        el.prompt.value = '';
        state.loading = true;
        state.error = null;
        
        console.log('Rendering and showing loading...');
        render();
        showLoadingMessage();

        try {
            console.log('Calling API...');
            
            const payload = { 
                messages: state.messages.map(m => ({ 
                    role: m.role, 
                    content: m.content 
                })) 
            };
            
            console.log('API payload:', payload);
            
            const resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('API response status:', resp.status);

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('API error response:', txt);
                throw new Error(txt || `HTTP ${resp.status}`);
            }

            const data = await resp.json();
            console.log('API response data:', data);
            
            const aiMessage = { 
                id: uid(), 
                role: 'assistant', 
                content: data.content, 
                createdAt: Date.now() 
            };
            
            state.messages.push(aiMessage);
            updateCurrentSession();
            
        } catch (err) {
            console.error('Chat error:', err);
            state.error = err?.message || 'Network error';
        } finally {
            removeLoadingMessage();
            state.loading = false;
            console.log('Final render...');
            render();
        }
    }

    render();
    renderChatHistory();

    console.log('Setting up event listeners...');

    el.prompt.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('Enter pressed, message:', el.prompt.value.trim());
            onSubmit();
        }
    });

    el.prompt.addEventListener('input', () => {
        const hasText = el.prompt.value.trim().length > 0;
        el.send.disabled = state.loading || !hasText;
        console.log('Input changed, hasText:', hasText, 'disabled:', el.send.disabled);
    });

    el.send.addEventListener('click', (e) => { 
        console.log('Send button clicked');
        e.preventDefault(); 
        e.stopPropagation();
        onSubmit();
    });

    if (el.clear) {
        el.clear.addEventListener('click', (e) => { 
            console.log('Clear button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Clear this conversation?')) {
                startNewChat();
            }
        });
    }

    if (el.newChatBtn) {
        el.newChatBtn.addEventListener('click', (e) => {
            console.log('New chat button clicked');
            e.preventDefault();
            e.stopPropagation();
            startNewChat();
        });
    }

    console.log('Event listeners set up successfully');

    window.testChat = function() {
        console.log('Test function called');
        state.messages = [{
            id: uid(),
            role: 'user',
            content: 'Test message',
            createdAt: Date.now()
        }];
        render();
    };

    console.log('App initialization complete. You can test with: testChat()');
});