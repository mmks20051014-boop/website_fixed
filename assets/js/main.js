// Site core helpers
(function () {
    'use strict';

    var navState = {
        nav: null,
        placeholder: null,
        originalParent: null,
        originalNextSibling: null
    };

    function getNavElements() {
        if (!navState.nav) {
            navState.nav = document.getElementById('navLinks');
        }
        var nav = navState.nav;
        var btn = document.getElementById('hamburgerBtn');
        var overlay = document.getElementById('navOverlay');
        return { nav: nav, btn: btn, overlay: overlay };
    }

    function ensurePlaceholder(nav) {
        if (!nav || navState.placeholder) return;
        navState.originalParent = nav.parentNode;
        navState.originalNextSibling = nav.nextSibling;
        navState.placeholder = document.createComment('navLinks-placeholder');
        nav.parentNode.insertBefore(navState.placeholder, nav);
    }

    function moveNavToBody() {
        var elements = getNavElements();
        var nav = elements.nav;
        if (!nav) return;

        ensurePlaceholder(nav);

        if (nav.parentNode !== document.body) {
            document.body.appendChild(nav);
        }

        nav.dataset.navPortal = 'body';
        nav.style.zIndex = '10000';
    }

    function restoreNavToHeader() {
        var elements = getNavElements();
        var nav = elements.nav;
        if (!nav || nav.parentNode !== document.body) return;

        if (navState.placeholder && navState.placeholder.parentNode) {
            navState.placeholder.parentNode.insertBefore(nav, navState.placeholder);
            navState.placeholder.parentNode.removeChild(navState.placeholder);
        } else if (navState.originalParent) {
            if (navState.originalNextSibling && navState.originalNextSibling.parentNode === navState.originalParent) {
                navState.originalParent.insertBefore(nav, navState.originalNextSibling);
            } else {
                navState.originalParent.appendChild(nav);
            }
        }

        navState.placeholder = null;
        nav.dataset.navPortal = 'header';
        nav.style.zIndex = '';
    }

    function relocateMobileNav() {
        var elements = getNavElements();
        if (!elements.nav) return;

        if (window.innerWidth <= 768) {
            moveNavToBody();
        } else {
            restoreNavToHeader();
            if (elements.overlay) {
                elements.overlay.classList.remove('active');
                elements.overlay.style.display = 'none';
            }
            document.body.style.overflow = '';
        }
    }

    window.__relocateMobileNav = relocateMobileNav;

    document.addEventListener('DOMContentLoaded', function () {
        relocateMobileNav();
    });

    window.addEventListener('resize', function () {
        relocateMobileNav();
    });
})();
