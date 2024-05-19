"use strict";

var TripsAnalytics = function() {
    var tripsData = JSON.parse(localStorage.getItem('trips'));
    var bonusData = JSON.parse(localStorage.getItem('bonusData'));
    var userData = JSON.parse(localStorage.getItem("userData"));

    var defaultStartDate = moment().subtract(29, "days");
    var defaultEndDate = moment();

    // Kiểm tra xem dữ liệu đã được lấy thành công hay không
    if (tripsData) {
        // Gọi hàm để hiển thị thông số ngày
        dailyStatistics(tripsData);
    } else {
        console.log("Không tìm thấy dữ liệu chuyến đi trong localStorage.");
    }

    // Biến global để lưu trữ biểu đồ ApexCharts
    var chartInstance = null;

    function updateDateRange(start, end) {
        $("#date_range_picker").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));

        // Lấy giá trị start và end sau khi người dùng chọn phạm vi ngày
        var startDateString = start.format("YYYY-MM-DD");
        var endDateString = end.format("YYYY-MM-DD");

        const data = calculateDataInRange(tripsData, startDateString, endDateString)
        console.log(data)
        const weekEarnings = document.getElementById('weekEarnings');
        weekEarnings.innerHTML = `
            <span class="fs-4 fw-semibold text-gray-500 me-1 align-self-start">vnđ</span>
            <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">${data.earnings.total.toLocaleString('vi-VN')}</span>
            <span class="badge badge-light-success fs-base">                                
                <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 
                0%
            </span>
        `

        const weekEarnings_Sales = document.getElementById('weekEarnings_Sales');
        weekEarnings_Sales.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.earnings.trips.toLocaleString('vi-VN')}</span>
        `

        const weekEarnings_BonusDaily = document.getElementById('weekEarnings_BonusDaily');
        weekEarnings_BonusDaily.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.earnings.bonusDaily.toLocaleString('vi-VN')}</span>
        `

        const weekEarnings_BonusWeek = document.getElementById('weekEarnings_BonusWeek');
        weekEarnings_BonusWeek.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.earnings.bonusWeek.toLocaleString('vi-VN')}</span>
        `

        const weekEarnings_BonusPeakHour = document.getElementById('weekEarnings_BonusPeakHour');
        weekEarnings_BonusPeakHour.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.earnings.bonusPeakHours.toLocaleString('vi-VN')}</span>
        `

        const weekTrips_Total = document.getElementById('weekTrips_Total');
        weekTrips_Total.innerHTML = `
            <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">${data.trips.length}</span>
            <span class="badge badge-light-success fs-base">                                
                <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 
                0%
            </span>
        `

        const weekTrips_PeakHours = document.getElementById('weekTrips_PeakHours');
        weekTrips_PeakHours.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.trips.peakHours}</span>
        `

        const weekTrips_Other = document.getElementById('weekTrips_Other');
        weekTrips_Other.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.trips.other}</span>
        `

        const weekTrips_Bike = document.getElementById('weekTrips_Bike');
        weekTrips_Bike.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.trips.bike}</span>
        `

        const weekTrips_Express = document.getElementById('weekTrips_Express');
        weekTrips_Express.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.trips.express}</span>
        `


        const weekPoints_Total = document.getElementById('weekPoints_Total');
        weekPoints_Total.innerHTML = `
            <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">${data.points.total}</span>
            <span class="badge badge-light-success fs-base">                                
                <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 
                0%
            </span>
        `

        const weekPoints_PeakHours = document.getElementById('weekPoints_PeakHours');
        weekPoints_PeakHours.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.points.peakHours}</span>
        `

        const weekPoints_Other = document.getElementById('weekPoints_Other');
        weekPoints_Other.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.points.other}</span>
        `

        const weekPoints_Bike = document.getElementById('weekPoints_Bike');
        weekPoints_Bike.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.points.bike}</span>
        `

        const weekPoints_Express = document.getElementById('weekPoints_Express');
        weekPoints_Express.innerHTML = `
            <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
            <span class="text-gray-900 fw-bolder fs-6">${data.points.express}</span>
        `

        let avgEarn = document.getElementById('avgEarn');
        let avgKm = document.getElementById('avgKm');
        let avgTrip = document.getElementById('avgTrip');
        let avgPoint = document.getElementById('avgPoint');
        avgEarn.innerHTML = `
            <span class="text-gray-800 fw-bold fs-4 me-3">${Math.round(data.weekAvg.earn).toLocaleString('vi-VN')} đ</span>
            <span class="badge badge-light-success fs-base">                                
            <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 0%
            </span>
        `
        avgKm.innerHTML = `
            <span class="ttext-gray-800 fw-bold fs-4 me-3">${data.weekAvg.km.toLocaleString('vi-VN')} km</span>
            <span class="badge badge-light-success fs-base">                                
            <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 0%
            </span>
        `
        avgTrip.innerHTML = `
            <span class="text-gray-800 fw-bold fs-4 me-3">${data.weekAvg.trip.toLocaleString('vi-VN')}</span>
            <span class="badge badge-light-success fs-base">                                
            <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 0%
            </span>
        `
        avgPoint.innerHTML = `
            <span class="text-gray-800 fw-bold fs-4 me-3">${data.weekAvg.point.toLocaleString('vi-VN')}</span>
            <span class="badge badge-light-success fs-base">                                
            <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"><span class="path1"></span><span class="path2"></span></i> 0%
            </span>
        `

        // Hiển thị chẳng đường thưởng tuần
        const bonusWeekRoad_Title = document.getElementById('bonusWeekRoad_Title');
        const bonusWeekRoad_Next = document.getElementById('bonusWeekRoad_Next');
        const bonusWeekRoad_Progress = document.getElementById('bonusWeekRoad_Progress');
        const bonusWeekRoad_Missing = document.getElementById('bonusWeekRoad_Missing');
        if (data.weekRoad.currentBonus > 0) {
            bonusWeekRoad_Title.textContent = `Đã nhận ${data.weekRoad.currentBonus.toLocaleString('vi-VN')}đ`
        } else {
            bonusWeekRoad_Title.textContent = `Đi đến mốc đầu tiên`
        }
        if (data.weekRoad.nextPoint !== null) {
            bonusWeekRoad_Next.textContent = `Nhận ${data.weekRoad.nextBonus.toLocaleString('vi-VN')}đ từ ${data.weekRoad.nextPoint} điểm`
        } else {
            bonusWeekRoad_Next.textContent = `Đã hoàn thành`
        }
        if (data.weekRoad.percentPoint > 100) {
            bonusWeekRoad_Progress.innerHTML = `
            <div class="bg-success rounded h-8px" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            `
        } else {
            bonusWeekRoad_Progress.innerHTML = `
            <div class="bg-success rounded h-8px" role="progressbar" style="width: ${data.weekRoad.percentPoint}%;" aria-valuenow="${data.weekRoad.percentPoint}" aria-valuemin="0" aria-valuemax="100"></div>
            `
        }
        
        if (data.weekRoad.missingPoint > 0) {
            bonusWeekRoad_Missing.textContent = `Thiếu ${data.weekRoad.missingPoint} điểm`
        } else {
            bonusWeekRoad_Missing.textContent = `Đã đủ điểm`
        }

    }

    // Đặt thời gian mặc định là tuần này
    function setDefaultDateRange() {
        // Lấy ngày bắt đầu và kết thúc của tuần này
        var startOfWeek = moment().startOf('isoWeek');
        var endOfWeek = moment().endOf('isoWeek');
    
        // Thiết lập ngày bắt đầu và kết thúc cho date range picker
        $("#date_range_picker").data('daterangepicker').setStartDate(startOfWeek);
        $("#date_range_picker").data('daterangepicker').setEndDate(endOfWeek);
    
        // Gọi hàm updateDateRange để cập nhật giao diện
        updateDateRange(startOfWeek, endOfWeek);
    }

    function getDayOfWeekIndex(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return -1; // Trả về -1 nếu ngày không hợp lệ
        }
        return date.getDay();
    }
    
    // Hàm tính điểm thưởng trong ngày
    function calculateDailyPoints(dayData) {
        let result = {
            total: 0,
            peakHours: 0,
            other: 0,
            bike: 0,
            express: 0
        }

        const tripDayOfWeek = getDayOfWeekIndex(dayData.date);
        if (tripDayOfWeek === -1) {
            return result;
        }

        dayData.trips.forEach(trip => {
            const tripTime = parseInt(trip.time.split(':')[0]); // Chỉ lấy giờ từ thời gian

            // Tính điểm thưởng trong ngày
            if (tripDayOfWeek >= 1 && tripDayOfWeek <= 5) { // Từ Thứ Hai đến Thứ Sáu
                if (trip.service === 'Bike') {

                    if (tripTime >= 5 && tripTime < 9) {
                        result.total += 2;
                        result.peakHours += 2;
                        result.bike += 2;
                    } else if (tripTime >= 16 && tripTime < 20) {
                        result.total += 2;
                        result.peakHours += 2;
                        result.bike += 2;
                    } else {
                        result.total += 1;
                        result.bike += 1;
                    }
                } else if (trip.service === 'Express') {
                    if (tripTime >= 5 && tripTime < 9) {
                        result.total += 2;
                        result.peakHours += 2;
                    } else if (tripTime >= 9 && tripTime < 12) {
                        result.total += 1.5;
                        result.peakHours += 1.5;
                    } else if (tripTime >= 12 && tripTime < 20) {
                        result.total += 2;
                        result.peakHours += 2;
                    } else {
                        result.total += 1;
                    }
                }
            } else { // Cuối tuần (Chủ Nhật hoặc Thứ Bảy)
                if (trip.service === 'Bike') {
                    if (tripTime >= 9 && tripTime < 12) {
                        result.total += 1.5;
                        result.bike += 1.5;
                    } else if (tripTime >= 16) {
                        result.total += 2;
                        result.peakHours += 2;
                        result.bike += 2;
                    } else {
                        result.total += 1;
                        result.bike += 1;
                    }
                } else if (trip.service === 'Express') {
                    if (tripTime >= 9 && tripTime < 12) {
                        result.total += 1.5;
                        result.peakHours += 1.5;
                    } else if (tripTime >= 12) {
                        result.total += 2;
                        result.peakHours += 2;
                    } else {
                        result.total += 1;
                    }
                }
            }
        });
        result.express = result.total - result.bike;
        result.other = result.total - result.peakHours;

        return result;
    }

    // Tính thu nhập ròng trong ngày
    function calculateDayEarnings(dayData){
        let dayEarnings = 0;
        dayData.trips.forEach(function(trip) {
            const earn = (Number(trip.price) - 1000) * 0.73
            dayEarnings += parseInt(earn);
        });
        return dayEarnings
    }

    // Tính chuyến xe trong ngày
    function calculateDayTrips(dayData){
        let result = {
            length: 0,
            peakHours: 0,
            other: 0,
            bike: 0,
            express: 0
        }

        // Lấy số thứ tự của ngày trong tuần
        const tripDayOfWeek = getDayOfWeekIndex(dayData.date);
        if (tripDayOfWeek === -1) {
            return result;
        }

        dayData.trips.forEach(trip => {
            const tripTime = parseInt(trip.time.split(':')[0]);

            // Tính chuyến trong ngày
            if (tripDayOfWeek >= 1 && tripDayOfWeek <= 5) {
                if (trip.service === 'Bike') {
                    result.bike += 1;
                    if (tripTime >= 5 && tripTime < 9) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else if (tripTime >= 16 && tripTime < 20) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else {
                        result.length += 1;
                    }
                } else if (trip.service === 'Express') {
                    result.express += 1;
                    if (tripTime >= 5 && tripTime < 9) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else if (tripTime >= 9 && tripTime < 12) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else if (tripTime >= 12 && tripTime < 20) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else {
                        result.length += 1;
                    }
                }
            } else { // Cuối tuần (Chủ Nhật hoặc Thứ Bảy)
                if (trip.service === 'Bike') {
                    result.bike += 1;
                    if (tripTime >= 9 && tripTime < 12) {
                        result.length += 1;
                    } else if (tripTime >= 16) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else {
                        result.length += 1;
                    }
                } else if (trip.service === 'Express') {
                    result.express += 1;
                    if (tripTime >= 9 && tripTime < 12) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else if (tripTime >= 12) {
                        result.length += 1;
                        result.peakHours += 1;
                    } else {
                        result.length += 1;
                    }
                }
            }
        });

        result.other = result.length - result.peakHours
        return result;
    }

    // Tính km di chuyển trong ngày
    function calculateDayKm(dayData){
        let dayKm = 0;
        dayData.trips.forEach(trip => {
            const calculateBikeKm = ((trip.price - 1000) * 0.933 - 13800) / 4800 + 2
            const calculateExpressKm = ((trip.price - 1000) * 0.933 - 15000) / 5000 + 2
            const bikeKm = Math.round(calculateBikeKm * 100) / 100
            const expressKm = Math.round(calculateExpressKm * 100) / 100
            if (trip.type === 'Express') {
                dayKm += expressKm
            } else {
                dayKm += bikeKm
            }
        })
        return dayKm
    }

    // Hiển thị thống kê ngày
    function dailyStatistics(tripsData) {
        if (tripsData.length < 2) {
            console.log('Không đủ dữ liệu để tính toán.');
            return;
        }
    
        let currentDayData = tripsData[tripsData.length - 1];
        let previousDayData = tripsData[tripsData.length - 2];
    
        // Tính & hiển thị thu nhập ròng
        let currentDayEarnings = calculateDayEarnings(currentDayData)
        let previousDayEarnings = calculateDayEarnings(previousDayData)
        let dailyEarningsDiv = document.getElementById('dailyEarnings');
        if (currentDayEarnings > previousDayEarnings) {
            dailyEarningsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-up text-success fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayEarnings.toLocaleString('vi-VN')} đ</div>
            `
        } else {
            dailyEarningsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-down text-danger fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayEarnings.toLocaleString('vi-VN')}đ</div>
            `
        }
    
        // Tính & hiển thị chuyến xe ngày
        let currentDayTrips = calculateDayTrips(currentDayData).length
        let previousDayTrips = calculateDayTrips(previousDayData).length
        let dailyTripsDiv = document.getElementById('dailyTrips');
        if (currentDayTrips > previousDayTrips) {
            dailyTripsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-up text-success fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayTrips} chuyến</div>
            `
        } else {
            dailyTripsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-down text-danger fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayTrips} chuyến</div>
            `
        }
    
        // Tính & hiển thị số km
        let currentDayKm = calculateDayKm(currentDayData)
        let previousDayKm = calculateDayKm(previousDayData)
        let dailyKmDiv = document.getElementById('dailyKm');
        if (currentDayKm > previousDayKm) {
            dailyKmDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-up text-success fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayKm} km</div>
            `
        } else {
            dailyKmDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-down text-danger fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayKm} km</div>
            `
        }
    
        // Tính & hiển thị điểm thưởng ngày
        let currentDayPoints = calculateDailyPoints(currentDayData).total
        let previousDayPoints = calculateDailyPoints(previousDayData).total
        let dailyPointsDiv = document.getElementById('dailyPoints');
        if (currentDayPoints > previousDayPoints) {
            dailyPointsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-up text-success fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayPoints} điểm</div>
            `
        } else {
            dailyPointsDiv.innerHTML = `
            <i class="ki-duotone ki-arrow-down text-danger fs-3 me-2" id="kmIcon"><span class="path1"></span><span class="path2"></span></i>
            <div class="fs-4 fw-bold counted">${currentDayPoints} điểm</div>
            `
        }
    }

    // Lấy dữ liệu người dùng theo cài đặt
    function getDataBonus(userData, bonusData){
        // userData: Dữ liệu cài đặt người dùng
        // bonusData: Dữ liệu tính thưởng theo chính sách
        if (userData && bonusData) {
            if (userData.location === "hanoi") {
                if (userData.partner == "5h") {
                    return bonusData.hanoi["5h"]
                } else if (userData.partner == "8h") {
                    return bonusData.hanoi["8h"]
                } else {
                    return bonusData.hanoi["10h"]
                }
            } else if (userData.location === "danang") {
                if (userData.partner == "5h") {
                    return bonusData.danang["5h"]
                } else if (userData.partner == "8h") {
                    return bonusData.danang["8h"]
                } else {
                    return bonusData.danang["10h"]
                }
            } else {
                if (userData.partner == "5h") {
                    return bonusData.hochiminh["5h"]
                } else if (userData.partner == "8h") {
                    return bonusData.hochiminh["8h"]
                } else {
                    return bonusData.hochiminh["10h"]
                }
            }
        }
    }

    // Tính thưởng vượt chuyến
    function calculateBonusDaily(trips, exceededRides){
        // trips: Số chuyến xe trong ngày
        // exceededRides: dữ liệu vượt chuyến
        const rides = exceededRides.rides
        const rewards = exceededRides.rewards
        if (trips > rides[1]) {
            const moc1 = (rides[1] - rides[0] + 1) * rewards[0]
            const moc2 = (trips - rides[1]) * rewards[1]
            return moc1 + moc2
        } else if (trips > rides[0] && trips < rides[1]) {
            const moc1 = (trips - rides[0] + 1) * rewards[0]
            return moc1
        } else {
            return 0
        }
    }

    // Tính thưởng giờ cao điểm
    function calculateBonusPeakHour(weekPeakHours){
        // weekPeakHours: Số chuyến cao điểm trong tuần
        let bonusPeakHour = 0;
        if (userData.partner === '5h') {
            const data = getDataBonus(userData, bonusData)
            const peakHours = data.weekReward.peakHours
            peakHours.trips.forEach((trip, i) => {
                if (weekPeakHours >= trip){
                    bonusPeakHour = peakHours.rewards[i]
                }
            });
        }
        return bonusPeakHour
    }

    // Tính thưởng tuần
    function calculateBonusWeek(weekPoint){
        // weekPoint: Số điểm trong tuần
        const data = getDataBonus(userData, bonusData);
        const points = data.weekReward.points
        const rewards = data.weekReward.rewards

        let nearestPoint = null; // Điểm đã nhận
        let nearestReward = null; // Thưởng đã nhận
        let nextPoint = null;  // Điểm kế tiếp
        let nextReward = null;  // Thưởng kế tiếp

        let missingPoint = 0;
        let currentBonus = 0;
        let nextBonus = 0;
        let percentPoint = 0;

        for (let i = 0; i < points.length; i++) {
            if (weekPoint >= points[i]) {
                nearestPoint = points[i];
                nearestReward = rewards[i];
            } else {
                if (i < points.length) {
                    nextPoint = points[i];
                    nextReward = rewards[i];
                }
                break;
            }
        }

        if (nearestPoint !== null) {
            currentBonus = nearestReward
            if (nextPoint !== null) {
                nextBonus = nextReward
                missingPoint = nextPoint - weekPoint
                percentPoint = Math.round(weekPoint / nextPoint * 100)
            } else {
                nextBonus = rewards[rewards.length - 1]
                missingPoint = 0
                percentPoint = Math.round(weekPoint / nearestPoint * 100)
            }
        } else {
            nextBonus = nextReward
            missingPoint = nextPoint - weekPoint
            percentPoint = Math.round(weekPoint / nextPoint * 100)
        }
        return {
            currentBonus: currentBonus,
            nextBonus: nextBonus,
            missingPoint: missingPoint,
            percentPoint: percentPoint,
            nextPoint: nextPoint
        }

    }

    function timeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
    }

    // Tính dữ liệu trong một khoảng thời gian
    function calculateDataInRange(data, startDate, endDate){
        // data: dữ liệu
        // startDate: ngày bắt đầu
        // endDate: ngày kết thúc
        let totalKm = 0;
        let totalWorkingMin = 0;

        let weekEarnings = {
            total: 0,
            trips: 0,
            bonusDaily: 0,
            bonusPeakHours: 0,
            bonusWeek: 0
        }

        let weekTrips = {
            length: 0,
            peakHours: 0,
            other: 0,
            bike: 0,
            express: 0
        };

        let weekPoints = {
            total: 0,
            peakHours: 0,
            other: 0,
            bike: 0,
            express: 0
        };

        let weekAvg = {
            km: 0,
            earn: 0,
            trip: 0,
            point: 0
        };

        let chartXCategories = []
        let chartData = []

        for (let day of data) {
            if (day.date >= startDate && day.date <= endDate){
                chartXCategories.push(day.date);
                chartData.push(calculateDayEarnings(day))

                totalKm += calculateDayKm(day)
                totalWorkingMin += timeStringToMinutes(day.workingTime)

                let dailyTrip = calculateDayTrips(day)
                weekTrips.length += dailyTrip.length
                weekTrips.bike += dailyTrip.bike
                weekTrips.express += dailyTrip.express
                weekTrips.other += dailyTrip.other
                weekTrips.peakHours += dailyTrip.peakHours

                weekEarnings.trips += calculateDayEarnings(day)
                weekEarnings.bonusDaily += calculateBonusDaily(dailyTrip.length, getDataBonus(userData, bonusData).exceededRides)

                weekPoints.total += calculateDailyPoints(day).total
                weekPoints.peakHours += calculateDailyPoints(day).peakHours
                weekPoints.other += calculateDailyPoints(day).other
                weekPoints.bike += calculateDailyPoints(day).bike
                weekPoints.express += calculateDailyPoints(day).express
            }
        }

        weekEarnings.bonusPeakHours = calculateBonusPeakHour(weekTrips.peakHours)
        weekEarnings.bonusWeek = calculateBonusWeek(weekPoints.total).currentBonus
        weekEarnings.total = weekEarnings.trips + weekEarnings.bonusDaily + weekEarnings.bonusPeakHours + weekEarnings.bonusWeek


        weekAvg.km = totalKm / totalWorkingMin * 60
        weekAvg.earn = weekEarnings.total / totalWorkingMin * 60
        weekAvg.trip = weekTrips.length / totalWorkingMin * 60
        weekAvg.point = weekPoints.total / totalWorkingMin * 60

        const earnChartData = {
            chartXCategories: chartXCategories,
            chartData: chartData
        }
        updateChartData(earnChartData)

        // Tính thưởng tuần
        return {
            kilometers: totalKm,
            minutes: totalWorkingMin,
            trips: weekTrips,
            earnings: weekEarnings,
            points: weekPoints,
            weekRoad: calculateBonusWeek(weekPoints.total),
            weekAvg: weekAvg
        };
    }
    

    // Hàm để cập nhật dữ liệu biểu đồ từ localStorage
    function updateChartData(newData) {
        // Cập nhật dữ liệu mới vào localStorage
        let earnChartDataString = JSON.stringify(newData);
        localStorage.setItem('earnChartData', earnChartDataString);

        drawChart()
    }

    // Hàm để vẽ biểu đồ với dữ liệu từ localStorage
    function drawChart() {
        var t = document.getElementById("widget_earn_chart");
        t.innerHTML = '';
        if (t) {
            // Lấy dữ liệu từ localStorage
            var storedEarnChartDataString = localStorage.getItem('earnChartData');
            var storedEarnChartData = JSON.parse(storedEarnChartDataString);
            console.log(storedEarnChartData);
            
            var a = parseInt(KTUtil.css(t, "height")),
                l = KTUtil.getCssVariableValue("--bs-gray-500"),
                r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                o = KTUtil.getCssVariableValue("--bs-primary"),
                i = KTUtil.getCssVariableValue("--bs-primary");

            var s = {
                series: [{
                    name: t.getAttribute("data-kt-chart-info"),
                    data: storedEarnChartData.chartData // Dữ liệu thực tế cho biểu đồ
                }],
                chart: {
                    fontFamily: "inherit",
                    type: "area",
                    height: a,
                    toolbar: {
                        show: !1
                    }
                },
                plotOptions: {},
                legend: {
                    show: !1
                },
                dataLabels: {
                    enabled: !1
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: .4,
                        opacityTo: 0
                    }
                },
                stroke: {
                    curve: "smooth",
                    show: !0,
                    width: 3,
                    colors: [o]
                },
                xaxis: {
                    categories: storedEarnChartData.chartXCategories,
                    axisBorder: {
                        show: !1
                    },
                    axisTicks: {
                        show: !1
                    },
                    tickAmount: 6,
                    labels: {
                        rotate: 0,
                        rotateAlways: !0,
                        style: {
                            colors: l,
                            fontSize: "12px"
                        }
                    },
                    crosshairs: {
                        position: "front",
                        stroke: {
                            color: o,
                            width: 1,
                            dashArray: 3
                        }
                    },
                    tooltip: {
                        enabled: !0,
                        formatter: void 0,
                        offsetY: 0,
                        style: {
                            fontSize: "12px"
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: l,
                            fontSize: "12px"
                        },
                        formatter: function(e) {
                            return e.toLocaleString('vi-VN') + "đ"; // Tùy chỉnh định dạng
                        }
                    }
                },
                states: {
                    normal: {
                        filter: {
                            type: "none",
                            value: 0
                        }
                    },
                    hover: {
                        filter: {
                            type: "none",
                            value: 0
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: !1,
                        filter: {
                            type: "none",
                            value: 0
                        }
                    }
                },
                tooltip: {
                    style: {
                        fontSize: "12px"
                    },
                    y: {
                        formatter: function(e) {
                            return e.toLocaleString('vi-VN') + "đ"; // Tùy chỉnh định dạng
                        }
                    }
                },
                colors: [i],
                grid: {
                    borderColor: r,
                    strokeDashArray: 4,
                    yaxis: {
                        lines: {
                            show: !0
                        }
                    }
                },
                markers: {
                    strokeColor: o,
                    strokeWidth: 3
                }
            };

            // Nếu biểu đồ chưa được khởi tạo, khởi tạo nó
            if (!chartInstance) {
                chartInstance = new ApexCharts(t, s);
                chartInstance.render();
            } else {
                // Nếu biểu đồ đã được khởi tạo, cập nhật dữ liệu cho biểu đồ
                chartInstance.updateSeries(s.series);
            }
        }
    }

    
    return {
        init: function() {
            // Khởi tạo

            // Lựa chọn ngày tháng
            $("#date_range_picker").daterangepicker({
                startDate: defaultStartDate,
                endDate: defaultEndDate,
                showCustomRangeLabel: false,
                ranges: {
                    "Tuần Này": [moment().isoWeekday(1), moment().isoWeekday(7)],
                    "Tuần Trước": [moment().subtract(1, "week").isoWeekday(1),moment().subtract(1, "week").isoWeekday(7)],
                    "Hai Tuần Trước": [moment().subtract(2, "week").isoWeekday(1),moment().subtract(2, "week").isoWeekday(7)],
                    "Ba Tuần Trước": [moment().subtract(3, "week").isoWeekday(1),moment().subtract(3, "week").isoWeekday(7)]
                }
            }, updateDateRange);
            updateDateRange(defaultStartDate, defaultEndDate);

            // Đặt thời gian mặc định là Tuần Này
            setDefaultDateRange();

            drawChart()
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    TripsAnalytics.init();
});