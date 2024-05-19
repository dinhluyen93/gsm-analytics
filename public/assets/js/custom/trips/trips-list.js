"use strict";
var KTTripsList = function() {
    var table;

    // Định dạng dữ liệu cũ sang dữ liệu mới
    function convertOldDataToNew(oldData) {
        return oldData.map(function(oldItem) {
            var newItem = {
                "d": oldItem.date,
                "o": oldItem.workingTime,
                "t": oldItem.trips.map(function(trip) {
                    return [trip.time, trip.service, trip.price];
                })
            };
            return newItem;
        });
    }

    // Kiểm tra dữ liệu và định dạng theo phiên bản mới nhất
    function checkDataTripsVersion() {
        const dataTrips = JSON.parse(localStorage.getItem('dataTrips'));
        if (dataTrips){
            localStorage.removeItem("trips");
        } else {
            const oldData = JSON.parse(localStorage.getItem('trips'));
            if (oldData){
                const newData = convertOldDataToNew(oldData);
                localStorage.setItem('dataTrips', JSON.stringify(newData));
            }
        }
    }

    // Gộp dữ liệu tải lên và dữ liệu đã có
    function addDataToStorage(data) {
        const dataTrips = JSON.parse(localStorage.getItem('dataTrips'));
        if (dataTrips){
            data.forEach(day => {
                addTripToLocalStorage(day.d, day.o, day.t)
            });
        } else {
            localStorage.setItem('dataTrips', JSON.stringify(data));
        }
    }

    // Kiểm tra dữ liệu tải lên và chuyển đổi
    function checkDataUpload(data) {
        if (!Array.isArray(data)) {
            alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại tệp JSON.");
            return;
        }
    
        let hasDate = false;
        for (let i = 0; i < data.length; i++) {
            if ("date" in data[i]) {
                hasDate = true;
                break;
            }
        }
    
        if (hasDate) {
            // Dữ liệu cũ
            const newData = convertOldDataToNew(data);
            localStorage.removeItem("trips");
            addDataToStorage(newData)
        } else {
            // Dữ liệu mới
            addDataToStorage(data)
        }
    }

    function sortTrips(trips) {
        return trips.sort((a, b) => {
            const dateA = new Date(a.d);
            const dateB = new Date(b.d);
            
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB - dateA; // Sắp xếp theo ngày giảm dần
            } else {
                return a.trips.sort((tripA, tripB) => {
                    const timeA = new Date('1970/01/01 ' + tripA[0]);
                    const timeB = new Date('1970/01/01 ' + tripB[0]);
                    return timeA - timeB; // Sắp xếp các chuyến đi trong cùng một ngày theo thời gian tăng dần
                });
            }
        });
    }

    function convertTextToJson(text) {
        const lines = text.trim().split('\n').filter(line => line.trim() !== '' && (line.includes('.000₫') || line.includes('|')));
        const trips = [];
        let trip = {};
        let tripStarted = false;

        const isPriceAndTimeService = (line) => line.match(/^\d+\.?\d*₫ \d{2}:\d{2} \| .+$/);
        const isPrice = (line) => {
            const match = line.match(/^\d+\.?\d*₫$/);
            if (match) {
                return parseFloat(match[0].replace('₫', '').replace('.', ''));
            }
            return false;
        };

        const isTimeAndService = (line) => line.match(/^\d{2}:\d{2} \| .+$/);

        lines.forEach(line => {
            line = line.trim();
            const price = isPrice(line);
            if (isPriceAndTimeService(line)) {
                const [priceTime, service] = line.split(' | ');
                const [price, time] = priceTime.split(' ');
                trip = {
                    price: parseFloat(price.replace('₫', '').replace('.', '')),
                    time: time,
                    service: service.trim().replace("Xanh SM Bike", "Bike").replace("Siêu tốc", "Express")
                };
                trips.push(trip);
            } else if (price) {
                if (tripStarted) {
                    trips.push(trip);
                }
                trip = {};
                trip.price = price;
                tripStarted = true;
            } else if (isTimeAndService(line)) {
                const [time, service] = line.split(' | ');
                trip.time = time.trim();
                trip.service = service.trim().replace("Xanh SM Bike", "Bike").replace("Siêu tốc", "Express");
            }
        });

        if (tripStarted) {
            trips.push(trip);
        }

        const simplifiedTrips = trips.map(trip => ([trip.time,trip.service,trip.price]));
        return simplifiedTrips;
    }

    function removeTrip(targetDate, targetTime) {
        const trips = JSON.parse(localStorage.getItem('dataTrips'));
    
        const updatedTrips = trips.map(day => {
            if (day.d === targetDate) {
                day.t = day.t.filter(trip => trip[0] !== targetTime);
            }
            return day;
        }).filter(day => day.t.length > 0);
    
        localStorage.setItem('dataTrips', JSON.stringify(updatedTrips));
    }    

    function addTripToLocalStorage(date, online, trips) {
        const dataTrips = localStorage.getItem('dataTrips') ? JSON.parse(localStorage.getItem('dataTrips')) : [];
        let foundDate = false;
    
        dataTrips.forEach(day => {
            if (day.d === date) {
                trips.forEach(trip => {
                    const existingTripIndex = day.t.findIndex(item => item[0] === trip[0]);
                    if (existingTripIndex !== -1) {
                        day.t[existingTripIndex] = trip;
                    } else {
                        day.t.push(trip);
                    }
                });
                day.o = online;
                foundDate = true;
            }
        });
    
        if (!foundDate) {
            dataTrips.push({ d: date, o: online, t: trips });
        }
    
        localStorage.setItem('dataTrips', JSON.stringify(dataTrips));
    }

    function displayTrips() {
        table.clear().draw();
        let dataTripsLocal = localStorage.getItem('dataTrips') ? JSON.parse(localStorage.getItem('dataTrips')) : [];
        let dataTrips = sortTrips(dataTripsLocal)
        console.log(dataTripsLocal)
        dataTrips.forEach(day => {
            const date = day.d
            const trips = day.t
            const online = day.o
            trips.forEach(trip => {
                const trip_time = trip[0]
                const trip_service = trip[1]
                const trip_price = trip[2]
                let checkbox = '<div class="form-check form-check-sm form-check-custom form-check-solid"><input class="form-check-input" type="checkbox" value="1"></div>';
                let remove = '<div class="text-end"><a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-kt-trip-table-filter="delete_row">Xóa</a></div>';
                let calculateBikeKm = ((trip_price - 1000) * 0.933 - 13800) / 4800 + 2
                let calculateExpressKm = ((trip_price - 1000) * 0.933 - 15000) / 5000 + 2
                let bikeKm = Math.round(calculateBikeKm * 100) / 100
                let expressKm = Math.round(calculateExpressKm * 100) / 100
                let distance = (trip_service === 'Bike') ? bikeKm : expressKm;
                let serviceBadgeClass = (trip_service === 'Bike') ? 'badge-light-success' : 'badge-light-warning';
    
                let iconBike = '<i class="ki-duotone ki-scooter fs-2 me-2 text-success"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></i>'
                let iconExpress = '<i class="ki-duotone ki-delivery fs-2 me-2 text-warning"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>'
                let serviceIcon = (trip_service === 'Bike') ? iconBike : iconExpress
                let serviceBadge = '<div class="badge ' + serviceBadgeClass + '">' + serviceIcon + trip_service + '</div>';
                // Thêm hàng mới vào bảng
                table.row.add([
                    checkbox,
                    date,
                    trip_time,
                    serviceBadge,
                    trip_price + '₫',
                    distance + 'km',
                    remove
                ]).draw(false);
            });
        });
    }

    // Xóa từng hàng
    function handleDeleteRow() {
        document.querySelectorAll('[data-kt-trip-table-filter="delete_row"]').forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                var row = event.target.closest("tr");
                var dateText = row.querySelectorAll("td")[1].innerText;
                var timeText = row.querySelectorAll("td")[2].innerText;

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

    // Cập nhật thanh công cụ
    function updateToolbar() {
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
            checkDataTripsVersion()

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
                var online = document.getElementById('addOnline').value;
                var text = document.getElementById('addText').value;

                // Chuyển đổi văn bản thành JSON
                var trips = convertTextToJson(text);
                
                // Thêm dữ liệu vào localStorage
                addTripToLocalStorage(date, online, trips);
                displayTrips()

                // Cập nhật thanh công cụ
                updateToolbar();
            });

            // Thông báo
            const targetElement = document.querySelector('[data-toast="stack"]');
            targetElement.parentNode.removeChild(targetElement);

            // Sự kiện tải tệp Json
            document.getElementById('formAddDataFile').addEventListener('submit', function(event) {
                event.preventDefault();

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
                        checkDataUpload(JSON.parse(jsonData))
                        displayTrips();
                    } catch (error) {
                        alert("Đã xảy ra lỗi khi đọc tệp JSON.");
                        console.error(error);
                    }
                };

                reader.readAsText(file);
            });

        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    KTTripsList.init();
});