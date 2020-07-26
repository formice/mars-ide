$(function(){
    $("#btn-verfi-code").click(function(){
        var disabled = $("#btn-verfi-code").attr("disabled");
        if(disabled){
            return false;
        }
        if($("#mobile").val() == "" || isNaN($("#mobile").val()) || $("#mobile").val().length != 11 ){
            alert("请填写正确的手机号！");
            return false;
        }
        settime();
        $.ajax({
            async:false,
            type: "POST",
            url: serviceUrl+"/sms/send/code",
            data: {mobile:$("#mobile").val()},
            //dataType: "json",
            async:false,
            success:function(data){
                console.log(data);
                settime();
            },
            error:function(err){
                console.log(err);
            }
        });
    });
    var countdown=60;
    var _generate_code = $("#btn-verfi-code");
    function settime() {
        if (countdown == 0) {
            _generate_code.attr("disabled",false);
            _generate_code.val("获取验证码");
            countdown = 60;
            return false;
        } else {
            $("#btn-verfi-code").attr("disabled", true);
            _generate_code.val("重新发送(" + countdown + ")");
            countdown--;
        }
        setTimeout(function() {
            settime();
        },1000);
    }

    $("#btn-login").click(function(){
        if($("#mobile").val() == "" || isNaN($("#mobile").val()) || $("#mobile").val().length != 11 ){
            alert("请填写正确的手机号！");
            return false;
        }
        if($("#verfi-code").val() == "" || isNaN($("#verfi-code").val()) || $("#verfi-code").val().length != 4 ){
            alert("请填写正确的验证码！");
            return false;
        }
        $.ajax({
            async:false,
            type: "POST",
            url: serviceUrl+"/uc/login/quick",
            data: {mobile:$("#mobile").val(),code:$("#verfi-code").val()},
            //dataType: "json",
            async:false,
            success:function(res){
                console.log(res);
                if(res.code == 200){
                    //设置登录token
                    setTicket(res.data);
                    window.location.href="../../index.html"
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    });
})