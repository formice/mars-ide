function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function initSelect($,form,ele,group){
    $.ajax({
        //拼接下拉选项
        url:'http://localhost:8080/common/dic/group',
        method:'post',
        data: {'group':group},
        dataType:'JSON',
        success: function (res) {
            if(res.code='200') {
                var data = res.data;
                for (var i in data) {
                    $("#"+ele).append('<option value="' + data[i].code + '">' + data[i].name + '</option>');
                }
                form.render('select');
            }
        }
    });
}