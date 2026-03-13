// Header scroll effect

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollTop = 0;
    let scrollTimeout;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Set timeout to ensure header shows after scroll stops
        scrollTimeout = setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 300);
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Use passive event listener for better performance
    window.addEventListener('scroll', function() {
        requestTick();
    }, { passive: true });

    // Initial check
    handleScroll();

    console.log('スクロール連動ヘッダー機能初期化完了');
});

// Optional: Add intersection observer for header color changes based on background
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    if (!header || !heroSection) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // In hero section - header should be transparent
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
            } else {
                // Not in hero section - apply normal styles
                if (window.pageYOffset > 80) {
                    header.classList.add('scrolled');
                }
            }
        });
    }, observerOptions);

    observer.observe(heroSection);
});