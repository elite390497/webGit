<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.permission')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="permissions.total">{{trans('general.total_result_found',{count : permissions.total, from: permissions.from, to: permissions.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('configuration.add_new_permission')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration/permission/assign')"><i class="fas fa-user-plus"></i> <span class="d-none d-sm-inline">{{trans('configuration.assign_permission')}}</span></button>
                        <help-button @clicked="help_topic = 'configuration.permission'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('configuration.add_new_permission')}}</h4>
                        <permission-form @completed="getPermissions" @cancel="showCreatePanel = !showCreatePanel"></permission-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="permissions.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('configuration.permission_name')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="permission in permissions.data">
                                    <td v-text="toWord(permission.name)"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-danger btn-sm" :key="permission.id" v-confirm="{ok: confirmDelete(permission)}" v-tooltip="trans('configuration.delete_permission')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!permissions.total" module="configuration" title="permission_module_title" description="permission_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="permissions" @updateRecords="getPermissions" @change.native="getPermissions"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import permissionForm from './form'

    export default {
        components : { permissionForm },
        data() {
            return {
                permissions: {
                    total: 0,
                    data: []
                },
                filter: {
                    page_length: helper.getConfig('page_length')
                },
                showCreatePanel: false
            };
        },
        mounted(){
            if(!helper.hasRole('admin')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getPermissions();
        },
        methods: {
            getPermissions(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/permission?page=' + page + url)
                    .then(response => {
                        this.permissions = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDelete(permission){
                return dialog => this.deletePermission(permission);
            },
            deletePermission(permission){
                let loader = this.$loading.show();
                axios.delete('/api/permission/'+permission.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getPermissions();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            toWord(str){
                return helper.toWord(str);
            }
        }
    }
</script>
