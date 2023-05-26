<template>
	<div>
        <form @submit.prevent="proceed" @keydown="vendorForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_name')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.name" name="name" :placeholder="trans('inventory.vendor_name')">
                        <show-error :form-name="vendorForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_phone')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.phone" name="phone" :placeholder="trans('inventory.vendor_phone')">
                        <show-error :form-name="vendorForm" prop-name="phone"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_alternate_phone')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.alternate_phone" name="alternate_phone" :placeholder="trans('inventory.vendor_alternate_phone')">
                        <show-error :form-name="vendorForm" prop-name="alternate_phone"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_email')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.email" name="email" :placeholder="trans('inventory.vendor_email')">
                        <show-error :form-name="vendorForm" prop-name="email"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_tax_id')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.tax_id" name="tax_id" :placeholder="trans('inventory.vendor_tax_id')">
                        <show-error :form-name="vendorForm" prop-name="tax_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_contact_person')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.contact_person" name="contact_person" :placeholder="trans('inventory.vendor_contact_person')">
                        <show-error :form-name="vendorForm" prop-name="contact_person"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_contact_person_phone')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.contact_person_phone" name="contact_person_phone" :placeholder="trans('inventory.vendor_contact_person_phone')">
                        <show-error :form-name="vendorForm" prop-name="contact_person_phone"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_contact_person_email')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.contact_person_email" name="contact_person_email" :placeholder="trans('inventory.vendor_contact_person_email')">
                        <show-error :form-name="vendorForm" prop-name="contact_person_email"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_address_line_1')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.address_line_1" name="address_line_1" :placeholder="trans('inventory.vendor_address_line_1')">
                        <show-error :form-name="vendorForm" prop-name="address_line_1"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_address_line_2')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.address_line_2" name="address_line_2" :placeholder="trans('inventory.vendor_address_line_2')">
                        <show-error :form-name="vendorForm" prop-name="address_line_2"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_city')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.city" name="city" :placeholder="trans('inventory.vendor_city')">
                        <show-error :form-name="vendorForm" prop-name="city"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_state')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.state" name="state" :placeholder="trans('inventory.vendor_state')">
                        <show-error :form-name="vendorForm" prop-name="state"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_zipcode')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.zipcode" name="zipcode" :placeholder="trans('inventory.vendor_zipcode')">
                        <show-error :form-name="vendorForm" prop-name="zipcode"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor_country')}}</label>
                        <input class="form-control" type="text" v-model="vendorForm.country" name="country" :placeholder="trans('inventory.vendor_country')">
                        <show-error :form-name="vendorForm" prop-name="country"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/inventory/vendor" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>

    export default {
        components:{},
        props: ['id'],
        data() {
            return {
                vendorForm: new Form({
                    name : '',
                    phone : '',
                    alternate_phone : '',
                    email : '',
                    tax_id : '',
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
        mounted() {
            if (this.id)
                this.getVendor();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateVendor();
                else
                    this.storeVendor();
            },
            storeVendor(){
                let loader = this.$loading.show();

                this.vendorForm.post('/api/vendor')
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
            getVendor(){
                let loader = this.$loading.show();
                axios.get('/api/vendor/'+this.id)
                    .then(response => {
                        this.vendorForm.name = response.name;
                        this.vendorForm.phone = response.phone;
                        this.vendorForm.alternate_phone = response.alternate_phone;
                        this.vendorForm.email = response.email;
                        this.vendorForm.tax_id = response.tax_id;
                        this.vendorForm.contact_person = response.contact_person;
                        this.vendorForm.contact_person_phone = response.contact_person_phone;
                        this.vendorForm.contact_person_email = response.contact_person_email;
                        this.vendorForm.address_line_1 = response.address_line_1;
                        this.vendorForm.address_line_2 = response.address_line_2;
                        this.vendorForm.city = response.city;
                        this.vendorForm.state = response.state;
                        this.vendorForm.zipcode = response.zipcode;
                        this.vendorForm.country = response.country;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/inventory/vendor');
                    });
            },
            updateVendor(){
                let loader = this.$loading.show();
                this.vendorForm.patch('/api/vendor/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/inventory/vendor');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>