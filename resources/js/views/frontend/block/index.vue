<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('frontend.block')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="blocks.total">{{trans('general.total_result_found',{count : blocks.total, from: blocks.from, to: blocks.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="blocks.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('frontend.add_new_block')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="blocks.total" @click="showBlockModal = true" v-tooltip="trans('frontend.reorder_block')"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">{{trans('frontend.reorder_block')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <!-- <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div> -->
                        <help-button @clicked="help_topic = 'frontend.block'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('frontend.block_title')}}</label>
                                    <input class="form-control" name="title" v-model="filter.title">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getBlocks">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('frontend.add_new_block')}}</h4>
                        <block-form @completed="getBlocks" @cancel="showCreatePanel = !showCreatePanel"></block-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="blocks.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('frontend.block_title')}}</th>
                                    <th>{{trans('frontend.block_is_draft')}}</th>
                                    <th>{{trans('frontend.menu')}}</th>
                                    <th>{{trans('frontend.block_url')}}</th>
                                    <th style="width:50%;">{{trans('frontend.block_body')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="block in blocks.data">
                                    <td v-text="block.title"></td>
                                    <td>
                                        <span v-if="block.is_draft"><i class="fas fa-check"></i></span>
                                        <span v-else><i class="fas fa-times"></i></span>
                                    </td>
                                    <td>{{block.menu ? block.menu.name : ''}}</td>
                                    <td>{{block.url}}</td>
                                    <td v-html="block.excerpt"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('frontend.view_block')" @click.prevent="showAction(block)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('frontend.edit_block')" @click.prevent="editBlock(block)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="block.id" v-confirm="{ok: confirmDelete(block)}" v-tooltip="trans('frontend.delete_block')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!blocks.total" module="frontend" title="block_module_title" description="block_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="blocks" @updateRecords="getBlocks"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showBlockModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('frontend.reorder_block')}}
                                <span class="float-right pointer" @click="showBlockModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderBlock">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <block-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></block-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import blockForm from './form'
    import blockDetail from './show'

    export default {
        components : { blockForm,blockDetail},
        data() {
            return {
                blocks: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'title',
                    order: 'asc',
                    title: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'title',
                        translation: i18n.frontend.block_title
                    }
                ],
                list: [],
                showFilterPanel: false,
                showCreatePanel: false,
                showBlockModal: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getBlocks();
            helper.showDemoNotification(['frontend']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(block){
                this.showUuid = block.uuid;
                this.showModal = true;
            },
            getBlocks(block){
                let loader = this.$loading.show();
                if (typeof block !== 'number') {
                    block = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/frontend/block?block=' + block + url)
                    .then(response => {
                        this.list = [];
                        this.blocks = response.blocks;
                        this.blocks.data.forEach(block => {
                            this.list.push(block.title);
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editBlock(block){
                this.$router.push('/frontend/block/'+block.uuid+'/edit');
            },
            confirmDelete(block){
                return dialog => this.deleteBlock(block);
            },
            deleteBlock(block){
                let loader = this.$loading.show();
                axios.delete('/api/frontend/block/'+block.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getBlocks();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/frontend/block/print',{filter: this.filter})
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
                axios.post('/api/frontend/block/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderBlock(){
                axios.post('/api/frontend/block/reorder',{list: this.list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showBlockModal = false;
                        this.getBlocks();
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
                this.getBlocks();
            },
            'filter.order': function(val){
                this.getBlocks();
            },
            'filter.page_length': function(val){
                this.getBlocks();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>