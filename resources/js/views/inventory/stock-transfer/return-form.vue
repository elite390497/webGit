<template>
	<div>
        <form @submit.prevent="submit" @keydown="returnForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_transfer_return_date')}}</label>
                        <datepicker v-model="returnForm.date" :bootstrapStyling="true" @selected="returnForm.errors.clear('date')" :placeholder="trans('inventory.stock_transfer_return_date')"></datepicker>
                        <show-error :form-name="returnForm" prop-name="date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_transfer_return_type')}}</label>
                        <select v-model="returnForm.type" class="custom-select col-12" name="type" @change="returnForm.errors.clear('type')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="type in types" v-bind:value="type.value">
                            {{ type.text }}
                          </option>
                        </select>
                        <show-error :form-name="returnForm" prop-name="type"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('inventory.stock_item')}}</label>
                        <select v-model="returnForm.stock_item_id" class="custom-select col-12" name="stock_item_id" @change="returnForm.errors.clear('stock_item_id')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="detail in stockTransfer.details" v-bind:value="detail.stock_item_id">
                            {{ detail.item.name }}
                          </option>
                        </select>
                        <show-error :form-name="returnForm" prop-name="stock_item_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">
                            {{trans('inventory.stock_transfer_quantity')}}
                        </label>
                        <input class="form-control" type="text" v-model="returnForm.quantity" name="quantity" :placeholder="trans('inventory.stock_transfer_quantity')">
                        <show-error :form-name="returnForm" prop-name="quantity"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">
                            {{trans('inventory.stock_transfer_description')}}
                        </label>
                        <autosize-textarea v-model="returnForm.description" rows="1" name="description" :placeholder="trans('inventory.stock_transfer_description')"></autosize-textarea>
                        <show-error :form-name="returnForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
        </form>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        components: {},
        props: ['stockTransfer'],
        data() {
            return {
                returnForm: new Form({
                    date: '',
                    quantity: '',
                    stock_item_id: '',
                    type: '',
                    description: '',
                }),
                types: [
                    {
                        text: i18n.inventory.stock_transfer_return_type_returned,
                        value: 'returned'
                    },
                    {
                        text: i18n.inventory.stock_transfer_return_type_consumed,
                        value: 'consumed'
                    },
                    {
                        text: i18n.inventory.stock_transfer_return_type_damaged,
                        value: 'damaged'
                    },
                    {
                        text: i18n.inventory.stock_transfer_return_type_missed,
                        value: 'missed'
                    }
                ]
            }
        },
        mounted(){
        },
        methods: {
            submit(){
                let loader = this.$loading.show();
                this.returnForm.post('/api/stock/transfer/'+this.stockTransfer.id+'/return')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        watch: {
        }
    }
</script>