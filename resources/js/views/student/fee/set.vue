<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.set_fee')}} <small v-if="student_record.student">{{getStudentName(student_record.student)}} ({{student_record.academic_session.name}})</small></h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/student" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('student.student')}}</span></router-link>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/student/'+student_record.student.uuid)"><i class="fas fa-arrow-circle-right"></i> {{trans('student.view_detail')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/student/'+student_record.student.uuid+'/fee/'+student_record.id)"><i class="fas fa-file"></i> {{trans('finance.view_fee_allocation')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body py-4">
                    <student-summary :student-record="student_record" class="border-bottom"></student-summary>
                </div>
                <div class="card-body px-4">
                    <form @submit.prevent="submit" @keydown="studentFeeRecordForm.errors.clear($event.target.name)">
                        <template v-for="fee_group in studentFeeRecordForm.fee_groups">
                            <h4 class="card-title">{{fee_group.name}}</h4>
                            <div class="row m-b-20">
                                <div class="col-12 col-sm-2 text-strong">
                                    {{trans('finance.fee_installment_title')}}
                                </div>
                                <div class="col-12 col-sm-2 text-strong">
                                    {{trans('finance.fee_installment_due_date')}}
                                </div>
                                <div class="col-12 col-sm-2 text-strong">
                                    {{trans('finance.fee_status')}}
                                </div>
                                <div class="col-12 col-sm-2 text-strong" v-if="fee_group.has_transport">
                                    {{trans('transport.transport_circle')}}
                                </div>
                                <div class="col-12 col-sm-2 text-strong">
                                    {{trans('finance.fee_concession')}}
                                </div>
                                <div class="col-12 col-sm-2 text-strong">
                                    {{trans('finance.optional_fee')}}
                                </div>
                            </div>
                            <template v-for="installment in fee_group.installments">
                                <div class="row">
                                    <div class="col-12 col-sm-2">
                                        {{installment.title}} <br /><span v-if="isInstallmentOverdue(installment)" class="label label-danger">{{trans('finance.fee_overdue')}}</span>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group">
                                            <datepicker v-model="installment.due_date" :bootstrapStyling="true" @selected="studentFeeRecordForm.errors.clear(getDueDateFieldName(installment))" :placeholder="trans('finance.fee_installment_due_date')" :name="getDueDateFieldName(installment)" :disabled="installment.status != 'unpaid'"></datepicker>
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getDueDateFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <span v-if="installment.status == 'paid'" class="label label-success">{{trans('student.fee_status_paid')}}</span>
                                        <span v-else class="label label-danger">{{trans('student.fee_status_unpaid')}}</span>
                                    </div>
                                    <div class="col-12 col-sm-2" v-if="fee_group.has_transport">
                                        <div class="form-group">
                                            <select v-model="installment.transport_circle_id" class="custom-select col-12" @change="updateTransportFee(installment)" :name="getTransportFieldName(installment)" :disabled="installment.status != 'unpaid'">
                                                <option :value="null">{{trans('transport.no_transport')}}</option>
                                                <option v-for="transport_circle in transport_circles" v-bind:value="transport_circle.id">
                                                    {{ transport_circle.name }}
                                                </option>
                                            </select>
                                            <span class="help-block">{{trans('transport.fee')+': '+formatCurrency(installment.transport_fee)}}</span>
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getTransportFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group">
                                            <select v-model="installment.fee_concession_id" class="custom-select col-12" @change="" :name="getFeeConcessionFieldName(installment)" :disabled="installment.status != 'unpaid'">
                                                <option :value="null">{{trans('finance.no_fee_concession')}}</option>
                                                <option v-for="fee_concession in fee_concessions" v-bind:value="fee_concession.id">
                                                    {{ fee_concession.name }}
                                                </option>
                                            </select>
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getFeeConcessionFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group" v-for="fee_head in installment.heads" v-if="fee_head.is_optional">
                                            <label class="custom-control custom-checkbox" v-tooltip="fee_head.value ? trans('finance.uncheck_to_make_it_optional') : trans('finance.check_to_make_it_mandatory')">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="fee_head.value" :disabled="installment.status != 'unpaid'">
                                                <span class="custom-control-label" v-text="fee_head.name"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="installment.late_fee_applicable" :disabled="installment.status != 'unpaid'">
                                                <span class="custom-control-label">{{trans('finance.late_fee')}}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group" v-if="installment.late_fee_applicable">
                                            <select v-model="installment.late_fee_frequency" class="custom-select col-12" :name="getLateFeeFrequencyFieldName(installment)" :disabled="installment.status != 'unpaid'">
                                              <option value="">{{trans('general.select_one')}}</option>
                                              <option v-for="option in late_fee_frequencies" v-bind:value="option.value">
                                                {{ option.text }}
                                              </option>
                                            </select>
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getLateFeeFrequencyFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-2">
                                        <div class="form-group" v-if="installment.late_fee_applicable">
                                            <input class="form-control" type="text" v-model="installment.late_fee" :name="getLateFeeFieldName(installment)" :placeholder="trans('finance.late_fee')" :disabled="installment.status != 'unpaid'">
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getLateFeeFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <autosize-textarea v-model="installment.remarks" rows="1" :name="getRemarkFieldName(installment)" :placeholder="trans('general.remarks')" :disabled="installment.status != 'unpaid'"></autosize-textarea>
                                            <show-error :form-name="studentFeeRecordForm" :prop-name="getRemarkFieldName(installment)"></show-error>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import studentSummary from './../summary'

    export default {
        components : {studentSummary},
        data() {
            return {
                uuid:this.$route.params.uuid,
                record_id:this.$route.params.record_id,
                student_record: {
                    fee_allocation: {
                        fee_allocation_groups: []
                    }
                },
                transport_circles: [],
                fee_concessions: [],
                late_fee_frequencies: [],
                studentFeeRecordForm: new Form({
                    fee_groups: []
                },false)
            };
        },
        mounted(){
            if(!helper.hasPermission('set-fee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getRecord();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getRecord(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid+'/fee/'+this.record_id)
                    .then(response => {
                        this.student_record = response.student_record;
                        this.transport_circles = response.transport_circles;
                        this.fee_concessions = response.fee_concessions;
                        this.late_fee_frequencies = response.late_fee_frequencies;

                        this.student_record.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                            let installments = [];
                            fee_allocation_group.fee_installments.forEach(fee_installment => {
                                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                                let heads = [];

                                let student_fee_record = this.student_record.student_fee_records.find(o => o.fee_installment_id ==  fee_installment.id);

                                fee_installment.fee_installment_details.forEach(fee_installment_detail => {
                                    let student_optional_fee_record = student_fee_record.student_optional_fee_records.findIndex(o => o.fee_head_id == fee_installment_detail.fee_head_id);

                                    heads.push({
                                        id: fee_installment_detail.fee_head_id,
                                        name: fee_installment_detail.fee_head.name,
                                        is_optional: fee_installment_detail.is_optional,
                                        value: (student_optional_fee_record >= 0) ? false : true
                                    })
                                });

                                installments.push({
                                    fee_installment: fee_installment,
                                    id: fee_installment.id,
                                    title: fee_installment.title,
                                    due_date: student_fee_record.due_date || fee_installment.due_date,
                                    late_fee_applicable: student_fee_record.late_fee_applicable != null ? student_fee_record.late_fee_applicable : fee_installment.late_fee_applicable,
                                    late_fee_frequency: student_fee_record.late_fee_frequency || (fee_installment.late_fee_applicable ? fee_installment.late_fee_frequency : ''),
                                    late_fee: student_fee_record.late_fee || (fee_installment.late_fee_applicable ? fee_installment.late_fee : ''),
                                    fee_installment_id: installment.fee_installment_id,
                                    transport_circle_id: installment.transport_circle_id,
                                    transport_fee: this.getTransportFee(fee_installment, installment.transport_circle_id),
                                    fee_concession_id: installment.fee_concession_id,
                                    status: installment.status,
                                    remarks: installment.remarks,
                                    heads: heads
                                })
                            });

                            this.studentFeeRecordForm.fee_groups.push({
                                name: fee_allocation_group.fee_group.name,
                                has_transport: fee_allocation_group.fee_group.options.has_transport ? true : false,
                                installments: installments
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/student/'+this.uuid+'/fee/'+this.record_id+'/create');
                    });
            },
            getTransportFieldName(installment){
                return 'transport_circle_'+installment.id;
            },
            getFeeConcessionFieldName(installment){
                return 'fee_concession_'+installment.id;
            },
            getRemarkFieldName(installment){
                return 'remark_'+installment.id;
            },
            getDueDateFieldName(installment){
                return 'due_date_'+installment.id;
            },
            getLateFeeFrequencyFieldName(installment){
                return  'late_fee_frequency_'+installment.id;
            },
            getLateFeeFieldName(installment){
                return  'late_fee_'+installment.id;
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            isInstallmentOverdue(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);

                if (helper.today() > fee_installment.due_date && installment.status != 'paid')
                    return true;

                return false;
            },
            getTransportCircleName(fee_installment){
                let installment = this.student_record.student_fee_records.find(o => o.fee_installment_id == fee_installment.id);
                return installment.transport_circle ? installment.transport_circle.name : '-';
            },
            getTransportFee(fee_installment, transport_circle_id){
                if(! Number.isInteger(transport_circle_id) || ! fee_installment.transport_fee_id)
                    return null;

                let transport_fee = fee_installment.transport_fee.transport_fee_details.find(o => o.transport_circle_id == transport_circle_id);
                return transport_fee.amount;
            },
            getTransportFeeAmount(fee_installment){
                let amount = this.getTransportFee(fee_installment);
                return (Number.isInteger(amount)) ? helper.formatCurrency(amount) : '-';
            },
            updateTransportFee(installment){
                let fee = this.getTransportFee(installment.fee_installment, installment.transport_circle_id);
                installment.transport_fee = fee;
            },
            submit(){
                let loader = this.$loading.show();
                this.studentFeeRecordForm.patch('/api/student/'+this.uuid+'/fee/'+this.record_id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
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