<template>
    <div>
        <form @submit.prevent="proceed" @keydown="blockForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('frontend.block_title')}}</label>
                        <input class="form-control" type="text" v-model="blockForm.title" name="title" :placeholder="trans('frontend.block_title')">
                        <show-error :form-name="blockForm" prop-name="title"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('frontend.menu')}}</label>
                        <select v-model="blockForm.menu_id" class="custom-select col-12" name="menu_id" @change="blockForm.errors.clear('menu_id')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="menu in menus" v-bind:value="menu.value">
                            {{ menu.text }}
                          </option>
                        </select>
                        <show-error :form-name="blockForm" prop-name="menu_id"></show-error>
                    </div> 
                    <div class="form-group" v-if="!blockForm.menu_id">
                        <label for="">{{trans('frontend.block_url')}}</label>
                        <input class="form-control" type="text" v-model="blockForm.url" name="url" :placeholder="trans('frontend.block_url')">
                        <show-error :form-name="blockForm" prop-name="url"></show-error>
                    </div>
                    <div class="form-group">
                        <label class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" v-model="blockForm.is_draft" value="1">
                            <span class="custom-control-label">{{trans('frontend.block_is_draft')}}</span>
                        </label>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('frontend.block_body')}}</label>
                        <autosize-textarea v-model="blockForm.body" rows="4" name="body" :placeholder="trans('frontend.block_body')"></autosize-textarea>
                        <show-error :form-name="blockForm" prop-name="body"></show-error>
                    </div>
                    <div class="form-group">

                        <upload-image id="block_image" :button-text="trans('frontend.choose_featured_image')" upload-path="/frontend/block/featured/image" remove-path="/frontend/block/featured/image" :image-source="blockForm.featured_image" @uploaded="updateImage" @removed="blockForm.featured_image = ''"></upload-image>
                        <!-- <file-upload-input :button-text="trans('general.attachment')" :token="blockForm.upload_token" module="block" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input> -->
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/frontend/block" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                blockForm: new Form({
                    title: '',
                    is_draft: 0,
                    menu_id: '',
                    url: '',
                    body: '',
                    featured_image: '',
                    upload_token: ''
                }),
                menus: [],
                module_id: '',
                image: '',
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
                this.blockForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/block/pre-requisite')
                    .then(response => {
                        this.menus = response.menus;
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
                this.blockForm.post('/api/frontend/block')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.blockForm.upload_token = this.$uuid.v4();
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
                axios.get('/api/frontend/block/'+this.uuid)
                    .then(response => {
                        this.blockForm.title = response.block.title;
                        this.blockForm.body = response.block.body;
                        this.blockForm.is_draft = response.block.is_draft;
                        this.blockForm.menu_id = response.block.frontend_menu_id;
                        this.blockForm.url = response.block.url;
                        this.blockForm.featured_image = response.block.featured_image;
                        this.blockForm.upload_token = response.block.upload_token;
                        this.module_id = response.block.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/frontend/block');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.blockForm.patch('/api/frontend/block/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/frontend/block');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            updateImage(val){
                this.blockForm.featured_image = val;
            }
        }
    }
</script>