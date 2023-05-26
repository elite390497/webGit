<template>
    <div class="row light-grey m-t-80 p-t-80 p-b-60">
        <div class="col-md-12">
            <div class="fix-width fix-width-mobile">
                
                <div class="row justify-content-center">
                    <div :class="getClass" v-if="blocks.length" v-for="block in blocks">
                        <featured-block :block="block"></featured-block>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import FeaturedBlock from '@js/widgets/featured-block'

    export default {
        props: { 
            blocks: {
              type: Array,
              default() {
                return []
              }
            },
            bodyClass: String
        },
        components: {
            FeaturedBlock
        },
        computed: {
            getClass(){
                return this.blocks.length > 1 ? (this.blocks.length > 2 ? "col-12 col-sm-6 col-md-4" : "col-12 col-sm-6") : "col";
            }
        }
    }
</script>