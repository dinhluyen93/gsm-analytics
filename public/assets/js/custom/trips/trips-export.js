"use strict";

var KTTripsExport = function() {
    var modalElement, submitButton, cancelButton, closeButton, formValidator, formElement, modalInstance;

    return {
        init: function() {
            modalElement = document.querySelector("#trips_export_modal");
            modalInstance = new bootstrap.Modal(modalElement);
            formElement = document.querySelector("#dl_trips_export_form");
            submitButton = formElement.querySelector("#dl_trips_export_submit");
            cancelButton = formElement.querySelector("#dl_trips_export_cancel");
            closeButton = modalElement.querySelector("#dl_trips_export_close");
            formValidator = FormValidation.formValidation(formElement, {
                fields: {
                    date: {
                        validators: {
                            notEmpty: {
                                message: "Date range is required"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger,
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: ""
                    })
                }
            });

            submitButton.addEventListener("click", function(event) {
                event.preventDefault();
                formValidator && formValidator.validate().then(function(validationResult) {
                    console.log("validated!");
                    if (validationResult === "Valid") {
                        var dataToExport = JSON.parse(localStorage.getItem('trips'));
                        var jsonData = JSON.stringify(dataToExport);
                        var blob = new Blob([jsonData], { type: 'application/json' });
                        var url = URL.createObjectURL(blob);
                        var downloadLink = document.createElement('a');
                        downloadLink.style.display = 'none';
                        downloadLink.href = url;
                        downloadLink.download = 'data_XanhSM.json';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        setTimeout(function() {
                            URL.revokeObjectURL(url);
                        }, 100);
                        formElement.reset();
                        modalInstance.hide();
                        submitButton.disabled = false;
                    } else {
                        Swal.fire({
                            text: "Xin lỗi, có vẻ như đã xảy ra lỗi, vui lòng thử lại.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, đã hiểu!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });

            cancelButton.addEventListener("click", function(event) {
                event.preventDefault();
                Swal.fire({
                    text: "Bạn có chắc muốn hủy bỏ không?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Có, hủy bỏ!",
                    cancelButtonText: "Không, quay lại",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then(function(result) {
                    if (result.value) {
                        formElement.reset();
                        modalInstance.hide();
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: "Biểu mẫu của bạn chưa được hủy bỏ!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, đã hiểu!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });

            closeButton.addEventListener("click", function(event) {
                event.preventDefault();
                Swal.fire({
                    text: "Bạn có chắc muốn hủy bỏ không?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Có, hủy bỏ!",
                    cancelButtonText: "Không, quay lại",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then(function(result) {
                    if (result.value) {
                        formElement.reset();
                        modalInstance.hide();
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: "Biểu mẫu của bạn chưa được hủy bỏ!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, đã hiểu!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });

        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    KTTripsExport.init();
});