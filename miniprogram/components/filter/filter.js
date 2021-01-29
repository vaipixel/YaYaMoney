// components/filter/filter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    filterIndex: {
      type : Array
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    flag : 0,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    Change : function (e) {
      var id = e.currentTarget.dataset.id
      this.setData({
        flag : e.currentTarget.dataset.id
      });

      this.triggerEvent('setFlag', id) 
   },
  }

  
})
