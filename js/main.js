// 導航欄滾動效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 項目過濾功能已移至 bindFilterButtons 函數

// 表單驗證
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    // 在頁面加載時初始化 EmailJS
    (function() {
        emailjs.init("u7RkLiYmEbw9HZnFd");
    })();

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 獲取表單數據
        const name = contactForm.elements['name'].value;
        const email = contactForm.elements['email'].value;
        const subject = contactForm.elements['subject'].value;
        const message = contactForm.elements['message'].value;

        // 簡單的表單驗證
        let isValid = true;
        let errorMessage = '';

        if (!name || name.trim() === '') {
            isValid = false;
            errorMessage += '請輸入您的姓名\n';
        }

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            isValid = false;
            errorMessage += '請輸入有效的電子郵件地址\n';
        }

        if (!message || message.trim() === '') {
            isValid = false;
            errorMessage += '請輸入您的訊息\n';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // 顯示發送中提示
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = '發送中...';
        submitBtn.disabled = true;

        // 準備要發送的參數
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };

        // 使用 EmailJS 發送郵件
        emailjs.send("service_7obfipk", "template_r1pya8g", {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_name: "網站管理員"
        }, "u7RkLiYmEbw9HZnFd")  // 添加 public key 作為第四個參數
            .then(function(response) {
                console.log('郵件發送成功!', response.status, response.text);
                alert('表單提交成功！我們會盡快回覆您。');
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('郵件發送失敗:', error);
                alert('發送失敗，請稍後再試或直接聯繫我們。');
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 技能卡片動畫
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach(category => {
    category.addEventListener('mouseenter', () => {
        category.style.transform = 'translateY(-10px)';
    });

    category.addEventListener('mouseleave', () => {
        category.style.transform = 'translateY(0)';
    });
});

// 首頁輪播圖片
       
// 加載新聞數據
async function loadNewsData() {
    try {
        const response = await fetch('./data/news.json');
        const data = await response.json();
        return data.slides;
    } catch (error) {
        console.error('加載數據失敗：', error);
        return [];
    }
}

// 初始化輪播
async function initializeSwiper() {
    const slides = await loadNewsData();
    const sliderContainer = document.getElementById('newsSlider');
    
    // 確保 sliderContainer 存在
    if (!sliderContainer) {
        console.error('無法找到 sliderContainer 元素');
        return;
    }

    // 生成輪播內容
    slides.forEach(slide => {
        const slideHTML = `
            <div class="swiper-slide">
                <a href="javascript:;">
                    <img src="${slide.image}" alt="${slide.title}" />
                    <div class="layer">
                        <div class="desc">${slide.desc}</div>
                        <div class="hidden-time">${slide.time}</div>
                        <div class="hidden-title">${slide.title}</div>
                    </div>
                </a>
            </div>
        `;
        sliderContainer.innerHTML += slideHTML;
    });

    // 初始化 Swiper - 實現無縫輪播
    if (!window.mySwiper1) { // 確保只初始化一次
        window.mySwiper1 = new Swiper('.akiswiper', {
            autoplay: {
                delay: 20980,
                disableOnInteraction: false
            },
            speed: 800,
            autoHeight: true,
            loop: true,
            loopAdditionalSlides: 2, // 前後多複製幾個slide，保證無縫
            slidesPerView: 'auto', // 根據容器寬度自動調整顯示數量
            centeredSlides: true, // 居中顯示
            effect: 'slide', // 使用滑動效果
            watchSlidesProgress: true, // 監視slide的progress
            // 添加左右導航按鈕
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
            },
            on: {
                init: function () {
                    // 在初始化時觸發動畫
                    const activeDesc = document.querySelector('.swiper-slide-active .desc');
                    if (activeDesc) {
                        activeDesc.classList.add('active');
                    }
                },
                slideChange: function () {
                    updateProjectDetails(slides[this.realIndex]);
                },
                slideChangeTransitionEnd: function () {
                    try {
                        // 獲取當前幻燈片索引（從0開始）
                        const currentIndex = this.realIndex;
                        const totalSlides = this.slides.length - this.loopedSlides * 2;
                        // console.log(`當前是第 ${currentIndex + 1}/${totalSlides} 張`);

                        // 更新描述的活動狀態
                        const descriptions = document.querySelectorAll('.akiswiper .desc');
                        descriptions.forEach(desc => desc.classList.remove('active'));
                        
                        const activeDesc = document.querySelector('.swiper-slide-active .desc');
                        if (activeDesc) {
                            activeDesc.classList.add('active');
                        }

                        // 更新時間和標題
                        const activeSlide = document.querySelector('.swiper-slide-active');
                        const timeElement = document.querySelector('.news-aki-time');
                        const titleElement = document.querySelector('.news-aki-title');

                        if (activeSlide && timeElement && titleElement) {
                            const time = activeSlide.querySelector('.hidden-time');
                            const title = activeSlide.querySelector('.hidden-title');
                            
                            if (time) timeElement.textContent = time.textContent;
                            if (title) titleElement.textContent = title.textContent;
                        }
                    } catch (error) {
                        console.error('輪播更新出錯：', error);
                    }
                }
            }
        });
    }
}

// 更新項目詳情
function updateProjectDetails(slide) {
    const details = document.getElementById('projectDetails');
    if (!details || !slide) return;

    details.querySelector('.featured-number').textContent = slide.number;
    details.querySelector('.featured-category').textContent = slide.category;
    details.querySelector('.featured-title').textContent = slide.title;
    details.querySelector('.featured-description').textContent = slide.description;

    const techStack = details.querySelector('.tech-stack');
    techStack.innerHTML = slide.tech.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    // 動態生成連結
    const linksContainer = document.getElementById('featuredLinks');
    let linksHTML = '';
    
    // 檢查demoLink是否存在且不為空
    if (slide.demoLink && slide.demoLink.trim() !== '') {
        linksHTML += `<a href="${slide.demoLink}" class="btn" target="_blank">查看演示</a>`;
    }
    
    // 檢查codeLink是否存在且不為空
    if (slide.codeLink && slide.codeLink.trim() !== '') {
        linksHTML += `<a href="${slide.codeLink}" class="project-link" target="_blank">查看項目</a>`;
    }
    
    linksContainer.innerHTML = linksHTML;
}

// 加載項目數據
async function loadProjectsData() {
    try {
        const response = await fetch('./data/projects.json');
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('加載項目數據失敗：', error);
        return [];
    }
}

// 初始化項目卡片
async function initializeProjects() {
    const projects = await loadProjectsData();
    const projectsGrid = document.getElementById('projectsGrid');
    
    // 確保 projectsGrid 存在
    if (!projectsGrid) {
        console.error('無法找到 projectsGrid 元素');
        return;
    }

    // 清空容器
    projectsGrid.innerHTML = '';

    // 生成項目卡片
    projects.forEach(project => {
        const projectHTML = `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.alt}">
                </div>
                <div class="project-overlay">
                    <div class="project-category">${project.projectCategory}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-links">
                        ${project.demoLink ? `<a href="${project.demoLink}" class="btn" target="_blank" rel="noopener noreferrer">查看演示</a>` : ''}
                        ${project.codeLink ? `<a href="${project.codeLink}" class="project-link" target="_blank" rel="noopener noreferrer">查看項目</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        projectsGrid.innerHTML += projectHTML;
    });

    // 重新綁定過濾按鈕事件
    bindFilterButtons();
}

// 綁定過濾按鈕事件
function bindFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按鈕的active類
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加當前按鈕的active類
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            projectCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// 當 DOM 加載完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeSwiper();
    initializeProjects();
});
    
