var shell = (function(){    
    
    var
    setupModule = function(){
        /* Init the sticky navbar */
        sticky.makeSticky()
        /* Init users button handlers */
        users.initModule()
    },

    initModule = function(){
        setupModule();
    };

    return { initModule: initModule };
}());
