// =========== UI组件设计器 - 主脚本 ===========

let editor;
let currentDevice = 'desktop';

// 初始化编辑器
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    setupTabSwitching();
    setupDeviceViews();
});

// 初始化 GrapesJS 编辑器
function initializeEditor() {
    editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: 'auto',
        storageManager: false,

        // 禁用默认面板
        panels: { defaults: [] },

        // 设备管理器配置
        deviceManager: {
            devices: [
                {
                    name: 'Desktop',
                    width: '',
                },
                {
                    name: 'Tablet',
                    width: '768px',
                    widthMedia: '992px',
                },
                {
                    name: 'Mobile',
                    width: '320px',
                    widthMedia: '768px',
                }
            ]
        },

        // 画布配置
        canvas: {
            styles: [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
            ],
            scripts: []
        },

        // 组件配置
        blockManager: {
            appendTo: '.components-panel .panel-content',
            blocks: []
        },

        // 样式管理器配置
        styleManager: {
            appendTo: '.properties-panel .panel-content',
            sectors: []
        },

        // 资源管理器
        assetManager: {
            embedAsBase64: true,
        },

        // 默认内容
        components: `
            <div class="container">
                <div class="welcome-section">
                    <h1>欢迎使用UI设计器</h1>
                    <p>从左侧拖拽组件开始设计您的界面</p>
                </div>
            </div>
        `,

        style: `
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }

            .welcome-section {
                text-align: center;
                padding: 60px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                margin: 20px 0;
            }

            .welcome-section h1 {
                font-size: 2.5rem;
                margin-bottom: 16px;
                font-weight: 700;
            }

            .welcome-section p {
                font-size: 1.125rem;
                opacity: 0.9;
            }
        `
    });

    // 添加自定义组件
    addCustomComponents();

    // 设置选中组件时的属性面板更新
    editor.on('component:selected', updatePropertiesPanel);

    // 监听编辑器内容变化
    editor.on('component:add component:remove component:update', updateCanvasInfo);

    console.log('GrapesJS编辑器初始化完成');
}

