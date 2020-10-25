var config = {
  //base_oauth_url: "https://cas.server.com:843",
  base_oauth_url: "https://poli.sso.ivtech.tech",
  user_authorize_url: "/cas/oauth2.0/authorize",
  access_token_url: "/cas/oauth2.0/accessToken",
  user_info_url: "/cas/oauth2.0/profile",
  logout_url: "/cas/logout",
  local_base_url: "http://localhost:60617",//http://privil.mngs.ivtech.tech/    //poliprivil.mngs.ivtech.tech   //http://localhost:60605
  home_url: "/#/home",
  redirect_url: "/#/oautflogirxfxfX6acojcofaciasdfcas",
  client_id: "helloworld",
  client_secret: "admin123",
  scope: "read_user",
  state: "",
  response_type: "code",
  grant_type: "authorization_code",
  code: "",
  to_url: "",
  from_url: "",
  islogin: -1,
  res_type: "application/json",
  using : true,
}
export default config;
