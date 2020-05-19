
var app = new Vue({
    el: '#app',
    data() {
        return {
            data: [],
            // focusCounty: "",
            focusCounty: JSON.parse(localStorage.getItem("focusCounty")) || [],
            focusCountyData: {
                // SiteName: "",
            },
            select: "",
            county: [],
            siteName: [],
            stateNice: 0,
            stateSoso: 0,
            stateBad: 0,
            countyImg: {
                "臺北市": "https://images.unsplash.com/photo-1470004914212-05527e49370b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3026&q=80",
                "基隆市": "https://images.unsplash.com/photo-1574093475418-98773286cecf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
                "新北市": "https://images.unsplash.com/photo-1520049315146-ae88e5759e05?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2768&q=80",
                "新竹市": "https://images.unsplash.com/photo-1543069596-58a2045c4f9f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
                "台中市": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2226&q=80",
                "高雄市": "https://images.unsplash.com/photo-1570984674575-03d3578c00c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
                "台南市": "https://images.unsplash.com/photo-1549817778-71fd33ffb580?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80",
                "通用": "https://images.unsplash.com/photo-1568709559610-0e1ac4de9a2f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3113&q=80",
            }
        }
    },
    methods: {
        getData() {
            const vm = this;
            // get api response
            // api https://cors-anywhere.herokuapp.com/http://opendata2.epa.gov.tw/AQI.json
            const api = 'https://cors-anywhere.herokuapp.com/http://opendata2.epa.gov.tw/AQI.json';
            $.get(api).then(function (response) {
                // vm.data = response;
                // console.log(vm.data);
                const countyImg = Object.keys(vm.countyImg);
                response.forEach(v => {
                    if (v.SiteName == "中山") {
                        vm.focusCountyData = v;
                    }
                    // console.log(v['PM2.5']);
                    v.img = "通用";
                    countyImg.forEach(d => {
                        if (v.County == d) {
                            v.img = d;
                        }
                    })
                    if (vm.county.indexOf(v.County) == -1) {
                        vm.county.push(v.County);
                    }
                    vm.siteName.push({
                        county: v.County,
                        siteName: v.SiteName,
                    });
                })
                vm.data = response;
                // console.log(vm.data);
                // console.log(vm.siteName);
                // console.log(vm.focusCountyData);
            })
        },
        setLocalStorage(key, array) {
            let str = JSON.stringify(array);
            localStorage.setItem(key, str);
        },
    },
    computed: {
        // filterFocusSelect() {
        //     const vm = this;
        //     let focusCounty = JSON.parse(localStorage.getItem("focusCounty")) || [];
        //     if (focusCounty.length == 0) {
        //         vm.focusCounty = ""
        //     } else {
        //         vm.focusCounty = focusCounty[0];
        //     }
        //     console.log(focusCounty);
        //     console.log(vm.focusCounty);
        //     return vm.focusCounty;
        // },
        renderFocusCounty() {
            const vm = this;
            if (vm.focusCounty.length == 0) {
                vm.focusCounty = "";
                return vm.focusCountyData;
            } else {
                const array = [];
                vm.data.forEach(v => {
                    if (v.SiteName == vm.focusCounty) {
                        vm.focusCountyData = v;
                        vm.focusCounty = v.SiteName;
                        array.push(v.SiteName);
                    }
                    // vm.focusCounty.forEach(d => {
                    //     if (v.SiteName == d) {
                    //         vm.focusCountyData = v;
                    //         array.push(v.SiteName);
                    //         return vm.focusCountyData;
                    //     }
                    // })
                })
                console.log(array);
                vm.setLocalStorage("focusCounty", array);
                return vm.focusCountyData;
            }

        },
        fucusState() {
            const state = this.focusCountyData.Status;
            let className = "";
            if (state == "良好") {
                className = "border-success";
            } else if (state == "普通") {
                className = "border-primary";
            } else if (state == "對敏感族群不健康") {
                className = "border-soso";
            } else if (state == "對所有族群不健康") {
                className = "border-warning";
            } else if (state == "非常不健康") {
                className = "border-danger";
            } else {
                className = "border-danger";
            }
            return className;
        },
        filterData() {
            const vm = this;
            if (vm.select == "") {
                return vm.data;
            } else {
                return vm.data.filter(v => {
                    return v.County == vm.select;
                })
            }
        },
        stateNiceCount() {
            const vm = this;
            vm.data.forEach(v => {
                if (v.Status == "良好") {
                    vm.stateNice += 1;
                }
            })
            // console.log(vm.stateNice);
            return vm.stateNice;
        },
        stateSosoCount() {
            const vm = this;
            vm.data.forEach(v => {
                if (v.Status == "普通") {
                    vm.stateSoso += 1;
                }
            })
            // console.log(vm.stateSoso);
            return vm.stateSoso;
        },
        stateBadCount() {
            const vm = this;
            vm.data.forEach(v => {
                if (v.Status == "對敏感族群不健康" || v.Status == "對所有族群不健康" || v.Status == "非常不健康") {
                    vm.stateBad += 1;
                }
            })
            // console.log(vm.stateBad);
            return vm.stateBad;
        }
    },
    created() {
        this.getData();
        // this.test();
    },
})
Vue.component('card', {
    template: "#card",
    props: ['person', "img"],
    methods: {

    },
    computed: {
        cardState() {
            const state = this.person.Status;
            let className = "";
            if (state == "良好") {
                className = "g-bg-success";
            } else if (state == "普通") {
                className = "g-bg-primary";
            } else if (state == "對敏感族群不健康") {
                className = "g-bg-soso";
            } else if (state == "對所有族群不健康") {
                className = "g-bg-warning";
            } else if (state == "非常不健康") {
                className = "g-bg-danger";
            } else {
                className = "g-bg-danger";
            }
            return className;
        }
    }
})