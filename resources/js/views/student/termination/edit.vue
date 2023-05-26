<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.edit_transfer_certificate')}}
                        <button class="btn btn-info btn-sm" @click="$router.push('/student/termination')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.termination')}}</span></button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
				<form @submit.prevent="submit" @keydown="transferCertificateForm.errors.clear($event.target.name)">
	                <div class="card-body p-t-20">
						<div class="row" v-if="student_record.id">
				            <div class="col-12 col-sm-3">	
				            	<p>{{trans('student.name')}}: <strong>{{getStudentName(student_record.student)}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">	
				            	<p>{{trans('student.admission_number')}}: <strong>{{getAdmissionNumber(student_record)}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">	
				            	<p>{{trans('academic.batch')}}: <strong>{{student_record.batch.course.name+' '+student_record.batch.name}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">	
				            	<p>{{trans('student.tc_props.total_working_days')}}: <strong>{{working_days}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">	
				            	<p>{{trans('student.tc_props.total_present_days')}}: <strong>{{attendance}}</strong></p>
				            </div>
				        </div>
						<div class="row">
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('academic.transfer_certificate_format')}}</label>
				                    <v-select label="name" v-model="selected_transfer_certificate_format" name="transfer_certificate_format" id="transfer_certificate_format" :options="transfer_certificate_formats" :placeholder="trans('academic.select_transfer_certificate_format')" @select="onTransferCertificateFormatSelect" @close="transferCertificateForm.errors.clear('transfer_certificate_format')" @remove="onTransferCertificateFormatRemove">
				                        <div class="multiselect__option" slot="afterList" v-if="!transfer_certificate_formats.length">
				                            {{trans('general.no_option_found')}}
				                        </div>
				                    </v-select>
				                    <show-error :form-name="transferCertificateForm" prop-name="transfer_certificate_format"></show-error>
				                </div>
				            </div>
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('student.date_of_application')}}</label>
				                    <datepicker v-model="transferCertificateForm.date_of_application" name="date_of_application" :bootstrapStyling="true" @selected="transferCertificateForm.errors.clear('date_of_application')" :placeholder="trans('student.date_of_application')"></datepicker>
				                    <show-error :form-name="transferCertificateForm" prop-name="date_of_application"></show-error>
				                </div>
				            </div>
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('student.date_of_issue')}}</label>
				                    <datepicker v-model="transferCertificateForm.date_of_issue" name="date_of_issue" :bootstrapStyling="true" @selected="transferCertificateForm.errors.clear('date_of_issue')" :placeholder="trans('student.date_of_issue')"></datepicker>
				                    <show-error :form-name="transferCertificateForm" prop-name="date_of_issue"></show-error>
				                </div>
				            </div>
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('student.transfer_certificate_book_number')}}</label>
				                    <input class="form-control" type="text" v-model="transferCertificateForm.book_number" name="book_number" :placeholder="trans('student.transfer_certificate_book_number')">
				                    <show-error :form-name="transferCertificateForm" prop-name="book_number"></show-error>
				                </div>
				            </div>
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('student.transfer_certificate_number')}}</label>
				                    <div class="row">
				                        <div class="col-12 col-sm-4">
				                            <input class="form-control" type="text" v-model="transferCertificateForm.prefix" name="prefix" :placeholder="trans('student.transfer_certificate_prefix')">
				                        </div>
				                        <div class="col-12 col-sm-8">
				                            <input class="form-control" type="text" v-model="transferCertificateForm.number" name="number" :placeholder="trans('student.transfer_certificate_number')">
				                        </div>
				                    </div>
				                    <show-error :form-name="transferCertificateForm" prop-name="number"></show-error>
				                </div>
				            </div>
				        </div>
				        <div class="row">
				            <div class="col-12" :key="variable.name" v-for="variable in transferCertificateForm.variables">
				                <div class="form-group">
				                    <label for="">{{trans('student.tc_props.'+variable.name)}}</label>
				                    <input class="form-control" type="text" v-model="variable.value" :placeholder="trans('student.tc_props.'+variable.name)">
				                </div>
				            </div>
				        </div>
				        <div class="row">
				            <div class="col-12">
				                <div class="form-group">
				                    <label for="">{{trans('student.transfer_certificate_memo')}}</label>
				                    <autosize-textarea v-model="transferCertificateForm.memo" rows="2" name="memo" :placeholder="trans('student.transfer_certificate_memo')"></autosize-textarea>
				                    <show-error :form-name="transferCertificateForm" prop-name="memo"></show-error>
				                </div>
				            </div>
				        </div>
					</div>
		            <div class="card-footer text-right">
		                <router-link to="/student/termination" class="btn btn-danger waves-effect waves-light">{{trans('general.cancel')}}</router-link>
		                <button type="submit" class="btn btn-info waves-effect waves-light">
		                    <span>{{trans('general.save')}}</span>
		                </button>
		            </div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				student_record: {},
				uuid: this.$route.params.uuid,
				record_id: this.$route.params.record_id,
				transfer_certificate_formats: [],
				transferCertificateForm: new Form({
					transfer_certificate_format: '',
					date_of_application: '',
					date_of_issue: '',
					book_number: '',
					number: '',
					prefix: '',
					variables: [],
					memo: ''
				},false),
				selected_transfer_certificate_format: null,
                numbers: [],
                working_days: 0,
                attendance: 0
			}
		},
		mounted() {
            if(!helper.hasPermission('terminate-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
		},
		methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid+'/transfer-certificate/'+this.record_id)
                    .then(response => {
                        this.student_record = response.student_record;
                        this.transfer_certificate_formats = response.transfer_certificate_formats;
                        this.numbers = response.numbers;
                        this.working_days = response.working_days;
                        this.attendance = response.attendance;
                        this.transferCertificateForm.prefix = helper.getConfig('transfer_certificate_prefix');

                        let transfer_certificate = response.student_record.transfer_certificate;

                        if (transfer_certificate) {
                        	this.transferCertificateForm.date_of_application = transfer_certificate.date_of_application;
                        	this.transferCertificateForm.date_of_issue = transfer_certificate.date_of_issue;
                        	this.transferCertificateForm.prefix = transfer_certificate.prefix;
                        	this.transferCertificateForm.number = transfer_certificate.number;
                        	this.transferCertificateForm.book_number = transfer_certificate.options.hasOwnProperty("book_number") ? transfer_certificate.options.book_number : '';
                        	this.transferCertificateForm.transfer_certificate_format = transfer_certificate.format;

	                        let transfer_certificate_format_id = transfer_certificate.format;
	                        let transfer_certificate_format = this.transfer_certificate_formats.find(o => o.id == transfer_certificate_format_id);

	                        this.selected_transfer_certificate_format = transfer_certificate_format || null; 
			                this.transferCertificateForm.variables = [];
			                this.transferCertificateForm.variables = transfer_certificate.options.transfer_certificate;
                        }

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            submit(){
                let loader = this.$loading.show();
                this.transferCertificateForm.post('/api/student/'+this.uuid+'/transfer-certificate/'+this.record_id)
                    .then(response => {
                    	toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onTransferCertificateFormatSelect(selectedOption){
                this.transferCertificateForm.transfer_certificate_format = selectedOption.id;
                this.transferCertificateForm.variables = [];
                selectedOption.variables.forEach(variable => {
                	this.transferCertificateForm.variables.push({
                		name: variable,
                		value: ''
                	})
                });
            },
            onTransferCertificateFormatRemove() {
            	this.transferCertificateForm.transfer_certificate_format = '';
            	this.transferCertificateForm.variables = [];
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getAdmissionNumber(student_record){
                return helper.getAdmissionNumber(student_record.admission);
            }
		},
        watch: {
            'transferCertificateForm.prefix': function(val) {
                let number = this.numbers.find(o => o.prefix == val);

                if (typeof number == 'undefined')
                    this.transferCertificateForm.number = helper.formatWithPadding(1,helper.getConfig('transfer_certificate_digit'));
                else 
                    this.transferCertificateForm.number = helper.formatWithPadding((number.number + 1),helper.getConfig('transfer_certificate_digit'));
            }
        }
	}
</script>