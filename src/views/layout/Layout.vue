<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Stomp from 'stompjs'
  import { Navbar, Sidebar, AppMain } from 'views/layout';
  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
		},
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
			},
			...mapGetters([
				'userId',
			])
		},
		data () {
			return {
				sock: undefined,
				stomp: undefined, //Stomp.over(this.sock),
				msg: undefined,
				exchangePath: undefined
			}
		},
		created () {
			//this.reconnect();
		},
		methods: {
			onConnected: function (frame) {
				this.exchangePath = `/exchange/userNotify/${this.userId}`
				if (this.stomp) {
					this.stomp.subscribe(this.exchangePath, this.onmessage)
				}
			},
			onError: function (frame) {
				//错误信息
				console.error('onError: ' + frame)
				this.reconnect();
			},
			onmessage: function (frame) {
				//接收消息
				if (frame.headers.destination == this.exchangePath || frame.headers.destination == '/exchange/userNotify') {
					if (frame.headers.destination == this.exchangePath) {
						this.$notify.info({
							title: '消息',
							message: frame.body,
							duration: 2000
						});
					} else {
						if (frame.body.length > 20) {
							this.$notify.info({
								title: '系统消息',
								message: `${frame.body.substr(0,20)}...，详情请到消息中心查看。`,
								duration: 0
							});
						} else {
							this.$notify.info({
								title: '系统消息',
								message: frame.body,
								duration: 0
							});
						}
					}
					this.$store.dispatch('GetMessage');
				}
			},
			reconnect () {
				this.sock = new WebSocket('ws://10.35.5.123:15674/ws');
				this.stomp = Stomp.over(this.sock);
				this.stomp.heartbeat.outgoing = 0;
				this.stomp.heartbeat.incoming = 0;
				this.connect();
			},
			connect: function () {
				//连接服务器
				if (this.stomp) {
					this.stomp.connect('customer', 'customer', this.onConnected, this.onError);
				}
			},
		}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
	// .app-wrapper {
	// 	@include clearfix;
	// 	position: relative;
	// 	height: 100%;
	// 	width: 100%;
	// 	&.hideSidebar {
	// 		.sidebar-container{
	// 			transition: width 0.28s;
	// 			width:54px;
        		
    //   		}
			
	// 		.main-container {
	// 			margin-left: 54px;
	// 			transition: margin-left .28s;
	// 		}
	// 	}
	// 	.sidebar-container {
	// 		transition: width 0.28s;
	// 		width: 210px;
	// 		height: 100%;
	// 		position: fixed;
	// 		top: 0;
	// 		bottom: 0;
	// 		left: 0;
	// 		z-index: 1001;
	// 		overflow-y: auto;
 	// 		&::-webkit-scrollbar {display:none}
	// 	}
	// 	.main-container {
	// 		min-height: 100%;
	// 		transition: margin-left 0.28s;
	// 		margin-left: 210px;
	// 		height: 100%;
	// 	}
	//}
</style>
