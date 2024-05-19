"use strict";

var AddBonusData = function() {
    var bonusData = {
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
    var bonusDataJson = JSON.stringify(bonusData);
    localStorage.setItem("bonusData", bonusDataJson);

    return {
        init: function() {
            // Khởi tạo
            localStorage.setItem("bonusData", bonusDataJson);
        }
    };
}();

KTUtil.onDOMContentLoaded(function() {
    AddBonusData.init();
});