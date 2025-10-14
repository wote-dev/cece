document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.page-preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    }, 800);

    AOS.init({
        disable: false,
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
        offset: 120,
        delay: 0,
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
    });

    const tabLinks = document.querySelectorAll('.main-nav a, .logo a');
    const contentPanels = document.querySelectorAll('main > section');
    const mainNavLinks = document.querySelectorAll('.main-nav a');

    let currentPanel = null;
    let isTransitioning = false;

    const showPanel = (panelId) => {
        const targetPanel = document.querySelector(panelId);
        if (!targetPanel || currentPanel === targetPanel || isTransitioning) return;

        isTransitioning = true;

        if (targetPanel.id === 'tour') {
            document.body.style.overflowY = 'auto';
        } else {
            document.body.style.overflowY = 'hidden';
        }

        if (currentPanel) {
            currentPanel.classList.remove('active');
            
            setTimeout(() => {
                currentPanel.style.display = 'none';
                showNewPanel();
            }, 200);
        } else {
            showNewPanel();
        }

        function showNewPanel() {
            targetPanel.style.display = targetPanel.id === 'home' ? 'flex' : 'flex';
            
            targetPanel.offsetHeight;
            setTimeout(() => {
                targetPanel.classList.add('active');
                
                const sectionHeader = targetPanel.querySelector('.section-content > h2');
                if (sectionHeader) {
                    if (targetPanel.id === 'music') {
                        sectionHeader.style.display = 'none';
                    } else {
                        sectionHeader.style.display = '';
                    }
                }
                
                currentPanel = targetPanel;
                
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === panelId) {
                        link.classList.add('active');
                    }
                });
                
                AOS.refresh();
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }, 50);
        }
    };

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                showPanel(href);
            }
        });
    });

    contentPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
    
    setTimeout(() => {
        const homePanel = document.querySelector('#home');
        if (homePanel) {
            homePanel.style.display = 'flex';
            setTimeout(() => {
                homePanel.classList.add('active');
                currentPanel = homePanel;
                
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('active');
                    }
                });
            }, 50);
        }
    }, 900);

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    const toggleMobileMenu = () => {
        hamburgerMenu.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            if (currentPanel && currentPanel.id === 'tour') {
                document.body.style.overflowY = 'auto';
            } else {
                document.body.style.overflowY = 'hidden';
            }
        }
    };

    const closeMobileMenu = () => {
        hamburgerMenu.classList.remove('active');
        mainNav.classList.remove('active');
        if (currentPanel && currentPanel.id === 'tour') {
            document.body.style.overflowY = 'auto';
        } else {
            document.body.style.overflowY = 'hidden';
        }
    };

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    document.addEventListener('selectstart', (e) => {
        if (e.target.closest('.main-nav a, .logo a')) {
            e.preventDefault();
        }
    });
});