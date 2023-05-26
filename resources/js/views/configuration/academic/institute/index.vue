<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.institute_other')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="institutes.total">{{trans('general.total_result_found',{count : institutes.total, from: institutes.from, to: institutes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="institutes.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_institute')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.academic.institute'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_institute')}}</h4>
                        <institute-form @completed="getInstitutes" @cancel="showCreatePanel = !showCreatePanel"></institute-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="institutes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.institute_name')}}</th>
                                    <th>{{trans('academic.institute_contact_number')}}</th>
                                    <th>{{trans('academic.institute_alternate_contact_number')}}</th>
                                    <th>{{trans('academic.institute_principal_name')}}</th>
                                    <th>{{trans('academic.institute_website')}}</th>
                                    <th>{{trans('academic.institute_address')}}</th>
                                    <th>{{trans('academic.institute_remarks')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="institute in institutes.data">
                                    <td v-text="institute.name"></td>
                                    <td v-text="institute.contact_number"></td>
                                    <td v-text="institute.alternate_contact_number"></td>
                                    <td v-text="institute.principal_name"></td>
                                    <td v-text="institute.website"></td>
                                    <td v-text="institute.address"></td>
                                    <td v-text="institute.remarks"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('academic.edit_institute')" @click.prevent="editInstitute(institute)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="institute.id" v-confirm="{ok: confirmDelete(institute)}" v-tooltip="trans('academic.delete_institute')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!institutes.total" module="academic" title="institute_module_title" description="institute_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="institutes" @updateRecords="getInstitutes" @change.native="getInstitutes"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import instituteForm from './form'

    export default {
        components : { instituteForm },
        data() {
            return {
                institutes: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    name: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.institute_name
                    },
                    {
                        value: 'principal_name',
                        translation: i18n.academic.institute_principal_name
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

            this.getInstitutes();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getInstitutes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/academic/institute?page=' + page + url)
                    .then(response => {
                        this.institutes = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editInstitute(institute){
                this.$router.push('/configuration/academic/institute/'+institute.id+'/edit');
            },
            confirmDelete(institute){
                return dialog => this.deleteInstitute(institute);
            },
            deleteInstitute(institute){
                let loader = this.$loading.show();
                axios.delete('/api/academic/institute/'+institute.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getInstitutes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/academic/institute/print',{filter: this.filter})
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
                axios.post('/api/academic/institute/pdf',{filter: this.filter})
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
                this.getInstitutes();
            },
            'filter.order': function(val){
                this.getInstitutes();
            },
            'filter.page_length': function(val){
                this.getInstitutes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
