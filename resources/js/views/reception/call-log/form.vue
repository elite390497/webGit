<template>
    <form @submit.prevent="proceed" @keydown="callLogForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.calling_purpose')}}</label>
                    <v-select label="name" v-model="selected_calling_purpose" name="calling_purpose_id" id="calling_purpose_id" :options="calling_purposes" :placeholder="trans('reception.select_calling_purpose')" @select="onCallingPurposeSelect" @close="callLogForm.errors.clear('calling_purpose_id')" @remove="callLogForm.calling_purpose_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!calling_purposes.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="callLogForm" prop-name="calling_purpose_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.call_type')}}</label>
                    <select v-model="callLogForm.type" class="custom-select col-12" @select="callLogForm.errors.clear('type')">
                      <option value="outgoing">{{trans('reception.call_type_outgoing')}}</option>
                      <option value="incoming">{{trans('reception.call_type_incoming')}}</option>
                    </select>
                    <show-error :form-name="callLogForm" prop-name="type"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.call_log_name')}}</label>
                    <input class="form-control" type="text" v-model="callLogForm.name" name="name" :placeholder="trans('reception.call_log_name')">
                    <show-error :form-name="callLogForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.call_log_incoming_number')}}</label>
                    <input class="form-control" type="text" v-model="callLogForm.incoming_number" name="incoming_number" :placeholder="trans('reception.call_log_incoming_number')">
                    <show-error :form-name="callLogForm" prop-name="incoming_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.call_log_outgoing_number')}}</label>
                    <input class="form-control" type="text" v-model="callLogForm.outgoing_number" name="outgoing_number" :placeholder="trans('reception.call_log_outgoing_number')">
                    <show-error :form-name="callLogForm" prop-name="outgoing_number"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('reception.date')}}</label>
                    <datepicker v-model="callLogForm.date" :bootstrapStyling="true" @selected="callLogForm.errors.clear('date')" :placeholder="trans('reception.date')"></datepicker>
                    <show-error :form-name="callLogForm" prop-name="date"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4" v-if="loaded">
                <div class="form-group">
                    <label for="">{{trans('reception.start_time')}}</label>
                    <timepicker :hour.sync="start_time.hour" :minute.sync="start_time.minute" :meridiem.sync="start_time.meridiem"></timepicker>
                </div>
            </div>
            <div class="col-12 col-sm-4" v-if="loaded">
                <div class="form-group">
                    <label for="">{{trans('reception.end_time')}}</label>
                    <timepicker :hour.sync="end_time.hour" :minute.sync="end_time.minute" :meridiem.sync="end_time.meridiem"></timepicker>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('reception.call_log_description')}}</label>
                    <autosize-textarea v-model="callLogForm.description" rows="1" name="description" :placeholder="trans('reception.call_log_description')"></autosize-textarea>
                    <show-error :form-name="callLogForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/reception/call/log" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                callLogForm: new Form({
                    name: '',
                    incoming_number: '',
                    outgoing_number: '',
                    type: 'outgoing',
                    calling_purpose_id: '',
                    date: '',
                    start_time: '',
                    end_time: '',
                    description: ''
                }),
                loaded: false,
                start_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                end_time: {
                	hour: '',
                	minute: '',
                	meridiem: 'am'
                },
                calling_purposes: [],
                selected_calling_purpose: null
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-call-log') && !helper.hasPermission('edit-call-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            timePadding(time){
                return helper.formatWithPadding(time,2);
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/call/log/pre-requisite')
                    .then(response => {
                        this.calling_purposes = response.calling_purposes;
                        this.callLogForm.date = helper.today();
                        if(!this.uuid)
                            this.loaded = true;

                        if(this.uuid)
                            this.get();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            store(){
            	this.callLogForm.start_time = (this.start_time.hour && this.start_time.minute) ? helper.formatWithPadding(this.start_time.hour,2)+':'+helper.formatWithPadding(this.start_time.minute,2)+' '+this.start_time.meridiem : '';
                this.callLogForm.end_time = (this.end_time.hour && this.end_time.minute) ? helper.formatWithPadding(this.end_time.hour,2)+':'+helper.formatWithPadding(this.end_time.minute,2)+' '+this.end_time.meridiem : '';
                let loader = this.$loading.show();
                this.callLogForm.post('/api/call/log')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_calling_purpose = null;
                        this.start_time.hour = '';
                        this.start_time.minute = '';
                        this.start_time.meridiem = 'am';
                        this.end_time.hour = '';
                        this.end_time.minute = '';
                        this.end_time.meridiem = 'am';
                        this.callLogForm.type = 'outgoing';
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
                axios.get('/api/call/log/'+this.uuid)
                    .then(response => {
                        this.callLogForm.type = response.call_log.type;
                        this.callLogForm.name = response.call_log.name;
                        this.callLogForm.incoming_number = response.call_log.incoming_number;
                        this.callLogForm.outgoing_number = response.call_log.outgoing_number;
                        this.callLogForm.calling_purpose_id = response.call_log.calling_purpose_id;
                        this.selected_calling_purpose = response.selected_calling_purpose;
                        this.callLogForm.description = response.call_log.description;
                        this.callLogForm.date = response.call_log.date;
                        this.start_time.hour = response.start_time.hour;
                        this.start_time.minute = response.start_time.minute;
                        this.start_time.meridiem = response.start_time.meridiem;
                        if (response.call_log.end_time) {
                            this.end_time.hour = response.end_time.hour;
                            this.end_time.minute = response.end_time.minute;
                            this.end_time.meridiem = response.end_time.meridiem;
                        }
                        this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/reception/call/log');
                    });
            },
            update(){
            	this.callLogForm.start_time = (this.start_time.hour && this.start_time.minute) ? helper.formatWithPadding(this.start_time.hour,2)+':'+helper.formatWithPadding(this.start_time.minute,2)+' '+this.start_time.meridiem : '';
            	this.callLogForm.end_time = (this.end_time.hour && this.end_time.minute) ? helper.formatWithPadding(this.end_time.hour,2)+':'+helper.formatWithPadding(this.end_time.minute,2)+' '+this.end_time.meridiem : '';
                let loader = this.$loading.show();
                this.callLogForm.patch('/api/call/log/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/call/log');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCallingPurposeSelect(selectedOption){
                return this.callLogForm.calling_purpose_id = selectedOption.id;
            }
        }
    }
</script>