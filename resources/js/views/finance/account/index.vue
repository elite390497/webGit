<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.account')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="accounts.total">{{trans('general.total_result_found',{count : accounts.total, from: accounts.from, to: accounts.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="accounts.total && !showCreatePanel && hasPermission('create-account')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_account')}}</span></button>
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
                        <help-button @clicked="help_topic = 'finance.account'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade" v-if="hasPermission('create-account')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_account')}}</h4>
                        <account-form @completed="getAccounts" @cancel="showCreatePanel = !showCreatePanel"></account-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="accounts.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.account_name')}}</th>
                                    <th>{{trans('finance.account_prefix')}}</th>
                                    <th>{{trans('finance.account_opening_balance')}}</th>
                                    <th>{{trans('finance.account_type')}}</th>
                                    <th>{{trans('finance.bank_detail')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="account in accounts.data">
                                    <td>
                                        {{account.name}}
                                        <span v-if="account.is_default" class="badge badge-success">{{trans('general.default')}}</span>
                                    </td>
                                    <td v-text="account.prefix"></td>
                                    <td>{{formatCurrency(account.opening_balance)}}</td>
                                    <td v-text="trans('finance.'+account.type)"></td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0" v-if="account.type == 'bank'">
                                            <li><strong>{{trans('finance.account_number')}}:</strong> {{account.account_number}}</li>
                                            <li><strong>{{trans('finance.bank_name')}}:</strong> {{account.bank_name}}</li>
                                            <li><strong>{{trans('finance.branch_name')}}:</strong> {{account.branch_name}}</li>
                                            <li><strong>{{trans('finance.bank_identification_code')}}:</strong> {{account.bank_identification_code}}</li>
                                        </ul>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('finance.edit_account')" @click.prevent="editAccount(account)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="account.id" v-confirm="{ok: confirmDelete(account)}" v-tooltip="trans('finance.delete_account')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!accounts.total" module="finance" title="account_module_title" description="account_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-account')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="accounts" @updateRecords="getAccounts"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import accountForm from './form'

    export default {
        components : { accountForm },
        data() {
            return {
                accounts: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.account_name
                    },
                    {
                        value: 'opening_balance',
                        translation: i18n.finance.account_opening_balance
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-account') || !helper.hasPermission('create-account')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-account'))
                this.getAccounts();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getAccounts(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/account?page=' + page + url)
                    .then(response => {
                        this.accounts = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editAccount(account){
                this.$router.push('/finance/account/'+account.id+'/edit');
            },
            confirmDelete(account){
                return dialog => this.deleteAccount(account);
            },
            deleteAccount(account){
                let loader = this.$loading.show();
                axios.delete('/api/account/'+account.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getAccounts();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            formatCurrency(price) {
                return helper.formatCurrency(price);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/account/print',{filter: this.filter})
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
                axios.post('/api/account/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
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
        watch: {
            'filter.sort_by': function(val){
                this.getAccounts();
            },
            'filter.order': function(val){
                this.getAccounts();
            },
            'filter.page_length': function(val){
                this.getAccounts();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
