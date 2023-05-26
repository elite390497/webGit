<template>
    <div>
        <div class="page-titles" v-if="employee.id">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.employee_detail')}}
                        <span class="card-subtitle">{{getEmployeeName(employee)}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/employee/card-view" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.employee')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-8 p-0">
                    <div id="accordion" class="accordion" v-if="employee.id">
                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="basic" @click="tab = 'basic'" data-toggle="collapse" data-target="#collapseBasic" aria-expanded="false" aria-controls="collapseBasic">
                                <h5><i class="fas fa-lg fa-graduation-cap fa-fix-w-32"></i> {{trans('employee.basic_information')}}</h5>
                            </div>

                            <div id="collapseBasic" class="collapse" aria-labelledby="basic" data-parent="#accordion">
                                <div class="card-body">
                                    <basic-form :employee="employee" @complete="getEmployee" v-if="tab == 'basic'"></basic-form>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="contact" @click="tab = 'contact'" data-toggle="collapse" data-target="#collapseContact" aria-expanded="false" aria-controls="collapseContact">
                                <h5><i class="fas fa-lg fa-address-book fa-fix-w-32"></i> {{trans('employee.contact_information')}}</h5>
                            </div>

                            <div id="collapseContact" class="collapse" aria-labelledby="contact" data-parent="#accordion">
                                <div class="card-body">
                                    <contact-form :employee="employee" @complete="getEmployee" v-if="tab == 'contact'"></contact-form>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="document" @click="tab = 'document'" data-toggle="collapse" data-target="#collapseDocument" aria-expanded="false" aria-controls="collapseDocument">
                                <h5><i class="fas fa-lg fa-folder fa-fix-w-32"></i> {{trans('employee.document_information')}}</h5>
                            </div>

                            <div id="collapseDocument" class="collapse" aria-labelledby="document" data-parent="#accordion">
                                <div class="card-body">
                                    <document-detail :employee="employee" v-if="tab == 'document'"></document-detail>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="qualification" @click="tab = 'qualification'" data-toggle="collapse" data-target="#collapseQualification" aria-expanded="false" aria-controls="collapseQualification">
                                <h5><i class="fas fa-lg fa-book fa-fix-w-32"></i> {{trans('employee.qualification_information')}}</h5>
                            </div>

                            <div id="collapseQualification" class="collapse" aria-labelledby="qualification" data-parent="#accordion">
                                <div class="card-body">
                                    <qualification-detail :employee="employee" v-if="tab == 'qualification'"></qualification-detail>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="account" @click="tab = 'account'" data-toggle="collapse" data-target="#collapseAccount" aria-expanded="false" aria-controls="collapseAccount">
                                <h5><i class="fas fa-lg fa-university fa-fix-w-32"></i> {{trans('employee.account_information')}}</h5>
                            </div>

                            <div id="collapseAccount" class="collapse" aria-labelledby="account" data-parent="#accordion">
                                <div class="card-body">
                                    <account-detail :employee="employee" v-if="tab == 'account'"></account-detail>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="login" @click="tab = 'login'" data-toggle="collapse" data-target="#collapseUserLogin" aria-expanded="false" aria-controls="collapseUserLogin">
                                <h5><i class="fas fa-lg fa-sign-in-alt fa-fix-w-32"></i> {{trans('auth.user_login')}}</h5>
                            </div>

                            <div id="collapseUserLogin" class="collapse" aria-labelledby="login" data-parent="#accordion">
                                <div class="card-body">
                                    <login-detail :employee="employee" v-if="tab == 'login'" @completed="getEmployee"></login-detail>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="designation" @click="tab = 'designation'" data-toggle="collapse" data-target="#collapseDesignation" aria-expanded="false" aria-controls="collapseDesignation">
                                <h5><i class="fas fa-lg fa-user-plus fa-fix-w-32"></i> {{trans('employee.designation_history')}}</h5>
                            </div>

                            <div id="collapseDesignation" class="collapse" aria-labelledby="designation" data-parent="#accordion">
                                <div class="card-body">
                                    <designation-detail :employee="employee" @completed="getEmployee" v-if="tab == 'designation'"></designation-detail>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="overflow: visible;">
                            <div class="card-header collapsed" id="term" @click="tab = 'term'" data-toggle="collapse" data-target="#collapseTerm" aria-expanded="false" aria-controls="collapseTerm">
                                <h5><i class="fas fa-lg fa-user-times fa-fix-w-32"></i> {{trans('employee.term_history')}}</h5>
                            </div>

                            <div id="collapseTerm" class="collapse" aria-labelledby="term" data-parent="#accordion">
                                <div class="card-body">
                                    <term-detail :employee="employee" @completed="getEmployee" v-if="tab == 'term'"></term-detail>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-4 hidden-sm-down p-0 border-left">
                    <div class="card">
                        <div class="card-body p-r-20">
                            <div class="m-2">
                                <upload-image id="photo" :upload-path="`/employee/${employee.uuid}/photo`" :remove-path="`/employee/${employee.uuid}/photo/remove`" :image-source="photo" @uploaded="updatePhoto" @removed="updatePhoto"></upload-image>
                            </div>
                            <div class="table-responsive" v-if="employee.id">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('employee.name')}}</td>
                                            <td>{{getEmployeeName(employee)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.father_name')}}</td>
                                            <td>{{employee.father_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.status')}}</td>
                                            <td v-html="getStatus(employee)"></td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.date_of_joining')}}</td>
                                            <td>
                                                <span v-if="employee.employee_terms[0]">{{employee.employee_terms[0].date_of_joining | moment}}</span>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.designation')}}</td>
                                            <td>
                                                <span v-if="employee.employee_designations.length">
                                                    {{employee.employee_designations[0].designation.name+' ('+employee.employee_designations[0].designation.employee_category.name+')'}}
                                                </span>
                                                <span v-else>-</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.mother_name')}}</td>
                                            <td>{{employee.mother_name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.contact_number')}}</td>
                                            <td>{{employee.contact_number}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.gender')}}</td>
                                            <td>{{employee.gender}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.date_of_birth')}}</td>
                                            <td>{{employee.date_of_birth | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.created_at')}}</td>
                                            <td>{{employee.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.updated_at')}}</td>
                                            <td>{{employee.updated_at | momentDateTime}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import basicForm from './basic/form'
    import contactForm from './contact/form'
    import documentDetail from './document/index'
    import accountDetail from './account/index'
    import designationDetail from './designation/index'
    import termDetail from './term/index'
    import qualificationDetail from './qualification/index'
    import loginDetail from './login/index'

	export default {
        components : { basicForm,contactForm,documentDetail,accountDetail,qualificationDetail,designationDetail,termDetail,loginDetail },
        data() {
            return {
                uuid:this.$route.params.uuid,
                employee: {},
                photo: '',
                tab: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getEmployee();
            helper.showDemoNotification(['employee']);
        },
        methods: {
        	getEmployee(){
                let loader = this.$loading.show();
        		axios.get('/api/employee/'+this.uuid)
        			.then(response => {
        				this.employee = response;
                        this.photo = this.employee.photo;
                        loader.hide();
        			})
        			.catch(error => {
                        loader.hide();
        				helper.showErrorMsg(error);
        				this.$router.push('/dashboard');
        			})
        	},
        	getEmployeeName(){
                return helper.getEmployeeName(this.employee);
        	},
            updatePhoto(val){
            },
            getStatus(employee){
                let term = employee.employee_terms;
                if (term.length && term[0].date_of_joining <= helper.today() && (!term[0].date_of_leaving || term[0].date_of_leaving >= helper.today()))
                    return '<span class="label label-success">'+i18n.employee.status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.status_inactive+'</span>';
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
            '$route.params.uuid': function (uuid) {
                this.uuid = uuid;
                this.getEmployee()
            }
        }
	}
</script>