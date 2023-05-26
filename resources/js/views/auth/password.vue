<template>
    <section id="wrapper">
        <div class="login-register guest-page">
            <div class="login-box card guest-box">
            <div class="card-body p-4">
                <img :src="getLogo" style="max-width:250px;" class="mx-auto d-block" />
                <form class="form-horizontal form-material" id="passwordform" @submit.prevent="submit" @keydown="passwordForm.errors.clear($event.target.name)">
                    <h3 class="box-title m-t-20 m-b-10">{{trans('passwords.reset_password')}}</h3>
                    <div class="form-group ">
                        <input type="text" name="email" class="form-control" :placeholder="trans('auth.email')" v-model="passwordForm.email">
                        <show-error :form-name="passwordForm" prop-name="email"></show-error>
                    </div>
                    <div class="g-recaptcha" v-if="getConfig('recaptcha') && getConfig('reset_password_recaptcha')" :data-sitekey="getConfig('recaptcha_key')"></div>
                    <div class="form-group text-center m-t-20">
                        <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">{{trans('passwords.reset_password')}}</button>
                    </div>
                    <div class="form-group m-b-0">
                        <div class="col-sm-12 text-center">
                            <p>{{trans('auth.back_to_login?')}} <router-link to="/login" class="text-info m-l-5"><b>{{trans('auth.sign_in')}}</b></router-link></p>
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
        data() {
            return {
                passwordForm: new Form({
                    email: ''
                })
            }
        },
        components: {
            guestFooter
        },
        mounted(){
            if(!helper.featureAvailable('reset_password')){
                helper.featureNotAvailableMsg();
                return this.$router.push('/dashboard');
            }
        },
        methods: {
            submit(e){
                let loader = this.$loading.show();
                this.passwordForm.post('/api/auth/password')
                    .then(response =>  {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/login');
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            }
        },
        computed: {
            getLogo(){
                return helper.getLogo();
            }
        }
    }
</script>
