<template>
    <form @submit.prevent="proceed" @keydown="documentTypeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_document_type_name')}}</label>
                    <input class="form-control" type="text" v-model="documentTypeForm.name" name="name" :placeholder="trans('transport.vehicle_document_type_name')">
                    <show-error :form-name="documentTypeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('transport.vehicle_document_type_description')}}</label>
                    <input class="form-control" type="text" v-model="documentTypeForm.description" name="description" :placeholder="trans('transport.vehicle_document_type_description')">
                    <show-error :form-name="documentTypeForm" prop-name="description"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <div for="">{{trans('transport.has_expiry_date')}}</div>
                    <switches class="m-t-10" v-model="documentTypeForm.has_expiry_date" theme="bootstrap" color="success"></switches>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <div for="">{{trans('transport.is_insurance_document')}}</div>
                    <switches class="m-t-10" v-model="documentTypeForm.is_insurance_document" theme="bootstrap" color="success"></switches>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/transport/vehicle/document/type" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
        components: {},
        data() {
            return {
                documentTypeForm: new Form({
                    name : '',
                    has_expiry_date: false,
                    is_insurance_document: false,
                    description : ''
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
                this.documentTypeForm.post('/api/transport/vehicle/document/type')
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
                axios.get('/api/transport/vehicle/document/type/'+this.id)
                    .then(response => {
                        this.documentTypeForm.name = response.name;
                        this.documentTypeForm.has_expiry_date = response.has_expiry_date;
                        this.documentTypeForm.is_insurance_document = response.is_insurance_document;
                        this.documentTypeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/transport/vehicle/document/type');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.documentTypeForm.patch('/api/transport/vehicle/document/type/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/transport/vehicle/document/type');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
