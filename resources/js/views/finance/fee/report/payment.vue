<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_payment_report')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="list.total">{{trans('general.total_result_found',{count : list.total, from: list.from, to: list.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'finance.fee.report.summary'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.first_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.first_name" name="first_name" :placeholder="trans('student.first_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('student.last_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.last_name" name="last_name" :placeholder="trans('student.last_name')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" value="1" v-model="filter.is_online_payment" name="is_online_payment">
                                        <span class="custom-control-label">{{trans('finance.online_payment')}}</span>
                                    </label>
                                    <label class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" value="1" v-model="filter.is_cancelled" name="is_cancelled">
                                        <span class="custom-control-label">{{trans('finance.cancelled_payment')}}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.reference_number')}}</label>
                                    <input class="form-control" type="text" v-model="filter.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.instrument_number')}}</label>
                                    <input class="form-control" type="text" v-model="filter.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getPayment">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="list.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th class="select-all" v-if="hasPermission('send-sms')">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="selectAll" @change="toggleSelectAll">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </th>
                                    <th>{{trans('finance.receipt_no')}}</th>
                                    <th>{{trans('student.name')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('student.first_guardian_name')}}</th>
                                    <th>{{trans('student.contact_number')}}</th>
                                    <th>{{trans('finance.fee')}}</th>
                                    <th>{{trans('finance.amount')}}</th>
                                    <th>{{trans('finance.date')}}</th>
                                    <th>{{trans('finance.account')}}</th>
                                    <th>{{trans('finance.payment_method')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list.data">
                                    <td class="select-all" v-if="hasPermission('send-sms')">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" :value="item.id" v-model="sendSMSForm.ids">
                                            <span class="custom-control-label"></span>
                                        </label>
                                    </td>
                                    <td v-text="item.receipt_no"></td>
                                    <td v-text="item.name"></td>
                                    <td v-text="item.batch"></td>
                                    <td v-text="item.first_guardian_name"></td>
                                    <td v-text="item.contact_number"></td>
                                    <td v-text="item.fee_installment"></td>
                                    <td v-text="item.amount"></td>
                                    <td>{{item.date | moment}}</td>
                                    <td v-text="item.account"></td>
                                    <td v-text="item.payment_method"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('general.print')" @click="printReceipt(item)"><i class="fas fa-print"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="7"></th>
                                    <th>{{footer.grand_total}}</th>
                                    <th colspan="3"></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <module-info v-if="!list.total" module="finance" title="fee_payment_report_module_title" description="fee_payment_report_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="list" @updateRecords="getPayment"></pagination-record>
                </div>
                <div class="m-t-10 card-body border-top p-4" v-if="sendSMSForm.ids.length && hasPermission('send-sms')">
                    <h4 class="card-title">{{trans('communication.send_sms')}}</h4>
                    <p>{{trans('general.total_selected', {type: trans('student.student'), count: sendSMSForm.ids.length})}}</p>
                    <form @submit.prevent="submit" @keydown="sendSMSForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sms')}} {{trans('communication.character_count', {count: characterCount})}} </label>
                                    <textarea class="form-control" v-model="sendSMSForm.sms" rows="2" name="sms" :placeholder="trans('communication.sms')"></textarea>
                                    <p class="help-block font-80pc">{{trans('communication.template_variable_tip')}}</p>
                                    <p class="help-block font-90pc">{{trans('communication.available_variables')}}: NAME, RECEIPT_NO, BATCH, FIRST_GUARDIAN_NAMEE, AMOUNT, DATE, PAYMENT_METHOD</p>
                                    <show-error :form-name="sendSMSForm" prop-name="sms"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('communication.sample_sms')}}</label>
                                    <p>{{sampleMessage}}</p>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light" key="send-payment" v-confirm="{ok: confirmSendAction()}">{{trans('general.send')}}</button>
                    </form>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {  },
        data() {
            return {
                list: {
                    total: 0,
                    data: []
                },
                batches: [],
                selected_batches: null,
                footer: [],
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    first_name: '',
                    last_name: '',
                    reference_number: '',
                    instrument_number: '',
                    is_online_payment: 0,
                    is_cancelled: 0,
                    batch_id: [],
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                selectAll: false,
                sendSMSForm: new Form({
                    ids: [],
                    sms: ''
                }),
                orderByOptions: [
                    {
                        value: 'date',
                        translation: i18n.finance.date
                    },
                    {
                        value: 'name',
                        translation: i18n.student.name
                    },
                    {
                        value: 'first_guardian_name',
                        translation: i18n.student.first_guardian_name
                    },
                    {
                        value: 'amount',
                        translation: i18n.finance.amount
                    }
                ],
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-fee-report')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPayment();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPayment(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.selectAll = false;
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/report/payment?page=' + page + url)
                    .then(response => {
                        this.list = response.list;
                        this.footer = response.footer;
                        this.batches = response.filters.batches;
                        let ids = [];
                        this.list.data.forEach(item => {
                            ids.push(item.id);
                        })
                        this.selectAll = ids.every(elem => this.sendSMSForm.ids.indexOf(elem) > -1) ? 1 : 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toggleSelectAll(){
                if(this.selectAll) {
                    this.list.data.forEach(item => {
                        if (this.sendSMSForm.ids.indexOf(item.id) < 0)
                            this.sendSMSForm.ids.push(item.id);
                    });
                } else {
                    this.list.data.forEach(item => {
                        let index = this.sendSMSForm.ids.indexOf(item.id);
                        if (index >= 0) {
                            this.sendSMSForm.ids.splice(index, 1);
                        }
                    });
                }
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            printReceipt(item) {
                let loader = this.$loading.show();
                axios.post('/api/student/'+item.uuid+'/fee/'+item.student_record_id+'/'+item.student_fee_record_id+'/'+item.id+'/print')
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
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/report/payment/print',{filter: this.filter})
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
                axios.post('/api/fee/report/payment/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
            },
            confirmSendAction(){
                return dialog => this.sendSMS();
            },
            sendSMS(){
                let loader = this.$loading.show();
                this.sendSMSForm.filter = this.filter;
                this.sendSMSForm.post('/api/fee/report/payment/sms')
                    .then(response => {
                        toastr.success(response.message);
                        this.sendSMSForm.ids = [];
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
        },
        watch: {
            'filter.sort_by': function(val){
                this.getPayment();
            },
            'filter.order': function(val){
                this.getPayment();
            },
            'filter.page_length': function(val){
                this.getPayment();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            sampleMessage(){
                let item = this.list.data[0];

                let sms = this.sendSMSForm.sms;

                return sms.replace("#NAME#", item.name)
                    .replace("#RECEIPT_NO#", item.receipt_no)
                    .replace("#BATCH#", item.batch)
                    .replace("#FIRST_GUARDIAN_NAMEE#", item.first_guardian_name)
                    .replace("#AMOUNT#", item.amount)
                    .replace("#DATE#", item.date)
                    .replace("#PAYMENT_METHOD#", item.payment_method);
            },
            characterCount(){
                return this.sendSMSForm.sms.length;
            }
        }
    }
</script>