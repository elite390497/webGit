<template>
    <div>
        <form @submit.prevent="proceed" @keydown="menuForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('frontend.menu_name')}}</label>
                        <input class="form-control" type="text" v-model="menuForm.name" name="name" :placeholder="trans('frontend.menu_name')">
                        <show-error :form-name="menuForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('frontend.menu_type')}}</label>
                        <select v-model="menuForm.type" class="custom-select col-12" name="type" @change="menuForm.errors.clear('type')">
                          <option v-for="type in types" v-bind:value="type.value">
                            {{ type.text }}
                          </option>
                        </select>
                        <show-error :form-name="menuForm" prop-name="type"></show-error>
                    </div>  
                </div>
                <div class="col-12 col-sm-2" v-if="menuForm.type == 'header'">
                    <div class="form-group">
                        <label class="custom-control custom-checkbox m-t-20">
                            <input type="checkbox" class="custom-control-input" v-model="menuForm.has_sub_menu" value="1">
                            <span class="custom-control-label">{{trans('frontend.menu_has_sub_menu')}}</span>
                        </label>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('frontend.page')}}</label>
                        <select v-model="menuForm.page_id" class="custom-select col-12" name="page_id" @change="menuForm.errors.clear('page_id')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="page in pages" v-bind:value="page.value">
                            {{ page.text }}
                          </option>
                        </select>
                        <show-error :form-name="menuForm" prop-name="page_id"></show-error>
                    </div>  
                </div>
            </div>
            <div v-if="menuForm.has_sub_menu && menuForm.type == 'header'" class="px-4">
                <div class="row" v-for="(sub_menu,index) in menuForm.sub_menus">
                    <div class="col-12 col-sm-1">
                        <button type="button" class="btn btn-danger btn-sm" :key="index" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <input class="form-control" type="text" v-model="sub_menu.name" :name="getSubMenuName(index)" :placeholder="trans('frontend.sub_menu')">
                            <show-error :form-name="menuForm" :prop-name="getSubMenuName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <select v-model="sub_menu.page_id" class="custom-select col-12" :name="getSubMenuPageName(index)" @change="menuForm.errors.clear(getSubMenuPageName(index))">
                              <option v-for="page in pages" v-bind:value="page.value">
                                {{ page.text }}
                              </option>
                            </select>
                            <show-error :form-name="menuForm" :prop-name="getSubMenuPageName(index)"></show-error>
                        </div>  
                    </div>
                </div>
                <button type="button" class="btn btn-info btn-sm mx-4 m-b-20" @click="addNewSubMenu">{{trans('frontend.add_new_sub_menu')}}</button>
            </div>

            <div class="card-footer text-right">
                <router-link to="/frontend/menu" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                menuForm: new Form({
                    name: '',
                    type: null,
                    has_sub_menu: 0,
                    sub_menus: [],
                    page_id: ''
                }),
                pages: [],
                types: [
                    {
                        text: i18n.general.select_one,
                        value: null
                    },
                    {
                        text: i18n.frontend.menu_type_header,
                        value: "header"
                    },
                    {
                        text: i18n.frontend.menu_type_footer,
                        value: "footer"
                    }
                ]
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/menu/pre-requisite')
                    .then(response => {
                        this.pages = response.pages;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getSubMenuName(index){
                return 'sub_menu_'+index;
            },
            getSubMenuPageName(index){
                return 'sub_menu_page_id_'+index;
            },
            addNewSubMenu(){
                this.menuForm.sub_menus.push({
                    name: '',
                    page_id: ''
                });
            },
            confirmDelete(index){
                return dialog => this.deleteSubMenu(index);
            },
            deleteSubMenu(index){
                this.menuForm.sub_menus.splice(index, 1);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.menuForm.post('/api/frontend/menu')
                    .then(response => {
                        toastr.success(response.message);
                        this.menuForm.type = 'header';
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/menu/'+this.id)
                    .then(response => {
                        this.menuForm.name = response.menu.name;
                        this.menuForm.type = response.menu.type;
                        this.menuForm.parent_id = response.menu.parent_id;
                        this.menuForm.page_id = response.menu.frontend_page_id;
                        this.menuForm.has_sub_menu = response.menu.children.length ? 1 : 0;
                        response.menu.children.forEach(child => {
                            this.menuForm.sub_menus.push({
                                name: child.name,
                                page_id: child.frontend_page_id
                            })
                        });
                        loader.hide();

                        if (response.menu.options.is_default){
                            this.$router.push('/frontend/menu');
                        }
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/frontend/menu');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.menuForm.patch('/api/frontend/menu/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/frontend/menu');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>