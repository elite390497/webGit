<template>
    <section id="wrapper">
        <div class="login-register guest-page">
            <div class="login-box card guest-box">
            <div class="card-body p-4">
                <img :src="getLogo" style="max-width:250px;" class="mx-auto d-block" />
                <center class="m-t-30">
                    <h4 class="card-title m-t-10">{{getAuthUser('name')}}</h4>
                </center>
                <form class="form-horizontal form-material" id="lockScreenForm" @submit.prevent="submit" @keydown="lockScreenForm.errors.clear($event.target.name)">
                    <h3 class="box-title m-b-20 text-center">{{trans('auth.password')}}</h3>
                    <div class="form-group ">
                        <input type="password" name="password" class="form-control text-center" :placeholder="trans('auth.password')" v-model="lockScreenForm.password">
                        <show-error :form-name="lockScreenForm" prop-name="password"></show-error>
                    </div>
                    <div class="form-group text-center m-t-20">
                        <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">{{trans('auth.confirm')}}</button>
                    </div>
                    <div class="form-group m-b-0">
                        <div class="col-sm-12 text-center">
                            <p><a href="#" @click.prevent="logout"><i class="fas fa-power-off"></i> {{trans('auth.logout')}}</a></p>
                        </div>
                    </div>
                </form>
            </div>
            <guest-footer></guest-footer>
          </div>
        </div>

    </section>
</template>
<script>
    import guestFooter from '@js/layouts/partials/guest-footer.vue'

    export default {
        components: {guestFooter},
        data(){
            return {
                lockScreenForm: new Form({
                    password: '',
                })
            }
        },
        mounted(){
            if(!helper.getConfig('lock_screen') || !helper.isScreenLocked())
                this.$router.push('/dashboard');

            if(!helper.getConfig('mode'))
                this.lockScreenForm.password = 'abcd1234';
        },
        methods: {
            logout(){
                helper.logout().then(() => {
                    this.$router.push('/login')
                })
            },
            submit(){
                let loader = this.$loading.show();
                this.lockScreenForm.post('/api/auth/lock')
                    .then(response => {
                        this.$store.dispatch('setLastActivity');
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/dashboard');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getAuthUser(name){
                return helper.getAuthUser(name);
            }
        },
        computed: {
            getLogo(){
                return helper.getLogo();
            }
        }
    }
</script>
