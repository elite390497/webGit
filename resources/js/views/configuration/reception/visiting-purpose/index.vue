<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.visiting_purpose')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="visiting_purposes.total">{{trans('general.total_result_found',{count : visiting_purposes.total, from: visiting_purposes.from, to: visiting_purposes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="visiting_purposes.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_visiting_purpose')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.reception.visiting-purpose'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_visiting_purpose')}}</h4>
                        <visiting-purpose-form @completed="getVisitingPurposes" @cancel="showCreatePanel = !showCreatePanel"></visiting-purpose-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="visiting_purposes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('reception.visiting_purpose_name')}}</th>
                                    <th>{{trans('reception.visiting_purpose_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="visiting_purpose in visiting_purposes.data">
                                    <td v-text="visiting_purpose.name"></td>
                                    <td v-text="visiting_purpose.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('reception.edit_visiting_purpose')" @click.prevent="editVisitingPurpose(visiting_purpose)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="visiting_purpose.id" v-confirm="{ok: confirmDelete(visiting_purpose)}" v-tooltip="trans('reception.delete_visiting_purpose')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!visiting_purposes.total" module="reception" title="visiting_purpose_module_title" description="visiting_purpose_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="visiting_purposes" @updateRecords="getVisitingPurposes" @change.native="getVisitingPurposes"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import visitingPurposeForm from './form'

    export default {
        components : { visitingPurposeForm },
        data() {
            return {
                visiting_purposes: {
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
                        translation: i18n.reception.visiting_purpose_name
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

            this.getVisitingPurposes();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getVisitingPurposes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/reception/visiting/purpose?page=' + page + url)
                    .then(response => {
                        this.visiting_purposes = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editVisitingPurpose(visiting_purpose){
                this.$router.push('/configuration/reception/visiting/purpose/'+visiting_purpose.id+'/edit');
            },
            confirmDelete(visiting_purpose){
                return dialog => this.deleteVisitingPurpose(visiting_purpose);
            },
            deleteVisitingPurpose(visiting_purpose){
                let loader = this.$loading.show();
                axios.delete('/api/reception/visiting/purpose/'+visiting_purpose.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getVisitingPurposes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/reception/visiting/purpose/print',{filter: this.filter})
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
                axios.post('/api/reception/visiting/purpose/pdf',{filter: this.filter})
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
                this.getVisitingPurposes();
            },
            'filter.order': function(val){
                this.getVisitingPurposes();
            },
            'filter.page_length': function(val){
                this.getVisitingPurposes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
