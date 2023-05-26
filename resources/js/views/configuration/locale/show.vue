<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.translation')}} ({{locale.name}}) </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration/locale')"><i class="fas fa-globe"></i> <span class="d-none d-sm-inline">{{trans('configuration.locale')}}</span></button>
                        <div class="btn-group">
                            <button type="button" style="margin-top:-5px;" class="btn btn-info btn-sm" href="#" role="button" id="moduleLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-boxes"></i> <span class="d-none d-sm-inline">{{trans('configuration.locale_module')}} <span>({{toWord(module)}})</span> <i class="fas fa-chevron-down"></i> </span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moduleLink">
                                <button style="cursor:pointer;" class="dropdown-item" v-for="mod in modules" @click="$router.push('/configuration/locale/'+locale.locale+'/'+mod)">
                                    {{toWord(mod)}} <span v-if="mod == module" class="pull-right"><i class="fas fa-check"></i></span> 
                                </button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'configuration.locale.translation'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body p-4">
                    <div v-if="getWordCount">
                        <div class="row">
                            <template v-for="(word,index) in words">
                                <template v-if="typeof word === 'object'">
                                    <div class="col-12 col-sm-4" v-for="(wrd,i) in word">
                                        <div class="form-group">
                                            <label for="" style="color:red;">{{trans(module+'.'+index+'.'+i)}}</label>
                                            <!-- <label for="">{{index}}_{{i}}</label> -->
                                            <input class="form-control" type="text" v-model="words[index][i]" :name="`${index}_${i}`">
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="col-12 col-sm-4">
                                        <div class="form-group">
                                            <label for="" class="font-weight-bold">{{trans(module+'.'+index)}}</label>
                                            <!-- <label for="">{{index}}</label> -->
                                            <input class="form-control" type="text" v-model="words[index]" :name="index">
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-info btn-sm pull-right" @click="saveTranslation">{{trans('general.save')}}</button>
                        </div>
                    </div>
                    <div v-if="!getWordCount">
                        <p class="alert alert-danger">{{trans('general.no_result_found')}}</p>
                    </div>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                modules: {},
                words: {},
                locale: {},
                module: (this.$route.params.module) ? this.$route.params.module : 'auth',
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.featureAvailable('multilingual')){
                helper.featureNotAvailableMsg();
                this.$router.push('/dashboard');
            }

            this.fetchWords();
        },
        methods: {
            fetchWords(){
                let loader = this.$loading.show();
                axios.post('/api/locale/fetch',{
                    locale: this.$route.params.locale,
                    module: this.module
                    })
                    .then(response => {
                        this.modules = response.modules;
                        this.words = response.words;
                        this.locale = response.locale;
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/locale');
                    });
            },
            getName(name){
                name = helper.ucword(name);
                return name.replace(/_/g, ' ');
            },
            getModuleLink(module){
                return '/configuration/locale/'+this.$route.params.locale+'/'+module
            },
            saveTranslation(){
                let loader = this.$loading.show();
                axios.post('/api/locale/translate',{
                    locale: this.$route.params.locale,
                    module: this.module,
                    words: this.words
                }).then(response => {
                    toastr.success(response.message);
                    loader.hide();
                }).catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            toWord(word){
                return helper.toWord(word);
            }
        },
        watch: {
            '$route.params.module'(newModule, oldModule) {
                this.module = newModule;
                this.fetchWords();
            }
        },
        computed: {
            getWordCount(){
                return _size(this.words);
            }
        }
    }
</script>
<style>
    .list-group-item .active {color:#ffffff;}
</style>
