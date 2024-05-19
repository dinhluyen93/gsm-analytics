"use strict";

var SetupUserData = function() {
    var userData;

    const userAvatarButton = document.getElementById('user_avatar_button');
    const userAvatarHover = document.getElementById('user_avatar_hover');
    const userFullnameHover = document.getElementById('user_fullname_hover');
    const userCityHover = document.getElementById('user_city_hover');
    const userAmbassadorHover = document.getElementById('user_ambassador_hover');

    function getFirstLetter(text) {
        let name;
        if (typeof text === 'string' && text.length > 0) {
            // Tách chuỗi thành mảng các từ
            const words = text.trim().split(/\s+/);
            // Trả về từ cuối cùng của mảng
            name = words[words.length - 1];
        }

        if (typeof name === 'string' && name.length > 0) {
            return name.charAt(0).toUpperCase();
        }
        return '';
    }

    return {
        init: function() {
            userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                userData = {
                    fullname: "Ẩn Danh",
                    city: "hanoi",
                    ambassador: "8h"
                };
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            userAvatarHover.innerText = getFirstLetter(userData.fullname)
            userAvatarButton.innerText = getFirstLetter(userData.fullname)
            userFullnameHover.innerText = userData.fullname
            if (userData.city === "hanoi"){
                userCityHover.innerText = "Hà Nội"
            } else if (userData.city === "danang") {
                userCityHover.innerText = "Đà Nẵng"
            } else {
                userCityHover.innerText = "Hồ Chí Minh"
            }
            userAmbassadorHover.innerText = userData.ambassador
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    SetupUserData.init();
});
