<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">权限管理系统</a>
        <a class="site-navbar__brand-mini" href="javascript:;">权限</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value>
              <!-- hot  new  value="new"-->
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>

        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/nv2.png" :alt="userName" />
              {{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from "./main-navbar-update-password";
import { clearLoginInfo } from "@/utils";
import cookies from "vue-cookie";

export default {
  data() {
    return {
      updatePassowrdVisible: false
    };
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      }
    }
  },
  methods: {
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    quitSysandLogin(e) {
      window.location.href = e;
    },
    // 退出
    logoutHandle() {
      var self = this;
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl("/sys/logout"),
            method: "post",
            data: this.$httpk.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              clearLoginInfo();
              if(self.$config.using){
                self.$token.deleteToken();
                sessionStorage.setItem("menuList", "[]");
                sessionStorage.setItem("permissions", "[]");
                self.$login.reLogin(self);
              }else{
                this.$router.push({ name: 'login' }) // 内部跳转
              }

            }
          });
        })
        .catch(() => {});
    }
  },
  mounted() {}
};
</script>
