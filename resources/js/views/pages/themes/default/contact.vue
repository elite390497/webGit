<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>
        </div>

        <div class="fix-width fix-width-mobile p-t-80">
            <div class="row">
                <div class="col-12 col-md-7">
                    <form @submit.prevent="submit" @keydown="contactForm.errors.clear($event.target.name)">
                        <div class="form-group">
                            <label for="">{{trans('frontend.contact_name')}}</label>
                            <input class="form-control" type="text" v-model="contactForm.name" name="name" :placeholder="trans('frontend.contact_name')">
                            <show-error :form-name="contactForm" prop-name="name"></show-error>
                        </div>
                        <div class="row">
                            <div class="col-12 div col-lg-6">
                                <div class="form-group">
                                    <label for="">{{trans('frontend.contact_email')}}</label>
                                    <input class="form-control" type="text" v-model="contactForm.email" name="email" :placeholder="trans('frontend.contact_email')">
                                    <show-error :form-name="contactForm" prop-name="email"></show-error>
                                </div>
                            </div>
                            <div class="col-12 div col-lg-6">
                                <div class="form-group">
                                    <label for="">{{trans('frontend.contact_number')}}</label>
                                    <input class="form-control" type="text" v-model="contactForm.contact_number" name="contact_number" :placeholder="trans('frontend.contact_number')">
                                    <show-error :form-name="contactForm" prop-name="contact_number"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('frontend.contact_subject')}}</label>
                            <input class="form-control" type="text" v-model="contactForm.subject" name="subject" :placeholder="trans('frontend.contact_subject')">
                            <show-error :form-name="contactForm" prop-name="subject"></show-error>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('frontend.contact_message')}}</label>
                            <autosize-textarea rows="5" class="form-control" v-model="contactForm.message" :placeholder="trans('frontend.contact_message')" name="message"></autosize-textarea>
                            <show-error :form-name="contactForm" prop-name="message"></show-error>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-info btn-lg waves-effect waves-light m-t-10">{{trans('general.submit')}}</button>
                        </div>
                    </form>
                </div>

                <div class="col-12 col-md-1"></div>

                <div class="col-12 col-md-4">
                    <h3 class="m-b-20 p-b-20 border-bottom"> {{ trans('configuration.contact_information') }} </h3>
                    
                    <h4 class="m-b-10"> {{ getConfig('institute_name') }} </h4>
                    <div class="contact-info-box">
                        <p>
                            <i class="fas fa-map-marker-alt m-r-5"></i>
                            <span>{{ getConfig('address_line_1') }}</span>
                            <span v-if="getConfig('address_line_2')" class="comma">{{ getConfig('address_line_2') }}</span>
                            <span v-if="getConfig('city')" class="comma">{{ getConfig('city') }}</span>
                            <span v-if="getConfig('state')" class="comma">{{ getConfig('state') }}</span>
                            <span v-if="getConfig('zipcode')" class="comma">{{ getConfig('zipcode') }}</span>
                            <span v-if="getConfig('country')" class="d-block">{{ getConfig('country') }}</span>
                        </p>
                        <p>
                            <i class="fas fa-phone m-r-5"></i>
                            {{ getConfig('phone') }}
                        </p>
                        <p>
                            <i class="fas fa-envelope m-r-5"></i>
                            {{ getConfig('email') }}
                        </p>
                        <p>
                            <i class="fas fa-globe m-r-5"></i>
                            {{ getConfig('website') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data(){
            return {
                page: {},
                contactForm: new Form({
                    name: '',
                    email: '',
                    contact_number: '',
                    subject: '',
                    message: '',
                })
            }
        },
        mounted(){
            this.getData()
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/contact/content')
                    .then(response => {
                        this.page = response.page;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            submit(){
                let loader = this.$loading.show();
                this.contactForm.post('/api/frontend/contact')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
    }
</script>

<style lang="scss">
    .contact-info-box {
        .comma:before {
            content: ", "
        }    
    }
</style>