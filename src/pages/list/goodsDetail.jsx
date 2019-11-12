import React, { useState, useEffect,useMemo,useRef,useReducer } from 'react';
import { Carousel,WingBlank,WhiteSpace,Checkbox,Stepper,Toast,ActivityIndicator,PullToRefresh } from 'antd-mobile';
import { Icon } from 'antd'; // 加载 JS
import { Link } from 'react-router-dom';
import { ShowEditModal } from '../../utility/modal'
import { request,reLogin } from '../../utility/request'
import { CheckboxGroup,StepperGroup } from '../public/checkboxGroup'
import QueueAnim from 'rc-queue-anim'
import qs from 'querystring'

export default function GoodsDetail(props){

    const [goods_info,setGoodsInfo] = useState({});
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [height, setHeight] = useState(document.documentElement.clientHeight);
    const [count, setCount] = useState(3);
    const [buttonType, setButtonType] = useState(1);
    const serRef = useRef();
    const key = localStorage.getItem('c_token');
    const serReducer = (state, action) => {
        switch (action.id) {
            case 0:
                return action.arr;
            default:
 
                for(var item of state){
                    if(parseInt(item.id) === parseInt(action.id)){
                        item.is_check = action.is_check
                    }
                }
                return state
        }
        
    }
    const [serviceArr,dispatch] = useReducer(serReducer, []);

    useEffect(()=>{
        window.scrollTo(0,0)
        request({
            url:'Selection.GoodsDetails',
            method:"POST",
            body:qs.stringify({
                Key:key,
                GoodsBasicID:parseInt(props.location.search.split("=")[1])
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setGoodsInfo(res.data);
                dispatch({id: 0,arr:res.data.goods_service});
                setRefreshing(false);
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg,1.5,()=>{
                    props.history.goBack()
                })
            }
        })
  
    },[key,count])

    

    const handleAdding = () => {
        setVisible(true);
        setButtonType(1);
    }
    const handleBuyAtNow = () => {
        setVisible(true);
        setButtonType(2);
    }
    const handleCancel = () => {
        setVisible(false)
    }
    
    const serviceClick = (e,id) => {
        dispatch({
            id,
            is_check:e.target.checked
        })
    }

    const refreshFn = () => {
        setRefreshing(true);
        setCount(s=>s+1);
    }
    const skipToOrderConfirm = () => {
        localStorage.setItem('skip_type',2)
        props.history.push('/order_confirm?address_id=0');
    }
    return (
            <>
                <PullToRefresh 
                    refreshing={refreshing} 
                    onRefresh={refreshFn}
                    direction="down"
                    style={{
                        height: height,
                        overflow: 'auto',
                    }}
                >
                {
                    Object.keys(goods_info).length !== 0 ?
                        <QueueAnim style={{paddingBottom:50,position:'relative'}}>
                            <Link to="/">
                                <Icon type="left" size="md" style={{position:'absolute',top:10,left:7,zIndex:322}}/>
                            </Link>
                            <Carousel autoplay infinite key={456}>
                                {goods_info.image_list.map((item,idx) => (
                                    <a
                                    key={idx}
                                    style={{ display: 'inline-block', width: '100%', height: 'auto' }}
                                    >
                                    <img
                                        src={item.goods_image}
                                        alt=""
                                        style={{ width: '100%', verticalAlign: 'top' }}
                                    />
                                    </a>
                                ))}
                            </Carousel>
                            
                            <WingBlank key={78}>
                                <div style={{paddingTop:20,display:'flex',justifyContent:'space-between'}}>
                                    <h4 style={{fontSize:16,width:'75%'}} >{goods_info.goods_basic_info.goods_name}</h4>
                                    <span style={{width:'23%',color:'#9C9C9C',float:'right',fontSize:12,alignSelf:'flex-end'}}>人气：{goods_info.goods_basic_info.sale_num}</span>
                                </div>
                                <ul className="price-tag-wrap">
                                    {
                                    goods_info.goods_price.map((item,idx)=>
                                            <li key={idx}>
                                                <p>￥{item.goods_wholesale_price}</p>
                                                <span>{item.num_begin}件~{item.num_end}件</span>
                                            </li>
                                        )
                                    }
                                </ul>
                            </WingBlank>
                            <WhiteSpace style={{backgroundColor:'#EDEBEB',height:1}} key={63}/>
                            {
                                parseInt(goods_info.goods_basic_info.stock_type) === 2?
                                <WingBlank style={{fontSize:14,height:40,lineHeight:'40px'}}>
                                    此商品支持拆码进货
                                </WingBlank>
                                :<></>
                            }
                            <WhiteSpace style={{backgroundColor:'#EDEBEB',height:1}}/>
                            <WingBlank style={{paddingTop:10}} key={21}>
                                <h5 style={{fontSize:15,fontWeight:'bold'}}>请选择采购服务：</h5>
                                <ul className="cbox-wraper">
                                    {/* <CheckboxGroup goods_service={serviceArr} serviceClick={serviceClick} serviceClick={serviceClick}/> */}
                                    {
                                        serviceArr.map((item,idx)=>
                                            <li key={idx}>{item.name}(+{item.price}元/件)</li>
                                        )
                                    }
                                </ul>
                            </WingBlank>
                            <WhiteSpace style={{backgroundColor:'#F8F8F8'}}/>
                            <WingBlank style={{textAlign:'center',padding:'10px 0'}} key={88}>
                                <h3 className="purchase-remind">进货须知</h3>
                                <div dangerouslySetInnerHTML={{ __html: goods_info.goods_basic_info.goods_notes }} className="goods_detail" />
                            </WingBlank>
                            <WhiteSpace style={{backgroundColor:'#F8F8F8'}}/>            
                            <WingBlank style={{textAlign:'center',padding:'10px 0'}} key={69}>
                                <h3 className="purchase-remind"><Icon type="bars"/>
                                    <span style={{paddingLeft:5}}>详情</span>
                                </h3>
                                <div dangerouslySetInnerHTML={{ __html: goods_info.goods_body }} className="goods_detail" />
                                
                            </WingBlank>
                            

                            <ShowEditModal
                                visible={visible}
                                popupVal={true}
                                handleCancel={handleCancel}
                                anType="slide-up"
                                transparent={false}
                                formContent={<Adding goods_basic_id={goods_info.goods_basic_info.goods_basicid} stock_type={goods_info.goods_basic_info.stock_type} goods_name={goods_info.goods_basic_info.goods_name} goods_image={goods_info.goods_image} goods_price={goods_info.goods_price} handleCancel={handleCancel} buttonType={buttonType}
                                skipToOrderConfirm={skipToOrderConfirm}/>}
                            /> 
                    </QueueAnim>
                    
                    :
                    <div className="loading-example">
                        <ActivityIndicator animating text="稍等哦~" size="large" style={{justifyContent:'center'}}/>
                    </div>
                }
                
            </PullToRefresh>
            <div className="g-fixed-menu">
                <WingBlank className="gg-inside">
                    <Link className="purchase-script" to="/cart">
                        <Icon type="container"/>
                        <span>进货单</span>
                    </Link>
                    <div className='g-btn-group'>
                        <button className="adding-btn" onClick={handleAdding}>加入进货单</button>
                        <button className="purchase-now-btn" onClick={handleBuyAtNow}>立即采购</button>
                    </div>
                </WingBlank>
            </div>
        </>
    )
}

