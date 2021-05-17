<template>
<!-- 
	<section class="app-main" style="min-height: 100%; height: 100%;">
		<transition name="fade" mode="out-in">
			<router-view :key="key"></router-view>
		</transition>
	</section> -->

  <div class="app-main">
    <!-- <template v-if="$route.meta.keepAlive">  -->
      <transition  name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
            <router-view :key="key" ></router-view>
        </keep-alive>
      </transition>
    <!-- </template>
    <template v-else>
      <router-view></router-view>
    </template> -->
	</div>
</template>

<script>
	export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }

    cachedViews(){
      return this.$store.state.app.cachedViews
    },
    key(){
            return this.$route.fullPath
        }
  }
}
</script>
<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  height: calc(100% - 64px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
