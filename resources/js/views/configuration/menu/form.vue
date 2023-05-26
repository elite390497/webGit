<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body p-4">
                    <form @submit.prevent="submit" @keydown="configForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 offset-md-1">
                                <template v-for="module in configForm.modules">
                                    <h4 class="card-title">{{trans(module.translation)}}</h4>
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="module.menu.visibility" :name="getMenuName(module.menu.name)" @change="updateSubMenu(module.menu)">
                                            <span class="custom-control-label">{{trans(module.menu.translation)}}</span>
                                        </label>
                                    </div>
                                    <div v-show="module.menu.visibility" class="form-group" style="padding-left: 40px;" v-for="submenu in module.menu.submenu">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="submenu.visibility" :name="getMenuName(submenu.name)">
                                            <span class="custom-control-label">{{trans(submenu.translation)}}</span>
                                        </label>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <button type="submit" v-if="!setupWizard" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        props: {
            setupWizard: {
                default: false
            },
            configurations: {
                required: false
            }
        },
        components : { },
        data() {
            return {
                configForm: new Form({
                    config_type: 'menu',
                    modules: []
                },false),
                menus: [],
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/home');
            }

            this.getPreRequisite();

            if(!this.setupWizard)
                this.getConfiguration();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/configuration/variable?type=menu')
                    .then(response => {
                        this.configForm.modules = response.modules;
                        
                        this.menus = response.menus;
                        this.configForm.modules.forEach(module => {
                            if (response.menus.findIndex(o => o === module.menu.name) >= 0) {
                                module.menu.visibility = true;
                            } else {
                                module.menu.visibility = false;
                            }

                            module.menu.submenu.forEach(sbmenu => {
                                if (response.menus.findIndex(o => o === sbmenu.name) >= 0) {
                                    sbmenu.visibility = true;
                                } else {
                                    sbmenu.visibility = false;
                                }
                            })
                        });
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getMenuName(name) {
                return 'show_'+name+'_menu';
            },
            updateSubMenu(menu){
                if (! menu.visibility) {
                    menu.submenu.forEach(sbmenu => {
                        sbmenu.visibility = false;
                    });
                } else {
                    menu.submenu.forEach(sbmenu => {
                        sbmenu.visibility = true;
                    });
                }
            },
            submit(){
                let loader = this.$loading.show();
                return this.configForm.post('/api/configuration')
                    .then(response => {
                        loader.hide();
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);
                        return true;
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        return false;
                    });
            }
        }
	}
</script>