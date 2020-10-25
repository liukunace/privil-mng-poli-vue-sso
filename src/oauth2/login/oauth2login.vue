<template>
  <div></div>
</template>

<script>
export default {
  name: "oauth2login",
  data() {
    return {
      state: "",
      code: ""
    };
  },
  methods: {
    getToken: function(code) {
      let search_url =
        this.$config.base_oauth_url + this.$config.access_token_url;
      search_url += "?client_id=" + this.$config.client_id;
      search_url += "&client_secret=" + this.$config.client_secret;
      search_url += "&grant_type=" + this.$config.grant_type;
      search_url += "&code=" + code;
      search_url += "&redirect_uri=" + this.$config.local_base_url;
      var self = this;
      this.$http
        .post(search_url)
        .then(res => {
          var token_res_arr = res.bodyText.split("&");
          token_res_arr = token_res_arr[0].split("=");
          var tokenjson = {
            access_token: token_res_arr[1],
            token_type: "bearer",
            scope: ""
          };
          self.$token.savetoken(tokenjson);
          self.$config.islogin = 1;
          self.$router.push("/");
        })
        .catch(() => console.log("promise catch token err--oauthlogin")); //捕获异常;
    }
  },
  mounted: function() {
    var rrr = this.$route;
    this.code = this.$route.query.code;
    this.access_token = this.$route.query.access_token;
    this.state = this.$route.query.state;
    this.getToken(this.code);
    
  }
};
</script>

<style>
</style>

