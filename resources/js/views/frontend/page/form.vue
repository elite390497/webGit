<template>
    <div>
        <form @submit.prevent="proceed" @keydown="pageForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('frontend.page_title')}}</label>
                        <input class="form-control" type="text" v-model="pageForm.title" name="title" :placeholder="trans('frontend.page_title')">
                        <show-error :form-name="pageForm" prop-name="title"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" v-model="pageForm.is_draft" value="1">
                                <span class="custom-control-label">{{trans('frontend.page_is_draft')}}</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-3">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" v-model="pageForm.has_slider" value="1">
                                <span class="custom-control-label">{{trans('frontend.page_has_slider')}}</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-3">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" v-model="pageForm.show_blocks" value="1">
                                <span class="custom-control-label">{{trans('frontend.show_blocks')}}</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-3">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" v-model="pageForm.show_latest_articles" value="1">
                                <span class="custom-control-label">{{trans('frontend.show_latest_articles')}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.attachment')" :token="pageForm.upload_token" module="frontend-page" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <html-editor name="body" :model.sync="pageForm.body" height="300" :isUpdate="uuid ? true : false" @clearErrors="pageForm.errors.clear('body')"></html-editor>
                        <show-error :form-name="pageForm" prop-name="body"></show-error>
                    </div>
                </div>
            </div>
            <div class="row" v-if="pageForm.has_slider" :key="index" v-for="(slider,index) in pageForm.sliders">
                <div class="col-12 col-sm-1">
                    <button type="button" class="btn btn-danger btn-sm" :key="index" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-trash"></i></button>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <input class="form-control" type="text" v-model="slider.title" :name="getSliderTitle(index)" :placeholder="trans('frontend.slider_image_title')">
                        <show-error :form-name="pageForm" :prop-name="getSliderTitle(index)"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <autosize-textarea v-model="slider.description" rows="2" name="getSliderDescription(index)" :placeholder="trans('frontend.slider_image_description')"></autosize-textarea>
                        <show-error :form-name="pageForm" :prop-name="getSliderDescription(index)"></show-error>
                    </div>  
                </div>
                <div class="col-12 col-sm-3">
                    <upload-image :id="getSliderId(index)" :button-text="trans('frontend.choose_slider_image')" upload-path="/frontend/page/slider/image" remove-path="/frontend/page/slider/image" :image-source="slider.image" @uploaded="slider.image = $event" @removed="slider.image = ''"></upload-image>
                </div>
            </div>
            <button type="button" v-if="pageForm.has_slider" class="btn btn-info btn-sm mx-4 m-b-20" @click="addNewSliderImage">{{trans('frontend.add_new_slider_image')}}</button>

            <div class="card-footer text-right">
                <router-link to="/frontend/page" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
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
                pageForm: new Form({
                    title: '',
                    is_draft: 0,
                    show_blocks: 0,
                    show_latest_articles: 0,
                    body: '',
                    has_slider: 0,
                    sliders: [],
                    upload_token: ''
                }),
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.frontendConfigurationAccessible()){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.pageForm.upload_token = this.$uuid.v4();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.pageForm.post('/api/frontend/page')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.pageForm.upload_token = this.$uuid.v4();
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
                axios.get('/api/frontend/page/'+this.uuid)
                    .then(response => {
                        this.pageForm.title = response.page.title;
                        this.pageForm.body = response.page.body;
                        this.pageForm.is_draft = response.page.is_draft;
                        this.pageForm.show_blocks = response.page.options.show_blocks;
                        this.pageForm.show_latest_articles = response.page.options.show_latest_articles;
                        this.pageForm.has_slider = response.page.options.has_slider;

                        if (this.pageForm.has_slider) {
                            this.pageForm.sliders = [];
                            response.page.options.sliders.forEach(slider => {
                                this.pageForm.sliders.push({
                                    image: slider.image,
                                    title: slider.title,
                                    description: slider.description
                                })
                            })
                        }

                        this.pageForm.upload_token = response.page.upload_token;
                        this.module_id = response.page.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/frontend/page');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.pageForm.patch('/api/frontend/page/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/frontend/page');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getSliderDescription(index){
                return 'slider_description_'+index;
            },
            getSliderTitle(index){
                return 'slider_title_'+index;
            },
            getSliderId(index){
                return 'slider_id_'+index;
            },
            addNewSliderImage(){
                this.pageForm.sliders.push({
                    image: '',
                    title: '',
                    description: ''
                });
            },
            confirmDelete(index){
                return dialog => this.deleteSliderImage(index);
            },
            deleteSliderImage(index){
                this.pageForm.sliders.splice(index, 1);
            },
            updateImage(){

            }
        }
    }
</script>