<template>
    <div>
        <tour-notification class="d-none d-sm-inline" />
    	<router-view></router-view>
    </div>
</template>

<script>
    export default {
        methods : {
        },
        mounted() {
        	$('body').removeClass('fix-header fix-sidebar');   // card-no-border can be also be used
            helper.notification();
        },
        destroyed(){
        }
    }
</script>