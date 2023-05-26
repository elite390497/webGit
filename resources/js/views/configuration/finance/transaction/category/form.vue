<template>
    <form @submit.prevent="proceed" @keydown="transactionCategoryForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.transaction_category_name')}}</label>
                    <input class="form-control" type="text" v-model="transactionCategoryForm.name" name="name" :placeholder="trans('finance.transaction_category_name')">
                    <show-error :form-name="transactionCategoryForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.transaction_category_type')}}</label>
                    <select v-model="transactionCategoryForm.type" class="col-12 custom-select" @change="transactionCategoryForm.errors.clear('type')" name="type">
                      <option value=null selected>{{trans('general.select_one')}}</option>
                      <option v-for="type in types" v-bind:value="type.value">
                        {{ type.text }}
                      </option>
                    </select>
                    <show-error :form-name="transactionCategoryForm" prop-name="type"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('finance.transaction_category_description')}}</label>
                    <input class="form-control" type="text" v-model="transactionCategoryForm.description" name="description" :placeholder="trans('finance.transaction_category_description')">
                    <show-error :form-name="transactionCategoryForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <router-link to="/configuration/finance/transaction/category" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                transactionCategoryForm: new Form({
                    name : '',
                    type: '',
                    description : ''
                }),
                types: [
                    {
                        text: i18n.finance.income,
                        value: 'income'
                    },
                    {
                        text: i18n.finance.expense,
                        value: 'expense'
                    }
                ]
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
                this.transactionCategoryForm.post('/api/finance/transaction/category')
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
                axios.get('/api/finance/transaction/category/'+this.id)
                    .then(response => {
                        this.transactionCategoryForm.name = response.name;
                        this.transactionCategoryForm.type = response.type;
                        this.transactionCategoryForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/finance/transaction/category');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.transactionCategoryForm.patch('/api/finance/transaction/category/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/finance/transaction/category');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>
