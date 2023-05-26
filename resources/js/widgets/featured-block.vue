<template>
    <div class="card featured-block">
        <div class="featured">
            <img v-if="block.featured_image" :src="`/${block.featured_image}`" :alt="block.title">
            <i v-else class="fas fa-image"></i>
            
        </div>
        <div class="card-body p-4">
            <h3 class="card-title">{{ block.title }}</h3>
            <p>{{ block.body }}</p>
            <router-link class="btn btn-info" v-if="block.menu" :to="block.menu.options && block.menu.options.is_default ? '/' + block.menu.slug : '/page/' + block.menu.slug">{{trans('general.view_more')}}</router-link>
            <a v-if="block.url" :href="block.url" target="_blank" class="btn btn-info">{{trans('general.view_more')}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        props: { 
            block: {
              type: Object,
              default: function () {
                return {}
              }
            }
        },
    }
</script>