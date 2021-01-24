// components/filter/filter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    filterIndex: [
      {
       name : '全部',
      },
      {
        name : '我',
      },
      {
      name : '老婆',
      },
    ],
    flag : 0,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    Change : function (e) {
      this.setData({
        flag : e.currentTarget.dataset.id
      })  
   },
  }

  
})
