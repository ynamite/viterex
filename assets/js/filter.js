const Utils = await import(MASSIF.assets.js.utilities);

const logger = new Utils.Logger();

const $doc = document;
const $html = document.querySelector('html');
const $body = $html.querySelector('body');

class MASSIF_filter {
    filterContainer;
    filter = '0';
    filteredItems = [];
    options;
    filterOpen = false;
    itemsWrapper;
    loadingSpinner;
    runExecuteFilter = true;
    splitText = false;
    defaults = {
        selector: '.row-filter',
    };
    constructor(options) {
        this.options = { ...this.defaults, ...options };
        this.init();
    }

    init() {
        this.filterContainer = $doc.querySelector(this.options.selector);
        if (this.filterContainer) {
            this.itemsWrapper = document.querySelector(
                this.options.itemsWrapper
            );
            this.filterToggle =
                this.filterContainer.querySelector('.filter-toggle');
            this.filterLabelText =
                this.filterContainer.querySelector('.filter-label-text');
            this.filterIcon = this.filterToggle.querySelector('.icon');
            this.filterDD = this.filterContainer.querySelector('.filter-dd');
            this.filters = this.filterDD.querySelectorAll('[data-filter]');
            this.filterItems = [
                ...this.itemsWrapper.querySelectorAll(
                    this.options.itemsSelector
                ),
            ];
            this.filterActiveElement = this.filterDD.querySelector('.active');
            this.initFilter();
        }
    }

    async initFilter() {
        this.initialValue = this.filterLabelText.textContent;
        // this.filterLabelText.textContent = this.filterActive.textContent;
        // this.filterActive.textContent = allTxt;
        this.filterDD.style.display = 'none';
        this.filterToggle.addEventListener('click', this.openClose);
        this.filterToggle.addEventListener('touchend', this.openClose);
        this.filters.forEach((item) => {
            const items = this.filterItems.filter((element) =>
                item.dataset?.filter
                    ?.split(',')
                    .includes(element.dataset.filter)
            );
            if (items.length === 0 && item.dataset?.filter !== '0') {
                item.closest('li').remove();
                return;
            }
            if (item.dataset?.filter === this.filter) {
                item.closest('li').setAttribute('hidden', true);
            }
            item.addEventListener('click', async (event) => {
                if (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                this.filterLabelText.innerText = event.target.innerText;
                this.itemApplyFilter(event);
                await this.openClose();
                this.filters.forEach((filter) =>
                    filter.closest('li').removeAttribute('hidden')
                );
                item.closest('li').setAttribute('hidden', true);
            });
        });
    }

    openClose = (event) => {
        if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        return new Promise(async (resolve) => {
            if (!this.filterOpen) {
                this.filterOpen = true;
                this.filterToggle.classList.add('filter-open');
                gsap.to(this.filterIcon, {
                    rotation: '0',
                    y: 10,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.fromTo(
                            this.filterIcon,
                            {
                                rotation: '-180_ccw',
                                y: -10,
                                opacity: 0,
                            },
                            { y: 0, opacity: 1, duration: 0.3 }
                        );
                    },
                });
                // this.filterToggle.classList.add('active');
                this.filterDD.style.display = 'block';
                ScrollTrigger.refresh();

                await gsap.from(this.filterDD, {
                    y: -20,
                    // opacity: 0,
                    height: 0,
                    duration: 0.3,
                    clearProps: 'opacity,height,y',
                    onComplete: () => {
                        resolve();
                    },
                });
                $html.addEventListener('click', this.openClose);
            } else {
                gsap.to(this.filterIcon, {
                    y: -10,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.fromTo(
                            this.filterIcon,
                            { rotation: 0, y: 10, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.3,
                            }
                        );
                    },
                });
                this.filterToggle.classList.remove('filter-open');

                await gsap.to(this.filterDD, {
                    y: -20,
                    opacity: 0,
                    height: 0,
                    duration: 0.2,
                    clearProps: 'opacity,height,y',
                    onComplete: () => {
                        this.filterDD.style.display = 'none';
                        this.filterOpen = false;
                        resolve();
                    },
                });
                $html.removeEventListener('click', this.openClose);
            }
        });

        /*
        if (this.filterIcon.style.display === 'block') {
        }
        */
    };

    itemApplyFilter = async (event) => {
        if (event) {
            try {
                event.preventDefault();
                event.stopImmediatePropagation();
            } catch (error) {}
        }
        const filter = event.target.closest('[data-filter]').dataset.filter;
        if (filter === this.filter) return;

        await this.executeFilter(filter);
    };

    executeFilter = async (filter) => {
        if (filter === '0') {
            this.filteredItems = this.filterItems;
        } else {
            this.filteredItems = this.filterItems.filter((item) =>
                item.dataset?.filter?.split(',').includes(filter)
            );
        }

        this.filterItems.forEach((item) => {
            if (!this.filteredItems.includes(item)) {
                item.setAttribute('hidden', true);
            } else {
                item.removeAttribute('hidden');
            }
        });

        this.filter = filter;
    };
}

export { MASSIF_filter };
