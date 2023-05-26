<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.account_transfer')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="account_transfers.total">{{trans('general.total_result_found',{count : account_transfers.total, from: account_transfers.from, to: account_transfers.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="account_transfers.total && !showCreatePanel && hasPermission('create-account-transfer')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_account_transfer')}}</span></button>
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
                        <help-button @clicked="help_topic = 'finance.transaction.account-transfer'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}
                        </h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.from_account')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_from_accounts" name="from_account_id" id="from_account_id" :options="accounts" :placeholder="trans('finance.select_from_account')" @select="onFromAccountSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onFromAccountRemove" :selected="selected_from_accounts">
                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.to_account')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_to_accounts" name="to_account_id" id="to_account_id" :options="accounts" :placeholder="trans('finance.select_to_account')" @select="onToAccountSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onToAccountRemove" :selected="selected_to_accounts">
                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('finance.payment_method')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_payment_methods" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('finance.select_payment_method')" @select="onPaymentMethodSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onPaymentMethodRemove" :selected="selected_payment_methods">
                                        <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_account_transfer_start_date" :end-date.sync="filter.date_of_account_transfer_end_date" :label="trans('finance.date_of_account_transfer_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getAccountTransfers">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-account-transfer')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_account_transfer')}}</h4>
                        <account-transfer-form @completed="getAccountTransfers" @cancel="showCreatePanel = !showCreatePanel"></account-transfer-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="account_transfers.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.voucher_number')}}</th>
                                    <th>{{trans('finance.from_account')}}</th>
                                    <th>{{trans('finance.to_account')}}</th>
                                    <th>{{trans('finance.payment_method')}}</th>
                                    <th>{{trans('finance.amount')}}</th>
                                    <th>{{trans('finance.date_of_account_transfer')}}</th>
                                    <th>{{trans('general.created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="account_transfer in account_transfers.data">
                                    <td v-text="getVoucherNumber(account_transfer.transaction)"></td>
                                    <td v-text="account_transfer.from_account.name"></td>
                                    <td v-text="account_transfer.to_account.name"></td>
                                    <td v-text="account_transfer.transaction.payment_method.name"></td>
                                    <td>{{formatCurrency(account_transfer.amount)}}</td>
                                    <td>{{getEmployeeName(account_transfer.user.employee)}} <br > {{getEmployeeDesignationOnDate(account_transfer.user.employee, account_transfer.date_of_account_transfer)}}</td>
                                    <td>{{account_transfer.date_of_account_transfer | moment}}</td>
                                    <td>{{account_transfer.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a :href="`/finance/transaction/account/transfer/${account_transfer.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-success btn-sm" v-tooltip="trans('general.print')"><i class="fas fa-print"></i></a>
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showAction(account_transfer)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <template v-if="!account_transfer.is_cancelled">
                                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-account-transfer')" v-tooltip="trans('finance.edit_account_transfer')" @click.prevent="editAccountTransfer(account_transfer)"><i class="fas fa-edit"></i></button>
                                                <button class="btn btn-danger btn-sm" v-if="hasPermission('cancel-account-transfer')" :key="account_transfer.id" v-confirm="{ok: confirmCancel(account_transfer)}" v-tooltip="trans('finance.cancel_account_transfer')"><i class="fas fa-trash"></i></button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!account_transfers.total" module="finance" title="account_transfer_module_title" description="account_transfer_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-account-transfer')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="account_transfers" @updateRecords="getAccountTransfers"></pagination-record>
                </div>
            </div>
        </div>
        <account-transfer-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></account-transfer-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import accountTransferForm from './form'
    import accountTransferDetail from './show'

    export default {
        components : { accountTransferForm,accountTransferDetail},
        data() {
            return {
                account_transfers: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_account_transfer',
                    order: 'desc',
                    from_account_id: [],
                    to_account_id: [],
                    payment_method_id: [],
                    date_of_account_transfer_start_date: '',
                    date_of_account_transfer_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_account_transfer',
                        translation: i18n.finance.date_of_account_transfer
                    },
                    {
                        value: 'amount',
                        translation: i18n.finance.amount
                    }
                ],
                accounts: [],
                selected_from_accounts: null,
                selected_to_accounts: null,
                payment_methods: [],
                selected_payment_methods: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-account-transfer')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getAccountTransfers();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(account_transfer){
                this.showUuid = account_transfer.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getVoucherNumber(transaction){
                return helper.getVoucherNumber(transaction);
            },
            getAccountTransfers(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_account_transfer_start_date = helper.toDate(this.filter.date_of_account_transfer_start_date);
                this.filter.date_of_account_transfer_end_date = helper.toDate(this.filter.date_of_account_transfer_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/account/transfer?page=' + page + url)
                    .then(response => {
                        this.account_transfers = response.account_transfers;
                        this.accounts = response.filters.accounts;
                        this.payment_methods = response.filters.payment_methods;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAccountTransfer(account_transfer){
                this.$router.push('/finance/transaction/account/transfer/'+account_transfer.uuid+'/edit');
            },
            confirmCancel(account_transfer){
                return dialog => this.cancelAccountTransfer(account_transfer);
            },
            cancelAccountTransfer(account_transfer){
                let loader = this.$loading.show();
                axios.delete('/api/account/transfer/'+account_transfer.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getAccountTransfers();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/account/transfer/print',{filter: this.filter})
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
                axios.post('/api/account/transfer/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onFromAccountSelect(selectedOption){
                this.filter.from_account_id.push(selectedOption.id);
            },
            onFromAccountRemove(removedOption){
                this.filter.from_account_id.splice(this.filter.from_account_id.indexOf(removedOption.id), 1);
            },
            onToAccountSelect(selectedOption){
                this.filter.to_account_id.push(selectedOption.id);
            },
            onToAccountRemove(removedOption){
                this.filter.to_account_id.splice(this.filter.to_account_id.indexOf(removedOption.id), 1);
            },
            onPaymentPaymentSelect(selectedOption){
                this.filter.payment_method.push(selectedOption.id);
            },
            onPaymentPaymentRemove(removedOption){
                this.filter.payment_method.splice(this.filter.payment_method.indexOf(removedOption.id), 1);
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
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
                this.getAccountTransfers();
            },
            'filter.order': function(val){
                this.getAccountTransfers();
            },
            'filter.page_length': function(val){
                this.getAccountTransfers();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>