<template>
  <notifications  group="demo"  
                  position="top right" 
                  class="tour-notification" 
                  width="370px" >
    <template slot="body" slot-scope="props">
      <div>
          <h4 class="heading" v-html="props.item.title.heading">
          </h4>
          <h5 v-if="props.item.title.subheading" class="subheading" v-html="props.item.title.subheading">
          </h5>
          <div class="content" v-html="props.item.text">
          </div>
          <div class="actions">
            <a class="btn btn-close" @click="props.close">
              <i class="fas fa-times"></i> Close
            </a>
            <a v-if="props.item.title.nextUrl" class="btn btn-next" @click="next(props.item.title.nextUrl)">
              <i class="fas fa-chevron-right"></i> Next
            </a>
          </div>
          <div class="actions" v-if="!props.item.title.disableCloseForever">
            <a class="btn btn-close-forever" @click="closeForever">
              <i class="fas fa-bell-slash"></i> Close Forever
            </a>
          </div>
      </div>
    </template>
  </notifications>
</template>

<script>
  export default {
    methods: {
      closeForever() {
        this.$cookie.set('hide_instikit_tour',helper.randomString(20) , 1);
        this.$notify({
          group: 'demo',
          clean: true
        })
      },
      next(url) {
        this.$notify({
          group: 'demo',
          clean: true
        });

        this.$router.push(url);
      }
    }
  }
</script>

<style lang="scss">
  .tour-notification {
    margin: 85px 15px 10px;

    .notification-wrapper{
      padding: 15px 20px;
      font-size: 14px;
      color: #ffffff;
      background: #131416;
      border-left: 10px solid #e40b5b;
      border-radius: 10px;
      box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.5), 0 1px 5px 0 rgba(0, 0, 0, 0.7);

      .heading {
        font-size: 20px;
        line-height: 26px;
        color: inherit;
        padding-left: 0;
        padding-bottom: 10px;
        border-bottom: 1px dotted rgba(255,255,255,0.2);
        margin-bottom: 15px;
      }

      .subheading {
        font-weight: 400;
        color: inherit;
        font-size: 18px;
        line-height: 22px;
        margin-bottom: 15px;
      }

      .content {
        font-size: 110%;
        margin-bottom: 10px;
        p {
          margin-bottom: 0;
          & + p {
            margin-top: 10px;
          }
        }
      }

      .actions {
        display: flex;
        flex-wrap: wrap;

        .btn {
          flex-grow: 1;
          margin-top: 5px;
          background: #535456;
          transition: all 0.2s ease-in-out;
            
          i {
            margin-right: 5px;
          }

          & + .btn {
            margin-left: 10px;
          }

          &:hover {
            background: #737476;
          }

          &:active {
            background: #333436;
          }

          &.btn-close-forever {
            display: block;
            margin-left: 0;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>