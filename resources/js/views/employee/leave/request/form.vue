<template>
	<div class="row">
        <div class="col-12 col-sm-6">
            <div class="card">
                <div class="card-body border-right p-4">
                    <form @submit.prevent="proceed" @keydown="leaveRequestForm.errors.clear($event.target.name)">
                        <div class="row">
                            <template v-if="hasPermission('request-leave-for-other-employee')">
                                <div class="col-12" v-if="!uuid">
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox m-t-20">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="apply_leave_for_other">
                                            <span class="custom-control-label">{{trans('employee.apply_leave_for_other')}}</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6" v-if="apply_leave_for_other">
                                    <div class="form-group">
                                        <label for="">{{trans('employee.employee')}}</label>
                                        <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="leaveRequestForm.errors.clear('employee_id')" @remove="leaveRequestForm.employee_id = ''">
                                            <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="leaveRequestForm" prop-name="employee_id"></show-error>
                                    </div>
                                </div>

                                <div class="col-12 col-sm-6" v-if="uuid">
                                    <p class="m-t-20">
                                        {{getEmployeeNameWithCode(employee)}} <br />
                                        {{getEmployeeDesignationOnDate(employee, leaveRequestForm.end_date)}} <br />
                                    </p>
                                </div>
                            </template>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_type')}}</label>
                                    <v-select label="name" v-model="selected_leave_type" name="employee_leave_type_id" id="employee_leave_type_id" :options="leave_types" :placeholder="trans('employee.select_leave_type')" @select="onLeaveTypeSelect" @close="leaveRequestForm.errors.clear('employee_leave_type_id')" @remove="leaveRequestForm.employee_leave_type_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!leave_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="leaveRequestForm" prop-name="employee_leave_type_id"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_request_start_date')}}</label>
                                    <datepicker v-model="leaveRequestForm.start_date" :bootstrapStyling="true" @selected="leaveRequestForm.errors.clear('start_date')" :placeholder="trans('employee.leave_request_start_date')"></datepicker>
                                    <show-error :form-name="leaveRequestForm" prop-name="start_date"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_request_end_date')}}</label>
                                    <datepicker v-model="leaveRequestForm.end_date" :bootstrapStyling="true" @selected="leaveRequestForm.errors.clear('end_date')" :placeholder="trans('employee.leave_request_end_date')"></datepicker>
                                    <show-error :form-name="leaveRequestForm" prop-name="end_date"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="">{{trans('employee.leave_request_reason')}}</label>
                                    <autosize-textarea v-model="leaveRequestForm.reason" rows="1" name="reason" :placeholder="trans('employee.leave_request_reason')"></autosize-textarea>
                                    <show-error :form-name="leaveRequestForm" prop-name="reason"></show-error>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <file-upload-input :button-text="trans('general.upload_document')" :token="leaveRequestForm.upload_token" module="leave_request" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <router-link to="/employee/leave/request" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title m-3">{{trans('employee.leave_allocation')}}</h4>
                    <div class="table-responsive" v-if="leave_allocations.length">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.name')}}</th>
                                    <th>{{trans('employee.leave_allocation_period')}}</th>
                                    <th>{{trans('employee.leave_allotted')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="leave_allocation in leave_allocations">
                                    <td v-text="getEmployeeNameWithCode(leave_allocation.employee)"></td>
                                    <td>{{leave_allocation.start_date | moment}} {{trans('general.to')}} {{leave_allocation.end_date | moment}}</td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="leave_allocation_detail in leave_allocation.leave_allocation_details">{{leave_allocation_detail.leave_type.name+': '+leave_allocation_detail.used+'/'+leave_allocation_detail.allotted}}</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p class="alert alert-danger m-2">{{trans('employee.leave_not_allocated')}}</p>
                    </div>
                </div>
            </div>
        </div>
	</div>	
</template>

<script>
    export default {
        components : {},
        props:['uuid'],
        data() {
            return {
            	leaveRequestForm: new Form({
            		employee_id: '',
            		employee_leave_type_id: '',
                    start_date: '',
                    end_date: '',
                    reason: '',
                    upload_token: ''
            	}),
                employee: {},
                apply_leave_for_other: 0,
                leave_allocations: [],
                clearAttachment: true,
            	employees: [],
            	leave_types: [],
            	selected_employee: null,
            	selected_leave_type: null,
                module_id: ''
            }
        },
        mounted(){
            this.getPreRequisite();

            if(this.uuid)
                this.get();
            else
                this.leaveRequestForm.upload_token = this.$uuid.v4();

            if(!this.uuid)
                this.getLeaveAllocation();
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
                axios.get('/api/employee/leave/request/pre-requisite')
                	.then(response => {
                        loader.hide();
                		this.employees = response.employees;
                		this.leave_types = response.leave_types;
                	})
                	.catch(error => {
                        loader.hide();
                		helper.showErrorMsg(error);
                	})
            },
            getLeaveAllocation(){
                let loader = this.$loading.show();
                axios.post('/api/employee/leave/allocation/fetch',{
                        id: this.leaveRequestForm.employee_id
                    })
                    .then(response => {
                        loader.hide();
                        this.leave_allocations = response.leave_allocations;
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.leaveRequestForm.post('/api/employee/leave/request')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.clearAttachment = !this.clearAttachment;
                        this.selected_employee = null;
                        this.selected_leave_type = null;
                        this.leaveRequestForm.upload_token = this.$uuid.v4();
                        this.apply_leave_for_other = 0;
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/leave/request/'+this.uuid)
                    .then(response => {
                        let leave_request = response.leave_request;
                        if (leave_request.status != 'pending') {
                            loader.hide();
                            toastr.error(i18n.user.permission_denied);
                            this.$router.push('/employee/leave/request');
                        }
                        this.leaveRequestForm.employee_id = leave_request.employee_id;
                        this.getLeaveAllocation();
                        this.employee = leave_request.employee;
                        this.leaveRequestForm.employee_leave_type_id = leave_request.employee_leave_type_id;
                        this.selected_leave_type = leave_request.employee_leave_type_id ? {id: leave_request.employee_leave_type_id, name: leave_request.leave_type.name} : null;
                        this.leaveRequestForm.reason = leave_request.reason;
                        this.leaveRequestForm.start_date = leave_request.start_date;
                        this.leaveRequestForm.end_date = leave_request.end_date;
                        this.leaveRequestForm.upload_token = leave_request.upload_token;
                        this.module_id = leave_request.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/employee/leave/request');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.leaveRequestForm.patch('/api/employee/leave/request/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/leave/request');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
        	onEmployeeSelect(selectedOption){
        		this.leaveRequestForm.employee_id = selectedOption.id;
                this.getLeaveAllocation();
        	},
            onLeaveTypeSelect(selectedOption){
                this.leaveRequestForm.employee_leave_type_id = selectedOption.id
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