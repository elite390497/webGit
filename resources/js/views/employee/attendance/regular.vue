<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.mark_attendance')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/attendance')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.list_attendance')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/attendance/production')"><i class="fas fa-clock"></i> <span class="d-none d-sm-inline">{{trans('employee.mark_production_attendance')}}</span></button>
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
                                    <label for="">{{trans('employee.department')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_departments" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDepartmentRemove" :selected="selected_departments">
                                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.designation')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_designations" name="designation_id" id="designation_id" :options="designations" :placeholder="trans('employee.select_designation')" @select="onDesignationSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onDesignationRemove" :selected="selected_designations">
                                        <div class="multiselect__option" slot="afterList" v-if="!designations.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('employee.date_of_attendance')}}</label>
                                    <datepicker v-model="attendanceForm.date_of_attendance" :bootstrapStyling="true" @selected="" :disabledDates="disabled" :placeholder="trans('employee.date_of_attendance')"></datepicker>
                                    <show-error :form-name="attendanceForm" prop-name="date_of_attendance"></show-error>
                                </div>
                            </div>
                        </div>

                        <p class="alert alert-info" v-if="is_holiday">{{trans('calendar.date_is_holiday', {date: formatDate(attendanceForm.date_of_attendance)})}}</p>

                        <div class="row m-t-40" v-if="attendanceForm.employees.length">
                            <div class="col-12">
                                <div class="table-responsive p-2">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th width="30%">
                                                    {{trans('employee.name')}}
                                                </th>
                                                <th width="30%">
                                                    <select v-model="global_attendance" class="custom-select" @change="setAllAttendance">
                                                      <option value="null">{{trans('general.select_one')}}</option>
                                                      <option v-for="option in regular_attendance_types" v-bind:value="option.value">
                                                        {{ option.text }}
                                                      </option>
                                                    </select>
                                                </th>
                                                <th width="40%">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(employee,index) in attendanceForm.employees">
                                                <td>
                                                    {{employee.name}} <br /> 
                                                    <span class="font-80pc">{{employee.designation}}</span>
                                                    <span v-if="isPayrollGenerated(employee)" class="text-success font-80pc"><br />({{trans('employee.payroll_is_generated')}})</span>
                                                </td>
                                                <td>
                                                    <template v-if="!employee.is_on_leave">
                                                        <select v-model="employee.attendance" class="custom-select col-12" v-if="!employee.is_on_leave" :disabled="isPayrollGenerated(employee) ? true : false">
                                                          <option value="null">{{trans('general.select_one')}}</option>
                                                          <option v-for="option in regular_attendance_types" v-bind:value="option.value">
                                                            {{ option.text }}
                                                          </option>
                                                        </select>
                                                    </template>
                                                    <template v-else>
                                                        <p class="font-90pc text-danger font-weight-bold">({{trans('employee.leave_approved')}})</p>
                                                    </template>
                                                </td>
                                                <td>
                                                    <template v-if="!employee.is_on_leave">
                                                        <autosize-textarea v-model="employee.remarks" rows="1" :name="getRemarksName(index)" :placeholder="trans('employee.attendance_remarks')" v-if="!employee.is_on_leave"></autosize-textarea>
                                                    </template>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-info pull-right">{{trans('general.save')}}</button>
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
                    department_id: [],
                    designation_id: [],
                    employee_category_id: [],
                    date_of_attendance: '',
                    employees: [],
                    category: 'regular'
                },false),
                disabled: {
                    dates:[]
                },
                payroll_generated: [],
                is_holiday: false,
                leaves: [],
                global_attendance: null,
                departments: [],
                designations: [],
                employee_categories: [],
                selected_designations: null,
                selected_departments: null,
                selected_employee_categories: null,
                regular_attendance_types: [],
                production_attendance_types: []
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
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getRemarksName(index){
                return 'remarks_'+index;
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/attendance/regular/pre-requisite')
                    .then(response => {
                        this.departments = response.departments;
                        this.designations = response.designations;
                        this.employee_categories = response.employee_categories;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            fetch(){
                let loader = this.$loading.show();
                axios.post('/api/employee/attendance/regular/fetch', {
                    department_id: this.attendanceForm.department_id,
                    employee_category_id: this.attendanceForm.employee_category_id,
                    designation_id: this.attendanceForm.designation_id,
                    date: this.attendanceForm.date_of_attendance
                })
                .
                then(response => {
                    this.regular_attendance_types = response.regular_attendance_types;
                    this.production_attendance_types = response.production_attendance_types;
                    this.leaves = response.leaves;
                    this.is_holiday = response.is_holiday;
                    this.payroll_generated = response.payroll_generated;
                    this.attendanceForm.employees = [];
                    response.employees.forEach(employee => {
                        const is_on_leave = (response.leaves.findIndex(o => o == employee.id) >= 0) ? 1 : 0;
                        const employee_attendance = response.attendances.find(o => o.employee_id == employee.id);

                        this.attendanceForm.employees.push({
                            id: employee.id,
                            name: this.getEmployeeNameWithCode(employee),
                            designation: this.getEmployeeDesignationOnDate(employee, this.attendanceForm.date_of_attendance),
                            attendance: (typeof employee_attendance != 'undefined') ? employee_attendance.employee_attendance_type_id : null,
                            is_on_leave: is_on_leave,
                            remarks: (typeof employee_attendance != 'undefined') ? employee_attendance.remarks : ''
                        });
                    });
                    loader.hide();
                })
                .catch(error => {
                    loader.hide();
                })
            },
            setAllAttendance(){
                this.attendanceForm.employees.forEach(employee => {
                    if (!employee.is_on_leave && !this.isPayrollGenerated(employee)) {
                        employee.attendance =  this.global_attendance;
                    }
                })
            },
            onDepartmentSelect(selectedOption){
                this.attendanceForm.department_id.push(selectedOption.id);
                this.fetch();
            },
            onDepartmentRemove(removedOption){
                this.attendanceForm.department_id.splice(this.attendanceForm.department_id.indexOf(removedOption.id), 1);
                this.fetch();
            },
            onDesignationSelect(selectedOption){
                this.attendanceForm.designation_id.push(selectedOption.id);
                this.fetch();
            },
            onDesignationRemove(removedOption){
                this.attendanceForm.designation_id.splice(this.attendanceForm.designation_id.indexOf(removedOption.id), 1);
                this.fetch();
            },
            onEmployeeCategorySelect(selectedOption){
                this.attendanceForm.employee_category_id.push(selectedOption.id);
                this.fetch();
            },
            onEmployeeCategoryRemove(removedOption){
                this.attendanceForm.employee_category_id.splice(this.attendanceForm.employee_category_id.indexOf(removedOption.id), 1);
                this.fetch();
            },
            submit(){
                let loader = this.$loading.show();
                this.attendanceForm.post('/api/employee/attendance/regular')
                    .then(response => {
                        loader.hide();
                        this.global_attendance = null;
                        toastr.success(response.message);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            formatDate(date){
                return helper.formatDate(date);
            },
            isPayrollGenerated(employee){
                return this.payroll_generated.indexOf(employee.id) > -1 ? true : false;
            }
        },
        watch: {
            'attendanceForm.date_of_attendance': function(val){
                this.fetch();
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
    }
</script>