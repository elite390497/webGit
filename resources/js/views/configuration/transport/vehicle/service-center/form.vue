<template>
    <form @submit.prevent="proceed" @keydown="serviceCenterForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_name')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.name" name="name" :placeholder="trans('transport.vehicle_service_center_name')">
                    <show-error :form-name="serviceCenterForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_phone')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.phone" name="phone" :placeholder="trans('transport.vehicle_service_center_phone')">
                    <show-error :form-name="serviceCenterForm" prop-name="phone"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_email')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.email" name="email" :placeholder="trans('transport.vehicle_service_center_email')">
                    <show-error :form-name="serviceCenterForm" prop-name="email"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_contact_person')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.contact_person" name="contact_person" :placeholder="trans('transport.vehicle_service_center_contact_person')">
                    <show-error :form-name="serviceCenterForm" prop-name="contact_person"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_contact_person_phone')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.contact_person_phone" name="contact_person_phone" :placeholder="trans('transport.vehicle_service_center_contact_person_phone')">
                    <show-error :form-name="serviceCenterForm" prop-name="contact_person_phone"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_contact_person_email')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.contact_person_email" name="contact_person_email" :placeholder="trans('transport.vehicle_service_center_contact_person_email')">
                    <show-error :form-name="serviceCenterForm" prop-name="contact_person_email"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_address_line_1')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.address_line_1" name="address_line_1" :placeholder="trans('transport.vehicle_service_center_address_line_1')">
                    <show-error :form-name="serviceCenterForm" prop-name="address_line_1"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_address_line_2')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.address_line_2" name="address_line_2" :placeholder="trans('transport.vehicle_service_center_address_line_2')">
                    <show-error :form-name="serviceCenterForm" prop-name="address_line_2"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_city')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.city" name="city" :placeholder="trans('transport.vehicle_service_center_city')">
                    <show-error :form-name="serviceCenterForm" prop-name="city"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_state')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.state" name="state" :placeholder="trans('transport.vehicle_service_center_state')">
                    <show-error :form-name="serviceCenterForm" prop-name="state"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_zipcode')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.zipcode" name="zipcode" :placeholder="trans('transport.vehicle_service_center_zipcode')">
                    <show-error :form-name="serviceCenterForm" prop-name="zipcode"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_service_center_country')}}</label>
                    <input class="form-control" type="text" v-model="serviceCenterForm.country" name="country" :placeholder="trans('transport.vehicle_service_center_country')">
                    <show-error :form-name="serviceCenterForm" prop-name="country"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/transport/vehicle/service/center" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        data() {
            return {
                serviceCenterForm: new Form({
                    name : '',
                    phone : '',
                    email : '',
                    contact_person : '',
                    contact_person_phone : '',
                    contact_person_email : '',
                    address_line_1 : '',
                    address_line_2 : '',
                    city : '',
                    state : '',
                    zipcode : '',
                    country : ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.serviceCenterForm.post('/api/transport/vehicle/service/center')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/transport/vehicle/service/center/'+this.id)
                    .then(response => {
                        this.serviceCenterForm.name = response.name;
                        this.serviceCenterForm.phone = response.phone;
                        this.serviceCenterForm.email = response.email;
                        this.serviceCenterForm.contact_person = response.contact_person;
                        this.serviceCenterForm.contact_person_phone = response.contact_person_phone;
                        this.serviceCenterForm.contact_person_email = response.contact_person_email;
                        this.serviceCenterForm.address_line_1 = response.address_line_1;
                        this.serviceCenterForm.address_line_2 = response.address_line_2;
                        this.serviceCenterForm.city = response.city;
                        this.serviceCenterForm.state = response.state;
                        this.serviceCenterForm.zipcode = response.zipcode;
                        this.serviceCenterForm.country = response.country;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/transport/vehicle/service/center');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.serviceCenterForm.patch('/api/transport/vehicle/service/center/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/transport/vehicle/service/center');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
