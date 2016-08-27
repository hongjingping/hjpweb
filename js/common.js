/**
 * Created by pingbaobei on 2016/7/14.
 */
/*命名空间 防止命名冲突*/
window.itcast={};
/*区分模块,封装一个transactionEnd方法*/
itcast.transactionEnd= function (dom,callback) {
    /*
    * 1.给谁加过渡结束事件 DOM元素
    * 2.过渡结束后需要干什么事情，回调函数
    * */
    /*第二步骤，先进性判断，严谨*/
    if(!dom || typeof dom !== 'object')return false;/*基本对象*/
    /*第一步骤*/
    dom.addEventListener('transitionEnd', function () {
        /*第三步骤，处理业务，通过callback处理*/
        callback && callback();
    });/*兼容*/
    dom.addEventListener('webkitTransitionEnd', function () {
        /*第三步骤，处理业务，通过callback处理*/
        callback && callback();
    });
}

/*
* touch(start/move/end)事件与click的区别:
* 1.touch(start/move/end)事件 先于click事件触发
* 2.有move事件的时候不会触发click事件
* 3.click事件在移动端会有300ms的延时
* 4.为了让click事件最快的触发,touch的start和end组合到最快
* ----就是tap事件:1.响应速度比click快(150ms左右)，2.不经过滑动*/
itcast.tap = function(dom,callback){
    //基本的判断
    if(!dom || typeof dom != "object"){
        return false;
    }
    var startTime = 0;
    var isMove = false;
    dom.addEventListener('touchstart', function (e) {
        //得到当前的时间
        startTime=Date.now();
    });
    dom.addEventListener('touchmove', function (e) {
        isMove =true;
    });
    dom.addEventListener('touchend', function (e) {
        if((Date.now()-startTime)<150 && !isMove){
            callback && callback(e);
        }
        //重置参数
        startTime=0;
        isMove=false;
    })

}
