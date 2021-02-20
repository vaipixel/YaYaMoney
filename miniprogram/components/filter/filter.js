// components/account-filter/account-filter.js
const numbersUtils = require('../../utils/numberUtils.js');

Component({
    options: {
        virtualHost: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        filterData: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentSelected: "",
        mask: {
            width: "",
            marginLeft: ""
        },
        filters: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        initUI: async function() {
            await this.measureItem();
            this._changeSelected(0);
        },
        changeSelected: function(e) {
            let selectedIndex = e.target.dataset.selectedIndex;
            this._changeSelected(selectedIndex);
        },
        _changeSelected: function(selectedIndex) {
            let filters = this.data.filters;
            let filter = filters[selectedIndex];
            let selectedFilterName = filter.name;
            if (selectedFilterName == this.data.currentSelected) {
                console.log('Same as current, skip.');
                return
            }
            this.setData({
                currentSelected: selectedFilterName
            });
            this.setData({
                'mask.width': filter.width + "px",
                'mask.marginLeft': filter.marginLeft + "px",
            });
            this.triggerEvent('filter-changed', { filter: this.data.currentSelected })
        },
        measureItem: async function() {
            let filters = this.data.filters;
            let query = this.createSelectorQuery();
            let nodes = query.selectAll(".filter-item");
            await new Promise(resolve => {
                nodes.fields({
                    size: true,
                    computedStyle: ['marginLeft']
                }, function(res) {
                    for (let index = 0; index < res.length; index++) {
                        const item = res[index];
                        let margin = numbersUtils.getNumberFromStr(item.marginLeft);
                        filters[index].width = item.width + margin * 2;
                    }
                    for (let i = 0; i < filters.length; i++) {
                        const item = filters[i];
                        item.marginLeft = 0;
                        for (let j = i - 1; j >= 0; j--) {
                            const prvItem = filters[j];
                            item.marginLeft += prvItem.width;
                        }
                    }
                    resolve('');
                }).exec();
            });
        }
    },
    lifetimes: {
        attached: function() {
            console.log('attached');
            let filters = this.data.filters
            this.data.filterData.forEach(item => {
                filters.push({
                    name: item,
                    width: 10
                })
            });
            if (filters.length == 0) {
                return
            }
            this.initUI();

        },
        detached: function() {
            console.log('detached');
        },
        ready: function() {
            console.log('ready');
        },
        moved: function() {
            console.log('moved');
        }
    },
    pageLifetimes: {
        show: function() {
            console.log('show');
        },
        resize: function() {
            console.log('resize');
        }
    }
})