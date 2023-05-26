<template>
    <form @submit.prevent="proceed" @keydown="categoryForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('misc.category_name')}}</label>
                    <input class="form-control" type="text" v-model="categoryForm.name" name="name" :placeholder="trans('misc.category_name')">
                    <show-error :form-name="categoryForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('misc.category_description')}}</label>
                    <input class="form-control" type="text" v-model="categoryForm.description" name="description" :placeholder="trans('misc.category_description')">
                    <show-error :form-name="categoryForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/misc/category" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                categoryForm: new Form({
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
                this.categoryForm.post('/api/misc/category')
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
                axios.get('/api/misc/category/'+this.id)
                    .then(response => {
                        this.categoryForm.name = response.name;
                        this.categoryForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/misc/category');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.categoryForm.patch('/api/misc/category/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/misc/category');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
