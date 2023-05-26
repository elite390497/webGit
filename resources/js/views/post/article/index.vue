<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('post.article')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="articles.total">{{trans('general.total_result_found',{count : articles.total, from: articles.from, to: articles.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="articles.total && !showCreatePanel && hasPermission('create-article')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('post.add_new_article')}}</span></button>
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
                        <help-button @clicked="help_topic = 'post.article'"></help-button>
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
                                    <label for="">{{trans('post.article_type')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_article_types" name="article_type_id" id="article_type_id" :options="article_types" :placeholder="trans('post.select_article_type')" @select="onArticleTypeSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onArticleTypeRemove" :selected="selected_article_types">
                                        <div class="multiselect__option" slot="afterList" v-if="!article_types.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('post.article_keyword')}}</label>
                                    <input class="form-control" name="keyword" v-model="filter.keyword">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <date-range-picker :start-date.sync="filter.date_of_article_start_date" :end-date.sync="filter.date_of_article_end_date" :label="trans('post.date_of_article_between')"></date-range-picker>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getArticles">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-article')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('post.add_new_article')}}</h4>
                        <article-form @completed="getArticles" @cancel="showCreatePanel = !showCreatePanel"></article-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="articles.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('post.article_type')}}</th>
                                    <th>{{trans('post.article_title')}}</th>
                                    <th>{{trans('post.date_of_article')}}</th>
                                    <th>{{trans('post.article_is_public')}}</th>
                                    <th>{{trans('post.article_posted_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="article in articles.data">
                                    <td v-text="article.article_type.name"></td>
                                    <td v-text="article.title"></td>
                                    <td>{{article.date_of_article | moment}}</td>
                                    <td>
                                        <span v-if="article.is_public"><i class="fas fa-check"></i></span>
                                        <span v-else><i class="fas fa-times"></i></span>
                                    </td>
                                    <td>{{getEmployeeName(article.user.employee)}} <br > {{getEmployeeDesignationOnDate(article.user.employee, article.date_of_article)}}</td>
                                    <td>{{article.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('post.view_article')" @click.prevent="showAction(article)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-article')" v-tooltip="trans('post.edit_article')" @click.prevent="editArticle(article)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-article')" :key="article.id" v-confirm="{ok: confirmDelete(article)}" v-tooltip="trans('post.delete_article')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!articles.total" module="post" title="article_module_title" description="article_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-article')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="articles" @updateRecords="getArticles"></pagination-record>
                </div>
            </div>
        </div>
        <article-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></article-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import articleForm from './form'
    import articleDetail from './show'

    export default {
        components : { articleForm,articleDetail},
        data() {
            return {
                articles: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_article',
                    order: 'desc',
                    keyword: '',
                    article_type_id: [],
                    date_of_article_start_date: '',
                    date_of_article_end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'date_of_article',
                        translation: i18n.post.date_of_article
                    },
                    {
                        value: 'title',
                        translation: i18n.post.article_title
                    }
                ],
                article_types: [],
                selected_article_types: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-article')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getArticles();
            helper.showDemoNotification(['post']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(article){
                this.showUuid = article.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getArticles(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.date_of_article_start_date = helper.toDate(this.filter.date_of_article_start_date);
                this.filter.date_of_article_end_date = helper.toDate(this.filter.date_of_article_end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/article?page=' + page + url)
                    .then(response => {
                        this.articles = response.articles;
                        this.article_types = response.filters.article_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editArticle(article){
                this.$router.push('/post/article/'+article.uuid+'/edit');
            },
            confirmDelete(article){
                return dialog => this.deleteArticle(article);
            },
            deleteArticle(article){
                let loader = this.$loading.show();
                axios.delete('/api/article/'+article.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getArticles();
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
                axios.post('/api/article/print',{filter: this.filter})
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
                axios.post('/api/article/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onArticleTypeSelect(selectedOption){
                this.filter.article_type_id.push(selectedOption.id);
            },
            onArticleTypeRemove(removedOption){
                this.filter.article_type_id.splice(this.filter.article_type_id.indexOf(removedOption.id), 1);
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
                this.getArticles();
            },
            'filter.order': function(val){
                this.getArticles();
            },
            'filter.page_length': function(val){
                this.getArticles();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>