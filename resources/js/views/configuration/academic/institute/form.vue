<template>
    <form @submit.prevent="proceed" @keydown="instituteForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_name')}}</label>
                    <input class="form-control" type="text" v-model="instituteForm.name" name="name" :placeholder="trans('academic.institute_name')">
                    <show-error :form-name="instituteForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_contact_number')}}</label>
                    <input class="form-control" type="text" v-model="instituteForm.contact_number" name="contact_number" :placeholder="trans('academic.institute_contact_number')">
                    <show-error :form-name="instituteForm" prop-name="contact_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_alternate_contact_number')}}</label>
                    <input class="form-control" type="text" v-model="instituteForm.alternate_contact_number" name="alternate_contact_number" :placeholder="trans('academic.institute_alternate_contact_number')">
                    <show-error :form-name="instituteForm" prop-name="alternate_contact_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_principal_name')}}</label>
                    <input class="form-control" type="text" v-model="instituteForm.principal_name" name="principal_name" :placeholder="trans('academic.institute_principal_name')">
                    <show-error :form-name="instituteForm" prop-name="principal_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_website')}}</label>
                    <input class="form-control" type="text" v-model="instituteForm.website" name="website" :placeholder="trans('academic.institute_website')">
                    <show-error :form-name="instituteForm" prop-name="website"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_address')}}</label>
                    <autosize-textarea v-model="instituteForm.address" rows="1" name="address" :placeholder="trans('academic.institute_address')"></autosize-textarea>
                    <show-error :form-name="instituteForm" prop-name="address"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('academic.institute_remarks')}}</label>
                    <autosize-textarea v-model="instituteForm.remarks" rows="1" name="remarks" :placeholder="trans('academic.institute_remarks')"></autosize-textarea>
                    <show-error :form-name="instituteForm" prop-name="remarks"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/academic/institute" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                instituteForm: new Form({
                    name : '',
                    contact_number: '',
                    alternate_contact_number: '',
                    principal_name: '',
                    website: '',
                    address: '',
                    remarks : ''
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
                this.instituteForm.post('/api/academic/institute')
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
                axios.get('/api/academic/institute/'+this.id)
                    .then(response => {
                        this.instituteForm.name = response.name;
                        this.instituteForm.contact_number = response.contact_number;
                        this.instituteForm.alternate_contact_number = response.alternate_contact_number;
                        this.instituteForm.principal_name = response.principal_name;
                        this.instituteForm.website = response.website;
                        this.instituteForm.address = response.address;
                        this.instituteForm.remarks = response.remarks;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/academic/institute');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.instituteForm.patch('/api/academic/institute/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/academic/institute');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
