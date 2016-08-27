/**
 * Created by pingbaobei on 2016/7/14.
 */
/*页面加载完成*/
window.onload=function(){
    /*搜索效果*/
    search();
    /*轮播图*/
    banner();
    /*倒计时*/
    downTime();
}
/*搜索效果*/
function search(){
    /*
     * 1.导航条默认是透明的（在CSS中设置）
     * 2.导航条随着页面向下/向上滑动，颜色不断加深或者变浅，
     * 3.到页面滑出banner的时候，颜色不在发生变化
     * */
    /*1.获取相关的DOM对象*/
    var search = document.querySelector('.jd_header_box');
    var banner = document.querySelector('.jd_banner');
    //获取轮播图的高度
    var height = banner.offsetHeight;
    /*2.监听页面滑动*/
    window.onscroll= function () {
        //2.1监听滑动的距离是否超出了banner的高度
        //获取页面滑下来的距离
        var top = document.body.scrollTop;/*谷歌的写法，IE的写法 document.documentElement.scrollTop*/
        //定义默认的透明度
        var opacity = 0;
        if(top>height){
            opacity = 0.85;
        }else{
            //透明度的变化(滑动的距离/总的距离)*最大透明度
            opacity = 0.85*(top/height);
        }
        //操作DOM
        search.style.backgroundColor="rgba(201,21,35,0"+opacity+")";
    }
}
/*轮播图*/
function banner(){
    /*
     * 1.自动轮播 无缝轮播 过渡来做动画，每过一段时间就会移动  -----定时
     * 2.小圆点随着图片的变化而改变 -------改变当前样式
     * 3手触摸屏幕的时候，轮播图片停下 ；当手指左右滑动的时候，轮播图片也会随之滑动 --------touch clear
     * 4.当手指滑动不超过一定的距离，图片就要吸附回去 ------过渡
     * 5.当超过一定距离的时候，会跳到上一张或者下一张-----过渡
     * */
    /*第一步:获取DOM元素*/
    //大盒子
    var banner = document.querySelector('.jd_banner');
    //盒子的宽度
    var width = banner.offsetWidth;
    //图片的盒子
    var imageBox =banner.querySelector('ul:first-child');
    //点盒子
    var pointBox = banner.querySelector('ul:last-child');
    //所有的点
    var points = pointBox.querySelectorAll('li');
    /*2.15 公用方法,写完后分别将下面的一段一段的代码替换成封装的方法---但是每次写都需要调用，还是代码很多，无法优化，所以我们可以在common.js中封装一个函数，直接调用一次就好了.*/
    /*公用方法1:只要有加过渡就有清楚过渡*/
    var addTransition = function () {
        imageBox.style.webkitTransition = 'all 0.3s';/*兼容性*/
        imageBox.style.transition = 'all 0.3s';
    }
    /*公用方法2:清楚过渡*/
    var removeTransition = function () {
        imageBox.style.webkitTransition = 'none';/*兼容性*/
        imageBox.style.transition = 'none';
    }
    /*公用方法3:定位,传递参数，直接使用translateX*/
    var setTranslateX = function (translateX) {
        imageBox.style.webkitTransform='translateX('+translateX+'px)';
        imageBox.style.transform='translateX('+translateX+'px)';
    }
    /*功能代码*/

    /*第二步:自动轮播 且是无缝*/
    //1.默认索引（默认显示第一张图片）
    var index = 1;
    //2.定时器
    var timer = setInterval(function () {
        //2.1过了2秒，图片往下走
        index ++;
        /*2.2定位图片盒子 过渡的形式来定位*/
        /*2.3给图片盒子加过渡*/
        imageBox.style.webkitTransition = 'all 1s';/*兼容性*/
        /*imageBox.style.transition = 'all 1s';改成下面的代码，直接调用*/
        addTransition();
        /*2.4定位*/
        /*imageBox.style.webkitTransform='translateX('+(-index*width)+'px)';
         imageBox.style.transform='translateX('+(-index*width)+'px)';改成直接使用定位的函数*/
        setTranslateX(-index*width);
        /*2.5到了此位置，最后会跳出一张空白的:等我们动画结束之后再去无缝衔接，否则动画没有结束就跳到下一张，这样子不合理。所以我们需要在动画结束后进行判断*/

    },2000);
    /*2.16监听过渡结束事件，我们封装了common.js的方法，可以直接将下面的两段代码注释，用一个方法即可*/
    itcast.transactionEnd(imageBox, function () {
        //无缝滚动
        if(index>=9){
            index =1;
            /*清楚过渡*/
            removeTransition();
            /*定位*/
            setTranslateX(-index*width);
        }else if(index<=0){
            index = 8;
            /*清楚过渡*/
            removeTransition();
            /*定位*/
            setTranslateX(-index*width);
        };
        /*3.2索引就保持保持在1-8之间*/
        setPoint();
    })
    /*   /!*2.6监听过渡结束事件，注意兼容性,每动一次咱就监听一次*!/
     imageBox.addEventListener('transitionEnd', function () {
     if(index>=9){
     index =1;
     removeTransition();
     setTranslateX(-index*width);
     }else if(index<=0){
     index = 8;
     removeTransition();
     setTranslateX(-index*width);
     }
     /!*2.14兼容性，直接将下面的代码拷贝过来，但是因为考虑到代码的冗余度，咱们需要将代码抽出来，进行封装*!/
     });
     imageBox.addEventListener('webkitTransitionEnd', function () {
     /!*2.7做无缝滚动,滑动最后一张图片的时候，索引为9，当索引为9的图片做完动画后，瞬间定位到索引为1的那一张；当我们滑动到最后一张的时候(索引为0)，瞬间定位到索引为8的图片*!/
     if(index>=9){
     /!*2.8瞬间定位到第一张*!/
     index = 1;
     /!*2.9瞬间定位不需要过渡，所以我们需要清除过渡*!/
     /!*imageBox.style.webkitTransition = 'none';/!*兼容性*!/
     imageBox.style.transition = 'none';改成调用函数*!/
     removeTransition();
     /!*2.10 定位,index会贯穿整个程序*!/
     /!*imageBox.style.webkitTransform='translateX('+(-index*width)+'px)';
     imageBox.style.transform='translateX('+(-index*width)+'px)';直接使用定位的公用方法*!/
     setTranslateX(-index*width);
     }else if(index <=0){
     /!*瞬间定位到第8张*!/
     index = 8;
     /!*!/!*2.11瞬间定位不需要过渡，所以我们需要清除过渡*!/
     imageBox.style.webkitTransition = 'none';/!*兼容性*!/
     imageBox.style.transition = 'none';直接使用清楚过渡的方法*!/
     removeTransition();
     /!*2.12 定位,index会贯穿整个程序*!/
     /!* imageBox.style.webkitTransform='translateX('+(-index*width)+'px)';
     imageBox.style.transform='translateX('+(-index*width)+'px)';直接使用定位的方法*!/
     setTranslateX(-index*width);
     /!*2.13只有这两种情况需要进行直接定位，所以写在判断条件里面*!/
     }

     });
     //*/
    //第三步，小圆点随着图片的变化而改变 -------改变当前样式
    /*直接封装成一个方法,所有为0的时候，点应该为第8个点，索引为1的时候，应该是第一张图片*/
    var setPoint = function () {
        /*3.1通过index来判断,轮播图是从第一张到第8张之间来回做运动，在第二个步骤在2.7步骤的判断之前索引是0-9，2.7步骤结束的时候，索引就保持保持在1-8之间，但是我们的点的索引是0-7*/
        /*3.3获取所有的点*/
        /*3.4清楚所有的样式*/
        for(var i=0;i<points.length;i++){
            points[i].classList.remove('now');
            /*points[i].className='';*/
        }
        /*给对应的点加上样式*/
        points[index-1].classList.add('now');
    }
    //第四部:当手指滑动不超过一定的距离，图片就要吸附回去 ------过渡
    /*4.2记录刚刚触摸到屏幕的时候的那个点的X轴的坐标
     * 记录移动的时候那个点的X轴的坐标*/
    var startX = 0;
    var moveX = 0;
    var endX = 0;
    var distanceX = 0;/*改变的距离*/
    /*5.3*/
    var isMove = false;/*记录用户是否滑动过*/
    /*4.1注册touch事件*/
    imageBox.addEventListener('touchstart', function (e) {
        /*4.3记录开始的点的坐标*/
        startX = e.touches[0].clientX;
        /*4.4清楚定时器*/
        clearInterval(timer);

    });
    imageBox.addEventListener('touchmove', function (e) {
        /*4.7记录滑动的时候X的坐标，会随时改变*/
        moveX = e.touches[0].clientX;
        /*4.8计算滑动的距离 数值 可以为负(右往左滑)或者为正(左往右滑)*/
        /*distance的正负可以判断出滑动的方向 */
        distanceX = moveX -startX;
        /*4.9在滑动的时候轮播图也是需要滑动的  通过定位的方式来实现*/
        /*在4.9之前我们需要清除过渡*/
        removeTransition();
        /*在4.9之前我们需要清除过渡，然后定位*/
        setTranslateX(-index*width+distanceX);/*当前的定位加上改变的距离就是将要去的那个位置*/
        /*5.4*/
        isMove=true;
        console.log(distanceX);



    });
    /*touchend,最好使用window来监听，否则模拟器会出现问题，会将事件丢失，真机上是没有问题的，因为我们的touch事件最终会通过冒泡*/
    imageBox.addEventListener('touchend', function (e) {
        /*第五步.当手指滑动不超过一定的距离，图片就要吸附回去 ------过渡，只有手指松开后才可以吸附和跳转，假定为1/3
         * 第六步.当超过一定距离的时候，会跳到上一张或者下一张-----过渡*/
        /*5.1 distanceX正负不确定，所以我们取绝对值*/
        /*5.2 此时我们要判断是否移动，否则就不会产生以下事件isMove,在全局定义var isMove是否移动，在move事件中判断是否滑动*/
        if(Math.abs(distanceX)>width/3){
            //5.5超过一定的距离 需要跳到上一张或者下一张
            if(distanceX>0){
                index --;/*上一张*/
            }else{
                index++;/*下一张*/
            }
            /*5.6加过渡，定位*/
            addTransition();
            setTranslateX(-index*width);
        }else{
            /*5.7 吸附回去定位回去*/
            addTransition();
            setTranslateX(-index*width);
        }

        /*5.8 因为4.2步骤中的参数对于事件来说是全局变量，对于方法来说是局部变量，所以我们在下一次操作之前将他重置*/
        var startX = 0;
        var moveX = 0;
        var endX = 0;/*没有用到，在move的时候我们就将distance算出来了*/
        var distanceX = 0;/*改变的距离*/
        var isMove = false;/*记录用户是否滑动过*/

        /*4.6为了严谨起见，在进行排除一次,排除定时器的累加*/
        clearInterval(timer);
        /*4.5结束后还要加上定时器,直接将步骤2中的定时器拷过来*/
        timer = setInterval(function () {
            index ++;
            imageBox.style.webkitTransition = 'all 1s';/*兼容性*/
            addTransition();
            setTranslateX(-index*width);
        },2000);


    });


}
/*倒计时*/
function downTime(){

}