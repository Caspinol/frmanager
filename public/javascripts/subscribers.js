var users = (function(){

    var newUser = $("#new-user"),
        editUser = $("#edit-user"),
        deleteUser = $("#delete-user"),
        modalCancel = $("#modal-add-cancel");

    var initModule = function(){
        /* Open modal */
        newUser.click(function(){
            $(".modal").css('opacity', 1).css('z-index', 1000)
        })

        /* Cancel modal operation */
        modalCancel.click(function(){
            $(".modal").css('opacity', 0).css('z-index', -999)
        })
    }
    
    return { initModule: initModule };
}());
