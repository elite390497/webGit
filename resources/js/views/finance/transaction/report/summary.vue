<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.transaction_summary_report')}} 
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
                        <help-button @clicked="help_topic = 'finance.transaction.report.summary'"></help-button>
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
                                    <label for="">{{trans('finance.account')}}</label>
                                    <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('account.select_account')" @select="onAccountSelect" @close="" @remove="filter.account_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.payment_method')}}</label>
                                    <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" @close="" @remove="filter.payment_method_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getReport">{{trans('general.filter')}}</button>
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
                                    <th>#</th>
                                    <th>{{trans('finance.voucher_number')}}</th>
                                    <th>{{trans('finance.date')}}</th>
                                    <th>{{trans('finance.payment')}}</th>
                                    <th>{{trans('finance.receipt')}}</th>
                                    <th>{{trans('finance.fee_concession')}}</th>
                                    <th>{{trans('general.description')}}</th>
                                    <th>{{trans('finance.payment_method')}}</th>
                                    <th>{{trans('general.entry_by')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in list.data">
                                    <td>{{item.sno}}</td>
                                    <td>{{item.voucher_number}}</td>
                                    <td>{{item.date | moment}}</td>
                                    <td>{{item.type == 'payment' ? item.amount : '-'}}</td>
                                    <td>{{item.type == 'receipt' ? item.amount : '-'}}</td>
                                    <td>{{item.fee_concession}}</td>
                                    <td>{{item.head}}</td>
                                    <td>
                                        {{item.payment_method}} <p v-if="item.payment_method_detail" v-html="item.payment_method_detail"></p>
                                    </td>
                                    <td>{{item.employee}}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="3"></th>
                                    <th>{{footer.total_payments}}</th>
                                    <th>{{footer.total_receipts}}</th>
                                    <th>{{footer.total_concessions}}</th>
                                    <th colspan="4"></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <h4 v-if="footer.fee_summary" style="margin-left: 20px;">{{trans('finance.fee_summary_report')}}</h4>
                    <ul style="list-style: none;">
                        <li v-for="(fee_head,index) in footer.fee_summary">{{index}}: {{fee_head}}</li>
                    </ul>
                    <module-info v-if="!list.total" module="finance" title="transaction_summary_report_module_title" description="transaction_summary_report_module_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="list" @updateRecords="getReport"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : {},
        data() {
            return {
                list: {
                    total: 0,
                    data: []
                },
                footer: [],
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    account_id: '',
                    payment_method_id: '',
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                accounts: [],
                payment_methods: [],
                selected_account: null,
                selected_payment_method: null,
                showFilterPanel: true,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-transaction-report')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPreRequisite();

            this.filter.start_date = helper.today();
            this.filter.end_date = moment().add(1,'month').format('YYYY-MM-DD');
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/transaction/report/pre-requisite')
                    .then(response => {
                        this.accounts = response.accounts;
                        this.payment_methods = response.payment_methods;
                        this.getReport();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },  
            getReport(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transaction/report/summary?page=' + page + url)
                    .then(response => {
                        this.list = response.list;
                        this.footer = response.footer;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transaction/report/summary/print',{filter: this.filter})
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
                axios.post('/api/transaction/report/summary/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onAccountSelect(selectedOption){
                this.filter.account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.filter.payment_method_id = selectedOption.id;
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
                this.getReport();
            },
            'filter.order': function(val){
                this.getReport();
            },
            'filter.page_length': function(val){
                this.getReport();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>