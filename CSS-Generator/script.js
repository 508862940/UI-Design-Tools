// CSS样式生成器 - 主要功能脚本

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initGradientGenerator();
    initShadowGenerator();
    initAnimationGenerator();
    initButtonGenerator();
    initBorderGenerator();
});

// 标签页切换功能
function initTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const toolPanels = document.querySelectorAll('.tool-panel');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            navTabs.forEach(t => t.classList.remove('active'));
            toolPanels.forEach(p => p.classList.remove('active'));

            // 添加当前活动状态
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            targetPanel.classList.add('active');
        });
    });
}

// 渐变生成器
function initGradientGenerator() {
    const typeSelect = document.getElementById('gradient-type');
    const directionSelect = document.getElementById('gradient-direction');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const previewBox = document.getElementById('gradient-preview');
    const codeTextarea = document.getElementById('gradient-code');

    function updateGradient() {
        const type = typeSelect.value;
        const direction = directionSelect.value;
        const color1 = color1Input.value;
        const color2 = color2Input.value;

        let gradient;
        if (type === 'linear') {
            gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
        } else {
            gradient = `radial-gradient(circle, ${color1}, ${color2})`;
        }

        previewBox.style.background = gradient;
        codeTextarea.value = `background: ${gradient};`;
    }

    typeSelect.addEventListener('change', updateGradient);
    directionSelect.addEventListener('change', updateGradient);
    color1Input.addEventListener('input', updateGradient);
    color2Input.addEventListener('input', updateGradient);

    // 初始更新
    updateGradient();
}

// 阴影生成器
function initShadowGenerator() {
    const xInput = document.getElementById('shadow-x');
    const yInput = document.getElementById('shadow-y');
    const blurInput = document.getElementById('shadow-blur');
    const spreadInput = document.getElementById('shadow-spread');
    const colorInput = document.getElementById('shadow-color');
    const opacityInput = document.getElementById('shadow-opacity');
    const previewBox = document.getElementById('shadow-preview');
    const codeTextarea = document.getElementById('shadow-code');

    // 值显示元素
    const xValue = document.getElementById('shadow-x-value');
    const yValue = document.getElementById('shadow-y-value');
    const blurValue = document.getElementById('shadow-blur-value');
    const spreadValue = document.getElementById('shadow-spread-value');
    const opacityValue = document.getElementById('shadow-opacity-value');

    function updateShadow() {
        const x = xInput.value;
        const y = yInput.value;
        const blur = blurInput.value;
        const spread = spreadInput.value;
        const color = colorInput.value;
        const opacity = opacityInput.value;

        // 更新显示值
        xValue.textContent = x;
        yValue.textContent = y;
        blurValue.textContent = blur;
        spreadValue.textContent = spread;
        opacityValue.textContent = opacity;

        // 转换颜色为rgba
        const rgb = hexToRgb(color);
        const shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

        const boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;
        previewBox.style.boxShadow = boxShadow;
        codeTextarea.value = `box-shadow: ${boxShadow};`;
    }

    // 添加事件监听器
    [xInput, yInput, blurInput, spreadInput, colorInput, opacityInput].forEach(input => {
        input.addEventListener('input', updateShadow);
    });

    // 初始更新
    updateShadow();
}

// 动画生成器
function initAnimationGenerator() {
    const typeSelect = document.getElementById('animation-type');
    const durationInput = document.getElementById('animation-duration');
    const delayInput = document.getElementById('animation-delay');
    const timingSelect = document.getElementById('animation-timing');
    const countSelect = document.getElementById('animation-count');
    const codeTextarea = document.getElementById('animation-code');

    // 值显示元素
    const durationValue = document.getElementById('animation-duration-value');
    const delayValue = document.getElementById('animation-delay-value');

    function updateAnimation() {
        const type = typeSelect.value;
        const duration = durationInput.value;
        const delay = delayInput.value;
        const timing = timingSelect.value;
        const count = countSelect.value;

        // 更新显示值
        durationValue.textContent = duration;
        delayValue.textContent = delay;

        const animation = `${type} ${duration}s ${timing} ${delay}s ${count}`;
        codeTextarea.value = `animation: ${animation};\n\n/* 添加到CSS中: */\n@keyframes ${type} {\n  /* 动画关键帧已在样式表中定义 */\n}`;
    }

    // 添加事件监听器
    [typeSelect, durationInput, delayInput, timingSelect, countSelect].forEach(input => {
        input.addEventListener('input', updateAnimation);
        input.addEventListener('change', updateAnimation);
    });

    // 初始更新
    updateAnimation();
}

// 播放动画功能
function playAnimation() {
    const demoElement = document.querySelector('.animation-demo');
    const type = document.getElementById('animation-type').value;
    const duration = document.getElementById('animation-duration').value;
    const delay = document.getElementById('animation-delay').value;
    const timing = document.getElementById('animation-timing').value;
    const count = document.getElementById('animation-count').value;

    // 清除之前的动画
    demoElement.style.animation = 'none';

    // 强制重绘
    demoElement.offsetHeight;

    // 应用新动画
    const animation = `${type} ${duration}s ${timing} ${delay}s ${count === 'infinite' ? 'infinite' : count}`;
    demoElement.style.animation = animation;
}

