import ListPage from '../pages/list/listIndex'
import Cart from '../pages/cart/cart'
import NotFound from '../pages/notFound';
import My from '../pages/my/my';
import SearchPage from '../pages/list/search';
import Categories from '../pages/list/category';
import GoodsDetail from '../pages/list/goodsDetail';
import Login from '../pages/login';
import SearchIndex from '../pages/list/searchIndex';
import AddressList from '../pages/cart/addressList';
import OrderConfirm from '../pages/cart/orderConfirm';
import AddressEdit from '../pages/cart/addressEdit';
import OrderList from '../pages/my/orderList';
import OrderDetail from '../pages/my/orderDetail';
import ConsultLog from '../pages/my/consultLog';
import Logistics from '../pages/my/logistics';


export const routes = [
    {
        "path":"/login",
        "comp":Login
    },
    {
        "path":"/list/index",
        "comp":ListPage
    },
    {
        "path":"/cart",
        "comp":Cart
    },
    {
        "path":"/my",
        "comp":My
    },
    {
        "path":"/search",
        "comp":SearchPage
    },
    {
        "path":"/categories",
        "comp":Categories
    },
    {
        "path":"/goods-detail",
        "comp":GoodsDetail
    },
    {
        "path":"/search_index",
        "comp":SearchIndex
    },
    {
        "path":"/address_list",
        "comp":AddressList
    },
    {
        "path":"/address_edit",
        "comp":AddressEdit
    },
    {
        "path":"/order_confirm",
        "comp":OrderConfirm
    },
    {
        "path":"/order_list",
        "comp":OrderList
    },
    {
        "path":"/order_detail",
        "comp":OrderDetail
    },
    {
        "path":"/consult_log",
        "comp":ConsultLog
    },
    {
        "path":"/logistics",
        "comp":Logistics
    }
]
