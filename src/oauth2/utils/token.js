var token = {
  savetoken: function (token) {
    sessionStorage.setItem("access_token", token.access_token);
    sessionStorage.setItem("enabled", token.enabled);
    sessionStorage.setItem("expires_in", token.expires_in);
    sessionStorage.setItem("refresh_token", token.refresh_token);
    sessionStorage.setItem("token_type", token.token_type);
    sessionStorage.setItem("scope", token.token_type);
  },
  deleteToken: function () {
    sessionStorage.setItem("access_token", null);
    sessionStorage.setItem("enabled", null);
    sessionStorage.setItem("expires_in", null);
    sessionStorage.setItem("refresh_token", null);
    sessionStorage.setItem("token_type", null);
  },
  loadToken: function () {
    let tokenInfo = {};
    tokenInfo.access_token = sessionStorage.getItem("access_token");
    tokenInfo.enabled = sessionStorage.getItem("enabled");
    tokenInfo.expires_in = sessionStorage.getItem("expires_in");
    tokenInfo.refresh_token = sessionStorage.getItem("refresh_token");
    tokenInfo.token_type = sessionStorage.getItem("token_type");
    return tokenInfo;
  },
  getTokenFromService: function (vue, code, callback, error) {
    vue.$ajax.post(vue.$config.base_oauth_url + vue.$config.access_token_url, {
      client_id: vue.$config.client_id,
      client_secret: vue.$config.client_secret,
      code: code,
      redirect_uri: vue.$config.local_base_url + vue.$config.redirect_url,
      grant_type: vue.$config.grant_type
    }, {
      headers: { "Accept": vue.$config.res_type }
    })
      .then(callback)
      .catch(error);
  }
}

export default token;
