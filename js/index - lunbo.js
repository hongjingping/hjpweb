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
    * 1.自动无缝轮播 过渡/定时
    * 2.小圆点跟着移动  改变当前样式
    * 3.手指触摸滑动，放上去，轮播不动，我们滑动的时候，轮播随着滑动 touch/clear
    * 5.当不超过的时候就吸附回去 过渡
    * 4.当滑动距离不超过一定的距离就吸附回去 过渡
    * */
    /*1.获取DOM元素*/
    //banner
    /*大盒子*/
    var banner = document.querySelector('.jd_banner');
    /*大盒子的宽度*/
    var width = banner.offsetWidth;
    /*图片盒子*/
    var imgBox = banner.querySelector('ul:first-child');
    /*点盒子*/
    var pointBox = banner.querySelector('ul:last-child');
    /*2.3索引的点*/
    var points = pointBox.querySelectorAll('li');
    /*公用方法:有加过渡/就有清除过渡/然后就有定位,提高代码的冗余度，将方法放到公用的里面*/
    /*加过渡*/
    var addTransition = function () {
        imgBox.style.transition='all 0.3s';/*兼容性*/
        imgBox.style.webkitTransition='all 0.3s';
    }
    /*清除过渡*/
    var removeTransition = function () {
        imgBox.style.transition='none';/*兼容性*/
        imgBox.style.webkitTransition='none';
    }
    /*定位*/
    var setTranslateX = function (translateX) {
        imgBox.style.webkitTransform='translateX('+(translateX)+'px)';
        imgBox.style.transform='translateX('+(translateX)+'px)';
    }


    /*功能代码*/
    /*1.自动 无缝轮播*/
    var index = 1;
    /*1.1定时器*/
    var timer = setInterval(function () {
        index++;
        /*1.2定位图片盒子 过渡的形式进行定位*/
        /*加过渡--属性值改变才能有动画*/
        //imgBox.style.webkitTransition='all 1s';
        addTransition();
        /*定位*/
        setTranslateX(-index*width);
        /*需要在动画结束后进行判断，进行无缝轮播*/

    },1000);
    /*1.3监听过渡事件，直接调用方法*/
    itcast.transitionEnd(imgBox, function () {
        /*无缝滚动*/
        if(index >= 9){
            index=1;
            /*瞬间定位不需要过渡（清楚过渡），我们要瞬间转化过去*/
            removeTransition();
            /*定位*/
            setTranslateX(-index*width);
        }else if(index <= 0){
            index=8;
            /*瞬间定位不需要过渡（清楚过渡），我们要瞬间转化过去*/
            removeTransition();
            /*定位*/
            setTranslateX(-index*width);
        }
        /*2.2一致保持在1-8*/
        setPoint();
    });
    /*2.点需要做相应的改变*/
    var setPoint = function () {
        /*2.1通过index来判断*/
        /*2.4一致保持在1-8,清楚当前样式，给对应的加上样式*/
        for(var i=0;i<points.length;i++){
            points[i].classList.remove('now');
        }
        points[index-1].classList.add('now');
    }
    /*3.手指触摸滑动，放上去，轮播不动，我们滑动的时候，轮播随着滑动 touch/clear*/
    /*3.1记录开始、移动、结束的点的x轴的坐标，以及距离的改变*/
    var startX = 0;
    var moveX = 0;
    var endX = 0;
    var distanceX = 0;
    /*4.2记录用户是否滑动过*/
    var isMove = false;
    /*6.以上参数相对于某个事件是全局变量，对于某个方法来说就是局部变量，下次使用的时候还存在，所以我们在事件结束后进行重置*/
    imgBox.addEventListener('touchstart', function (e) {
        /*3.2记录开始位子的坐标*/
        startX = e.touches[0].clientX;
        /*3.3清楚定时器*/
        clearInterval(timer);
    });
    imgBox.addEventListener('touchmove', function (e) {
        /*3.6记录滑动的坐标随时改变*/
        moveX = e.touches[0].clientX;
        /*3.7计算滑动的距离，可正可负*/
        distanceX = moveX - startX;
        /*3.8 在滑动的时候轮播图也进行滑动 定位的方式，不需要过渡，是瞬间变化的*/
        /*3.8-1清除过渡*/
        removeTransition();
        /*3.8-2定位*/
        setTranslateX(-index*width+distanceX);/*当前的定位加上改变的距离就是我们将要去的那个位置*/
        /*4.3*/
        isMove = true;

    });
    /*7.最好使用window来监听触摸结束事件*/
    imgBox.addEventListener('touchend', function (e) {
        /* 5.当不超过的时候就吸附回去 过渡
         * 4.当滑动距离不超过一定的距离就吸附回去 过渡*/
        /*4.1假设移动的距离超过1/3就会跳到下一张或者上一张*/
        if(Math.abs(distanceX)>width/3 && isMove){
            /*4.4判断是否超过一定的距离*/
            if(distanceX>0){
                index--;/*上一张*/
            }else{
                index++;/*下一张*/
            }
            /*4.5加过渡*/
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
        }else{
            /*5.不超过一定的距离就吸附回去*/
            /*加过渡*/
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
        }
        startX = 0;
        moveX = 0;
        endX = 0;
        distanceX = 0;
        /*4.2记录用户是否滑动过*/
        isMove = false;

        /*3.5严谨起见，再次清除定时器*/
        clearInterval(timer);
        /*3.4加上定时器*/
        timer = setInterval(function () {
            index++;
            /*1.2定位图片盒子 过渡的形式进行定位*/
            /*加过渡--属性值改变才能有动画*/
            //imgBox.style.webkitTransition='all 1s';
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
            /*需要在动画结束后进行判断，进行无缝轮播*/
        },1000);
    });
}
/*倒计时*/
function downTime(){
    /*
    * 1.需要后台给时间
    * 2.每一秒改变6个盒子*/
    /*1.获取DOM元素*/
    /*时间盒子*/
    var skTime = document.querySelector('.sk_time')
    /*获取每一个span*/
    var spans = skTime.querySelectorAll('span');
    /*假设一个事件*/
    var time = 4*60*60;
    var timer = setInterval(function () {
        time--;
        /*判断:必须时间大于0*/
        if(time<=0){
            return false;
        }
        /*3.格式化时间*/
        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = time%60;
        /*2.操作DOM，时间继续往下走*/
        spans[0].innerHTML=Math.floor(h/10);
        spans[1].innerHTML=h%10;
        spans[3].innerHTML=Math.floor(m/10);
        spans[4].innerHTML=m%10;
        spans[6].innerHTML=Math.floor(s/10);
        spans[7].innerHTML=s%10;

    },1000);
}