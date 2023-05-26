<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.list_attendance')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/attendance/regular')"><i class="fas fa-check"></i> <span class="d-none d-sm-inline">{{trans('employee.mark_attendance')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <div class="form-group">
                                <label for="">{{trans('employee.category')}}</label>
                                <v-select label="name" track-by="id" v-model="selected_employee_categories" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_employee_category')" @select="onEmployeeCategorySelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onEmployeeCategoryRemove" :selected="selected_employee_categories">
                                    <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
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
                                <label for="">{{trans('employee.attendance_month')}}</label>
                                <vue-monthly-picker v-model="filter.month" name="month" :placeHolder="trans('employee.attendance_month')" dateFormat="YYYY-MM "></vue-monthly-picker>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-info pull-right" @click="list">{{trans('general.filter')}}</button>
                    </div>
                    <div class="clearfix"></div>

                    <div class="row m-t-20" v-if="employees.length">
                        <div class="col-12">
                            <div class="table-responsive font-90pc p-2">
                                <table class="table table-sm table-bordered attendance-table">
                                    <thead>
                                        <tr>
                                            <th>{{trans('employee.employee')}}</th>
                                            <th class="date-cell" v-for="index in days">{{index}}</th>
                                            <th class="text-center font-weight-bold" v-for="attendance in attendance_summary_with_name" v-tooltip="attendance.name">
                                                {{attendance.symbol}}
                                            </th>
                                        </tr>   
                                    </thead>
                                    <tbody>
                                        <tr v-for="employee in employees">
                                            <td>
                                                {{getEmployeeNameWithCode(employee)}} <br /> 
                                                <span class="font-90pc">{{getEmployeeDesignationOnDate(employee, date)}}</span>
                                            </td>
                                            <td :class="`text-center font-weight-bold text-${attendance.color}`" v-for="attendance in employee.attendances">
                                                <span class="marking-cell" v-tooltip="attendance.description" v-if="attendance.symbol == 'H'">
                                                    <i class="fas fa-hospital-symbol"></i>
                                                </span>
                                                <span class="marking-cell" v-tooltip="attendance.description" v-else>
                                                    {{attendance.symbol}}
                                                </span>
                                            </td>
                                            <td class="text-center font-weight-bold" v-for="attendance in attendance_summary_with_name">
                                                {{getAttendanceSummary(employee, attendance.symbol)}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
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
                filter: {
                    department_id: [],
                    designation_id: [],
                    employee_category_id: [],
                    month: ''
                },
                date: '',
                days: 0,
                employees: [],
                departments: [],
                designations: [],
                employee_categories: [],
                selected_designations: null,
                selected_departments: null,
                selected_employee_categories: null,
                attendance_summary_with_name: []
            }
        },
        mounted(){
            this.filter.month = moment().format('YYYY-MM');
            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
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
            list(){
                let loader = this.$loading.show();
                this.filter.month = moment(this.filter.month).format('YYYY-MM');
                axios.post('/api/employee/attendance/regular/list',{
                        department_id: this.filter.department_id,
                        designation_id: this.filter.designation_id,
                        employee_category_id: this.filter.employee_category_id,
                        month: this.filter.month,
                    })
                    .then(response => {
                        this.employees = response.employees;
                        this.attendance_summary_with_name = response.attendance_summary_with_name;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg();
                    })
            },
            onDepartmentSelect(selectedOption){
                this.filter.department_id.push(selectedOption.id);
            },
            onDepartmentRemove(removedOption){
                this.filter.department_id.splice(this.filter.department_id.indexOf(removedOption.id), 1);
            },
            onDesignationSelect(selectedOption){
                this.filter.designation_id.push(selectedOption.id);
            },
            onDesignationRemove(removedOption){
                this.filter.designation_id.splice(this.filter.designation_id.indexOf(removedOption.id), 1);
            },
            onEmployeeCategorySelect(selectedOption){
                this.filter.employee_category_id.push(selectedOption.id);
            },
            onEmployeeCategoryRemove(removedOption){
                this.filter.employee_category_id.splice(this.filter.employee_category_id.indexOf(removedOption.id), 1);
            },
            getAttendanceSummary(employee, symbol){
                let attendance = employee.summary.find(o => o.symbol == symbol);

                if (typeof attendance == 'undefined')
                    return 0;

                return attendance.value;
            }
        },
        watch: {
            'filter.month': function(val){
                this.date = moment(val, 'YYYY-MM')+'-01';
                this.days = moment(val,'YYYY-MM').daysInMonth();
            }
        }
    }
</script>

<style>
    .attendance-table tr th.date-cell{
        text-align: center;
        min-width: 20px;
        max-width: 20px;
    }
    .attendance-table tr td {
        vertical-align: middle;
    }
    .attendance-table tr td span.marking-cell {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>