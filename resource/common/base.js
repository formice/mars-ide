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

function addTab(id,title,url){
    title = '<span class="pear-tab-active"></span><span class="able-close">'+title+'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>'
    //title = '<span class="pear-tab-active"></span><span class="disable-close">'+title+'</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>'

    window.parent.layui.element.tabDelete("content",id)
    window.parent.layui.element.tabAdd("content",{id:id,title:title,content:'<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'" style="width:100%;height: 100%"></iframe>'});
    window.parent.layui.element.tabChange("content",id);


    //tab.addTabOnlyByElem('content',{id:3,title:title,url:url,close:true},300);
}

function closeTab(id){
    window.parent.layui.element.tabDelete("content",id);
}