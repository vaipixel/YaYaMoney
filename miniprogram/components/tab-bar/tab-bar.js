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
        tabData: {
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
        tabs: []
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
            let tabs = this.data.tabs;
            let tab = tabs[selectedIndex];
            let selectedTabName = tab.name;
            if (selectedTabName == this.data.currentSelected) {
                console.log('Same as current, skip.');
                return
            }
            this.setData({
                currentSelected: selectedTabName
            });
            this.setData({
                'mask.width': tab.width + "px",
                'mask.marginLeft': tab.marginLeft + "px",
            });
            this.triggerEvent('tab-changed', { tab: this.data.currentSelected })
        },
        measureItem: async function() {
            let tabs = this.data.tabs;
            let query = this.createSelectorQuery();
            let nodes = query.selectAll(".tab");
            await new Promise(resolve => {
                nodes.fields({
                    size: true,
                    computedStyle: ['marginLeft']
                }, function(res) {
                    for (let index = 0; index < res.length; index++) {
                        const item = res[index];
                        // 得到 item 的 margin
                        let margin = numbersUtils.getNumberFromStr(item.marginLeft);
                        tabs[index].width = item.width + margin * 2;
                    }
                    // 计算 mask 在各个条目位置时的 margin
                    for (let i = 0; i < tabs.length; i++) {
                        const item = tabs[i];
                        item.marginLeft = 0;
                        for (let j = i - 1; j >= 0; j--) {
                            const prvItem = tabs[j];
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
            let tabs = this.data.tabs
            this.data.tabData.forEach(item => {
                tabs.push({
                    name: item,
                    width: 10
                })
            });
            if (tabs.length == 0) {
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