<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.registration')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="registration.student">({{getStudentName(registration.student)+' - '+trans('student.registration_no')+': '+registration.id}}) </span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/student/registration/card-view" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.registration')}}</span></router-link>
                        <router-link :to="`/student/${registration.student.uuid}`" class="btn btn-info btn-sm"><i class="fas fa-user"></i> <span class="d-none d-sm-inline">{{trans('student.student_detail')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-6">
                	<div class="card border-right">
                		<div class="card-body">
                			<h4 class="card-title m-3"><span class="d-none d-sm-inline">{{trans('student.registration_detail')}}</span>
                                <div class="dropdown pull-right" v-if="registration.registration_fee && registration.registration_fee_status == 'paid' && registration.transactions.length">
                                    <button type="button" class="btn btn-info btn-xs" href="#" role="button" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                        <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline">{{trans('finance.receipt')}}</span>
                                    </button>
                                    <div class="dropdown-menu">
                                        <button class="dropdown-item custom-dropdown-menu" @click="showReceiptModal = true"><i class="fas fa-arrow-circle-right"></i> {{trans('finance.receipt_detail')}}</button>
                                        <button class="dropdown-item custom-dropdown-menu" @click="printReceipt"><i class="fas fa-print"></i> {{trans('finance.print_receipt')}}</button>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-info btn-xs pull-right " v-if="registration.status == 'pending'" @click="editModal = true"><i class="fas fa-edit"></i> <span class="d-none d-sm-inline">{{trans('general.edit')}}</span></button>
                                <button type="button" class="btn btn-danger btn-xs pull-right " v-if="registration.status == 'pending' && hasPermission('delete-registration')" :key="registration.id" v-confirm="{ok: confirmDelete(registration)}" v-tooltip="trans('student.delete_registartion')"><i class="fas fa-trash"></i> <span class="d-none d-sm-inline">{{trans('general.delete')}}</span></button>
                			</h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                        	<td>{{trans('student.name')}}</td>
                                        	<td>
                                                {{getStudentName(registration.student)}}
                                                <span v-if="registration.is_online">
                                                    <span class="label label-info">{{trans('student.online_registration')}}</span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('student.registration_status')}}</td>
                                            <td>
                                                <span v-for="status in getRegistrationStatus(registration)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="registration.rejection_remarks && registration.status == 'rejected'">
                                            <td>{{trans('student.rejection_remarks')}}</td>
                                            <td class="text-danger">{{registration.rejection_remarks}}</td>
                                        </tr>
                                        <tr @mouseover="show_edit = true" @mouseout="show_edit = false">
                                        	<td>{{trans('academic.course')}}</td>
                                        	<td>
                                                {{registration.course.name+' '+getSession}}
                                            </td>
                                        </tr>
                                        <tr v-if="registration.status == 'allotted'">
                                            <td>{{trans('academic.batch')}}</td>
                                            <td>{{registration.admission.batch.name}}
                                            </td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.father_name')}}</td>
                                        	<td>{{registration.student.parent ? registration.student.parent.father_name : ''}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.mother_name')}}</td>
                                        	<td>{{registration.student.parent ? registration.student.parent.mother_name : ''}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.contact_number')}}</td>
                                        	<td>{{registration.student.contact_number}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.gender')}}</td>
                                        	<td>{{trans('list.'+registration.student.gender)}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.date_of_birth')}}</td>
                                        	<td>{{registration.student.date_of_birth | moment}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.date_of_registration')}}</td>
                                        	<td>{{registration.date_of_registration | moment}}</td>
                                        </tr>
                                        <tr v-if="registration.previous_institute_id">
                                            <td>{{trans('student.previous_institute')}}</td>
                                            <td>{{registration.previous_institute.name}}</td>
                                        </tr>
                                        <tr @mouseover="show_edit = true" @mouseout="show_edit = false">
                                        	<td>{{trans('student.registration_fee')}}</td>
                                        	<td>
                                                <span v-if="registration.registration_fee">
                                                    {{formatCurrency(registration.registration_fee)}}
                                                    <span v-if="registration.registration_fee_status == 'paid'">
                                                        <span class="label label-success">{{trans('student.registration_fee_status_paid')}}
                                                            {{trans('general.on')}}
                                                            <span v-if="registration.transactions.length">
                                                                {{transaction.date | moment}}
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span v-else class="label label-danger">{{trans('student.registration_fee_status_unpaid')}}</span>
                                                </span>
                                                <span v-else>-</span>
                                        	</td>
                                        </tr>
                                        <tr v-if="registration.registration_remarks">
                                        	<td>{{trans('student.registration_remarks')}}</td>
                                        	<td>{{registration.registration_remarks}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('general.created_at')}}</td>
                                        	<td>{{registration.student.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('general.updated_at')}}</td>
                                        	<td>{{registration.student.updated_at | momentDateTime}}</td>
                                        </tr>
                                        <tr v-if="registration.is_online" v-for="custom_field in online_registration_custom_fields">
                                            <td>{{custom_field.name}}</td>
                                            <td>{{getCustomFieldValue(custom_field)}}</td>
                                        </tr>
                                        <tr v-for="custom_field in registration_custom_fields">
                                            <td>{{custom_field.name}}</td>
                                            <td>{{getCustomFieldValue(custom_field)}}</td>
                                        </tr>
                                   	</tbody>
                                </table>
                            </div>
                		</div>
                	</div>
                </div>
                <div class="col-12 col-sm-6 p-0">
                    <template v-if="registration.registration_fee">
                        <fee-form v-if="registration.registration_fee_status == 'unpaid' && hasPermission('make-registration-fee-payment')" :registration="registration" @completed="getRegistration"></fee-form>
                    </template>
                    <template v-if="(!registration.registration_fee || (registration.registration_fee && registration.registration_fee_status == 'paid')) && registration.status != 'allotted' && hasPermission('change-registration-status')">
                        <action-form :registration="registration" @completed="getRegistration"></action-form>
                    </template>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="editModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('student.edit_registration')}}
                                <span class="float-right pointer" @click="editModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <edit-registration-form :registration="registration" @completed="getRegistration" @close="editModal = false"></edit-registration-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="modal" v-if="showReceiptModal && registration.registration_fee && registration.registration_fee_status == 'paid' && registration.transactions.length">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('finance.receipt_detail')}}
                                <span class="float-right pointer" @click="showReceiptModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <td>{{trans('finance.receipt_no')}}</td>
                                                <td>#{{transaction.prefix+transaction.number}}</td>
                                                <td>{{trans('finance.account')}}</td>
                                                <td>{{transaction.account.name}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('finance.amount')}}</td>
                                                <td>{{formatCurrency(transaction.amount)}}</td>
                                                <td>{{trans('finance.date')}}</td>
                                                <td>{{transaction.date | moment}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('finance.payment_method')}}</td>
                                                <td>
                                                    {{transaction.payment_method.name}}
                                                    <span v-if="transaction.instrument_number"><br />{{trans('finance.instrument_number')}}: {{transaction.instrument_number}}</span>
                                                    <span v-if="transaction.instrument_date"><br />{{trans('finance.instrument_date')}}: <span>{{transaction.instrument_date | moment}}</span></span>
                                                    <span v-if="transaction.instrument_clearing_date"><br />{{trans('finance.instrument_clearing_date')}}: <span>{{transaction.instrument_clearing_date | moment}}</span></span>
                                                    <span v-if="transaction.instrument_bank_detail"><br />{{trans('finance.instrument_bank_detail')}}: {{transaction.instrument_bank_detail}}</span>
                                                    <span v-if="transaction.reference_number"><br />{{trans('finance.reference_number')}}: {{transaction.reference_number}}</span>
                                                </td>
                                                <td>{{trans('finance.remarks')}}</td>
                                                <td>{{transaction.remarks}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('finance.date_of_entry')}}</td>
                                                <td>{{transaction.created_at | momentDateTime}}</td>
                                                <td>{{trans('finance.entry_by')}}</td>
                                                <td>{{getEmployeeName(transaction.user.employee)}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" class="btn btn-block btn-danger" v-if="registration.status == 'pending'" @click="cancel_fee_payment = true">{{trans('student.cancel_fee_payment')}}</button>
                                <template v-if="cancel_fee_payment">
                                    <form @submit.prevent="cancelPayment" class="m-t-20" @keydown="cancelPaymentForm.errors.clear($event.target.name)" v-if="registration.status == 'pending'">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <autosize-textarea v-model="cancelPaymentForm.cancellation_remarks" rows="2" name="cancellation_remarks" :placeholder="trans('student.cancellation_remarks')"></autosize-textarea>
                                                    <show-error :form-name="cancelPaymentForm" prop-name="cancellation_remarks"></show-error>
                                                </div>
                                                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                                            </div>
                                        </div>
                                    </form>
                                </template>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import editRegistrationForm from './edit'
    import feeForm from './fee-form'
    import actionForm from './action-form'

	export default {
        components : { feeForm,actionForm,editRegistrationForm },
        data() {
            return {
                id:this.$route.params.id,
                registration: {
                	student: {

                	},
                	course: {

                	},
                    transaction: null
                },
                transaction: {},
                show_edit: false,
                cancel_fee_payment: false,
                cancelPaymentForm: new Form({
                    cancellation_remarks: ''
                }),
                registration_custom_fields: [],
                online_registration_custom_fields: [],
                editModal: false,
                showReceiptModal: false
            }
        },
        mounted(){
            if(!helper.hasPermission('list-registration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getRegistration();
        },
        methods: {
        	getRegistration(){
                let loader = this.$loading.show();
        		axios.get('/api/registration/'+this.id)
        			.then(response => {
        				this.registration_custom_fields = response.registration_custom_fields;
                        this.online_registration_custom_fields = response.online_registration_custom_fields;
                        this.registration = response.registration;
                        this.transaction = (response.registration.transactions.length) ? response.registration.transactions[0] : null;
                        loader.hide();
        			})
        			.catch(error => {
                        loader.hide();
        				helper.showErrorMsg(error);
        				this.$router.push('/dashboard');
        			})
        	},
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            formatCurrency(amount){
            	return helper.formatCurrency(amount);
            },
            getRegistrationStatus(registration){
            	return helper.getRegistrationStatus(registration);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getCustomFieldValue(custom_field) {
                return helper.getCustomFieldValue(this.registration.options.custom_values, custom_field.id);
            },
            cancelPayment(){
                let loader = this.$loading.show();
                this.cancelPaymentForm.post('/api/registration/'+this.id+'/transaction/'+this.transaction.id+'/cancel')
                    .then(response => {
                        toastr.success(response.message);
                        this.getRegistration();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            confirmDelete(registration){
                return dialog => this.deleteRegistration(registration);
            },
            deleteRegistration(registration){
                let loader = this.$loading.show();
                axios.delete('/api/registration/'+registration.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/student/registration');
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            printReceipt(){
                let loader = this.$loading.show();
                axios.post('/api/registration/'+this.id+'/fee/'+this.transaction.id+'/print')
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
        computed:{
        	getSession(){
        		return helper.getDefaultAcademicSession().name;
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

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>