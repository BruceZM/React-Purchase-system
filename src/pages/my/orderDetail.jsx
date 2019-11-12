import React, { useState,useMemo,useEffect,useRef,useCallback } from 'react';
import NavTopBar from '../public/navBar'
import { Toast,ActivityIndicator,NoticeBar,Checkbox } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { Upload } from 'antd';
import { ShowEditModal } from '../../utility/modal'
import { request,reLogin } from '../../utility/request'
import randomNameUpload from '../../utility/randomName'
import QueueAnim from 'rc-queue-anim'
import OrderConfirmItem from '../public/orderConfirmItem'
import qs from 'querystring'
import './order.css'

const OrderDetail = (props) => {
    const [data, setData] = useState({});
    const [count, setCount] = useState(6);
    const [qiniuToken, setQiniuToken] = useState('');
    const [randomUploadName, setRandomUploadName] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalType, setMType] = useState(1);
    const [ifAgree, setIfAgree] = useState(false);
    const key = localStorage.getItem('c_token') || '';
    const OrderID = parseInt(props.location.search.split("=")[1]) || 0;
    const [PayType,setPayType] = useState(1);
    const orderRef = useRef();
    const fileRef = useRef();
    const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    useEffect(() => {
        request({
            url:'Order.OrderDetails',
            method:"POST",
            body:qs.stringify({
                Key:key,
                OrderID
            })
        }).then(function(res){
            console.log(res.data);  
            if(res.flag === 200){
                setData(res.data);
                setLoading(false);
                if(res.data.order_pur){
                    setPayType(res.data.order_pur.pay_step);
                }
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }, [key,OrderID,count])
    //请求七牛token
    useEffect(() => {
        request({
            url:'Order.GetQiniuToken',
            method:"POST",
            body:qs.stringify({
                Key:key
            })
        }).then(function(res){
            console.log(res.data);  
            if(res.flag === 200){
                setQiniuToken(res.data)
            }else{
                Toast.fail(res.msg)
            }
        })
    }, [key])

    const handleCancel = () => {
        setVisible(false)
    }

    const useAgreeMentModal = () => {
        setMType(1)
        setVisible(true);
    }

    const usePayModal = () => {
        setMType(2)
        setVisible(true);
    }

    const doAgree = () => {
        setIfAgree(true);
        setVisible(false)
    }
    const copyOrder = () => {
        console.log(orderRef)
        orderRef.current.select(); // 选择对象
        document.execCommand("Copy"); 
        Toast.info('已复制单号~',1)
    }
    const uploadDoneRequest = (em) => {
        console.log(em)
    }

    const sectionUpdate = () => {
            
        setCount(n=>n+1)
    }
    const uploadProps = useMemo(() => ({
            name: 'file',
            accept:"image/*",
            action: 'http://up.qiniu.com',
            data:{key:'paycheck/'+randomUploadName,token:qiniuToken},
            showUploadList: false,
            multiple:false,
            beforeUpload(val){
                console.log('randomNameUpload',randomNameUpload(val.name));
                setRandomUploadName(randomNameUpload(val.name))
            },
            onChange(info) {
                if (info.file.status === 'done') {
                    let PayVoucher = info.file.response.key;
                    request({
                        url:'Order.OrderPay',
                        method:"POST",
                        body:qs.stringify({
                            Key:key,
                            OrderID,
                            PayType,
                            PayVoucher
                        })
                    }).then(function(res){
                        console.log(res.data);  
                        if(res.flag === 200){
                            Toast.success('上传凭证成功！请等待审核哦~')
                        }else{
                            Toast.fail(res.msg)
                        }
                    })
                } else if (info.file.status === 'error') {
                    Toast.fail('上传失败了~请稍后再试')
                }
            }
        }
    ), [qiniuToken,randomUploadName,PayType,key,OrderID])

    const confirmOrder = useCallback(
        () => {
            if(!ifAgree){
                Toast.info('请先阅读协议内容');return
            }
            setLoading(true);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        },
        [ifAgree],
    )
    return (
        <div style={{paddingTop:45,backgroundColor:'#F4F4F4',minHeight:'100vh',position:'relative'}}>
            <NavTopBar title={"发货单详情"} />
            {
                isIos &&
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                    苹果手机需要双击进行上传操作~
                </NoticeBar>
            }
            <ActivityIndicator
                toast
                text="Loading..."
                animating={loading}
            />

            <QueueAnim animConfig={[
                { opacity: [1, 0], translateY: [0, 50] },
                { opacity: [1, 0], translateY: [0, -50] }]}>
            {
                !loading &&
                <section key="tt">
                    <div className="order-code-detail" style={{backgroundColor:'#fff',color:'#999999',padding:'10px 20px 0 20px',fontWeight:'bold'}}>订单编号：<input type="text" value={data.order_code?data.order_code:''} ref={orderRef} readOnly/><button onClick={copyOrder}>复制</button></div>
                    <div className="order-detail-infos">
                        <ul>
                            <li key="qsf">
                                <span>需支付笔数:</span>
                                <p>{data.order_pur.order_pay.length}笔</p>
                            </li>

                            {
                                data.order_pur.order_pay &&
                                data.order_pur.order_pay.map((item,idx)=>{
                                    let name;
                                    switch (parseInt(item.pay_type)) {
                                        case 1:
                                            name = '定金金额:'
                                            break;
                                        case 2:
                                            name = '货款金额:'
                                        case 3:
                                            name = '尾款金额:'
                                        default:
                                            break;
                                    }
                                    return(
                                        <li key={item.pay_id}>
                                            <span>{name}</span>
                                            <p>
                                                ￥{item.pay_money}元
                                                {parseInt(item.pay_state)===1?"（已支付）":"（未支付）"}
                                            </p>
                                        </li>
                                    )
                                }
                                    
                                )
                            }
                            <li>
                                <span>预计发货时间:</span>
                                <p>{data.order_pur.send_time}</p>
                            </li>
                            <li>
                                <span>邮寄方式:</span>
                                <p>{data.order_pur.express_name}</p>
                            </li>
                            <li>
                                <span>快递费支付:</span>
                                <p>{data.order_pur.express_type}</p>
                            </li>
                            <li>
                                <span>快递费金额:</span>
                                <p>￥{data.order_pur.express_price}</p>
                            </li>
                        </ul>
                        <div className="order-detail-handleBtn">
                            <Link to="/consult_log"><button className="consult-btn">协商记录</button></Link>
                            <div>
                                <button className="paydone-btn" onClick={usePayModal}>立即支付</button>
                                <Upload {...uploadProps}>
                                    <button className="upload-cert-btn">上传凭证</button>
                                </Upload>
                                
                            </div>
                        </div>
                    </div>
                </section>
            }
            
            
            {
                !loading && data.order_basic && data.order_basic.length>0 &&
                data.order_basic.map((item,idx)=>
                    <OrderConfirmItem data={item} key={idx} sectionUpdate={sectionUpdate}/>
                )
            }
            
            
            {
                !loading &&
                <div className="confirm-handle" key='23w'>
                    <div onClick={useAgreeMentModal}><Checkbox checked={ifAgree}></Checkbox><p>我已阅读并同意XXXXXX协议</p></div>
                    <button onClick={confirmOrder}>确认此发货单无误</button>
                </div>
            }

            {
                !loading &&
                <div style={{width:'100%',textAlign:'right',alignSelf:'center'}} className="order-d-bottom-total">
                        
                    <div style={{display:'flex',justifyContent:'flex-end',color:'#333'}}>
                        <span style={{alignSelf:'center'}}>共{data.total_num}件商品</span>
                        <p style={{alignSelf:'center',marginLeft:15,fontSize:16}}>预估总价:<span style={{color:'#C83B4C'}}>{data.order_total}</span></p>
                    </div>
                    <p>不含运费 含采购服务费<span style={{color:'#C83B4C'}}>￥{data.total_sprice}</span></p>
                </div>
            }
            </QueueAnim>
            <ShowEditModal
                visible={visible}
                popupVal={true}
                handleCancel={handleCancel}
                anType="slide-up"
                transparent={false}
                formContent={modalType === 1 ?<AgreeMentWrap doAgree={doAgree}/>:<PaydoneWrap />}
            /> 
        </div>
    )
}
const AgreeMentWrap = (props) => {

    return(
        <div style={{padding:20,height:'75vh',maxHeight:600}}>
            <div style={{margin:'10px 0'}}>
                协议在次在次！协议在次在次！协议在次在次！协议在次在次！协议在次在次！协议在次在次！协议在次在次！协议在次在次！协议在次在次！
            </div>
            <button onClick={props.doAgree} className="agree-protocal">我已阅读并同意协议内容</button>
        </div>
    )
}
const PaydoneWrap = () => {

    const accountRef = useRef();
    const receiverRef = useRef();
    const telRef = useRef();
    const handleCopy = (t) => {
        switch (t) {
            case 1:
                accountRef.current.select();
                break;
            case 2:
                receiverRef.current.select();
                break;
            case 3:
                telRef.current.select();
                break;
            default:
                break;
        }
        document.execCommand("Copy");
        Toast.info('复制成功~',1)
    }
    return (
        <div className="paydone-modal">
            <h2>本次需支付</h2>
            <h3>￥1000</h3>
            <ul>
                <li>
                    <div><span>汇款账户：</span><input type="text" value={'42054102413353500495qwe'} ref={accountRef} readOnly/></div>
                    <button onClick={()=>handleCopy(1)}>复制</button>
                </li>
                <li>
                    所属银行：为让我热发我
                </li>
                <li>
                    <div><span>收款人：</span><input type="text" value={'无法Joe和'} ref={receiverRef} readOnly/></div>
                    <button onClick={()=>handleCopy(2)}>复制</button>
                </li>
                <li>
                    <div><span>电话：</span><input type="text" value={157522097806} ref={telRef} readOnly/></div>
                    <button onClick={()=>handleCopy(3)}>复制</button>
                </li>
            </ul>
            <p>请在打款后上传支付凭证，以便后续工作的顺利进行</p>
        </div>
    )
}
export default OrderDetail