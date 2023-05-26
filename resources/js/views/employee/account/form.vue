<template>
    <div>
        <form @submit.prevent="proceed" @keydown="accountForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.account_name')}}</label>
                        <input class="form-control" type="text" v-model="accountForm.name" name="name" :placeholder="trans('employee.account_name')">
                        <show-error :form-name="accountForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.account_number')}}</label>
                        <input class="form-control" type="text" v-model="accountForm.account_number" name="account_number" :placeholder="trans('employee.account_number')">
                        <show-error :form-name="accountForm" prop-name="account_number"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.bank_name')}}</label>
                        <input class="form-control" type="text" v-model="accountForm.bank_name" name="bank_name" :placeholder="trans('employee.bank_name')">
                        <show-error :form-name="accountForm" prop-name="bank_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.branch_name')}}</label>
                        <input class="form-control" type="text" v-model="accountForm.branch_name" name="branch_name" :placeholder="trans('employee.branch_name')">
                        <show-error :form-name="accountForm" prop-name="branch_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.bank_identification_code')}}</label>
                        <input class="form-control" type="text" v-model="accountForm.bank_identification_code" name="bank_identification_code" :placeholder="trans('employee.bank_identification_code')">
                        <show-error :form-name="accountForm" prop-name="bank_identification_code"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <switches class="m-l-20" v-model="accountForm.is_primary" theme="bootstrap" color="success"></switches> {{trans('employee.is_account_primary')}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <autosize-textarea v-model="accountForm.description" rows="2" name="description" :placeholder="trans('employee.account_description')"></autosize-textarea>
                <show-error :form-name="accountForm" prop-name="description"></show-error>
            </div>
            <button type="submit" class="btn btn-info waves-effect waves-light pull-right">
                <span v-if="aid">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </form>
        <div class="clearfix"></div>
    </div>
</template>


<script>
    export default {
        components:{},
        data() {
            return {
                accountForm: new Form({
                    name : '',
                    account_number: '',
                    bank_name : '',
                    branch_name: '',
                    bank_identification_code: '',
                    is_primary: false,
                    description: ''
                }),
                clearAttachment: true
            };
        },
        props: ['uuid','aid'],
        mounted() {
            if(this.aid)
                this.getAccount();
        },
        methods: {
            proceed(){
                if(this.aid)
                    this.updateAccount();
                else
                    this.storeAccount();
            },
            storeAccount(){
                let loader = this.$loading.show();
                this.accountForm.post('/api/employee/'+this.uuid+'/account')
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
            getAccount(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.uuid+'/account/'+this.aid)
                    .then(response => {
                        this.accountForm.name = response.name;
                        this.accountForm.account_number = response.account_number;
                        this.accountForm.bank_name = response.bank_name;
                        this.accountForm.branch_name = response.branch_name;
                        this.accountForm.bank_identification_code = response.bank_identification_code;
                        this.accountForm.is_primary = response.options.is_primary;
                        this.accountForm.description = response.description;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/employee/'+this.uuid);
                    });
            },
            updateAccount(){
                let loader = this.$loading.show();
                this.accountForm.patch('/api/employee/'+this.uuid+'/account/'+this.aid)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
