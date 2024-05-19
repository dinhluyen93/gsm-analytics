"use strict";

var KTAccountSettingsProfileDetails = (function() {
    var e, t, userData;
    const userAvatar = document.getElementById('user_avatar');
    const userFullname = document.getElementById('user_fullname');
    const userCity = document.getElementById('user_city');
    const userAmbassador = document.getElementById('user_ambassador');

    function getLastWord(text) {
        if (typeof text === 'string' && text.length > 0) {
            // Tách chuỗi thành mảng các từ
            const words = text.trim().split(/\s+/);
            // Trả về từ cuối cùng của mảng
            return words[words.length - 1];
        }
        return ''; // Trả về chuỗi rỗng nếu đầu vào không hợp lệ
    }

    return {
        init: function() {
            e = document.getElementById("kt_account_profile_details_form");

            userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                console.log(userData)
                e.querySelector('[name="fullname"]').value = userData.fullname;
                e.querySelector('[name="city"]').value = userData.city;
                e.querySelector('[name="ambassador"]').value = userData.ambassador;

                userAvatar.innerText = getLastWord(userData.fullname)
                userFullname.innerText = userData.fullname
                if (userData.city === "hanoi"){
                    userCity.innerText = "Hà Nội"
                } else if (userData.city === "danang") {
                    userCity.innerText = "Đà Nẵng"
                } else {
                    userCity.innerText = "Hồ Chí Minh"
                }
                userAmbassador.innerText = userData.ambassador
            } else {
                console.log('Chưa có dữ liệu')
                e.querySelector('[name="fullname"]').value = 'Ẩn Danh';
                e.querySelector('[name="city"]').value = 'hanoi';
                e.querySelector('[name="ambassador"]').value = '8h';

                userAvatar.innerText = 'Ẩn Danh'
                userFullname.innerText = 'Ẩn Danh'
                userCity.innerText = "Hà Nội"
                userAmbassador.innerText = '8h'
            }

            if (e) {
                var submitButton = e.querySelector("#kt_account_profile_details_submit");
                t = FormValidation.formValidation(e, {
                    fields: {
                        fullname: {
                            validators: {
                                notEmpty: {
                                    message: "Tên là bắt buộc"
                                }
                            }
                        },
                        city: {
                            validators: {
                                notEmpty: {
                                    message: "Thành phố là bắt buộc"
                                }
                            }
                        },
                        ambassador: {
                            validators: {
                                notEmpty: {
                                    message: "Đại sứ là bắt buộc"
                                }
                            }
                        }
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap5({
                            rowSelector: ".fv-row",
                            eleInvalidClass: "",
                            eleValidClass: ""
                        })
                    }
                });

                $(e.querySelector('[name="ambassador"]')).on("change", function() {
                    t.revalidateField("ambassador");
                });
                $(e.querySelector('[name="city"]')).on("change", function() {
                    t.revalidateField("city");
                });

                // Thêm sự kiện submit
                submitButton.addEventListener("click", function(event) {
                    event.preventDefault();
                    t.validate().then(function(status) {
                        if (status === 'Valid') {
                            // Lấy dữ liệu từ các trường
                            var fullname = e.querySelector('[name="fullname"]').value;
                            var city = e.querySelector('[name="city"]').value;
                            var ambassador = e.querySelector('[name="ambassador"]').value;

                            // Lưu dữ liệu vào localStorage
                            var userData = {
                                fullname: fullname,
                                city: city,
                                ambassador: ambassador
                            };
                            localStorage.setItem('userData', JSON.stringify(userData));

                            // Giả sử dữ liệu được lưu thành công
                            Swal.fire({
                                text: "Dữ liệu của bạn đã được thay đổi thành công!",
                                icon: "success",
                                confirmButtonText: "Ok",
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn btn-light-primary"
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Tải lại trang
                                    location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                text: "Xin lỗi, có một số lỗi được phát hiện, vui lòng thử lại.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, hiểu rồi!",
                                customClass: {
                                    confirmButton: "btn btn-light-primary"
                                }
                            });
                        }
                    });
                });
            }
        }
    };
})();

KTUtil.onDOMContentLoaded(function() {
    KTAccountSettingsProfileDetails.init();
});
