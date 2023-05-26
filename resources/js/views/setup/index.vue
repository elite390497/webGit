<template>
  <div class="container-fluid">
      <div class="card">
          <div class="card-body">
              <button type="button" v-tooltip="trans('configuration.hide_setup_wizard')" @click="hideSetupWizard" class="btn btn-danger pull-right m-2"><i class="fa fa-times"></i></button>
              <div class="clearfix"></div>

              <form-wizard color="#55CE63" :title="trans('configuration.setup_title')" :subtitle="trans('configuration.setup_subtitle')" :nextButtonText="trans('configuration.setup_next_button_content')" :backButtonText="trans('configuration.setup_previous_button_content')" :finishButtonText="trans('configuration.setup_finish_button_content')" @on-complete="finish">
                  <tab-content :title="trans('configuration.basic_configuration')" :before-change="storeBasicConfiguration">
                    <basic-configuration-form :setup-wizard="true" class="m-b-20" ref="basic" :configurations="configurations"></basic-configuration-form>
                 </tab-content>
                 <tab-content :title="trans('configuration.system_configuration')" :before-change="storeSystemConfiguration">
                    <system-configuration-form :setup-wizard="true" class="m-b-20" ref="system" :configurations="configurations"></system-configuration-form>
                 </tab-content>
                 <tab-content :title="trans('configuration.mail_configuration')" :before-change="storeMailConfiguration">
                    <mail-configuration-form :setup-wizard="true" class="m-b-20" ref="mail" :configurations="configurations"></mail-configuration-form>
                 </tab-content>
                 <tab-content :title="trans('configuration.menu_configuration')" :before-change="storeMenuConfiguration">
                    <menu-configuration-form :setup-wizard="true" class="m-b-20" ref="menu" :configurations="configurations"></menu-configuration-form>
                 </tab-content>
                 <tab-content :title="trans('academic.academic_session')">
                    <academic-session-form :setup-wizard="true" class="m-b-20" ref="session"></academic-session-form>
                 </tab-content>
              </form-wizard>
          </div>
      </div>
  </div>
</template>

<script>
    import basicConfigurationForm from '../configuration/basic/form'
    import systemConfigurationForm from '../configuration/system/form'
    import mailConfigurationForm from '../configuration/mail/form'
    import menuConfigurationForm from '../configuration/menu/form'
    import academicSessionForm from '../academic/session/form'
    
    export default {
        components: {basicConfigurationForm,systemConfigurationForm,mailConfigurationForm,academicSessionForm,menuConfigurationForm},
        methods: {
        },
        data() {
            return {
              configurations: []
            }
        },
        mounted(){
            if(this.$route.query.reload)
                window.location = window.location.pathname;

            if(!helper.hasRole('admin') || !helper.getConfig('setup_wizard'))
              this.$router.push('/dashboard');

            this.getConfiguration();
        },
        methods: {
          getConfiguration(){
              let loader = this.$loading.show();
              axios.get('/api/configuration')
                  .then(response => {
                      this.configurations = response;
                      loader.hide();
                  }).catch(error => {
                      loader.hide();
                      helper.showErrorMsg(error);
                  });
          },
          hideSetupWizard(){
            let loader = this.$loading.show();
            axios.post('/api/setup/wizard', {action: 'hide'})
              .then(response => {
                loader.hide();
                this.$router.push('/dashboard');
              })
              .catch(error => {
                loader.hide();
                helper.showErrorMsg(error);
              })
          },
          storeBasicConfiguration(){
            return this.$refs.basic.submit();
          },
          storeSystemConfiguration(){
            return this.$refs.system.submit();
          },
          storeMailConfiguration(){
            return this.$refs.mail.submit();
          },
          storeMenuConfiguration(){
            return this.$refs.menu.submit();
          },
          finish(){
            this.$refs.session.store();
          }
        },
        watch: {
        }
    }
</script>
