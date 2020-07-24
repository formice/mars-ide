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
        /*$.ajax({
            async:false,
            type: "GET",
            url: "{:U('User/sms')}",
            data: {mobile:$("#mobile").val()},
            dataType: "json",
            async:false,
            success:function(data){
                console.log(data);
                settime();
            },
            error:function(err){
                console.log(err);
            }
        });*/
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
})