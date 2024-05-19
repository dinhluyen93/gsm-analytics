"use strict";
var KTAccountSettingsDeleteData = function() {
    var t, n, e;
    return {
        init: function() {
            (t = document.querySelector("#kt_delete_account_data_form")) && (e = document.querySelector("#kt_delete_account_data_submit"), n = FormValidation.formValidation(t, {
                fields: {
                    deactivate: {
                        validators: {
                            notEmpty: {
                                message: "Vui lòng đánh dấu vào ô để xóa dữ liệu tài khoản"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger,
                    submitButton: new FormValidation.plugins.SubmitButton,
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: ""
                    })
                }
            }), e.addEventListener("click", (function(t) {
                t.preventDefault(), n.validate().then((function(t) {
                    "Valid" == t ? swal.fire({
                        text: "Bạn có chắc chắn muốn hủy xóa dữ liệu tài khoản của mình không?",
                        icon: "warning",
                        buttonsStyling: !1,
                        showDenyButton: !0,
                        confirmButtonText: "Có",
                        denyButtonText: "Không",
                        customClass: {
                            confirmButton: "btn btn-light-primary",
                            denyButton: "btn btn-danger"
                        }
                    }).then((t => {
                        if (t.isConfirmed) {
                            // Xóa localStorage
                            localStorage.clear();
                            
                            Swal.fire({
                                text: "Tài khoản của bạn đã bị xóa dữ liệu.",
                                icon: "success",
                                confirmButtonText: "Ok",
                                buttonsStyling: !1,
                                customClass: {
                                    confirmButton: "btn btn-light-primary"
                                }
                            });
                        } else if (t.isDenied) {
                            Swal.fire({
                                text: "Tài khoản không bị xóa dữ liệu.",
                                icon: "info",
                                confirmButtonText: "Ok",
                                buttonsStyling: !1,
                                customClass: {
                                    confirmButton: "btn btn-light-primary"
                                }
                            });
                        }
                    })) : swal.fire({
                        text: "Xin lỗi, có một số lỗi được phát hiện, vui lòng thử lại.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, hiểu rồi!",
                        customClass: {
                            confirmButton: "btn btn-light-primary"
                        }
                    })
                }))
            })))
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTAccountSettingsDeleteData.init()
}));
