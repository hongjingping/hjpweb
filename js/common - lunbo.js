/**
 * Created by pingbaobei on 2016/7/14.
 */
/*命名空间 防止命名冲突*/
window.itcast={};
/*区分模块*//*监听过渡结束事件，因为有浏览器兼容问题，需要写两遍，所以我们直接封装一个函数*/
itcast.transitionEnd= function (dom,callback) {
    /*
     * 1.给谁加过渡结束事件
     * 2.过渡结束后我们需要做什么事情
     * */
    if(!dom || typeof dom != "object") return false;
    dom.addEventListener('transitionEnd', function () {
        /*处理业务*/
        callback && callback();
    });
    dom.addEventListener('webkitTransitionEnd', function () {
        /*处理业务*/
        callback && callback();
    })
}