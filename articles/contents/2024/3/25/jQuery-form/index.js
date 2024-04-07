$(document).ready(function () {
  // 當表單提交時
  $("form").submit(function () {
    // 獲取輸入的帳號和密碼
    const username = $("#username").val();
    const password = $("#password").val();
    // 彈出帳號和密碼
    alert("帳號：" + username + "\n密碼：" + password);

    // 防止表單提交到新頁面
    return false;
  });
});
