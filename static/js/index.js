window.HELP_IMPROVE_VIDEOJS = false;

var NUM_INTERP_FRAMES = 240;

var interp_images = [];



$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    bulmaSlider.attach();
    
    // Add keyboard action styles to the head
    $('head').append(`
        <style>
            .keyboard-indicator {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 16px;
                z-index: 100;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                max-width: 80%;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                border: 1px solid #555;
            }
            
            .type-indicator {
                /* 移除左侧绿色边框 */
            }
            
            .press-indicator {
                /* 移除左侧蓝色边框 */
            }
        </style>
    `);

    // Create keyboard indicator element
    const $keyboardIndicator = $('<div>', {
        class: 'keyboard-indicator',
        css: {
            opacity: 0
        }
    });
    
    // Variables to track previous indicator states
    const prevIndicatorIconState = { visible: false, left: null, top: null };
    
    // Add keyboard indicator to the document when DOM is ready
    $(document).ready(function() {
        $('body').append($keyboardIndicator);
    });


    const trajectoriesData = {};

    // 读取 trajectory.jsonl 并解析
    async function loadTrajectoriesFromFile(path = "./static/trajs/trajectory.jsonl") {
    try {
        const resp = await fetch(path);
        const text = await resp.text();

        // 按行解析，每行一个 JSON
        text.trim().split("\n").forEach(line => {
        if (!line) return;
        const obj = JSON.parse(line);
        trajectoriesData[obj.id] = obj;
        });

        // 默认选第一个 task
        const firstId = Object.keys(trajectoriesData)[6];
        if (!firstId) {
        console.error("No trajectory found in trajectory.jsonl");
        return;
        }

        // 动态生成 Tab（如果你想保持原先 <li class="trajectory-tab"> 的 UI）
        const $tabs = $("#trajectory-tabs");          // 假设 ul 有这个 id
        Object.keys(trajectoriesData).forEach(id => {
        $tabs.append(`
            <li class="trajectory-tab" data-trajectory-id="${id}">
            <a>${id}</a>
            </li>
        `);
        });

        // 事件代理（避免每次都重新绑定）
        $tabs.on("click", ".trajectory-tab", function () {
        const trajectoryId = $(this).data("trajectory-id");
        if (trajectoryId !== currentTrajectoryId) {
            loadTrajectory(trajectoryId);
        }
        });

        // 预加载全部图片（沿用你原来的函数）
        preloadAllTrajectoryImages();

        // 初始化界面
        loadTrajectory(firstId);
    } catch (err) {
        console.error("Failed to load trajectory.jsonl", err);
    }
    }

    let currentTrajectoryId = null;
    let currentStep = 0;
    let isPlaying = false;
    let playInterval = null;
    let preloadedImages = {}; // 用于存储预加载的图片
    let totalImagesToLoad = 0; // 需要加载的图片总数
    let loadedImagesCount = 0; // 已加载的图片数量

    // 预加载指定轨迹的所有图片
    function preloadTrajectoryImages(trajectoryId) {
        // 如果已经预加载了这个轨迹的图片则跳过
        if (preloadedImages[trajectoryId]) {
            return;
        }
        
        // 创建一个对象来存储该轨迹的预加载图片
        preloadedImages[trajectoryId] = {};
        
        // 获取该轨迹的所有步骤
        const steps = trajectoriesData[trajectoryId].steps;
        
        // 计算本轨迹中需要加载的图片数量
        let trajectoryImagesCount = 0;
        steps.forEach(step => {
            if (step.image) {
                trajectoryImagesCount++;
            }
        });
        
        // 遍历所有步骤并预加载图片
        steps.forEach((step, index) => {
            if (step.image) {
                const src = step.image || `./static/trajs/${trajectoryId}/${step.screenshot_file}`;
                const img = new Image();
                img.src = src;
                preloadedImages[trajectoryId][index] = img;
                
                // 添加加载完成事件监听器
                img.onload = function() {
                    loadedImagesCount++;
                };
                
                // 添加加载错误事件监听器
                img.onerror = function() {
                    loadedImagesCount++;
                };
            }
        });
    }

    $(document).ready(function () {
        // 其它原有 $(document).ready 内容…（保留）
        // 最后加上一句：
        loadTrajectoriesFromFile();
      });
      
    // 预加载所有轨迹的图片
    function preloadAllTrajectoryImages() {
        // 先计算所有图片的总数
        totalImagesToLoad = 0;
        loadedImagesCount = 0;
        
        // 计算所有轨迹的总图片数
        Object.keys(trajectoriesData).forEach(trajectoryId => {
            const steps = trajectoriesData[trajectoryId].steps;
            steps.forEach(step => {
                if (step.image) {
                    totalImagesToLoad++;
                }
            });
        });
        
        // 开始预加载每个轨迹
        Object.keys(trajectoriesData).forEach(trajectoryId => {
            preloadTrajectoryImages(trajectoryId);
        });
    }

    // Function to load and display a specific trajectory
    function loadTrajectory(trajectoryId) {
        // Reset state
        clearInterval(playInterval);
        isPlaying = false;
        currentStep = 0;
        currentTrajectoryId = trajectoryId;
        
        // 如果还没有预加载这个轨迹的图片
        if (!preloadedImages[trajectoryId]) {
            // 重置计数器
            totalImagesToLoad = 0;
            loadedImagesCount = 0;
            
            // 计算这个轨迹的图片总数
            const steps = trajectoriesData[trajectoryId].steps;
            steps.forEach(step => {
                if (step.image) {
                    totalImagesToLoad++;
                }
            });
            
            // 预加载当前轨迹的图片
            preloadTrajectoryImages(trajectoryId);
        }
        
        // Update active tab
        $('.trajectory-tab').removeClass('is-active');
        $(`[data-trajectory-id="${trajectoryId}"]`).addClass('is-active');
        
        // Set instruction text
        $('#traj-instruction').text(trajectoriesData[trajectoryId].instruction);
        
        // Generate step list and update viewer
        generateStepList();
        updateTrajViewer();
    }

    // Generate step list items
    function generateStepList() {
        const $stepList = $('.step-list');
        $stepList.empty();
        
        const totalSteps = trajectoriesData[currentTrajectoryId].steps.length;
        
        trajectoriesData[currentTrajectoryId].steps.forEach((step, index) => {
            let actionDisplay = step.action;

            if (step.action==="undefined" || step.action==="" || step.action==="DONE" || actionDisplay === "DONE" || actionDisplay === "done" || actionDisplay === "Complete" || actionDisplay === "complete") {
                actionDisplay = `<code><span class="action-type">COMPLETE</span></code>`;
            } else if (step.mouseAction) {
                // Capitalize action type (e.g., "click" -> "CLICK")
                let actionType = step.mouseAction.type.charAt(0).toUpperCase() + step.mouseAction.type.slice(1);
                let coords = '';
                
                if (step.mouseAction.x !== undefined && step.mouseAction.y !== undefined) {
                    coords = `(${step.mouseAction.x}, ${step.mouseAction.y})`;
                }
                
                if (step.mouseAction.type === "drag") {
                    // 对于拖拽动作，使用startX和startY作为起点，endX和endY作为终点
                    let startX = step.mouseAction.startX || step.mouseAction.x;
                    let startY = step.mouseAction.startY || step.mouseAction.y;
                    
                    if (step.mouseAction.endX !== undefined && step.mouseAction.endY !== undefined) {
                        coords = `(${startX}, ${startY}) → (${step.mouseAction.endX}, ${step.mouseAction.endY})`;
                    }
                }
                
                // Create HTML with spans for styling
                actionDisplay = `<code><span class="action-type">${actionType}</span> <span class="action-coords">${coords}</span></code>`;
            } else if (step.action.toLowerCase().includes('typewrite') || step.action.toLowerCase().includes('type ')) {
                // Extract the text being typed from the action string
                let match = step.action.match(/typewrite\(['"](.+?)['"]\)/i) || step.action.match(/type ['"](.+?)['"]/i);
                let typedText = match ? match[1] : 'text';
                
                // Create HTML with spans for styling
                actionDisplay = `<code><span class="action-type">TYPE</span> <span class="action-coords">"${typedText}"</span></code>`;
                
                // Add a keyboardAction property to the step
                if (!step.keyboardAction) {
                    step.keyboardAction = { type: "type", text: typedText };
                }
            } else if (step.action.toLowerCase().includes('press')) {
                // Extract the key being pressed from the action string
                let match = step.action.match(/press\(['"](.+?)['"]\)/i) || step.action.match(/press ['"](.+?)['"]/i);
                let key = match ? match[1] : 'key';
                
                // Create HTML with spans for styling
                actionDisplay = `<code><span class="action-type">PRESS</span> <span class="action-coords">"${key}"</span></code>`;
                
                // Add a keyboardAction property to the step
                if (!step.keyboardAction) {
                    step.keyboardAction = { type: "press", key: key };
                }
            } else {
                // Fallback if action is not DONE and no mouseAction
                actionDisplay = `<code>${step.description}</code>`; // Wrapped in code tag for consistent styling
            }
            
            const stepTitle = step.description && step.description.trim() !== '' 
                  ? step.description 
                  : step.action.split("\n")[0];
            
            const thoughtBlock = step.thought
                ? `<details class="step-thought">
                        <summary>Thought</summary>
                        <pre>${step.thought}</pre>
                    </details>`
                : "";

            const $stepItem = $(`
                <li class="step-list-item" data-step="${index}">
                    <div class="step-header">
                        <div class="step-left">
                            <span class="step-number">Step ${step.stepNum}</span>
                            <span class="step-title">${stepTitle}</span>
                        </div>
                    </div>
                    <div class="step-action-details">
                        ${actionDisplay}
                        ${thoughtBlock}   <!-- 新增 -->
                    </div>
                </li>
            `);
            
            $stepList.append($stepItem);
        });
        
        // Add click event to step items for navigation
        $('.step-list-item').click(function(e) {
            // Only handle navigation clicks if not clicking on toggle or expanded content
            if (!$(e.target).closest('.step-toggle').length && !$(e.target).closest('.step-action-details').length || $(e.target).closest('.step-header').length) {
                const stepIndex = $(this).data('step');
                if (currentStep !== stepIndex) { // Prevent re-processing if already active
                    currentStep = stepIndex;
                    updateTrajViewer();
                }
            }
        });
    }

    // Adjust container height on load and resize
    function adjustContainerHeight() {
        const windowHeight = $(window).height();
        const headerHeight = $('nav').outerHeight() + 40;
        const maxHeight = windowHeight - headerHeight - 100; // Some padding
        $('.trajectory-container').css('max-height', maxHeight + 'px');
    }
    
    $(window).on('load resize', adjustContainerHeight);

    // Initialize trajectory viewer
    // function updateTrajViewer() {
    //     const totalSteps = trajectoriesData[currentTrajectoryId].steps.length;
    //     const step = trajectoriesData[currentTrajectoryId].steps[currentStep];
        
    //     // Update main image
    //     // 如果有预加载的图片就使用预加载的，否则直接设置src
    //     if (preloadedImages[currentTrajectoryId] && preloadedImages[currentTrajectoryId][currentStep]) {
    //         const preloadedImg = preloadedImages[currentTrajectoryId][currentStep];
    //         // 确保图片已经加载完成
    //         if (preloadedImg.complete) {
    //             $('#traj-image').attr('src', preloadedImg.src);
    //         } else {
    //             // 如果图片还没有加载完成，设置加载事件
    //             preloadedImg.onload = function() {
    //                 $('#traj-image').attr('src', preloadedImg.src);
    //             };
    //             // 同时也设置src以防图片加载失败
    //             $('#traj-image').attr('src', step.image);
    //         }
    //     } else {
    //         // 如果没有预加载则直接设置src
    //         $('#traj-image').attr('src', step.image);
    //     }
        
    //     // Update button states
    //     $('#prev-step').prop('disabled', currentStep === 0);
    //     $('#next-step').prop('disabled', currentStep === totalSteps - 1);
        
    //     // Update play button icon
    //     if (isPlaying) {
    //         $('#play-steps').html('<i class="fas fa-pause"></i>');
    //     } else {
    //         $('#play-steps').html('<i class="fas fa-play"></i>');
    //     }
        
    //     // Update active step in list
    //     $('.step-list-item').removeClass('active');
    //     const $activeStep = $(`.step-list-item[data-step="${currentStep}"]`);
    //     $activeStep.addClass('active');
        
    //     const $sidebar = $('.trajectory-sidebar');
    //     if ($activeStep.length) {
    //         setTimeout(function() {
    //             let desiredScrollTop;
    //             if (currentStep === 0) {
    //                 desiredScrollTop = 0; // 初始加载时，强制滚动到最顶部
    //             } else {
    //                 // Calculate the position of the active step relative to the sidebar
    //                 const activeStepTopInScrollableArea = $activeStep.offset().top - $sidebar.offset().top;
    //                 const activeStepBottomInScrollableArea = activeStepTopInScrollableArea + $activeStep.outerHeight();
    //                 const sidebarHeight = $sidebar.height();

    //                 // Ensure the active step is fully visible
    //                 if (activeStepTopInScrollableArea < 0) {
    //                     desiredScrollTop = $sidebar.scrollTop() + activeStepTopInScrollableArea;
    //                 } else if (activeStepBottomInScrollableArea > sidebarHeight) {
    //                     desiredScrollTop = $sidebar.scrollTop() + (activeStepBottomInScrollableArea - sidebarHeight);
    //                 } else {
    //                     desiredScrollTop = $sidebar.scrollTop(); // No need to scroll
    //                 }

    //                 desiredScrollTop = Math.max(0, Math.min(desiredScrollTop, $sidebar[0].scrollHeight - sidebarHeight)); // Ensure the scroll position is within bounds
    //             }

    //             // 仅当需要改变滚动位置时才执行动画
    //             if (Math.abs($sidebar.scrollTop() - Math.round(desiredScrollTop)) > 1) { // Apply tolerance and round target
    //                 $sidebar.stop(true, true).animate({
    //                     scrollTop: Math.round(desiredScrollTop) // Round desiredScrollTop for animation
    //                 }, 300);
    //             }
    //         }, 50); 
    //     }
        
    //     // Update mouse indicator
    //     updateMouseIndicator(step);
    // }
    async function ensureTrajectoryLoaded(trajectoryId) {
        if (trajectoriesData[trajectoryId]) return true;
      
        const base = `./static/trajs/${trajectoryId}/`;
        try {
          // 加个防缓存参数
          const cfgResp = await fetch(base + 'config.json?v=' + Date.now(), { cache: 'no-store' });
          if (!cfgResp.ok) throw new Error(`config.json ${cfgResp.status}`);
          const config = await cfgResp.json();
      
          const trajResp = await fetch(base + 'traj.jsonl?v=' + Date.now(), { cache: 'no-store' });
          if (!trajResp.ok) throw new Error(`traj.jsonl ${trajResp.status}`);
          const text = await trajResp.text();
      
          // 逐行解析 jsonl
          const rawSteps = text.split('\n').map(l => l.trim()).filter(Boolean).map(l => JSON.parse(l));
      
          // 适配你的 UI 结构
          const steps = rawSteps.map((s, i) => {
            const step = {
              stepNum: s.step_num ?? (i + 1),
              action: s.action || '',
              thought: s.response || '',     // 你原来叫 response，这里塞到 thought 里展示
              screenshot_file: s.screenshot_file || ''
            };
            // 让 updateTrajViewer 能直接用 step.image
            if (step.screenshot_file) {
              step.image = base + step.screenshot_file;
            }
      
            // 简单解析下键盘/鼠标（可选）
            const a = step.action;
            if (/pyautogui\.(write|typewrite)\(/i.test(a)) {
              const m = a.match(/['"]([^'"]+)['"]/);
              step.keyboardAction = { type: 'type', text: m ? m[1] : 'text' };
            } else if (/press\(/i.test(a)) {
              const m = a.match(/press\(['"]([^'"]+)['"]\)/i);
              step.keyboardAction = { type: 'press', key: m ? m[1] : 'key' };
            } else {
              const m = a.match(/pyautogui\.(click|moveTo|dragTo|drag)\(([^)]*)\)/i);
              if (m) {
                const kind = m[1].toLowerCase();
                const nums = m[2].split(',').map(t => parseFloat(t)).filter(n => !Number.isNaN(n));
                if (kind === 'click' && nums.length >= 2) {
                  step.mouseAction = { type: 'click', x: nums[0], y: nums[1] };
                } else if ((kind === 'drag' || kind === 'dragto') && nums.length >= 4) {
                  step.mouseAction = { type: 'drag', startX: nums[0], startY: nums[1], endX: nums[2], endY: nums[3] };
                }
              }
            }
            return step;
          });
      
          trajectoriesData[trajectoryId] = {
            instruction: config.instruction || '',
            steps
          };
          return true;
        } catch (err) {
          console.error('[ensureTrajectoryLoaded] fail for', trajectoryId, err);
          alert(`Failed to load trajectory ${trajectoryId}. Check folder name / files.`);
          return false;
        }
      }

    function updateTrajViewer() {
        const totalSteps = trajectoriesData[currentTrajectoryId].steps.length;
        const step = trajectoriesData[currentTrajectoryId].steps[currentStep];
      
        // === 关键：构造图片 src（优先 step.image，否则用 screenshot_file） ===
        const base = `./static/trajs/${currentTrajectoryId}/`;
        let imgSrc = null;
      
        if (step.image && typeof step.image === 'string' && step.image.trim() !== '') {
          // 如果 step.image 已经是绝对/相对路径都能用
          imgSrc = step.image;
          // 如果只给了文件名，也拼上 base（可选）
          if (!step.image.includes('/') && !step.image.startsWith('./') && !step.image.startsWith('../')) {
            imgSrc = base + step.image;
          }
        } else if (step.screenshot_file && typeof step.screenshot_file === 'string' && step.screenshot_file.trim() !== '') {
          imgSrc = base + step.screenshot_file;
        } else {
          console.warn('No image or screenshot_file in step', step);
          imgSrc = ''; // 或者放一张占位图
        }
      
        // 设置主图（如果有预加载图就用预加载的）
        if (preloadedImages[currentTrajectoryId] && preloadedImages[currentTrajectoryId][currentStep]) {
          const preloadedImg = preloadedImages[currentTrajectoryId][currentStep];
          if (preloadedImg.complete) {
            $('#traj-image').attr('src', preloadedImg.src);
          } else {
            preloadedImg.onload = function() { $('#traj-image').attr('src', preloadedImg.src); };
            $('#traj-image').attr('src', imgSrc);
          }
        } else {
          $('#traj-image').attr('src', imgSrc);
        }
      
        // 更新按钮状态
        $('#prev-step').prop('disabled', currentStep === 0);
        $('#next-step').prop('disabled', currentStep === totalSteps - 1);
        $('#play-steps').html(isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>');
      
        // 高亮侧边栏当前 step，并滚动到可见区域（原逻辑保留）
        $('.step-list-item').removeClass('active');
        const $activeStep = $(`.step-list-item[data-step="${currentStep}"]`);
        $activeStep.addClass('active');
      
        const $sidebar = $('.trajectory-sidebar');
        if ($activeStep.length) {
          setTimeout(function() {
            let desiredScrollTop;
            if (currentStep === 0) {
              desiredScrollTop = 0;
            } else {
              const activeTop = $activeStep.offset().top - $sidebar.offset().top;
              const activeBottom = activeTop + $activeStep.outerHeight();
              const sidebarH = $sidebar.height();
      
              if (activeTop < 0) desiredScrollTop = $sidebar.scrollTop() + activeTop;
              else if (activeBottom > sidebarH) desiredScrollTop = $sidebar.scrollTop() + (activeBottom - sidebarH);
              else desiredScrollTop = $sidebar.scrollTop();
      
              desiredScrollTop = Math.max(0, Math.min(desiredScrollTop, $sidebar[0].scrollHeight - sidebarH));
            }
            if (Math.abs($sidebar.scrollTop() - Math.round(desiredScrollTop)) > 1) {
              $sidebar.stop(true, true).animate({ scrollTop: Math.round(desiredScrollTop) }, 300);
            }
          }, 50);
        }
      
        // 更新鼠标/键盘指示（沿用你现有的）
        updateMouseIndicator(step);
      }
    
    // Toggle read more functionality
    $('.read-more-toggle').click(function() {
        const $responseText = $('#traj-response');
        if ($responseText.hasClass('expanded')) {
            $responseText.removeClass('expanded');
            $(this).text('Read more');
        } else {
            $responseText.addClass('expanded');
            $(this).text('Read less');
        }
    });
    
    // Update mouse indicator based on the action
    function updateMouseIndicator(step) {
        const $indicator = $('#mouse-indicator');
        const $trajectoryMain = $('.trajectory-main');
        const interStepTransitionTime = 150; // Animation time between steps for the icon (was 300)
        const intraStepDragAnimTime = 250;   // Animation time for icon during a drag (was 500)
        const intraStepDragDelay = 125;    // Delay before starting intra-step drag animation (was 250)

        // --- 1. Preparations ---
        $('.click-point, .drag-line').remove(); // Clear old specific visuals first
        $indicator.stop(true, false);           // Stop any ongoing animation of the main icon
        $keyboardIndicator.stop(true, false).css({ opacity: 0 }); // Hide keyboard indicator

        const $image = $('#traj-image');
        const imgWidth = $image.width();
        const imgHeight = $image.height();

        if (!imgWidth || imgWidth === 0 || !imgHeight || imgHeight === 0) { // Image not ready, hide and bail
            $indicator.hide();
            prevIndicatorIconState.visible = false;
            return;
        }
        const scaleX = imgWidth / 1920;
        const scaleY = imgHeight / 1080;

        // --- 2. Check for keyboard action ---
        if (step.keyboardAction) {
            // Hide mouse indicator if it was visible
            if (prevIndicatorIconState.visible) {
                $indicator.animate({ opacity: 0 }, interStepTransitionTime / 2, function() { $(this).hide(); });
                prevIndicatorIconState.visible = false;
            } else {
                $indicator.hide();
            }
            
            // Configure keyboard indicator based on action type
            $keyboardIndicator.removeClass('type-indicator press-indicator');
            
            if (step.keyboardAction.type === "type") {
                $keyboardIndicator.addClass('type-indicator');
                $keyboardIndicator.html(`Typing: "${step.keyboardAction.text}"`);
            } else if (step.keyboardAction.type === "press") {
                $keyboardIndicator.addClass('press-indicator');
                
                // 对于Enter键使用SVG图标
                if (step.keyboardAction.key.toLowerCase() === 'enter') {
                    $keyboardIndicator.html(`
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <img src="./static/images/enter-key.svg" alt="Enter" style="width: 40px; height: 40px; filter: invert(1);">
                        </div>
                    `);
                } else {
                    $keyboardIndicator.html(`Pressing: [${step.keyboardAction.key.toUpperCase()}]`);
                }
            }
            
            // Position the keyboard indicator
            const imagePos = $image.offset();
            const imageCenter = {
                left: imagePos.left + imgWidth / 2,
                top: imagePos.top + imgHeight / 2
            };
            
            // Position indicator after it has content so we can calculate its width
            $keyboardIndicator.css({
                opacity: 0,
                display: 'block'
            });
            
            // Calculate position after rendering (so we know its dimensions)
            setTimeout(() => {
                const indicatorWidth = $keyboardIndicator.outerWidth();
                $keyboardIndicator.css({
                    left: imageCenter.left - (indicatorWidth / 2),
                    top: imageCenter.top + 100  // 从-100改为+50，将指示器往下移动
                }).animate({ opacity: 1 }, interStepTransitionTime);
            }, 0);
            
            return;
        }

        // --- 3. Current step has no action at all ---
        if (!step.mouseAction) {
            if (prevIndicatorIconState.visible) {
                $indicator.animate({ opacity: 0 }, interStepTransitionTime / 2, function() { $(this).hide(); });
            } else {
                $indicator.hide();
            }
            prevIndicatorIconState.visible = false;
            return;
        }

        // --- 4. Current step HAS a mouse action ---
        const action = step.mouseAction;
        const newActionType = action.type;
        const newIconClass = (newActionType === "click") ? 'click-indicator' : 'drag-indicator';

        let iconStartTargetX = (newActionType === "click" ? action.x : action.startX) * scaleX;
        let iconStartTargetY = (newActionType === "click" ? action.y : action.startY) * scaleY;

        let iconEndTargetX = (newActionType === "click" ? iconStartTargetX : action.endX * scaleX);
        let iconEndTargetY = (newActionType === "click" ? iconStartTargetY : action.endY * scaleY);

        $indicator.removeClass('click-indicator drag-indicator').addClass(newIconClass);

        // --- 5. Animate main icon to the START of the current action ---
        if (prevIndicatorIconState.visible && prevIndicatorIconState.left !== null) {
            $indicator.css({
                left: prevIndicatorIconState.left,
                top: prevIndicatorIconState.top,
                opacity: 1,
                display: 'block'
            });
            $indicator.animate({
                left: iconStartTargetX + 'px',
                top: iconStartTargetY + 'px'
            }, interStepTransitionTime, finishInterStepTransition);
        } else {
            $indicator.css({
                left: iconStartTargetX + 'px',
                top: iconStartTargetY + 'px',
                opacity: 0,
                display: 'block'
            });
            $indicator.animate({ opacity: 1 }, interStepTransitionTime, finishInterStepTransition);
        }

        // --- 6. Callback after icon reaches START of current action ---
        function finishInterStepTransition() {
            prevIndicatorIconState.visible = true; 

            if (newActionType === "click") {
                const $clickPoint = $('<div class="click-point"></div>').css({
                    left: iconStartTargetX + 'px',
                    top: iconStartTargetY + 'px',
                    opacity: 0
                });
                $trajectoryMain.append($clickPoint);
                $clickPoint.animate({ opacity: 1 }, interStepTransitionTime / 2);

                prevIndicatorIconState.left = iconStartTargetX + 'px';
                prevIndicatorIconState.top = iconStartTargetY + 'px';

            } else if (newActionType === "drag") {
                const length = Math.sqrt(Math.pow(iconEndTargetX - iconStartTargetX, 2) + Math.pow(iconEndTargetY - iconStartTargetY, 2));
                const angle = Math.atan2(iconEndTargetY - iconStartTargetY, iconEndTargetX - iconStartTargetX) * 180 / Math.PI;
                const $dragLine = $('<div class="drag-line"></div>').css({
                    left: iconStartTargetX + 'px',
                    top: iconStartTargetY + 'px',
                    width: length + 'px',
                    transform: `rotate(${angle}deg)`,
                    opacity: 0
                });
                $trajectoryMain.append($dragLine);
                $dragLine.animate({ opacity: 1 }, interStepTransitionTime / 2);

                prevIndicatorIconState.left = iconStartTargetX + 'px'; // Provisional: before intra-step anim
                prevIndicatorIconState.top = iconStartTargetY + 'px';

                setTimeout(() => {
                    $indicator.animate({
                        left: iconEndTargetX + 'px',
                        top: iconEndTargetY + 'px'
                    }, intraStepDragAnimTime, function() {
                        prevIndicatorIconState.left = iconEndTargetX + 'px'; // Final after intra-step anim
                        prevIndicatorIconState.top = iconEndTargetY + 'px';
                    });
                }, intraStepDragDelay);
            }
        }
    }

    // Play through steps automatically
    function togglePlaySteps() {
        if (isPlaying) {
            // Stop playback
            clearInterval(playInterval);
            isPlaying = false;
            $('#play-steps').html('<i class="fas fa-play"></i>');
        } else {
            // Start playback
            isPlaying = true;
            $('#play-steps').html('<i class="fas fa-pause"></i>');
            
            // Reset to first step if we're at the end
            if (currentStep === trajectoriesData[currentTrajectoryId].steps.length - 1) {
                currentStep = 0;
            }
            
            // Update UI immediately
            updateTrajViewer();
            
            // Set interval for automatic advancement
            playInterval = setInterval(() => {
                if (currentStep < trajectoriesData[currentTrajectoryId].steps.length - 1) {
                    currentStep++;
                    updateTrajViewer();
                } else {
                    // Stop at the end
                    clearInterval(playInterval);
                    isPlaying = false;
                    $('#play-steps').html('<i class="fas fa-play"></i>');
                }
            }, 1200);
        }
    }

    // Event listeners for navigation buttons
    $('#prev-step').click(function() {
        if (!$(this).prop('disabled')) {
            currentStep--;
            updateTrajViewer();
        }
    });

    $('#next-step').click(function() {
        if (!$(this).prop('disabled')) {
            currentStep++;
            updateTrajViewer();
        }
    });
    
    // Play button event listener
    $('#play-steps').click(togglePlaySteps);
    
    // Replay button event listener
    $('#replay-step').click(function() {
        // 停止当前可能正在播放的内容
        clearInterval(playInterval);
        
        // 重置到第一步
        currentStep = 0;
        updateTrajViewer();
        
        // 开始自动播放
        isPlaying = true;
        $('#play-steps').html('<i class="fas fa-pause"></i>');
        
        // 设置自动播放的间隔
        playInterval = setInterval(() => {
            if (currentStep < trajectoriesData[currentTrajectoryId].steps.length - 1) {
                currentStep++;
                updateTrajViewer();
            } else {
                // 到达最后一步后停止播放
                clearInterval(playInterval);
                isPlaying = false;
                $('#play-steps').html('<i class="fas fa-play"></i>');
            }
        }, 1200);
    });
    
    // Trajectory selector event listener
    $('.trajectory-tab').off('click').on('click', async function () {
        const trajectoryId = $(this).data('trajectory-id');
        if (trajectoryId === currentTrajectoryId) return;

        // 大小写必须和目录一致（Linux 区分大小写）
        const ok = await ensureTrajectoryLoaded(trajectoryId);
        if (ok) loadTrajectory(trajectoryId);
        });
    
    // Handle window resize to reposition mouse indicator
    $(window).resize(function() {
        updateTrajViewer();
    });

    // Initialize trajectory viewer
    loadTrajectory(currentTrajectoryId);
    
    // 修改预加载顺序，先预加载当前选择的轨迹，然后再预加载其他轨迹
    // 预加载当前轨迹
    preloadTrajectoryImages(currentTrajectoryId);
    
    // 然后预加载其他轨迹
    Object.keys(trajectoriesData).forEach(trajectoryId => {
        if (trajectoryId !== currentTrajectoryId) {
            setTimeout(() => preloadTrajectoryImages(trajectoryId), 500);
        }
    });
})
