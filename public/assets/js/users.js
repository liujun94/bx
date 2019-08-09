// 展示用户数据页面
// 定义一个存储用户数据的数组,用户保存与数据库中数据的同步
let userArr = [];
// 展示用户
$.ajax({
    type: "get",
    url: "/users",
    success: function (res) {
        // 把请求回来的数据赋值给数组
        userArr = res;
        render(userArr);
    }
});
// 定义一个渲染用户数据模板的方法
function render(arr) {
    let str = template('usersTpl', {
        list: arr
    })
    $("tbody").html(str);
}

// 添加用户
$("#form").on("submit", function () {
    let formData = $(this).serialize();
    $.ajax({
        type: "post",
        url: "/users",
        data: formData,
        success: function (res) {
            userArr.unshift(res);
            render(userArr);
            // 清空表单的内容
            $("#preview").attr("src", "../assets/img/default.png");
            $("#form")[0].reset();
        }
    });
    return false;
});
// 用户头像预览功能
$("#modifyBox").on("change", "#avatar", function () {
    // 创建formData对象
    let formData = new FormData();
    // 向formData中添加数据
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: "post",
        url: "/upload",
        data: formData,
        // 告诉ajax方法不要解析请求参数
        processData: false,
        // 告诉ajax方法不要设置请求参数的类型
        contentType: false,
        success: function (res) {
            // 头像预览
            $("#preview").attr("src", res[0].avatar);
            // 利用隐藏域把图片地址保存起来发送到服务端
            $("#avatarImg").val(res[0].avatar);
        }
    });
});

// 编辑用户修改功能
// 1.渲染页面模板
$("tbody").on("click", ".edit", function () {
    let id = $(this).attr("data-id");
    $.ajax({
        type: "get",
        url: "/users/" + id,
        success: function (res) {
            let str = template("modifyTpl", res);
            $("#modifyBox").html(str);
        }
    });
});
// 提交信息修改用户的信息
$("#modifyBox").on("submit", "#modifyForm", function () {
    // 利用jQuery中的表单序列化的方法获取数据
    let formData = $(this).serialize();
    let id = $(this).attr("data-id");
    // 发送ajax请求修改数据
    $.ajax({
        type: "put",
        url: "/users/" + id,
        data: formData,
        success: function (res) {
            location.reload();
        }
    });
    return false;
});