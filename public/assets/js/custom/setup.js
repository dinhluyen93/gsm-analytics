"use strict";

var SetupdataUser = function() {
    var dataUser;

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
            dataUser = JSON.parse(localStorage.getItem('dataUser'));
            if (!dataUser) {
                dataUser = {
                    fullname: "Ẩn Danh",
                    city: "hanoi",
                    ambassador: "8h"
                };
                localStorage.setItem('dataUser', JSON.stringify(dataUser));
            }

            userAvatarHover.innerText = getFirstLetter(dataUser.fullname)
            userAvatarButton.innerText = getFirstLetter(dataUser.fullname)
            userFullnameHover.innerText = dataUser.fullname
            if (dataUser.city === "hanoi"){
                userCityHover.innerText = "Hà Nội"
            } else if (dataUser.city === "danang") {
                userCityHover.innerText = "Đà Nẵng"
            } else {
                userCityHover.innerText = "Hồ Chí Minh"
            }
            userAmbassadorHover.innerText = dataUser.ambassador
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    SetupdataUser.init();
});