// 按钮生成器
function initButtonGenerator() {
    const textInput = document.getElementById('button-text');
    const bgInput = document.getElementById('button-bg');
    const textColorInput = document.getElementById('button-text-color');
    const paddingInput = document.getElementById('button-padding');
    const radiusInput = document.getElementById('button-radius');
    const sizeInput = document.getElementById('button-size');
    const previewButton = document.getElementById('button-preview');
    const codeTextarea = document.getElementById('button-code');

    // 值显示元素
    const paddingValue = document.getElementById('button-padding-value');
    const radiusValue = document.getElementById('button-radius-value');
    const sizeValue = document.getElementById('button-size-value');

    function updateButton() {
        const text = textInput.value;
        const bg = bgInput.value;
        const textColor = textColorInput.value;
        const padding = paddingInput.value;
        const radius = radiusInput.value;
        const size = sizeInput.value;

        // 更新显示值
        paddingValue.textContent = padding;
        radiusValue.textContent = radius;
        sizeValue.textContent = size;

        // 更新预览按钮
        previewButton.textContent = text;
        previewButton.style.backgroundColor = bg;
        previewButton.style.color = textColor;
        previewButton.style.padding = `${padding}px ${parseInt(padding) * 1.5}px`;
        previewButton.style.borderRadius = `${radius}px`;
        previewButton.style.fontSize = `${size}px`;

        // 生成CSS代码
        const css = `.button {
  background-color: ${bg};
  color: ${textColor};
  padding: ${padding}px ${parseInt(padding) * 1.5}px;
  border: none;
  border-radius: ${radius}px;
  font-size: ${size}px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}`;

        codeTextarea.value = css;
    }

    // 添加事件监听器
    [textInput, bgInput, textColorInput, paddingInput, radiusInput, sizeInput].forEach(input => {
        input.addEventListener('input', updateButton);
    });

    // 初始更新
    updateButton();
}

// 边框生成器
function initBorderGenerator() {
    const widthInput = document.getElementById('border-width');
    const styleSelect = document.getElementById('border-style');
    const colorInput = document.getElementById('border-color');
    const radiusInput = document.getElementById('border-radius');
    const previewBox = document.getElementById('border-preview');
    const codeTextarea = document.getElementById('border-code');

    // 值显示元素
    const widthValue = document.getElementById('border-width-value');
    const radiusValue = document.getElementById('border-radius-value');

    function updateBorder() {
        const width = widthInput.value;
        const style = styleSelect.value;
        const color = colorInput.value;
        const radius = radiusInput.value;

        // 更新显示值
        widthValue.textContent = width;
        radiusValue.textContent = radius;

        // 更新预览
        previewBox.style.border = `${width}px ${style} ${color}`;
        previewBox.style.borderRadius = `${radius}px`;

        // 生成CSS代码
        const css = `border: ${width}px ${style} ${color};
border-radius: ${radius}px;`;

        codeTextarea.value = css;
    }

    // 添加事件监听器
    [widthInput, styleSelect, colorInput, radiusInput].forEach(input => {
        input.addEventListener('input', updateBorder);
        input.addEventListener('change', updateBorder);
    });

    // 初始更新
    updateBorder();
}

// 复制代码功能
function copyCode(textareaId) {
    const textarea = document.getElementById(textareaId);
    const button = event.target.closest('.copy-btn');

    // 选择并复制文本
    textarea.select();
    textarea.setSelectionRange(0, 99999); // 移动端兼容

    try {
        document.execCommand('copy');

        // 显示成功反馈
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> 已复制!';
        button.classList.add('copied');

        // 显示成功提示
        showSuccessToast('代码已复制到剪贴板!');

        // 2秒后恢复按钮状态
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);

    } catch (err) {
        console.error('复制失败:', err);
        showSuccessToast('复制失败，请手动选择复制');
    }
}

// 显示成功提示
function showSuccessToast(message) {
    // 移除现有的提示
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新提示
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    document.body.appendChild(toast);

    // 3秒后自动移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// 颜色转换工具函数
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 添加一些预设模板功能
function applyGradientPreset(type) {
    const presets = {
        sunset: { type: 'linear', direction: 'to right', color1: '#ff6b6b', color2: '#feca57' },
        ocean: { type: 'linear', direction: '45deg', color1: '#0abde3', color2: '#006ba6' },
        forest: { type: 'linear', direction: 'to bottom', color1: '#55a3ff', color2: '#003d82' },
        purple: { type: 'radial', direction: 'circle', color1: '#667eea', color2: '#764ba2' }
    };

    const preset = presets[type];
    if (preset) {
        document.getElementById('gradient-type').value = preset.type;
        document.getElementById('gradient-direction').value = preset.direction;
        document.getElementById('color1').value = preset.color1;
        document.getElementById('color2').value = preset.color2;

        // 触发更新
        document.getElementById('gradient-type').dispatchEvent(new Event('change'));
    }
}

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl+C 复制当前活动面板的代码
    if (e.ctrlKey && e.key === 'c' && e.target.tagName !== 'TEXTAREA') {
        const activePanel = document.querySelector('.tool-panel.active');
        if (activePanel) {
            const textarea = activePanel.querySelector('textarea');
            if (textarea) {
                copyCode(textarea.id);
                e.preventDefault();
            }
        }
    }
});

// 添加拖拽排序功能（未来扩展）
function initDragAndDrop() {
    // 为颜色选择器添加更多交互功能
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// 初始化额外功能
document.addEventListener('DOMContentLoaded', function() {
    initDragAndDrop();

    // 添加加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});