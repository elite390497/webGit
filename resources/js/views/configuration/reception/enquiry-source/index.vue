<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.enquiry_source')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="enquiry_sources.total">{{trans('general.total_result_found',{count : enquiry_sources.total, from: enquiry_sources.from, to: enquiry_sources.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="enquiry_sources.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_enquiry_source')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.reception.enquiry-source'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_enquiry_source')}}</h4>
                        <enquiry-source-form @completed="getEnquirySources" @cancel="showCreatePanel = !showCreatePanel"></enquiry-source-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="enquiry_sources.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('reception.enquiry_source_name')}}</th>
                                    <th>{{trans('reception.enquiry_source_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="enquiry_source in enquiry_sources.data">
                                    <td v-text="enquiry_source.name"></td>
                                    <td v-text="enquiry_source.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('reception.edit_enquiry_source')" @click.prevent="editEnquirySource(enquiry_source)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="enquiry_source.id" v-confirm="{ok: confirmDelete(enquiry_source)}" v-tooltip="trans('reception.delete_enquiry_source')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!enquiry_sources.total" module="reception" title="enquiry_source_module_title" description="enquiry_source_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="enquiry_sources" @updateRecords="getEnquirySources" @change.native="getEnquirySources"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import enquirySourceForm from './form'

    export default {
        components : { enquirySourceForm },
        data() {
            return {
                enquiry_sources: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.reception.enquiry_source_name
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

            this.getEnquirySources();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getEnquirySources(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/reception/enquiry/source?page=' + page + url)
                    .then(response => {
                        this.enquiry_sources = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editEnquirySource(enquiry_source){
                this.$router.push('/configuration/reception/enquiry/source/'+enquiry_source.id+'/edit');
            },
            confirmDelete(enquiry_source){
                return dialog => this.deleteEnquirySource(enquiry_source);
            },
            deleteEnquirySource(enquiry_source){
                let loader = this.$loading.show();
                axios.delete('/api/reception/enquiry/source/'+enquiry_source.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getEnquirySources();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/reception/enquiry/source/print',{filter: this.filter})
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
                axios.post('/api/reception/enquiry/source/pdf',{filter: this.filter})
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
                this.getEnquirySources();
            },
            'filter.order': function(val){
                this.getEnquirySources();
            },
            'filter.page_length': function(val){
                this.getEnquirySources();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
