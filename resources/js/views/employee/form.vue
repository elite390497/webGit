<template>
    <form @submit.prevent="submit" @keydown="employeeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.code')}}</label>
                    <div class="row">
                        <div class="col-12 col-sm-4">
                            <input class="form-control" type="text" v-model="employeeForm.prefix" name="prefix" :placeholder="trans('employee.employee_code_prefix')">
                        </div>
                        <div class="col-12 col-sm-8">
                            <input class="form-control" type="text" v-model="employeeForm.code" name="code" :placeholder="trans('employee.code')">
                        </div>
                    </div>
                    <show-error :form-name="employeeForm" prop-name="code"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.name')}}</label>
                    <div class="row">
            			<div class="col-12 col-sm-4">
                            <div class="form-group">
    		                    <input class="form-control" type="text" v-model="employeeForm.first_name" name="first_name" :placeholder="trans('employee.first_name')">
    		                    <show-error :form-name="employeeForm" prop-name="first_name"></show-error>
                            </div>
            			</div>
            			<div class="col-12 col-sm-4">
                            <div class="form-group">
    		                    <input class="form-control" type="text" v-model="employeeForm.middle_name" name="middle_name" :placeholder="trans('employee.middle_name')">
    		                    <show-error :form-name="employeeForm" prop-name="middle_name"></show-error>
                            </div>
            			</div>
            			<div class="col-12 col-sm-4">
                            <div class="form-group">
    		                    <input class="form-control" type="text" v-model="employeeForm.last_name" name="last_name" :placeholder="trans('employee.last_name')">
    		                    <show-error :form-name="employeeForm" prop-name="last_name"></show-error>
                            </div>
            			</div>
            		</div>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.department')}}</label>
                    <v-select label="name" v-model="selected_department" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" @close="employeeForm.errors.clear('department_id')" @remove="employeeForm.department_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="employeeForm" prop-name="department_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.designation')}}</label>
                    <v-select label="name" v-model="selected_designation" group-values="designations" group-label="employee_category" :group-select="false"  name="designation_id" id="designation_id" :options="designations" :placeholder="trans('employee.select_designation')" @select="onDesignationSelect" @close="employeeForm.errors.clear('designation_id')" @remove="employeeForm.designation_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!designations.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="employeeForm" prop-name="designation_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.father_name')}}</label>
                    <input class="form-control" type="text" v-model="employeeForm.father_name" name="father_name" :placeholder="trans('employee.father_name')">
                    <show-error :form-name="employeeForm" prop-name="father_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.mother_name')}}</label>
                    <input class="form-control" type="text" v-model="employeeForm.mother_name" name="mother_name" :placeholder="trans('employee.mother_name')">
                    <show-error :form-name="employeeForm" prop-name="mother_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.contact_number')}}</label>
                    <input class="form-control" type="text" v-model="employeeForm.contact_number" name="contact_number" :placeholder="trans('employee.contact_number')">
                    <show-error :form-name="employeeForm" prop-name="contact_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.gender')}}</label>
                    <div class="radio radio-info p-l-0">
                        <div class="form-check form-check-inline " v-for="gender in genders">
                            <input class="form-check-input" type="radio" :value="gender.id" :id="gender.id" v-model="employeeForm.gender" :checked="employeeForm.gender == gender.id" name="gender" @click="employeeForm.errors.clear('gender')">
                            <label class="form-check-label" :for="gender.id"> {{trans('list.'+gender.id)}}</label>
                        </div>
                    </div>
                    <show-error :form-name="employeeForm" prop-name="gender"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.date_of_birth')}}</label>
                    <datepicker v-model="employeeForm.date_of_birth" :bootstrapStyling="true" @selected="employeeForm.errors.clear('date_of_birth')" :placeholder="trans('employee.date_of_birth')"></datepicker>
                    <show-error :form-name="employeeForm" prop-name="date_of_birth"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.date_of_joining')}}</label>
                    <datepicker v-model="employeeForm.date_of_joining" :bootstrapStyling="true" @selected="employeeForm.errors.clear('date_of_joining')" :placeholder="trans('employee.date_of_joining')"></datepicker>
                    <show-error :form-name="employeeForm" prop-name="date_of_joining"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <button type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
        </div>
    </form>

</template>

<script>
	export default {
        components: {},
		data(){
			return {
				employeeForm: new Form({
					first_name: '',
					middle_name: '',
					last_name: '',
					father_name: '',
					mother_name: '',
					contact_number: '',
					date_of_joining: '',
					date_of_birth: '',
					department_id: '',
					designation_id: '',
					gender: '',
                    code: '',
                    prefix: ''
				}),
                codes: [],
				genders: [],
				departments: [],
				selected_department: null,
				designations: [],
				selected_designation: null
			}
		},
		mounted(){
            this.getPreRequisite();
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/pre-requisite')
                    .then(response => {
                        this.departments = response.departments;
                        this.designations = response.designations;
                        this.genders = response.genders;
                        this.codes = response.codes;
                        this.employeeForm.prefix = helper.getConfig('employee_code_prefix');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
			submit(){
                let loader = this.$loading.show();
				this.employeeForm.post('/api/employee')
					.then(response => {
						toastr.success(response.message);
                        this.selected_designation = null;
                        this.selected_department = null;
                        this.getPreRequisite();
						this.$emit('completed');
                        loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
			},
			onDesignationSelect(selectedOption){
				this.employeeForm.designation_id = selectedOption.id;
			},
			onDepartmentSelect(selectedOption){
				this.employeeForm.department_id = selectedOption.id;
			},
            getConfig(config){
                return helper.getConfig(config);
            }
		},
        watch: {
            'employeeForm.prefix': function(val) {
                let code = this.codes.find(o => o.prefix == val);

                if (typeof code == 'undefined')
                    this.employeeForm.code = helper.formatWithPadding(1,helper.getConfig('employee_code_digit'));
                else 
                    this.employeeForm.code = helper.formatWithPadding((code.code + 1),helper.getConfig('employee_code_digit'));
            }
        }
	}
</script>