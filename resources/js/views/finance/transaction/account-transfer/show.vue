<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="account_transfer.id">
                        <slot name="header">
                            <span>{{trans('finance.account_transfer')}} #{{getVoucherNumber(account_transfer.transaction)}}
                            	<span class="label label-danger" v-if="account_transfer.is_cancelled">
                            		{{trans('finance.transaction_status_cancelled')}}
                            	</span>
                            </span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="account_transfer.id">
                        <slot name="body">
                        	<div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
	                        			<tr>
	                        				<td class="font-weight-bold">#</td>
                                            <td>{{getVoucherNumber(account_transfer.transaction)}}</td>
	                        			</tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('finance.date_of_account_transfer')}}</td>
	                        				<td>{{account_transfer.date_of_account_transfer | moment}}</td>
	                        			</tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('finance.from_account')}}</td>
	                        				<td>{{account_transfer.from_account.name}}</td>
	                        			</tr>
                                        <tr>
                                            <td class="font-weight-bold">{{trans('finance.to_account')}}</td>
                                            <td>{{account_transfer.to_account.name}}</td>
                                        </tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('finance.payment_method')}}</td>
	                        				<td>
	                        					{{account_transfer.transaction.payment_method.name}}
	                        					<span v-if="account_transfer.transaction.payment_method.options.requires_instrument_number">
	                        						<br />	{{trans('finance.instrument_number')}}: {{account_transfer.transaction.instrument_number}}
	                        					</span>
	                        					<span v-if="account_transfer.transaction.payment_method.options.requires_instrument_date">
	                        						<br />	{{trans('finance.instrument_date')}}: {{account_transfer.transaction.instrument_date | moment}}
	                        					</span>
	                        					<span v-if="account_transfer.transaction.payment_method.options.requires_instrument_bank_detail">
	                        						<br />	{{trans('finance.instrument_bank_detail')}}: {{account_transfer.transaction.instrument_bank_detail}}
	                        					</span>
	                        					<span v-if="account_transfer.transaction.payment_method.options.requires_instrument_clearing_date">
	                        						<br />	{{trans('finance.instrument_clearing_date')}}: {{account_transfer.transaction.instrument_clearing_date | moment}}
	                        					</span>
	                        					<span v-if="account_transfer.transaction.payment_method.options.requires_reference_number">
	                        						<br />	{{trans('finance.reference_number')}}: {{account_transfer.transaction.reference_number}}
	                        					</span>
	                        				</td>
	                        			</tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('finance.amount')}}</td>
	                        				<td>{{formatCurrency(account_transfer.amount)}}</td>
	                        			</tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('finance.account_transfer_description')}}</td>
	                        				<td>{{account_transfer.description}}</td>
	                        			</tr>
	                        			<tr>
	                        				<td class="font-weight-bold">{{trans('general.created_by')}}</td>
                                            <td>{{getEmployeeName(account_transfer.user.employee)}} <br > {{getEmployeeDesignationOnDate(account_transfer.user.employee, account_transfer.date_of_account_transfer)}}</td>

	                        			</tr>
	                        		</tbody>
                        		</table>	
                        	</div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/finance/transaction/account/transfer/${account_transfer.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{account_transfer.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{account_transfer.updated_at | momentDateTime}}</small>
                                </span>
                            </p>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
	export default {
		props: ['uuid'],
		data() {
            return {
                account_transfer: {},
                attachments: []
            }
		},
		mounted(){
            if(this.uuid)
                this.get();
		},
		methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/account/transfer/'+this.uuid)
                    .then(response => {
                        this.account_transfer = response.account_transfer;
                        this.attachments = response.attachments;
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
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            formatCurrency(amount){
            	return helper.formatCurrency(amount);
            },
            getVoucherNumber(transaction){
                return helper.getVoucherNumber(transaction);
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
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>