// 图标设计工具 - 主要功能脚本

// 全局变量
let currentTool = 'select';
let isDrawing = false;
let startX, startY;
let currentElement = null;
let selectedElement = null;
let zoomLevel = 100;
let undoStack = [];
let redoStack = [];

// SVG命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeTools();
    initializeCanvas();
    initializeStyleControls();
    initializeLibrary();
    setupEventListeners();
    saveState(); // 保存初始状态
});

// 初始化工具
function initializeTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他工具的激活状态
            toolButtons.forEach(b => b.classList.remove('active'));
            // 激活当前工具
            this.classList.add('active');
            currentTool = this.dataset.tool;

            // 清除选中状态
            clearSelection();

            // 更新鼠标样式
            updateCursor();
        });
    });
}

// 初始化画布
function initializeCanvas() {
    const svg = document.getElementById('main-svg');
    const canvasSize = document.getElementById('canvas-size');

    // 画布大小改变
    canvasSize.addEventListener('change', function() {
        const size = parseInt(this.value);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        saveState();
    });

    // 鼠标事件
    svg.addEventListener('mousedown', handleMouseDown);
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('click', handleClick);

    // 网格控制
    const showGrid = document.getElementById('show-grid');
    showGrid.addEventListener('change', function() {
        if (this.checked) {
            svg.classList.remove('hide-grid');
        } else {
            svg.classList.add('hide-grid');
        }
    });
}

// 初始化样式控制
function initializeStyleControls() {
    const fillColor = document.getElementById('fill-color');
    const strokeColor = document.getElementById('stroke-color');
    const strokeWidth = document.getElementById('stroke-width');
    const opacity = document.getElementById('opacity');
    const noFill = document.getElementById('no-fill');
    const noStroke = document.getElementById('no-stroke');

    // 值显示更新
    const strokeWidthValue = document.getElementById('stroke-width-value');
    const opacityValue = document.getElementById('opacity-value');

    strokeWidth.addEventListener('input', function() {
        strokeWidthValue.textContent = this.value;
        updateSelectedElementStyle();
    });

    opacity.addEventListener('input', function() {
        opacityValue.textContent = this.value;
        updateSelectedElementStyle();
    });

    fillColor.addEventListener('input', updateSelectedElementStyle);
    strokeColor.addEventListener('input', updateSelectedElementStyle);

    // 无填充/无边框按钮
    noFill.addEventListener('click', function() {
        this.classList.toggle('active');
        updateSelectedElementStyle();
    });

    noStroke.addEventListener('click', function() {
        this.classList.toggle('active');
        updateSelectedElementStyle();
    });
}

// 初始化图标库
function initializeLibrary() {
    const libTabs = document.querySelectorAll('.lib-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    libTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 切换标签
            libTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redoAction();
                    } else {
                        undoAction();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    redoAction();
                    break;
                case 'a':
                    e.preventDefault();
                    selectAll();
                    break;
                case 'c':
                    e.preventDefault();
                    copySelected();
                    break;
                case 'v':
                    e.preventDefault();
                    pasteElement();
                    break;
            }
        }

        // Delete键删除选中元素
        if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteSelected();
        }

        // Escape键取消选择
        if (e.key === 'Escape') {
            clearSelection();
        }
    });

    // 防止右键菜单
    document.getElementById('main-svg').addEventListener('contextmenu', e => e.preventDefault());
}

// 鼠标按下事件
function handleMouseDown(e) {
    if (currentTool === 'select') {
        handleSelectMouseDown(e);
    } else {
        handleDrawMouseDown(e);
    }
}

// 选择工具鼠标按下
function handleSelectMouseDown(e) {
    const element = e.target.closest('[data-element]');
    if (element && element !== document.getElementById('main-svg')) {
        selectElement(element);
    } else {
        clearSelection();
    }
}

// 绘制工具鼠标按下
function handleDrawMouseDown(e) {
    if (e.target.id === 'main-svg' || e.target.classList.contains('grid-bg')) {
        isDrawing = true;
        const rect = e.target.getBoundingClientRect();
        const svg = document.getElementById('main-svg');
        const viewBox = svg.viewBox.baseVal;

        startX = (e.clientX - rect.left) * viewBox.width / rect.width;
        startY = (e.clientY - rect.top) * viewBox.height / rect.height;

        // 网格对齐
        if (document.getElementById('snap-to-grid').checked) {
            startX = Math.round(startX / 4) * 4;
            startY = Math.round(startY / 4) * 4;
        }

        startDrawing();
    }
}

