<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.calling_purpose')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="calling_purposes.total">{{trans('general.total_result_found',{count : calling_purposes.total, from: calling_purposes.from, to: calling_purposes.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="calling_purposes.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('reception.add_new_calling_purpose')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.reception.calling-purpose'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('reception.add_new_calling_purpose')}}</h4>
                        <calling-purpose-form @completed="getCallingPurposes" @cancel="showCreatePanel = !showCreatePanel"></calling-purpose-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="calling_purposes.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('reception.calling_purpose_name')}}</th>
                                    <th>{{trans('reception.calling_purpose_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="calling_purpose in calling_purposes.data">
                                    <td v-text="calling_purpose.name"></td>
                                    <td v-text="calling_purpose.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('reception.edit_calling_purpose')" @click.prevent="editCallingPurpose(calling_purpose)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="calling_purpose.id" v-confirm="{ok: confirmDelete(calling_purpose)}" v-tooltip="trans('reception.delete_calling_purpose')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!calling_purposes.total" module="reception" title="calling_purpose_module_title" description="calling_purpose_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="calling_purposes" @updateRecords="getCallingPurposes" @change.native="getCallingPurposes"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import callingPurposeForm from './form'

    export default {
        components : { callingPurposeForm },
        data() {
            return {
                calling_purposes: {
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
                        translation: i18n.reception.calling_purpose_name
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

            this.getCallingPurposes();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getCallingPurposes(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/reception/calling/purpose?page=' + page + url)
                    .then(response => {
                        this.calling_purposes = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCallingPurpose(calling_purpose){
                this.$router.push('/configuration/reception/calling/purpose/'+calling_purpose.id+'/edit');
            },
            confirmDelete(calling_purpose){
                return dialog => this.deleteCallingPurpose(calling_purpose);
            },
            deleteCallingPurpose(calling_purpose){
                let loader = this.$loading.show();
                axios.delete('/api/reception/calling/purpose/'+calling_purpose.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCallingPurposes();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/reception/calling/purpose/print',{filter: this.filter})
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
                axios.post('/api/reception/calling/purpose/pdf',{filter: this.filter})
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
                this.getCallingPurposes();
            },
            'filter.order': function(val){
                this.getCallingPurposes();
            },
            'filter.page_length': function(val){
                this.getCallingPurposes();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
