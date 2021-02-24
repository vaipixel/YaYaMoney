class LoginService {
    async loginWx() {
        await wx.wxp.login();
        return await wx.wxp.getUserInfo({ withCredentials: true })
    }
    async checkLoginPermission() {
        let setting = await wx.getSetting();
        let authSetting = setting.authSetting;
        console.log(authSetting);
    }

    /**
     * 向服务器添加或者更新用户
     * @param {*} loginData 
     */
    async onUserLogin(loginData) {
        let result = await wx.cloud.callFunction({
            name: 'user_service',
            data: {
                action: 'login',
                data: loginData
            }
        });
        return result.result;
    }

    /**
     * 检查用户群组状态
     */
    async checkUserGroupStatus() {

    }

    async getUserGroupInfo() {

    }
}

export { LoginService }