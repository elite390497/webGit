<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.payment_method')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="payment_methods.total">{{trans('general.total_result_found',{count : payment_methods.total, from: payment_methods.from, to: payment_methods.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="payment_methods.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_payment_method')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.finance.transaction.payment-method'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_payment_method')}}</h4>
                        <payment-method-form @completed="getPaymentMethods" @cancel="showCreatePanel = !showCreatePanel"></payment-method-form>
                    </div>
                </div>
            </transition>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="payment_methods.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.payment_method_name')}}</th>
                                    <th>{{trans('finance.payment_method_detail')}}</th>
                                    <th>{{trans('finance.payment_method_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="payment_method in payment_methods.data">
                                    <td>
                                        {{payment_method.name}}
                                        <span v-if="payment_method.is_default" class="badge badge-success">{{trans('general.default')}}</span>
                                    </td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-if="payment_method.options.requires_instrument_number">
                                                <i class="fas fa-check"></i> {{trans('finance.instrument_number')}}
                                            </li>
                                            <li v-if="payment_method.options.requires_instrument_date">
                                                <i class="fas fa-check"></i> {{trans('finance.instrument_date')}}
                                            </li>
                                            <li v-if="payment_method.options.requires_instrument_clearing_date">
                                                <i class="fas fa-check"></i> {{trans('finance.instrument_clearing_date')}}
                                            </li>
                                            <li v-if="payment_method.options.requires_instrument_bank_detail">
                                                <i class="fas fa-check"></i> {{trans('finance.instrument_bank_detail')}}
                                            </li>
                                            <li v-if="payment_method.options.requires_reference_number">
                                                <i class="fas fa-check"></i> {{trans('finance.reference_number')}}
                                            </li>
                                        </ul>
                                    </td>
                                    <td v-text="payment_method.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('finance.edit_payment_method')" @click.prevent="editPaymentMethod(payment_method)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="payment_method.id" v-confirm="{ok: confirmDelete(payment_method)}" v-tooltip="trans('finance.delete_payment_method')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!payment_methods.total" module="finance" title="payment_method_module_title" description="payment_method_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="payment_methods" @updateRecords="getPaymentMethods" @change.native="getPaymentMethods"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import paymentMethodForm from './form'

    export default {
        components : { paymentMethodForm },
        data() {
            return {
                payment_methods: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.payment_method_name
                    }
                ],
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPaymentMethods();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getPaymentMethods(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/finance/payment/method?page=' + page + url)
                    .then(response => {
                        this.payment_methods = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editPaymentMethod(payment_method){
                this.$router.push('/configuration/finance/payment/method/'+payment_method.id+'/edit');
            },
            confirmDelete(payment_method){
                return dialog => this.deletePaymentMethod(payment_method);
            },
            deletePaymentMethod(payment_method){
                let loader = this.$loading.show();
                axios.delete('/api/finance/payment/method/'+payment_method.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPaymentMethods();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/finance/payment/method/print',{filter: this.filter})
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
                axios.post('/api/finance/payment/method/pdf',{filter: this.filter})
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
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getPaymentMethods();
            },
            'filter.order': function(val){
                this.getPaymentMethods();
            },
            'filter.page_length': function(val){
                this.getPaymentMethods();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