// 开始绘制
function startDrawing() {
    const svg = document.getElementById('main-svg');

    switch(currentTool) {
        case 'rectangle':
            currentElement = createRectangle(startX, startY, 0, 0);
            break;
        case 'circle':
            currentElement = createCircle(startX, startY, 0);
            break;
        case 'line':
            currentElement = createLine(startX, startY, startX, startY);
            break;
        case 'path':
            currentElement = createPath(startX, startY);
            break;
        case 'text':
            currentElement = createText(startX, startY, '文字');
            isDrawing = false; // 文字工具不需要拖拽
            makeTextEditable(currentElement);
            break;
    }

    if (currentElement) {
        svg.appendChild(currentElement);
        applyCurrentStyles(currentElement);
        currentElement.setAttribute('data-element', 'true');
    }
}

// 鼠标移动事件
function handleMouseMove(e) {
    if (!isDrawing || !currentElement) return;

    const rect = e.target.getBoundingClientRect();
    const svg = document.getElementById('main-svg');
    const viewBox = svg.viewBox.baseVal;

    let currentX = (e.clientX - rect.left) * viewBox.width / rect.width;
    let currentY = (e.clientY - rect.top) * viewBox.height / rect.height;

    // 网格对齐
    if (document.getElementById('snap-to-grid').checked) {
        currentX = Math.round(currentX / 4) * 4;
        currentY = Math.round(currentY / 4) * 4;
    }

    updateDrawing(currentX, currentY);
}

// 更新绘制
function updateDrawing(currentX, currentY) {
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);

    switch(currentTool) {
        case 'rectangle':
            currentElement.setAttribute('x', x);
            currentElement.setAttribute('y', y);
            currentElement.setAttribute('width', width);
            currentElement.setAttribute('height', height);
            break;
        case 'circle':
            const radius = Math.sqrt(width * width + height * height) / 2;
            currentElement.setAttribute('cx', startX);
            currentElement.setAttribute('cy', startY);
            currentElement.setAttribute('r', radius);
            break;
        case 'line':
            currentElement.setAttribute('x2', currentX);
            currentElement.setAttribute('y2', currentY);
            break;
    }
}

// 鼠标抬起事件
function handleMouseUp(e) {
    if (isDrawing) {
        isDrawing = false;
        if (currentElement) {
            selectElement(currentElement);
            saveState();
        }
        currentElement = null;
    }
}

// 点击事件
function handleClick(e) {
    if (currentTool === 'text' && !isDrawing) {
        // 文字工具的点击处理在startDrawing中已经处理
    }
}

// 创建元素函数
function createRectangle(x, y, width, height) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    return rect;
}

function createCircle(cx, cy, r) {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    return circle;
}

function createLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    return line;
}

