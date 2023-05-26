<template>
	<div>
        <form @submit.prevent="proceed" @keydown="stockCategoryForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_category_name')}}</label>
                        <input class="form-control" type="text" v-model="stockCategoryForm.name" name="name" :placeholder="trans('inventory.stock_category_name')">
                        <show-error :form-name="stockCategoryForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_category_description')}}</label>
                        <autosize-textarea v-model="stockCategoryForm.description" rows="2" name="description" :placeholder="trans('stock.stock_category_description')"></autosize-textarea>
                        <show-error :form-name="stockCategoryForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/inventory/stock/category" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                stockCategoryForm: new Form({
                    name : '',
                    description : '',
                })
            };
        },
        mounted() {
            if (this.id)
                this.getStockCategory();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateStockCategory();
                else
                    this.storeStockCategory();
            },
            storeStockCategory(){
                let loader = this.$loading.show();

                this.stockCategoryForm.post('/api/stock/category')
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
            getStockCategory(){
                let loader = this.$loading.show();
                axios.get('/api/stock/category/'+this.id)
                    .then(response => {
                        this.stockCategoryForm.name = response.name;
                        this.stockCategoryForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/inventory/stock/category');
                    });
            },
            updateStockCategory(){
                let loader = this.$loading.show();
                this.stockCategoryForm.patch('/api/stock/category/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/inventory/stock/category');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>