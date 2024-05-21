var dataTrips = localStorage.getItem('dataTrips') ? JSON.parse(localStorage.getItem('dataTrips')) : [];
var dataBonusArr = {
    "hanoi": {
        "5h": {
            "exceededRides": {
                "rides": [10,14],
                "rewards": [3000,5000]
            },
            "weekReward": {
                "points": [100,115,135],
                "rewards": [200000,250000,350000],
                "peakHours": {
                    "trips": [25,40,60],
                    "rewards": [60000,120000,250000]
                }
            }
        },
        "8h": {
            "exceededRides": {
                "rides": [14,18],
                "rewards": [5000,6000]
            },
            "weekReward": {
                "points": [140,165,195,230],
                "rewards": [450000,600000,800000,120000]
            }
        },
        "10h": {
            "exceededRides": {
                "rides": [18,22],
                "rewards": [6000,8000]
            },
            "weekReward": {
                "points": [150,180,215,260],
                "rewards": [500000,700000,1000000,1500000]
            }
        }
    },
    "danang": {
        "5h": {
            "exceededRides": {
                "rides": [10,14],
                "rewards": [3000,5000]
            },
            "weekReward": {
                "points": [100,115,135],
                "rewards": [200000,250000,350000],
                "peakHours": {
                    "trips": [25,40,60],
                    "rewards": [60000,120000,250000]
                }
            }
        },
        "8h": {
            "exceededRides": {
                "rides": [14,18],
                "rewards": [5000,6000]
            },
            "weekReward": {
                "points": [140,165,195,230],
                "rewards": [450000,600000,800000,120000]
            }
        },
        "10h": {
            "exceededRides": {
                "rides": [18,22],
                "rewards": [6000,8000]
            },
            "weekReward": {
                "points": [150,180,215,260],
                "rewards": [500000,700000,1000000,1500000]
            }
        }
    },
    "hochiminh": {
        "5h": {
            "exceededRides": {
                "rides": [10,14],
                "rewards": [3000,5000]
            },
            "weekReward": {
                "points": [100,115,135],
                "rewards": [200000,250000,350000],
                "peakHours": {
                    "trips": [25,40,60],
                    "rewards": [60000,120000,250000]
                }
            }
        },
        "8h": {
            "exceededRides": {
                "rides": [14,18],
                "rewards": [5000,6000]
            },
            "weekReward": {
                "points": [140,165,195,230],
                "rewards": [450000,600000,800000,120000]
            }
        },
        "10h": {
            "exceededRides": {
                "rides": [18,22],
                "rewards": [6000,8000]
            },
            "weekReward": {
                "points": [150,180,215,260],
                "rewards": [500000,700000,1000000,1500000]
            }
        }
    }
}
localStorage.setItem("dataBonus", JSON.stringify(dataBonusArr));
var dataBonus = localStorage.getItem('dataBonus') ? JSON.parse(localStorage.getItem('dataBonus')) : [];
var dataUser = localStorage.getItem('dataTrips') ? JSON.parse(localStorage.getItem('dataUser')) : [];



// Lấy dữ liệu người dùng theo cài đặt
function getConfigs(dataUser, dataBonus){
    // dataUser: Dữ liệu cài đặt người dùng
    // dataBonus: Dữ liệu tính thưởng theo chính sách
    if (dataUser && dataBonus) {
        if (dataUser.city === "hanoi") {
            if (dataUser.ambassador == "5h") {
                return dataBonus.hanoi["5h"]
            } else if (dataUser.ambassador == "8h") {
                return dataBonus.hanoi["8h"]
            } else {
                return dataBonus.hanoi["10h"]
            }
        } else if (dataUser.city === "danang") {
            if (dataUser.ambassador == "5h") {
                return dataBonus.danang["5h"]
            } else if (dataUser.ambassador == "8h") {
                return dataBonus.danang["8h"]
            } else {
                return dataBonus.danang["10h"]
            }
        } else {
            if (dataUser.ambassador == "5h") {
                return dataBonus.hochiminh["5h"]
            } else if (dataUser.ambassador == "8h") {
                return dataBonus.hochiminh["8h"]
            } else {
                return dataBonus.hochiminh["10h"]
            }
        }
    }
}

// Sắp xếp dữ liệu
function sortTrips(trips) {
    // Sắp xếp các chuyến xe trong mỗi đối tượng theo thời gian tăng dần
    trips.forEach(day => {
        day.t.sort((a, b) => {
        const timeA = a[0].split(':').map(Number);
        const timeB = b[0].split(':').map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });
    });
    // Sắp xếp các đối tượng theo ngày tăng dần
    trips.sort((a, b) => new Date(b.d) - new Date(a.d));

    return trips
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    // Chuyển số thành chuỗi để dễ xử lý và tách phần nguyên
    let integerPart = Math.floor(amount).toString();
    // Thêm dấu phẩy cho phần nguyên
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return integerPart;
}

// Lấy số ngày trong tuần từ chuỗi ngày
function getDayOfWeekIndex(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
        return -1;
    }
    return date.getDay();
}

