<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.role')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="roles.total">{{trans('general.total_result_found',{count : roles.total, from: roles.from, to: roles.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('configuration.add_new_role')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.role'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('configuration.add_new_role')}}</h4>
                        <role-form @completed="getRoles" @cancel="showCreatePanel = !showCreatePanel"></role-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="roles.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('configuration.role_name')}}</th>
                                    <th class="table-option">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="role in roles.data">
                                    <td v-text="toWord(role.name)"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-danger btn-sm" :key="role.id" v-confirm="{ok: confirmDelete(role)}" v-tooltip="trans('configuration.delete_role')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!roles.total" module="configuration" title="role_module_title" description="role_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="roles" @updateRecords="getRoles" @change.native="getRoles"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import roleForm from './form'

    export default {
        components : { roleForm },
        data() {
            return {
                roles: {
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
            if(!helper.hasRole('admin')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getRoles();
        },
        methods: {
            getRoles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/role?page=' + page + url)
                    .then(response => {
                        this.roles = response
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(role){
                return dialog => this.deleteRole(role);
            },
            deleteRole(role){
                let loader = this.$loading.show();
                axios.delete('/api/role/'+role.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getRoles();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toWord(word){
                return helper.toWord(word);
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
    }
</script>
