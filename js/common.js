/**
 * Created by pingbaobei on 2016/7/14.
 */
/*�����ռ� ��ֹ������ͻ*/
window.itcast={};
/*����ģ��,��װһ��transactionEnd����*/
itcast.transactionEnd= function (dom,callback) {
    /*
    * 1.��˭�ӹ��ɽ����¼� DOMԪ��
    * 2.���ɽ�������Ҫ��ʲô���飬�ص�����
    * */
    /*�ڶ����裬�Ƚ����жϣ��Ͻ�*/
    if(!dom || typeof dom !== 'object')return false;/*��������*/
    /*��һ����*/
    dom.addEventListener('transitionEnd', function () {
        /*�������裬����ҵ��ͨ��callback����*/
        callback && callback();
    });/*����*/
    dom.addEventListener('webkitTransitionEnd', function () {
        /*�������裬����ҵ��ͨ��callback����*/
        callback && callback();
    });
}

/*
* touch(start/move/end)�¼���click������:
* 1.touch(start/move/end)�¼� ����click�¼�����
* 2.��move�¼���ʱ�򲻻ᴥ��click�¼�
* 3.click�¼����ƶ��˻���300ms����ʱ
* 4.Ϊ����click�¼����Ĵ���,touch��start��end��ϵ����
* ----����tap�¼�:1.��Ӧ�ٶȱ�click��(150ms����)��2.����������*/
itcast.tap = function(dom,callback){
    //�������ж�
    if(!dom || typeof dom != "object"){
        return false;
    }
    var startTime = 0;
    var isMove = false;
    dom.addEventListener('touchstart', function (e) {
        //�õ���ǰ��ʱ��
        startTime=Date.now();
    });
    dom.addEventListener('touchmove', function (e) {
        isMove =true;
    });
    dom.addEventListener('touchend', function (e) {
        if((Date.now()-startTime)<150 && !isMove){
            callback && callback(e);
        }
        //���ò���
        startTime=0;
        isMove=false;
    })

}
