<template>
    <div v-if="book_log.id">
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.issue_detail')}} <span class="card-subtitle">#{{book_log.id}}</span></h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/library/return')"><i class="fas fa-undo"></i> <span class="d-none d-sm-inline">{{trans('library.return_list')}}</span></button>
                        <button class="btn btn-info btn-sm" @click="$router.push('/library/issue/list')"><i class="fas fa-book"></i> <span class="d-none d-sm-inline">{{trans('library.issue_list')}}</span></button>
                        <help-button @clicked="help_topic = 'book-issue-detail'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-4 pr-0">
                    <div class="card border-right">
                        <div class="card-body">
                            <h4 class="card-title m-3">{{trans('library.issue_to')}}</h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('library.issue')}} #</td>
                                            <td>{{book_log.id}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.date_of_issue')}}</td>
                                            <td>{{book_log.date_of_issue | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.due_date')}}</td>
                                            <td>
                                                <span v-if="book_log.due_date">
                                                    {{book_log.due_date | moment}}
                                                    <span v-if="isOverDue" class="label label-danger">{{trans('library.overdue_by_days', {day: overdueDay})}}</span>
                                                </span>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.issue_to')}}</td>
                                            <td>
                                                <span v-if="book_log.student_record_id">{{trans('student.student')}}</span>
                                                <span v-if="book_log.employee_id">{{trans('employee.employee')}}</span>
                                            </td>
                                        </tr>
                                        <template v-if="book_log.student_record_id">
                                            <tr>
                                                <td>{{trans('student.name')}}</td>
                                                <td>{{getStudentName(book_log.student_record.student)}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('student.first_guardian_name')}}</td>
                                                <td>{{book_log.student_record.student.parent.first_guardian_name}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('student.contact_number')}}</td>
                                                <td>{{book_log.student_record.student.contact_number}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('student.batch')}}</td>
                                                <td>{{getStudentBatch(book_log.student_record)}}</td>
                                            </tr>
                                        </template>
                                        <template v-if="book_log.employee_id">
                                            <tr>
                                                <td>{{trans('employee.name')}}</td>
                                                <td>{{getEmployeeNameWithCode(book_log.employee)}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('employee.father_name')}}</td>
                                                <td>{{book_log.employee.father_name}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('employee.contact_number')}}</td>
                                                <td>{{book_log.employee.contact_number}}</td>
                                            </tr>
                                            <tr>
                                                <td>{{trans('employee.designation')}}</td>
                                                <td>{{getEmployeeDesignation(book_log.employee)}}</td>
                                            </tr>
                                        </template>
                                        <tr>
                                            <td>{{trans('library.no_of_books_issued')}}</td>
                                            <td>{{book_log.book_log_details.length}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.no_of_books_returned')}}</td>
                                            <td>{{getBookReturnCount}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.late_fee_applicable')}}</td>
                                            <td>
                                                <span v-if="book_log.late_fee_applicable">{{trans('list.yes')}}</span>
                                                <span v-else>{{trans('list.no')}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="book_log.late_fee_applicable">
                                            <td>{{trans('library.late_fee_charge')}}</td>
                                            <td>
                                                {{formatCurrency(book_log.late_fee_charge)}} /{{trans('list.'+book_log.late_fee_frequency)}} /{{trans('library.book')}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('library.issue_remarks')}}</td>
                                            <td>{{book_log.issue_remarks}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.created_at')}}</td>
                                            <td>{{book_log.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.updated_at')}}</td>
                                            <td>{{book_log.updated_at | momentDateTime}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-8 p-0">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive p-2">
                                <table class="table font-90pc">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>{{trans('library.book')+' #'}}</th>
                                            <th>{{trans('library.book_title')}}</th>
                                            <th>{{trans('library.book_author')}}</th>
                                            <th>{{trans('library.book_price')}}</th>
                                            <th>{{trans('library.book_condition')}}</th>
                                            <th>{{trans('library.date_of_return')}}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="book_log_detail in book_log.book_log_details">
                                            <td>
                                                <template v-if="!book_log_detail.date_of_return && !book_log_detail.is_non_returnable">
                                                    <label class="custom-control custom-checkbox">
                                                        <input type="checkbox" class="custom-control-input" :value="book_log_detail.id" v-model="returnForm.ids">
                                                        <span class="custom-control-label"></span>
                                                    </label>
                                                </template>
                                            </td>
                                            <td>{{book_log_detail.book_post_detail.number}}</td>
                                            <td>{{book_log_detail.book_post_detail.book_post.book.title}}</td>
                                            <td>{{book_log_detail.book_post_detail.book_post.book.book_author.name}}</td>
                                            <td>{{formatCurrency(book_log_detail.book_post_detail.book_post.book.price)}}</td>
                                            <td>{{book_log_detail.book_post_detail.book_condition.name}}</td>
                                            <td>
                                                <span v-if="book_log_detail.date_of_return">{{book_log_detail.date_of_return | moment}}</span>
                                                <span v-else-if="book_log_detail.is_non_returnable" class="label label-danger">{{trans('library.non_returnable')}}</span>
                                                <span v-else>-</span>
                                            </td>
                                            <td>
                                                <template v-if="book_log_detail.date_of_return">
                                                    {{trans('library.remarks')+': '+book_log_detail.return_remarks}} <br />
                                                    <span v-if="book_log_detail.late_fee">{{trans('library.late_fee')+': '+formatCurrency(book_log_detail.late_fee)}}</span>
                                                </template>
                                                <template v-if="book_log_detail.is_non_returnable">
                                                    {{trans('library.remarks')+': '+book_log_detail.non_returnable_remarks}} <br />
                                                    <span v-if="book_log_detail.non_returnable_charge">{{trans('library.non_returnable_charge')+': '+formatCurrency(book_log_detail.non_returnable_charge)}}</span>
                                                </template>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <template v-if="returnForm.ids.length">
                                <form @submit.prevent="submit" @keydown="returnForm.errors.clear($event.target.name)" class="p-4">
                                    <div class="form-group">
                                        <label class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" value="1" v-model="returnForm.is_non_returnable">
                                            <span class="custom-control-label">{{trans('library.is_non_returnable')}}</span>
                                        </label>
                                    </div>
                                    <template v-if="!returnForm.is_non_returnable">
                                        <div class="row">
                                            <div class="col-12 col-sm-3">
                                                <div class="form-group">
                                                    <label for="">{{trans('library.date_of_return')}}</label>
                                                    <datepicker v-model="returnForm.date_of_return" :bootstrapStyling="true" @selected="returnForm.errors.clear('date_of_return')" :placeholder="trans('library.date_of_return')"></datepicker>
                                                    <show-error :form-name="returnForm" prop-name="date_of_return"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-6">
                                                <div class="form-group">
                                                    <label for="">{{trans('library.return_remarks')}}</label>
                                                    <autosize-textarea v-model="returnForm.return_remarks" rows="1" name="return_remarks" :placeholder="trans('library.return_remarks')"></autosize-textarea>
                                                    <show-error :form-name="returnForm" prop-name="return_remarks"></show-error>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group" v-if="book_log.late_fee_applicable && isOverDue">
                                            <p>{{trans('library.late_fee')+': '+formatCurrency(book_log.late_fee_charge)+' ('+trans('list.'+book_log.late_fee_frequency)+')'}} x {{returnForm.ids.length+' '+trans('library.book')}} = {{formatCurrency(calculateLateFee)}}</p>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="form-group">
                                            <label for="">{{trans('library.non_returnable_remarks')}}</label>
                                            <autosize-textarea v-model="returnForm.non_returnable_remarks" rows="1" name="non_returnable_remarks" :placeholder="trans('library.non_returnable_remarks')"></autosize-textarea>
                                            <show-error :form-name="returnForm" prop-name="non_returnable_remarks"></show-error>
                                        </div>
                                        <div class="form-group">
                                            <label class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" value="1" v-model="returnForm.non_returnable_charge_applicable">
                                                <span class="custom-control-label">{{trans('library.non_returnable_charge_applicable')}}</span>
                                            </label>
                                        </div>
                                    </template>
                                    <template v-if="(!returnForm.is_non_returnable && book_log.late_fee_applicable && calculateLateFee) || (returnForm.is_non_returnable && returnForm.non_returnable_charge_applicable)">
                                        <div class="row">
                                            <div class="col-12 col-sm-4" v-if="returnForm.is_non_returnable && returnForm.non_returnable_charge_applicable">
                                                <div class="form-group">
                                                    <label for="">{{trans('library.non_returnable_charge')}}</label>
                                                    <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="non_returnable_charge" :placeholder="trans('library.non_returnable_charge')" v-model="returnForm.non_returnable_charge" @input.native="returnForm.errors.clear('non_returnable_charge')"></currency-input>
                                                    <show-error :form-name="returnForm" prop-name="non_returnable_charge"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.account')}}</label>
                                                    <v-select label="name" v-model="selected_account" name="account_id" id="account_id" :options="accounts" :placeholder="trans('account.select_account')" @select="onAccountSelect" @close="returnForm.errors.clear('account_id')" @remove="returnForm.account_id = ''">
                                                        <div class="multiselect__option" slot="afterList" v-if="!accounts.length">
                                                            {{trans('general.no_option_found')}}
                                                        </div>
                                                    </v-select>
                                                    <show-error :form-name="returnForm" prop-name="account_id"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.payment_method')}}</label>
                                                    <v-select label="name" v-model="selected_payment_method" name="payment_method_id" id="payment_method_id" :options="payment_methods" :placeholder="trans('payment_method.select_payment_method')" @select="onPaymentMethodSelect" @close="returnForm.errors.clear('payment_method_id')" @remove="onPaymentMethodRemove">
                                                        <div class="multiselect__option" slot="afterList" v-if="!payment_methods.length">
                                                            {{trans('general.no_option_found')}}
                                                        </div>
                                                    </v-select>
                                                    <show-error :form-name="returnForm" prop-name="payment_method_id"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4" v-if="getPaymentMethodDetail('instrument_number')">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.instrument_number')}}</label>
                                                    <input class="form-control" type="text" v-model="returnForm.instrument_number" name="instrument_number" :placeholder="trans('finance.instrument_number')">
                                                    <show-error :form-name="returnForm" prop-name="instrument_number"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4" v-if="getPaymentMethodDetail('instrument_date')">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.instrument_date')}}</label>
                                                    <datepicker v-model="returnForm.instrument_date" :bootstrapStyling="true" @selected="returnForm.errors.clear('instrument_date')" :placeholder="trans('finance.instrument_date')"></datepicker>
                                                    <show-error :form-name="returnForm" prop-name="instrument_date"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4" v-if="getPaymentMethodDetail('instrument_bank_detail')">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.instrument_bank_detail')}}</label>
                                                    <input class="form-control" type="text" v-model="returnForm.instrument_bank_detail" name="instrument_bank_detail" :placeholder="trans('finance.instrument_bank_detail')">
                                                    <show-error :form-name="returnForm" prop-name="instrument_bank_detail"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4" v-if="getPaymentMethodDetail('instrument_clearing_date')">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.instrument_clearing_date')}}</label>
                                                    <datepicker v-model="returnForm.instrument_clearing_date" :bootstrapStyling="true" @selected="returnForm.errors.clear('instrument_clearing_date')" :placeholder="trans('finance.instrument_clearing_date')"></datepicker>
                                                    <show-error :form-name="returnForm" prop-name="instrument_clearing_date"></show-error>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4" v-if="getPaymentMethodDetail('reference_number')">
                                                <div class="form-group">
                                                    <label for="">{{trans('finance.reference_number')}}</label>
                                                    <input class="form-control" type="text" v-model="returnForm.reference_number" name="reference_number" :placeholder="trans('finance.reference_number')">
                                                    <show-error :form-name="returnForm" prop-name="reference_number"></show-error>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="form-group">
                                        <button type="button" class="btn btn-info waves-effect waves-light" key="return-action" v-confirm="{ok: confirmReturn()}">{{trans('general.save')}}</button>
                                    </div>
                                </form>
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
        components: {},
    	data(){
    		return {
    			uuid:this.$route.params.uuid,
    			book_log: {},
                returnForm: new Form({
                    ids: [],
                    is_non_returnable: 0,
                    date_of_return: '',
                    late_fee: 0,
                    return_remarks: '',
                    non_returnable_charge: '',
                    non_returnable_charge_applicable: 0,
                    non_returnable_remarks: '',
                    account_id: '',
                    payment_method_id: '',
                    instrument_date: '',
                    instrument_number: '',
                    instrument_clearing_date: '',
                    instrument_bank_detail: '',
                    reference_number: ''
                }),
                selected_account: null,
                accounts: [],
                payment_methods: [],
                selected_payment_method: null,
                payment_method_details: [],
                payment_method_detail: {},
                default_currency: helper.getConfig('default_currency')
    		}
    	},
    	mounted(){
            if(!helper.hasPermission('issue-book') && !helper.hasPermission('return-book')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getBookLog();
    	},
    	methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getStudentBatch(batch){
                return batch.course.name+' '+batch.name;
            },
    		getBookLog(){
    			axios.get('/api/book/log/'+this.uuid)
    				.then(response => {
    					this.book_log = response.book_log;
                        this.getFeePreRequisite();
    				})
    				.catch(error => {
    					helper.showErrorMsg(error);
    				});
    		},
            getFeePreRequisite(){
                axios.get('/api/book/log/fee/pre-requisite')
                    .then(response => {
                        this.accounts = response.accounts;
                        this.payment_methods = response.payment_methods;
                        this.payment_method_details = response.payment_method_details;
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            getStudentBatch(student_record){
                return student_record.batch.course.name+' '+student_record.batch.name;
            },
            getEmployeeDesignation(employee){
                return helper.getEmployeeDesignationOnDate(employee, this.book_log.date_of_issue);
            },
            confirmReturn(){
                return dialog => this.returnAction();
            },
            returnAction(){
                let loader = this.$loading.show();

                if(!this.returnForm.is_non_returnable) {
                    this.returnForm.non_returnable_charge_applicable = 0;
                    this.returnForm.non_returnable_charge = 0;
                    this.returnForm.non_returnable_remarks = '';
                    this.returnForm.late_fee = this.calculateLateFee; 
                }

                if (!this.returnForm.non_returnable_charge_applicable)
                    this.returnForm.non_returnable_charge = 0;

                this.returnForm.post('/api/book/log/'+this.book_log.uuid+'/return')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_account = null;
                        this.selected_payment_method = null;
                        this.payment_method_detail = null;
                        this.returnForm.ids = [];
                        this.getBookLog();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getPaymentMethodDetail(field){
                return helper.getPaymentMethodDetail(this.payment_method_detail, field);
            },
            onAccountSelect(selectedOption){
                this.returnForm.account_id = selectedOption.id;
            },
            onPaymentMethodSelect(selectedOption){
                this.returnForm.payment_method_id = selectedOption.id;
                this.payment_method_detail = this.payment_method_details.find(o => o.id == selectedOption.id);
            },
            onPaymentMethodRemove(removedOption){
                this.returnForm.payment_method_id = '';
                this.payment_method_detail = null;
            },
            submit(){
            }
    	},
        computed: {
            getBookReturnCount(){
                return this.book_log.book_log_details.filter(o => o.date_of_return != null || o.is_non_returnable).length;
            },
            isOverDue(){
                let date = this.returnForm.date_of_return ? helper.toDate(this.returnForm.date_of_return) : helper.today();

                if(this.book_log.book_log_details.length > this.getBookReturnCount && helper.toDate(this.book_log.due_date) < date)
                    return true;

                return false;
            },
            overdueDay(){
                let date = this.returnForm.date_of_return ? helper.toDate(this.returnForm.date_of_return) : helper.today();

                if(this.isOverDue)
                    return helper.getDateDiff(this.book_log.due_date, date);

                return 0;
            },
            calculateLateFee(){
                if(!this.isOverDue)
                    return 0;

                let per_book = Math.floor(this.overdueDay / helper.getLateFeeFrequencyIntoNumber(this.book_log.late_fee_frequency));
                return per_book * this.returnForm.ids.length * this.book_log.late_fee_charge;
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
            'returnForm.ids': function(val){
                if(val.length > 1)
                    this.returnForm.is_non_returnable = 0;
            }
        }
  	}
</script>