<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('library.issue_book')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
		                <button class="btn btn-info btn-sm" @click="$router.push('/library/issue/list')"><i class="fas fa-book"></i> <span class="d-none d-sm-inline">{{trans('library.issue_list')}}</span></button>
		                <button class="btn btn-info btn-sm" @click="$router.push('/library/book')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('library.book')}}</span></button>
                        <help-button @clicked="help_topic = 'book-issue'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                	<div class="row">
                		<div class="col-12 col-sm-6">
						    <form @submit.prevent="submit" @keydown="issueForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-6">
						                <div class="form-group">
						                    <label for="">{{trans('library.date_of_issue')}}</label>
						                    <datepicker v-model="issueForm.date_of_issue" :bootstrapStyling="true" @selected="issueForm.errors.clear('date_of_issue')" :placeholder="trans('library.date_of_issue')"></datepicker>
						                    <show-error :form-name="issueForm" prop-name="date_of_issue"></show-error>
						                </div>
						            </div>
				                    <div class="col-12 col-md-6">
				                        <div class="form-group">
						                    <label for="">{{trans('library.issue_to')}}</label>
						                    <div class="row">
		                    					<div class="col-6">
						                            <div class="radio radio-success">
						                                <input type="radio" value="student" id="type_student" v-model="issueForm.type" :checked="issueForm.type == 'student'" name="type" @click="issueForm.errors.clear('type')">
						                                <label for="type_student">{{trans('student.student')}}</label>
						                            </div>
						                        </div>
		                    					<div class="col-6">
						                            <div class="radio radio-success">
						                                <input type="radio" value="employee" id="type_employee" v-model="issueForm.type" :checked="issueForm.type == 'employee'" name="type" @click="issueForm.errors.clear('type')">
						                                <label for="type_employee">{{trans('employee.employee')}}</label>
						                            </div>
						                        </div>
						                    </div>
				                            <show-error :form-name="issueForm" prop-name="type"></show-error>
				                        </div>
				                    </div>
						            <div class="col-12">
						            	<div class="m-b-20" v-if="issueForm.type == 'student' && selected_student">
						            		<div class="row">
						            			<div class="col-6">{{trans('student.name')+': '+getStudentName(selected_student)}}</div>
						            			<div class="col-6">{{trans('student.first_guardian_name')+': '+getStudentFatherName(selected_student)}} <br /></div>
						            			<div class="col-6">{{trans('academic.batch')+': '+selected_student_record.batch.course.name+' '+selected_student_record.batch.name}}</div>
						            			<div class="col-6">{{trans('student.contact_number')+': '+selected_student.contact_number}}</div>
						            		</div>
						            	</div>
						            	<div class="m-b-20" v-if="issueForm.type == 'employee' && selected_employee">
						            		<div class="row">
						            			<div class="col-6">{{trans('employee.code')+': '+getEmployeeCode(selected_employee)}}</div>
						            			<div class="col-6">{{trans('employee.name')+': '+getEmployeeName(selected_employee)}}</div>
						            			<div class="col-6">{{trans('employee.father_name')+': '+selected_employee.father_name}} <br /></div>
						            			<div class="col-6">{{trans('employee.contact_number')+': '+selected_employee.contact_number}}</div>
						            		</div>
						            	</div>
						                
						                <div class="form-group">
							            	<div class="input-group mb-3">
												<input class="form-control" type="text" v-model="book_number" name="book_number" @keypress.13.prevent="searchBook" :placeholder="trans('library.book_search_by_number')">
												<div class="input-group-append">
													<button type="button" class="btn btn-info pull-right" @click="searchBook"><i class="fas fa-search"></i> {{trans('general.search')}}</button>
												</div>
											</div>
										</div>

						            	<div class="table-responsive" v-if="book_details.length">
						            		<table class="table table-sm">
						            			<thead>
						            				<tr>
						            					<th>{{trans('library.book_number')}}</th>
						            					<th>{{trans('library.book_title')}}</th>
						            					<th>{{trans('library.book_author')}}</th>
						            					<th>{{trans('library.book_condition')}}</th>
						            					<th></th>
						            				</tr>
						            			</thead>
						            			<tbody>
						            				<tr v-for="book_post_detail in book_details">
						            					<td>{{book_post_detail.number}}</td>
						            					<td>{{book_post_detail.book_post.book.title}}</td>
						            					<td>{{book_post_detail.book_post.book.book_author.name}}</td>
						            					<td>{{book_post_detail.book_condition_id ? book_post_detail.book_condition.name : '-'}}</td>
						            					<td>
						            						<button type="button" class="btn btn-danger btn-sm" :key="book_post_detail.id" v-confirm="{ok: confirmDelete(book_post_detail.number)}" v-tooltip="trans('library.delete_book')"><i class="fas fa-trash"></i></button>
						            					</td>
						            				</tr>
						            			</tbody>
						            		</table>
						            	</div>
						            </div>
						        </div>
						        <template v-if="book_details.length">
					                <div class="form-group">
					                    <label for="">{{trans('library.issue_remarks')}}</label>
					                    <autosize-textarea v-model="issueForm.issue_remarks" rows="1" name="issue_remarks" :placeholder="trans('library.issue_remarks')"></autosize-textarea>
					                    <show-error :form-name="issueForm" prop-name="issue_remarks"></show-error>
					                </div>
							        <div class="form-group">
							        	<button type="submit" class="btn btn-info pull-right">{{trans('general.save')}}</button>
							        </div>
							    </template>
						    </form>
                		</div>
                		<div class="col-12 col-sm-6">
					        <div class="row">
					            <div class="col-12" v-if="issueForm.type == 'student'">
					                <div class="form-group">
						            	<div class="input-group mb-3">
					                    	<input class="form-control" type="text" v-model="studentFilter.name" name="student_name" :placeholder="trans('student.student_search_by_name')">
											<div class="input-group-append">
												<button type="button" class="btn btn-info pull-right" @click="searchStudent"><i class="fas fa-search"></i> {{trans('general.search')}}</button>
											</div>
										</div>
					                </div>
					                <template v-if="students.total" class="m-b-10">
						            	<div class="table-responsive">
						            		<table class="table table-sm">
						            			<thead>
						            				<tr>
						            					<th>{{trans('student.name')}}</th>
						            					<th>{{trans('academic.batch')}}</th>
						            					<th>{{trans('student.first_guardian_name')}}</th>
						            					<th>{{trans('student.contact_number')}}</th>
						            					<th></th>
						            				</tr>
						            			</thead>
						            			<tbody>
						            				<template v-for="student in students.data">
							            				<tr v-for="student_record in student.student_records">
							            					<td>{{getStudentName(student)}}</td>
							            					<td>{{student_record.batch.course.name+' '+student_record.batch.name}}</td>
							            					<td>{{getStudentFatherName(student)}}</td>
							            					<td>{{student.contact_number}}</td>
							            					<td>
							            						<button type="button" class="btn btn-sm btn-info" @click="selectStudentRecord(student, student_record)">{{trans('student.select_student')}}</button>
							            					</td>
							            				</tr>
							            			</template>
						            			</tbody>
						            		</table>
						            	</div>
						            	<pagination-record :page-length.sync="studentFilter.page_length" :records="students" @updateRecords="searchStudent"></pagination-record>
						            </template>
					            </div>

					            <div class="col-12" v-if="issueForm.type == 'employee'">
					                <div class="form-group">
						            	<div class="input-group mb-3">
					                    	<input class="form-control" type="text" v-model="employeeFilter.name" name="employee_name" :placeholder="trans('employee.employee_search_by_name')">
											<div class="input-group-append">
												<button type="button" class="btn btn-info pull-right" @click="searchEmployee"><i class="fas fa-search"></i> {{trans('general.search')}}</button>
											</div>
										</div>
					                </div>

					                <template v-if="employees.total" class="m-b-10">
						            	<div class="table-responsive">
						            		<table class="table table-sm">
						            			<thead>
						            				<tr>
						            					<th>{{trans('employee.code')}}</th>
						            					<th>{{trans('employee.name')}}</th>
						            					<th>{{trans('employee.father_name')}}</th>
						            					<th>{{trans('employee.contact_number')}}</th>
						            					<th></th>
						            				</tr>
						            			</thead>
						            			<tbody>
						            				<tr v-for="employee in employees.data">
						            					<td>{{getEmployeeCode(employee)}}</td>
						            					<td>{{getEmployeeName(employee)}}</td>
						            					<td>{{employee.father_name}}</td>
						            					<td>{{employee.contact_number}}</td>
						            					<td>
						            						<button type="button" class="btn btn-sm btn-info" @click="selectEmployee(employee)">{{trans('employee.select_employee')}}</button>
						            					</td>
						            				</tr>
						            			</tbody>
						            		</table>
						            	</div>
						            	<pagination-record :page-length.sync="employeeFilter.page_length" :records="employees" @updateRecords="searchEmployee"></pagination-record>
						            </template>
					            </div>
					            <div class="col-12 m-b-10" v-if="unreturned_books.length">
				                	<h4 class="card-title">{{trans('library.unreturned_books')}}</h4>
					            	<div class="table-responsive">
					            		<table class="table table-sm">
					            			<thead>
					            				<tr>
					            					<th>{{trans('library.book_number')}}</th>
					            					<th>{{trans('library.book_title')}}</th>
					            					<th>{{trans('library.book_author')}}</th>
					            					<th>{{trans('library.date_of_issue')}}</th>
					            					<th>{{trans('library.due_date')}}</th>
					            				</tr>
					            			</thead>
					            			<tbody>
					            				<template v-for="book_log in unreturned_books">
					            					<tr v-for="book_log_detail in book_log.book_log_details">
						            					<td>{{book_log_detail.book_post_detail.number}}</td>
						            					<td>{{book_log_detail.book_post_detail.book_post.book.title}}</td>
						            					<td>{{book_log_detail.book_post_detail.book_post.book.book_author.name}}</td>
						            					<td>{{book_log.date_of_issue | moment}}</td>
						            					<td>{{book_log.due_date | moment}}</td>
						            				</tr>
					            				</template>
					            			</tbody>
					            		</table>
					            	</div>
					            </div>
					        </div>
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
				issueForm: new Form({
					type: 'student',
					student_id: '',
					employee_id: '',
					date_of_issue: '',
					issue_remarks: '',
					books: []
				}),
				book_details: [],
				book_number: '',
				selected_student: null,
				selected_student_record: null,
				selected_employee: null,
				studentFilter: {
					name: '',
					page_length: helper.getConfig('page_length')
				},
				employeeFilter: {
					name: '',
					page_length: helper.getConfig('page_length')
				},
				students: {
					data: [],
					total: 0
				},
				employees: {
					data: [],
					total: 0
				},
				unreturned_books: []
			}
		},
		mounted(){
            helper.showDemoNotification(['library']);

            this.issueForm.date_of_issue = moment().format('YYYY-MM-DD');
		},
		methods: {
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getStudentFatherName(student){
            	return student.parent.first_guardian_name;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
			searchBook(){
				let loader = this.$loading.show();
				let date = this.issueForm.date_of_issue;

				if (! date) {
					loader.hide();
					return toastr.error(i18n.library.choose_date_before_adding_book);
				}

				if (this.issueForm.books.indexOf(parseInt(this.book_number)) >= 0) {
					loader.hide();
					return toastr.error(i18n.library.book_already_added_in_issue_list);
				}

				axios.post('/api/book/search/number',{number: this.book_number, date: date})
					.then(response => {
						this.issueForm.books.push(response.number);
						this.book_details.push(response);
						this.book_number = '';
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			searchStudent(page){
				let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.studentFilter);
				axios.get('/api/student/search/name?page=' + page + url)
					.then(response => {
						this.students = response;

						if(! response.total) {
							loader.hide();
							return toastr.error(i18n.general.no_search_result_found);
						}
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			selectStudentRecord(student, student_record){
				this.issueForm.student_id = student.id;
				this.selected_student = student;
				this.selected_student_record = student_record;
				this.students = [];
				this.studentFilter.name = '';
            	this.getUnreturnedBooks(this.issueForm.type, student_record.id);
			},
			searchEmployee(page){
				let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.employeeFilter);
				axios.get('/api/employee/search/name?page=' + page + url)
					.then(response => {
						this.employees = response;

						if(! response.total) {
							loader.hide();
							return toastr.error(i18n.general.no_search_result_found);
						}
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			selectEmployee(employee){
				this.issueForm.employee_id = employee.id;
				this.selected_employee = employee;
				this.employees = [];
				this.employeeFilter.name = '';
            	this.getUnreturnedBooks(this.issueForm.type, employee.id);
			},
			getUnreturnedBooks(type, id){
				let loader = this.$loading.show();
				axios.post('/api/book/log/unreturned',{id: id, type: type})
					.then(response => {
						this.unreturned_books = response;
						loader.hide();
					})
					.catch(error => {
						loading.hide();
						helper.showErrorMsg(error);
					})
			},
            confirmDelete(number){
                return dialog => this.deleteBook(number);
            },
            deleteBook(number){
            	let idx = this.book_details.findIndex(o => o.number == number);
            	this.book_details.splice(idx, 1);

            	idx = this.issueForm.books.indexOf(number);
            	this.issueForm.books.splice(idx, 1);
            },
            submit(){
            	let loader = this.$loading.show();
            	this.issueForm.post('/api/book/log')
            		.then(response => {
            			toastr.success(response.message);
            			this.selected_employee = null;
            			this.selected_student = null;
            			this.selected_student_record = null;
            			this.studentFilter.name = '';
            			this.employeeFilter.name = '';
            			this.students.data = [];
            			this.students.total = 0;
            			this.employees.data = [];
            			this.employees.total = 0;
            			this.book_details = [];
            			this.unreturned_books = [];
            			this.issueForm.type = 'student';
            			this.issueForm.books = [];
            			loader.hide();
            		})
            		.catch(error => {
            			loader.hide();
            			helper.showErrorMsg(error);
            		})
            }
		},
        watch: {
            'studentFilter.page_length': function(val){
                this.searchStudent();
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
	}
</script>