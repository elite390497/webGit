<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.assign_permission_module', {module: trans(module+'.'+module)})}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm d-none d-sm-inline " @click="$router.push('/configuration/permission')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('configuration.permission')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moduleLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-boxes"></i> <span class="d-none d-sm-inline">{{trans('configuration.locale_module')}} <span>({{toWord(module)}})</span> <i class="fas fa-chevron-down"></i> </span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moduleLink">
                                <button style="cursor:pointer;" class="dropdown-item" v-for="mod in modules" @click="$router.push('/configuration/permission/'+mod)">
                                    {{trans(mod+'.'+mod)}}  <span v-if="mod == module" class="pull-right"><i class="fas fa-check"></i></span> 
                                </button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'configuration.permission'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <div class="table-responsive m-b-20">
                        <form @submit.prevent="proceed" @keydown="permissionForm.errors.clear($event.target.name)">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>{{trans('configuration.permission')}}</th>
                                        <th v-for="role_permission in permissionForm.roles">{{toWord(role_permission.name)}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="permission in permissions">
                                        <td>{{toWord(permission)}}</td>
                                        <td v-for="role_permission in permissionForm.roles">
                                            <label class="custom-control custom-checkbox" style="cursor:pointer;">
                                                <input type="checkbox" class="custom-control-input" :value="permission" v-model="role_permission.permissions" :disabled="role_permission.name == getDefaultRole('admin') ? true : false">
                                                <span class="custom-control-label"></span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="button" class="btn btn-info waves-effect waves-light pull-right " @click="submit">{{trans('general.save')}}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                module:this.$route.params.module,
                roles: [],
                permissions: [],
                modules: [],
                assigned_permissions: [],
                permissionForm: new Form({
                    module: '',
                    roles: []
                },false),
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasRole('admin')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                this.permissionForm.roles = [];
                this.permissionForm.module = this.module;
                axios.get('/api/permission/'+this.module+'/pre-requisite')
                    .then(response => {
                        this.roles = response.roles;
                        this.permissions = response.permissions;
                        this.assigned_permissions = response.assigned_permissions;
                        this.modules = response.modules;

                        this.roles.forEach(role => {

                            let permissions = this.assigned_permissions.find(o => o.role == role.name);

                            this.permissionForm.roles.push({
                                name: role.name,
                                permissions: (permissions != 'undefined') ? permissions.permissions : []
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            toWord(word){
                return helper.toWord(word);
            },
            submit(){
                let loader = this.$loading.show();
                this.permissionForm.module = this.module;
                this.permissionForm.post('/api/permission/module')
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getDefaultRole(role){
                return helper.getDefaultRole(role);
            }
        },
        watch: {
            '$route.params.module': function (module) {
                this.module = module;
                this.getPreRequisite();
            }
        }
    }
</script>