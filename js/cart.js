/**
 * Created by pingbaobei on 2016/7/15.
 */
/*等页面加载完后在进行以下程序*/
window.onload= function () {
    /*删除弹框*/
    popWin();
}
/*删除弹框*/
function popWin(){
    /*
     * 1.点击删除按钮，显示弹出层 display:block
     * 2.弹出框需要动画显示 加类名
     * 3.点击的时候删除按钮需要动画的打开盖子 加过渡和转换
     * 4.点击取消的时候 需要隐藏弹出层和弹出框 隐藏
     * 5.让盖子动画的盖回去 默认就是盖回去，清楚属性
     * */
    /*获取DOM元素*/
    /*删除按钮*/
    var deleteBtns = document.querySelectorAll('.delete_box');
    /*弹出层*/
    var jd_window = document.querySelector('.jd_window');
    /*弹出框*/
    var jd_window_box = document.querySelector('.jd_window_box');
    /*取消按钮*/
    var cancel = document.querySelector('.cancel');
    /*定义up为全局变量*/
    var up = null;
    /*先找到所有的删除按钮，然后通过for循环得到当前的按钮，进行点击事件*/
    for(var i=0;i<deleteBtns.length;i++){
        /*注册事件:点击删除按钮，弹出弹出层，点击取消按钮，隐藏弹出层*/
        deleteBtns[i].onclick= function () {
            /*1.弹出弹出层*/
            jd_window.style.display='block';
            /*2.弹出框动画显示弹出*/
            jd_window_box.classList.add('myBounceInDown');
            /* 3.点击的时候删除按钮需要动画的打开盖子 加过渡和转换*/
            /*找到盖子*/
            up = this.querySelector('.delete_up')
            /*打开盖子---加过渡*/
            up.style.webkitTransition='all 1s';
            up.style.transition='all 1s';
            /*设置旋转原点*/
            up.style.webkitTransformOrigin='0 5px';
            up.style.TransformOrigin='0 5px';
            /*旋转*/
            up.style.webkittransform='rotate(-30deg) translateY(2px)';
            up.style.transform='rotate(-30deg) translateY(2px)';
        }
    }
/*4.点击取消的时候 需要隐藏弹出层和弹出框 隐藏*/
    cancel.onclick= function () {
        jd_window.style.display='none';
        /*判断5.让盖子动画的盖回去 默认就是盖回去，清楚属性*/
        if(up){
            up.style.webkittransform='none';
            up.style.transform='none';
        }

    }




}