module.exports = function(curr_page, total_pages) {
    var prev_page, next_page;
    var html = '';
    var total_pages = parseInt(total_pages)
    var curr_page = parseInt(curr_page)
    var difference = total_pages - curr_page;
    var low_range = curr_page - 3;
    var high_range = curr_page + 4;

    if (total_pages <= 10) {
        for (var i=0; i<total_pages; i++) {
            if(curr_page === i){
                html += '<li><a href="" class="active">' + (i+1) + '</a></li>'
            }else{
                html += '<li><a href="/U/'+i+'">' + (i+1) + '</a></li>'
            }
        }
    } else if (total_pages > 10 && difference < 5) {
        html += '<li><a href="/U/1">1</a></li><li><a href="" class="dotdot inactive">&hellip;</a></li>';
        for (var i=(total_pages - 5); i<=total_pages; i++) {
            if(curr_page === i){
                html += '<li><a href="" class="active">' + i + '</a></li>'
            }else{
                html += '<li><a href="/U/'+i+'">' + i + '</a></li>'
            }
        }
    } else if (total_pages > 10) {
        if (curr_page < 6) {
            for (var i=0; i<7; i++) {
                if(curr_page === i){
                    html += '<li><a href="" class="active">' + (i+1) + '</a></li>'
                }else{
                    html += '<li><a href="/U/'+i+'">' + (i+1) + '</a></li>'
                }
            }
            html += '<li><a href="" class="dotdot inactive">&hellip;</a></li>';
            html += '<li><a href="">' + total_pages + '</a></li>'
        } else {
            html = '<li><a href="/U/1">1</a></li><li><a href="" class="dotdot inactive">&hellip;</a></li>';
            for (var i=low_range; i<high_range; i++) {
                if(curr_page === i){
                    html += '<li><a href="" class="active">' + i + '</a></li>'
                }else{
                    html += '<li><a href="/U/'+i+'">' + i + '</a></li>'
                }
            }
            html += '<li><a href="" class="dotdot inactive">&hellip;</a></li>'+'<li><a href="">' + total_pages + '</a></li>'
        }
    }
    if (curr_page == 0) {
        prev_page =  '<li><a href="" class="inactive">&lang;</a></li>';
    } else {
        prev_page =  '<li><a href="/U/'+(curr_page-1)+'">&lang;</a></li>';
    }
    if (curr_page == total_pages - 1) {
        next_page = '<li><a href="" class="inactive">&rang;</a></li>';
    } else {
        next_page = '<li><a href="/U/'+(curr_page+1)+'">&rang;</a></li>';
    }
    
    return '<ul>' + prev_page + html + next_page + '</ul>'
}