// 添加自定义组件
function addCustomComponents() {
    const blockManager = editor.BlockManager;

    // 基础组件
    blockManager.add('text', {
        label: '文本',
        category: 'Basic',
        content: '<span data-gjs-type="text">这是一段文本</span>',
        media: '<i class="fas fa-font"></i>'
    });

    blockManager.add('heading', {
        label: '标题',
        category: 'Basic',
        content: '<h2>这是标题</h2>',
        media: '<i class="fas fa-heading"></i>'
    });

    blockManager.add('paragraph', {
        label: '段落',
        category: 'Basic',
        content: '<p>这是一个段落，您可以在这里添加更多的文本内容。</p>',
        media: '<i class="fas fa-paragraph"></i>'
    });

    blockManager.add('button', {
        label: '按钮',
        category: 'Basic',
        content: `
            <button class="btn-primary" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            ">点击按钮</button>
        `,
        media: '<i class="fas fa-mouse-pointer"></i>'
    });

    blockManager.add('link', {
        label: '链接',
        category: 'Basic',
        content: '<a href="#" style="color: #667eea; text-decoration: none;">这是一个链接</a>',
        media: '<i class="fas fa-link"></i>'
    });

    blockManager.add('image', {
        label: '图片',
        category: 'Basic',
        content: `
            <img src="https://via.placeholder.com/300x200/667eea/ffffff?text=图片"
                 alt="示例图片"
                 style="max-width: 100%; height: auto; border-radius: 8px;">
        `,
        media: '<i class="fas fa-image"></i>'
    });

    blockManager.add('icon', {
        label: '图标',
        category: 'Basic',
        content: '<i class="fas fa-star" style="font-size: 24px; color: #667eea;"></i>',
        media: '<i class="fas fa-star"></i>'
    });

    blockManager.add('divider', {
        label: '分割线',
        category: 'Basic',
        content: '<hr style="border: none; height: 2px; background: #e2e8f0; margin: 20px 0;">',
        media: '<i class="fas fa-minus"></i>'
    });

    // 布局组件
    blockManager.add('container', {
        label: '容器',
        category: 'Layout',
        content: `
            <div class="container" style="
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: #f8fafc;
                border-radius: 8px;
                border: 2px dashed #e2e8f0;
            ">
                <p style="text-align: center; color: #718096; margin: 40px 0;">
                    拖拽组件到这里
                </p>
            </div>
        `,
        media: '<i class="fas fa-square"></i>'
    });

    blockManager.add('section', {
        label: '区块',
        category: 'Layout',
        content: `
            <section style="
                padding: 40px 20px;
                margin: 20px 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            ">
                <h3 style="margin-bottom: 16px;">区块标题</h3>
                <p>这是一个区块内容区域</p>
            </section>
        `,
        media: '<i class="fas fa-layer-group"></i>'
    });

    blockManager.add('row', {
        label: '行',
        category: 'Layout',
        content: `
            <div class="row" style="
                display: flex;
                gap: 20px;
                margin: 20px 0;
                flex-wrap: wrap;
            ">
                <div style="flex: 1; min-width: 200px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                    <p>列 1</p>
                </div>
                <div style="flex: 1; min-width: 200px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                    <p>列 2</p>
                </div>
            </div>
        `,
        media: '<i class="fas fa-bars"></i>'
    });

    blockManager.add('column', {
        label: '列',
        category: 'Layout',
        content: `
            <div class="column" style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 2px dashed #e2e8f0;
                min-height: 100px;
            ">
                <p style="text-align: center; color: #718096;">列内容</p>
            </div>
        `,
        media: '<i class="fas fa-columns"></i>'
    });

    // 表单组件
    blockManager.add('input', {
        label: '输入框',
        category: 'Form',
        content: `
            <input type="text" placeholder="请输入内容" style="
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s ease;
            ">
        `,
        media: '<i class="fas fa-edit"></i>'
    });

    blockManager.add('textarea', {
        label: '文本域',
        category: 'Form',
        content: `
            <textarea placeholder="请输入多行文本" rows="4" style="
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                resize: vertical;
                font-family: inherit;
            "></textarea>
        `,
        media: '<i class="fas fa-align-left"></i>'
    });

    blockManager.add('select', {
        label: '下拉框',
        category: 'Form',
        content: `
            <select style="
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                background: white;
            ">
                <option>选项 1</option>
                <option>选项 2</option>
                <option>选项 3</option>
            </select>
        `,
        media: '<i class="fas fa-caret-down"></i>'
    });

    blockManager.add('checkbox', {
        label: '复选框',
        category: 'Form',
        content: `
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" style="margin: 0;">
                <span>复选框选项</span>
            </label>
        `,
        media: '<i class="fas fa-check-square"></i>'
    });

    blockManager.add('radio', {
        label: '单选框',
        category: 'Form',
        content: `
            <div>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 8px;">
                    <input type="radio" name="radio-group" style="margin: 0;">
                    <span>选项 1</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="radio-group" style="margin: 0;">
                    <span>选项 2</span>
                </label>
            </div>
        `,
        media: '<i class="fas fa-dot-circle"></i>'
    });

    // 媒体组件
    blockManager.add('video', {
        label: '视频',
        category: 'Media',
        content: `
            <video controls style="width: 100%; max-width: 600px; border-radius: 8px;">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                您的浏览器不支持视频标签。
            </video>
        `,
        media: '<i class="fas fa-video"></i>'
    });

    blockManager.add('audio', {
        label: '音频',
        category: 'Media',
        content: `
            <audio controls style="width: 100%; max-width: 400px;">
                <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                您的浏览器不支持音频标签。
            </audio>
        `,
        media: '<i class="fas fa-volume-up"></i>'
    });

    blockManager.add('iframe', {
        label: '嵌入',
        category: 'Media',
        content: `
            <iframe src="https://www.example.com"
                    width="100%"
                    height="300"
                    style="border: 1px solid #e2e8f0; border-radius: 8px;">
            </iframe>
        `,
        media: '<i class="fas fa-window-maximize"></i>'
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 头部按钮事件
    document.getElementById('preview-btn').addEventListener('click', showPreview);
    document.getElementById('export-btn').addEventListener('click', showExportModal);

    // 工具栏按钮事件
    document.getElementById('undo-btn').addEventListener('click', () => editor.UndoManager.undo());
    document.getElementById('redo-btn').addEventListener('click', () => editor.UndoManager.redo());
    document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
    document.getElementById('clear-btn').addEventListener('click', clearCanvas);

    // 模态框关闭事件
    document.querySelectorAll('.modal-overlay, .close-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el) {
                closeAllModals();
            }
        });
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// 设置标签切换
function setupTabSwitching() {
    // 组件面板标签切换
    document.querySelectorAll('.components-panel .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // 更新按钮状态
            document.querySelectorAll('.components-panel .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新内容显示
            document.querySelectorAll('.components-panel .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // 属性面板标签切换
    document.querySelectorAll('.properties-panel .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // 更新按钮状态
            document.querySelectorAll('.properties-panel .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新内容显示
            document.querySelectorAll('.properties-panel .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // 导出模态框标签切换
    document.querySelectorAll('.export-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // 更新按钮状态
            document.querySelectorAll('.export-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新内容显示
            document.querySelectorAll('.export-content textarea').forEach(textarea => {
                textarea.style.display = 'none';
            });
            document.getElementById(`export-${tabName}`).style.display = 'block';
        });
    });
}

// 设置设备视图切换
function setupDeviceViews() {
    const deviceButtons = {
        'desktop-view': 'Desktop',
        'tablet-view': 'Tablet',
        'mobile-view': 'Mobile'
    };

    Object.entries(deviceButtons).forEach(([btnId, deviceName]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            // 更新按钮状态
            document.querySelectorAll('[id$="-view"]').forEach(btn => btn.classList.remove('active'));
            document.getElementById(btnId).classList.add('active');

            // 切换设备
            editor.DeviceManager.select(deviceName);
            currentDevice = deviceName.toLowerCase();

            // 更新显示信息
            updateDeviceInfo(deviceName);
        });
    });
}

// 更新设备信息显示
function updateDeviceInfo(deviceName) {
    const deviceInfo = {
        'Desktop': { name: '桌面视图', size: '1200px' },
        'Tablet': { name: '平板视图', size: '768px' },
        'Mobile': { name: '手机视图', size: '320px' }
    };

    const info = deviceInfo[deviceName];
    document.querySelector('.current-device').textContent = info.name;
    document.querySelector('.canvas-size').textContent = info.size;
}

// 更新属性面板
function updatePropertiesPanel(component) {
    if (!component) return;

    const styles = component.getStyle();

    // 更新样式控件
    updateStyleControl('bg-color', styles['background-color'] || '');
    updateStyleControl('text-color', styles['color'] || '');
    updateStyleControl('width', styles['width'] || '');
    updateStyleControl('height', styles['height'] || '');

    // 更新间距控件
    updateStyleControl('margin-top', styles['margin-top'] || '');
    updateStyleControl('margin-right', styles['margin-right'] || '');
    updateStyleControl('margin-bottom', styles['margin-bottom'] || '');
    updateStyleControl('margin-left', styles['margin-left'] || '');

    updateStyleControl('padding-top', styles['padding-top'] || '');
    updateStyleControl('padding-right', styles['padding-right'] || '');
    updateStyleControl('padding-bottom', styles['padding-bottom'] || '');
    updateStyleControl('padding-left', styles['padding-left'] || '');

    // 更新元素属性
    const attrs = component.getAttributes();
    updateControl('element-id', attrs.id || '');
    updateControl('element-class', attrs.class || '');
    updateControl('element-content', component.get('content') || '');
}

// 更新控件值
function updateStyleControl(id, value) {
    const control = document.getElementById(id);
    if (control) {
        control.value = value;
    }
}

function updateControl(id, value) {
    const control = document.getElementById(id);
    if (control) {
        control.value = value;
    }
}

// 更新画布信息
function updateCanvasInfo() {
    // 这里可以添加实时统计信息更新
    console.log('画布内容已更新');
}

// 显示预览
function showPreview() {
    const html = editor.getHtml();
    const css = editor.getCss();

    const previewContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>预览</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            <style>
                body { margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; }
                ${css}
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;

    const previewFrame = document.getElementById('preview-frame');
    previewFrame.srcdoc = previewContent;

    showModal('preview-modal');
}

// 显示导出模态框
function showExportModal() {
    const html = editor.getHtml();
    const css = editor.getCss();
    const js = '// JavaScript 代码\nconsole.log("页面加载完成");';

    document.getElementById('export-html').value = formatCode(html, 'html');
    document.getElementById('export-css').value = formatCode(css, 'css');
    document.getElementById('export-js').value = js;

    showModal('export-modal');
}

// 代码格式化
function formatCode(code, type) {
    // 简单的代码格式化
    if (type === 'html') {
        return code
            .replace(/></g, '>\n<')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }
    if (type === 'css') {
        return code
            .replace(/\{/g, ' {\n  ')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n  ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }
    return code;
}

// 复制导出代码
function copyExportCode() {
    const activeTab = document.querySelector('.export-tab.active').dataset.tab;
    const textarea = document.getElementById(`export-${activeTab}`);

    textarea.select();
    document.execCommand('copy');

    // 显示复制成功提示
    showNotification('代码已复制到剪贴板！', 'success');
}

// 下载代码文件
function downloadCode() {
    const html = document.getElementById('export-html').value;
    const css = document.getElementById('export-css').value;
    const js = document.getElementById('export-js').value;

    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的UI设计</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;

    downloadFile('ui-design.html', fullHTML);
}

// 下载文件
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 清空画布
function clearCanvas() {
    if (confirm('确定要清空画布吗？此操作不可撤销。')) {
        editor.DomComponents.clear();
        editor.CssComposer.clear();
        showNotification('画布已清空', 'info');
    }
}

// 显示模态框
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
        <span>${message}</span>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加CSS动画
const animationCSS = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误:', e.error);
    showNotification('发生错误，请查看控制台', 'error');
});

// 确保在页面刷新前保存数据
window.addEventListener('beforeunload', function(e) {
    // 这里可以添加保存逻辑
});

console.log('UI设计器脚本加载完成');