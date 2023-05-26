<template>
    <form @submit.prevent="proceed" @keydown="postalRecordForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_type')}}</label>
                    <select v-model="postalRecordForm.type" class="custom-select col-12" @select="postalRecordForm.errors.clear('type')">
                      <option value="dispatch">{{trans('reception.postal_record_dispatch')}}</option>
                      <option value="receive">{{trans('reception.postal_record_receive')}}</option>
                    </select>
                    <show-error :form-name="postalRecordForm" prop-name="type"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_reference_number')}}</label>
                    <input class="form-control" type="text" v-model="postalRecordForm.reference_number" name="reference_number" :placeholder="trans('reception.postal_record_reference_number')">
                    <show-error :form-name="postalRecordForm" prop-name="reference_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <switches class="m-l-20" v-model="postalRecordForm.is_confidential" theme="bootstrap" color="success"></switches> {{trans('reception.postal_record_confidential')}}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_sender_title')}}</label>
                    <input class="form-control" type="text" v-model="postalRecordForm.sender_title" name="sender_title" :placeholder="trans('reception.postal_record_sender_title')">
                    <show-error :form-name="postalRecordForm" prop-name="sender_title"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_sender_address')}}</label>
                    <autosize-textarea v-model="postalRecordForm.sender_address" rows="1" name="sender_address" :placeholder="trans('reception.postal_record_sender_address')"></autosize-textarea>
                    <show-error :form-name="postalRecordForm" prop-name="sender_address"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_receiver_title')}}</label>
                    <input class="form-control" type="text" v-model="postalRecordForm.receiver_title" name="receiver_title" :placeholder="trans('reception.postal_record_receiver_title')">
                    <show-error :form-name="postalRecordForm" prop-name="receiver_title"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_receiver_address')}}</label>
                    <autosize-textarea v-model="postalRecordForm.receiver_address" rows="1" name="receiver_address" :placeholder="trans('reception.postal_record_receiver_address')"></autosize-textarea>
                    <show-error :form-name="postalRecordForm" prop-name="receiver_address"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_date')}}</label>
                    <datepicker v-model="postalRecordForm.date" :bootstrapStyling="true" @selected="postalRecordForm.errors.clear('date')" :placeholder="trans('reception.date')"></datepicker>
                    <show-error :form-name="postalRecordForm" prop-name="date"></show-error>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('reception.postal_record_description')}}</label>
                    <autosize-textarea v-model="postalRecordForm.description" rows="1" name="description" :placeholder="trans('reception.postal_record_description')"></autosize-textarea>
                    <show-error :form-name="postalRecordForm" prop-name="description"></show-error>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <file-upload-input :button-text="trans('general.upload_document')" :token="postalRecordForm.upload_token" module="postal_record" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/reception/postal/record" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
            <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="uuid">{{trans('general.update')}}</span>
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
                postalRecordForm: new Form({
                    reference_number: '',
                    sender_title: '',
                    sender_address: '',
                    receiver_title: '',
                    receiver_address: '',
                    type: 'dispatch',
                    date: '',
                    is_confidential: 0,
                    description: '',
                    upload_token: ''
                }),
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-postal-record') && !helper.hasPermission('edit-postal-record')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else {
                this.postalRecordForm.date = helper.today();
                this.postalRecordForm.upload_token = this.$uuid.v4();
            }

            // this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/postal/record/pre-requisite')
                    .then(response => {
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            store(){
                let loader = this.$loading.show();
                this.postalRecordForm.post('/api/postal/record')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.postalRecordForm.upload_token = this.$uuid.v4();
                        this.postalRecordForm.type = 'dispatch';
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
                axios.get('/api/postal/record/'+this.uuid)
                    .then(response => {
                        this.postalRecordForm.upload_token = response.postal_record.upload_token;
                        this.postalRecordForm.type = response.postal_record.type;
                        this.postalRecordForm.reference_number = response.postal_record.reference_number;
                        this.postalRecordForm.sender_title = response.postal_record.sender_title;
                        this.postalRecordForm.sender_address = response.postal_record.sender_address;
                        this.postalRecordForm.receiver_title = response.postal_record.receiver_title;
                        this.postalRecordForm.receiver_address = response.postal_record.receiver_address;
                        this.postalRecordForm.description = response.postal_record.description;
                        this.postalRecordForm.is_confidential = response.postal_record.is_confidential;
                        this.postalRecordForm.date = response.postal_record.date;
                        this.module_id = response.postal_record.id;
                        this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/reception/postal/record');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.postalRecordForm.patch('/api/postal/record/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/postal/record');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>