<template>
	<div>
        <form @submit.prevent="proceed" @keydown="instituteDocumentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('institute.document_title')}}</label>
                        <input class="form-control" type="text" v-model="instituteDocumentForm.title" name="title" :placeholder="trans('institute.document_title')">
                        <show-error :form-name="instituteDocumentForm" prop-name="title"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('general.tags')}}</label>
	                    <v-select v-model="instituteDocumentForm.tags" :tag-placeholder="trans('general.add_this_as_new_tag')" :placeholder="trans('general.search_or_add_a_tag')" label="name" track-by="slug" :options="tag_options" name="tag" :multiple="true" :taggable="true" @tag="addTag">
                        </v-select>
	                    <show-error :form-name="instituteDocumentForm" prop-name="tag"></show-error>
	                </div>
	            </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('institute.document_date_of_expiry')}}</label>
                        <datepicker v-model="instituteDocumentForm.date_of_expiry" :bootstrapStyling="true" @selected="instituteDocumentForm.errors.clear('date_of_expiry')" :placeholder="trans('institute.document_date_of_expiry')"></datepicker>
                        <show-error :form-name="instituteDocumentForm" prop-name="date_of_expiry"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-12">
                    <div class="form-group">
                        <label for="">{{trans('institute.document_description')}}</label>
                        <autosize-textarea v-model="instituteDocumentForm.description" rows="2" name="description" :placeholder="trans('institute.document_description')"></autosize-textarea>
                        <show-error :form-name="instituteDocumentForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <label>&nbsp;</label>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="instituteDocumentForm.upload_token" module="institute_document" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/institute/document" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
        components:{},
        props: ['id'],
        data() {
            return {
                instituteDocumentForm: new Form({
                    title : '',
                    tags: [],
                    date_of_expiry: '',
                    description : '',
                    upload_token: ''
                }),
                tag_options: [],
                clearAttachment: false,
                module_id: ''
            };
        },
        mounted() {
            this.instituteDocumentForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();

            if (this.id)
                this.getDocument();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateDocument();
                else
                    this.storeDocument();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/institute/document/pre-requisite')
                    .then(response => {
                        this.tag_options = response.tags;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeDocument(){
                let loader = this.$loading.show();
                this.instituteDocumentForm.date_of_expiry = helper.toDate(this.instituteDocumentForm.date_of_expiry);

                this.instituteDocumentForm.post('/api/institute/document')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.instituteDocumentForm.upload_token = this.$uuid.v4();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getDocument(){
                let loader = this.$loading.show();
                axios.get('/api/institute/document/'+this.id)
                    .then(response => {
                        this.instituteDocumentForm.title = response.institute_document.title;
                        this.instituteDocumentForm.date_of_expiry = response.institute_document.date_of_expiry;
                        response.institute_document.tags.forEach(tag => {
                            this.instituteDocumentForm.tags.push({
                                name: tag.name,
                                slug: tag.slug
                            });
                        })
                        this.instituteDocumentForm.description = response.institute_document.description;
                        this.instituteDocumentForm.upload_token = response.institute_document.upload_token;
                        this.module_id = response.institute_document.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/institute/document');
                    });
            },
            updateDocument(){
                let loader = this.$loading.show();
                this.instituteDocumentForm.date_of_expiry = helper.toDate(this.instituteDocumentForm.date_of_expiry);
                this.instituteDocumentForm.patch('/api/institute/document/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/institute/document');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            addTag (newTag) {
                const tag = {
                    name: newTag,
                    slug: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.tag_options.push(tag)
                this.instituteDocumentForm.tags.push(tag)
            }
        },
        watch: {
        }
    }
</script>