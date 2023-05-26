<template>
    <section id="wrapper">
        <div class="login-register guest-page">
            <div class="login-box card guest-box">
            <div class="card-body p-4">
                <img :src="getLogo" style="max-width:250px;" class="mx-auto d-block" />
                <h3 class="box-title m-t-20 m-b-10">{{trans('passwords.reset_password')}}</h3>
                <form class="form-horizontal form-material" id="resetform" @submit.prevent="submit" @keydown="resetForm.errors.clear($event.target.name)">
                    <template v-if="! isTokenValidated">
                        <div class="form-group ">
                            <input type="text" name="email" class="form-control" :placeholder="trans('auth.email')" v-model="resetForm.email">
                            <show-error :form-name="resetForm" prop-name="email"></show-error>
                        </div>
                        <div class="form-group ">
                            <input type="text" name="token" class="form-control" :placeholder="trans('passwords.reset_token')" v-model="resetForm.token">
                            <show-error :form-name="resetForm" prop-name="token"></show-error>
                        </div>
                    </template>
                    <template v-else>
                        <div class="form-group">
                            <input type="password" name="password" class="form-control" :placeholder="trans('auth.password')" v-model="resetForm.password">
                            <show-error :form-name="resetForm" prop-name="password"></show-error>
                        </div>
                        <div class="form-group">
                            <input type="password" name="password" class="form-control" :placeholder="trans('auth.confirm_password')" v-model="resetForm.password_confirmation">
                            <show-error :form-name="resetForm" prop-name="password_confirmation"></show-error>
                        </div>
                    </template>
                    <div class="form-group text-center m-t-20">
                        <button v-if="isTokenValidated" class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">{{trans('passwords.reset_password')}}</button>
                        <button v-if="! isTokenValidated" class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" @click="validate" type="button">{{trans('passwords.validate_token')}}</button>
                    </div>
                </form>
                <div class="form-group m-b-0">
                    <div class="col-sm-12 text-center">
                    <p>{{trans('auth.back_to_login?')}} <router-link to="/login" class="text-info m-l-5"><b>{{trans('auth.sign_in')}}</b></router-link></p>
                    </div>
                </div>
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
                resetForm: new Form ({
                    email: '',
                    password: '',
                    password_confirmation: '',
                    token: '',
                }),
                isTokenValidated: false
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
            validate(){
                let loader = this.$loading.show();
                axios.post('/api/auth/validate-password-reset',{
                    token: this.resetForm.token,
                    email: this.resetForm.email
                }).then(response => {
                    this.isTokenValidated = true;
                    loader.hide();
                }).catch(error => {
                    helper.showErrorMsg(error);
                    loader.hide();
                });
            },
            submit(e){
                let loader = this.$loading.show();
                this.resetForm.post('/api/auth/reset').then(response =>  {
                    toastr.success(response.message);
                    this.isTokenValidated = false;
                    loader.hide();
                }).catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                });
            }
        },
        computed: {
            getLogo(){
                return helper.getLogo();
            }
        }
    }
</script>
