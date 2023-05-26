<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('exam.report_analysis')}}
                <span class="card-subtitle d-none d-sm-inline pull-right" v-if="hasRole('admin')">
                    <router-link to="/exam/report/analysis/export" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('exam.export_data_in_excel')})}}</router-link>
                </span>
            </h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row" v-if="getToken">
                <div class="col-12">
                    <p class="alert alert-info" v-if="students.length">{{trans('student.select_student_to_get_report')}}</p>
                    <div class="row">
                        <div class="col-12 col-sm-4 custom-button" v-for="student in students" :key="student.id" @click="admission_number = student.admission_number">
                            <p>
                                <span style="font-weight:bold; font-size:120%;">{{student.name}}</span>
                                <br /> {{student.batch}} ({{student.admission_number}})
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <template v-if="hasAnyRole(['admin', 'principal', 'manager'])">
                        <iframe frameborder=0 style="min-width: 800px;" width="100%" height="800" :src="`https://analytics.doodu.io/open-view/${getToken}`"></iframe>
                    </template>
                    <template v-else-if="(hasRole('student') || hasRole('parent')) && admission_number">
                        <iframe frameborder=0 style="min-width: 800px;" width="100%" height="800" :src="`https://analytics.doodu.io/open-view/${getToken}?CRITERIA=%22Marks%22.%22ADMISSION%20NO%22=%27${admission_number}%27`"></iframe>
                    </template>
                    <template v-else-if="hasRole('staff') && employee_code">
                        <iframe frameborder=0 style="min-width: 800px;" width="100%" height="800" :src="`https://analytics.doodu.io/open-view/${getToken}?CRITERIA=%22Marks%22.%22EMP%20CODE%22=%27${employee_code}%27`"></iframe>
                    </template>
                </div>
            </div>
            <div v-else class="alert alert-danger">{{trans('general.invalid_action')}}</div>
        </div>
    </div>
</template>

<script>
	export default {
        data() {
            return {
                students: [],
                employee_code: null,
                admission_number: null
            }
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasRole(role) {
                return helper.hasRole(role);
            },
            hasAnyRole(roles) {
                return helper.hasAnyRole(roles);
            }
        },
        mounted() {
            let loader = this.$loading.show();
            axios.get('/api/exam/report/analysis/pre-requisite')
                .then(response => {
                    this.students = response.students;
                    this.employee_code = response.employee_code;
                    loader.hide();
                }).catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                })
        },
        computed: {
            getToken() {
                let academic_session = helper.getDefaultAcademicSession();
                let token = '';
                if (helper.hasAnyRole(['student', 'parent'])) {
                    token = academic_session.exam_report_analysis_student_token;
                } else {
                    token = academic_session.exam_report_analysis_staff_token;
                }
                    
                if (token) {
                    let parts = token.split("-");
                    if (parts.length > 1) {
                        return parts[1];
                    }
                        return null
                } 

                return null;
            }
        }
	}
</script>