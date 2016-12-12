sticky = (function(){

    var stickyDiv = $('.header-nav');
    
    drawSticky = function(){
        
        if ($(window).scrollTop() >= ($('.real').offset().top)) {
            /* Started scrolling so hide original navbar
             * and keep drawing its copy on the top of screen
             */
            var real = $('.real'),
                real_left = real.offset().left,  
                real_width = real.css('width');
            
            $('.sticky').css('left', real_left)//.css('padding-bottom', '.3em')
                .css('top', 0).css('width', real_width).show();
            real.css('visibility','hidden');
        } else {
            $('.sticky').hide();
            $('.real').css('visibility','visible');
        }
    };

    makeSticky = function(){
        /* Duplicate the original menu bar */
        stickyDiv.addClass('real')
            .clone().insertAfter(stickyDiv).addClass('sticky')
            .css('position','fixed').css('top', 0)
            .css('margin-top', 0).removeClass('real').hide();

        scrollIntervalID = setInterval(drawSticky, 20);
    };

    return { makeSticky: makeSticky };
}());
