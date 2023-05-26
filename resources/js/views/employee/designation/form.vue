<template>
    <form @submit.prevent="proceed" @keydown="designationForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.designation')}}</label>
                    <v-select label="name" v-model="selected_designation" group-values="designations" group-label="employee_category" :group-select="false" name="designation_id" id="designation_id" :options="designations" :placeholder="trans('employee.select_designation')" @select="onDesignationSelect" @close="designationForm.errors.clear('designation_id')" @remove="designationForm.designation_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!designations.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="designationForm" prop-name="designation_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.department')}}</label>
                    <v-select label="name" v-model="selected_department" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" @close="designationForm.errors.clear('department_id')" @remove="designationForm.department_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="designationForm" prop-name="department_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.date_effective')}}</label>
                    <datepicker v-model="designationForm.date_effective" :bootstrapStyling="true" @selected="designationForm.errors.clear('date_effective')" :placeholder="trans('employee.date_effective')"></datepicker>
                    <show-error :form-name="designationForm" prop-name="date_effective"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.remarks')}}</label>
                    <autosize-textarea v-model="designationForm.remarks" rows="1" name="remarks" :placeholder="trans('employee.remarks')"></autosize-textarea>
                    <show-error :form-name="designationForm" prop-name="remarks"></show-error>
                </div>
            </div>
        </div>
        <div class="form-group">
            <file-upload-input :button-text="trans('general.upload_document')" :token="designationForm.upload_token" module="employee_designation" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
        </div>
        <div class="form-group">
        	<button class="btn btn-info pull-right">{{trans('general.save')}}</button>
        </div>
        <div class="clearfix"></div>
    </form>	
</template>

<script>

	export default {
		components: {},
		props: ['uuid','did'],
		data(){
			return {
				designationForm: new Form({
					designation_id: '',
					department_id: '',
					date_effective: '',
					remarks: '',
                    upload_token: ''
				}),
				designations: [],
				selected_designation: null,
				departments: [],
				selected_department: null,
                module_id: '',
                clearAttachment: true
			}
		},
		mounted(){
            this.designationForm.upload_token = this.$uuid.v4();

			this.getPreRequisite();

            if(this.did)
                this.getDesignation();
		},
		methods: {
            proceed(){
                if(this.did)
                    this.updateDesignation();
                else
                    this.storeDesignation();
            },
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/employee/'+this.uuid+'/designation/pre-requisite')
					.then(response => {
						this.designations = response.designations;
						this.departments = response.departments;
						loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
			},
			storeDesignation(){
				let loader = this.$loading.show();
				this.designationForm.post('/api/employee/'+this.uuid+'/designation')
					.then(response => {
						toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
						this.$emit('completed');
                        this.designationForm.upload_token = this.$uuid.v4();
						loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
			},
            getDesignation(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.uuid+'/designation/'+this.did)
                    .then(response => {
                        this.designationForm.designation_id = response.employee_designation.designation_id;
                        this.designationForm.department_id = response.employee_designation.department_id;
                        this.designationForm.date_effective = response.employee_designation.date_effective;
                        this.designationForm.remarks = response.employee_designation.remarks;

                        this.selected_designation = {id: response.employee_designation.designation_id, name: response.employee_designation.designation.name};
                        this.selected_department = response.employee_designation.department_id ? {id: response.employee_designation.department_id, name: response.employee_designation.department.name} : null;
                        this.designationForm.upload_token = response.employee_designation.upload_token;
                        this.module_id = response.employee_designation.id;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/employee/'+this.uuid);
                    });
            },
            updateDesignation(){
                let loader = this.$loading.show();
                this.designationForm.patch('/api/employee/'+this.uuid+'/designation/'+this.did)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
			onDesignationSelect(selectedOption){
				this.designationForm.designation_id = selectedOption.id;
			},
			onDepartmentSelect(selectedOption){
				this.designationForm.department_id = selectedOption.id;
			}
		}
	}
</script>