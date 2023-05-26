<template>
    <form @submit.prevent="proceed" @keydown="visitorLogForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.visitor_name')}}</label>
                    <input class="form-control" type="text" v-model="visitorLogForm.name" name="name" :placeholder="trans('reception.visitor_name')">
                    <show-error :form-name="visitorLogForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div class="radio radio-success m-t-20">
                        <div class="row">
                            <div class="col-6">
                                <input type="radio" value="parent" id="type_parent" v-model="visitorLogForm.type" :checked="visitorLogForm.type == 'parent'" name="type" @click="visitorLogForm.errors.clear('type')">
                                <label for="type_parent">{{trans('reception.visitor_type_parent')}}</label>
                            </div>
                            <div class="col-6">
                                <input type="radio" value="other" id="type_other" v-model="visitorLogForm.type" :checked="visitorLogForm.type == 'other'" name="type" @click="visitorLogForm.errors.clear('type')">
                                <label for="type_other">{{trans('reception.visitor_type_other')}}</label>
                            </div>
                        </div>
                    </div>
                    <show-error :form-name="visitorLogForm" prop-name="type"></show-error>
                </div>
            </div>
            <template v-if="visitorLogForm.type == 'parent'">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.student')}}</label>
                        <v-select label="name" v-model="selected_student" name="student_id" id="student_id" :options="students" :placeholder="trans('student.select_student')" @select="onStudentSelect" @close="visitorLogForm.errors.clear('student_id')" @remove="visitorLogForm.student_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!students.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="visitorLogForm" prop-name="student_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('reception.relation_with_student')}}</label>
                        <input class="form-control" type="text" v-model="visitorLogForm.relation_with_student" name="relation_with_student" :placeholder="trans('reception.relation_with_student')">
                        <show-error :form-name="visitorLogForm" prop-name="relation_with_student"></show-error>
                    </div>
                </div>
            </template>
            <template v-if="visitorLogForm.type == 'other'">
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('reception.visitor_company_name')}}</label>
	                    <input class="form-control" type="text" v-model="visitorLogForm.company_name" name="company_name" :placeholder="trans('reception.visitor_company_name')">
	                    <show-error :form-name="visitorLogForm" prop-name="company_name"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('reception.visitor_contact_number')}}</label>
	                    <input class="form-control" type="text" v-model="visitorLogForm.contact_number" name="contact_number" :placeholder="trans('reception.visitor_contact_number')">
	                    <show-error :form-name="visitorLogForm" prop-name="contact_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('reception.visitor_address')}}</label>
	                    <autosize-textarea v-model="visitorLogForm.address" rows="1" name="addres" :placeholder="trans('reception.visitor_address')"></autosize-textarea>
	                    <show-error :form-name="visitorLogForm" prop-name="address"></show-error>
	                </div>
	            </div>
	        </template>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.visitor_count')}}</label>
	                   <input class="form-control" type="text" v-model="visitorLogForm.visitor_count" name="visitor_count" :placeholder="trans('reception.visitor_count')">
                    <show-error :form-name="visitorLogForm" prop-name="visitor_count"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.visiting_purpose')}}</label>
                    <v-select label="name" v-model="selected_visiting_purpose" name="visiting_purpose_id" id="visiting_purpose_id" :options="visiting_purposes" :placeholder="trans('reception.select_visiting_purpose')" @select="onVisitingPurposeSelect" @close="visitorLogForm.errors.clear('visiting_purpose_id')" @remove="visitorLogForm.visiting_purpose_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!visiting_purposes.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="visitorLogForm" prop-name="visiting_purpose_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.whom_to_meet')}}</label>
                    <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="visitorLogForm.errors.clear('employee_id')" @remove="visitorLogForm.employee_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="visitorLogForm" prop-name="employee_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.date_of_visit')}}</label>
                    <datepicker v-model="visitorLogForm.date_of_visit" :bootstrapStyling="true" @selected="visitorLogForm.errors.clear('date_of_visit')" :placeholder="trans('reception.date_of_visit')"></datepicker>
                    <show-error :form-name="visitorLogForm" prop-name="date_of_visit"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3" v-if="loaded">
                <div class="form-group">
                    <label for="">{{trans('reception.entry_time')}}</label>
                    <timepicker :hour.sync="entry_time.hour" :minute.sync="entry_time.minute" :meridiem.sync="entry_time.meridiem"></timepicker>
                </div>
            </div>
            <div class="col-12 col-sm-3" v-if="uuid">
                <div class="form-group">
                    <label for="">{{trans('reception.exit_time')}}</label>
                    <timepicker :hour.sync="exit_time.hour" :minute.sync="exit_time.minute" :meridiem.sync="exit_time.meridiem"></timepicker>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('reception.visitor_remarks')}}</label>
                    <autosize-textarea v-model="visitorLogForm.remarks" rows="1" name="remarks" :placeholder="trans('reception.visitor_remarks')"></autosize-textarea>
                    <show-error :form-name="visitorLogForm" prop-name="remarks"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/reception/visitor/log" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                visitorLogForm: new Form({
                    name: '',
                    company_name: '',
                    relation_with_student: '',
                    contact_number: '',
                    address: '',
                    type: 'parent',
                    student_id: '',
                    visiting_purpose_id: '',
                    employee_id: '',
                    visitor_count: 1,
                    date_of_visit: '',
                    entry_time: '',
                    exit_time: '',
                    remarks: ''
                }),
                loaded: false,
                entry_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                exit_time: {
                	hour: '',
                	minute: '',
                	meridiem: ''
                },
                visiting_purposes: [],
                selected_visiting_purpose: null,
                students: [],
                selected_student: null,
                employees: [],
                selected_employee: null
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-visitor-log') && !helper.hasPermission('edit-visitor-log')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();

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
                axios.get('/api/visitor/log/pre-requisite')
                    .then(response => {
                        this.visiting_purposes = response.visiting_purposes;
                        this.students = response.students;
                        this.employees = response.employees;
                        this.visitorLogForm.date_of_visit = helper.today();
                        if(!this.uuid)
                            this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            store(){
            	this.visitorLogForm.entry_time = (this.entry_time.hour && this.entry_time.minute) ? helper.formatWithPadding(this.entry_time.hour,2)+':'+helper.formatWithPadding(this.entry_time.minute,2)+' '+this.entry_time.meridiem : '';
                let loader = this.$loading.show();
                this.visitorLogForm.post('/api/visitor/log')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_visiting_purpose = null;
                        this.selected_student = null;
                        this.selected_employee = null;
                        this.entry_time.hour = '';
                        this.entry_time.minute = '';
                        this.entry_time.meridiem = 'am';
                        this.visitorLogForm.type = 'parent';
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
                axios.get('/api/visitor/log/'+this.uuid)
                    .then(response => {
                        this.visitorLogForm.type = response.visitor_log.type;
                        this.visitorLogForm.name = response.visitor_log.name;
                        this.visitorLogForm.company_name = response.visitor_log.company_name;
                        this.visitorLogForm.contact_number = response.visitor_log.contact_number;
                        this.visitorLogForm.address = response.visitor_log.address;
                        this.visitorLogForm.student_id = response.visitor_log.student_id;
                        this.selected_student = response.selected_student;
                        this.visitorLogForm.relation_with_student = response.visitor_log.relation_with_student;
                        this.visitorLogForm.visiting_purpose_id = response.visitor_log.visiting_purpose_id;
                        this.selected_visiting_purpose = response.selected_visiting_purpose;
                        this.visitorLogForm.employee_id = response.visitor_log.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.visitorLogForm.remarks = response.visitor_log.remarks;
                        this.visitorLogForm.date_of_visit = response.visitor_log.date_of_visit;
                        this.entry_time.hour = response.entry_time.hour;
                        this.entry_time.minute = response.entry_time.minute;
                        this.entry_time.meridiem = response.entry_time.meridiem;
                        if (response.visitor_log.exit_time) {
                            this.exit_time.hour = response.exit_time.hour;
                            this.exit_time.minute = response.exit_time.minute;
                            this.exit_time.meridiem = response.exit_time.meridiem;
                        }
                        this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/reception/visitor/log');
                    });
            },
            update(){
            	this.visitorLogForm.entry_time = (this.entry_time.hour && this.entry_time.minute) ? helper.formatWithPadding(this.entry_time.hour,2)+':'+helper.formatWithPadding(this.entry_time.minute,2)+' '+this.entry_time.meridiem : '';
            	this.visitorLogForm.exit_time = (this.exit_time.hour && this.exit_time.minute) ? helper.formatWithPadding(this.exit_time.hour,2)+':'+helper.formatWithPadding(this.exit_time.minute,2)+' '+this.exit_time.meridiem : '';
                let loader = this.$loading.show();
                this.visitorLogForm.patch('/api/visitor/log/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/visitor/log');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onVisitingPurposeSelect(selectedOption){
                return this.visitorLogForm.visiting_purpose_id = selectedOption.id;
            },
            onStudentSelect(selectedOption){
                return this.visitorLogForm.student_id = selectedOption.id;
            },
            onEmployeeSelect(selectedOption){
                return this.visitorLogForm.employee_id = selectedOption.id;
            }
        }
    }
</script>