// Chuyển chuỗi thời gian thành số phút
function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}

// Chuyển số phút thành chuỗi thời gian
function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // Đảm bảo giờ và phút có hai chữ số
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
}

// Tính thưởng vượt chuyến
function getBonusDaily(trips, exceededRides){
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
function getBonusPeakHour(weekPeakHours){
    // weekPeakHours: Số chuyến cao điểm trong tuần
    let bonusPeakHour = 0;
    if (dataUser.ambassador === '5h') {
        const _dataBonus = getConfigs(dataUser, dataBonus)
        const peakHours = _dataBonus.weekReward.peakHours
        peakHours.trips.forEach((trip, i) => {
            if (weekPeakHours >= trip){
                bonusPeakHour = peakHours.rewards[i]
            }
        });
    }
    return bonusPeakHour
}

// Tính thưởng tuần
function getBonusWeek(weekPoint){
    // weekPoint: Số điểm trong tuần
    const data = getConfigs(dataUser, dataBonus);
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

// Lấy dữ liệu phân tích trong một phạm vi
function getRangeAnalytics(dataTrips, startDateString, endDateString){
    // data: dữ liệu
    // startDate: ngày bắt đầu
    // endDate: ngày kết thúc
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    let result = {
        online: "0:00",
        earning: 0,
        kilometer: 0,
        points: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        trips: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        bonus: {
            day: 0,
            week: 0,
            peakHours: 0
        },
        avgs: {
            earning: 0,
            trip: 0,
            point: 0,
            kilometer: 0
        }
    }

    let timeWeed = 0;
    for (let day of dataTrips) {
        const date = new Date(day.d);
        if (date >= startDate && date <= endDate){
            console.log('Từ ' + startDateString + ' đến ' + endDateString)

            const dailyAnalytics = getDailyAnalytics(day);
            result.earning += dailyAnalytics.earning
            result.kilometer += dailyAnalytics.kilometer

            result.points.total += dailyAnalytics.points.total
            result.points.bike += dailyAnalytics.points.bike
            result.points.express += dailyAnalytics.points.express
            result.points.peakHours += dailyAnalytics.points.peakHours
            result.points.other += dailyAnalytics.points.other

            result.trips.total += dailyAnalytics.trips.total
            result.trips.bike += dailyAnalytics.trips.bike
            result.trips.express += dailyAnalytics.trips.express
            result.trips.peakHours += dailyAnalytics.trips.peakHours
            result.trips.other += dailyAnalytics.trips.other

            result.bonus.day += dailyAnalytics.bonus.day

            timeWeed += timeStringToMinutes(dailyAnalytics.online)
        }
    }
    result.online = minutesToTimeString(timeWeed)

    result.bonus.week = getBonusWeek(result.points.total)
    result.bonus.peakHours = getBonusPeakHour(result.trips.peakHours)

    result.avgs.earning = Math.round(result.earning / 7);
    result.avgs.kilometer = (result.kilometer / 7).toFixed(2)
    result.avgs.trip = (result.trips.total / 7).toFixed(2)
    result.avgs.point = (result.points.total / 7).toFixed(2)

    console.log(result)
    return result
}

// Lấy dữ liệu phân tích ngày
function getDailyAnalytics(dayData){
    // data: Dữ liệu ngày {"d": "", "o": "5:00", "t":[["06:16","Bike","64000"]]}
    let result = {
        online: "0:00",
        earning: 0,
        kilometer: 0,
        points: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        trips: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        avgs: {
            earning: 0,
            trip: 0,
            point: 0,
            km: 0
        },
        bonus: {
            day: 0
        }
    }
    // Nếu có chuyến xe trong ngày
    const dayDate = dayData.d;
    const dayOnline = dayData.o;
    const dayTrips = dayData.t;

    if (dayTrips){
        const tripDayOfWeek = getDayOfWeekIndex(dayDate);
        if (tripDayOfWeek === -1) {
            return result;
        }

        dayTrips.forEach(trip => {
            const tripTime = trip[0];
            const tripService = trip[1];
            const tripPrice = parseInt(trip[2]);

            const tripHour = parseInt(tripTime.split(':')[0]);

            // Tổng chuyến xe trong ngày
            result.trips.total += 1;

            // Tổng doanh số trong ngày
            result.earning += (tripPrice - 1000) * 0.73;

            // Tổng số km trong ngày
            if (tripService === 'Bike') {
                const calculateBikeKm = ((tripPrice - 1000) * 0.933 - 13800) / 4800 + 2
                const bikeKm = Math.round(calculateBikeKm * 100) / 100
                result.kilometer += bikeKm
            } else {
                const calculateExpressKm = ((tripPrice - 1000) * 0.933 - 15000) / 5000 + 2
                const expressKm = Math.round(calculateExpressKm * 100) / 100
                result.kilometer += expressKm
            }

            // Tính điểm thưởng trong ngày
            if (tripDayOfWeek >= 1 && tripDayOfWeek <= 5) { // Từ Thứ Hai đến Thứ Sáu
                if (tripService === 'Bike') {
                    // Chuyến xe
                    result.trips.bike += 1;

                    if (tripHour >= 5 && tripHour < 9) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.bike += 2;
                        result.points.peakHours += 2;
                    } else if (tripHour >= 16 && tripHour < 20) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.bike += 2;
                        result.points.peakHours += 2;
                    } else {
                        result.points.total += 1;
                        result.points.bike += 1;

                    }
                } else {
                    // Giao hàng
                    if (tripHour >= 5 && tripHour < 9) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.peakHours += 2;

                    } else if (tripHour >= 9 && tripHour < 12) {
                        result.points.total += 1.5;

                    } else if (tripHour >= 12 && tripHour < 20) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.peakHours += 2;

                    } else {
                        result.points.total += 1;
                    }
                }
            } else { // Cuối tuần (Chủ Nhật hoặc Thứ Bảy)
                if (tripService === 'Bike') {
                    // Chuyến xe
                    result.trips.bike += 1;

                    if (tripHour >= 9 && tripHour < 12) {
                        // Điểm thưởng
                        result.points.total += 1.5;
                        result.points.bike += 1.5;
                    } else if (tripHour >= 16) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.bike += 2;
                        result.points.peakHours += 2;
                    } else {
                        // Điểm thưởng
                        result.points.total += 1;
                        result.points.bike += 1;
                    }
                } else {
                    // Giao hàng
                    if (tripHour >= 9 && tripHour < 12) {
                        // Điểm thưởng
                        result.points.total += 1.5;
                    } else if (tripHour >= 12) {
                        // Chuyến xe cao điểm
                        result.trips.peakHours += 1;

                        // Điểm thưởng cao điểm
                        result.points.total += 2;
                        result.points.peakHours += 2;
                    } else {
                        // Điểm thưởng
                        result.points.total += 1;
                    }
                }
            }

        });

        result.online = dayOnline
        result.trips.express = result.trips.total - result.trips.bike
        result.trips.other = result.trips.total - result.trips.peakHours
    
        result.points.express = result.points.total - result.points.bike
        result.points.other = result.points.total - result.points.peakHours
    
        // Làm tròn số
        result.kilometer = parseFloat(result.kilometer.toFixed(2));
    
        const workingMin = timeStringToMinutes(result.online)
        result.avgs.km = result.kilometer / workingMin * 60
        result.avgs.earning = result.earning / workingMin * 60
        result.avgs.point = result.points.total / workingMin * 60
        result.avgs.trip = result.trips.total / workingMin * 60
    
        const _dataBonus = getConfigs(dataUser, dataBonus)
        result.bonus.day = getBonusDaily(result.trips.total, _dataBonus.exceededRides)
    }

    return result
}

