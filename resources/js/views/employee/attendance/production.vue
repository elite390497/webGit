<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.mark_production_attendance')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/attendance')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.list_attendance')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/attendance/regular')"><i class="fas fa-check"></i> <span class="d-none d-sm-inline">{{trans('employee.mark_regular_attendance')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="attendanceForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.employee')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect">
                                        <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <span class="help-block text-danger font-80pc" v-if="is_payroll_generated">{{trans('employee.payroll_is_generated')}}</span>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.date_of_attendance')}}</label>
                                    <datepicker v-model="attendanceForm.date_of_attendance" :bootstrapStyling="true" :disabledDates="disabled" :placeholder="trans('employee.date_of_attendance')"></datepicker>
                                    <show-error :form-name="attendanceForm" prop-name="date_of_attendance"></show-error>
                                </div>
                            </div>
                        </div>

                        <div class="row" v-for="(attendance,index) in attendanceForm.attendances">
                            <div class="col-12 col-sm-3">
                                {{attendance.name}} ({{attendance.alias}})
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" type="number" v-model="attendance.value" :name="getValueName(index)" :placeholder="trans('employee.production_attendance_value')" :disabled="is_payroll_generated ? true : false">
                                        <div class="input-group-append">
                                            <span class="input-group-text">{{attendance.unit}}</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="attendanceForm" :prop-name="getValueName(index)"></show-error>
                                </div>                                
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <autosize-textarea v-model="attendance.remarks" rows="1" name="" :placeholder="trans('employee.attendance_remarks')"></autosize-textarea>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" v-if="attendanceForm.attendances.length && attendance_types.length">
                            <button type="submit" class="btn btn-info pull-right" :disabled="is_payroll_generated ? true : false">{{trans('general.save')}}</button>
                        </div>  
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data(){
            return {
                attendanceForm: new Form({
                    employee_id: '',
                    date_of_attendance: '',
                    attendances: [],
                    category: 'production'
                },false),
                disabled: {
                    dates:[]
                },
                is_payroll_generated: false,
                attendance: {},
                employees: [],
                selected_employee: null,
                attendance_types: []
            }
        },
        mounted(){
            if(!helper.hasPermission('mark-employee-attendance')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.attendanceForm.date_of_attendance = helper.today();
            this.getPreRequisite();
        },
        methods: {
            getValueName(index){
                return 'value_'+index;
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/attendance/production/pre-requisite')
                    .then(response => {
                        this.employees = response.employees;
                        this.attendance_types = response.attendance_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onEmployeeSelect(selectedOption){
                this.attendanceForm.employee_id = selectedOption.id;
                this.fetch();
            },
            fetch(){
                if (! this.attendanceForm.employee_id)
                    return;

                let loader = this.$loading.show();
                axios.post('/api/employee/attendance/production/fetch', {
                        employee_id: this.attendanceForm.employee_id,
                        date: this.attendanceForm.date_of_attendance
                    })
                    .then(response => {
                        this.attendance = response.attendance;
                        this.attendanceForm.attendances = [];
                        this.is_payroll_generated = response.is_payroll_generated;
                        this.attendance_types.forEach(attendance_type => {

                            let employee_attendance = this.attendance.attendance_details.find(o => o.employee_attendance_type_id == attendance_type.id);

                            this.attendanceForm.attendances.push({
                                id: attendance_type.id,
                                name: attendance_type.name,
                                alias: attendance_type.alias,
                                unit: attendance_type.unit,
                                value: (typeof employee_attendance != 'undefined') ? employee_attendance.value : 0,
                                remarks: (typeof employee_attendance != 'undefined') ? employee_attendance.remarks : '',
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            submit(){
                let loader = this.$loading.show();
                this.attendanceForm.post('/api/employee/attendance/production')
                    .then(response => {
                        loader.hide();
                        toastr.success(response.message);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
        },
        watch: {
            'attendanceForm.date_of_attendance': function(val) {
                this.fetch();
            }
        }
    }
</script>