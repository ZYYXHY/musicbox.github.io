var audio = document.getElementById("audioTag");// 获取音频标签核心对象
var playpause = document.getElementsByClassName("playpause")[0];// 播放/暂停按钮
var recordImg = document.getElementsByClassName("cp-img")[0];// 唱片图片元素（控制旋转）
var body = document.body;// body元素（用于修改背景图）
var musicTitle = document.getElementsByClassName("yymc")[0];// 音乐名称显示元素
var authorName = document.getElementsByClassName("zzmc")[0];// 作者名称显示元素
var beforeMusic = document.getElementsByClassName("before")[0];// 上一首按钮
var nextMusic = document.getElementsByClassName("next")[0];// 下一首按钮
var playTime = document.getElementsByClassName("played-time")[0];// 已播放时间显示元素
var totalTime = document.getElementsByClassName("audio-time")[0];// 音频总时长显示元素
var progressPlayed=document.getElementsByClassName("progress-played")[0];// 已播放进度条元素
var playMode=document.getElementsByClassName("play")[0];// 循环模式按钮
var totleProgress=document.getElementsByClassName("jindutiao")[0];// 总进度条容器
var volumn=document.getElementsByClassName("volumn")[0];// 音量按钮（静音/取消静音）
var volumnTogger=document.getElementById("volumn-togger");// 音量调节滑块
var speed=document.getElementsByClassName("speed")[0];// 倍速显示/切换元素
var listIcon=document.getElementsByClassName("list")[0];// 播放列表按钮
var closeList=document.getElementsByClassName("close-list")[0];// 列表遮罩层（点击关闭列表）
var musicList=document.getElementsByClassName("musicList-container")[0];// 播放列表容器
var musicNameList=document.getElementsByClassName("musics-list")[0];// 列表项父容器（动态生成歌曲列表）
var musicId = 0;// 当前播放音乐的索引（默认第1首）
var musicData = [// 音乐数据列表：[歌曲名称, 作者]
  ["25216950105", "钟宇嫣"],
  ["25216950105", "钟宇嫣"],
  ["25216950105", "钟宇嫣"],
  ["25216950105", "钟宇嫣"],
];
// 初始化音乐
var musicId = 0;
function initMusic() {
  audio.src = `mp3/music${musicId}.mp3`;// 设置音频源（根据索引加载对应mp3文件）
  audio.load();  // 重新加载音频资源
  audio.onloadedmetadata = function () {  // 音频元数据（时长、比特率等）加载完成后执行
    recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`; // 更新唱片封面图
    body.style.backgroundImage = `url('img/bg${musicId}.png')`; // 更新页面背景图
    refreshRotate(); // 重置唱片旋转状态
    musicTitle.innerText = musicData[musicId][0]; // 更新音乐名称显示
    authorName.innerText = musicData[musicId][1];// 更新作者名称显示
    totalTime.innerText = transTime(audio.duration);// 格式化并显示总时长
    audio.currentTime = 0;// 重置播放时间为0
    updateProgrsess(); // 更新进度条和播放时间
  };
}
initMusic();
// 初始化并播放
function initAndPlay() {
  initMusic();
  audio.play();
  playpause.classList.remove("icon-play"); // 切换播放按钮为暂停样式
  playpause.classList.add("icon-pause");
  rotateRecord(); // 启动唱片旋转
}
//暂停播放功能
playpause.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    rotateRecord();
    playpause.classList.remove("icon-play");
    playpause.classList.add("icon-pause");
  } else {
    audio.pause();
    rotateRecordStop();
    playpause.classList.remove("icon-pause");
    playpause.classList.add("icon-play");
  }
});
//唱片旋转
function rotateRecord() {
  recordImg.style.animationPlayState = "running";
}
//让唱片停止旋转
function rotateRecordStop() {
  recordImg.style.animationPlayState = "paused";
}
//刷新唱片旋转角度
function refreshRotate() {
  recordImg.classList.add("rotate-play");
}
//下一首
nextMusic.addEventListener("click", function () {
  musicId++;
  if (musicId >= musicData.length) {
    musicId = 0;
  }
  initAndPlay();
});
//上一首
beforeMusic.addEventListener("click", function () {
  musicId--;
  if (musicId < 0) {
    musicId=musicData.length - 1;
  }
  initAndPlay();
});
//格式化时间
function transTime(value) {
  var hour = parseInt(value / 3600);// 小时
  var minute = parseInt((value % 3600) / 60);// 分钟
  var second = parseInt(value % 60);
  // 超过1小时显示小时数，否则只显示分秒
  if (hour > 0) {
    return `$(hour.toString().padStart(2,'0')):${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }
  return `${minute.toString().padStart(2, "0")}:${second
    .toString()
    .padStart(2, "0")}`;
}
//更新时间和进度条
audio.addEventListener("timeupdate",updateProgrsess);
function updateProgrsess() {
  playTime.innerText = transTime(audio.currentTime); // 更新当前播放时间
  var value=audio.currentTime/audio.duration; // 计算播放进度比例（当前时间/总时长）
  progressPlayed.style.width=value*100+"%";// 更新已播放进度条宽度
}
//循环模式
var modeId=1;
playMode.addEventListener("click",function(){
  modeId++;
  if(modeId>3){
    modeId=1;
  }
  playMode.style.backgroundImage=`url('img/mode${modeId}.png')`;
})
//音乐播放结束时
audio.addEventListener("ended",function(){
  if(modeId==2){
    musicId=(musicId+1)%musicData.length;
  }else if(modeId==3){
    var oldId=musicId;
    while(true){
      musicId=Math.floor(Math.random()*musicData.length);
      if(musicId!=oldId){
        break;
      }
  }
}
initAndPlay();
})
//点击进度条
totleProgress.addEventListener('mousedown',function(event){
  if(!audio.paused||audio.currentTime!=0){
    var pgswidth=totleProgress.
    getBoundingClientRect().width;
    var rate=event.offsetX/pgswidth;
    audio.currentTime=audio.duration*rate;
    updateProgrsess(audio);
  }
});
//音量控制
let lastVolumn=70;
audio.volumn=lastVolumn/100;
//滑动音量调节
// 滑动音量调节
volumnTogger.addEventListener('input', updatevolumn);
function updatevolumn(){
  audio.volume = volumnTogger.value / 100;
}
volumn.addEventListener('click',setNoVolumn);

function setNoVolumn(){
  audio.muted=!audio.muted;  // 切换音频静音状态
  // 静音时记录当前音量，滑块归0，切换静音图标
  if(audio.muted){
    lastVolumn=volumnTogger.value;
    volumnTogger.value=0;
    volumn.style.backgroundImage=`url('img/静音.png')`;
  }else{
      // 取消静音时恢复音量，切换音量图标
    volumnTogger.value=lastVolumn;
    volumn.style.backgroundImage=`url('img/音量.png')`
  }
}
//倍速
speed.addEventListener('click',function(){
  var speedText=speed.innerText;
  if(speedText=='1.0x'){
      speed.innerText='1.5x';
      audio.playbackRate=1.5;
  }else if(speedText=='1.5x'){
      speed.innerText='2.0x';
      audio.playbackRate=2.0;
  }else if(speedText=='2.0x'){
      speed.innerText='0.5x';
      audio.playbackRate=0.5;
  }else if(speedText=='0.5x'){
      speed.innerText='1.0x';
      audio.playbackRate=1.0;
  }
})
//列表
listIcon.addEventListener('click',function(){
  musicList.classList.remove('list-hide');
  musicList.classList.add('list-show');
  closeList.style.display='block';
  musicList.style.display='block';
});
closeList.addEventListener('click',function(){
  musicList.classList.remove('list-show');
  musicList.classList.add('list-hide');
  closeList.style.display='none';
});

//创建列表歌单
function createMusicList(){
  for(let i=0;i<musicData.length;i++){
    //在musicList中创建div元素
    let div=document.createElement('div');
    div.innerText=`${musicData[i][0]}`;
    // add.classList.add('eachMusic');
    musicNameList.appendChild(div);
    div.addEventListener('click',function(){
      musicId=i;
      initAndPlay();
  });
}
}
//加载整个页面元素时触发的事件
document.addEventListener('DOMContentLoaded',createMusicList);