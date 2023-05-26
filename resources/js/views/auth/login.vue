<template>
    <section id="wrapper">
        <div class="login-register guest-page">
            <div class="login-box card guest-box">
                <div class="card-body p-4">
                    <img :src="getLogo" class="org-logo" />
                    <form class="form-horizontal form-material" id="loginform" @submit.prevent="process" @keydown="loginForm.errors.clear($event.target.name)">
                        <h3 class="box-title m-t-20 m-b-10">{{trans('auth.login')}}</h3>
                        <div v-if="! login_with_otp">
                            <div class="form-group ">
                                <input type="text" name="email_or_username" class="form-control" :placeholder="trans('auth.email_or_username')" v-model="loginForm.email_or_username">
                                <show-error :form-name="loginForm" prop-name="email_or_username"></show-error>
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" class="form-control" :placeholder="trans('auth.password')" v-model="loginForm.password">
                                <show-error :form-name="loginForm" prop-name="password"></show-error>
                            </div>
                        </div>
                        <div v-else>
                            <div class="form-group">
                                <input type="text" name="mobile" class="form-control" :placeholder="trans('auth.mobile')" v-model="loginForm.mobile" v-if="!otp_generated">
                                <label v-if="otp_generated">{{loginForm.mobile}}</label>
                                <show-error :form-name="loginForm" prop-name="mobile"></show-error>
                            </div>
                            <div class="form-group" v-if="otp_generated">
                                <input type="text" name="otp" class="form-control" :placeholder="trans('auth.otp')" v-model="loginForm.otp">
                                <show-error :form-name="loginForm" prop-name="otp"></show-error>
                            </div>
                        </div>
                        <div class="g-recaptcha" v-if="getConfig('recaptcha') && getConfig('login_recaptcha')" :data-sitekey="getConfig('recaptcha_key')"></div>
                        <div class="form-group text-center m-t-20">
                            <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">{{trans('auth.sign_in')}}</button>
                        </div>
                        <div class="form-group m-b-0">
                            <div class="col-sm-12 text-center">
                                <p v-if="getConfig('reset_password')">{{trans('auth.forgot_your_password?')}} <router-link to="/password" class="text-info m-l-5"><b>{{trans('auth.reset_here!')}}</b></router-link></p>
                            </div>
                            <template v-if="getConfig('login_with_otp')">
                                <div class="col-sm-12 text-center" v-if="!login_with_otp">
                                    <p><a href="#" @click="otpLogin(true)">{{trans('auth.login_with_otp')}}</a></p>
                                </div>
                                <div class="col-sm-12 text-center" v-if="login_with_otp">
                                    <p><a href="#" @click="otpLogin(false)">{{trans('auth.login_with_password')}}</a></p>
                                </div>
                            </template>
                        </div>
                        <div class="row m-t-10 justify-content-center" v-if="!getConfig('mode')">
                            <div class="col-6 text-center">
                                <button type="button" class="btn btn-success text-uppercase btn-block dropup" href="#" role="button" id="loginAs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Auto Login As <i class="fas fa-chevron-up m-l-5"></i>
                                </button>
                                <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="loginAs">
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('admin')">
                                        Admin Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('manager')">
                                        Manager Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('principal')">
                                        Principal Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('staff')">
                                        Staff Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('accountant')">
                                        Accountant Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('librarian')">
                                        Librarian Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('student')">
                                        Student Role
                                    </button>
                                    <button type="button" style="cursor:pointer;" class="dropdown-item" @click="loginAs('parent')">
                                        Parent Role
                                    </button>
                                </div>
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
                loginForm: new Form({
                    email_or_username: '',
                    password: '',
                    mobile: '',
                    otp: ''
                }, false),
                login_with_otp: false,
                otp_generated: false
            }
        },
        components: {
            guestFooter
        },
        mounted(){
            helper.showDemoNotification(['login','login_with_different_role']);
        },
        methods: {
            otpLogin(status){
                this.login_with_otp = status;
            },
            process(){
                if (this.login_with_otp) {
                    if (!this.otp_generated)
                        this.submitOTP();
                    else
                        this.processOTP();
                } else {
                    this.submit();
                }
            },
            submitOTP(){
                let loader = this.$loading.show();
                this.loginForm.post('/api/auth/login/otp')
                    .then(response =>  {
                        this.otp_generated = true;
                        toastr.success(response.message);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            processOTP(){
                let loader = this.$loading.show();
                this.loginForm.post('/api/auth/login/otp')
                    .then(response =>  {
                        this.$cookie.set('auth_token',response.token,1);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
                        this.$store.dispatch('setConfig',response.config);
                        this.$store.dispatch('setAuthUserDetail',{
                            id: response.user.id,
                            email: response.user.email,
                            name: response.user.name,
                            username: response.user.username,
                            roles: response.user.user_roles,
                            permissions: response.user.user_permissions,
                            two_factor_code: response.user.two_factor_code,
                            color_theme: response.user.user_preference.color_theme || this.getConfig('color_theme'),
                            locale: response.user.user_preference.locale || this.getConfig('locale'),
                            direction: response.user.user_preference.direction || this.getConfig('direction'),
                            sidebar: response.user.user_preference.sidebar || this.getConfig('sidebar')
                        });
                        this.$store.dispatch('setAcademicSession',response.academic_sessions);
                        this.$store.dispatch('setDefaultAcademicSession',response.default_academic_session);
                        
                        toastr.success(response.message);
                        var redirect_path = response.reload ? '/dashboard?reload=1' : '/dashboard';

                        let role = response.user.roles.find(o => o.name == 'admin');
                        if(role && helper.getConfig('setup_wizard'))
                            redirect_path = '/setup';

                        this.$router.push(redirect_path);
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            submit(){
                let loader = this.$loading.show();
                this.loginForm.post('/api/auth/login')
                    .then(response =>  {
                        this.$cookie.set('auth_token',response.token,1);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
                        this.$store.dispatch('setConfig',response.config);
                        this.$store.dispatch('setAuthUserDetail',{
                            id: response.user.id,
                            email: response.user.email,
                            name: response.user.name,
                            username: response.user.username,
                            roles: response.user.user_roles,
                            permissions: response.user.user_permissions,
                            two_factor_code: response.user.two_factor_code,
                            color_theme: response.user.user_preference.color_theme || this.getConfig('color_theme'),
                            locale: response.user.user_preference.locale || this.getConfig('locale'),
                            direction: response.user.user_preference.direction || this.getConfig('direction'),
                            sidebar: response.user.user_preference.sidebar || this.getConfig('sidebar')
                        });
                        this.$store.dispatch('setAcademicSession',response.academic_sessions);
                        this.$store.dispatch('setDefaultAcademicSession',response.default_academic_session);
                        
                        toastr.success(response.message);

                        if(helper.getConfig('two_factor_security')){
                            this.$router.push('/auth/security');
                        }
                        else {
                            var redirect_path = response.reload ? '/dashboard?reload=1' : '/dashboard';

                            let role = response.user.roles.find(o => o.name == 'admin');
                            if(role && helper.getConfig('setup_wizard'))
                                redirect_path = '/setup';

                            this.$store.dispatch('resetTwoFactorCode');
                            this.$router.push(redirect_path);
                        }
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            loginAs(role){
                this.loginForm.email_or_username = role+'@'+role+'.com';
                this.loginForm.password = 'password';
                this.submit();
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
