<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('general.home')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm right-sidebar-toggle " v-tooltip="trans('user.user_preference')"><i class="fas fa-cog"></i></button>
                        <button class="btn btn-danger btn-sm" @click.prevent="logout"><i class="fas fa-power-off"></i> <span class="d-none d-sm-inline">{{trans('auth.logout')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-md-8">
                    <notice-highlight class="border-right border-bottom p-4" v-if="showTourVideo && !getConfig('mode')">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <iframe width="100%" height="325" src="#" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>
                            <div class="col-12 col-md-6 product-intro">
                                <h2>Do you want a <span class="special">Tour</span>?</h2>
                                <h3>Watch InstiKit's Short Introduction Video</h3>
                                <p>We will go through all the primary modules and features that InstiKit currently has in this short video. If you like InstiKit click on the button below to buy InstiKit.</p>
                                <a class="btn btn-danger" href="https://www.enovic.in"><span class="p-r-10 m-r-10 border-right">Liked it?</span><strong><i class="fas fa-shopping-cart m-r-5"></i> Buy it Now</strong></a>
                                <button class="btn" @click="hideTourVideo"><i class="fas fa-times"></i> Hide</button>
                            </div>
                        </div>
                    </notice-highlight>

                    <div class="card border-right">
                        <div class="card-body p-4">
                            <template v-if="hasAnyRole(['admin','manager','principal'])">
                                <h4 class="card-title">{{trans('student.total_strength', {total: total_strength})}}
                                    <span class="pull-right">
                                        <button v-if="strength_chart_type == 'batch'" class="btn btn-sm btn-info" @click="strength_chart_type = 'course'">{{trans('academic.course_wise')}}</button>
                                        <button v-if="strength_chart_type == 'course'" class="btn btn-sm btn-info" @click="strength_chart_type = 'batch'">{{trans('academic.batch_wise')}}</button>
                                    </span>
                                </h4>
                                <bar-chart :chart="chart.strength"></bar-chart>
                            </template>

                            <calendar></calendar>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 p-0">
                    <div class="card widget" v-if="hasNotAnyRole(['student','parent'])">
                        <div class="card-body">
                            <div class="row border-bottom">
                                <div class="col p-4 b-r">
                                    <h2 class="font-light">{{birthday_count}} <span class="float-right"><i class="fas text-themecolor fa-birthday-cake"></i></span></h2>
                                    <h5>{{trans('general.birthday')}}</h5></div>
                                <div class="col p-4 b-r">
                                    <h2 class="font-light">{{anniversary_count}} <span class="float-right"><i class="fas text-themecolor fa-heartbeat"></i></span></h2>
                                    <h5>{{trans('general.anniversary')}}</h5></div>
                                <div class="col p-4 mr-4">
                                    <h2 class="font-light">{{work_anniversary_count}} <span class="float-right"><i class="fas text-themecolor fa-gift"></i></span></h2>
                                    <h5>{{trans('general.work_anniversary')}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card widget" v-if="hasRole('librarian')">
                        <div class="card-body">
                            <div class="row border-bottom">
                                <div class="col p-4 b-r">
                                    <h2 class="font-light">{{total_book_count}} <span class="float-right"><i class="fas text-themecolor fa-book"></i></span></h2>
                                    <h5>{{trans('library.total_books')}}</h5></div>
                                <div class="col p-4 b-r">
                                    <h2 class="font-light">{{pending_return_book_count}} <span class="float-right"><i class="fas text-themecolor fa-book-open"></i></span></h2>
                                    <h5>{{trans('library.pending_return')}}</h5></div>
                                <div class="col p-4 mr-4">
                                    <h2 class="font-light">{{overdue_return_book_count}} <span class="float-right"><i class="fas text-themecolor fa-swatchbook"></i></span></h2>
                                    <h5>{{trans('library.overdue_return')}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="['card widget', hasAnyRole(['student','parent']) ? 'm-t-20' : '']" v-if="hasPermission('access-todo')">
                        <div class="card-body">
                            <div class="row border-bottom">
                                <div class="col-12">
                                    <h4 class="card-title mb-3">{{trans('utility.todo')}}</h4>
                                    <todo-widget></todo-widget>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <events-list v-if="events.length && hasPermission('list-event')" :events="events" class="frontend-widget" body-class="row-like-margin border-bottom px-3 p-b-30" view-more-link="/calendar/event"></events-list>

                    <articles-list v-if="articles.length && hasPermission('list-article')" :articles="articles" class="frontend-widget" body-class="row-like-margin border-bottom px-3 p-b-30" view-more-link="/post/feed"></articles-list>
                </div>
            </div>
        </div>
        <div class="right-sidebar">
            <div class="slimscrollright">
                <div class="rpanel-title"> 
                    {{trans('user.user_preference')}} 
                    <button class="btn btn-danger btn-sm right-sidebar-toggle pull-right "><i class="fas fa-times"></i></button>
                </div>
                <div class="r-panel-body">
                    <form @submit.prevent="updatePreference" @keydown="preferenceForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.color_theme')}}</label>
                                    <select v-model="preferenceForm.color_theme" class="custom-select col-12">
                                      <option v-for="option in color_themes" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="preferenceForm" prop-name="color_theme"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.direction')}}</label>
                                    <select v-model="preferenceForm.direction" class="custom-select col-12">
                                      <option v-for="option in directions" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="preferenceForm" prop-name="direction"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.sidebar')}}</label>
                                    <select v-model="preferenceForm.sidebar" class="custom-select col-12">
                                      <option v-for="option in sidebar" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="preferenceForm" prop-name="sidebar"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('configuration.locale')}}</label>
                                    <select v-model="preferenceForm.locale" class="custom-select col-12">
                                      <option v-for="option in locales" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="preferenceForm" prop-name="sidebar"></show-error>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-info waves-effect waves-light pull-right m-t-10">{{trans('general.save')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NoticeHighlight from '@components/notice-highlight'
    import EventsList from '@js/widgets/events-list'
    import ArticlesList from '@js/widgets/articles-list'
    import barChart from './chart/bar-chart'
    import calendar from './calendar/calendar'
    import todoWidget from './utility/todo/widget'

    export default {
        components: {
            NoticeHighlight,
            EventsList,
            ArticlesList,
            barChart,
            calendar,
            todoWidget
        },
        data() {
            return {
                color_themes: [],
                directions: [],
                sidebar: [],
                locales: [],
                preferenceForm: new Form({
                    color_theme: helper.getConfig('user_color_theme') || helper.getConfig('color_theme'),
                    direction: helper.getConfig('user_direction') || helper.getConfig('direction'),
                    locale: helper.getConfig('user_locale') || helper.getConfig('locale'),
                    sidebar: helper.getConfig('user_sidebar') || helper.getConfig('sidebar')
                },false),
                user_preference: {
                    color_theme: helper.getConfig('user_color_theme') || helper.getConfig('color_theme'),
                    direction: helper.getConfig('user_direction') || helper.getConfig('direction'),
                    locale: helper.getConfig('user_locale') || helper.getConfig('locale'),
                    sidebar: helper.getConfig('user_sidebar') || helper.getConfig('sidebar')
                },
                showModal: false,
                chart: {
                    strength: {
                        labels: [],
                        datasets: []
                    }
                },
                total_strength: 0,
                strength_chart_type: 'course',
                birthday_count: 0,
                anniversary_count: 0,
                work_anniversary_count: 0,
                total_book_count: 0,
                pending_return_book_count: 0,
                overdue_return_book_count: 0,
                articles: [],
                events: [],
                showTourVideo: false
            }
        },
        mounted(){
            if(this.$route.query.reload)
                window.location = window.location.pathname;

            helper.showDemoNotification(['dashboard_academic','dashboard_student','dashboard_student_attendance','dashboard_employee','dashboard_finance','dashboard_transport','dashboard_frontend','dashboard_post','dashboard_calendar','dashboard_thanks']);

            this.getData();

            if (this.hasAnyRole(['admin','manager','principal'])) {
                this.getStudentStrengthChartData();
            }

            this.showTourVideo = this.$cookie.get('hide_tour_video') ? false : true;

            this.getUserPreferencePreRequisite();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasRole(role){
                return helper.hasRole(role);
            },
            hasAnyRole(roles){
                return helper.hasAnyRole(roles);
            },
            hasNotAnyRole(roles){
                return helper.hasNotAnyRole(roles);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showArticle(article){
                this.showArticleUuid = article.uuid;
                this.showArticleModal = true;
            },
            logout(){
                helper.logout().then(() => {
                    this.$router.push('/login')
                })
            },
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/dashboard')
                    .then(response => {
                        this.birthday_count= response.birthday_count;
                        this.anniversary_count= response.anniversary_count;
                        this.work_anniversary_count= response.work_anniversary_count;
                        if (helper.hasRole('librarian')) {
                            this.total_book_count = response.total_book_count;
                            this.pending_return_book_count = response.pending_return_book_count;
                            this.overdue_return_book_count = response.overdue_return_book_count;
                        }
                        this.articles = response.articles;
                        this.events = response.events;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getStudentStrengthChartData(){
                let loader = this.$loading.show();
                axios.post('/api/dashboard/student/strength/chart', {strength_chart_type: this.strength_chart_type})
                    .then(response => {
                        this.chart.strength = response.strength;
                        this.total_strength = response.total;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getUserPreferencePreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/user/preference/pre-requisite')
                    .then(response => {
                        this.color_themes = response.color_themes;
                        this.directions = response.directions;
                        this.sidebar = response.sidebar;
                        this.locales = response.locales;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
                },
            updatePreference(){
                let loader = this.$loading.show();
                this.preferenceForm.post('/api/user/preference')
                    .then(response => {
                        this.$store.dispatch('setConfig',{loaded: false});
                        toastr.success(response.message);

                        $('#theme').attr('href','/css/colors/'+this.preferenceForm.color_theme+'.css');

                        loader.hide();

                        if(this.user_preference.direction != this.preferenceForm.direction || this.user_preference.sidebar != this.preferenceForm.sidebar || this.user_preference.locale != this.preferenceForm.locale)
                            location.reload();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            hideTourVideo(){
                this.$cookie.set('hide_tour_video',helper.randomString(20), {expires: '30m'});
                this.showTourVideo = false;
            }
        },
        computed: {
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            strength_chart_type(val){
                this.getStudentStrengthChartData();
            }
        }
    }
</script>
<style lang="scss">
    .shw-rside{
        width: 500px;
    }

    .product-intro {
        visibility: hidden;
        }
</style>