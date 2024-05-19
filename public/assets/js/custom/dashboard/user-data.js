"use strict";

var AddUserData = function() {
    var partnerSelect = document.getElementById('partner_select');
    var workingCity = document.getElementById('working_city');
    var workingCityDisplay = document.getElementById('working_city_display');
    var userData = JSON.parse(localStorage.getItem("userData"));

    // Hàm để cập nhật dữ liệu trong localStorage
    function updateLocalStorage() {
        var userData = {
            "partner": partnerSelect.value,
            "location": workingCity.value
        };
        var userDataJson = JSON.stringify(userData);
        localStorage.setItem("userData", userDataJson);
        updateTextDisplay(userData.location)
    }

    function updateTextDisplay(location) {
        if (location == "hanoi") {
            workingCityDisplay.innerText = 'Hà Nội'
        } else if (location == "danang") {
            workingCityDisplay.innerText = 'Đà Nẵng'
        } else {
            workingCityDisplay.innerText = 'TP HCM'
        }
    }

    return {
        init: function() {
            if (userData) {
                partnerSelect.value = userData.partner;
                workingCity.value = userData.location;
                updateTextDisplay(userData.location)
            } else {
                partnerSelect.value = "8h";
                workingCity.value = "hanoi";
                updateLocalStorage(); // Cập nhật dữ liệu mặc định vào localStorage
            }

            // Lắng nghe sự kiện thay đổi của các phần tử và cập nhật dữ liệu vào localStorage
            partnerSelect.addEventListener('change', updateLocalStorage);
            workingCity.addEventListener('change', updateLocalStorage);
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    AddUserData.init();
});
