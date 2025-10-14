document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.querySelector('.page-preloader');
    
    // Hide preloader after a short delay to ensure smooth loading
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
            // Remove preloader from DOM after transition
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    }, 800);

    // Initialize AOS (Animate on Scroll) Library
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

    // --- Smooth Tab Navigation ---
    const tabLinks = document.querySelectorAll('.main-nav a, .logo a');
    const contentPanels = document.querySelectorAll('main > section');
    const mainNavLinks = document.querySelectorAll('.main-nav a');

    let currentPanel = null;
    let isTransitioning = false;

    const showPanel = (panelId) => {
        const targetPanel = document.querySelector(panelId);
        if (!targetPanel || currentPanel === targetPanel || isTransitioning) return;

        isTransitioning = true;

        // Handle body scrolling based on the new panel
        if (targetPanel.id === 'tour') {
            document.body.style.overflowY = 'auto';
        } else {
            document.body.style.overflowY = 'hidden';
        }

        // If there's a current panel, fade it out first
        if (currentPanel) {
            currentPanel.classList.remove('active');
            
            // Wait for fade out transition to complete
            setTimeout(() => {
                currentPanel.style.display = 'none';
                showNewPanel();
            }, 200); // Half of the transition duration for smooth overlap
        } else {
            showNewPanel();
        }

        function showNewPanel() {
            // Show new panel
            targetPanel.style.display = targetPanel.id === 'home' ? 'flex' : 'flex';
            
            // Force reflow to ensure display change is applied
            targetPanel.offsetHeight;
            
            // Add active class to trigger fade in
            setTimeout(() => {
                targetPanel.classList.add('active');
                
                // Handle H2 visibility within .section-content
                const sectionHeader = targetPanel.querySelector('.section-content > h2');
                if (sectionHeader) {
                    if (targetPanel.id === 'music') {
                        sectionHeader.style.display = 'none';
                    } else {
                        sectionHeader.style.display = '';
                    }
                }
                
                // Update current panel reference
                currentPanel = targetPanel;
                
                // Update active class on navigation links
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === panelId) {
                        link.classList.add('active');
                    }
                });
                
                // Refresh AOS for newly visible elements
                AOS.refresh();
                
                // Reset transition flag after animation completes
                setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }, 50); // Small delay to ensure smooth transition
        }
    };

    // Add click event listeners to tab links
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only handle internal anchor links for tab switching
            if (href && href.startsWith('#')) {
                e.preventDefault();
                showPanel(href);
            }
        });
    });

    // Initialize - hide all panels first
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
    
    // Show home panel on initial load
    setTimeout(() => {
        const homePanel = document.querySelector('#home');
        if (homePanel) {
            homePanel.style.display = 'flex';
            setTimeout(() => {
                homePanel.classList.add('active');
                currentPanel = homePanel;
                
                // Set initial active state
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('active');
                    }
                });
            }, 50);
        }
    }, 900); // Show after preloader starts hiding

    // --- Mobile Hamburger Menu ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    const toggleMobileMenu = () => {
        hamburgerMenu.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll based on the currently active panel
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
        // Restore body scroll based on the currently active panel
        if (currentPanel && currentPanel.id === 'tour') {
            document.body.style.overflowY = 'auto';
        } else {
            document.body.style.overflowY = 'hidden';
        }
    };

    // Toggle menu when hamburger is clicked
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize if switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Prevent double-click issues on navigation
    document.addEventListener('selectstart', (e) => {
        if (e.target.closest('.main-nav a, .logo a')) {
            e.preventDefault();
        }
    });
});