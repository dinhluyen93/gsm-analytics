"use strict";

// Định nghĩa một module BatteryLogTable
var BatteryLogTable = function() {
    var dataTable;

    // Hàm tải dữ liệu từ LocalStorage
    function loadDataFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    // Hàm lưu dữ liệu vào LocalStorage
    function saveDataToLocalStorage(key, data) {
        var sort = sortByDateDescending(data)
        localStorage.setItem(key, JSON.stringify(sort));
    }

    // Hàm sắp xếp dữ liệu theo ngày từ mới nhất đến cũ nhất
    function sortByDateDescending(data) {
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Hàm lấy ngày hiện tại dưới dạng chuỗi YYYY-MM-DD
    function getCurrentDate() {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function getMaxEndKm() {
        var batteryData = loadDataFromLocalStorage('batteryData');
        if (batteryData.length === 0) return 0;
        var maxEndKm = Math.max(...batteryData.map(entry => parseFloat(entry.endKm)));
        return maxEndKm;
    }

    // Hàm hiển thị dữ liệu trong bảng
    function displayBatteryLog() {
        dataTable.clear().draw(); // Xóa toàn bộ dữ liệu trong bảng và vẽ lại bảng
        let batteryData = loadDataFromLocalStorage('batteryData');
        batteryData.reverse();
        if (batteryData && Array.isArray(batteryData)) {
            batteryData.forEach((entry, index) => {
                let date = entry.date;
                let startKm = entry.startKm;
                let startBattery = entry.startBattery;
                let endKm = entry.endKm;
                let endBattery = entry.endBattery;
                let checkbox = '<div class="form-check form-check-sm form-check-custom form-check-solid"><input class="form-check-input" type="checkbox" value="1"></div>';
                let actions = `
                    <div class="text-end">
                        <a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-battery-log-table-filter="edit_row" data-id="${index}">Sửa</a>
                        <a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-battery-log-table-filter="delete_row" data-id="${index}">Xóa</a>
                    </div>`;
        
                // Tạo một hàng mới và thêm vào bảng
                dataTable.row.add([
                    checkbox,
                    date,
                    startKm + 'km',
                    endKm + 'km',
                    startBattery + '%',
                    endBattery + '%',
                    actions
                ]).draw(false);
            });
        }
    }

    // Hàm xử lý xóa hàng
    function handleDeleteRow() {
        document.querySelectorAll('[data-battery-log-table-filter="delete_row"]').forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                var row = event.target.closest("tr");
                if (row) {
                    var rowId = button.getAttribute('data-id');
                    dataTable.row($(row)).remove().draw();
                    removeRowDataFromLocalStorage(row);
                }
            });
        });
    }
    
    // Hàm xử lý chọn hàng
    function handleRowSelection() {
        var checkboxes = document.querySelectorAll('[type="checkbox"]');
        var deleteSelectedButton = document.querySelector('[data-battery-log-table-select="delete_selected"]');
    
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener("click", function() {
                setTimeout(function() {
                    updateToolbar();
                }, 50);
            });
        });
    
        deleteSelectedButton.addEventListener("click", function() {
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    var row = checkbox.closest("tbody tr");
                    if (row) {
                        dataTable.row($(row)).remove().draw();
                        removeRowDataFromLocalStorage(row);
                    }
                }
            });
            checkboxes[0].checked = false;
        });
    }

    // Hàm xử lý sửa hàng
    function handleEditRow() {
        document.querySelectorAll('[data-battery-log-table-filter="edit_row"]').forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                var rowId = button.getAttribute('data-id');
                fillFormWithRowData(rowId);
            });
        });
    }

    // Hàm điền các giá trị của hàng vào form chỉnh sửa
    function fillFormWithRowData(rowId) {
        let batteryData = loadDataFromLocalStorage('batteryData')
        if (batteryData && Array.isArray(batteryData)) {
            let row = batteryData[rowId];
            if (row) {
                document.getElementById('start_km').value = row.startKm;
                document.getElementById('start_battery').value = row.startBattery;
                document.getElementById('end_km').value = row.endKm;
                document.getElementById('end_battery').value = row.endBattery;
            }
        }
    }

    // Hàm kiểm tra xem ghi chú mới có trùng lặp không
    function isDuplicateEntry(newEntry) {
        var batteryData = loadDataFromLocalStorage('batteryData')
        return batteryData.some(function(entry) {
            return JSON.stringify(entry) === JSON.stringify(newEntry);
        });
    }

    // Cập nhật thanh công cụ
    function updateToolbar() {
        var baseToolbar = document.querySelector('[data-battery-log-table-toolbar="base"]');
        var selectedToolbar = document.querySelector('[data-battery-log-table-toolbar="selected"]');
        var selectedCount = document.querySelector('[data-battery-log-table-select="selected_count"]');
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
    }

    // Hàm xóa dữ liệu hàng từ LocalStorage
    function removeRowDataFromLocalStorage(row) {
        var cells = row.querySelectorAll("td");
        var date = cells[1].innerText;
        var startKm = cells[2].innerText.replace('km', '');
        var endKm = cells[3].innerText.replace('km', '');
        var startBattery = cells[4].innerText.replace('%', '');
        var endBattery = cells[5].innerText.replace('%', '');

        var batteryData = loadDataFromLocalStorage('batteryData');
        if (batteryData && Array.isArray(batteryData)) {
            var index = batteryData.findIndex(function(entry) {
                return entry.date === date &&
                    entry.startKm === startKm &&
                    entry.endKm === endKm &&
                    entry.startBattery === startBattery &&
                    entry.endBattery === endBattery;
            });
    
            if (index !== -1) {
                batteryData.splice(index, 1);
                saveDataToLocalStorage('batteryData', batteryData);
            }
        }
    }

    // Đối tượng trả về với hàm khởi tạo
    return {
        init: function() {
            // Khởi tạo bảng DataTable
            dataTable = $('#battery_log_table').DataTable({
                info: false,
                order: [],
                columnDefs: [
                    { orderable: false, targets: 0 },
                    { orderable: false, targets: 3 }
                ]
            });

            dataTable.on("draw", function() {
                handleRowSelection();
                handleDeleteRow();
                handleEditRow();
                updateToolbar();
            });

            displayBatteryLog();

            var searchInput = document.querySelector('[data-battery-log-table-filter="search"]')
            searchInput.addEventListener("keyup", function(event) {
                dataTable.search(event.target.value).draw();
            });

            var form = document.getElementById('battery_log_form');
            var startKm = document.getElementById('start_km');
            var startBattery = document.getElementById('start_battery');
            var endKm = document.getElementById('end_km');
            var endBattery = document.getElementById('end_battery');
            var lastKm = getMaxEndKm()
            form.addEventListener('submit', function(event) {
                event.preventDefault();
            
                var batteryEntry = {
                    date: getCurrentDate(),
                    startKm: startKm.value,
                    startBattery: startBattery.value,
                    endKm: endKm.value,
                    endBattery: endBattery.value
                };


                if (parseFloat(startKm.value) >= parseFloat(endKm.value)) {
                    Swal.fire({
                        icon: 'error',
                        buttonsStyling: false,
                        text: 'Số km kết thúc không được nhỏ hơn km bắt đầu',
                        confirmButtonText: "Ok!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    });
                    return;
                }

                if (parseFloat(endBattery.value) >= parseFloat(startBattery.value)) {
                    Swal.fire({
                        icon: 'error',
                        buttonsStyling: false,
                        text: 'Phần trăm pin kết thúc không thể lớn hơn bắt đầu',
                        confirmButtonText: "Ok!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    });
                    return;
                }

                if (!isDuplicateEntry(batteryEntry)) {
                    var batteryData = loadDataFromLocalStorage('batteryData')
                    batteryData.push(batteryEntry);
                    saveDataToLocalStorage('batteryData', batteryData)
                    displayBatteryLog();
                    updateToolbar();
                } else {
                    Swal.fire({
                        icon: 'error',
                        buttonsStyling: false,
                        text: 'Ghi chú đã tồn tại!',
                        confirmButtonText: "Ok, tải lại!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            displayBatteryLog();
                        }
                    });
                }
                
            
            });

            startKm.value = parseFloat(lastKm)
            endKm.value = parseFloat(lastKm) + 1

            startKm.addEventListener('input', function() {
                if (parseFloat(startKm.value) >= parseFloat(endKm.value)) {
                    endKm.value = parseFloat(startKm.value) + 1;
                }
            });
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    BatteryLogTable.init();
});
