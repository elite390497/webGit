<template>
    <form @submit.prevent="proceed" @keydown="bookPublisherForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('library.book_publisher_name')}}</label>
                    <input class="form-control" type="text" v-model="bookPublisherForm.name" name="name" :placeholder="trans('library.book_publisher_name')">
                    <show-error :form-name="bookPublisherForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('library.book_publisher_description')}}</label>
                    <input class="form-control" type="text" v-model="bookPublisherForm.description" name="description" :placeholder="trans('library.book_publisher_description')">
                    <show-error :form-name="bookPublisherForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/library/book/publisher" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        data() {
            return {
                bookPublisherForm: new Form({
                    name : '',
                    description : ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.bookPublisherForm.post('/api/library/book/publisher')
                    .then(response => {
                        toastr.success(response.message);
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
                axios.get('/api/library/book/publisher/'+this.id)
                    .then(response => {
                        this.bookPublisherForm.name = response.name;
                        this.bookPublisherForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/library/book/publisher');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.bookPublisherForm.patch('/api/library/book/publisher/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/library/book/publisher');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
