// =========== 主页面交互功能 ===========

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动导航
    initSmoothScrolling();

    // 页面滚动效果
    initScrollEffects();

    // 工具卡片动画
    initCardAnimations();

    // 统计数据动画
    initStatsAnimation();
});

// 平滑滚动导航
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 页面滚动效果
function initScrollEffects() {
    const navbar = document.querySelector('.nav-bar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 导航栏背景效果
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'none';
        }

        // 视差滚动效果
        const heroHeader = document.querySelector('.hero-header');
        if (heroHeader) {
            const scrolled = window.pageYOffset;
            heroHeader.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        lastScrollTop = scrollTop;
    });
}

// 工具卡片动画
function initCardAnimations() {
    const toolCards = document.querySelectorAll('.tool-card');

    // 鼠标悬停效果
    toolCards.forEach(card => {
        const toolBtn = card.querySelector('.tool-btn');

        card.addEventListener('mouseenter', function() {
            if (!toolBtn.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
    });

    // 交错动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    toolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// 统计数据动画
function initStatsAnimation() {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));
    });
}

// 特色功能动画
function initFeatureAnimations() {
    const featureItems = document.querySelectorAll('.feature-item');

    const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2
    });

    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        featureObserver.observe(item);
    });
}

// 页面加载动画
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // 初始化特色功能动画
    initFeatureAnimations();
});

// 工具卡片点击事件优化
function enhanceToolCardClicks() {
    const toolCards = document.querySelectorAll('.tool-card');

    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolBtn = this.querySelector('.tool-btn');

            if (!toolBtn.classList.contains('coming-soon')) {
                // 添加点击反馈
                this.style.transform = 'scale(0.98)';

                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            } else {
                // 即将推出的提示
                showComingSoonMessage();
            }
        });
    });
}

// 即将推出提示
function showComingSoonMessage() {
    // 创建提示消息
    const message = document.createElement('div');
    message.className = 'coming-soon-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-clock"></i>
            <span>UI设计器即将推出，敬请期待！</span>
        </div>
    `;

    // 添加样式
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    const messageContent = message.querySelector('.message-content');
    messageContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        font-size: 16px;
    `;

    document.body.appendChild(message);

    // 显示动画
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // 自动消失
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.9)';

        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 2000);
}

// 初始化所有增强功能
document.addEventListener('DOMContentLoaded', function() {
    enhanceToolCardClicks();
});

// 性能优化：节流函数
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 应用节流到滚动事件
window.addEventListener('scroll', throttle(function() {
    // 滚动相关的性能优化处理
}, 16)); // 约60fps

// =========== AI助手功能 ===========

// AI助手状态管理
const aiAssistant = {
    isOpen: false,
    isMinimized: false,
    currentProvider: 'gemini',
    apiKey: '',
    settings: {
        creativity: 70,
        responseLength: 'medium',
        includeComments: true,
        autoApply: true
    }
};

// AI助手初始化
document.addEventListener('DOMContentLoaded', function() {
    initAIAssistant();
});

function initAIAssistant() {
    setupAIEventListeners();
    loadAISettings();
    setupAIProviderTemplates();
}

// 设置AI助手事件监听器
function setupAIEventListeners() {
    // 浮动按钮点击
    document.getElementById('ai-fab').addEventListener('click', toggleAIChat);

    // 聊天窗口控制
    document.getElementById('ai-settings-btn').addEventListener('click', () => showModal('ai-settings-modal'));
    document.getElementById('minimize-chat-btn').addEventListener('click', minimizeAIChat);
    document.getElementById('close-chat-btn').addEventListener('click', closeAIChat);

    // 输入框事件
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    chatInput.addEventListener('input', updateChatInput);
    chatInput.addEventListener('keydown', handleChatKeydown);
    sendBtn.addEventListener('click', sendMessage);

    // 快速操作按钮
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            chatInput.value = prompt;
            updateChatInput();
            sendMessage();
        });
    });

    // 底部操作按钮
    document.getElementById('clear-chat-btn').addEventListener('click', clearChat);
    document.getElementById('examples-btn').addEventListener('click', () => showModal('examples-modal'));

    // 示例提示点击
    document.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', () => {
            const prompt = item.dataset.prompt;
            document.getElementById('chat-input').value = prompt;
            updateChatInput();
            closeModal('examples-modal');
            if (!aiAssistant.isOpen) {
                toggleAIChat();
            }
        });
    });

    // AI设置相关
    setupAISettingsEvents();
}

