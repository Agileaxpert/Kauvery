"use strict";

// Class definition
var KTApp = function() {
    var initPageLoader =  function() {
        // CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
        KTUtil.removeClass(document.body, 'page-loading');
        document.getElementsByClassName("page-loading").forEach((elem) => {
            if(!KTUtil.hasClass(elem, "stay-page-loading")){
                KTUtil.removeClass(elem, 'page-loading');
            }
        });
    }

    var initBootstrapTooltip = function(el, options) {
        var delay = {};

        // // allowlist for tooltip
        // var tooltipAllowList = bootstrap.Tooltip.Default.allowList;
        // // To allow table, tr, th, td elements
        // tooltipAllowList.table = [];
        // tooltipAllowList.tr = [];
        // tooltipAllowList.th = [];
        // tooltipAllowList.td = [];

        // enable / disable sanitize for tooltip
        if (el.hasAttribute('data-bs-sanitize')) {
            options['sanitize'] = el.getAttribute('data-bs-sanitize') == "true";
        }

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Check dismiss options
        if (el.hasAttribute('data-bs-dismiss') && el.getAttribute('data-bs-dismiss') == 'click') {
            options['dismiss'] = 'click';
        }            

        // Initialize popover
        var tp = new bootstrap.Tooltip(el, options);

        // Handle dismiss
        if (options['dismiss'] && options['dismiss'] === 'click') {
            // Hide popover on element click
            el.addEventListener("click", function(e) {
                tp.hide();
            });
        }

        return tp;
    }

    var initBootstrapTooltips = function(el, options) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]:not(.initialized)'));

        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            tooltipTriggerEl.classList.add("initialized");
            initBootstrapTooltip(tooltipTriggerEl, {});
        });
    }

    var initBootstrapPopover = function(el, options) {
        var delay = {};

        // enable / disable sanitize for popover
        if (el.hasAttribute('data-bs-sanitize')) {
            options['sanitize'] = el.getAttribute('data-bs-sanitize') == "true";
        }

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Handle dismiss option
        if (el.getAttribute('data-bs-dismiss') == 'true') {
            options['dismiss'] = true;
        }

        if (options['dismiss'] === true) {
            options['template'] = '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"><i class="bi bi-x fs-2"></i></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }

        // Initialize popover
        var popover = new bootstrap.Popover(el, options);

        // Handle dismiss click
        if (options['dismiss'] === true) {
            var dismissHandler = function (e) {
                popover.hide();
            }

            el.addEventListener('shown.bs.popover', function() {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.addEventListener('click', dismissHandler);
            });

            el.addEventListener('hide.bs.popover', function() {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.removeEventListener('click', dismissHandler);
            });
        }

        return popover;
    }

    var initBootstrapPopovers = function() {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]:not(.initialized)'));

        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            popoverTriggerEl.classList.add("initialized");
            initBootstrapPopover(popoverTriggerEl, {});
        });
    }

    var initScrollSpy = function() {
        var elements = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]:not(.initialized)'));

        elements.map(function (element) {
            element.classList.add("initialized");
            var sel = element.getAttribute('data-bs-target');
            //var offset = element.hasAttribute('data-bs-target-offset') ?  parseInt(element.getAttribute('data-bs-target-offset')) : 0;

            /*
            KTUtil.on(document.body,  element.getAttribute('data-bs-target') + ' [href]', 'click', function(e) {
                e.preventDefault();

                var el = document.querySelector(this.getAttribute('href'));

                KTUtil.scrollTo(el, offset);
            });
            */
            
            var scrollContent = document.querySelector(element.getAttribute('data-bs-target'));
            var scrollSpy = bootstrap.ScrollSpy.getInstance(scrollContent);
            if (scrollSpy) {
                scrollSpy.refresh();
            }
        });
    }

    var initButtons = function() {
        var buttonsGroup = [].slice.call(document.querySelectorAll('[data-kt-buttons="true"]:not(.initialized)'));

        buttonsGroup.map(function (group) {
            group.classList.add("initialized");
            var selector = group.hasAttribute('data-kt-buttons-target') ? group.getAttribute('data-kt-buttons-target') : '.btn';

            // Toggle Handler
            KTUtil.on(group, selector, 'click', function(e) {
                var buttons = [].slice.call(group.querySelectorAll(selector + '.active'));

                buttons.map(function (button) {
                    button.classList.remove('active');
                });

                this.classList.add('active');
            });
        });
    }   

    var initCheck = function() {
        var initializedCheckEventId = undefined;

        if(document.body.hasAttribute("data-initialized-check-event-id")){
            initializedCheckEventId = document.body.getAttribute("data-initialized-check-event-id");

            KTUtil.off(document.body, "change", initializedCheckEventId);

            initializedCheckEventId = undefined;
        }

        // Toggle Handler
        initializedCheckEventId = KTUtil.on(document.body,  '[data-kt-check="true"]', 'change', function(e) {
            var check = this;
            var targets = document.querySelectorAll(check.getAttribute('data-kt-check-target'));

            KTUtil.each(targets, function (target) {
                if (target.type == 'checkbox') {
                    target.checked = check.checked;
                } else {
                    target.classList.toggle('active');
                }                
            });
        });

        document.body.setAttribute("data-initialized-check-event-id", initializedCheckEventId);
    }

    var initSelect2 = function() {
        var elements = [].slice.call(document.querySelectorAll('[data-control="select2"]:not(.initialized), [data-kt-select2="true"]:not(.initialized)'));
       
        elements.map(function (element) {
            element.classList.add("initialized");

            var options = {
                dir: document.body.getAttribute('direction')
            };

            if ( element.getAttribute('data-hide-search') == 'true') {
                options.minimumResultsForSearch = Infinity;
            }
            
            $(element).select2(options);
        });
    }

    var initAutosize = function() {
        var inputs = [].slice.call(document.querySelectorAll('[data-kt-autosize="true"]:not(.initialized)'));
       
        inputs.map(function (input) {
            input.classList.add("initialized");
            autosize(input);
        });
    }

    var initCountUp = function() {
        var elements = [].slice.call(document.querySelectorAll('[data-kt-countup="true"]:not(.counted):not(.initialized)'));

        elements.map(function (element) {
            element.classList.add("initialized");
            if (KTUtil.isInViewport(element) && KTUtil.visible(element) ) {
                var options = {};

                var value = element.getAttribute('data-kt-countup-value');
                value = parseFloat(value.replace(/,/,''));

                if (element.hasAttribute('data-kt-countup-start-val')) {
                    options.startVal = parseFloat(element.getAttribute('data-kt-countup-start-val'));
                }

                if (element.hasAttribute('data-kt-countup-duration')) {
                    options.duration = parseInt(element.getAttribute('data-kt-countup-duration'));
                }

                if (element.hasAttribute('data-kt-countup-decimal-places')) {
                    options.decimalPlaces = parseInt(element.getAttribute('data-kt-countup-decimal-places'));
                }

                if (element.hasAttribute('data-kt-countup-prefix')) {
                    options.prefix = element.getAttribute('data-kt-countup-prefix');
                }

                if (element.hasAttribute('data-kt-countup-suffix')) {
                    options.suffix = element.getAttribute('data-kt-countup-suffix');
                }

                var count = new countUp.CountUp(element, value, options);

                count.start();
                
                element.classList.add('counted');
            }                
        });
    }

    var initCountUpTabs = function() {
        // Initial call
        initCountUp();

        // Window scroll event handler
        window.addEventListener('scroll', initCountUp);

        // Tabs shown event handler
        var tabs = [].slice.call(document.querySelectorAll('[data-kt-countup-tabs="true"][data-bs-toggle="tab"]:not(.initialized)'));
        tabs.map(function (tab) {
            tab.classList.add("initialized");
            tab.addEventListener('shown.bs.tab', initCountUp);
        });        
    }

    var initTinySliders = function() {
        // Init Slider
        var initSlider = function(el) {
            if (!el) {
                return;
            }

            const tnsOptions = {};

            // Convert string boolean
            const checkBool = function(val) {
                if (val === 'true') {
                    return true;
                }
                if (val === 'false') {
                    return false;
                }
                return val;
            };

            // get extra options via data attributes
            el.getAttributeNames().forEach(function(attrName) {
                // more options; https://github.com/ganlanyuan/tiny-slider#options
                if ((/^data-tns-.*/g).test(attrName)) {
                    let optionName = attrName.replace('data-tns-', '').toLowerCase().replace(/(?:[\s-])\w/g, function(match) {
                        return match.replace('-', '').toUpperCase();
                    });
                    
                    if (attrName === 'data-tns-responsive') {
                        // fix string with a valid json
                        const jsonStr = el.getAttribute(attrName).replace(/(\w+:)|(\w+ :)/g, function(matched) {
                            return '"' + matched.substring(0, matched.length - 1) + '":';
                        });
                        try {
                            // convert json string to object
                            tnsOptions[optionName] = JSON.parse(jsonStr);
                        }
                        catch (e) {
                        }
                    }
                    else {
                        tnsOptions[optionName] = checkBool(el.getAttribute(attrName));
                    }
                }
            });

            const opt = Object.assign({}, {
                container: el,
                slideBy: 'page',
                autoplay: true,
                autoplayButtonOutput: false,
            }, tnsOptions);

            if (el.closest('.tns')) {
                KTUtil.addClass(el.closest('.tns'), 'tns-initiazlied');
            }

            return tns(opt);
        }

        // Sliders
        const elements = Array.prototype.slice.call(document.querySelectorAll('[data-tns="true"]:not(.initialized)'), 0);

        if (!elements && elements.length === 0) {
            return;
        }

        elements.forEach(function(el) {
            el.classList.add("initialized");
            initSlider(el);
        });
    }

    var initSmoothScroll = function() {
        if (typeof SmoothScroll != "undefined") {
            new SmoothScroll('a[data-kt-scroll-toggle][href*="#"]:not(.initialized)', {
                offset: function (anchor, toggle) {
                    anchor.classList.add("initialized");
                    // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
                    // This example is a function, but you could do something as simple as `offset: 25`

                    // An example returning different values based on whether the clicked link was in the header nav or not
                    if (anchor.hasAttribute('data-kt-scroll-offset')) {
                        var val = KTUtil.getResponsiveValue(anchor.getAttribute('data-kt-scroll-offset'));

                        return val;
                    } else {
                        return 0;
                    }
                }
            });
        }        
    }

    return {
        init: function() {
            this.initPageLoader();

            this.initBootstrapTooltips();
            
            this.initBootstrapPopovers();
            
            this.initScrollSpy();
            
            this.initButtons();
            
            this.initCheck();
            
            this.initSelect2();
            
            this.initCountUp();

            this.initCountUpTabs();

            this.initAutosize();

            this.initTinySliders();

            this.initSmoothScroll();
        },

        initPageLoader: function() {
            initPageLoader();
        },

        initBootstrapTooltip: function(el, options) {
            return initBootstrapTooltip(el, options);
        },

        initBootstrapTooltips: function() {
            initBootstrapTooltips();
        },

        initBootstrapPopovers: function() {
            initBootstrapPopovers();
        },

        initBootstrapPopover: function(el, options) {
            return initBootstrapPopover(el, options);
        },

        initScrollSpy: function() {
            initScrollSpy();
        },

        initButtons: function() {
            initButtons();
        },

        initCheck: function() {
            initCheck();
        },

        initSelect2: function() {
            initSelect2();
        },

        initCountUp: function() {
            initCountUp();
        },

        initCountUpTabs: function() {
            initCountUpTabs();
        },

        initAutosize: function() {
            initAutosize();
        },

        initTinySliders: function() {
            initTinySliders();
        },

        initSmoothScroll: function() {
            initSmoothScroll();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTApp.init();
});

// On window load
window.addEventListener("load", function() {
	KTApp.initPageLoader();
});

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTApp;
}