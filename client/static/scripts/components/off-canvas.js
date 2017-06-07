class Nav {
    constructor(options) {
        this.trigger = document.querySelector('.mobile-trigger');
        this.container = document.querySelector('.mobile-container');
        this.menu = document.querySelector('.mobile-menu');
        this.animateClass = '--animating';
        this.openClass = '--open';
        this.closeKeys = [27];
    }

    open = e => {
        this.menu.style.willChange = 'transform';
        this.container.classList.add(this.animateClass);

        if (this.container.classList.contains(this.animateClass)) {
            this.addEvents();
            this.build();
        }

        this.menu.style.willChange = 'auto';
    };

    close = e => {
        this.menu.style.willChange = 'transform';
        this.container.classList.add(this.animateClass);

        if (this.container.classList.contains(this.openClass)) {
            this.addEvents();
            this.remove();
        }
    };

    build = () => {
        this.trigger.classList.add('is-active');
        this.container.classList.add(this.openClass);
        document.body.classList.add('mobile-open');
        document.body.addEventListener('keydown', this.handleCloseKey);
    }

    remove = () => {
        this.trigger.classList.remove('is-active');
        this.container.classList.remove(this.openClass);
        document.body.classList.remove('mobile-open');
        document.body.removeEventListener('keydown', this.handleCloseKey);
    }

    handleCloseKey = e => {
        if (this.closeKeys.includes(e.which)) {
            e.preventDefault();
            this.close();
        }
    }

    onTransitionEnd = () => {
        this.container.classList.remove(this.animateClass);
    }

    addEvents = () => {
        this.container.addEventListener('transitionend', this.onTransitionEnd);
    }   
}

export default Nav;