// 设置AI设置事件
function setupAISettingsEvents() {
    // AI提供商选择
    document.querySelectorAll('input[name="ai-provider"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            aiAssistant.currentProvider = e.target.value;
            updateProviderInfo();
            updateUIBasedOnProvider(e.target.value);
        });
    });

    // 创意程度滑块
    const creativitySlider = document.getElementById('creativity-level');
    creativitySlider.addEventListener('input', (e) => {
        document.querySelector('.range-value').textContent = e.target.value + '%';
        aiAssistant.settings.creativity = parseInt(e.target.value);
    });

    // 密码显示切换
    window.togglePasswordVisibility = function(inputId) {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    };

    // 设置保存和重置
    window.saveAISettings = function() {
        const apiKey = document.getElementById('api-key').value;
        const apiEndpoint = document.getElementById('api-endpoint').value;
        const apiModel = document.getElementById('api-model').value;
        const responseLength = document.getElementById('response-length').value;
        const includeComments = document.getElementById('include-comments').checked;
        const autoApply = document.getElementById('auto-apply').checked;

        // 保存到本地存储
        const settings = {
            provider: aiAssistant.currentProvider,
            apiKey: apiKey,
            apiEndpoint: apiEndpoint,
            apiModel: apiModel,
            creativity: aiAssistant.settings.creativity,
            responseLength: responseLength,
            includeComments: includeComments,
            autoApply: autoApply
        };

        localStorage.setItem('ai-assistant-settings', JSON.stringify(settings));
        aiAssistant.apiKey = apiKey;
        aiAssistant.settings = { ...aiAssistant.settings, responseLength, includeComments, autoApply };

        closeModal('ai-settings-modal');
        showNotification('设置已保存', 'success');
    };

    window.resetAISettings = function() {
        if (confirm('确定要重置所有AI助手设置吗？')) {
            localStorage.removeItem('ai-assistant-settings');
            loadDefaultAISettings();
            showNotification('设置已重置', 'info');
        }
    };

    // 显示端点预设
    window.showEndpointPresets = function() {
        const presetsSection = document.getElementById('endpoint-presets');
        presetsSection.style.display = presetsSection.style.display === 'none' ? 'block' : 'none';
    };

    // 显示模型建议
    window.showModelSuggestions = function() {
        const suggestionsPanel = document.getElementById('model-suggestions-panel');
        suggestionsPanel.style.display = suggestionsPanel.style.display === 'none' ? 'block' : 'none';
    };

    // 预设选择事件
    document.querySelectorAll('.preset-item').forEach(item => {
        item.addEventListener('click', () => {
            const preset = item.dataset.preset;
            selectPreset(preset);
        });
    });

    // 模型标签点击事件
    document.querySelectorAll('.model-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const modelName = tag.dataset.model;
            selectModel(modelName);
        });
    });
}

// 加载AI设置
function loadAISettings() {
    const saved = localStorage.getItem('ai-assistant-settings');
    if (saved) {
        const settings = JSON.parse(saved);

        // 应用保存的设置
        document.querySelector(`input[name="ai-provider"][value="${settings.provider}"]`).checked = true;
        document.getElementById('api-key').value = settings.apiKey || '';
        document.getElementById('api-endpoint').value = settings.apiEndpoint || '';
        document.getElementById('api-model').value = settings.apiModel || '';
        document.getElementById('creativity-level').value = settings.creativity || 70;
        document.querySelector('.range-value').textContent = (settings.creativity || 70) + '%';
        document.getElementById('response-length').value = settings.responseLength || 'medium';
        document.getElementById('include-comments').checked = settings.includeComments !== false;
        document.getElementById('auto-apply').checked = settings.autoApply !== false;

        aiAssistant.currentProvider = settings.provider || 'gemini';
        aiAssistant.apiKey = settings.apiKey || '';
        aiAssistant.settings = {
            creativity: settings.creativity || 70,
            responseLength: settings.responseLength || 'medium',
            includeComments: settings.includeComments !== false,
            autoApply: settings.autoApply !== false
        };

        // 更新UI状态
        updateUIBasedOnProvider(aiAssistant.currentProvider);
    } else {
        loadDefaultAISettings();
    }
}

