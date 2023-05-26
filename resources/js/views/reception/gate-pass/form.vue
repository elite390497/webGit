<template>
    <form @submit.prevent="proceed" @keydown="gatePassForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('reception.gate_pass_type')}}</label>
                    <select v-model="gatePassForm.type" class="custom-select col-12" @select="gatePassForm.errors.clear('type')">
                      <option value="student">{{trans('student.student')}}</option>
                      <option value="employee">{{trans('employee.employee')}}</option>
                    </select>
                    <show-error :form-name="gatePassForm" prop-name="type"></show-error>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('reception.gate_pass_date')}}</label>
                    <datepicker v-model="gatePassForm.date" :bootstrapStyling="true" @selected="gatePassForm.errors.clear('date')" :placeholder="trans('reception.gate_pass_date')"></datepicker>
                    <show-error :form-name="gatePassForm" prop-name="date"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4" v-if="loaded">
                <div class="form-group">
                    <label for="">{{trans('reception.gate_pass_time')}}</label>
                    <timepicker :hour.sync="time.hour" :minute.sync="time.minute" :meridiem.sync="time.meridiem"></timepicker>
                </div>
            </div>
            <div class="col-12 col-sm-3" v-if="gatePassForm.type == 'student'">
                <div class="form-group">
                    <label for="">{{trans('student.student')}}</label>
                    <v-select label="name" v-model="selected_student" name="student_id" id="student_id" :options="students" :placeholder="trans('student.select_student')" @select="onStudentSelect" @close="gatePassForm.errors.clear('student_id')" @remove="gatePassForm.student_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!students.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="gatePassForm" prop-name="student_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3" v-if="gatePassForm.type == 'employee'">
                <div class="form-group">
                    <label for="">{{trans('employee.employee')}}</label>
                    <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="gatePassForm.errors.clear('employee_id')" @remove="gatePassForm.employee_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="gatePassForm" prop-name="employee_id"></show-error>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('reception.gate_pass_reason')}}</label>
                    <autosize-textarea v-model="gatePassForm.reason" rows="1" name="reason" :placeholder="trans('reception.gate_pass_reason')"></autosize-textarea>
                    <show-error :form-name="gatePassForm" prop-name="reason"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/reception/gate/pass" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                gatePassForm: new Form({
                    type: 'student',
                    student_id: '',
                    employee_id: '',
                    date: '',
                    time: '',
                    reason: ''
                }),
                loaded: false,
                time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                students: [],
                selected_student: null,
                employees: [],
                selected_employee: null
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-gate-pass') && !helper.hasPermission('edit-gate-pass')){
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
                axios.get('/api/gate/pass/pre-requisite')
                    .then(response => {
                        this.students = response.students;
                        this.employees = response.employees;
                        this.gatePassForm.date = helper.today();
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
            	this.gatePassForm.time = (this.time.hour && this.time.minute) ? helper.formatWithPadding(this.time.hour,2)+':'+helper.formatWithPadding(this.time.minute,2)+' '+this.time.meridiem : '';
                let loader = this.$loading.show();
                this.gatePassForm.post('/api/gate/pass')
                    .then(response => {
                        toastr.success(response.message);
                        this.time.hour = '';
                        this.time.minute = '';
                        this.time.meridiem = 'am';
                        this.gatePassForm.type = 'student';
                        this.selected_student = null;
                        this.selected_employee = null;
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
                axios.get('/api/gate/pass/'+this.uuid)
                    .then(response => {
                        this.gatePassForm.type = response.gate_pass.type;
                        this.gatePassForm.reason = response.gate_pass.reason;
                        this.gatePassForm.date = response.gate_pass.date;
                        this.time.hour = response.time.hour;
                        this.time.minute = response.time.minute;
                        this.time.meridiem = response.time.meridiem;
                        this.gatePassForm.student_id = response.gate_pass.student_id;
                        this.selected_student = response.selected_student;
                        this.gatePassForm.employee_id = response.gate_pass.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.loaded = true;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/reception/gate/pass');
                    });
            },
            update(){
            	this.gatePassForm.time = (this.time.hour && this.time.minute) ? helper.formatWithPadding(this.time.hour,2)+':'+helper.formatWithPadding(this.time.minute,2)+' '+this.time.meridiem : '';
                let loader = this.$loading.show();
                this.gatePassForm.patch('/api/gate/pass/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/reception/gate/pass');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onStudentSelect(selectedOption){
                return this.gatePassForm.student_id = selectedOption.id;
            },
            onEmployeeSelect(selectedOption){
                return this.gatePassForm.employee_id = selectedOption.id;
            }
        }
    }
</script>