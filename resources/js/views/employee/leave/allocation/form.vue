<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="leaveAllocationForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-4" v-if="!uuid">
	                <div class="form-group">
	                    <label for="">{{trans('employee.employee')}}</label>
                        <v-select label="name" v-model="selected_employee" name="employee_id" id="employee_id" :options="employees" :placeholder="trans('employee.select_employee')" @select="onEmployeeSelect" @close="leaveAllocationForm.errors.clear('employee_id')" @remove="leaveAllocationForm.employee_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!employees.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="leaveAllocationForm" prop-name="employee_id"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-4" v-else>
                    <p class="m-t-20">
                        {{getEmployeeNameWithCode(employee)}} <br />
                        {{getEmployeeDesignationOnDate(employee, leaveAllocationForm.end_date)}} <br />
                    </p>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('employee.leave_allocation_start_date')}}</label>
                        <datepicker v-model="leaveAllocationForm.start_date" :bootstrapStyling="true" @selected="leaveAllocationForm.errors.clear('start_date')" :placeholder="trans('employee.leave_allocation_start_date')"></datepicker>
                        <show-error :form-name="leaveAllocationForm" prop-name="start_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('employee.leave_allocation_end_date')}}</label>
                        <datepicker v-model="leaveAllocationForm.end_date" :bootstrapStyling="true" @selected="leaveAllocationForm.errors.clear('end_date')" :placeholder="trans('employee.leave_allocation_end_date')"></datepicker>
                        <show-error :form-name="leaveAllocationForm" prop-name="end_date"></show-error>
                    </div>
                </div>
	        </div>
            <div class="row">
                <div class="col-12 col-sm-4" v-for="(leave_type,index) in leaveAllocationForm.leave_types">
                    <div class="form-group">
                        <label for="">{{leave_type.name}}</label>
                        <input class="form-control" type="text" v-model="leave_type.allotted" :name="getLeaveTypeName(index)" :placeholder="trans('employee.leave_allotted')">
                        <show-error :form-name="leaveAllocationForm" :prop-name="getLeaveTypeName(index)"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('employee.leave_allocation_description')}}</label>
                        <autosize-textarea v-model="leaveAllocationForm.description" rows="1" name="description" :placeholder="trans('employee.leave_allocation_description')"></autosize-textarea>
                        <show-error :form-name="leaveAllocationForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/employee/leave/allocation" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
	    </form>
	</div>
</template>

<script>
    export default {
        components : {},
        props:['uuid'],
        data() {
            return {
            	leaveAllocationForm: new Form({
            		employee_id: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                    leave_types: []
            	}),
            	employees: [],
                employee: {},
            	leave_types: [],
            	selected_employee: null
            }
        },
        mounted(){
            this.getPreRequisite();
        },
        methods: {
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            populateLeaveTypes(){
                this.leaveAllocationForm.leave_types = [];
                this.leave_types.forEach(leave_type => {
                    this.leaveAllocationForm.leave_types.push({
                        name: leave_type.name,
                        id: leave_type.id,
                        allotted: ''
                    })
                })
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/leave/allocation/pre-requisite')
                	.then(response => {
                        loader.hide();
                		this.employees = response.employees;
                		this.leave_types = response.leave_types;
                        this.populateLeaveTypes();
                        if(this.uuid)
                            this.get();
                	})
                	.catch(error => {
                        loader.hide();
                		helper.showErrorMsg(error);
                	})
            },
            getLeaveTypeName(index){
                return index+'_leave_type';
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.leaveAllocationForm.post('/api/employee/leave/allocation')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.selected_employee = null;
                        this.populateLeaveTypes();
                        this.$emit('completed');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/leave/allocation/'+this.uuid)
                    .then(response => {
                        let leave_allocation = response.leave_allocation;
                        this.leaveAllocationForm.employee_id = leave_allocation.employee_id;
                        this.selected_employee = response.selected_employee;
                        this.employee = leave_allocation.employee;
                        this.leaveAllocationForm.description = leave_allocation.description;
                        this.leaveAllocationForm.start_date = leave_allocation.start_date;
                        this.leaveAllocationForm.end_date = leave_allocation.end_date;
                        this.leaveAllocationForm.leave_types.forEach(leave_type => {
                            let leave_allocation_detail = leave_allocation.leave_allocation_details.find(o => o.employee_leave_type_id == leave_type.id);
                            leave_type.allotted = (typeof leave_allocation_detail != 'undefined') ? leave_allocation_detail.allotted : ''
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/employee/leave/allocation');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.leaveAllocationForm.patch('/api/employee/leave/allocation/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/employee/leave/allocation');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
        	onEmployeeSelect(selectedOption){
        		this.leaveAllocationForm.employee_id = selectedOption.id;
        	}
        }
   	}
</script>