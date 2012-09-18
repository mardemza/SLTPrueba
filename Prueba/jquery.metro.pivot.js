//PIVOT CONTROL
; (function ($, window, document, undefined) {
    Array.prototype.remove = function(from, to) {
          var rest = this.slice((to || from) + 1 || this.length);
          this.length = from < 0 ? this.length + from : from;
          return this.push.apply(this, rest);
        };

    var pivotDefaults = {};

    //CONSTRUCTOR
    function pivot() { }

    $.metro.attach('pivot', pivot);

    /* ################################ */
    /* ####  PIVOT PUBLIC METHODS  #### */
    /* ################################ */

    //create (BEGIN)

    function create(options) {
        //Configure options
        this.settings = {
            my : 'settings'
        };

        var self = this;

        this.navIndex = 0;

        $.extend(this.settings, pivotDefaults, options);

        var pctrl = this.target();
        var nav = $('<ul />').addClass('metroui-pivot-nav').css({ 'position' : 'relative', top : 0, left : 0 });
        var pContent = $('<div />').css( { 'position' : 'absolute', top : 40, left : 0 } );

        //TODO:  Rework to allow sizing, using fixed size for testing.
        pctrl.css({
            width: 900,
            height: 250,
                'overflow-x' : 'hidden',
                'position' : 'relative',
                'left' : 0,
                'top' : 0
            });
       
        var navLinks = new Array();
        var pageTiles = new Array();
        var idx = 0;
        this.target().children().each(function() {   
            var el = $(this);
            if(el.is('div')) {
                //TODO:  Make sure the h2 was actually found before creating li
                var title = el.find('h2:first-child');
                var mi = $('<li />');
                mi.text(title.text());
                title.remove();
                nav.append(mi);
                el.css( { 'position' : 'absolute', left : idx > 0 ? 901 : 0, top : 0 });
                pContent.append(el);
                pageTiles.push(el);

            } else { 
                el.remove();
            }
            idx++;
        });

        pctrl.prepend(pContent);
        pctrl.prepend(nav);

        idx = 0;
        var clft = 0;
        
        nav.children().each(function() {
            var el = $(this);
            el.data('metro-pivot-idx', idx);
            el.data('metro-pivot-navpos', idx);

            el.css({ 
                    'display' : 'block',
                    'position' : 'absolute',
                    'cursor' : 'pointer',
                    top : 0,
                    left : clft
                });

            el.bind('click', function() {
                    fn_NavigateTo.call(this, navLinks, pageTiles, self);
                });

            navLinks.push(el);

            clft += el.width() + 20;
            idx++;
        });

        navLinks[self.navIndex].toggleClass('metro-selected');

        return this;
    }

    pivot.prototype['create'] = create;
    //create (END)


    /* ################################# */
    /* ####  PIVOT PRIVATE METHODS  #### */
    /* ################################# */
    var fn_NavigateTo = function(navlinks, pages, pivotObject)
    {
        var el = $(this);
        var newindex = el.data('metro-pivot-idx');
        var pos = el.data('metro-pivot-navpos');

        if(newindex == pivotObject.navIndex || newindex > pages.length)
            return;

        pages[pivotObject.navIndex].fadeOut(600, function()
        {
            $(this).css({ left : 901 });
        });

        navlinks[pivotObject.navIndex].toggleClass('metro-selected');
        navlinks[newindex].toggleClass('metro-selected');

        pivotObject.navIndex = newindex;
        pages[newindex].fadeIn(300).animate( { left : 0 }, 600);

        //determine which elements need to be moved
        var swapElements = new Array();
        var slideElements = new Array();
        var swapIndex = newindex == 0 ? navlinks.length - 1 : newindex - 1;
        for(var i = 0, k = 0; i < navlinks.length; i++, k++)
        {
            if(k < pos)
                swapElements.push(navlinks[swapIndex]);
            else
                slideElements.push(navlinks[swapIndex]);

            swapIndex = swapIndex <= 0 ? navlinks.length - 1 : swapIndex - 1;
        }

        swapElements.reverse();
        slideElements.reverse();

        for(var i = 0; i < slideElements.length; i++)
        {
            slideElements[i].data('metro-pivot-navpos', i);
        }

        for(var i = 0, k = slideElements.length; i < swapElements.length; i++, k++)
        {
            swapElements[i].data('metro-pivot-navpos', k);
        }
        
        for(var i = 0; i < swapElements.length; i++)
        {
            if(i < swapElements.length - 1)
                swapElements[i].fadeOut(300);
            else
                swapElements[i].fadeOut(300, function() {
                        var cLft = 0;
                        for(var k = 0; k < slideElements.length; k++)
                        {
                            if(k < slideElements.length - 1)
                                slideElements[k].animate({ left : cLft }, 300);
                            else
                                slideElements[k].animate({ left : cLft }, function() {
                                        var bLft = cLft;
                                        for(var j = 0; j < swapElements.length; j++)
                                        {
                                            var currLft = parseInt(swapElements[j].css('left').replace('px', ''))
                                            var newLft = currLft + bLft;
                                            swapElements[j].css({ left : newLft }).fadeIn(300);
                                        }
                                    });

                            cLft += slideElements[k].width() + 20;

                        }
                    });
        }
    }

    var fn_animateIn = function(pageTile) {
            
            var el = $(this);
        };

})(jQuery, window, document);