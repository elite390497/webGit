<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.custom_field')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="custom_fields.total">{{trans('general.total_result_found',{count : custom_fields.total, from: custom_fields.from, to: custom_fields.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="custom_fields.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('configuration.add_new_custom_field')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.custom_field'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.custom_field_form')}}</label>
                                    <select v-model="filter.form" class="custom-select col-12">
                                      <option value="" selected>{{trans('general.select_one')}}</option>
                                      <option v-for="form in forms" v-bind:value="form.value">
                                        {{ form.text }}
                                      </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getCustomFields">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('configuration.add_new_custom_field')}}</h4>
                        <custom-field-form @completed="getCustomFields" @cancel="showCreatePanel = !showCreatePanel"></custom-field-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="custom_fields.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('configuration.custom_field_form')}}</th>
                                    <th>{{trans('configuration.custom_field_name')}}</th>
                                    <th>{{trans('configuration.custom_field_type')}}</th>
                                    <th>{{trans('configuration.custom_field_width')}}</th>
                                    <th>{{trans('configuration.custom_field_required')}}</th>
                                    <th>{{trans('configuration.custom_field_value')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="custom_field in custom_fields.data">
                                    <td>{{ trans('configuration.custom_field_form_'+custom_field.form) }}
                                    </td>
                                    <td v-text="custom_field.name"></td>
                                    <td>
                                        {{ trans('list.'+custom_field.type) }}
                                        <span v-if="custom_field.type == 'numeric_input'">
                                            <br /> <small>{{trans('configuration.custom_field_min_value')}}: {{custom_field.options.hasOwnProperty('min_value') ? custom_field.options.min_value : ''}}</small>
                                            <br /> <small>{{trans('configuration.custom_field_max_value')}}: {{custom_field.options.hasOwnProperty('max_value') ? custom_field.options.max_value : ''}}</small>
                                            <br /> <small>{{trans('configuration.custom_field_decimal_place')}}: {{custom_field.options.hasOwnProperty('decimal_place') ? custom_field.options.decimal_place : ''}}</small>
                                        </span>
                                        <span v-if="custom_field.type == 'text_input' || custom_field.type == 'multi_line_input'">
                                            <br /> <small>{{trans('configuration.custom_field_min_length')}}: {{custom_field.options.hasOwnProperty('min_length') ? custom_field.options.min_length : ''}}</small>
                                            <br /> <small>{{trans('configuration.custom_field_max_length')}}: {{custom_field.options.hasOwnProperty('max_length') ? custom_field.options.max_length : ''}}</small>
                                        </span>
                                    </td>
                                    <td>{{ trans('list.'+custom_field.width) }}</td>
                                    <td>
                                        <i class="fas fa-check" v-if="custom_field.is_required"></i>
                                        <i class="fas fa-times" v-else></i>
                                    </td>
                                    <td>
                                        {{custom_field.values.join(', ')}}
                                    </td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('configuration.reorder_custom_field')" @click.prevent="showReorderAction(custom_field.form)"><i class="fas fa-arrows-alt"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('configuration.edit_custom_field')" @click.prevent="editCustomField(custom_field)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="custom_field.id" v-confirm="{ok: confirmDelete(custom_field)}" v-tooltip="trans('configuration.delete_custom_field')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!custom_fields.total" module="configuration" title="custom_field_module_title" description="custom_field_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="custom_fields" @updateRecords="getCustomFields" @change.native="getCustomFields"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>

        <transition name="modal" v-if="showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('configuration.reorder_custom_field')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="reorder_custom_fields" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in reorder_custom_fields" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item.name}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderCustomField">{{trans('general.save')}}</button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import customFieldForm from './form'

    export default {
        components : { customFieldForm },
        data() {
            return {
                custom_fields: {
                    total: 0,
                    data: []
                },
                reorder_custom_fields: [],
                filter: {
                    sort_by: 'position',
                    order: 'asc',
                    form: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.configuration.custom_field_name
                    },
                    {
                        value: 'position',
                        translation: i18n.configuration.custom_field_position
                    },
                    {
                        value: 'form',
                        translation: i18n.configuration.custom_field_form
                    },
                    {
                        value: 'type',
                        translation: i18n.configuration.custom_field_type
                    }
                ],
                forms: [],
                showCreatePanel: false,
                showFilterPanel: false,
                showReorderModal: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCustomFields();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission) {
                return helper.hasPermission(permission);
            },
            getCustomFields(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/custom-field?page=' + page + url)
                    .then(response => {
                        this.custom_fields = response.custom_fields;
                        this.forms = response.filters.forms;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCustomField(custom_field){
                this.$router.push('/configuration/custom-field/'+custom_field.id+'/edit');
            },
            confirmDelete(custom_field){
                return dialog => this.deleteCustomField(custom_field);
            },
            deleteCustomField(custom_field){
                let loader = this.$loading.show();
                axios.delete('/api/custom-field/'+custom_field.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCustomFields();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/custom-field/print',{filter: this.filter})
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
                axios.post('/api/custom-field/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showReorderAction(form)
            {
                let loader = this.$loading.show();
                axios.get('/api/custom-field/fetch?form='+form)
                    .then(response => {
                        this.reorder_custom_fields = response;
                        loader.hide();
                        this.showReorderModal = true;
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderCustomField()
            {
                let loader = this.$loading.show();
                axios.post('/api/custom-field/reorder', {
                        list: this.reorder_custom_fields
                    })
                    .then(response => {
                        this.showReorderModal = false;
                        loader.hide();
                        toastr.success(response.message);
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
                this.getCustomFields();
            },
            'filter.order': function(val){
                this.getCustomFields();
            },
            'filter.page_length': function(val){
                this.getCustomFields();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>