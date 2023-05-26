<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_detail')}} <small v-if="student_record.student">{{getStudentName(student_record.student)}}  ({{student_record.academic_session.name}})</small>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/student/list" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.student')}}</span></router-link>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/student/'+student_record.student.uuid)"><i class="fas fa-arrow-circle-right"></i> {{trans('student.view_detail')}}</button>
                                <button class="dropdown-item custom-dropdown" v-if="hasPermission('set-fee')" @click="$router.push('/student/'+student_record.student.uuid+'/fee/'+student_record.id+'/set')"><i class="fas fa-file"></i> {{trans('student.set_fee')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body py-4">
                            <student-summary :student-record="student_record" class="border-bottom"></student-summary>
                        </div>
                        <div class="card-body">
                            <div class="row justify-content-end px-4" v-if="hasPermission('customize-fee-date')">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <datepicker v-model="feePayment.date" :bootstrapStyling="true" :placeholder="trans('student.date_of_payment')"></datepicker>
                                    </div>
                                </div>
                            </div>
                            <template v-for="fee_allocation_group in student_record.fee_allocation.fee_allocation_groups">
                                <h4 class="card-title m-l-20">{{fee_allocation_group.fee_group.name}}</h4>
                                <div class="table-responsive p-3">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>{{trans('finance.fee_installment_title')}}</th>
                                                <th>{{trans('finance.fee_installment_due_date')}}</th>
                                                <th v-for="fee_head in fee_allocation_group.fee_group.fee_heads" v-text="fee_head.name"></th>
                                                <th>
                                                    <span v-if="fee_allocation_group.fee_group.options.has_transport">{{trans('transport.circle')}}</span>
                                                </th>
                                                <th>
                                                    <span v-if="fee_allocation_group.fee_group.options.has_transport">{{trans('transport.fee')}}</span>
                                                </th>
                                                <th>{{trans('finance.late_fee')}}</th>
                                                <th>{{trans('finance.installment_total')}}</th>
                                                <th>{{trans('finance.other')}}</th>
                                                <th>{{trans('finance.paid')}}</th>
                                                <th>{{trans('finance.balance')}}</th>
                                                <th v-if="hasPermission('make-fee-payment')">{{trans('finance.pay_fee')}}</th>
                                                <th v-else>{{trans('finance.fee_status')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="fee_installment in fee_allocation_group.fee_installments">
                                                <td>{{fee_installment.title}}</td>
                                                <td>{{getInstallmentDueDate(fee_installment)}}
                                                    <template v-if="isInstallmentOverdue(fee_installment)">
                                                        <br />
                                                        <span class="label label-danger">{{trans('finance.fee_overdue_day', {day: isInstallmentOverdue(fee_installment)})}}</span>
                                                    </template>
                                                </td>
                                                <td v-for="fee_head in fee_allocation_group.fee_group.fee_heads">
                                                    <span v-if="checkInstallmentConcession(fee_installment, fee_head.id)" style="text-decoration: line-through;">{{getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head.id)}}</span>
                                                    {{getInstallmentFeeAmount(fee_installment, fee_head.id)}}
                                                </td>
                                                <td>
                                                    <span v-if="fee_allocation_group.fee_group.options.has_transport">{{getTransportCircleName(fee_installment)}}</span>
                                                </td>
                                                <td>
                                                    <span v-if="fee_allocation_group.fee_group.options.has_transport">{{getTransportFeeAmount(fee_installment)}}</span>
                                                </td>
                                                <td>{{getLateFeeAmount(fee_installment)}}</td>
                                                <td>{{getInstallmentTotalAmount(fee_installment)}}</td>
                                                <td>{{getInstallmentOtherAmount(fee_installment)}}</td>
                                                <td>{{getInstallmentPaidAmount(fee_installment)}}</td>
                                                <td>{{getInstallmentBalanceAmount(fee_installment)}}</td>
                                                <td v-if="hasPermission('make-fee-payment')">
                                                    <span v-if="getInstallmentStatus(fee_installment) == 'unpaid'">
                                                        <button type="button" class="btn btn-info btn-sm" @click="showInstallmentDetail(fee_allocation_group,fee_installment)">{{trans('finance.pay_fee')}}</button>
                                                    </span>
                                                    <span v-else-if="getInstallmentStatus(fee_installment) == 'cancelled'">
                                                        <span class="label label-danger">{{trans('finance.fee_status_cancelled')}}</span>
                                                    </span>
                                                    <span v-else>
                                                        <div class="btn-group">
                                                            <template v-if="getInstallmentStatus(fee_installment) == 'paid'">
                                                                <button class="btn btn-sm btn-success">{{trans('student.fee_status_paid')}}</button>
                                                                <button type="button" class="btn btn-sm btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <span class="sr-only">Toggle Dropdown</span>
                                                                </button>
                                                            </template>
                                                            <template v-if="getInstallmentStatus(fee_installment) == 'partially_paid'">
                                                                <button class="btn btn-sm btn-warning" @click="showInstallmentDetail(fee_allocation_group,fee_installment)">{{trans('student.fee_status_partially_paid')}}</button>
                                                                <button type="button" class="btn btn-sm btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <span class="sr-only">Toggle Dropdown</span>
                                                                </button>
                                                            </template>

                                                            <div class="dropdown-menu">
                                                                <button class="dropdown-item custom-dropdown-menu" @click.prevent="setTransaction(fee_installment)" v-if="getInstallmentPaid(fee_installment)">
                                                                    <i class="fas fa-arrow-circle-right"></i> {{trans('finance.receipt_detail')}}
                                                                </button>
                                                                <button class="dropdown-item custom-dropdown-menu" :key="fee_installment.id" v-confirm="{ok: confirmEmptyReceiptDelete(fee_installment)}" v-else-if="!getInstallmentPaid(fee_installment) && hasPermission('cancel-fee-payment')">
                                                                    <i class="fas fa-arrow-circle-right"></i> {{trans('student.cancel_fee_payment')}}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </td>
                                                <td v-else>
                                                    <span v-if="getInstallmentStatus(fee_installment) == 'unpaid'">{{trans('student.fee_status_unpaid')}}</span>
                                                    <span v-else>{{trans('student.fee_status_paid')}}</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <th colspan="2">{{trans('general.total')}}</th>
                                                <th v-for="fee_head in fee_allocation_group.fee_group.fee_heads">
                                                    {{getTotalFee(fee_allocation_group, fee_head.id)}}
                                                </th>
                                                <th></th>
                                                <th>
                                                    <span v-if="fee_allocation_group.fee_group.options.has_transport">{{getTransportFeeTotal(fee_allocation_group)}}</span>
                                                </th>
                                                <th>{{getLateFeeTotal(fee_allocation_group)}}</th>
                                                <th>{{getInstallmentGrandTotal(fee_allocation_group)}}</th>
                                                <th>{{getInstallmentGrandOther(fee_allocation_group)}}</th>
                                                <th>{{getInstallmentPaidGrandTotal(fee_allocation_group)}}</th>
                                                <th>{{getInstallmentBalanceGrandTotal(fee_allocation_group)}}</th>
                                                <th v-if="hasPermission('make-fee-payment')"></th>
                                                <th v-else></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>


                            <div class="table-responsive p-3">
                                <table class="table table">
                                    <thead>
                                        <tr>
                                            <th>{{trans('finance.installment_total')}}</th>
                                            <th>{{trans('finance.other')}}</th>
                                            <th>{{trans('finance.paid')}}</th>
                                            <th>{{trans('finance.balance')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{finalTotal}}</td>
                                            <td>{{finalOther}}</td>
                                            <td>{{finalPaid}}</td>
                                            <td>{{finalBalance}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="row justify-content-md-center" v-if="resetFeeOption && hasPermission('set-fee')">
                                <div class="col-4">
                                    <button class="btn btn-danger btn-block" :key="student_record.id" v-confirm="{ok: confirmResetFee(student_record)}" v-tooltip="trans('student.reset_fee')">{{trans('student.reset_fee')}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <fee-payment-form v-if="feePaymentForm && hasNotAnyRole(['parent','student']) && hasPermission('make-fee-payment')" :uuid="uuid" :id="record_id" :fee-payment="feePayment" @completed="paymentMade" @closeFeePaymentForm="feePaymentForm = false"></fee-payment-form>
        <fee-payment-parent-form v-if="feePaymentForm && hasAnyRole(['parent','student']) && hasPermission('make-fee-payment')" :uuid="uuid" :id="record_id" :fee-payment="feePayment" @completed="paymentMade" @closeFeePaymentForm="feePaymentForm = false"></fee-payment-parent-form>

        <transition name="modal" v-if="feePaymentShow">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('finance.fee_payment')}}
                                <span class="float-right pointer" @click="feePaymentShow = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div style="max-height:600px;">
                                    <fee-detail :uuid="uuid" :rid="record_id" :id="student_fee_record_id" @completed="getRecord"></fee-detail>
                                    <div class="clearfix"></div>
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import studentSummary from './../summary'
    import feePaymentForm from './payment'
    import feePaymentParentForm from './payment-parent'
    import feeDetail from './fee-detail'

    export default {
        components : {studentSummary,feePaymentForm,feePaymentParentForm,feeDetail},
        data() {
            return {
                uuid:this.$route.params.uuid,
                record_id:this.$route.params.record_id,
                student_record: {
                    fee_allocation: {
                        fee_allocation_groups: []
                    }
                },
                feePayment: {
                    fee_group_name: '',
                    fee_payment_installment_id: '',
                    student_fee_record_id: '',
                    date: helper.today(),
                    installments: [],
                    amount: 0
                },
                fee: {
                    groups: []
                },
                feePaymentForm: false,
                feePaymentShow: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-student-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getRecord();
            helper.showDemoNotification(['student']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasAnyRole(roles){
                return helper.hasAnyRole(roles);
            },
            hasNotAnyRole(roles){
                return helper.hasNotAnyRole(roles);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getRecord(){
                let loader = this.$loading.show();
                this.feePaymentForm = false;
                this.feePaymentShow = false;
                axios.get('/api/student/'+this.uuid+'/fee/'+this.record_id)
                    .then(response => {
                        this.student_record = response.student_record;

                        if (! this.student_record.student_fee_records.length) {
                            this.$router.push('/student/'+this.uuid); 
                        }

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        if (this.hasAnyRole(['student','parent'])) {
                            this.$router.push('/student/list')
                        } else {
                           this.$router.push('/student/'+this.uuid+'/fee/'+this.record_id+'/create'); 
                        }
                    });
            },
            calculate(){
                this.fee = {
                    groups: []
                };
                this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    let installments = [];
                    let heads = [];
                    let foots = [];
                    heads.push(i18n.finance.fee_installment_title);
                    heads.push(i18n.finance.fee_installment_due_date);

                    fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                        heads.push(fee_head.name);
                    });

                    if (fee_allocation_group.fee_group.options.has_transport) {
                        heads.push(i18n.transport.circle);
                        heads.push(i18n.transport.fee);
                    }

                    foots.push(i18n.finance.total);
                    foots.push('');

                    heads.push(i18n.finance.late_fee);
                    heads.push(i18n.finance.installment_total);
                    heads.push(i18n.finance.other);
                    heads.push(i18n.finance.paid);
                    heads.push(i18n.finance.balance);
                    heads.push(i18n.finance.fee_status);

                    fee_allocation_group.fee_installments.forEach(fee_installment => {
                        let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                        
                        let installment_data = [];
                        installment_data.push({
                            text: fee_installment.title
                        });
                        installment_data.push({
                            text: this.showDate(student_fee_record.due_date || fee_installment.due_date)
                        });

                        fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                            installment_data.push({
                                text: this.getInstallmentFeeAmount(fee_installment, fee_head.id),
                                actual: this.getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head.id),
                                is_concession: this.checkInstallmentConcession(fee_installment, fee_head.id) ? true : false
                            });
                        });

                        if (fee_allocation_group.fee_group.options.has_transport) {
                            installment_data.push({
                                text: this.getTransportCircleName(fee_installment)
                            });
                            installment_data.push({
                                text: this.getTransportFeeAmount(fee_installment)
                            });
                        }

                        installment_data.push({
                            text: this.getLateFeeAmount(fee_installment)
                        });

                        installment_data.push({
                            text: this.getInstallmentTotalAmount(fee_installment)
                        })

                        installment_data.push({
                            text: this.getInstallmentOtherAmount(fee_installment)
                        })

                        installment_data.push({
                            text: this.getInstallmentPaidAmount(fee_installment)
                        })

                        installment_data.push({
                            text: this.getInstallmentBalanceAmount(fee_installment)
                        })

                        installment_data.push({
                            text: this.getInstallmentPrintStatus(fee_installment)
                        })

                        installments.push({
                            data: installment_data
                        });
                    });

                    fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                        foots.push(this.getTotalFee(fee_allocation_group, fee_head.id));
                    });
                    
                    if (fee_allocation_group.fee_group.options.has_transport) {
                        foots.push('');
                        foots.push(this.getTransportFeeTotal(fee_allocation_group));
                    }
                    
                    foots.push(this.getLateFeeTotal(fee_allocation_group));
                    foots.push(this.getInstallmentGrandTotal(fee_allocation_group));
                    foots.push(this.getInstallmentGrandOther(fee_allocation_group));
                    foots.push(this.getInstallmentPaidGrandTotal(fee_allocation_group));
                    foots.push(this.getInstallmentBalanceGrandTotal(fee_allocation_group));
                    foots.push('');

                    let group = {
                        name: fee_allocation_group.fee_group.name,
                        heads: heads,
                        installments: installments,
                        foots: foots,
                    }
                    this.fee.groups.push(group);
                });
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            isInstallmentOverdue(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                if (helper.today() > (installment.due_date || fee_installment.due_date) && installment.status != 'paid') {
                    return helper.getDateDiff(installment.due_date || fee_installment.due_date);
                }

                return 0;
            },
            getStatus(fee_installment) {
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                if (installment.status == 'paid') {
                    return '<span class="label label-success">'+i18n.student.fee_status_paid+'</span>';
                } else if(installment.status == 'partially_paid') {
                    return '<span class="label label-warning">'+i18n.student.fee_status_partially_paid+'</span>';
                } else if(installment.status == 'cancelled') {
                    return '<span class="label label-danger">'+i18n.student.fee_status_cancelled+'</span>';
                } else {
                    return '<span class="label label-danger">'+i18n.student.fee_status_unpaid+'</span>';
                }
            },
            getInstallmentDueDate(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                return helper.formatDate(installment.due_date || fee_installment.due_date);
            },
            getInstallmentStatus(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                return installment.status;
            },
            getInstallmentFee(fee_installment, fee_head_id){
                let amount = this.getInstallmentFeeWithoutConcession(fee_installment, fee_head_id);
                return this.getInstallmentFeeWithConcession(amount, fee_installment, fee_head_id);
            },
            getInstallmentFeeWithoutConcession(fee_installment, fee_head_id){
                let installment_detail = fee_installment.fee_installment_details.find(o => o.fee_head_id == fee_head_id);

                if (typeof installment_detail == 'undefined')
                    return 0;

                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                let student_optional_fee_record = student_fee_record.student_optional_fee_records.findIndex(o => o.fee_head_id == fee_head_id);

                return (student_optional_fee_record < 0) ? installment_detail.amount : 0;
            },
            checkInstallmentConcession(fee_installment, fee_head_id){
                let installment_detail = fee_installment.fee_installment_details.find(o => o.fee_head_id == fee_head_id);

                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                let fee_concession_index = (student_fee_record.fee_concession) ? student_fee_record.fee_concession.fee_concession_details.findIndex(o => o.fee_head_id == fee_head_id) : -1;

                return (fee_concession_index >= 0) ? true : false;
            },
            getInstallmentFeeWithConcession(amount, fee_installment, fee_head_id){
                let installment_detail = fee_installment.fee_installment_details.find(o => o.fee_head_id == fee_head_id);

                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                let fee_concession_index = (student_fee_record.fee_concession) ? student_fee_record.fee_concession.fee_concession_details.findIndex(o => o.fee_head_id == fee_head_id) : -1;

                if (fee_concession_index >= 0) {
                    let fee_concession = student_fee_record.fee_concession.fee_concession_details[fee_concession_index];

                    let fee_concession_amount = fee_concession.type == 'percent' ? (amount * (fee_concession.amount/100)) : fee_concession.amount;

                    return ((amount - fee_concession_amount) >= 0) ? Math.ceil(amount - fee_concession_amount) : 0;
                }

                return Math.ceil(amount);
            },
            getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head_id){
                let amount = this.getInstallmentFeeWithoutConcession(fee_installment, fee_head_id);

                return helper.formatCurrency(amount);
            },
            getInstallmentFeeAmount(fee_installment, fee_head_id){
                let amount = this.getInstallmentFee(fee_installment, fee_head_id);
                return helper.formatCurrency(amount);
            },
            getInstallmentTotalWithoutLateFee(fee_installment){
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id)

                let total = 0;
                fee_installment.fee_installment_details.forEach(installment_detail => {
                    total += this.getInstallmentFee(fee_installment, installment_detail.fee_head_id);
                });

                let transport_fee = this.getTransportFee(fee_installment);

                total += ((Number.isInteger(transport_fee)) ? transport_fee : 0);

                return total;
            },
            getInstallmentTotal(fee_installment){
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id)
                
                let total = this.getInstallmentTotalWithoutLateFee(fee_installment);

                if (total || student_fee_record.status != 'unpaid') {
                    let late_fee = this.getLateFee(fee_installment);
                    total += ((Number.isInteger(late_fee)) ? late_fee : 0);
                }

                return total;
            },
            getInstallmentTotalAmount(fee_installment){
                let amount = this.getInstallmentTotal(fee_installment);
                return helper.formatCurrency(amount);
            },
            getInstallmentOther(fee_installment){
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                let other = 0;
                student_fee_record.transactions.forEach(transaction => {
                    if (! transaction.is_cancelled) {
                        if (transaction.options.additional_fee_charge && transaction.options.additional_fee_charge.amount) {
                            other += transaction.options.additional_fee_charge.amount;
                        }
                        if (transaction.options.additional_fee_discount && transaction.options.additional_fee_discount.amount) {
                            other -= transaction.options.additional_fee_discount.amount;
                        }
                    }
                });

                return other;
            },
            getInstallmentOtherAmount(fee_installment){
                let amount = this.getInstallmentOther(fee_installment);
                return helper.formatCurrency(amount);
            },
            getInstallmentPaid(fee_installment){
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                let paid = 0;
                student_fee_record.transactions.forEach(transaction => {
                    if (! transaction.is_cancelled)
                        paid += transaction.amount;
                });

                return paid;
            },
            getInstallmentPaidAmount(fee_installment){
                let amount = this.getInstallmentPaid(fee_installment);
                return helper.formatCurrency(amount);
            },
            getInstallmentBalance(fee_installment){
                let total = this.getInstallmentTotal(fee_installment);
                let other = this.getInstallmentOther(fee_installment);
                let paid = this.getInstallmentPaid(fee_installment);
                return total + other - paid;
            },
            getInstallmentBalanceAmount(fee_installment){
                let amount = this.getInstallmentBalance(fee_installment);
                return helper.formatCurrency(amount);
            },
            getTransportCircleName(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                return installment.transport_circle ? installment.transport_circle.name : '-';
            },
            getTransportFee(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                if (! installment.transport_circle_id || ! fee_installment.transport_fee_id)
                    return '-';

                let transport_fee = fee_installment.transport_fee.transport_fee_details.find(o => o.transport_circle_id == installment.transport_circle_id);
                return transport_fee.amount;
            },
            getTransportFeeAmount(fee_installment){
                let amount = this.getTransportFee(fee_installment);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getLateFeeAmount(fee_installment){
                let amount = this.getLateFee(fee_installment);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getLateFee(fee_installment){
                let installment_total = this.getInstallmentTotalWithoutLateFee(fee_installment);

                if (! installment_total)
                    return '-';

                let date = helper.toDate(this.feePayment.date);

                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                if (installment.status == 'paid') {
                    return installment.late_fee_charged;
                }

                if ((installment.late_fee_applicable == null && !fee_installment.late_fee_applicable) || installment.late_fee_applicable == 0)
                    return '-';

                if (date <= (installment.due_date || fee_installment.due_date))
                    return '-';

                let late_day = helper.getDateDiff((installment.due_date || fee_installment.due_date), date);

                let late_fee_frequency = installment.late_fee_frequency || fee_installment.late_fee_frequency;
                if (late_fee_frequency === 500) {
                    if (late_day < 10)
                        return 20;
                    else
                        return 50;
                }

                let per_period = Math.floor(late_day / (installment.late_fee_frequency || fee_installment.late_fee_frequency));
                return (installment.late_fee || fee_installment.late_fee) * per_period;
            },
            showInstallmentDetail(fee_allocation_group, fee_installment){
                this.feePayment.installments = [];
                this.feePayment.fee_group_name = fee_allocation_group.fee_group.name;
                let installments = fee_allocation_group.fee_installments.filter(o => o.due_date <= fee_installment.due_date);

                let total = 0;
                installments.forEach(installment => {
                    let student_installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == installment.id);
                    if (student_installment.status == 'unpaid' || student_installment.status == 'partially_paid') {

                        let installment_fee = this.getInstallmentTotalWithoutLateFee(installment);
                        let other = this.getInstallmentOther(installment);
                        let late_fee = this.getLateFee(installment);
                        let paid = this.getInstallmentPaid(installment);
                        installment_fee += other;

                        let installment_balance = (installment_fee > paid) ? (installment_fee - paid) : 0
                        if (installment_fee) {
                            late_fee = ((Number.isInteger(late_fee)) ? late_fee : 0)
                        }
                        let late_fee_balance = (!installment_balance && late_fee) ? (late_fee - (paid - installment_fee)) : late_fee;

                        let installment_total = installment_fee;
                        if (installment_fee) {
                            late_fee = ((Number.isInteger(late_fee)) ? late_fee : 0)
                            installment_total += late_fee;
                        }

                        let balance = installment_total - paid;
                        total += balance;

                        this.feePayment.installments.push({
                            fee_installment_id:  student_installment.fee_installment_id,
                            title: installment.title,
                            installment_fee: installment_fee,
                            installment_balance: installment_balance,
                            late_fee_balance: (Number.isInteger(late_fee_balance)) ? late_fee_balance : 0,
                            late_fee: late_fee,
                            paid: paid,
                            total: balance
                        })
                    }
                });
                this.feePayment.amount = total;
                this.feePayment.fee_payment_installment_id = fee_installment.id;
                this.feePaymentForm = true;
            },
            getTotalFee(fee_allocation_group, fee_head_id){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getInstallmentFee(fee_installment, fee_head_id);
                });
                return helper.formatCurrency(total);
            },
            getTransportFeeTotal(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    let fee = this.getTransportFee(fee_installment);
                    total += ((Number.isInteger(fee)) ? fee : 0);
                });
                return total ? this.formatCurrency(total) : '-';
            },
            getLateFeeTotal(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    let fee = this.getLateFee(fee_installment);
                    total += ((Number.isInteger(fee)) ? fee : 0);
                });
                return total ? this.formatCurrency(total) : '-';
            },
            getInstallmentGrandTotal(fee_allocation_group){
                let amount = this.getInstallmentGrandTotalAmount(fee_allocation_group);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getInstallmentGrandTotalAmount(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getInstallmentTotal(fee_installment);
                });
                return total;
            },
            getInstallmentGrandOther(fee_allocation_group){
                let amount = this.getInstallmentGrandOtherAmount(fee_allocation_group);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getInstallmentGrandOtherAmount(fee_allocation_group){
                let other = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    other += this.getInstallmentOther(fee_installment);
                });
                return other;
            },
            getInstallmentPaidGrandTotal(fee_allocation_group){
                let amount = this.getInstallmentPaidGrandTotalAmount(fee_allocation_group);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getInstallmentPaidGrandTotalAmount(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getInstallmentPaid(fee_installment);
                });
                return total;
            },
            getInstallmentBalanceGrandTotal(fee_allocation_group){
                let amount = this.getInstallmentBalanceGrandTotalAmount(fee_allocation_group);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            getInstallmentBalanceGrandTotalAmount(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getInstallmentBalance(fee_installment);
                });
                return total;
            },
            paymentMade(){
                this.getRecord();
            },
            showDate(date){
                return helper.formatDate(date);
            },
            getInstallmentPrintStatus(fee_installment){
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                if (student_fee_record.status == 'paid')
                    return i18n.student.fee_status_paid;
                else if(student_fee_record.status == 'partially_paid')
                    return i18n.student.fee_status_partially_paid;
                else if(student_fee_record.status == 'cancelled')
                    return i18n.student.fee_status_cancelled;
                else if(student_fee_record.status == 'unpaid')
                    return i18n.student.fee_status_unpaid;
            },
            setTransaction(fee_installment) {
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                this.student_fee_record_id = student_fee_record.id;
                this.feePaymentShow = true;
            },
            print(){
                let loader = this.$loading.show();
                this.calculate();
                axios.post('/api/student/'+this.uuid+'/fee/'+this.record_id+'/print',{fee: this.fee})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                this.calculate();
                axios.post('/api/student/'+this.uuid+'/fee/'+this.record_id+'/pdf',{fee: this.fee})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmEmptyReceiptDelete(fee_installment){
                return dialog => this.deleteEmptyReceipt(fee_installment);
            },
            deleteEmptyReceipt(fee_installment){
                let loader = this.$loading.show();
                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                axios.post('/api/student/'+this.uuid+'/fee/'+this.record_id+'/'+student_fee_record.id+'/cancel')
                    .then(response => {
                        toastr.success(response.message);
                        this.getRecord();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmResetFee(student_record){
                return dialog => this.resetFee(student_record);
            },
            resetFee(student_record){
                let loader = this.$loading.show();
                axios.patch('/api/student/'+this.uuid+'/fee/'+this.record_id+'/reset')
                    .then(response => {
                        toastr.success(response.message);
                        this.getRecord();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            resetFeeOption(){
                if (! this.student_record.id)
                    return false;

                return this.student_record.student_fee_records.every(student_fee_record => {
                    return student_fee_record.status == 'unpaid';
                });
            },
            finalTotal() {
                let total = 0;
                this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    total += this.getInstallmentGrandTotalAmount(fee_allocation_group);
                });
                return helper.formatCurrency(total);
            },
            finalOther() {
                let total = 0;
                this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    total += this.getInstallmentGrandOtherAmount(fee_allocation_group);
                });
                return helper.formatCurrency(total);
            },
            finalPaid() {
                let total = 0;
                this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    total += this.getInstallmentPaidGrandTotalAmount(fee_allocation_group);
                });
                return helper.formatCurrency(total);
            },
            finalBalance() {
                let total = 0;
                this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    total += this.getInstallmentBalanceGrandTotalAmount(fee_allocation_group);
                });
                return helper.formatCurrency(total);
            }
        },
        watch: {
            '$route.params.uuid': function (uuid) {
                this.uuid = uuid;
                this.record_id = this.$route.params.record_id;
                this.getRecord()
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>