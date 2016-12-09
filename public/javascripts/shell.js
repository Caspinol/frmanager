var shell = (function(){    
    
    var
    setupModule = function(){
        /* Init the sticky navbar */
        sticky.makeSticky();
    },

    initModule = function(){
        setupModule();
    };

    return { initModule: initModule };
}());
