/* **********************************************
     Begin open.js
********************************************** */

(function($) {
    "use strict";
    var PANEL = window.PANEL || {},
          bulkArray = {};

    /* **********************************************
     Toggle panel
********************************************** */

    PANEL.toggle = function() {

        var $elopen = $('.panel_open'),
            $elclose = $('.panel_close'),
            $target = $('.theme_panel'),
            transitionEvent = whichTransitionEvent();

        var onEndTransitionFn = function(ev) {
            if (!$target.hasClass('opened')) $('.theme_panel_container', $target).hide();
        };
        if (transitionEvent) {
            $target[0].addEventListener(transitionEvent, onEndTransitionFn);
        } else {
            onEndTransitionFn();
        }
        $elopen.on("click", function(e) {
            e.preventDefault();
            $target.toggleClass("opened");
            if ($target.hasClass('opened')) $('.theme_panel_container', $target).show();
            return false;
        });
    };

    /* **********************************************
     Buttons
********************************************** */

    PANEL.buttons = function() {

        var $save = $('.panel_footer #saveCookies'),
            $saveOption = $('.panel_body .btn-save-option'),
            $boxedBack = $('.panel_body .boxed-back'),
            $reset = $('.panel_body #resetCookies');

        function createCookie(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }
        function eraseCookie(name) {
            createCookie(name,"",-1);
        }

        $saveOption.on("click", function(e) {
            var getData = $(e.currentTarget).data();
            if ( getData.id === '_uncode_boxed' ) {
                createCookie('_uncode_just_boxed', 'on');
            }
            createCookie(getData.id, getData.value);
            //if (getData.full != undefined) createCookie('_uncode_menu_full', getData.full);
            window.location.href = window.location.href.match(/^[^\#\?]+/)[0];
            // $.each(bulkArray, function(index, value) {
            //     document.cookie = index + value;
            // });
            // window.location.href = window.location.href.match(/^[^\#\?]+/)[0];
            //location.reload();
        });

        var boxedBG = function(e){
            var $tgt,
                $box = $('.box-wrapper');

            if ( typeof e === 'undefined' ) {
                $tgt = $('.theme_panel .btn-backgrounds .boxed-back').first();
                if ( $box.css('background-image') !== '' && $box.css('background-image') !== 'none' ) {
                    return;
                }
            } else {
                $tgt = $(e.currentTarget);
            }
            var getData = $tgt.data();

            if ( typeof getData !== 'undefined' ) {
                var getSrc = $tgt.attr('img-src'),
                    backArray = String(getData.back).split(",");
                    backArray[backArray.length-1] = getData.id;
                $('.box-wrapper').css({
                    'background-image': 'url('+getSrc+')',
                    'background-size': 'cover',
                    'background-attachment': 'fixed',
                    'background-position': 'center middle'
                });
                $('.panel_section .boxed-back.btn-disable-hover').removeClass('btn-disable-hover');
                $tgt.addClass('btn-disable-hover');
                createCookie('_uncode_body_background', backArray.join(','));
            }
        };

        boxedBG();

        $boxedBack.on("click", function(e) {
            boxedBG(e);
        });

        var $boxedWidth = $('.theme_panel #boxed-range'),
        $style = $("<style type='text/css'>").appendTo('head');

        function changeWidth(value) {
            var css = "\
                .limit-width {\
                    max-width:   "+value+"px;\
                }";
            $style.html(css);
            window.dispatchEvent(UNCODE.boxEvent);
            if (document.createEvent) {
                window.dispatchEvent( new Event('resize') );
            }else{
                document.body.fireEvent('onresize');
            }
        }

        $boxedWidth.on("change", function(e) {
            changeWidth($(this).attr('value'));
            createCookie('_uncode_main_width', $(this).attr('value')+',px');
        });

        $reset.on("click", function(e) {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var getTheCookie = cookies[i].split("=")[0];
                if (getTheCookie.indexOf("_uncode") > -1) eraseCookie(getTheCookie);
            }
            var href = document.location.href;
            var new_url;
            var index = href.indexOf('?');
            if (index > 0) {
                new_url = href.substring(0, index);
            }

            window.location.href = new_url; //location.reload();
        });
    };

    /* **********************************************
     Select
********************************************** */

    PANEL.select = function() {

        var $el = $('.theme_panel select');

        $el.each(function() {
            $(this).on("change", function(e) {
                bulkArray[$(this).attr('data-id')] = '=' + $(this).attr('value') + "; expires=0; path=/";
            });
        });

    };

    /* **********************************************
     Input
********************************************** */

    PANEL.input = function() {

        var $el = $('.theme_panel input[type="text"], .theme_panel input[type="number"]');

        $el.each(function() {
            $(this).on("input", function(e) {
                bulkArray[$(this).attr('data-id')] = '=' + $(this).val() + "; expires=0; path=/";
            });
        });

    };

    /* **********************************************
     Switch
********************************************** */

    PANEL.switch = function() {

        var $el = $('.theme_panel input[type=checkbox]');

        $el.each(function() {
            $(this).on("change", function(e) {
                if ($(this).is(':checked') == true) {
                    bulkArray[$(this).attr('data-id')] = '=on; expires=0; path=/';
                } else {
                    bulkArray[$(this).attr('data-id')] = '=off; expires=0; path=/';
                }

                if ($(this).attr('data-id') == '_uncode_boxed') {
                    if($('.boxed-box').css('display')=='none') {
                        $('.boxed-box').show();
                    } else $('.boxed-box').hide();
                }
            });
        });

    };

/* **********************************************
     Show chat
********************************************** */

    PANEL.showChat = function() {

        // if ($('html').hasClass('no-touch')) {
        //     setTimeout(function() {
        //         $('#intercom-container').show();
        //     }, 2000);
        // }

        var $container,
            $iframe;

        $('#menu-item-65136 > a, .panel_chat > a').on('click', function(e){
            e.preventDefault();
            $container = $('#intercom-container');
            $iframe = $('iframe', $container);
            var $open = $iframe.contents().find('.intercom-launcher')[0];

            if ( typeof $open !== 'undefined' ) {
                //$open.setAttribute('style','display:none!important');
                if ( $.isFunction(Intercom) ) {
                    console.log('yeah');
                    Intercom('show');
                    $container.addClass('frame-loaded').addClass('open-panel-chat');
                    $iframe.contents().on('click', '.intercom-launcher', function(){
                        $container.removeClass('open-panel-chat');
                    });
                }
            }
        });

    };


    /* **********************************************
     Color
********************************************** */

    PANEL.color = function() {

        var options = {
            color: false,
            mode: 'hsl',
            controls: {
                horiz: 's', // horizontal defaults to saturation
                vert: 'l', // vertical defaults to lightness
                strip: 'h' // right strip defaults to hue
            },
            hide: true, // hide the color picker by default
            border: true, // draw a border around the collection of UI elements
            target: false, // a DOM element / jQuery selector that the element will be appended within. Only used when called on an input.
            width: 200, // the width of the collection of UI elements
            palettes: true, // show a palette of basic colors beneath the square.
            change: function(event, ui) {
                // event = standard jQuery event, produced by whichever control was changed.
                // ui = standard jQuery UI object, with a color member containing a Color.js object

                // change the headline color
                bulkArray[$(this).attr('data-id')] = '=' + $(this).val() + '; expires=0; path=/';
            }
        }

        $('.color-picker').iris(options);
    };

    /* **********************************************
     Begin app.js
********************************************** */

    PANEL.init = function() {
        PANEL.toggle();
        //PANEL.input();
        //PANEL.select();
        //PANEL.switch();
        //PANEL.color();
        PANEL.buttons();
        PANEL.showChat();
    }

    $(function() {
        PANEL.init();
    });

})(jQuery);

// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-33655525-6', 'auto');
// ga('send', 'pageview');

// *
// * Function that tracks a click on an outbound link in Analytics
// * This function takes a valid URL string as an argument, and uses that URL string
// * as the event label. Setting the transport method to 'beacon' lets the hit be sent
// * using 'navigator.sendBeacon' in browser that support it.

// var trackOutboundLink = function(url) {
//    ga('send', 'event', 'outbound', 'click', url, {
//      'transport': 'beacon',
//      'hitCallback': function(){document.location = url;}
//    });
// }
