import React,{useState,useEffect,useCallback,useMemo} from 'react';
import { Input,Icon } from 'antd'; // 加载 JS
import { WingBlank,Grid,WhiteSpace,Button,Toast } from 'antd-mobile';
import { showConfirm } from '../../utility/modal'
import { Link } from 'react-router-dom';
import { request,reLogin } from '../../utility/request'
import qs from 'querystring'

export default function SearchPage(){
    const [keyList,setKeyList] = useState([]);

    const [searchVal,setSearchVal] = useState('');
    const [list,setList] = useState([]);
    const [PageIndex,setPageIndex] = useState(1);

    const key = localStorage.getItem('c_token');
    const [search_history,setSearch_history] = useState(JSON.parse(localStorage.getItem('seach_history')) || []);
    const [forceCount,setForceCount] = useState(1);

    useEffect(()=>{
        request({
            url:'Selection.GetKeyword',
            method:"POST",
            body:qs.stringify({
                Key:key,
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setKeyList(res.data)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key])

    const handleSearchValChange = (e) => {
        setSearchVal(e.target.value)
    }
    
    const doSearch = (val) => {
        setSearchVal(val)
    }
    const clearDown = () => {
        setSearchVal('');
        setList([]);
    }

    const pressForSearch = useCallback(()=>{
        console.log('pressDown',searchVal);
        if(searchVal === ''){
            Toast.info('搜索关键词不能为空~');
            return
        }

        //存储搜索history
        let temp_history = search_history;
        console.log(temp_history);
        if (temp_history.length === 0) {
			temp_history.unshift(searchVal);
		} else {
			for (var k in temp_history) {
				if (temp_history[k] == searchVal) {
					temp_history.splice(k, 1);
					break;
				}
			}
			temp_history.unshift(searchVal);
        }
        setSearch_history(temp_history);
        setForceCount(state=>state+1)
        localStorage.setItem('seach_history', JSON.stringify(temp_history))
        
        request({
            url:'Selection.GoodsList',
            method:"POST",
            body:qs.stringify({
                Key:key,
                PageIndex,
                Keyword:searchVal
            })
        }).then(function(res){
            console.log(res);
            if(res.flag === 200){
                if(!res.data){
                    Toast.fail('暂无数据~',1)
                }else{
                    setList(res.data)
                }
                
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key,searchVal,PageIndex,search_history])

    const historyHtml = useMemo(() => 
        search_history.length > 0&&
        search_history.map((item,idx)=>
            <button key={idx} onClick={(e)=>doSearch(item)}>{item}</button>
        )
    , [search_history,forceCount])

    const clearHistory = () => {
        showConfirm('确定清空搜索记录吗？','',()=>{
            setSearch_history([]);
            localStorage.removeItem('seach_history');
        })
    }
    return (
        <div style={{paddingTop:50}}>
            <div className="search-top">
                <WingBlank style={{width:'100%',display:'flex',justifyContent:'space-between'}} size="md">
                    <Link to="/list/index"><Icon type="left" style={{fontSize:20,alignSelf:'center'}}/></Link>
                    <Input
                        placeholder="请输入搜索关键词"
                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={
                            searchVal!==''&&
                                <Icon type="close-circle" style={{ color: '#cccccc' }} theme="filled" onClick={clearDown}/>
                            }
                        className="search-input"
                        value={searchVal}
                        onChange={handleSearchValChange}
                    />
                    <span style={{alignSelf:'center',fontSize:16}} onClick={pressForSearch}>搜索</span>
                </WingBlank>
            </div>
            <WhiteSpace />
            {
                (list && list.length === 0) ?
                <WingBlank size="lg">
                <h3 className="hot-search">热门搜索</h3>
                <div className="search-btn-wrap">
                    {
                        keyList && keyList.length >0 &&
                        keyList.map((item)=>
                            <button key={item.keyword_id} onClick={(e)=>doSearch(item.keyword_name)}>{item.keyword_name}</button>
                        )
                    }
            
                    
                </div>
                <div style={{width:'100%',height:1,backgroundColor:'#E6E6E6',marginTop:20}}></div>
                <div style={{overflow:'hidden',marginTop:20}}>
                    <h3 className="hot-search" style={{float:'left'}}>历史搜索</h3>
                    <Icon type="delete" style={{float:'right',fontSize:18,marginTop:5}} onClick={clearHistory}/>
                </div>
                
                <div className="search-btn-wrap">
                    {
                        historyHtml
                    }
                    
                </div>
            </WingBlank>
            :
            <WingBlank size="lg">
                <Grid data={list}
                    columnNum={2}
                    square={false}
                    hasLine={false}
                    renderItem={dataItem => (
                        <div style={{ padding: '12.5px' }}>
                            <Link to={"/goods-detail?gid=" + dataItem.goods_id} style={{textAlign:'left'}}>
                                    <div style={{height:180,overflow:'hidden',borderTopLeftRadius:6,borderTopRightRadius:6}}>
                                        <img src={dataItem.goods_image} style={{ width: '100%', }} alt="" />
                                    </div>
                                    <p style={{ color: '#888', fontSize: '14px',marginBottom:0,minHeight:40 }}>
                                        {dataItem.goods_name}
                                    </p>
                                    <div style={{display:'flex',justifyContent:'space-between'}}>
                                        <p style={{color:'#C83B4C'}}>{dataItem.goods_wholesale_price1}</p>
                                        <span style={{color:'#9C9C9C',fontSize:12}}>{dataItem.stock_begin_num}件起批</span>
                                    </div>
                                </Link>

                        </div>
                    )}
                />
            </WingBlank>
            }
            
            
            
        </div>
    )
}