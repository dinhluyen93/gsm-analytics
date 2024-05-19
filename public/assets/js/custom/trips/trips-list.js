"use strict";
var KTTripsList = function() {
    var table;

    function formatVND(str) {
        let fmStr = str.toString();
        return fmStr.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
        })
    }
    function sortTripsByTime(trips) {
        return trips.sort((a, b) => {
            return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
        });
    }
    function sortTrips(trips) {
        return trips.map(day => {
            day.trips = sortTripsByTime(day.trips);
            return day;
        });
    }
    function sortTripsByDate(trips) {
        return trips.sort((a, b) => {
            sortTrips(trips)
            return new Date(b.date) - new Date(a.date);
        });
    }

    // Chuyển đổi văn bản thành JSON và trả về đối tượng JSON
    function convertTextToJson(text) {
        // const lines = text.trim().split('\n').filter(line => line.trim() !== '');
        const lines = text.trim().split('\n').filter(line => line.trim() !== '' && (line.includes('.000₫') || line.includes('|')));
        console.log(lines)

        const trips = [];
        let trip = {};
        let tripStarted = false;

        // Hàm để kiểm tra giá tiền và chuyển đổi sang số
        const isPrice = (line) => {
            const match = line.match(/^\d+\.?\d*₫$/);
            if (match) {
                return parseFloat(match[0].replace('₫', '').replace('.', ''));
            }
            return false;
        };

        // Hàm để kiểm tra thời gian và dịch vụ
        const isTimeAndService = (line) => line.match(/^\d{2}:\d{2} \| .+$/);

        // Hàm để kiểm tra trạng thái
        const isStatus = (line) => ["Hoàn thành", "Hủy"].includes(line.trim());

        lines.forEach(line => {
            line = line.trim();

            const price = isPrice(line);
            if (price) {
                // Nếu đã có dữ liệu chuyến đi trước đó thì đẩy vào trips nếu không bị hủy
                if (tripStarted && trip.status !== "Hủy") {
                    trips.push(trip);
                }
                trip = {};
                trip.price = price;
                tripStarted = true;
            } else if (isTimeAndService(line)) {
                const [time, service] = line.split(' | ');
                trip.time = time.trim();
                // Chuyển đổi "Xanh SM Bike" thành "Bike" và "Siêu tốc" thành "Express"
                trip.service = service.trim().replace("Xanh SM Bike", "Bike").replace("Siêu tốc", "Express");
            } else if (isStatus(line)) {
                trip.status = line.trim();
            } else {
                // Xử lý phần địa chỉ
                if (!trip.from) {
                    trip.from = line;
                } else if (!trip.to) {
                    trip.to = line;
                } else {
                    trip.to += ' ' + line;
                }
            }
        });

        // Đẩy chuyến đi cuối cùng vào trips nếu không bị hủy và chuyến đi đã bắt đầu
        if (tripStarted && trip.status !== "Hủy") {
            trips.push(trip);
        }

        // Chỉ lấy các thuộc tính cần thiết: price, time, service
        const simplifiedTrips = trips.map(trip => ({
            price: trip.price,
            time: trip.time,
            service: trip.service
        }));

        // Trả về đối tượng JSON thay vì chuỗi JSON
        return simplifiedTrips;
    }

    

    // Xóa từng hàng
    function handleDeleteRow() {
        document.querySelectorAll('[data-kt-trip-table-filter="delete_row"]').forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                var row = event.target.closest("tr");
                var dateText = row.querySelectorAll("td")[1].innerText;
                var timeText = row.querySelectorAll("td")[2].innerText;

                console.log(timeText)


                Swal.fire({
                    text: "Bạn có chắc chắn muốn xóa " + dateText + " " + timeText + " không?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Có, xóa!",
                    cancelButtonText: "Không, hủy bỏ",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function(result) {
                    if (result.isConfirmed) {
                        Swal.fire({
                            text: "Bạn đã xóa " + dateText + " " + timeText + " thành công!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, hiểu rồi!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        }).then(function() {
                            removeTrip(dateText, timeText);
                            table.row($(row)).remove().draw();
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            text: dateText + " " + timeText + " không được xóa.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, hiểu rồi!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        });
                    }
                });
            });
        });
    };

    // Xử lý khi chọn các hàng
    function handleRowSelection() {
        var checkboxes = document.querySelectorAll('[type="checkbox"]');
        var deleteSelectedButton = document.querySelector('[data-kt-trip-table-select="delete_selected"]');

        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener("click", function() {
                setTimeout(function() {
                    updateToolbar();
                }, 50);
            });
        });

        deleteSelectedButton.addEventListener("click", function() {
            Swal.fire({
                text: "Bạn có chắc chắn muốn xóa các mục đã chọn không?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Có, xóa!",
                cancelButtonText: "Không, hủy bỏ",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function(result) {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: "Bạn đã xóa tất cả mục đã chọn thành công!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, hiểu rồi!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    }).then(function() {
                        checkboxes.forEach(function(checkbox) {
                            if (checkbox.checked) {
                                var row = checkbox.closest("tbody tr");
                                console.log(row)
                                if (row) {
                                    var dateText = row.querySelectorAll("td")[1].innerText;
                                    var timeText = row.querySelectorAll("td")[2].innerText;
                                    removeTrip(dateText, timeText);
                                }
                                table.row($(checkbox.closest("tbody tr"))).remove().draw();
                            }
                        });
                        checkboxes[0].checked = false;
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        text: "Các mục đã chọn không được xóa.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, hiểu rồi!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    });
                }
            });
        });
    };

    function removeTrip(date, time) {
        const trips = JSON.parse(localStorage.getItem('trips'));
        const updatedTrips = trips.map(day => {
            if (day.date === date) {
                day.trips = day.trips.filter(trip => trip.time !== time);
            }
            return day;
        }).filter(day => day.trips.length > 0);
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
    }

    function addTripToLocalStorage(date, workingTime, tripArrays) {
        const trips = localStorage.getItem('trips') ? JSON.parse(localStorage.getItem('trips')) : [];
        let foundDate = false;
    
        // Duyệt qua mỗi chuyến đi trong mảng tripArrays
        tripArrays.forEach(trip => {
            trips.forEach(day => {
                if (day.date === date) {
                    const existingTripIndex = day.trips.findIndex(item => item.time === trip.time);
                    if (existingTripIndex !== -1) {
                        day.trips[existingTripIndex] = trip;
                    } else {
                        day.trips.push(trip);
                    }
                    day.workingTime = workingTime;
                    foundDate = true;
                }
            });
            // Nếu không tìm thấy ngày tương ứng trong localStorage, thêm mới ngày đó với chuyến đi đầu tiên
            if (!foundDate) {
                trips.push({ date, workingTime, trips: [trip] });
            }
        });
    
        localStorage.setItem('trips', JSON.stringify(trips));
    }
    

    function displayTrips() {
        table.clear().draw();
        const trips = localStorage.getItem('trips') ? JSON.parse(localStorage.getItem('trips')) : [];
        sortTripsByDate(trips)

        trips.forEach(day => {
            day.trips.forEach(trip => {
                let checkbox = '<div class="form-check form-check-sm form-check-custom form-check-solid"><input class="form-check-input" type="checkbox" value="1"></div>';
                let remove = '<div class="text-end"><a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-kt-trip-table-filter="delete_row">Xóa</a></div>';
                let calculateBikeKm = ((trip.price - 1000) * 0.933 - 13800) / 4800 + 2
                let calculateExpressKm = ((trip.price - 1000) * 0.933 - 15000) / 5000 + 2
                let bikeKm = Math.round(calculateBikeKm * 100) / 100
                let expressKm = Math.round(calculateExpressKm * 100) / 100
                let distance = (trip.service === 'Bike') ? bikeKm : expressKm;
                let serviceBadgeClass = (trip.service === 'Bike') ? 'badge-light-success' : 'badge-light-warning';

                let iconBike = '<i class="ki-duotone ki-scooter fs-2 me-2 text-success"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></i>'
                let iconExpress = '<i class="ki-duotone ki-delivery fs-2 me-2 text-warning"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>'
                let serviceIcon = (trip.service === 'Bike') ? iconBike : iconExpress
                let serviceBadge = '<div class="badge ' + serviceBadgeClass + '">' + serviceIcon + trip.service + '</div>';
                // Thêm hàng mới vào bảng
                table.row.add([
                    checkbox,
                    day.date,
                    trip.time,
                    serviceBadge,
                    formatVND(trip.price) + 'đ',
                    distance + 'km',
                    remove
                ]).draw(false);
            });
        });
    }

    // Cập nhật thanh công cụ
    var updateToolbar = function() {
        var baseToolbar = document.querySelector('[data-kt-trip-table-toolbar="base"]');
        var selectedToolbar = document.querySelector('[data-kt-trip-table-toolbar="selected"]');
        var selectedCount = document.querySelector('[data-kt-trip-table-select="selected_count"]');
        var checkboxes = document.querySelectorAll('tbody [type="checkbox"]');
        var isSelected = false;
        var selectedRows = 0;

        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                isSelected = true;
                selectedRows++;
            }
        });

        if (isSelected) {
            selectedCount.innerHTML = selectedRows;
            baseToolbar.classList.add("d-none");
            selectedToolbar.classList.remove("d-none");
        } else {
            baseToolbar.classList.remove("d-none");
            selectedToolbar.classList.add("d-none");
        }
    };

    return {
        // Khởi tạo
        init: function() {
            table = $('#dl_trips_table').DataTable({
                info: false,
                order: [],
                columnDefs: [
                    { orderable: false, targets: 0 },
                    { orderable: false, targets: 6 }
                ]
            });

            table.on("draw", function() {
                handleRowSelection();
                handleDeleteRow();
                updateToolbar();
            });

            displayTrips();

            document.querySelector('[data-kt-trip-table-filter="search"]').addEventListener("keyup", function(event) {
                table.search(event.target.value).draw();
            });

            // Thêm dữ liệu vào bảng
            document.getElementById('addDataForm').addEventListener('submit', function(event) {
                event.preventDefault();

                // Lấy giá trị từ các trường input
                var date = document.getElementById('addDate').value;
                var workingTime = document.getElementById('addOnline').value;
                var text = document.getElementById('addText').value;

                // Chuyển đổi văn bản thành JSON
                var tripArrays = convertTextToJson(text);
                console.log(typeof tripArrays);

                // Lấy giá trị ngày
                var date = document.getElementById('addDate').value;

                // Lấy giá trị thời gian làm việc trực tuyến
                var workingTime = document.getElementById('addOnline').value;
                
                // Thêm dữ liệu vào localStorage
                addTripToLocalStorage(date, workingTime, tripArrays);
                displayTrips()

                // Cập nhật thanh công cụ
                updateToolbar();

                // Thông báo
                const newToast = targetElement.cloneNode(true);
                const container = document.getElementById('toast_stack_container');
                container.append(newToast);
                const toast = bootstrap.Toast.getOrCreateInstance(newToast);
                toast.show();
            });

            // Thông báo
            const targetElement = document.querySelector('[data-toast="stack"]');
            targetElement.parentNode.removeChild(targetElement);

            // Gắn sự kiện submit cho form
            document.getElementById('formAddDataFile').addEventListener('submit', function(event) {
                event.preventDefault(); // Ngăn chặn việc submit form mặc định

                const fileInput = document.getElementById('formFileInput');
                const file = fileInput.files[0];
                
                if (!file) {
                    alert("Vui lòng chọn một tệp JSON.");
                    return;
                }

                const reader = new FileReader();

                reader.onload = function(event) {
                    const jsonData = event.target.result;
                    try {
                        const trips = JSON.parse(jsonData);
                        if (!Array.isArray(trips)) {
                            alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại tệp JSON.");
                            return;
                        }
                        localStorage.setItem('trips', JSON.stringify(trips));
                        displayTrips();
                    } catch (error) {
                        alert("Đã xảy ra lỗi khi đọc tệp JSON.");
                        console.error(error);
                    }
                };

                reader.readAsText(file);
            });

            // Gắn sự kiện click cho nút "Xóa Tất Cả"
            const buttonResetLocalStroge = document.getElementById('resetDataLocalStorage')
            buttonResetLocalStroge.addEventListener('click', function() {
                // Hiển thị cửa sổ xác nhận
                Swal.fire({
                    title: 'Xác nhận xóa',
                    text: 'Bạn có chắc muốn xóa dữ liệu không?',
                    icon: 'warning',
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Có, hủy bỏ!",
                    cancelButtonText: "Không, quay lại",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then((result) => {
                    // Nếu người dùng nhấn nút xác nhận
                    if (result.isConfirmed) {
                        // Xóa dữ liệu từ localStorage
                        localStorage.clear();
                        // Hiển thị dữ liệu sau khi xóa
                        displayTrips();
                        // Thông báo xóa thành công (hoặc có thể làm gì đó khác)
                        Swal.fire(
                            'Đã xóa!',
                            'Dữ liệu đã được xóa thành công.',
                            'success'
                        );
                    }
                });
            });

        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    KTTripsList.init();
});