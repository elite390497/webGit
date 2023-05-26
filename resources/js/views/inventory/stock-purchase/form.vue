<template>
	<div>
        <form @submit.prevent="proceed" @keydown="stockPurchaseForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_purchase_date')}}</label>
                        <datepicker v-model="stockPurchaseForm.date" :bootstrapStyling="true" @selected="stockPurchaseForm.errors.clear('date')" :placeholder="trans('inventory.stock_purchase_date')"></datepicker>
                        <show-error :form-name="stockPurchaseForm" prop-name="date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_purchase_number')}}</label>
                        <input class="form-control" type="text" v-model="stockPurchaseForm.number" name="number" :placeholder="trans('inventory.stock_purchase_number')">
                        <show-error :form-name="stockPurchaseForm" prop-name="number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('inventory.vendor')}}</label>
                        <v-select label="name" v-model="selected_vendor" name="vendor_id" id="vendor_id" :options="vendors" :placeholder="trans('inventory.select_vendor')" @select="onVendorSelect" @close="stockPurchaseForm.errors.clear('vendor_id')" @remove="stockPurchaseForm.vendor_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!vendors.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="stockPurchaseForm" prop-name="vendor_id"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_purchase_description')}}</label>
                        <autosize-textarea v-model="stockPurchaseForm.description" rows="1" name="description" :placeholder="trans('inventory.stock_purchase_description')"></autosize-textarea>
                        <show-error :form-name="stockPurchaseForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="p-t-20 border-top">
                <div class="row" v-for="(detail, index) in stockPurchaseForm.details">
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">
                                {{trans('inventory.stock_item')}}
                                <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button>
                            </label>
                            <v-select label="name" v-model="detail.selected_stock_item" :name="getStockItemName(index)" :id="getStockItemName(index)" :options="stock_items" :placeholder="trans('inventory.select_stock_item')" @select="onStockItemSelect" @close="stockPurchaseForm.errors.clear(getStockItemName(index))" @remove="onStockItemRemove">
                                <div class="multiselect__option" slot="afterList" v-if="!stock_items.length">
                                    {{trans('general.no_option_found')}}
                                </div>
                            </v-select>
                            <show-error :form-name="stockPurchaseForm" :prop-name="getStockItemName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('inventory.stock_purchase_quantity')}}</label>
                            <input class="form-control" type="text" v-model="detail.quantity" :name="getQuantityName(index)" :placeholder="trans('inventory.stock_purchase_quantity')">
                            <show-error :form-name="stockPurchaseForm" :prop-name="getQuantityName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="form-group">
                            <label for="">{{trans('inventory.stock_purchase_unit_price')}}</label>
                            <input class="form-control" type="text" v-model="detail.unit_price" :name="getUnitPriceName(index)" :placeholder="trans('inventory.stock_purchase_unit_price')">
                            <show-error :form-name="stockPurchaseForm" :prop-name="getUnitPriceName(index)"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="">
                                {{trans('inventory.stock_item_description')}}
                            </label>
                            <input class="form-control" type="text" v-model="detail.description" :name="getDescriptionName(index)" :placeholder="trans('inventory.stock_item_description')">
                            <show-error :form-name="stockPurchaseForm" :prop-name="getDescriptionName(index)"></show-error>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('inventory.add_new_stock_item')}}</button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <file-upload-input :button-text="trans('general.upload_document')" :token="stockPurchaseForm.upload_token" module="stock_purchase" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button v-show="id" type="button" class="btn btn-danger " @click="$router.push('/inventory/stock/purchase')">{{trans('general.cancel')}}</button>
                <button v-if="!id" type="button" class="btn btn-danger " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
    </div>
</template>

<script>

    export default {
        components: {},
        props: ['id'],
        data(){
            return {
                stockPurchaseForm: new Form({
                    date: '',
                    number: '',
                    vendor_id: '',
                    description: '',
                    details: [],
                    upload_token: ''
                }),
                vendors: [],
                stock_items: [],
                selected_vendor: null,
                module_id: '',
                clearAttachment: true
            }
        },
        mounted(){
            if(!this.id)
                this.addRow();

            if(this.id)
                this.get();
            else
                this.stockPurchaseForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            }, 
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/stock/purchase/pre-requisite')
                    .then(response => {
                        this.vendors = response.vendors;
                        this.stock_items = response.stock_items;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            addRow(){
                let new_index = this.stockPurchaseForm.details.push({
                    quantity: '',
                    unit_price: '',
                    stock_item_id: '',
                    description: '',
                    selected_stock_item: null
                })
            },
            getStockItemName(index){
                return index+'_stock_item_id';
            },
            getDescriptionName(index){
                return index+'_description';
            },
            getQuantityName(index){
                return index+'_quantity';
            },
            getUnitPriceName(index){
                return index+'_unit_price';
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/stock/purchase/'+this.id)
                    .then(response => {
                        this.stockPurchaseForm.upload_token = response.stock_purchase.upload_token;
                        this.module_id = response.stock_purchase.id;
                        this.stockPurchaseForm.number = response.stock_purchase.number;
                        this.stockPurchaseForm.date = response.stock_purchase.date;
                        this.stockPurchaseForm.description = response.stock_purchase.description;
                        this.stockPurchaseForm.vendor_id = response.stock_purchase.vendor_id;
                        this.selected_vendor = response.stock_purchase.vendor_id ? {id: response.stock_purchase.vendor_id, name: response.stock_purchase.vendor.name} : null;
                        response.stock_purchase.details.forEach(detail => {
                            this.stockPurchaseForm.details.push({
                                quantity: detail.quantity,
                                unit_price: detail.unit_price,
                                stock_item_id: detail.stock_item_id,
                                selected_stock_item: (detail.stock_item_id) ? {id: detail.stock_item_id, name: detail.item.name} : null,
                                description: detail.description
                            });
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.stockPurchaseForm.post('/api/stock/purchase')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_vendor = null;
                        this.stockPurchaseForm.details = [];
                        this.clearAttachment = !this.clearAttachment;
                        this.stockPurchaseForm.upload_token = this.$uuid.v4();
                        this.addRow();
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.stockPurchaseForm.patch('/api/stock/purchase/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/inventory/stock/purchase');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            onVendorSelect(selectedOption){
                this.stockPurchaseForm.vendor_id = selectedOption.id;
            },
            confirmDelete(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.stockPurchaseForm.details.splice(index, 1);
            },
            onStockItemSelect(selectedOption, id){
                let index = id.split("_")[0];
                let detail = this.stockPurchaseForm.details[index];
                detail.stock_item_id = selectedOption.id;
            },
            onStockItemRemove(removedOption, id){
                let index = id.split("_")[0];
                let detail = this.stockPurchaseForm.details[index];
                detail.stock_item_id = '';
            }
        },
        computed:{
        }
    }
</script>