<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.observation')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="observations.total">{{trans('general.total_result_found',{count : observations.total, from: observations.from, to: observations.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration/exam/observation/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_observation')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.exam.observation'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="observations.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.observation_name')}}</th>
                                    <th>{{trans('exam.observation_type')}}</th>
                                    <th>{{trans('exam.observation_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="observation in observations.data">
                                    <td v-text="observation.name"></td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="detail in observation.details">
                                                {{detail.name}} ({{trans('exam.observation_detail', {max_mark: detail.max_mark})}})
                                            </li>
                                        </ul>
                                    </td>
                                    <td v-text="observation.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button v-if="observation.details" class="btn btn-success btn-sm" v-tooltip="trans('exam.reorder_observation')" @click.prevent="showReorderAction(observation)"><i class="fas fa-arrows-alt"></i></button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('exam.edit_observation')" @click.prevent="editObservation(observation)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="observation.id" v-confirm="{ok: confirmDelete(observation)}" v-tooltip="trans('exam.delete_observation')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!observations.total" module="exam" title="observation_module_title" description="observation_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" @click="$router.push('/configuration/exam/observation/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="observations" @updateRecords="getObservations" @change.native="getObservations"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('exam.reorder_observation')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="observation_detail_list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in observation_detail_list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderObservation">{{trans('general.save')}}</button>
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
    import observationForm from './form'

    export default {
        components : { observationForm },
        data() {
            return {
                observations: {
                    total: 0,
                    data: []
                },
                observation: {},
                filter: {
                    sort_by: 'name',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.exam.observation_name
                    }
                ],
                showReorderModal: false,
                observation_detail_list: [],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getObservations();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            showReorderAction(course){
                this.showReorderModal = true;
                this.getObservationDetailList(course);
            },
            getObservationDetailList(observation){
                this.observation_detail_list = [];
                this.observation = observation;
                observation.details.forEach(detail => {
                    this.observation_detail_list.push(detail.name);
                })
            },
            getObservations(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/exam/observation?page=' + page + url)
                    .then(response => {
                        this.observations = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editObservation(observation){
                this.$router.push('/configuration/exam/observation/'+observation.id+'/edit');
            },
            confirmDelete(observation){
                return dialog => this.deleteObservation(observation);
            },
            deleteObservation(observation){
                let loader = this.$loading.show();
                axios.delete('/api/exam/observation/'+observation.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getObservations();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/exam/observation/print',{filter: this.filter})
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
                axios.post('/api/exam/observation/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderObservation(){
                axios.post('/api/exam/observation/'+this.observation.id+'/reorder',{list: this.observation_detail_list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getObservations();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getObservations();
            },
            'filter.order': function(val){
                this.getObservations();
            },
            'filter.page_length': function(val){
                this.getObservations();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