function createPath(startX, startY) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${startX} ${startY}`);
    return path;
}

function createText(x, y, content) {
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '12');
    text.textContent = content;
    return text;
}

// 应用当前样式
function applyCurrentStyles(element) {
    const fillColor = document.getElementById('fill-color').value;
    const strokeColor = document.getElementById('stroke-color').value;
    const strokeWidth = document.getElementById('stroke-width').value;
    const opacity = document.getElementById('opacity').value;
    const noFill = document.getElementById('no-fill').classList.contains('active');
    const noStroke = document.getElementById('no-stroke').classList.contains('active');

    element.setAttribute('fill', noFill ? 'none' : fillColor);
    element.setAttribute('stroke', noStroke ? 'none' : strokeColor);
    element.setAttribute('stroke-width', strokeWidth);
    element.setAttribute('opacity', opacity);
}

// 更新选中元素样式
function updateSelectedElementStyle() {
    if (!selectedElement) return;
    applyCurrentStyles(selectedElement);
}

// 选择元素
function selectElement(element) {
    clearSelection();
    selectedElement = element;
    element.classList.add('selected');

    // 更新样式控制器的值
    updateStyleControlsFromElement(element);
}

// 更新样式控制器的值
function updateStyleControlsFromElement(element) {
    const fill = element.getAttribute('fill') || '#007bff';
    const stroke = element.getAttribute('stroke') || '#000000';
    const strokeWidth = element.getAttribute('stroke-width') || '2';
    const opacity = element.getAttribute('opacity') || '1';

    if (fill !== 'none') {
        document.getElementById('fill-color').value = fill;
        document.getElementById('no-fill').classList.remove('active');
    } else {
        document.getElementById('no-fill').classList.add('active');
    }

    if (stroke !== 'none') {
        document.getElementById('stroke-color').value = stroke;
        document.getElementById('no-stroke').classList.remove('active');
    } else {
        document.getElementById('no-stroke').classList.add('active');
    }

    document.getElementById('stroke-width').value = strokeWidth;
    document.getElementById('stroke-width-value').textContent = strokeWidth;

    document.getElementById('opacity').value = opacity;
    document.getElementById('opacity-value').textContent = opacity;
}

// 清除选择
function clearSelection() {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
    }
}

// 删除选中元素
function deleteSelected() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        saveState();
        showSuccessToast('元素已删除');
    }
}

// 清空画布
function clearCanvas() {
    const svg = document.getElementById('main-svg');
    const elements = svg.querySelectorAll('[data-element]');
    elements.forEach(el => el.remove());
    clearSelection();
    saveState();
    showSuccessToast('画布已清空');
}

// 保存状态（用于撤销/重做）
function saveState() {
    const svg = document.getElementById('main-svg');
    const state = svg.innerHTML;
    undoStack.push(state);

    // 限制撤销栈大小
    if (undoStack.length > 50) {
        undoStack.shift();
    }

    // 清空重做栈
    redoStack = [];
}

// 撤销操作
function undoAction() {
    if (undoStack.length > 1) {
        const currentState = undoStack.pop();
        redoStack.push(currentState);

        const svg = document.getElementById('main-svg');
        svg.innerHTML = undoStack[undoStack.length - 1];

        clearSelection();
        showSuccessToast('已撤销');
    }
}

// 重做操作
function redoAction() {
    if (redoStack.length > 0) {
        const state = redoStack.pop();
        undoStack.push(state);

        const svg = document.getElementById('main-svg');
        svg.innerHTML = state;

        clearSelection();
        showSuccessToast('已重做');
    }
}

// 缩放控制
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 25, 500);
    updateZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 25, 25);
    updateZoom();
}

function updateZoom() {
    const svg = document.getElementById('main-svg');
    const scale = zoomLevel / 100;
    svg.style.transform = `scale(${scale})`;
    document.getElementById('zoom-level').textContent = `${zoomLevel}%`;
}

// 更新鼠标样式
function updateCursor() {
    const svg = document.getElementById('main-svg');
    switch(currentTool) {
        case 'select':
            svg.style.cursor = 'default';
            break;
        case 'text':
            svg.style.cursor = 'text';
            break;
        default:
            svg.style.cursor = 'crosshair';
            break;
    }
}

// 文字编辑
function makeTextEditable(textElement) {
    const text = textElement.textContent;
    const newText = prompt('输入文字内容:', text);
    if (newText !== null) {
        textElement.textContent = newText;
        saveState();
    }
}

// 导出SVG
function exportSVG() {
    const svg = document.getElementById('main-svg');
    const svgData = new XMLSerializer().serializeToString(svg);

    // 清理SVG代码
    const cleanSvg = svgData
        .replace(/class="[^"]*"/g, '') // 移除class属性
        .replace(/style="[^"]*"/g, '') // 移除style属性
        .replace(/data-element="[^"]*"/g, ''); // 移除data-element属性

    document.getElementById('svg-code').value = cleanSvg;
    showModal('svg-modal');
}

// 复制SVG代码
function copySVGCode() {
    const textarea = document.getElementById('svg-code');
    textarea.select();
    document.execCommand('copy');
    showSuccessToast('SVG代码已复制到剪贴板');
}

// 下载SVG
function downloadSVG() {
    const svgCode = document.getElementById('svg-code').value;
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'icon.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccessToast('SVG文件已下载');
}

// 导出PNG
function exportPNG() {
    const svg = document.getElementById('main-svg');
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(function(blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'icon.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            showSuccessToast('PNG图片已下载');
        });

        URL.revokeObjectURL(url);
    };

    img.src = url;
}

// 保存项目
function saveProject() {
    const projectData = {
        svg: document.getElementById('main-svg').innerHTML,
        settings: {
            canvasSize: document.getElementById('canvas-size').value,
            showGrid: document.getElementById('show-grid').checked,
            snapToGrid: document.getElementById('snap-to-grid').checked
        },
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'icon-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccessToast('项目已保存');
}

// 加载图标模板
function loadTemplate(templateName) {
    const templates = {
        heart: '<path d="M32 56L29.6 53.9C18.4 43.8 10.7 36.8 10.7 28C10.7 20.9 16.3 15.3 23.4 15.3C27.3 15.3 31.1 17.2 32 20.2C32.9 17.2 36.7 15.3 40.6 15.3C47.7 15.3 53.3 20.9 53.3 28C53.3 36.8 45.6 43.8 34.4 53.9L32 56Z" fill="#e74c3c"/>',

        star: '<path d="M32 8L36.9 22.1L52 24.9L42 34.6L44.8 49.7L32 42.6L19.2 49.7L22 34.6L12 24.9L27.1 22.1L32 8Z" fill="#f1c40f"/>',

        home: '<path d="M32 12L52 30H46V52H38V36H26V52H18V30H12L32 12Z" fill="#3498db"/>',

        user: '<circle cx="32" cy="22" r="10" fill="#95a5a6"/><path d="M32 36C22.1 36 14 38.7 14 42V50H50V42C50 38.7 41.9 36 32 36Z" fill="#95a5a6"/>',

        settings: '<path d="M32 40C28.7 40 26 37.3 26 34C26 30.7 28.7 28 32 28C35.3 28 38 30.7 38 34C38 37.3 35.3 40 32 40ZM52.9 37.4L49.6 40.7C49.8 41.8 49.8 42.2 49.8 43C49.8 43.8 49.7 44.2 49.6 45.3L52.9 48.6C53.2 48.9 53.3 49.4 53.1 49.8L50.1 55.2C49.9 55.6 49.4 55.7 49 55.5L44.8 53.3C43.6 54.2 42.3 54.9 40.8 55.3L40.2 59.9C40.1 60.4 39.7 60.7 39.2 60.7H33.2C32.7 60.7 32.3 60.4 32.2 59.9L31.6 55.3C30.1 54.9 28.8 54.2 27.6 53.3L23.4 55.5C23 55.7 22.5 55.6 22.3 55.2L19.3 49.8C19.1 49.4 19.2 48.9 19.5 48.6L22.8 45.3C22.6 44.2 22.6 43.8 22.6 43C22.6 42.2 22.7 41.8 22.8 40.7L19.5 37.4C19.2 37.1 19.1 36.6 19.3 36.2L22.3 30.8C22.5 30.4 23 30.3 23.4 30.5L27.6 32.7C28.8 31.8 30.1 31.1 31.6 30.7L32.2 26.1C32.3 25.6 32.7 25.3 33.2 25.3H39.2C39.7 25.3 40.1 25.6 40.2 26.1L40.8 30.7C42.3 31.1 43.6 31.8 44.8 32.7L49 30.5C49.4 30.3 49.9 30.4 50.1 30.8L53.1 36.2C53.3 36.6 53.2 37.1 52.9 37.4Z" fill="#34495e"/>',

        mail: '<path d="M54 14H10C7.2 14 5 16.2 5 19V45C5 47.8 7.2 50 10 50H54C56.8 50 59 47.8 59 45V19C59 16.2 56.8 14 54 14ZM54 22L32 32L10 22V19L32 29L54 19V22Z" fill="#3498db"/>'
    };

    if (templates[templateName]) {
        clearCanvas();
        const svg = document.getElementById('main-svg');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = templates[templateName];

        const pathElement = tempDiv.firstChild.cloneNode(true);
        pathElement.setAttribute('data-element', 'true');
        svg.appendChild(pathElement);

        saveState();
        showSuccessToast(`${templateName} 模板已加载`);

        // 添加到最近使用
        addToRecent(templateName, templates[templateName]);
    }
}

// 添加到最近使用
function addToRecent(name, svgContent) {
    const recentContainer = document.getElementById('recent-icons');
    const existingEmpty = recentContainer.querySelector('.empty-state');
    if (existingEmpty) {
        existingEmpty.remove();
    }

    const iconItem = document.createElement('div');
    iconItem.className = 'icon-item';
    iconItem.innerHTML = `
        <svg viewBox="0 0 64 64">${svgContent}</svg>
        <span>${name}</span>
    `;
    iconItem.onclick = () => loadTemplate(name);

    recentContainer.insertBefore(iconItem, recentContainer.firstChild);

    // 限制最近使用数量
    const recentItems = recentContainer.querySelectorAll('.icon-item');
    if (recentItems.length > 6) {
        recentItems[recentItems.length - 1].remove();
    }
}

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

// 关闭模态框
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('show'));
}

// 显示成功提示
function showSuccessToast(message) {
    // 移除现有提示
    const existing = document.querySelector('.success-toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});