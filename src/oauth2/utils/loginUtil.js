import RndNum from "./ranNum";
import axios from 'axios'
var loginUtil = {
  login: function (vue) {
    vue.$config.code = RndNum(4);
    var authorUrl = vue.$config.base_oauth_url + vue.$config.user_authorize_url;
    authorUrl = authorUrl + ('?' + vue.$querystring.stringify({
      client_id: vue.$config.client_id,
      response_type: vue.$config.response_type,
      scope: vue.$config.scope,
      state: vue.$config.state,
      redirect_uri: vue.$config.local_base_url + vue.$config.redirect_url,
    }))
    window.location.href = authorUrl;
  },
  reLogin: function (vue) {
    var logouturi =
      vue.$config.base_oauth_url +
      vue.$config.logout_url +
      "?service=" +
      vue.$config.local_base_url +
      "/";
    window.location.href = logouturi;
  },
  loginSave: function (vue, name, token) {
    vue.$config.code = RndNum(4);
    var authorUrl = vue.$config.base_oauth_url + vue.$config.user_authorize_url;
    authorUrl = authorUrl + ('?' + vue.$querystring.stringify({
      client_id: vue.$config.client_id,
      response_type: vue.$config.response_type,
      scope: vue.$config.scope,
      state: vue.$config.state,
      redirect_uri: vue.$config.local_base_url + vue.$config.redirect_url,
    }))
    if (name != null) {
      vue.$cookies.set('username', name, 60 * 60 * 24);
      if (token != null && token != "null") {
        vue.$cookies.set(name, token, 60 * 60 * 24);
      }
    }

    window.location.href = authorUrl;
  },
  logout: function (vue, return_url) {
    vue.$router.push('/logout' + "?return_url=" + return_url)
  },
  checkLogin: function (vue) {
    var tokenInfo = vue.$token.loadToken();
    if (tokenInfo.access_token === null || tokenInfo.access_token === "null") {
      return false;
    }
    return true;
  },
  getUserName: function (access_token) {
    let usernameid = "";
    axios({
      method: 'get',
      url: vue.$config.base_oauth_url + vue.$config.user_info_url + '?' + 'access_token=' + access_token,
    })
      .then(function (response) {
        usernameid = response.data.id;
      })
      .catch(function (error) {
        console.log(error)
      })
    return usernameid;
  }
}

export default loginUtil;
