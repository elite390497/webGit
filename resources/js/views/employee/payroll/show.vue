<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.payroll')}} <span v-if="payroll.id">{{'#'+getPayrollNumber}}</span></h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/employee/payroll/list')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.list_payroll')}}</span></button>
                    	<a :href="`/employee/payroll/${payroll.uuid}/print?token=${authToken}`" target="_blank" class="btn btn-info btn-sm" v-tooltip="trans('general.print')" ><i class="fas fa-print"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
			        <div class="row" v-if="employee_salary.payroll_template">
			            <div class="col-12 col-sm-4">
			                <div class="table-responsive">
			                    <table class="table table-sm custom-show-table">
			                        <tbody>
			                            <tr v-for="attendance in attendance_summary">
			                                <td>{{attendance.name+' ('+attendance.alias+')'}}</td>
			                                <td>
			                                    {{attendance.count}}
			                                    <span v-if="(attendance.type == 'production_based_earning' || attendance.type == 'production_based_deduction') && attendance.count">
			                                        ({{attendance.value+' '+attendance.unit}})
			                                    </span> 
			                                </td>
			                            </tr>
			                            <tr>
			                            	<td>{{trans('general.created_at')}}</td>
			                            	<td>{{payroll.created_at | momentDateTime}}</td>
			                            </tr>
			                            <tr>
			                            	<td>{{trans('general.updated_at')}}</td>
			                            	<td>{{payroll.updated_at | momentDateTime}}</td>
			                            </tr>
			                        </tbody>
			                    </table>
			                </div>
			            </div>
			            <div class="col-12 col-sm-8 border-left">
			                <div class="card widget">
			                    <div class="card-body">
			                        <div class="row border-bottom">
			                            <div class="col p-4 b-r">
			                                {{getEmployeeNameWithCode(employee_salary.employee)}}<br />
			                                <span class="font-90pc">{{getEmployeeDesignationOnDate(employee_salary.employee, employee_salary.start_date)}}</span>
			                            </div>
			                            <div class="col p-4 b-r">
			                                {{payroll.start_date | moment}} {{trans('general.to')}} {{payroll.end_date | moment}}
			                                <br /> 
                                        	<span v-for="status in getPayrollStatus" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
			                            </div>
			                        </div>
			                    </div>
			                </div>
			                <table class="payroll-table">
			                    <tr>
			                        <td class="font-weight-bold">{{trans('employee.pay_head_type_earning')}}</td>
			                        <td class="font-weight-bold">{{trans('employee.pay_head_type_deduction')}}</td>
			                    </tr>
			                    <tr>
			                        <td valign="top" class="border-right">
			                            <table class="payroll-table">
			                                <tr v-for="payroll_detail in payroll.payroll_details" v-if="payroll_detail.pay_head.type == 'earning'">
			                                    <td>{{payroll_detail.pay_head.name}}</td>
			                                    <td class="text-right">
			                                        {{formatCurrency(payroll_detail.amount)}}
			                                    </td>
			                                </tr>
			                            </table>
			                        </td>
			                        <td valign="top">
			                            <table class="payroll-table">
			                                <tr v-for="payroll_detail in payroll.payroll_details" v-if="payroll_detail.pay_head.type == 'deduction'">
			                                    <td>{{payroll_detail.pay_head.name}}</td>
			                                    <td class="text-right">
			                                        {{formatCurrency(payroll_detail.amount)}}
			                                    </td>
			                                </tr>
			                            </table>
			                        </td>
			                    </tr>
			                    <tr>
			                        <td>
			                            <table class="payroll-table">
			                                <tr>
			                                    <td>{{trans('employee.earning_salary')}}</td>
			                                    <td align="right">{{formatCurrency(getTotalEarningSalary)}}</td>
			                                </tr>
			                            </table>
			                        </td>
			                        <td valign="top">
			                            <table class="payroll-table">
			                                <tr>
			                                    <td>{{trans('employee.deduction_salary')}}</td>
			                                    <td align="right">{{formatCurrency(getTotalDeductionSalary)}}</td>
			                                </tr>
			                            </table>
			                        </td>
			                    </tr>
			                    <tr>
			                        <td class="font-weight-bold">{{trans('employee.net_salary')}}</td>
			                        <td align="right" class="font-weight-bold">{{formatCurrency(getNetSalary)}}</td>
			                    </tr>
			                </table>
				
							<template v-if="payroll.transactions.length">
								<h5 class="card-title m-t-10 m-b-10">{{trans('employee.payroll_transaction')}}</h5>
				                <div class="table-responsive">
				                    <table class="table table-sm custom-show-table">
				                    	<thead>
				                    		<tr>
												<th>{{trans('finance.voucher_number')}}</th>
												<th>{{trans('finance.amount')}}</th>
												<th>{{trans('finance.account')}}</th>
												<th>{{trans('finance.payment_method')}}</th>
												<th class="table-option">{{trans('finance.date_of_transaction')}}</th>
				                    		</tr>
				                    	</thead>
				                        <tbody>
				                        	<tr v-for="transaction in payroll.transactions">
												<td v-text="getVoucherNumber(transaction)"></td>
												<td>{{formatCurrency(transaction.amount)}}</td>
												<td v-text="transaction.account.name"></td>
												<td><span v-text="transaction.payment_method.name"></span> 
													<span v-if="transaction.instrument_number">
														<br /> {{trans('finance.instrument_number')}} <u>{{transaction.instrument_number}} </u>
													</span>
										            <span v-if="transaction.instrument_date">
										            	<br /> {{trans('finance.instrument_date')}} <u>{{transaction.instrument_date | moment}} </u>
										            </span>
										            <span v-if="transaction.instrument_bank_detail">
										            	<br /> {{trans('finance.instrument_bank_detail')}} <u>{{transaction.instrument_bank_detail}} </u>
										            </span>
										            <span v-if="transaction.instrument_clearing_date">
										            	<br /> {{trans('finance.instrument_clearing_date')}} <u>{{transaction.instrument_clearing_date | moment}} </u>
										            </span>
										            <span v-if="transaction.reference_number">
										            	<br /> {{trans('finance.reference_number')}} <u>{{transaction.reference_number}}</u>
										            </span>
												</td>
												<td class="table-option">{{transaction.date | moment}}</td>
				                        	</tr>
				                        </tbody>
				                    </table>
				                </div>
				            </template>
			            </div>
			        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data(){
			return {
                uuid:this.$route.params.uuid,
				payroll: {},
				employee_salary: {},
				attendance_summary: []
			}
		},
		mounted(){
			this.get();
		},
		methods: {
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/'+this.uuid)
                    .then(response => {
                        this.payroll = response.payroll;
                        this.employee_salary = response.salary;
                        this.attendance_summary = response.attendance_types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
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
            getTotalEarningSalary(){
                let total = 0;
                this.payroll.payroll_details.forEach(payroll_detail => {
                    total += payroll_detail.pay_head.type == 'earning' ? (payroll_detail.amount || 0) : 0;
                });
                return total;
            },
            getTotalDeductionSalary(){
                let total = 0;
                this.payroll.payroll_details.forEach(payroll_detail => {
                    total += payroll_detail.pay_head.type == 'deduction' ? (payroll_detail.amount || 0) : 0;
                });
                return total;
            },
            getNetSalary(){
                return this.getTotalEarningSalary - this.getTotalDeductionSalary;
            },
            getPayrollStatus(){
                return helper.getPayrollStatus(this.payroll);
            },
            getPayrollNumber(){
                return helper.getPayrollNumber(this.payroll);
            },
            authToken(){
                return helper.getAuthToken();
            }
        }

	}
</script>

<style lang="scss">
    .payroll-table {
        width: 100%;
        font-size:13px;

        th, td {
            width:50%;
            padding:5px 10px;
        }

        tr + tr{
            border-top: 1px solid #f3f1f1;
        }

        .borderless-input{
            text-align:right;
            border:0;
            height: auto;
            width:100%;
            color: #54667a;
        }
    }
</style>