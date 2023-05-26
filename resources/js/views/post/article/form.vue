<template>
    <div>
        <form @submit.prevent="proceed" @keydown="articleForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('post.article_type')}} </label> <button type="button" class="btn btn-xs btn-info pull-right" v-if="hasPermission('access-configuration')" @click="showArticleTypeModal = true">{{trans('general.add_new')}}</button>
                        <v-select label="name" v-model="selected_article_type" name="article_type_id" id="article_type_id" :options="article_types" :placeholder="trans('post.select_article_type')" @select="onArticleTypeSelect" @close="articleForm.errors.clear('article_type_id')" @remove="articleForm.article_type_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!article_types.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="articleForm" prop-name="article_type_id"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('post.article_title')}}</label>
                        <input class="form-control" type="text" v-model="articleForm.title" name="title" :placeholder="trans('post.article_title')">
                        <show-error :form-name="articleForm" prop-name="title"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('post.date_of_article')}}</label>
                        <datepicker v-model="articleForm.date_of_article" :bootstrapStyling="true" @selected="articleForm.errors.clear('date_of_article')" :placeholder="trans('post.date_of_article')"></datepicker>
                        <show-error :form-name="articleForm" prop-name="date_of_article"></show-error>
                    </div>
                    <div class="form-group">
                        <label class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" v-model="articleForm.is_public" value="1">
                            <span class="custom-control-label">{{trans('post.article_is_public')}}</span>
                        </label>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="articleForm.upload_token" module="article" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <html-editor name="description" :model.sync="articleForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="articleForm.errors.clear('description')"></html-editor>
                        <show-error :form-name="articleForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/post/article" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>

        <transition name="modal" v-if="showArticleTypeModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('post.add_new_article_type')}}
                                <span class="float-right pointer" @click="showArticleTypeModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <article-type-form @completed="getPreRequisite" @cancel="showArticleTypeModal = false"></article-type-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import articleTypeForm from '../../configuration/post/article-type/form'

    export default {
        components: {articleTypeForm},
        data() {
            return {
                articleForm: new Form({
                    article_type_id: '',
                    title: '',
                    is_public: 0,
                    date_of_article: '',
                    description: '',
                    upload_token: ''
                }),
                article_types: [],
                selected_article_type: null,
                module_id: '',
                clearAttachment: true,
                showArticleTypeModal: false
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-article') && !helper.hasPermission('edit-article')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.articleForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showArticleTypeModal = false;
                axios.get('/api/article/pre-requisite')
                    .then(response => {
                        this.article_types = response.article_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.articleForm.post('/api/article')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.articleForm.upload_token = this.$uuid.v4();
                        this.selected_article_type = null;
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
                axios.get('/api/article/'+this.uuid)
                    .then(response => {
                        this.articleForm.title = response.article.title;
                        this.articleForm.date_of_article = response.article.date_of_article;
                        this.articleForm.description = response.article.description;
                        this.articleForm.article_type_id = response.article.article_type_id;
                        this.selected_article_type = response.article.article_type_id ? {id: response.article.article_type_id, name: response.article.article_type.name} : null;
                        this.articleForm.is_public = response.article.is_public;
                        this.articleForm.upload_token = response.article.upload_token;
                        this.module_id = response.article.id;

                        if (! response.is_editable) {
                            toastr.error(i18n.user.permission_denied);
                            loader.hide();
                            this.$router.push('/post/article');
                        }

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/post/article');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.articleForm.patch('/api/article/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/post/article');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onArticleTypeSelect(selectedOption){
                this.articleForm.article_type_id = selectedOption.id;
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>