function loadDefaultAISettings() {
    document.querySelector('input[name="ai-provider"][value="gemini"]').checked = true;
    document.getElementById('creativity-level').value = 70;
    document.querySelector('.range-value').textContent = '70%';
    document.getElementById('response-length').value = 'medium';
    document.getElementById('include-comments').checked = true;
    document.getElementById('auto-apply').checked = true;
}

// 切换AI聊天窗口
function toggleAIChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const fab = document.getElementById('ai-fab');

    if (aiAssistant.isOpen) {
        closeAIChat();
    } else {
        chatWindow.classList.add('active');
        fab.style.display = 'none';
        aiAssistant.isOpen = true;

        // 检查API密钥
        if (!aiAssistant.apiKey) {
            addMessage('assistant', '👋 欢迎使用AI样式助手！\n\n请先在设置中配置您的API密钥。点击右上角设置按钮 ⚙️ 开始配置。', true);
        }
    }
}

function minimizeAIChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.classList.toggle('minimized');
    aiAssistant.isMinimized = !aiAssistant.isMinimized;
}

function closeAIChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const fab = document.getElementById('ai-fab');

    chatWindow.classList.remove('active');
    fab.style.display = 'flex';
    aiAssistant.isOpen = false;
    aiAssistant.isMinimized = false;
}

// 更新聊天输入框
function updateChatInput() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const charCount = document.querySelector('.char-count');

    const length = input.value.length;
    charCount.textContent = `${length}/500`;

    sendBtn.disabled = length === 0 || length > 500;

    // 自动调整高度
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

// 处理聊天输入键盘事件
function handleChatKeydown(e) {
    if (e.key === 'Enter') {
        if (e.shiftKey) {
            // Shift+Enter 换行
            return;
        } else {
            // Enter 发送
            e.preventDefault();
            sendMessage();
        }
    }
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message || message.length > 500) return;

    // 检查API密钥
    if (!aiAssistant.apiKey) {
        addMessage('assistant', '请先在设置中配置API密钥后再使用。', true);
        return;
    }

    // 添加用户消息
    addMessage('user', message);
    input.value = '';
    updateChatInput();

    // 添加加载消息
    const loadingId = addMessage('assistant', '正在思考中<span class="loading-dots"></span>', true);

    try {
        // 调用AI API
        const response = await callAIAPI(message);

        // 移除加载消息
        removeMessage(loadingId);

        // 添加AI回复
        addMessage('assistant', response, false, true);

    } catch (error) {
        console.error('AI API调用失败:', error);
        removeMessage(loadingId);

        // 使用增强的错误提示
        const detailedError = getDetailedErrorMessage(error, aiAssistant.currentProvider);
        addMessage('assistant', detailedError, true);
    }
}

// 调用AI API
async function callAIAPI(prompt) {
    const enhancedPrompt = createEnhancedPrompt(prompt);

    try {
        switch (aiAssistant.currentProvider) {
            case 'gemini':
                return await callGeminiAPI(enhancedPrompt);
            case 'claude':
                return await callClaudeAPI(enhancedPrompt);
            case 'openai':
                return await callOpenAIAPI(enhancedPrompt);
            case 'openai-compatible':
                return await callOpenAICompatibleAPI(enhancedPrompt);
            default:
                throw new Error('不支持的AI提供商');
        }
    } catch (error) {
        throw new Error(`API调用失败: ${error.message}`);
    }
}

// 创建增强的提示词
function createEnhancedPrompt(userPrompt) {
    const systemPrompt = `你是一个专业的CSS样式生成助手。请根据用户的描述生成高质量的CSS代码。

要求：
1. 生成现代化、美观的CSS样式
2. 包含完整的CSS规则，可以直接使用
3. ${aiAssistant.settings.includeComments ? '添加清晰的中文注释说明' : '不需要添加注释'}
4. 确保兼容性良好，支持现代浏览器
5. 使用语义化的类名
6. 适当使用CSS3特性（渐变、阴影、动画等）

响应格式：
- 先简单说明效果
- 然后提供完整的CSS代码
- 代码要用\`\`\`css 代码块包围

用户需求：${userPrompt}`;

    return systemPrompt;
}

