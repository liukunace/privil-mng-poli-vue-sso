<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
      </div>
    </template>
  </div>
</template>

<script>
import MainNavbar from "./main-navbar";
import MainSidebar from "./main-sidebar";
import MainContent from "./main-content";

export default {
  provide() {
    return {
      // 刷新
      refresh() {
        this.$store.commit("common/updateContentIsNeedRefresh", true);
        this.$nextTick(() => {
          this.$store.commit("common/updateContentIsNeedRefresh", false);
        });
      }
    };
  },
  data() {
    return {
      loading: true,
      username: "测试name",
      islogin: false
    };
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
      set(val) {
        this.$store.commit("common/updateDocumentClientHeight", val);
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      }
    },
    userId: {
      get() {
        return this.$store.state.user.id;
      },
      set(val) {
        this.$store.commit("user/updateId", val);
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit("user/updateName", val);
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {
    this.resetDocumentClientHeight();
    if(this.$config.using){
      let self = this;
      let token = this.$token.loadToken().access_token;
      if (token == null || token == "null") {
        this.$login.login(this);
      } else {
        this.islogin = this.checkLogin();
        this.$ajax({
          url:
            this.$config.base_oauth_url +
            this.$config.user_info_url +
            "?" +
            "access_token=" +
            token,
          headers: { Accept: "application/json" }
        })
          .then(response => {
            let usernameid = response.data.id;
            self.username = usernameid;
            let tokentemp = this.$token.loadToken().access_token;
            this.$ajax({
              url:
                window.SITE_CONFIG.baseUrl+"/mas/user/" +
                self.username +
                "/" +
                tokentemp,
              headers: { Accept: "application/json" }
            }).then(response => {
              self.$cookie.set("token", tokentemp);
              self
                .$ajax({
                  url:
                    window.SITE_CONFIG.baseUrl+"/mas/navall/" +
                    self.username,
                  headers: { Accept: "application/json" }
                })
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    var sysmenuList = [];
                    var len = data.menuList.length;
                    for (var i = 0; i < len; i++) {
                      if (data.menuList[i].menuId < 1000) {
                        sysmenuList.push(data.menuList[i]);
                      }
                    }
                    sessionStorage.setItem(
                      "menuList",
                      JSON.stringify(sysmenuList || "[]")
                    );
                    sessionStorage.setItem(
                      "permissions",
                      JSON.stringify(data.permissions || "[]")
                    );
                    this.getUserInfo();
                  } else {
                    sessionStorage.setItem("menuList", "[]");
                    sessionStorage.setItem("permissions", "[]");
                  }
                });
            });
            let cookiedata = this.$cookies.get(usernameid);
            if (cookiedata == null) {
              self.$token.deleteToken();
            } else {
              if (self.checkLogin()) {
                self.getUserInfo2();
              }
            }
          })
          .catch(error => {});
      }
    }

  },
  methods: {
    checkLogin: function() {
      return this.$login.checkLogin(this);
    },
    login: function() {
      this.$login.login(this);
    },
    logout: function() {
      this.$login.logout(
        this,
        this.$config.local_base_url + this.$config.home_url + ""
      );
      this.$config.islogin = 0;
    },
    getUserInfo2: function() {
      let tokenInfo = this.$token.loadToken();
      this.$ajax({
        url:
          this.$config.base_oauth_url +
          this.$config.use_info_url +
          "?" +
          "access_token=" +
          tokenInfo.access_token,
        headers: { Accept: "application/json" }
      })
        .then(response => {
          let usernameid = response.data.id;
          console.log("usernameid:" + usernameid);
        })
        .catch(error => {});
    },
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement["clientHeight"];
      window.onresize = () => {
        this.documentClientHeight = document.documentElement["clientHeight"];
      };
    },
    // 获取当前管理员信息
    getUserInfo() {
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/user/info"),
        method: "get",
        params: this.$httpk.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var self = this;
          this.loading = false;
          this.userId = data.user.userId;
          this.userName = data.user.username;
        }
      });
    }
  }
};
</script>
