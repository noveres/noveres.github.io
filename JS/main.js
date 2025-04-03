// 導航欄滾動效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 項目過濾功能
document.addEventListener('DOMContentLoaded', () => {
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
});

// 表單驗證
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 獲取表單數據
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

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

        // 如果驗證通過，可以在這裡添加發送表單的邏輯
        alert('表單提交成功！我們會盡快回覆您。');
        contactForm.reset();
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
    var mySwiper1 = new Swiper('.index-news .swiper', {
        autoplay: false,
        speed: 800,
        autoHeight: true,
        loop: true,
        pagination: {
            el: '.index-news .swiper-pagination',
            clickable: true
        },
        on: {
            slideChangeTransitionEnd: function () {
                // 给焦点轮播图添加滚动字幕效果
                $('.index-news .akiswiper .desc').removeClass('active')
                $('.index-news .akiswiper .swiper-slide-active .desc').addClass('active')

                // 给焦点轮播图添加对应的标题和日期
                $('.index-news .news-aki-time').html($('.index-news .swiper-slide-active .hidden-time').html())
                $('.index-news .news-aki-title').html($('.index-news .swiper-slide-active .hidden-title').html())
            },
        },
    });