const Adding = (props) => {

    const stockRef = useRef(props.stock_type);
    const [stock_type,setStock_type] = useState(props.stock_type);
    const [GoodsSpec,setGoodsSpec] = useState([]);
    const [GoodsService,setGoodsService] = useState([]);
    const [stockNum,setStockNum] = useState(1);
    const [specNum,setSpecNum] = useState(0);
    const [count,setCount] = useState(0);       //强制计算
    const [specLists,setSpecLists] = useState([]);
    const [stock_begin_num,setStock_begin_num] = useState(0);
    const { goods_basic_id,goods_price,goods_name,goods_image,buttonType } = props ;

    useEffect(()=>{

        let values = {};
        let StockType = 1;
        switch (stock_type) {
            case 0:
                StockType = 1;
                break;
            case 1:
                StockType = 1;
                break;
            case 2:
                StockType = 2;
                break;
            default:
                break;
        }
        Object.assign(values,{Key:localStorage.getItem('c_token')},{GoodsBasicID:goods_basic_id},{StockType:StockType});
        request({
            url:'Selection.GoodsCustom',
            method:"POST",
            body:qs.stringify(values)  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setSpecLists(res.data.spec_list);
                
                setGoodsService(res.data.goods_service);
                if(res.data.stock_num){
                    setStockNum(res.data.stock_num)
                }else{
                    setStockNum(1)                    
                }
                setSpecNum(0);
                setStock_begin_num(parseInt(res.data.stock_begin_num))
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[goods_basic_id,stock_type])

    const memoizedServiceTotal = useMemo(() => {
        let total = 0;
        for(var x = 0;x<GoodsService.length;x++){
            if(parseInt(GoodsService[x].is_check) === 1){
                total += parseInt(GoodsService[x].price)*specNum
            }
        }
        return total?total:'--'
    },
    [specNum,GoodsService,count]);

    const memoizedTotal = useMemo(() => {
        let t = 0
        for(var i = 0;i<goods_price.length;i++){
            if(specNum >= parseInt(goods_price[i].num_begin) && specNum < parseInt(goods_price[i].num_end)){
                t += specNum*parseInt(goods_price[i].goods_wholesale_price)
            }
        }
        if(parseInt(memoizedServiceTotal)){
            return t + memoizedServiceTotal
        }else{
            return t
        }

    },
    [specNum,goods_price,memoizedServiceTotal]);

    const handleServiceChange = (e,id) => {
        let GoodsService_temp = GoodsService;
        for(var i = 0;i<GoodsService_temp.length;i++){
            if(GoodsService_temp[i].id === id){
                GoodsService_temp[i].is_check = e?1:0
            }
        }
        setGoodsService(GoodsService_temp)
        setCount((state)=>state+1)
    }

    const handleForce = (e,gid,cid) => {
        let spec_temp = specLists;
        let specNum_temp = 0;
        for(var i = 0;i<spec_temp.length;i++){
            if(spec_temp[i].goods_id === gid){
                spec_temp[i].goods_num = e
            }
            specNum_temp += parseInt(spec_temp[i].goods_num);
        }
        setSpecLists(spec_temp)
        setSpecNum(specNum_temp)
    }


    const partsSale = () => {
        if(parseInt(stock_type) === 2){
            return false
        }
        setSpecLists([]);
        setStock_type(2);
    }
    const wholeSale = () => {
        if(parseInt(stock_type) === 1){
            return false
        }
        setSpecLists([]);        
        setStock_type(1)
    }

    const handleSubmitAll = (e,type) => {
        
        if(parseInt(stock_begin_num) > parseInt(specNum)){
            Toast.info('不得低于最少购买数量哦~');
            return;
        }
        
        if(parseInt(stock_type)!== 2){
            if(parseInt(specNum) % parseInt(stockNum)!==0){
                Toast.info(`该商品必须整手${stockNum}件购买哦`);
                return
            }
        }
        
        console.log(specLists,specNum,GoodsService,goods_basic_id,stock_type);
        let values = {
            Key:localStorage.getItem('c_token'),
            GoodsBasicID:goods_basic_id,
            GoodsSpec:JSON.stringify(specLists),
            GoodsService:JSON.stringify(GoodsService),
            GoodsNum:specNum,
            StockType:parseInt(stock_type) === 0?1:stock_type
        }
        if(type === 1){
            request({
                url:"Cart.AddCart",
                method:"POST",
                body:qs.stringify(values)  
            }).then(function(res){
                console.log(res.data);
                if(res.flag === 200){
                    Toast.success('下单成功！！',1,()=>{
                        props.handleCancel()
                    });
                }else if(res.flag === 420){
                    reLogin()
                }else{
                    Toast.fail(res.msg)
                }
            })
        }else{
            localStorage.setItem('atOnceBuyInfo',JSON.stringify(values))
            props.skipToOrderConfirm()
        }
        
        
    }
    return (
        <div className="goods-edit-modal">
            <div className="main-goods-edit">
                <div style={{display:'flex',justifyContent:'space-between',height:120,padding:'10px 0',overflow:'hidden'}}>
                    <div style={{width:'25%',borderRadius:6,overflow:'hidden',alignSelf:'center'}}>
                        <img alt="" src={goods_image} style={{width:'100%',borderRadius:6}}/>
                    </div>
                    <div style={{width:'70%',textAlign:'left'}}>
                        <h4 style={{minHeight:40}}>{goods_name}</h4>
                        <ul className="price-tag-wrap" style={{padding:0}}>
                            {
                               goods_price.map((item,idx)=>
                                    <li key={idx}>
                                        <p>￥{item.goods_wholesale_price}</p>
                                        <span>{item.num_begin}件~{item.num_end}件</span>
                                    </li>
                                )
                            }
                        </ul>
                        
                    </div>
                </div>
                <div className="chose-incomes-type">
                    {
                        parseInt(stockRef.current) === 1 &&  
                        <button style={{color:'#C83B4C',width:'100%'}} >整手进货</button>
                    }
                    {
                        parseInt(stockRef.current) === 2 && 
                        <button style={{color:'#44BAAE',width:'100%'}}>拆码进货</button>
                    }
                    {
                        parseInt(stockRef.current) === 0 && 
                        <>
                            <button style={{color:'#C83B4C',width:'49%'}} className="whole-in" onClick={wholeSale}>
                                {
                                    parseInt(stock_type) === 1?<span style={{fontWeight:'bold'}}>整手进货</span>:'整手进货'
                                }
                            </button>
                            <button style={{color:'#44BAAE',width:'50%'}} onClick={partsSale}>
                                {
                                    parseInt(stock_type) === 2?<span style={{fontWeight:'bold'}}>拆码进货</span>:'拆码进货'                            
                                }
                            </button>
                        </>
                    }
                    
                </div>
                    
                {
                    specLists && specLists.length>0?
                    <>
                        <div style={{textAlign:'left',paddingTop:10}}>
                            <h5 style={{fontSize:15,fontWeight:'bold'}}>支持的采购服务：</h5>
                            <ul className="cbox-wraper">
                                <CheckboxGroup goods_service={GoodsService} handleServiceChange={handleServiceChange}/>
                                
                            </ul>
                        </div>
                        <div style={{paddingTop:15}}>
                            <div style={{display:'flex',justifyContent:'space-between'}} className="chose-spec-title">
                                <h5 style={{fontSize:15,fontWeight:'bold',width:'45%'}}>规格</h5>
                                <h5 style={{fontSize:15,fontWeight:'bold',width:'23%'}}>库存</h5>
                                <h5 style={{fontSize:15,fontWeight:'bold',width:'30%'}}>件数</h5>
                            </div>
                            
                            <ul className="chose-spec-wrap">
                                <StepperGroup stock_type={stock_type} specList={specLists} handleForce={handleForce} stockNum={stockNum}/>
                                
                            </ul>
                        </div>
                    </>
                    :
                    <div className="loading-example-two">
                        <ActivityIndicator animating size="large" style={{justifyContent:'center'}}/>
                    </div>
                }
                
            </div>

            
            <div className="goods-sub-fixed">
                <div style={{width:'50%',textAlign:'left',alignSelf:'center'}}>
                    <div style={{display:'flex',justifyContent:'flex-start',color:'#333'}}>
                        <span style={{alignSelf:'center'}}>共{specNum}件</span>
                        <p style={{alignSelf:'center',marginLeft:15,fontSize:18}}>合计:<span style={{color:'#C83B4C'}}>{memoizedTotal}</span></p>
                    </div>
                    <p>采购服务费<span style={{color:'#C83B4C'}}>￥{memoizedServiceTotal}</span></p>
                </div>
                {
                    buttonType === 1?
                    <button className="checked-add-btn" onClick={(e)=>handleSubmitAll(e,1)}>加入进货单</button>
                    :
                    <button className="checked-atonce-btn" onClick={(e)=>handleSubmitAll(e,2)}>立即采购</button>                    
                }
                
            </div>
            
        </div>
    )    
}
