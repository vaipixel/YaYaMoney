// miniprogram/components/home-foundSet/home-foundSet.js
Component({
    properties : {
        hidden : {
            type : Boolean,
            value : '',
        }
    },
    data : {
        filterIndex: [
            {
             name : '调整余额',
            },
            {
              name : '转账',
            },
          ],
          flag : 0,
          hidden : false,
    },
    methods : {
        setFlag : function (e) {
            this.setData({
                flag : e.detail
            })
            console.log(e.detail)
        },
        setHidden : function (e) {
            this.setData({
                hidden : true
            })
        }
    },
})