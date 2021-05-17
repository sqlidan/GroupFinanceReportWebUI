import SocketIO from 'socket.io-client'
class SocketClient {
  
  onConnect = () => {}
  onNofound = (sendMsg, receiveUser, cause) => {}
  onDisconnect = (reason) => {}
  constructor() {
    this.client = null
  }

  connect(url) {
    this.client = new SocketIO(url)
    this.initEventHandle()
  }

  initEventHandle() {
    this.client.on('connect', () => {
      console.log('连接成功')
      this.onConnect()
    })
    this.client.on('nofound', (sendMsg, receiveUser, cause) => {
      console.log('接收用户下线')
      this.onNofound(sendMsg, receiveUser, cause)
    })
    this.client.on('disconnect', (reason) => {
      console.log('断开连接')
      this.onDisconnect(reason)
    })

  }
}
export let socketClient = new SocketClient()

