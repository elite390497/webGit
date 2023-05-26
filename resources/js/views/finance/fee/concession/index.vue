<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_concession')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="fee_concessions.total">{{trans('general.total_result_found',{count : fee_concessions.total, from: fee_concessions.from, to: fee_concessions.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="fee_concessions.total && hasPermission('create-fee-concession')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('finance.add_new_fee_concession')}}</span></button>
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
                        <help-button @clicked="help_topic = 'finance.fee.concession'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('finance.fee_concession_name')}}</label>
                                    <input class="form-control" type="text" v-model="filter.name" name="name" :placeholder="trans('finance.fee_concession_name')">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getFeeConcessions">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-fee-concession')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('finance.add_new_fee_concession')}}</h4>
                        <fee-concession-form @completed="getFeeConcessions" @cancel="showCreatePanel = !showCreatePanel"></fee-concession-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="fee_concessions.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('finance.fee_concession_name')}}</th>
                                    <th>{{trans('finance.fee_head')}}</th>
                                    <th>{{trans('finance.fee_concession_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fee_concession in fee_concessions.data">
                                    <td v-text="fee_concession.name"></td>
                                    <td>
                                        <div class="row" v-for="fee_concession_detail in fee_concession.fee_concession_details">
                                            <div class="col-8">
                                                <i class="fas fa-check "></i> {{fee_concession_detail.fee_head.name}} ({{fee_concession_detail.fee_head.fee_group.name}})
                                            </div>
                                            <div class="col-4">
                                                <span v-if="fee_concession_detail.type == 'percent'">{{fee_concession_detail.amount}}%</span>
                                                <span v-else>{{formatCurrency(fee_concession_detail.amount)}}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td v-text="fee_concession.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-fee-concession')" v-tooltip="trans('finance.edit_fee_concession')" @click.prevent="editFeeConcession(fee_concession)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-fee-concession')" :key="fee_concession.id" v-confirm="{ok: confirmDelete(fee_concession)}" v-tooltip="trans('finance.delete_fee_concession')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!fee_concessions.total" module="finance" title="fee_concession_module_title" description="fee_concession_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-fee-concession')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="fee_concessions" @updateRecords="getFeeConcessions"></pagination-record>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import feeConcessionForm from './form'

    export default {
        components : { feeConcessionForm },
        data() {
            return {
                fee_concessions: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.finance.fee_concession_name
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-fee-concession')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getFeeConcessions();
            helper.showDemoNotification(['finance']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getFeeConcessions(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/fee/concession?page=' + page + url)
                    .then(response => {
                        this.fee_concessions = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editFeeConcession(fee_concession){
                this.$router.push('/finance/fee/concession/'+fee_concession.id+'/edit');
            },
            confirmDelete(fee_concession){
                return dialog => this.deleteFeeConcession(fee_concession);
            },
            deleteFeeConcession(fee_concession){
                let loader = this.$loading.show();
                axios.delete('/api/fee/concession/'+fee_concession.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getFeeConcessions();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            formatCurrency(price){
                return helper.formatCurrency(price);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/concession/print',{filter: this.filter})
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
                axios.post('/api/fee/concession/pdf',{filter: this.filter})
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
                this.getFeeConcessions();
            },
            'filter.order': function(val){
                this.getFeeConcessions();
            },
            'filter.page_length': function(val){
                this.getFeeConcessions();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>