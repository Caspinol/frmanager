var users = (function(){

    var newUser = $("#new-user"),
        editUser = $(".edit-user"),
        deleteUser = $("#delete-user"),
        modalCancel = $(".modal-add-cancel");

    var initEditModal = function(button){
        var editModal = $(".modal").css('z-index', 1000).css('opacity', 1)
        /* Need to get the edited user details */
        $.ajax({
            type: 'GET',
            url: button.href,
            success: function(data){
                var form = editModal.find('form')
                /* Edit the url to post */
                form.attr('action', '/U/edit')
                form.find('input[type=text]').remove()
                var html = ''
                var data = data[0]
                console.log(data)
                for(var key in data){
                    if(key === 'id'){
                        /* ID is NOT editable */
                        html += '<input type="text" class="modal-add-'+ key
                            +'"name="'+ key +'" value="'+ data[key] +'" readonly/>'
                    }else{
                        html += '<input type="text" class="modal-add-'+ key
                            +'"name="'+ key +'" value="'+ data[key] +'"/>'
                    }
                }
                form.prepend(html)
            }
        })
    }
    
    var initModule = function(){
        /* Open modal */
        newUser.click(function(){
            $(".modal").css('z-index', 1000).css('opacity', 1)
        })
        /* Cancel modal operation */
        modalCancel.click(function(){
            $(".modal").css('opacity', 0).css('z-index', -999)
        })
        /* Show the edit modal */
        editUser.click(function(e){
            e.preventDefault()
            initEditModal(this)
        })
    }
    
    return { initModule: initModule };
}());

