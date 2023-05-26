<template>
    <div class="autocomplete app-search" @mouseover="displayResult = true" @mouseleave="displayResult = false">
        <input type="text" class="form-control" placeholder="Search here" v-model="search" @keydown="displayResult = true" @focus="displayResult = true">
        <template v-if="displayResult">
            <ul class="autocomplete-results" v-if="search.length">

			  <li class="autocomplete-no-result" v-if="search.length && search.length < 3">{{trans('general.type_min_3_char_for_search_result')}}</li>
			  <li class="autocomplete-no-result" v-else-if="search.length >= 3 && resultLoading">{{trans('general.loading_progress')}}</li>
			  <li class="autocomplete-no-result" v-else-if="search.length >= 3 && !student_search_results.length && !employee_search_results.length && search.length && !resultLoading">{{trans('general.no_result_found')}}</li>

			  <template v-if="student_search_results.length">
	              <li class="autocomplete-heading">{{trans('student.student')}}</li>
	              <li class="autocomplete-result" v-for="result in student_search_results">
	                <div class="item-info">
	                    <h5 class="item-heading">{{getStudentName(result.student)}}</h5>
	                    <div class="item-meta">
	                        <span class="father-name">{{result.student.parent.first_guardian_name}}</span>
	                        <span class="contact"> / {{result.student.contact_number}}</span>
	                    </div>
	                    <div class="item-meta">
	                        <span class="course-batch">{{result.batch.course.name+' '+result.batch.name}}</span>
	                    </div>
	                </div>
	                <div class="item-actions">
	                    <router-link @click.native="search = ''" class="" :to="`/student/${result.student.uuid}`" v-tooltip="trans('student.student_detail')"><i class="fas fa-user"></i></router-link>
	                    <router-link @click.native="search = ''" class="" :to="`/student/${result.student.uuid}/fee/${result.id}`"  v-tooltip="trans('finance.fee_payment')"><i class="fas fa-coins"></i></router-link>
	                </div>
	              </li>
			  </template>

			  <template v-if="employee_search_results.length">
	              <li class="autocomplete-heading">{{trans('employee.employee')}}</li>

	              <li class="autocomplete-result" v-for="result in employee_search_results">
	                <div class="item-info">
	                    <h5 class="item-heading">{{getEmployeeName(result)}}</h5>
	                    <div class="item-meta">
	                        <span class="contact"> / {{result.contact_number}}</span>
	                    </div>
	                    <div class="item-meta">
	                        <span class="course-batch">{{getEmployeeDesignationOnDate(result)}}</span>
	                    </div>
	                </div>
	                <div class="item-actions">
	                    <router-link @click.native="search = ''" class="" :to="`/employee/${result.uuid}`" v-tooltip="trans('employee.employee_detail')"><i class="fas fa-user"></i></router-link>
	                </div>
	              </li>
	          </template>
            </ul>
        </template>
    </div>
</template>

<script>
	export default {
        data(){
            return {
                search: '',
                student_search_results: [],
                employee_search_results: [],
                displayResult: false,
                resultLoading: false,
                timeout: null
            }
        },
        methods: {
            searchResult(){
            	this.resultLoading = true;

                clearTimeout(this.timeout);
                
                var self = this;
                this.timeout = setTimeout(function () {
                    if (self.search.length < 3) {
                        return
                    }

                    axios.get('/api/search?q='+self.search)
                        .then(response => {
                            self.student_search_results = response.student_records;
                            self.employee_search_results = response.employees;
                            self.resultLoading = false;
                        })
                        .catch(error => {
                            self.resultLoading = false;
                            helper.showErrorMsg(error);
                        })
                }, 1000);

            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee){
            	return helper.getEmployeeDesignationOnDate(employee);
            }
        },
        watch: {
            search(val){
                if(val.length >= 3) {
                    this.searchResult();
                } else {
                    this.student_search_results = [];
                    this.employee_search_results = [];
                }
            }
        }
	}
</script>

<style lang="scss" scoped>
    .topbar .top-navbar .app-search input {
        background: rgba(0,20,40,0.1);
        color: #f1f2f4;
        border: 1px solid rgba(0,20,40,0.1);
        border-radius: 2px;
        width: 240px;
    }
    .topbar .top-navbar .app-search input::placeholder {
        color: rgba(255,255,255,0.4);
    }
    .topbar .top-navbar .app-search input:focus {
        background: rgba(0,20,40,0.2);
        color: #ffffff;
        border: 1px solid rgba(0,20,40,0.2);
    }

    ul.autocomplete-results {
        padding: 0;
        margin: 0;
        max-height: 350px;
        overflow: auto;
        position: absolute;
        width: 100%;
        background: #ffffff;
        border: 1px solid #d1d2d5;
        border-top: none;
        box-shadow: 0 2px 10px rgba(0,20,40,0.2);
        border-radius: 0 0 6px 6px;

        li.autocomplete-heading {
            font-size: 16px;
            padding: 8px;
            letter-spacing: 0.2px;
            color: rgba(0,20,40,0.4);
            border-bottom: 1px solid rgba(0,20,40,0.2);
        }
        li.autocomplete-no-result {
            font-size: 12px;
            padding: 8px;
            letter-spacing: 0.2px;
            color: rgba(0,20,40,0.4);
            border-bottom: 1px solid rgba(0,20,40,0.2);
        }
    }
    ul.autocomplete-results > li.autocomplete-result {
        display: flex;
        list-style: none;
        text-align: left;
        width: 100%;

        .item-info {
            margin: 0;
            flex-grow: 2;
            padding: 5px 8px;

            .item-heading {
                font-size: 13px;
                margin-bottom: 0;
            }

            .item-meta {
                font-size: 11px;
            }
        }
        .item-actions {
            border-left: 1px solid rgba(0,20,40,0.1);
            padding: 5px 0;

            a {
                display: block;
                text-align: center;
                padding: 2px;
                width: 24px;
                height: 28px;
                color: rgba(0,20,40,0.3)
            }
        }
    }
    ul.autocomplete-results > li.autocomplete-result:nth-child(even) {
        background: rgba(210,215,220,0.2);
    }
    ul.autocomplete-results > li.autocomplete-result + li.autocomplete-result {
        border-top: 1px solid rgba(0,20,40,0.1);
    }
    ul.autocomplete-results > li.autocomplete-result:hover {
        background: rgba(200,205,215,0.5);
        color: rgba(0,20,40,0.8);

        .item-heading, .item-meta {
            color: inherit;
        }
    }
</style>
