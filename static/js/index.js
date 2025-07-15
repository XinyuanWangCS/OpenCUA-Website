window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


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

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

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

    // Trajectory visualization
    // const trajectoriesData = {

    //     // Spreadsheet calculation trajectory
    //     "1e8df695-bd1b-45b3-b557-e7d599cf7597": {
    //         id: "1e8df695-bd1b-45b3-b557-e7d599cf7597",
    //         steps: [
    //             {
    //                 stepNum: 1,
    //                 action: "# Click on cell D1 to prepare to add the \"Profit\" column header\npyautogui.click(427, 273)",
    //                 response: "I need to add a profit calculation column to this spreadsheet. Looking at the existing data, I can see columns for Week, Sales, and COGS. I'll start by adding a new column header called 'Profit' in cell D1, then create a formula to calculate profit (Sales - COGS) for each week.",
    //                 description: "Click on cell D1",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_0_20250503@081210.png",
    //                 mouseAction: { type: "click", x: 427, y: 273 }
    //             },
    //             {
    //                 stepNum: 2,
    //                 action: "# Type \"Profit\" in cell D1 to set the column header\npyautogui.typewrite('Profit')",
    //                 response: "Now I'll type 'Profit' to create the column header in cell D1.",
    //                 description: "Type 'Profit' header",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_1_20250503@081224.png",
    //                 keyboardAction: { type: "type", text: "Profit" }
    //             },
    //             {
    //                 stepNum: 3,
    //                 action: "# Click on cell D2 to prepare to enter the profit formula for Week 1\npyautogui.click(408, 289)",
    //                 response: "With the header in place, I'll now click on cell D2 to add the profit formula for Week 1.",
    //                 description: "Click on cell D2",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_2_20250503@081241.png",
    //                 mouseAction: { type: "click", x: 408, y: 289 }
    //             },
    //             {
    //                 stepNum: 4,
    //                 action: "# Enter the profit formula for Week 1 in cell D2\npyautogui.typewrite('=B2-C2')",
    //                 response: "In cell D2, I'll enter the formula '=B2-C2' to calculate profit by subtracting COGS (C2) from Sales (B2) for Week 1.",
    //                 description: "Enter formula =B2-C2",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_3_20250503@081304.png",
    //                 keyboardAction: { type: "type", text: "=B2-C2" }
    //             },
    //             {
    //                 stepNum: 5,
    //                 action: "# Press \"Enter\" to confirm the formula in D2\npyautogui.press('enter')",
    //                 response: "I'll press Enter to confirm and apply the formula, which will calculate the profit for Week 1.",
    //                 description: "Confirm formula",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_4_20250503@081329.png",
    //                 keyboardAction: { type: "press", key: "Enter" }
    //             },
    //             {
    //                 stepNum: 6,
    //                 action: "# Click and drag the fill handle from D2 to D11 to copy the profit formula down\npyautogui.click(464, 300)\npyautogui.dragTo(427, 466, duration=1, button='left')",
    //                 response: "Finally, I'll click and drag the cell's fill handle from D2 down to D11 to copy the profit formula to all rows. This will automatically adjust the formula references for each row.",
    //                 description: "Copy formula to all rows",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_5_20250503@081350.png",
    //                 mouseAction: { type: "drag", startX: 464, startY: 300, endX: 427, endY: 466 }
    //             },
    //             {
    //                 stepNum: 7,
    //                 action: "DONE",
    //                 response: "I've successfully completed the task by adding a 'Profit' column with the formula that calculates profit (Sales - COGS) for each week. The profit values are now visible in column D for all ten weeks.",
    //                 description: "Task completed",
    //                 image: "./static/trajs/1e8df695-bd1b-45b3-b557-e7d599cf7597/step_6_20250503@081416.png",
    //                 mouseAction: null
    //             }
    //         ],
    //         instruction: "Add a new column named \"Profit\" and calculate the profit for each week by subtracting \"COGS\" from \"Sales\" in that column."
    //     },
    //     "72b810ef-4156-4d09-8f08-a0cf57e7cefe": {
    //         id: "72b810ef-4156-4d09-8f08-a0cf57e7cefe",
    //         steps: [
    //             {
    //                 stepNum: 1,
    //                 action: "# Select the last paragraph by clicking and dragging from the start to the end of the paragraph\npyautogui.click(657, 639,  duration=1)",
    //                 response: "I need to add strikethrough formatting to the last paragraph in this document.\n\nFirst, I need to select the text of the last paragraph:\n1. I can see that the document has multiple paragraphs of text\n2. The last paragraph appears to start with 'Each student will be responsible for...' and continues to the end of the visible text\n3. To select this paragraph, I'll position my cursor at the beginning of the paragraph\n\nI'll click at coordinates (657, 639) which appears to be at the beginning of the last paragraph.",
    //                 description: "Select the paragraph",
    //                 image: "./static/trajs/72b810ef-4156-4d09-8f08-a0cf57e7cefe/step_0_20250503@074819.png",
    //                 mouseAction: { type: "click", x: 657, y: 639 }
    //             },
    //             {
    //                 stepNum: 2,
    //                 action: "# Click and drag to select the entire last paragraph\npyautogui.dragTo(657, 739, duration=1, button='left')",
    //                 response: "Now that I've positioned my cursor at the beginning of the last paragraph, I need to select all the text in this paragraph:\n\n1. I'll drag from the current position (where I just clicked) down to the end of the paragraph\n2. I need to click and hold the left mouse button while dragging to select the text\n3. The paragraph appears to end around position (657, 739)\n\nI'll drag from the current position to (657, 739) to select the entire paragraph text. This will allow me to apply the strikethrough formatting to the whole paragraph in the next step.",
    //                 description: "Drag to select the text",
    //                 image: "./static/trajs/72b810ef-4156-4d09-8f08-a0cf57e7cefe/step_1_20250503@074835.png",
    //                 mouseAction: { type: "drag", startX: 657, startY: 639, endX: 657, endY: 739 }
    //             },
    //             {
    //                 stepNum: 3,
    //                 action: "# Click the strikethrough button in the toolbar\npyautogui.click(813, 146,  duration=1)",
    //                 response: "Now that I have selected the entire paragraph, I need to apply the strikethrough formatting:\n\n1. Looking at the toolbar at the top of the LibreOffice Writer window\n2. I can see various formatting options including bold, italic, underline, etc.\n3. The strikethrough button appears to be located at coordinates (813, 146)\n4. This button will apply the strikethrough formatting to the selected text\n\nI'll click on the strikethrough button in the toolbar. This will apply strikethrough formatting to the selected paragraph, indicating that it's redundant as requested.",
    //                 description: "Apply strikethrough formatting",
    //                 image: "./static/trajs/72b810ef-4156-4d09-8f08-a0cf57e7cefe/step_2_20250503@074853.png",
    //                 mouseAction: { type: "click", x: 813, y: 146 }
    //             },
    //             {
    //                 stepNum: 4,
    //                 action: "DONE",
    //                 response: "I've successfully completed the task of applying strikethrough formatting to the last paragraph:\n\n1. I identified the last paragraph in the document\n2. I selected the entire paragraph by clicking at its beginning and dragging to its end\n3. I applied strikethrough formatting by clicking the strikethrough button in the toolbar\n4. The formatting has been applied correctly, and the paragraph now appears with a line through it\n\nThe task is now complete. The strikethrough formatting visually indicates that the paragraph is redundant as requested in the peer review process.",
    //                 description: "Task completed",
    //                 image: "./static/trajs/72b810ef-4156-4d09-8f08-a0cf57e7cefe/step_3_20250503@074916.png",
    //                 mouseAction: null
    //             }
    //         ],
    //         instruction: "I am peer-reviewing my friend's course outline. I think the last paragraph is redundant so I want to add strike-through on words in the last paragraph. Can you do this for me?"
    //     },
    //     // File explorer settings trajectory
    //     "5316686e-5688-4115-be24-052037df599f-WOS": {
    //         id: "5316686e-5688-4115-be24-052037df599f-WOS",
    //         steps: [
    //             {
    //                 stepNum: 1,
    //                 action: "# Double-click the \"This PC\" icon to open File Explorer\npyautogui.doubleClick(36, 38, duration=1)",
    //                 response: "First, I need to open File Explorer. I can do this by double-clicking on the \"This PC\" icon on the desktop.",
    //                 description: "Open File Explorer",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_0_20250505@104449.jpg",
    //                 mouseAction: { type: "click", x: 36, y: 38 }
    //             },
    //             {
    //                 stepNum: 2,
    //                 action: "# Click the \"View\" tab in File Explorer to access view options\npyautogui.click(353, 291, duration=1)",
    //                 response: "Now that File Explorer is open, I'll click on the \"View\" tab in the ribbon menu to access the view settings.",
    //                 description: "Click View tab",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_1_20250505@104508.jpg",
    //                 mouseAction: { type: "click", x: 353, y: 291 }
    //             },
    //             {
    //                 stepNum: 3,
    //                 action: "# Click the \"Hidden items\" checkbox to show hidden files\npyautogui.click(933, 357, duration=1)",
    //                 response: "In the View tab, I'll find and click the \"Hidden items\" checkbox to show hidden files and folders.",
    //                 description: "Show hidden items",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_2_20250505@104610.jpg",
    //                 mouseAction: { type: "click", x: 933, y: 357 }
    //             },
    //             {
    //                 stepNum: 4,
    //                 action: "# Click the \"Hidden items\" checkbox to show hidden files\npyautogui.click(1403, 974, duration=1)",
    //                 response: "I notice the \"Hidden items\" checkbox wasn't properly toggled, so I'll click it again to ensure hidden files are shown.",
    //                 description: "Toggle hidden items",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_3_20250505@104729.jpg",
    //                 mouseAction: { type: "click", x: 1403, y: 974 }
    //             },
    //             {
    //                 stepNum: 5,
    //                 action: "# Click \"Options\" in the \"View\" tab to open Folder Options\npyautogui.click(363, 287, duration=1)",
    //                 response: "To show system files, I need to access additional settings. I'll click \"Options\" in the View tab to open the Folder Options dialog.",
    //                 description: "Access Folder Options",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_4_20250505@104847.jpg",
    //                 mouseAction: { type: "click", x: 363, y: 287 }
    //             },
    //             {
    //                 stepNum: 6,
    //                 action: "# Click the \"Options\" button in the \"View\" tab to open Folder Options\npyautogui.click(1137, 342, duration=1)",
    //                 response: "I need to click the \"Options\" button on the right side of the View tab to open Folder Options.",
    //                 description: "Click Options button",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_5_20250505@105000.jpg",
    //                 mouseAction: { type: "click", x: 1137, y: 342 }
    //             },
    //             {
    //                 stepNum: 7,
    //                 action: "# Click the \"View\" tab in the \"Folder Options\" window\npyautogui.click(273, 407, duration=1)",
    //                 response: "In the Folder Options dialog, I'll click on the \"View\" tab to access advanced view settings.",
    //                 description: "Select View tab in dialog",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_6_20250505@105108.jpg",
    //                 mouseAction: { type: "click", x: 273, y: 407 }
    //             },
    //             {
    //                 stepNum: 8,
    //                 action: "# Click the option to show hidden files, folders, and drives\npyautogui.click(395, 685, duration=1)",
    //                 response: "In the View tab of Folder Options, I'll select the \"Show hidden files, folders, and drives\" option.",
    //                 description: "Show hidden files option",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_7_20250505@105218.jpg",
    //                 mouseAction: { type: "click", x: 395, y: 685 }
    //             },
    //             {
    //                 stepNum: 9,
    //                 action: "# Click the \"Apply\" button to confirm changes in Folder Options\npyautogui.click(518, 816, duration=1)",
    //                 response: "I'll click the \"Apply\" button to save the changes I've made so far.",
    //                 description: "Apply settings",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_8_20250505@105334.jpg",
    //                 mouseAction: { type: "click", x: 518, y: 816 }
    //             },
    //             {
    //                 stepNum: 10,
    //                 action: "# Uncheck \"Hide protected operating system files\" to show system files\npyautogui.click(389, 732, duration=1)",
    //                 response: "Now I need to uncheck the \"Hide protected operating system files\" option to show system files as well.",
    //                 description: "Locate system files option",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_9_20250505@105437.jpg",
    //                 mouseAction: { type: "click", x: 389, y: 732 }
    //             },
    //             {
    //                 stepNum: 11,
    //                 action: "# Uncheck \"Hide protected operating system files\" to show system files\npyautogui.click(328, 731, duration=1)",
    //                 response: "I'll click the checkbox next to \"Hide protected operating system files\" to uncheck it and show system files.",
    //                 description: "Uncheck system files option",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_10_20250505@105547.jpg",
    //                 mouseAction: { type: "click", x: 328, y: 731 }
    //             },
    //             {
    //                 stepNum: 12,
    //                 action: "# Click \"Yes\" in the warning dialog to confirm showing protected system files\npyautogui.click(1089, 560, duration=1)",
    //                 response: "A warning dialog appears, asking if I'm sure about showing protected operating system files. I'll click \"Yes\" to confirm.",
    //                 description: "Confirm warning",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_11_20250505@105652.jpg",
    //                 mouseAction: { type: "click", x: 1089, y: 560 }
    //             },
    //             {
    //                 stepNum: 13,
    //                 action: "# Click \"OK\" to close the Folder Options window and apply changes\npyautogui.click(381, 812, duration=1)",
    //                 response: "Finally, I'll click the \"OK\" button to close the Folder Options dialog and apply all the changes.",
    //                 description: "Confirm all changes",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_12_20250505@105753.jpg",
    //                 mouseAction: { type: "click", x: 381, y: 812 }
    //             },
    //             {
    //                 stepNum: 14,
    //                 action: "DONE",
    //                 response: "I've successfully updated File Explorer's view settings to show both hidden files and system files. These changes will now persist across all File Explorer windows.",
    //                 description: "Task completed",
    //                 image: "./static/trajs/5316686e-5688-4115-be24-052037df599f-WOS/step_13_20250505@105839.jpg",
    //                 mouseAction: null
    //             }
    //         ],
    //         instruction: "Update file explorer view settings to show hidden and system files."
    //     }
    // };

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
        const firstId = Object.keys(trajectoriesData)[0];
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

    let currentTrajectoryId = "1e8df695-bd1b-45b3-b557-e7d599cf7597";
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
                const img = new Image();
                img.src = step.image;
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
    function updateTrajViewer() {
        const totalSteps = trajectoriesData[currentTrajectoryId].steps.length;
        const step = trajectoriesData[currentTrajectoryId].steps[currentStep];
        
        // Update main image
        // 如果有预加载的图片就使用预加载的，否则直接设置src
        if (preloadedImages[currentTrajectoryId] && preloadedImages[currentTrajectoryId][currentStep]) {
            const preloadedImg = preloadedImages[currentTrajectoryId][currentStep];
            // 确保图片已经加载完成
            if (preloadedImg.complete) {
                $('#traj-image').attr('src', preloadedImg.src);
            } else {
                // 如果图片还没有加载完成，设置加载事件
                preloadedImg.onload = function() {
                    $('#traj-image').attr('src', preloadedImg.src);
                };
                // 同时也设置src以防图片加载失败
                $('#traj-image').attr('src', step.image);
            }
        } else {
            // 如果没有预加载则直接设置src
            $('#traj-image').attr('src', step.image);
        }
        
        // Update button states
        $('#prev-step').prop('disabled', currentStep === 0);
        $('#next-step').prop('disabled', currentStep === totalSteps - 1);
        
        // Update play button icon
        if (isPlaying) {
            $('#play-steps').html('<i class="fas fa-pause"></i>');
        } else {
            $('#play-steps').html('<i class="fas fa-play"></i>');
        }
        
        // Update active step in list
        $('.step-list-item').removeClass('active');
        const $activeStep = $(`.step-list-item[data-step="${currentStep}"]`);
        $activeStep.addClass('active');
        
        const $sidebar = $('.trajectory-sidebar');
        if ($activeStep.length) {
            setTimeout(function() {
                let desiredScrollTop;
                if (currentStep === 0) {
                    desiredScrollTop = 0; // 初始加载时，强制滚动到最顶部
                } else {
                    // Calculate the position of the active step relative to the sidebar
                    const activeStepTopInScrollableArea = $activeStep.offset().top - $sidebar.offset().top;
                    const activeStepBottomInScrollableArea = activeStepTopInScrollableArea + $activeStep.outerHeight();
                    const sidebarHeight = $sidebar.height();

                    // Ensure the active step is fully visible
                    if (activeStepTopInScrollableArea < 0) {
                        desiredScrollTop = $sidebar.scrollTop() + activeStepTopInScrollableArea;
                    } else if (activeStepBottomInScrollableArea > sidebarHeight) {
                        desiredScrollTop = $sidebar.scrollTop() + (activeStepBottomInScrollableArea - sidebarHeight);
                    } else {
                        desiredScrollTop = $sidebar.scrollTop(); // No need to scroll
                    }

                    desiredScrollTop = Math.max(0, Math.min(desiredScrollTop, $sidebar[0].scrollHeight - sidebarHeight)); // Ensure the scroll position is within bounds
                }

                // 仅当需要改变滚动位置时才执行动画
                if (Math.abs($sidebar.scrollTop() - Math.round(desiredScrollTop)) > 1) { // Apply tolerance and round target
                    $sidebar.stop(true, true).animate({
                        scrollTop: Math.round(desiredScrollTop) // Round desiredScrollTop for animation
                    }, 300);
                }
            }, 50); 
        }
        
        // Update mouse indicator
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
    $('.trajectory-tab').click(function() {
        const trajectoryId = $(this).data('trajectory-id');
        if (trajectoryId !== currentTrajectoryId) {
            loadTrajectory(trajectoryId);
        }
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
