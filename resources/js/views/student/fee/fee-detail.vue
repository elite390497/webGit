<template>
	<div>
        <template v-for="txn in transactions">
            <button class="btn btn-info m-r-10" @click="transaction = txn" type="button">{{(txn.prefix || '')+''+txn.number}}</button>
        </template>
        <button type="button" class="btn btn-info btn-sm pull-right" v-tooltip="trans('finance.print_receipt')" @click="printReceipt"><i class="fas fa-print"></i></button>
        <template v-if="transaction.id">
            <div class="table-responsive m-t-20">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td>{{trans('finance.receipt_no')}}</td>
                            <td>{{(transaction.prefix || '')+''+transaction.number}}
                                <span v-if="transactionGroup.length > 1">({{transactionGroup.toString()}})</span>
                            </td>
                            <template v-if="!transaction.is_online_payment">
                                <td>{{trans('finance.account')}}</td>
                                <td>{{transaction.account ? transaction.account.name : ''}}</td>
                            </template>
                            <template v-else>
                                <td>{{trans('finance.payment_method')}}</td>
                                <td>{{trans('finance.online_payment')}}</td>
                            </template>
                        </tr>
                        <tr>
                            <td>{{trans('finance.amount')}}</td>
                            <td>{{formatCurrency(transaction.amount)}}</td>
                            <td>{{trans('finance.date')}}</td>
                            <td>{{transaction.date | moment}}</td>
                        </tr>
                        <tr>
                            <template v-if="!transaction.is_online_payment">
                                <td>{{trans('finance.payment_method')}}</td>
                                <td>
                                    {{transaction.payment_method.name}}
                                    <span v-if="transaction.instrument_number"><br />{{trans('finance.instrument_number')}}: {{transaction.instrument_number}}</span>
                                    <span v-if="transaction.instrument_date"><br />{{trans('finance.instrument_date')}}: <span>{{transaction.instrument_date | moment}}</span></span>
                                    <span v-if="transaction.instrument_clearing_date"><br />{{trans('finance.instrument_clearing_date')}}: <span>{{transaction.instrument_clearing_date | moment}}</span></span>
                                    <span v-if="transaction.instrument_bank_detail"><br />{{trans('finance.instrument_bank_detail')}}: {{transaction.instrument_bank_detail}}</span>
                                    <span v-if="transaction.reference_number"><br />{{trans('finance.reference_number')}}: {{transaction.reference_number}}</span>
                                </td>
                            </template>
                            <template v-else>
                                <td>{{trans('finance.reference_number')}}</td>
                                <td>{{transaction.reference_number}}</td>
                            </template>
                            <td>{{trans('finance.date_of_entry')}}</td>
                            <td>{{transaction.created_at | momentDateTime}}</td>
                        </tr>
                        <tr>
                            <template v-if="!transaction.is_online_payment">
                                <td>{{trans('finance.remarks')}}</td>
                                <td>{{transaction.remarks}}</td>
                                <td>{{trans('finance.entry_by')}}</td>
                                <td>
                                    {{getEmployeeName(transaction.user.employee)}}
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button type="button" class="btn btn-block btn-danger" v-if="transaction.is_deletable && hasPermission('cancel-fee-payment')" @click="cancel_fee_payment = true">{{trans('student.cancel_fee_payment')}}</button>
            <template v-if="cancel_fee_payment">
                <form @submit.prevent="cancelPayment" class="m-t-20" @keydown="cancelPaymentForm.errors.clear($event.target.name)" v-if="transaction.is_deletable">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group" v-if="transactionGroup.length > 1">
                                <div>{{trans('finance.cancel_all_group_fee_payment',{numbers: transactionGroup.toString()})}}</div>
                            </div>
                            <div class="form-group">
                                <autosize-textarea v-model="cancelPaymentForm.cancellation_remarks" rows="2" name="cancellation_remarks" :placeholder="trans('student.cancellation_remarks')"></autosize-textarea>
                                <show-error :form-name="cancelPaymentForm" prop-name="cancellation_remarks"></show-error>
                            </div>
                            <button type="submit" class="btn btn-danger waves-effect waves-light">{{trans('general.save')}}</button>
                        </div>
                    </div>
                </form>
            </template>
        </template>
    </div>
</template>

<script>
	export default {
        components: {},
		props: ['id','uuid','rid'],
		data() {
			return {
				transactions: [],
                transaction: {},
                cancel_fee_payment: false,
                cancelPaymentForm: new Form({
                    cancellation_remarks: ''
                })
			}
		},
		mounted(){
            this.getDetail(this.id);
		},
		methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
			formatCurrency(amount){
				return helper.formatCurrency(amount);
			},
			getDetail(id) {
                let loader = this.$loading.show();
				axios.get('/api/student/'+this.uuid+'/fee/'+this.rid+'/'+id)
					.then(response => {
						this.transactions = response.transactions;
                        this.transaction = response.transactions[0];
                        loader.hide();
					})
					.catch(error => {
                        loader.hide();
						helper.showErrorMsg(error);
					});
			},
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            cancelPayment(){
                let loader = this.$loading.show();
                this.cancelPaymentForm.post('/api/student/'+this.uuid+'/fee/'+this.rid+'/'+this.id+'/'+this.transaction.id+'/cancel')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            printReceipt(){
                let loader = this.$loading.show();
                axios.post('/api/student/'+this.uuid+'/fee/'+this.rid+'/'+this.id+'/'+this.transaction.id+'/print')
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		},
        computed: {
            transactionGroup(){
                let group = [];
                this.transaction.groups.forEach(txn => {
                    group.push((txn.prefix || '')+''+txn.number);
                });
                group.sort();

                return group;
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
		watch: {
			id(val) {
				if (val) {
					this.getDetail(val);
				}
			}
		}
	}
</script>