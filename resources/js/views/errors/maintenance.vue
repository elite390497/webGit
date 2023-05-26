<template>
    <section id="wrapper" class="error-page">
        <div class="error-box">
            <div class="error-body text-center">
                <h2>Maintenance Mode</h2>
                <p class="text-muted m-t-30 m-b-30">{{getConfig('maintenance_mode_message')}}</p>
                <router-link to="/" class="btn btn-info btn-rounded waves-effect waves-light m-b-40"><i class="fas fa-undo"></i> {{trans('general.back')}}</router-link> 
                <a href="#" @click.prevent="logout" class="btn btn-danger btn-rounded waves-effect waves-light m-b-40"><i class="fas fa-power-off"></i> {{trans('auth.logout')}}</a>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        mounted() {
            if(!helper.getConfig('maintenance_mode') || !helper.isAuth() || helper.hasRole('admin'))
                this.$router.push('/dashboard');
        },
        methods:{
            getConfig(config){
                return helper.getConfig(config);
            },
            logout(){
                helper.logout().then(() => {
                    this.$router.push('/login')
                })
            }
        }
    }
</script>
