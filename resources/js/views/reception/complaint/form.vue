<template>
    <form @submit.prevent="proceed" @keydown="complaintForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_type')}}</label>
                    <v-select label="name" v-model="selected_complaint_type" name="complaint_type_id" id="complaint_type_id" :options="complaint_types" :placeholder="trans('reception.select_complaint_type')" @select="onComplaintTypeSelect" @close="complaintForm.errors.clear('complaint_type_id')" @remove="complaintForm.complaint_type_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!complaint_types.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="complaintForm" prop-name="complaint_type_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('reception.date_of_complaint')}}</label>
                    <datepicker v-model="complaintForm.date_of_complaint" :bootstrapStyling="true" @selected="complaintForm.errors.clear('date_of_complaint')" :placeholder="trans('reception.date_of_complaint')"></datepicker>
                    <show-error :form-name="complaintForm" prop-name="date_of_complaint"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.complainant_name')}}</label>
                    <input class="form-control" type="text" v-model="complaintForm.complainant_name" name="complainant_name" :placeholder="trans('reception.complainant_name')">
                    <show-error :form-name="complaintForm" prop-name="complainant_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.complainant_contact_number')}}</label>
                    <input class="form-control" type="text" v-model="complaintForm.complainant_contact_number" name="complainant_contact_number" :placeholder="trans('reception.complainant_contact_number')">
                    <show-error :form-name="complaintForm" prop-name="complainant_contact_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.complainant_address')}}</label>
                    <autosize-textarea v-model="complaintForm.complainant_address" rows="1" name="complainant_address" :placeholder="trans('reception.complainant_address')"></autosize-textarea>
                    <show-error :form-name="complaintForm" prop-name="complainant_address"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_description')}}</label>
                    <autosize-textarea v-model="complaintForm.description" rows="3" name="description" :placeholder="trans('reception.complaint_description')"></autosize-textarea>
                    <show-error :form-name="complaintForm" prop-name="description"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_assign_to')}}</label>
                    <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="complaintForm.errors.clear('employee_id')" @remove="complaintForm.employee_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="complaintForm" prop-name="employee_id"></show-error>
                </div>
            </div>
        </div>
        <div class="row" v-if="is_actionable">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.date_of_resolution')}}</label>
                    <datepicker v-model="complaintForm.date_of_resolution" :bootstrapStyling="true" @selected="complaintForm.errors.clear('date_of_resolution')" :placeholder="trans('reception.date_of_resolution')"></datepicker>
                    <show-error :form-name="complaintForm" prop-name="date_of_resolution"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-9">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_action')}}</label>
                    <autosize-textarea v-model="complaintForm.action" rows="2" name="action" :placeholder="trans('reception.complaint_action')"></autosize-textarea>
                    <show-error :form-name="complaintForm" prop-name="action"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <file-upload-input :button-text="trans('general.upload_document')" :token="complaintForm.upload_token" module="complaint" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/reception/complaint" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                complaintForm: new Form({
                    complainant_name: '',
                    complainant_address: '',
                    complainant_contact_number: '',
                    complaint_type_id: '',
                    employee_id: '',
                    date_of_complaint: '',
                    date_of_resolution: '',
                    action: '',
                    description: '',
                    upload_token: ''
                }),
                is_actionable: false,
                employees: [],
                selected_employee: null,
                complaint_types: [],
                selected_complaint_type: null,
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-complaint') && !helper.hasPermission('edit-complaint')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else {
                this.complaintForm.date_of_complaint = helper.today();
                this.complaintForm.upload_token = this.$uuid.v4();
            }

            this.getPreRequisite();
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
                axios.get('/api/complaint/pre-requisite')
                    .then(response => {
                        this.complaint_types = response.complaint_types;
                        this.employees = response.employees;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            store(){
                let loader = this.$loading.show();
                this.complaintForm.post('/api/complaint')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.complaintForm.upload_token = this.$uuid.v4();
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
                axios.get('/api/complaint/'+this.uuid)
                    .then(response => {
                        this.complaintForm.upload_token = response.complaint.upload_token;
                        this.complaintForm.complainant_name = response.complaint.complainant_name;
                        this.complaintForm.complainant_contact_number = response.complaint.complainant_contact_number;
                        this.complaintForm.complainant_address = response.complaint.complainant_address;
                        this.complaintForm.description = response.complaint.description;
                        this.complaintForm.date_of_complaint = response.complaint.date_of_complaint;
                        this.complaintForm.date_of_resolution = response.complaint.date_of_resolution;
                        this.complaintForm.employee_id = response.complaint.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.complaintForm.complaint_type_id = response.complaint.complaint_type_id;
                        this.selected_complaint_type = response.selected_complaint_type;
                        this.is_actionable = response.is_actionable;
                        this.module_id = response.complaint.id;
                        this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        // loader.hide();
                        // helper.showErrorMsg(error);
                        // this.$router.push('/reception/complaint');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.complaintForm.patch('/api/complaint/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/complaint');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onComplaintTypeSelect(selectedOption){
                return this.complaintForm.complaint_type_id = selectedOption.id;
            },
            onEmployeeSelect(selectedOption){
                return this.complaintForm.employee_id = selectedOption.id;
            }
        }
    }
</script>