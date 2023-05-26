<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.ip_filter')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="ip_filters.total">{{trans('general.total_result_found',{count : ip_filters.total, from: ip_filters.from, to: ip_filters.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('utility.add_new_ip_filter')}}</span></button>
                        <help-button @clicked="help_topic = 'utility.ip-filter'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('utility.add_new_ip_filter')}}</h4>
                        <show-tip module="utility" tip="tip_ip_filter"></show-tip>
                        <ip-filter-form @completed="getIpFilters" @cancel="showCreatePanel = !showCreatePanel"></ip-filter-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="ip_filters.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('utility.start_ip')}}</th>
                                    <th>{{trans('utility.end_ip')}}</th>
                                    <th>{{trans('utility.ip_filter_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ip_filter in ip_filters.data">
                                    <td v-text="ip_filter.start_ip"></td>
                                    <td v-text="ip_filter.end_ip"></td>
                                    <td v-text="ip_filter.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('utility.edit_ip_filter')" @click.prevent="editIpFilter(ip_filter)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="ip_filter.id" v-confirm="{ok: confirmDelete(ip_filter)}" v-tooltip="trans('utility.delete_ip_filter')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!ip_filters.total" module="utility" title="ip_filter_module_title" description="ip_filter_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="ip_filters" @updateRecords="getIpFilters" @change.native="getIpFilters"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import ipFilterForm from './form'

    export default {
        components : { ipFilterForm },
        data() {
            return {
                ip_filters: {
                    total: 0,
                    data: []
                },
                filter: {
                    page_length: helper.getConfig('page_length')
                },
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.featureAvailable('ip_filter')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }

            this.getIpFilters();
        },
        methods: {
            getIpFilters(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/ip-filter?page=' + page + url)
                    .then(response => {
                        this.ip_filters = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editIpFilter(ip_filter){
                this.$router.push('/utility/ip-filter/'+ip_filter.id+'/edit');
            },
            confirmDelete(ip_filter){
                return dialog => this.deleteIpFilter(ip_filter);
            },
            deleteIpFilter(ip_filter){
                let loader = this.$loading.show();
                axios.delete('/api/ip-filter/'+ip_filter.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getIpFilters();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