// Gemini API调用
async function callGeminiAPI(prompt) {
    const apiKey = aiAssistant.apiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: aiAssistant.settings.creativity / 100,
                maxOutputTokens: aiAssistant.settings.responseLength === 'short' ? 512 :
                                aiAssistant.settings.responseLength === 'medium' ? 1024 : 2048
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '生成失败，请重试。';
}

// Claude API调用
async function callClaudeAPI(prompt) {
    const apiKey = aiAssistant.apiKey;
    const url = 'https://api.anthropic.com/v1/messages';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: aiAssistant.settings.responseLength === 'short' ? 512 :
                        aiAssistant.settings.responseLength === 'medium' ? 1024 : 2048,
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: aiAssistant.settings.creativity / 100
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '生成失败，请重试。';
}

// OpenAI API调用
async function callOpenAIAPI(prompt) {
    const apiKey = aiAssistant.apiKey;
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: aiAssistant.settings.creativity / 100,
            max_tokens: aiAssistant.settings.responseLength === 'short' ? 512 :
                        aiAssistant.settings.responseLength === 'medium' ? 1024 : 2048
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '生成失败，请重试。';
}

// OpenAI兼容API调用
async function callOpenAICompatibleAPI(prompt) {
    const apiKey = aiAssistant.apiKey;
    const endpoint = document.getElementById('api-endpoint').value.trim();
    const model = document.getElementById('api-model').value.trim() || 'gpt-3.5-turbo';

    if (!endpoint) {
        throw new Error('请配置API端点地址');
    }

    // 确保端点格式正确
    const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const url = baseUrl.includes('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: aiAssistant.settings.creativity / 100,
            max_tokens: aiAssistant.settings.responseLength === 'short' ? 512 :
                        aiAssistant.settings.responseLength === 'medium' ? 1024 : 2048,
            stream: false
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = `HTTP ${response.status}`;

        if (errorData.error) {
            errorMessage = errorData.error.message || errorData.error || errorMessage;
        }

        // 提供更友好的错误提示
        if (response.status === 401) {
            errorMessage = 'API密钥无效，请检查密钥是否正确';
        } else if (response.status === 403) {
            errorMessage = 'API访问被拒绝，请检查密钥权限';
        } else if (response.status === 429) {
            errorMessage = 'API调用频率超限，请稍后重试';
        } else if (response.status === 500) {
            errorMessage = 'API服务器错误，请稍后重试';
        }

        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '生成失败，请重试。';
}

// 添加消息到聊天窗口
function addMessage(type, content, isPlain = false, hasCode = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageId = 'msg-' + Date.now();

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.id = messageId;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (isPlain) {
        messageContent.innerHTML = `<p>${content}</p>`;
    } else {
        // 处理Markdown格式的消息
        const formattedContent = formatMessageContent(content, hasCode);
        messageContent.innerHTML = formattedContent;
    }

    messageEl.appendChild(avatar);
    messageEl.appendChild(messageContent);
    messagesContainer.appendChild(messageEl);

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageId;
}

// 移除消息
function removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

// 格式化消息内容
function formatMessageContent(content, hasCode = false) {
    // 处理代码块
    content = content.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'css';
        const codeId = 'code-' + Date.now() + Math.random().toString(36).substr(2, 5);

        return `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-title">${language.toUpperCase()}</span>
                    <div class="code-actions">
                        <button class="code-action-btn" onclick="copyCode('${codeId}')">复制</button>
                        <button class="code-action-btn" onclick="applyCode('${codeId}', '${language}')">应用</button>
                    </div>
                </div>
                <pre id="${codeId}"><code>${code.trim()}</code></pre>
            </div>
        `;
    });

    // 处理段落
    const paragraphs = content.split('\n\n');
    return paragraphs.map(p => p.trim()).filter(p => p).map(p => {
        if (p.includes('<div class="code-block">')) {
            return p;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
}

// 复制代码
window.copyCode = function(codeId) {
    const codeElement = document.getElementById(codeId);
    const code = codeElement.textContent;

    navigator.clipboard.writeText(code).then(() => {
        showNotification('代码已复制到剪贴板', 'success');
    }).catch(() => {
        // 备用复制方法
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('代码已复制到剪贴板', 'success');
    });
};

// 应用代码到生成器
window.applyCode = function(codeId, language) {
    const codeElement = document.getElementById(codeId);
    const code = codeElement.textContent;

    if (language === 'css' && aiAssistant.settings.autoApply) {
        // 自动应用到CSS生成器
        showNotification('代码已应用到CSS生成器', 'success');

        // 如果在CSS生成器页面，直接应用
        if (window.location.pathname.includes('CSS-Generator')) {
            applyCodeToCSSGenerator(code);
        } else {
            // 保存到本地存储，CSS生成器页面加载时应用
            localStorage.setItem('ai-generated-css', code);
        }
    } else {
        // 只复制代码
        window.copyCode(codeId);
    }
};

// 应用代码到CSS生成器
function applyCodeToCSSGenerator(code) {
    // 这里可以根据具体的CSS生成器实现来应用代码
    console.log('应用CSS代码到生成器:', code);
}

// 清空聊天
function clearChat() {
    if (confirm('确定要清空聊天记录吗？')) {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="message assistant">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>👋 你好！我是AI样式助手。</p>
                    <p>告诉我你想要什么样的CSS效果，我来帮你生成代码！</p>
                    <div class="quick-actions">
                        <button class="quick-btn" data-prompt="生成拟态风格的按钮样式">🎯 拟态按钮</button>
                        <button class="quick-btn" data-prompt="创建玻璃态毛玻璃效果">🔮 玻璃态</button>
                        <button class="quick-btn" data-prompt="设计渐变背景和阴影">🌈 渐变阴影</button>
                        <button class="quick-btn" data-prompt="制作悬浮卡片效果">📋 悬浮卡片</button>
                    </div>
                </div>
            </div>
        `;

        // 重新绑定快速操作按钮
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                document.getElementById('chat-input').value = prompt;
                updateChatInput();
                sendMessage();
            });
        });

        showNotification('聊天记录已清空', 'info');
    }
}

// 设置AI提供商模板
function setupAIProviderTemplates() {
    updateProviderInfo();
}

function updateProviderInfo() {
    const statusIndicator = document.querySelector('.status-indicator');

    if (aiAssistant.apiKey) {
        statusIndicator.className = 'status-indicator online';
    } else {
        statusIndicator.className = 'status-indicator offline';
    }
}

// 全局模态框函数
window.showModal = function(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
};

// 预设配置数据
const apiPresets = {
    openai: {
        name: 'OpenAI 官方',
        endpoint: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo',
        description: 'OpenAI官方API服务'
    },
    azure: {
        name: 'Azure OpenAI',
        endpoint: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment',
        model: 'gpt-35-turbo',
        description: '微软Azure OpenAI服务'
    },
    oneapi: {
        name: 'One API',
        endpoint: 'https://your-domain.com/v1',
        model: 'gpt-3.5-turbo',
        description: '通用OpenAI API中转服务'
    },
    newapi: {
        name: 'New API',
        endpoint: 'https://your-domain.com/v1',
        model: 'gpt-3.5-turbo',
        description: '高性能API中转服务'
    },
    deepseek: {
        name: 'DeepSeek',
        endpoint: 'https://api.deepseek.com/v1',
        model: 'deepseek-chat',
        description: 'DeepSeek AI服务'
    },
    moonshot: {
        name: 'Moonshot AI',
        endpoint: 'https://api.moonshot.cn/v1',
        model: 'moonshot-v1-8k',
        description: 'Kimi长文本模型'
    },
    zhipu: {
        name: '智谱AI',
        endpoint: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4',
        description: '智谱AI GLM模型'
    },
    custom: {
        name: '自定义',
        endpoint: '',
        model: 'gpt-3.5-turbo',
        description: '手动配置API端点'
    }
};

// 选择预设配置
function selectPreset(presetKey) {
    const preset = apiPresets[presetKey];
    if (!preset) return;

    // 更新预设选择状态
    document.querySelectorAll('.preset-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`[data-preset="${presetKey}"]`).classList.add('selected');

    // 填充配置信息
    if (presetKey !== 'custom') {
        document.getElementById('api-endpoint').value = preset.endpoint;
        document.getElementById('api-model').value = preset.model;
    } else {
        document.getElementById('api-endpoint').value = '';
        document.getElementById('api-model').value = 'gpt-3.5-turbo';
    }

    // 显示提示信息
    showNotification(`已选择 ${preset.name}`, 'success');

    // 隐藏预设面板
    setTimeout(() => {
        document.getElementById('endpoint-presets').style.display = 'none';
    }, 1000);
}

// 选择模型
function selectModel(modelName) {
    document.getElementById('api-model').value = modelName;

    // 高亮选中的标签
    document.querySelectorAll('.model-tag').forEach(tag => {
        tag.style.background = '#f7fafc';
        tag.style.color = '#4a5568';
        tag.style.borderColor = '#e2e8f0';
    });

    const selectedTag = document.querySelector(`[data-model="${modelName}"]`);
    if (selectedTag) {
        selectedTag.style.background = '#667eea';
        selectedTag.style.color = 'white';
        selectedTag.style.borderColor = '#667eea';
    }

    showNotification(`已选择模型: ${modelName}`, 'success');

    // 隐藏建议面板
    setTimeout(() => {
        document.getElementById('model-suggestions-panel').style.display = 'none';
    }, 1000);
}

// 根据提供商更新UI
function updateUIBasedOnProvider(provider) {
    const endpointGroup = document.getElementById('endpoint-group');
    const modelGroup = document.getElementById('model-group');
    const endpointHelp = document.getElementById('endpoint-help');

    if (provider === 'openai-compatible') {
        endpointGroup.style.display = 'block';
        modelGroup.style.display = 'block';
        endpointHelp.textContent = '支持OpenAI兼容的API服务，如One API、New API等';

        // 显示预设按钮
        document.querySelector('.preset-btn').style.display = 'flex';
    } else if (provider === 'openai') {
        endpointGroup.style.display = 'block';
        modelGroup.style.display = 'block';
        endpointHelp.textContent = '使用OpenAI官方API或自定义端点';

        // 设置默认值
        document.getElementById('api-endpoint').value = 'https://api.openai.com/v1';
        document.getElementById('api-model').value = 'gpt-3.5-turbo';

        document.querySelector('.preset-btn').style.display = 'flex';
    } else {
        endpointGroup.style.display = 'none';
        modelGroup.style.display = 'none';
        document.querySelector('.preset-btn').style.display = 'none';
    }

    // 更新帮助文本
    switch (provider) {
        case 'gemini':
            endpointHelp.textContent = '使用Google Gemini API';
            break;
        case 'claude':
            endpointHelp.textContent = '使用Anthropic Claude API';
            break;
    }
}

// 增强错误处理
function getDetailedErrorMessage(error, provider) {
    let message = error.message;

    // 根据不同提供商提供特定的错误提示
    if (provider === 'gemini') {
        if (message.includes('API_KEY_INVALID')) {
            return '🔑 Gemini API密钥无效\n\n请检查：\n1. 密钥格式是否正确\n2. 是否已启用Gemini API\n3. 访问地区是否受限';
        }
        if (message.includes('QUOTA_EXCEEDED')) {
            return '📊 Gemini API配额已用完\n\n请等待配额重置或升级账户';
        }
    } else if (provider === 'claude') {
        if (message.includes('invalid_api_key')) {
            return '🔑 Claude API密钥无效\n\n请检查密钥是否正确配置';
        }
        if (message.includes('rate_limit')) {
            return '⏰ Claude API调用频率超限\n\n请稍后重试';
        }
    } else if (provider === 'openai' || provider === 'openai-compatible') {
        if (message.includes('Invalid API key') || message.includes('401')) {
            return '🔑 API密钥无效\n\n请检查：\n1. 密钥是否正确\n2. 密钥是否有效\n3. 端点地址是否正确';
        }
        if (message.includes('insufficient_quota') || message.includes('429')) {
            return '💳 API配额不足或调用频率超限\n\n请检查账户余额或稍后重试';
        }
        if (message.includes('model_not_found')) {
            return '🤖 模型不存在\n\n请检查模型名称是否正确';
        }
    }

    return `❌ ${message}\n\n如果问题持续，请检查网络连接和API配置`;
}

console.log('AI助手功能已加载 - 支持OpenAI兼容API ✨');