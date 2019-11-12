import React, { useState,useEffect,useRef,useMemo } from 'react';
import { createForm } from 'rc-form';
import { List, InputItem, WhiteSpace,Picker,Switch,Toast,ActivityIndicator } from 'antd-mobile';
import NavTopBar from '../public/navBar'
import './address.css'
import { request,reLogin } from '../../utility/request'
import qs from 'querystring'

const district = require('./district.json');

class PickTest extends React.Component {    //省市区选择组件
    state = {
        finalVal : this.props.area
    };
    onOk = (v) => {
        this.setState({
            finalVal:v
        })
        this.props.handleAreaChange(v)
    }
    render(){
        //const { getFieldProps } = this.props.form;
        const { area } = this.props;
        return (
            <Picker extra="省/市/区"
                data={district}
                onOk={this.onOk}
                title="地区选择"
                value={area}
                itemStyle={{flexBasis:'60%'}}
                onDismiss={e => console.log('dismiss', e)}
                // {...getFieldProps('district', {
                //     initialValue: area,
                // })}
            >
            <List.Item arrow="horizontal">地址: </List.Item>
          </Picker>
        )
    }
    
}
//const PickTest = createForm()(PickTest);

const AddressEdit = (props) => {
    const key = localStorage.getItem('c_token') || '';   
    const [loading,setLoading] = useState(true);
    const [ifDone,setIfDone] = useState(true);
    const [MemberName,setName] = useState('');
    const [MemberPhone,setTel] = useState();
    const [area,setArea] = useState([]);
    const [detailAddress,setDetailAddress] = useState('');
    const [if_default,setIf_def] = useState(false);
    const pickerRef = useRef();
    const a_id = parseInt(props.location.search.split("=")[1]) || 0;
    
    const handleAreaChange = (val) => {
        setArea(val)
    }

    useEffect(()=>{
        if(a_id >0){
            request({
                url:'Buy.OneAddressInfo',
                method:"POST",
                body:qs.stringify({
                    Key:key,
                    AddressId:a_id
                })  
            }).then(function(res){
                console.log(res);
                if(res.flag === 200){
                    setName(res.data.full_name);
                    setTel(res.data.telphone);
                    setIf_def(parseInt(res.data.is_default)===1?true:false);
                    setDetailAddress(res.data.address);
                    setArea([res.data.province_id,res.data.city_id,res.data.area_id]);
                    setLoading(false);
                }else if(res.flag === 420){
                    reLogin()
                }else{
                    Toast.fail(res.msg)
                }
            })
        }else{
            setLoading(false);;
        }
    },[key,a_id])

    //useMemo跳过昂贵的省市区联动组件的重新渲染
    const pickerChild = useMemo(() => 
        <PickTest handleAreaChange={handleAreaChange} area={area}/>
    , [area]);

    const submit = () => {
        if(!ifDone){
            return
        }
        setIfDone(false);
        const Province = area[0];
        if(MemberName === ''){
            Toast.info('请输入收货人~');return
        }else if (!MemberPhone || MemberPhone.length < 11){
            Toast.info('请输入正确手机号');return
        }else if (area.length <= 0){
            Toast.info('请选择地址');return
        }else if(detailAddress === ''){
            Toast.info('请选择详细地址');return
        }

        const url = a_id === 0?'Buy.AddAddress':'Buy.EditAddress';
        request({
            url,
            method:"POST",
            body:qs.stringify({
                Key:key,
                MemberName,
                MemberPhone,
                Province:area[0],
                City:area[1],
                Area:area[2],
                Address:detailAddress,
                IsDefault:if_default?'1':'0',
                AddressID:a_id
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setIfDone(true);
                Toast.success('提交成功！',1,()=>
                    props.history.goBack()
                )
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })

        
    }

    return (
        <div style={{paddingTop:45}}>
            <NavTopBar title="收货地址" backFn={false}/>
            {
                loading ? 
                <div className="loading-example">
                    <ActivityIndicator animating />
                </div>
                :
                <>
                    <List style={{marginTop:20}}>
                        <InputItem style={{fontSize:15}} value={MemberName} onChange={(e)=>setName(e)} placeholder="请输入收货人姓名">收货人: </InputItem>
                        <InputItem style={{fontSize:15}} type="phone" value={MemberPhone} onChange={(e)=>setTel(e)} placeholder="请输入手机号码">手机号码: </InputItem>
                        {pickerChild}
                        <InputItem style={{fontSize:15}} value={detailAddress} onChange={(e)=>setDetailAddress(e)} placeholder="输入详细地址">详细地址: </InputItem>
                        <List.Item style={{fontSize:15}} extra={<Switch checked={if_default} onChange={(e)=>setIf_def(e)}/>}>设置默认地址</List.Item>
                    </List>
                    <div className="fixed-bottom-button">
                        <button onClick={submit}>提交</button>
                    </div>
                </>
            }
            
            
        </div>
    )
}
export default AddressEdit