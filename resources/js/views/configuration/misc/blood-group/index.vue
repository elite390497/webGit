<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('misc.blood_group')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="blood_groups.total">{{trans('general.total_result_found',{count : blood_groups.total, from: blood_groups.from, to: blood_groups.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="blood_groups.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('misc.add_new_blood_group')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.misc.blood-group'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('misc.add_new_blood_group')}}</h4>
                        <blood-group-form @completed="getBloodGroups" @cancel="showCreatePanel = !showCreatePanel"></blood-group-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="blood_groups.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('misc.blood_group_name')}}</th>
                                    <th>{{trans('misc.blood_group_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="blood_group in blood_groups.data">
                                    <td v-text="blood_group.name"></td>
                                    <td v-text="blood_group.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('misc.edit_blood_group')" @click.prevent="editBloodGroup(blood_group)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="blood_group.id" v-confirm="{ok: confirmDelete(blood_group)}" v-tooltip="trans('misc.delete_blood_group')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!blood_groups.total" module="misc" title="blood_group_module_title" description="blood_group_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="blood_groups" @updateRecords="getBloodGroups" @change.native="getBloodGroups"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import bloodGroupForm from './form'

    export default {
        components : { bloodGroupForm },
        data() {
            return {
                blood_groups: {
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
                        translation: i18n.misc.blood_group_name
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

            this.getBloodGroups();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getBloodGroups(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/misc/blood/group?page=' + page + url)
                    .then(response => {
                        this.blood_groups = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editBloodGroup(blood_group){
                this.$router.push('/configuration/misc/blood/group/'+blood_group.id+'/edit');
            },
            confirmDelete(blood_group){
                return dialog => this.deleteBloodGroup(blood_group);
            },
            deleteBloodGroup(blood_group){
                let loader = this.$loading.show();
                axios.delete('/api/misc/blood/group/'+blood_group.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getBloodGroups();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/misc/blood/group/print',{filter: this.filter})
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
                axios.post('/api/misc/blood/group/pdf',{filter: this.filter})
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
                this.getBloodGroups();
            },
            'filter.order': function(val){
                this.getBloodGroups();
            },
            'filter.page_length': function(val){
                this.getBloodGroups();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
