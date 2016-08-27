/**
 * Created by pingbaobei on 2016/7/14.
 */
/*当所有的页面加载完*/
window.onload= function () {
    //执行左边的盒子的滑动
    leftSwifer();
    //执行右边盒子的滑动
    rightSwifer();
}
/*左侧滑动*/
function leftSwifer(){
    /*
     * 1.鼠标滑动的时候touch，左边栏的盒子也会发生滑动
     * 2.滑动区间:往下滑是正的，向上是负的，最小的距离(左边盒子的高度减去ul的高度)
     * 3.当滑动超过0的时候，他就会吸附回去  定位区间
     * 4.当触摸当前的li的时候，当前的盒子会跑到最顶端，并且会添加类样式
     * 5.当定位不够的时候，保持固定的位置
     * */
    /*获取DOM元素*/
//父盒子
    var parentDom = document.querySelector('.jd_cate_left');
//子盒子
    var childDom = document.querySelector("ul");
//需要得到父盒子和子盒子的高度
    var parentHeight = parentDom.offsetHeight;
    var childDomHeight = childDom.offsetHeight;
    /*计算定位区间*/
    var maxPosition = 0;
    var minPosition = parentHeight - childDomHeight;
    console.log('滑动区间:'+minPosition+'-----'+maxPosition);
//缓冲区间(假定往下滑能做大滑到150px)
    var distance = 150;
//滑动区间
    var maxSwiper = maxPosition+distance;
    var minSwiper = minPosition - distance;
    console.log('滑动区间:'+minSwiper+'-----'+maxSwiper);
    //★☀☛★程序的核心点 当前的位置
    var currY = 0;/*初始化的位置，类似轮播图的index*/
    //4.3获得所有的li
    var lis = childDom.querySelectorAll('li');
    /*1.滑动*/
//1.6将公用的方法拷贝过来，加过渡清除过渡
    //增加过渡
    var addTransition = function(){
        childDom.style.transition='all 0.5s';
        childDom.style.webkitTransition='all 0.5s';
    }
    //清除过渡
    var removeTransition = function(){
        childDom.style.transition='none';
        childDom.style.webkitTransition='none';
    }
    //定位,一定要加单位！！！
    var setTranslateY = function (translateY) {
        childDom.style.transform='translateY('+translateY+'px)';
        childDom.style.webkitTransform='translateY('+translateY+'px)';
    }
//1.2 给定初始的坐标
    var startY = 0;
    var moveY = 0;
    var distanceY = 0;/*滑动改变的距离*/
    var isMove = false;
//1.1 滑动有touch事件组成
    childDom.addEventListener('touchstart', function (e) {
        //1.3开始的坐标
        startY = e.touches[0].clientY;
    })
    childDom.addEventListener('touchmove', function (e) {
        //1.4移动开始的坐标
        moveY = e.touches[0].clientY;
        //1.5计算移动的距离
        distanceY = moveY - startY;
        console.log(distanceY);/*通过正负值判断滑动的方向*/
        //1.7清除过渡
        removeTransition();
        //功能点2：在滑动区间内，下面的定位才开始执行
        if((currY+distanceY)>minSwiper && (currY+distanceY)<maxSwiper){
            //1.8定位(衔接到前一次的滑动),只在操作区间内滑动，否则任何操作都不做
            setTranslateY(currY+distanceY);
        }
        //1.11设置已经滑动过了
        isMove = true;
    })
    window.addEventListener('touchend', function (e) {
        //3.滑动超过了最大定位0(maxPosition) 最小定位(minPosition) 需要让它定位回去 吸附 定位区间。除了这两种情况外，其他情况都属于正常情况
        //3.1判断
        if((currY+distanceY)>maxPosition){
            //3.2计算当前的距离
            currY = maxPosition;
            console.log('currY'+currY);
            //3.3加过渡(否则没有动画效果)
            addTransition();
            //3.4定位
            setTranslateY(currY);
        }else if((currY+distanceY)<minPosition){
            currY = minPosition;
            console.log('currY'+currY);
            //3.3加过渡
            addTransition();
            //3.4定位
            setTranslateY();
        }else{
            //正常的情况下，就是之前的距离+移动的距离
            //1.9将滑动的距离记录下来
            currY = currY+distanceY;
        }
        //1.10结束后要重置参数
        startY = 0;
        moveY = 0;
        distanceY = 0;
        isMove = false;
    })
    //4.当触摸当前的li的时候，当前的盒子会跑到最顶端，并且会添加类样式,此时我们在common.js中封装了一个函数
    //4.1tap事件单独绑定在touch事件外面，是在touchend事件结束后发生，在tap事件中直接给ul绑定，性能会更高
    itcast.tap(childDom,function (e) {
        //4.2通过父元素以及父元素以上的元素获取子元素，可以通过target目标元素获得
        /*console.log(e.target.parentNode);*/
        //4.4当前的li
        var currLi = e.target.parentNode;
        //4.5改变当前的样式
        for(var i=0;i<lis.length;i++){
            //4.6所有的li移除样式
            lis[i].classList.remove('now');
            //5.1给每个li记录index
            lis[i].index = i;
        };
        //4.7当前的li增加now样式
        currLi.classList.add('now');
        //5.点击的时候需要定位到顶部，当不满足条件的时候要固定，还要进行判断，点击的是哪个盒子
        //5.2计算点击的盒子将要去定位的位置
        var translateY = -currLi.index*50;
        //5.5此时如果不进行判断，在某一区间进行滑动，就会使得所有的都跑到顶部去，所以我们要进行判断,translateY与currY二选一
        if(translateY>minPosition){
            //5.6滑动的距离就等于要改变的距离
            currY = translateY;
            //5.7增加过渡以及定位
            addTransition();
            setTranslateY(translateY);
        }else{
            currY = minPosition;
            addTransition();
            setTranslateY(currY);
        }
    });
};

function rightSwifer(){
    //右侧滑动，使用插件
    itcast.iScroll({
        swipeDom:document.querySelector('.jd_cate_right'),
        swipeType:'y',
        swipeDistance:100

    });
};
