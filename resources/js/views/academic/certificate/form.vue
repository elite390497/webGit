<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="certificateForm.errors.clear($event.target.name)">
	        <div class="row">
	        	<div class="col-12 col-sm-5">
	                <div class="form-group">
	                    <label for="">{{trans('academic.certificate_template')}}</label>
                        <v-select label="name" v-model="selected_certificate_template" name="certificate_template_id" id="certificate_template_id" :options="certificate_templates" :placeholder="trans('academic.select_certificate_template')" @select="onCertificateTemplateSelect" @close="certificateForm.errors.clear('certificate_template_id')" @remove="onCertificateTemplateRemove">
                            <div class="multiselect__option" slot="afterList" v-if="!certificate_templates.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="certificateForm" prop-name="certificate_template_id"></show-error>
	                </div>
		            <div v-if="type == 'student'">
		                <div class="form-group">
			            	<div class="input-group mb-3">
		                    	<input class="form-control" type="text" v-model="studentFilter.name" name="student_name" :placeholder="trans('student.student_search_by_name')">
								<div class="input-group-append">
									<button type="button" class="btn btn-info pull-right" @click="searchStudent"><i class="fas fa-search"></i> {{trans('general.search')}}</button>
								</div>
							</div>
		                </div>
		                <template v-if="students.total" class="m-b-10">
			            	<div class="table-responsive">
			            		<table class="table table-sm">
			            			<thead>
			            				<tr>
			            					<th>{{trans('student.name')}}</th>
			            					<th>{{trans('academic.batch')}}</th>
			            					<th>{{trans('student.first_guardian_name')}}</th>
			            					<th>{{trans('student.contact_number')}}</th>
			            					<th class="table-option"></th>
			            				</tr>
			            			</thead>
			            			<tbody>
			            				<template v-for="student in students.data">
				            				<tr v-for="student_record in student.student_records">
				            					<td>{{getStudentName(student)}}</td>
				            					<td>{{student_record.batch.course.name+' '+student_record.batch.name}}</td>
				            					<td>{{student.parent.first_guardian_name}}</td>
				            					<td>{{student.contact_number}}</td>
				            					<td class="table-option">
				            						<button type="button" class="btn btn-sm btn-info" @click="selectStudentRecord(student, student_record)">{{trans('student.select_student')}}</button>
				            					</td>
				            				</tr>
				            			</template>
			            			</tbody>
			            		</table>
			            	</div>
			            	<pagination-record :page-length.sync="studentFilter.page_length" :records="students" @updateRecords="searchStudent"></pagination-record>
			            </template>
		            </div>

		            <div v-if="type == 'employee'">
		                <div class="form-group">
			            	<div class="input-group mb-3">
		                    	<input class="form-control" type="text" v-model="employeeFilter.name" name="employee_name" :placeholder="trans('employee.employee_search_by_name')">
								<div class="input-group-append">
									<button type="button" class="btn btn-info pull-right" @click="searchEmployee"><i class="fas fa-search"></i> {{trans('general.search')}}</button>
								</div>
							</div>
		                </div>

		                <template v-if="employees.total" class="m-b-10">
			            	<div class="table-responsive">
			            		<table class="table table-sm">
			            			<thead>
			            				<tr>
			            					<th>{{trans('employee.code')}}</th>
			            					<th>{{trans('employee.name')}}</th>
			            					<th>{{trans('employee.father_name')}}</th>
			            					<th>{{trans('employee.contact_number')}}</th>
			            					<th class="table-option"></th>
			            				</tr>
			            			</thead>
			            			<tbody>
			            				<tr v-for="employee in employees.data">
			            					<td>{{getEmployeeCode(employee)}}</td>
			            					<td>{{getEmployeeName(employee)}}</td>
			            					<td>{{employee.father_name}}</td>
			            					<td>{{employee.contact_number}}</td>
			            					<td class="table-option">
			            						<button type="button" class="btn btn-sm btn-info" @click="selectEmployee(employee)">{{trans('employee.select_employee')}}</button>
			            					</td>
			            				</tr>
			            			</tbody>
			            		</table>
			            	</div>
			            	<pagination-record :page-length.sync="employeeFilter.page_length" :records="employees" @updateRecords="searchEmployee"></pagination-record>
			            </template>
		            </div>

	            	<div class="m-b-20" v-if="type == 'student' && selected_student && selected_student_record">
	            		<div class="row">
	            			<div class="col-6">{{trans('student.name')+': '+getStudentName(selected_student)}}</div>
	            			<div class="col-6">{{trans('student.father_name')+': '+getStudentFatherName(selected_student)}} <br /></div>
	            			<div class="col-6">{{trans('academic.batch')+': '+selected_student_record.batch.course.name+' '+selected_student_record.batch.name}}</div>
	            			<div class="col-6">{{trans('student.contact_number')+': '+selected_student.contact_number}}</div>
	            		</div>
	            	</div>
	            	<div class="m-b-20" v-if="type == 'employee' && selected_employee">
	            		<div class="row">
	            			<div class="col-6">{{trans('employee.code')+': '+getEmployeeCode(selected_employee)}}</div>
	            			<div class="col-6">{{trans('employee.name')+': '+getEmployeeName(selected_employee)}}</div>
	            			<div class="col-6">{{trans('employee.father_name')+': '+selected_employee.father_name}} <br /></div>
	            			<div class="col-6">{{trans('employee.contact_number')+': '+selected_employee.contact_number}}</div>
	            		</div>
	            	</div>

	            	<div class="form-group" v-for="(custom_field, index) in certificateForm.custom_fields">
                        <label for="">{{custom_field.name}}</label>
                        <input class="form-control" type="text" v-model="custom_field.value" :name="getCustomFieldName(index)" :placeholder="trans('academic.enter_certificate_template_custom_field_value')">
                        <show-error :form-name="certificateForm" :prop-name="getCustomFieldName(index)"></show-error>
	            	</div>

	            	<button type="submit" v-if="certificateForm.certificate_template_id" class="btn btn-info">{{trans('general.save')}}</button>
	        	</div>
	        	<div class="col-12 col-sm-7">
	        		<div class="border p-4" v-if="certificateForm.body" v-html="certificateForm.body"></div>
	        	</div>
	        </div>
	    </form>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['uuid'],
		data() {
			return {
				certificateForm: new Form({
					certificate_template_id: '',
					body: '',
					student_record_id: '',
					employee_id: '',
					custom_fields: []
				}),
				type: '',
				certificate_templates: [],
				certificate_template_details: [],
				selected_certificate_template: null,
				selected_student: null,
				selected_student_record: null,
				selected_employee: null,
				studentFilter: {
					name: '',
					page_length: helper.getConfig('page_length')
				},
				employeeFilter: {
					name: '',
					page_length: helper.getConfig('page_length')
				},
				students: {
					data: [],
					total: 0
				},
				employees: {
					data: [],
					total: 0
				},
			}
		},
		mounted(){
			this.getPreRequisite();
		},
		methods: {
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getStudentFatherName(student){
            	return student.parent.father_name;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getCustomFieldName(index){
            	return index+'_custom_field';
            },
        	getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/certificate/pre-requisite')
                    .then(response => {
                        this.certificate_templates = response.certificate_templates;
                        this.certificate_template_details = response.certificate_template_details;

						if (this.uuid)
							this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
        	},
			onCertificateTemplateSelect(selectedOption){
				this.certificateForm.certificate_template_id = selectedOption.id;
				let certificate_template = this.certificate_template_details.find(o => o.id == selectedOption.id);

				this.certificateForm.custom_fields = [];

				if (typeof certificate_template != 'undefined') {
					this.type = certificate_template.type;
					this.certificateForm.body = certificate_template.body;
					certificate_template.options.custom_fields.forEach(custom_field => {
						this.certificateForm.custom_fields.push({
							name: custom_field,
							value: ''
						});
					});
				}
			},
			onCertificateTemplateRemove(removedOption){
				this.certificateForm.certificate_template_id = '';
				this.type = '';
				this.certificateForm.body = '';
			},
			searchStudent(page){
				let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.studentFilter);
				axios.get('/api/student/search/name?page=' + page + url)
					.then(response => {
						this.students = response;

						if(! response.total) {
							loader.hide();
							return toastr.error(i18n.general.no_search_result_found);
						}
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			selectStudentRecord(student, student_record){
				this.certificateForm.student_record_id = student_record.id;
				this.selected_student = student;
				this.selected_student_record = student_record;
				this.students = [];
				this.studentFilter.name = '';
                this.updateTemplate();
			},
			searchEmployee(page){
				let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.employeeFilter);
				axios.get('/api/employee/search/name?page=' + page + url)
					.then(response => {
						this.employees = response;

						if(! response.total) {
							loader.hide();
							return toastr.error(i18n.general.no_search_result_found);
						}
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			selectEmployee(employee){
				this.certificateForm.employee_id = employee.id;
				this.selected_employee = employee;
				this.employees = [];
				this.employeeFilter.name = '';
                this.updateTemplate();
			},
			updateTemplate(){
				let certificate_template = this.certificate_template_details.find(o => o.id == this.certificateForm.certificate_template_id);

				if (typeof certificate_template == 'undefined')
					return;

				let body = certificate_template.body;

				body = this.updateCustomFields(body);

				if (!this.selected_student && !this.selected_employee) {
					this.certificateForm.body = body;
					return;
				}

				this.certificateForm.body = (this.selected_student) ? this.updateStudentRecord(body) : this.updateEmployeeRecord(body);
			},
			updateStudentRecord(body) {
				let student = this.selected_student;
            	let student_record = this.selected_student_record;
            	let parent = student.parent;

            	if (! student_record || ! parent)
            		return body;

            	let name = this.getStudentName(student);

            	return body.replace("#NAME#", name)
            		.replace("#FIRST_NAME#", student.first_name)
            		.replace("#LAST_NAME#", student.last_name || '')
            		.replace("#FATHER_NAME#", parent.father_name)
            		.replace("#MOTHER_NAME#", parent.mother_name)
            		.replace("#COURSE#", student_record.batch.course.name)
            		.replace("#BATCH#", student_record.batch.name)
            		.replace("#SESSION#", helper.getDefaultAcademicSession().name)
            		.replace("#DATE_OF_BIRTH#", helper.formatDate(student.date_of_birth))
            		.replace("#ADMISSION_NUMBER#", helper.getAdmissionNumber(student_record.admission))
            		.replace("#DATE_OF_ADMISSION#", helper.formatDate(student_record.admission.date_of_admission))
            		.replace("#ROLL_NUMBER#", helper.getRollNumber(student_record))
            		.replace("#CURRENT_DATE#", helper.defaultDate())
            		.replace("#CURRENT_TIME#", helper.defaultTime())
            		.replace("#CURRENT_DATE_TIME#", helper.defaultDateTime())
            		.replace("#PRESENT_ADDRESS#", student.present_address)
            		.replace("#PERMANENT_ADDRESS#", student.permanent_address);

			},
			updateEmployeeRecord(body) {
				let employee = this.selected_employee;

            	return body.replace("#NAME#", this.getEmployeeName(employee))
            		.replace("#FIRST_NAME#", employee.first_name)
            		.replace("#LAST_NAME#", employee.last_name)
            		.replace("#FATHER_NAME#", employee.father_name)
            		.replace("#MOTHER_NAME#", employee.mother_name)
            		.replace("#DATE_OF_BIRTH#", helper.formatDate(employee.date_of_birth))
            		.replace("#EMPLOYEE_CODE#", this.getEmployeeCode(employee))
            		.replace("#DESIGNATION#", helper.getEmployeeDesignationOnDate(employee))
            		.replace("#DATE_OF_JOINING#", helper.getEmployeeDateOfJoining(employee))
            		.replace("#CURRENT_DATE#", helper.defaultDate())
            		.replace("#CURRENT_TIME#", helper.defaultTime())
            		.replace("#CURRENT_DATE_TIME#", helper.defaultDateTime())
            		.replace("#PRESENT_ADDRESS#", employee.present_address)
            		.replace("#PERMANENT_ADDRESS#", employee.permanent_address);
			},
			updateCustomFields(body) {
				this.certificateForm.custom_fields.forEach(custom_field => {
					if (custom_field.value)
						body = body.replace('#'+custom_field.name+'#', custom_field.value);
				})

				return body;
			},
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.certificateForm.post('/api/certificate')
                    .then(response => {
                        toastr.success(response.message);
                        this.type = null;
                        this.selected_certificate_template = null;
                        this.certificateForm.custom_fields = [];
                        this.selected_student = null;
                        this.selected_student_record = null;
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
                axios.get('/api/certificate/'+this.uuid)
                    .then(response => {
                        this.certificateForm.certificate_template_id = response.certificate.certificate_template_id;
                        this.selected_certificate_template = (response.certificate.certificate_template_id) ? {id: response.certificate.certificate_template_id, name: response.certificate.certificate_template.name} : null;
                        this.certificateForm.student_record_id = response.certificate.student_record_id;
                        this.certificateForm.employee_id = response.certificate.employee_id;
                        this.type = response.certificate.certificate_template.type;

                        if (this.type == 'student') {
                        	this.selected_student = response.certificate.student_record.student;
                        	this.selected_student.student_records = [response.certificate.student_record];
                        	this.selected_student.parent = response.certificate.student_record.student.parent;
                        } else if (this.type == 'employee') {
                        	this.selected_employee = response.certificate.employee;
                        }

                        this.certificateForm.body = response.certificate.body;
                        this.certificateForm.custom_fields = [];

                        if (response.certificate.options && response.certificate.options.custom_fields) {
                        	let custom_fields = [];
	                        response.certificate.options.custom_fields.forEach(custom_field => {
	                        	custom_fields.push({
	                        		name: custom_field.name,
	                        		value: custom_field. value
	                        	});
	                        });
	                        this.certificateForm.custom_fields = custom_fields;
                        }

	                    loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/academic/certificate');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.certificateForm.patch('/api/certificate/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/academic/certificate');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		},
		computed: {

		},
		filters: {

		},
		watch: {
			'certificateForm.custom_fields': {
				handler(val) {
					this.updateTemplate()
				},
      			deep: true
      		}
		}
	}
</script>