function filterDailyAnalytics(dateString) {
    let defaultData = {
        online: "0:00",
        earning: 0,
        kilometer: 0,
        points: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        trips: {
            total: 0,
            bike: 0,
            express: 0,
            peakHours: 0,
            other: 0
        },
        avgs: {
            earning: 0,
            trip: 0,
            point: 0,
            km: 0
        },
        bonus: {
            day: 0
        }
    };
    const result = dataTrips.find(entry => entry.d === dateString);
    if (result){
        return getDailyAnalytics(result);
    } else {
        return defaultData;
    }
}

// Hàm để tạo mảng các ngày từ startDate đến endDate
function generateDateArray(startDate, endDate) {
    let dateArray = [];
    while (startDate <= endDate) {
        let formattedDate = startDate.toISOString().split('T')[0];
        dateArray.push(formattedDate);
        startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
}

function getFirstAndLastDayOfMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
        firstDay: firstDay,
        lastDay: lastDay
    };
}

function findMinMax(arr) {
    // Kiểm tra xem mảng có rỗng không
    if (arr.length === 0) {
        return "Mảng rỗng";
    }

    let min = arr[0]; // Giả sử phần tử đầu tiên là số nhỏ nhất
    let max = arr[0]; // Giả sử phần tử đầu tiên là số lớn nhất

    // Duyệt qua mảng để tìm số nhỏ nhất và số lớn nhất
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i]; // Cập nhật số nhỏ nhất nếu tìm thấy số nhỏ hơn
        }
        if (arr[i] > max) {
            max = arr[i]; // Cập nhật số lớn nhất nếu tìm thấy số lớn hơn
        }
    }

    return {
        min: min,
        max: max
    };
}

function getRecentDates(numDays) {
    const recentDates = [];
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lặp qua số ngày cần lấy
    for (let i = 0; i < numDays; i++) {
        // Tính toán ngày trước đó dựa trên số ngày cần lấy
        const previousDate = new Date(currentDate.getTime() - i * millisecondsPerDay);
        recentDates.push(formatDate(previousDate));
    }

    return recentDates;
}

function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Đảm bảo rằng tháng và ngày có dạng "0X" nếu cần
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    // Tạo chuỗi định dạng "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
}