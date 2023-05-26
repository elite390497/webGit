<template>
	<div>
        <form @submit.prevent="proceed" @keydown="stockItemForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_category')}}</label>
                        <v-select label="name" v-model="selected_stock_category" name="stock_category_id" id="stock_category_id" :options="stock_categories" :placeholder="trans('general.select_one')" @select="onStockCategorySelect" @close="stockItemForm.errors.clear('stock_category_id')" @remove="stockItemForm.stock_category_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!stock_categories.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="stockItemForm" prop-name="stock_category_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_item_name')}}</label>
                        <input class="form-control" type="text" v-model="stockItemForm.name" name="name" :placeholder="trans('inventory.stock_item_name')">
                        <show-error :form-name="stockItemForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_item_code')}}</label>
                        <input class="form-control" type="text" v-model="stockItemForm.code" name="code" :placeholder="trans('inventory.stock_item_code')">
                        <show-error :form-name="stockItemForm" prop-name="code"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_item_opening_quantity')}}</label>
                        <input class="form-control" type="text" v-model="stockItemForm.opening_quantity" name="opening_quantity" :placeholder="trans('inventory.stock_item_opening_quantity')">
                        <show-error :form-name="stockItemForm" prop-name="opening_quantity"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-12">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_item_description')}}</label>
                        <autosize-textarea v-model="stockItemForm.description" rows="2" name="description" :placeholder="trans('stock.stock_item_description')"></autosize-textarea>
                        <show-error :form-name="stockItemForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/inventory/stock/item" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                stockItemForm: new Form({
                    name : '',
                    code: '',
                    opening_quantity: '',
                    stock_category_id: '',
                    description : '',
                }),
                stock_categories: [],
                selected_stock_category: null
            };
        },
        mounted() {
            this.getPreRequisite();

            if (this.id)
                this.getStockItem();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateStockItem();
                else
                    this.storeStockItem();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/stock/item/pre-requisite')
                    .then(response => {
                        this.stock_categories = response.stock_categories;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeStockItem(){
                let loader = this.$loading.show();

                this.stockItemForm.post('/api/stock/item')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_stock_category = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStockItem(){
                let loader = this.$loading.show();
                axios.get('/api/stock/item/'+this.id)
                    .then(response => {
                        this.stockItemForm.name = response.stock_item.name;
                        this.stockItemForm.code = response.stock_item.code;
                        this.stockItemForm.opening_quantity = response.stock_item.opening_quantity;
                        this.stockItemForm.description = response.stock_item.description;
                        this.stockItemForm.stock_category_id = response.stock_item.stock_category_id;
                        this.selected_stock_category = response.selected_stock_category;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/inventory/stock/item');
                    });
            },
            updateStockItem(){
                let loader = this.$loading.show();
                this.stockItemForm.patch('/api/stock/item/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                        this.$router.push('/inventory/stock/item');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onStockCategorySelect(selectedOption){
                this.stockItemForm.stock_category_id = selectedOption.id;
            }
        }
    }
</script>