let socket_url = 'http://localhost:8070'
const JOYSTICK = 'joystick'
const JOYSTICK_HOLD = 'joystick_hold'
const DECIMAL_DIGITS = 100
let angleOffset = 0
let statusText = document.getElementById("socket-status")

let socket = io.connect(socket_url)
registerEvent()

function reconnection(url){
  console.log('reco url>', url)
  if(url.length>5){
    statusText.innerText = '重新连接'
    socket.close()
    socket = io.connect(url)
    registerEvent()
  }
}

function registerEvent(){

  socket.emit('reply', { my: 'data' })

  socket.on('connected', function (data) {
    statusText.innerText = '连接成功'
    console.log('connected')
    console.log(data)
  })

  socket.on('connect_error', (error) => {
    console.log('error>',error)
    statusText.innerText = '连接出错'
  });
 
  socket.on('disconnect', (reason) => {
    console.log('disconnect');
    statusText.innerText = '断开连接'
  });

}

function resetAngleOffset(offset){
  offset = parseInt(offset)
  if(!isNaN(offset) && typeof offset === 'number'){
    angleOffset = offset
  }else{
    angleOffset = 0
  }
}


function decimal_cut(num){
  return Math.round(num * DECIMAL_DIGITS)/DECIMAL_DIGITS
}

function angle(x, y){
  if(x !== 0 && y !== 0){
    if(x > 0 && y > 0){
      return Math.atan(y/x) * 180 / Math.PI
    }else if(x < 0 && y > 0){
      return 180 - Math.atan(y/-x) * 180 / Math.PI
    }else if(x < 0 && y < 0){
      return 180 + Math.atan(y/x) * 180 / Math.PI
    }else if(x > 0 && y < 0){
      return 360 - Math.atan(-y/x) * 180 / Math.PI
    }else{
      console.log('未知参数')
      return 0
    }
  }else if( x ===0 && y === 0){
    return null
  }else if(x === 0){
    return y > 0 ? 90 : 270
  }else if( y === 0){
    return x > 0 ? 0 : 180
  }
}

function distance(x, y){
  return Math.sqrt(x*x + y*y)
}

function sendData(x, y){
  let data1 = angle(x, y)
  let data2 = distance(x, y)
  data1 = decimal_cut(data1) + angleOffset
  data2 = decimal_cut(data2)
  console.log('angle >', data1, 'distance >', data2)
  return [data1, data2]
}

function sendJoystick(x, y){
  x = decimal_cut(x)
  y = decimal_cut(-y)
  socket.emit(JOYSTICK, sendData(x, y))
}

function sendJoystickHold(x, y){
  x = decimal_cut(x)
  y = decimal_cut(-y)
  console.log('---x>', x, 'y>', y)
  socket.emit(JOYSTICK_HOLD, sendData(x, y))
}