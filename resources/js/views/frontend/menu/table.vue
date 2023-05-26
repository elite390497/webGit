<template>
    <div class="table-responsive" v-if="menus.length">
        <table class="table table-sm">
            <thead>
                <tr>
                    <th width="20%">{{trans('frontend.menu_name')}}</th>
                    <th width="30%">{{trans('frontend.sub_menu')}}</th>
                    <th width="30%">{{trans('frontend.page')}}</th>
                    <th class="table-option">{{trans('general.action')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="menu in menus">
                    <td v-text="menu.name"></td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            <li v-for="child in menu.children">{{child.name}}: {{child.page ? child.page.title : '-'}}</li>
                        </ul>
                    </td>
                    <td>{{menu.page ? menu.page.title : '-'}}</td>
                    <td class="table-option">
                        <div class="btn-group">
                            <template v-if="menu.options.is_default">
                                <button class="btn btn-sm btn-success" disabled v-tooltip="trans('frontend.default_menu')"><i class="fas fa-lock"></i></button>
                            </template>
                            <template v-else>
                                <button v-if="menu.children.length" class="btn btn-success btn-sm" v-tooltip="trans('frontend.reorder_sub_menu')" @click.prevent="showReorderSubMenu(menu)"><i class="fas fa-arrows-alt"></i></button>
                                <button class="btn btn-info btn-sm" v-tooltip="trans('frontend.edit_menu')" @click.prevent="editMenu(menu)"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm" :key="menu.id" v-confirm="{ok: confirmDelete(menu)}" v-tooltip="trans('frontend.delete_menu')"><i class="fas fa-trash"></i></button>
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <transition name="modal" v-if="showSubMenuModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('frontend.reorder_sub_menu')}}
                                <span class="float-right pointer" @click="showSubMenuModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="sub_menu_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in sub_menu_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderSubMenu">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	export default {
        components : { },
		data(){
			return {
                sub_menu_list: [],
                showSubMenuModal: false
			}
		},
		props: {
			menus: Array
		},
		methods: {
            editMenu(menu){
                this.$router.push('/frontend/menu/'+menu.id+'/edit');
            },
            confirmDelete(menu){
                return dialog => this.deleteMenu(menu);
            },
            deleteMenu(menu){
                let loader = this.$loading.show();
                axios.delete('/api/frontend/menu/'+menu.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderSubMenu(){
                axios.post('/api/frontend/menu/'+this.menu.id+'/reorder',{list: this.sub_menu_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showSubMenuModal = false;
                        this.$emit('completed');
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            },
            showReorderSubMenu(menu){
                this.showSubMenuModal = true;
                this.getSubMenu(menu);
            },
            getSubMenu(menu){
                this.sub_menu_list = [];
                this.menu = menu;
                menu.children.forEach(child => {
                    this.sub_menu_list.push(child.name);
                })
            }
		}
	}
</script>