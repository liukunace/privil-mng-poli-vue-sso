<template>
    <div></div>
</template>

<script>
export default {
    name: 'oauth2logout',
    data() {
        return {};
    },
    methods: {},
    mounted: function() {
        this.$token.deleteToken();
        var logouturi =
            this.$config.base_oauth_url +
            this.$config.logout_url +
            '?post_logout_redirect_uri=' +
            this.$config.local_base_url +
            this.$config.redirect_url +
            '';
        window.location.href = logouturi;
        this.$router.push('/');
    }
};
</script>

<style>
</style>

