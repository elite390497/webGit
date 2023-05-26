<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.vendor')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="vendors.total">{{trans('general.total_result_found',{count : vendors.total, from: vendors.from, to: vendors.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="vendors.total && !showCreatePanel && hasPermission('create-vendor')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('inventory.add_new_vendor')}}</span></button>
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
                        <help-button @clicked="help_topic = 'inventory.vendor'"></help-button>
                        
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
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('inventory.vendor_name')}}</label>
                                    <input class="form-control" name="name" v-model="filter.name">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getVendors">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-vendor')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('inventory.add_new_vendor')}}</h4>
                        <vendor-form @completed="getVendors" @cancel="showCreatePanel = !showCreatePanel"></vendor-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="vendors.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('inventory.vendor_name')}}</th>
                                    <th>{{trans('inventory.vendor_phone')}}</th>
                                    <th>{{trans('inventory.vendor_email')}}</th>
                                    <th>{{trans('inventory.vendor_contact_person')}}</th>
                                    <th>{{trans('inventory.vendor_address')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vendor in vendors.data">
                                    <td>
                                        {{vendor.name}}
                                        <template v-if="vendor.tax_id"><br /> {{trans('inventory.vendor_tax_id')+' '+vendor.tax_id}}</template>
                                    </td>
                                    <td>
                                        {{vendor.phone}}
                                        <template v-if="vendor.alternate_phone"><br /> {{vendor.alternate_phone}}</template>
                                    </td>
                                    <td>{{vendor.email}}</td>
                                    <td>
                                        {{vendor.contact_person}}
                                        <template v-if="vendor.contact_person_phone"><br /> {{vendor.contact_person_phone}}</template>
                                        <template v-if="vendor.contact_person_email"><br /> {{vendor.contact_person_email}}</template>
                                    </td>
                                    <td>
                                        {{vendor.address_line_1}}
                                        <template v-if="vendor.address_line_2"><br /> {{vendor.address_line_2}}</template>
                                        <template v-if="vendor.city"><br /> {{vendor.city}}</template>
                                        <template v-if="vendor.state"><br /> {{vendor.state}}</template>
                                        <template v-if="vendor.zipcode"><br /> {{vendor.zipcode}}</template>
                                        <template v-if="vendor.country"><br /> {{vendor.country}}</template>
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('inventory.edit_vendor')" @click.prevent="editVendor(vendor)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="vendor.id" v-confirm="{ok: confirmDelete(vendor)}" v-tooltip="trans('inventory.delete_vendor')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!vendors.total" module="inventory" title="vendor_module_title" description="vendor_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-vendor')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="vendors" @updateRecords="getVendors"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import vendorForm from './form'

    export default {
        components : { vendorForm},
        data() {
            return {
                vendors: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.inventory.vendor_name
                    },
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-vendor') || !helper.hasPermission('create-vendor')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if (helper.hasPermission('list-vendor'))
                this.getVendors();
            helper.showDemoNotification(['inventory']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getVendors(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/vendor?page=' + page + url)
                    .then(response => {
                        this.vendors = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVendor(vendor){
                this.$router.push('/inventory/vendor/'+vendor.id+'/edit');
            },
            confirmDelete(vendor){
                return dialog => this.deleteVendor(vendor);
            },
            deleteVendor(vendor){
                let loader = this.$loading.show();
                axios.delete('/api/vendor/'+vendor.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVendors();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/vendor/print',{filter: this.filter})
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
                axios.post('/api/vendor/pdf',{filter: this.filter})
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
                this.getVendors();
            },
            'filter.order': function(val){
                this.getVendors();
            },
            'filter.page_length': function(val){
                this.getVendors();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>