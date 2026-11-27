
(function () {
    const BREAKPOINT = 900;   

    const header = document.querySelector('header');
    if (!header || document.getElementById('mobileMenu')) return;   

    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle {
            display: none;
            width: 48px;
            height: 48px;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 12px;
            background: var(--gold, #b8862f);
            color: #fff;
            font-size: 1.4rem;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0, 0, 0, .25);
            transition: transform .2s;
        }
        .nav-toggle:hover { transform: scale(1.05); }
        .nav-toggle:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

        .mobile-menu {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            width: min(82vw, 340px);
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 90px 28px 32px;
            background: #2f3a1f;
            box-shadow: -10px 0 30px rgba(0, 0, 0, .35);
            transform: translateX(100%);
            visibility: hidden;
            transition: transform .3s ease, visibility .3s;
        }
        .mobile-menu.open { transform: translateX(0); visibility: visible; }

        .mobile-menu a {
            display: block;
            padding: 14px 16px;
            border-radius: 10px;
            color: #fff;
            font-size: 1.15rem;
            font-weight: 600;
            letter-spacing: .04em;
            text-decoration: none;
            transition: background .2s, color .2s;
        }
        .mobile-menu a:hover,
        .mobile-menu a:focus-visible { background: rgba(255, 255, 255, .1); color: var(--gold, #b8862f); }
        .mobile-menu a.active { color: var(--gold, #b8862f); background: rgba(255, 255, 255, .08); }

        .mobile-menu a.menu-cafe {
            margin-top: 14px;
            background: var(--gold, #b8862f);
            color: #fff;
            text-align: center;
        }
        .mobile-menu a.menu-cafe:hover,
        .mobile-menu a.menu-cafe:focus-visible { background: #a87a28; color: #fff; }

        .menu-close {
            position: absolute;
            top: 22px;
            right: 22px;
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, .12);
            color: #fff;
            font-size: 1.3rem;
            cursor: pointer;
        }
        .menu-close:hover,
        .menu-close:focus-visible { background: var(--gold, #b8862f); }

        .menu-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1999;
            background: rgba(0, 0, 0, .5);
            opacity: 0;
            visibility: hidden;
            transition: opacity .3s, visibility .3s;
        }
        .menu-backdrop.open { opacity: 1; visibility: visible; }
        body.menu-lock { overflow: hidden; }

        @media (max-width: ${BREAKPOINT}px) {
            header nav,
            header .nav-cafe { display: none !important; }
            .nav-toggle { display: flex; }
        }
        @media (min-width: ${BREAKPOINT + 1}px) {
            .mobile-menu,
            .menu-backdrop { display: none; }
        }
    `;
    document.head.appendChild(style);

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobileMenu');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    header.appendChild(toggle);

    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';

    const menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.setAttribute('aria-label', 'Main menu');
    menu.setAttribute('aria-hidden', 'true');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'menu-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    menu.appendChild(closeBtn);

    header.querySelectorAll('nav a').forEach(link => {
        const copy = link.cloneNode(true);
        copy.className = link.classList.contains('active') ? 'active' : '';
        menu.appendChild(copy);
    });

    const cafe = header.querySelector('.nav-cafe');
    if (cafe) {
        const copy = cafe.cloneNode(true);
        copy.className = 'menu-cafe';
        menu.appendChild(copy);
    }

    document.body.append(backdrop, menu);

    function openMenu() {
        menu.classList.add('open');
        backdrop.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-lock');
        closeBtn.focus();
    }
    function closeMenu() {
        menu.classList.remove('open');
        backdrop.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-lock');
    }

    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => { closeMenu(); toggle.focus(); });
    backdrop.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > BREAKPOINT && menu.classList.contains('open')) closeMenu();
    });
})();
