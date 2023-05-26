<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.view_transfer_certificate')}}
                        <button class="btn btn-info btn-sm" @click="$router.push('/student/termination')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.termination')}}</span></button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-20">
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
			        </div>
			        <template v-if="transfer_certificate">
						<div class="row">
				            <div class="col-12 col-sm-3">
				            	<p>{{trans('academic.transfer_certificate_format')}}: <strong>{{transferCertificateForm.transfer_certificate_format}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">
				            	<p>{{trans('student.transfer_certificate_number')}}: <strong>{{getTransferCertificateNumber}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">
				            	<p>{{trans('student.transfer_certificate_book_number')}}: <strong>{{getTransferCertificateBookNumber}}</strong></p>
				            </div>
				        </div>
						<div class="row">
				            <div class="col-12 col-sm-3">
				            	<p>{{trans('student.date_of_application')}}: <strong>{{transferCertificateForm.date_of_application | moment}}</strong></p>
				            </div>
				            <div class="col-12 col-sm-3">
				            	<p>{{trans('student.date_of_issue')}}: <strong>{{transferCertificateForm.date_of_issue | moment}}</strong></p>
				            </div>
				        </div>
				        <div class="row">
				            <div class="col-12" :key="variable.name" v-for="variable in transferCertificateForm.variables">
				            	<p>{{trans('student.tc_props.'+variable.name)}}: <strong>{{variable.value}}</strong></p>
				            </div>
				            <div class="col-12">
				            	<p>{{trans('student.transfer_certificate_memo')}}: <strong>{{transferCertificateForm.memo}}</strong></p>
				            </div>
				        </div>
			        </template>
			        <template v-else>
			        	<p class="alert alert-danger">{{trans('student.no_tc_prepared')}}</p>
			        </template>
			        <div class="row">
			            <div class="col-12 text-right">
		                	<router-link :to="`/student/termination/${uuid}/${record_id}/edit`" class="btn btn-info waves-effect waves-light">{{trans('general.edit')}}</router-link>
		                	<button type="button" @click="print" class="btn btn-success waves-effect waves-light">{{trans('general.print')}}</button>
		                </div>
		            </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				student_record: {},
				uuid: this.$route.params.uuid,
				record_id: this.$route.params.record_id,
				transfer_certificate_formats: [],
				transfer_certificate: {},
				transferCertificateForm: new Form({
					transfer_certificate_format: '',
					date_of_application: '',
					date_of_issue: '',
					number: '',
					book_number: '',
					prefix: '',
					variables: [],
					memo: ''
				},false),
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
                        this.transferCertificateForm.prefix = helper.getConfig('transfer_certificate_prefix');

                        this.transfer_certificate = response.student_record.transfer_certificate;

                        if (this.transfer_certificate) {
                        	this.transferCertificateForm.date_of_application = this.transfer_certificate.date_of_application;
                        	this.transferCertificateForm.date_of_issue = this.transfer_certificate.date_of_issue;
                        	this.transferCertificateForm.prefix = this.transfer_certificate.prefix;
                        	this.transferCertificateForm.number = this.transfer_certificate.number;
                        	this.transferCertificateForm.book_number = this.transfer_certificate.options.hasOwnProperty("book_number") ? this.transfer_certificate.options.book_number : '';
                        	this.transferCertificateForm.transfer_certificate_format = this.transfer_certificate.format;

	                        let transfer_certificate_format_id = this.transfer_certificate.format;
	                        let transfer_certificate_format = this.transfer_certificate_formats.find(o => o.id == transfer_certificate_format_id);

	                        this.selected_transfer_certificate_format = transfer_certificate_format || null; 
			                this.transferCertificateForm.variables = [];
			                this.transferCertificateForm.variables = this.transfer_certificate.options.transfer_certificate;
                        }

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getAdmissionNumber(student_record){
                return helper.getAdmissionNumber(student_record.admission);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/student/'+this.uuid+'/transfer-certificate/'+this.record_id+'/print')
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		},
		computed: {
            getTransferCertificateNumber() {
                return helper.getTransferCertificateNumber(this.transfer_certificate);
            },
            getTransferCertificateBookNumber() {
                return this.transferCertificateForm.book_number;
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