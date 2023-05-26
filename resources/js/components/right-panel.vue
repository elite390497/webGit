<template>
    <div class="right-sidebar">
        <div class="slimscrollright">
            <div class="rpanel-title"> 
                {{trans('general.help')}} 
                <button class="btn btn-danger btn-sm right-sidebar-toggle pull-right m-r-10"><i class="fas fa-times"></i></button>
            </div>
            <div class="r-panel-body"> 
                <div v-if="content" v-html="content"></div>
                <div v-if="loading" class="loading"><img src="/images/loading.gif"></div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		props: ['topic'],
		data(){
			return {
				content: '',
				loading: false
			}
		},
		mounted(){

		},
		methods: {
			fetchContent() {
				axios.post('/api/help/content',{topic: this.topic})
					.then(response => {
						this.content = response;
						this.loading = false;
					})
					.catch(error => {
						this.loading = false;
						helper.showErrorMsg(error);
					})
				
			}
		},
		watch: {
			topic(val){
				if (val) {
					this.loading = true;
                    this.fetchContent();
				}
				else 
					this.content = '';
			}
		}
	}
</script>

<style>
	.loading{
		display: flex;
	    justify-content: center;
	    align-items: center;
	}
    .shw-rside{
        width: 500px;
    }
</style>