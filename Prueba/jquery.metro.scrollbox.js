//LIST CONTROL
; (function ($, window, document, undefined) {
    var scrollBoxDefaults = {};

    //CONSTRUCTOR
    function scrollBox() {}


    $.metro.attach('scrollBox', scrollBox);
    /* #################################### */
    /* ####  SCROLLBOX PUBLIC METHODS  #### */
    /* #################################### */

    //create (BEGIN)

    function create(options) {
        //Configure options
        this.settings = {
            width: 600,
            height: 400,
            autohide : false
        };
        
        $.extend(this.settings, scrollBoxDefaults, options);
        
        //Create scrollBox wrapper
        var scrollbox = $('<div />').css(
            {
                width : this.settings.width, 
                height : this.settings.height, 
                'overflow' : 'hidden',
                'position' : 'relative',
                'left' : 0,
                'top' : 0,
                'background-color' : '#333'
            });
        
        var master = scrollbox.clone().insertBefore(this.target()).append(scrollbox);
        
        var container = $('<div />').css(
            {
                'padding-right' : '20px',
                'padding-top' : '1px'
            }).append(this.target()).appendTo(scrollbox);
        
        var scrollbar = $('<div />').css(
            {
                width : '20px', 
                height : this.settings.height, 
                'position' : 'absolute',
                'right' : 0,
                'top' : 0,
                'background-color' : '#888'
            }).appendTo(master);
        
        var oH = container.height();
        var sH = parseInt(Math.max(Math.min(scrollbox.height() / container.height(), 1) * scrollbox.height(), 15));
        
        var scroller = $('<div />').css(
            {
                position : 'absolute',
                top : 0,
                left : 0,
                height : sH,
                width : 20,
                'background-color' : '#b80000'
            }).appendTo(scrollbar);
        
        //Attach scrollbox events
        if(this.settings.autohide) {
            scrollbar.hide();
            
            master.bind('mouseenter', function (e) {            
                scrollbar.dequeue().stop(true, true).fadeIn(300);          
            });
        
            master.bind('mouseleave',function () {  
                scrollbar.dequeue().stop(true, true).fadeOut(300);
            });
        }
              
        //scroll event
        var doScroll = function (e) {
            var pos = $.metro.mousepos(this, e);

            var posY = pos.y - (scroller.height() / 2);
            var maxY = scrollbox.height() - scroller.height();
            var maxScroll = (container.height() - scrollbox.height()) + (scroller.height() / 2);
            var scrollAmt = $.metro.math.clamp((container.height() / (maxY + (scroller.height() / 2))) * posY, 0, maxScroll);
            
            scrollbox.scrollTop(scrollAmt);
            scroller.css({ top : $.metro.math.clamp(posY, 0, maxY) });
            
        };
        
        scrollbar.bind('mousedown', function() {
            fn_bindScrollAction();
            });
      
       
       scrollbar.bind('click', doScroll);

        var fn_bindScrollAction = function () {
            $.metro.disableSelect(master);

            master.unbind('mousemove', doScroll)
                .bind('mousemove', doScroll)
                .bind('mouseup', fn_unbindScrollAction)
                .bind('mouseleave', fn_unbindScrollAction);
                        
        };

        var fn_unbindScrollAction = function() {
            master.unbind('mousemove', doScroll)
                .unbind('mouseup', fn_unbindScrollAction)
                .unbind('mouseleave', fn_unbindScrollAction);

            $.metro.enableSelect(master);
        };
        
        var fn_contentResize = function () {
            var nH = container.height();
            if(oH != nH) {
                oH = nH;
                var srollerH = parseInt(Math.max(Math.min(scrollbox.height() / nH, 1) * scrollbox.height(), 15));
                scroller.animate({ height : srollerH }, 200);
            }
            
            window.setTimeout(fn_contentResize, 200);
        };
        
        window.setTimeout(fn_contentResize, 200);
       
        //Add accessor method for container
        this.content = function () {
            return container;
        };

        return this;
    }

    scrollBox.prototype['create'] = create;
    //create (END)

    

})(jQuery, window, document);