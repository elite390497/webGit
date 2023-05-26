<template>
    <form @submit.prevent="proceed" @keydown="termForm.errors.clear($event.target.name)">
        <div class="row">
            <template v-if="!tid">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.designation')}}</label>
                        <v-select label="name" v-model="selected_designation" group-values="designations" group-label="employee_category" :group-select="false" name="designation_id" id="designation_id" :options="designations" :placeholder="trans('employee.select_designation')" @select="onDesignationSelect" @close="termForm.errors.clear('designation_id')" @remove="termForm.designation_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!designations.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="termForm" prop-name="designation_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.department')}}</label>
                        <v-select label="name" v-model="selected_department" name="department_id" id="department_id" :options="departments" :placeholder="trans('employee.select_department')" @select="onDepartmentSelect" @close="termForm.errors.clear('department_id')" @remove="termForm.department_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!departments.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="termForm" prop-name="department_id"></show-error>
                    </div>
                </div>
            </template>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.date_of_joining')}}</label>
                    <template v-if="!tid">
                        <datepicker v-model="termForm.date_of_joining" :bootstrapStyling="true" @selected="termForm.errors.clear('date_of_joining')" :placeholder="trans('employee.date_of_joining')"></datepicker>
                        <show-error :form-name="termForm" prop-name="date_of_joining"></show-error>
                    </template>
                    <template v-else>
                        <p>{{termForm.date_of_joining | moment}}</p>
                    </template>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.joining_remarks')}}</label>
                    <template v-if="!tid">
                        <autosize-textarea v-model="termForm.joining_remarks" rows="1" name="joining_remarks" :placeholder="trans('employee.joining_remarks')"></autosize-textarea>
                        <show-error :form-name="termForm" prop-name="joining_remarks"></show-error>
                    </template>
                    <template v-else>
                        <p v-text="termForm.joining_remarks"></p>
                    </template>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="tid">
            <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" value="1" v-model="termForm.is_leaving">
                <span class="custom-control-label">{{trans('employee.is_leaving')}}</span>
            </label>
        </div>
        <template v-if="termForm.is_leaving">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.date_of_leaving')}}</label>
                        <template v-if="tid">
                            <datepicker v-model="termForm.date_of_leaving" :bootstrapStyling="true" @selected="termForm.errors.clear('date_of_leaving')" :placeholder="trans('employee.date_of_leaving')"></datepicker>
                            <show-error :form-name="termForm" prop-name="date_of_leaving"></show-error>
                        </template>
                        <template v-else>
                            <p>{{termForm.date_of_leaving | moment}}</p>
                        </template>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.leaving_remarks')}}</label>
                        <template v-if="tid">
                            <autosize-textarea v-model="termForm.leaving_remarks" rows="1" name="leaving_remarks" :placeholder="trans('employee.leaving_remarks')"></autosize-textarea>
                            <show-error :form-name="termForm" prop-name="leaving_remarks"></show-error>
                        </template>
                        <template v-else>
                            <p v-text="termForm.leaving_remarks"></p>
                        </template>
                    </div>
                </div>
            </div>
        </template>
        <div class="form-group">
            <file-upload-input :button-text="trans('general.upload_document')" :token="termForm.upload_token" module="employee_term" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
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
		props: ['uuid','tid'],
		data(){
			return {
				termForm: new Form({
                    designation_id: '',
                    department_id: '',
					date_of_joining: '',
                    date_of_leaving: '',
                    is_leaving: 0,
					joining_remarks: '',
                    leaving_remarks: '',
                    upload_token: ''
				}),
                module_id: '',
                designations: [],
                departments: [],
                selected_designation: null,
                selected_department: null,
                clearAttachment: true
			}
		},
		mounted(){
            this.termForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();

            if(this.tid)
                this.getTerm();
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.uuid+'/term/pre-requisite')
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
            proceed(){
                if(this.tid)
                    this.updateTerm();
                else
                    this.storeTerm();
            },
			storeTerm(){
				let loader = this.$loading.show();
				this.termForm.post('/api/employee/'+this.uuid+'/term')
					.then(response => {
						toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
						this.$emit('completed');
                        this.termForm.upload_token = this.$uuid.v4();
						loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					})
			},
            getTerm(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.uuid+'/term/'+this.tid)
                    .then(response => {
                        this.termForm.date_of_joining = response.employee_term.date_of_joining;
                        this.termForm.date_of_leaving = response.employee_term.date_of_leaving;
                        this.termForm.joining_remarks = response.employee_term.joining_remarks;
                        this.termForm.leaving_remarks = response.employee_term.leaving_remarks;
                        this.termForm.is_leaving = response.employee_term.date_of_leaving ? 1 : 0;
                        this.termForm.upload_token = response.employee_term.upload_token;
                        this.module_id = response.employee_term.id;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/employee/'+this.uuid);
                    });
            },
            updateTerm(){
                let loader = this.$loading.show();
                this.termForm.patch('/api/employee/'+this.uuid+'/term/'+this.tid)
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
                this.termForm.designation_id = selectedOption.id;
            },
            onDepartmentSelect(selectedOption){
                this.termForm.department_id = selectedOption.id;
            }
		},
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          }
        }
	}
</script>