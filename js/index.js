window.onload = function(){ 
  let saveUrlBtn = document.getElementById("save-url-btn"); 
  saveUrlBtn.onclick = function(){ 
    let url = document.getElementById("connect-url").value
    reconnection(url)
  } 

  let saveAngleOffsetBtn = document.getElementById("angle-offset-btn")
  saveAngleOffsetBtn.onclick = function(){
    let offset = document.getElementById("angle-offset").value
    console.log('offset>', offset)
    resetAngleOffset(offset)
  }
 
 }