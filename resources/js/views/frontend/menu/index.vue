<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('frontend.menu')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="menus.length">{{trans('general.total_result_count',{count : menus.length})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="menus.length && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('frontend.add_new_menu')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="menus.length" @click="showMenuModal = true" v-tooltip="trans('frontend.reorder_menu')"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">{{trans('frontend.reorder_menu')}}</span></button>
                        <!-- <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div> -->
                        <help-button @clicked="help_topic = 'frontend.menu'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('frontend.add_new_menu')}}</h4>
                        <menu-form @completed="getMenus" @cancel="showCreatePanel = !showCreatePanel"></menu-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title p-3">{{trans('frontend.menu_type_header')}}</h4>
                    <menu-table :menus="headerMenu" @completed="getMenus"></menu-table>
                    <h4 class="card-title p-3">{{trans('frontend.menu_type_footer')}}</h4>
                    <menu-table :menus="footerMenu" @completed="getMenus"></menu-table>
                    <h4 class="card-title p-3">{{trans('frontend.menu_type_other')}}</h4>
                    <menu-table :menus="otherMenu" @completed="getMenus"></menu-table>

                    <module-info v-if="!menus.length" module="frontend" title="menu_module_title" description="menu_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showMenuModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('frontend.reorder_menu')}}
                                <span class="float-right pointer" @click="showMenuModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <h4 class="card-title">{{trans('frontend.menu_type_header')}}</h4>
                                <draggable v-model="header_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in header_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <h4 class="card-title m-t-20">{{trans('frontend.menu_type_footer')}}</h4>
                                <draggable v-model="footer_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in footer_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderMenu">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import menuForm from './form'
    import menuTable from './table'

    export default {
        components : { menuForm, menuTable},
        data() {
            return {
                menus: [],
                menu: {},
                filter: {
                    sort_by : 'name',
                    order: 'asc'
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.frontend.menu_name
                    }
                ],
                showCreatePanel: false,
                help_topic: '',
                header_list: [],
                footer_list: [],
                showMenuModal: false
            };
        },
        mounted(){
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getMenus();
            helper.showDemoNotification(['frontend']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getMenus(menu){
                let loader = this.$loading.show();
                if (typeof menu !== 'number') {
                    menu = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/frontend/menu?menu=' + menu + url)
                    .then(response => {
                        this.header_list = [];
                        this.footer_list = [];
                        this.menus = response.menus;
                        this.menus.forEach(menu => {
                            if (menu.type == 'header')
                                this.header_list.push(menu.name);
                            if (menu.type == 'footer')
                                this.footer_list.push(menu.name);
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/frontend/menu/print',{filter: this.filter})
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
                axios.post('/api/frontend/menu/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderMenu(){
                axios.post('/api/frontend/menu/reorder',{header_list: this.header_list, footer_list: this.footer_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showMenuModal = false;
                        this.getMenus();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getMenus();
            },
            'filter.order': function(val){
                this.getMenus();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            },
            headerMenu(){
                return this.menus.filter(o => o.type == 'header');
            },
            footerMenu(){
                return this.menus.filter(o => o.type == 'footer');
            },
            otherMenu(){
                return this.menus.filter(o => !o.type);
            }
        }
    }
</script>