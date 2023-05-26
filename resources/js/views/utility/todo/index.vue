<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('utility.todo')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="todos.total">{{trans('general.total_result_found',{count : todos.total, from: todos.from, to: todos.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="todos.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('utility.add_new_todo')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <help-button @clicked="help_topic = 'utility.todo'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('utility.add_new_todo')}}</h4>
                        <todo-form @completed="getTodos" @cancel="showCreatePanel = !showCreatePanel"></todo-form>
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="">{{trans('utility.todo_keyword')}}</label>
                                    <input class="form-control" name="keyword" v-model="filter.keyword">
                                </div>
                            </div>
                            <div class="col-6">
                                <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <switches v-model="filter.status" theme="bootstrap" color="success"></switches> {{trans('utility.todo_show_completed')}}
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                        </div>
                    </div>
                </div>
            </transition>

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="todos.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('utility.todo_title')}}</th>
                                    <th>{{trans('utility.todo_date')}}</th>
                                    <th>{{trans('utility.todo_status')}}</th>
                                    <th>{{trans('utility.todo_completed_at')}}</th>
                                    <th>{{trans('utility.todo_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="todo in todos.data">
                                    <td v-text="todo.title"></td>
                                    <td>{{todo.date | moment}}</td>
                                    <td v-html="getStatus(todo)"></td>
                                    <td>{{todo.completed_at | momentDateTime}}</td>
                                    <td v-text="todo.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-secondary btn-sm" v-tooltip="todo.status ? trans('utility.todo_mark_as_incomplete') : trans('utility.todo_mark_as_complete')" @click.prevent="toggleStatus(todo)">
                                                <i :class="['fa', (todo.status ?  'fa-times' : 'fa-check')]"></i>
                                            </button>
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('utility.edit_todo')" @click.prevent="editTodo(todo)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="todo.id" v-confirm="{ok: confirmDelete(todo)}" v-tooltip="trans('utility.delete_todo')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!todos.total" module="utility" title="todo_module_title" description="todo_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="todos" @updateRecords="getTodos"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import todoForm from './form'

    export default {
        components : { todoForm},
        data() {
            return {
                todos: {
                    total: 0,
                    data: []
                },
                filter: {
                    keyword: '',
                    status: false,
                    start_date: '',
                    end_date: '',
                    sort_by : 'created_at',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'title',
                        translation: i18n.utility.todo_title
                    },
                    {
                        value: 'description',
                        translation: i18n.utility.todo_description
                    },
                    {
                        value: 'created_at',
                        translation: i18n.utility.todo_date
                    },
                    {
                        value: 'status',
                        translation: i18n.utility.todo_status
                    }
                ],
                showCreatePanel: false,
                showFilterPanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-todo')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.featureAvailable('todo')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }

            this.getTodos();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getTodos(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/todo?page=' + page + url)
                    .then(response => {
                        this.todos = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTodo(todo){
                this.$router.push('/utility/todo/'+todo.id+'/edit');
            },
            confirmDelete(todo){
                return dialog => this.deleteTodo(todo);
            },
            deleteTodo(todo){
                let loader = this.$loading.show();
                axios.delete('/api/todo/'+todo.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTodos();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStatus(todo){
                return todo.status ? ('<span class="label label-success">'+i18n.utility.todo_complete+'</span>') : ('<span class="label label-danger">'+i18n.utility.todo_incomplete+'</span>') ;
            },
            toggleStatus(todo){
                let loader = this.$loading.show();
                axios.post('/api/todo/'+todo.id+'/status')
                    .then(response => {
                        this.getTodos();
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg();
                    });
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
            filter: {
                handler(val){
                    setTimeout(() => {
                        this.getTodos();
                    }, 500)
                },
                deep: true
            }
        }
    }
</script>
