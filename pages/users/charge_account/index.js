import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import * as Constants from '../../../components/constants';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import {useCookies} from 'react-cookie';
import Link from 'next/link';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions';
import Image from 'next/image';

const ChargeAccount = (props) => {

    const [cookies , setCookie , removeCookie] = useCookies();
    const [requestedPrice, setRequestedPrice] = useState(0);
    const [userPreviousRequests, setUserPreviousRequests] = useState([]);
    const [ajaxProcessing, setAjaxProcessing] = useState(false);
    const [confirmButtonText, setConfirmButtonText] = useState("تایید و پرداخت");

    useEffect(() => {
        props.reduxUpdateUserTotally(props.ssrUser);
        if(props.ssrUser.status === 'LOGIN'){
            console.warn(props.ssrUser.information);
            axios.post(Constants.apiUrl + "/api/user-cart", {},{
                headers: {
                    'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                }
            }).then((res)=>{
                let response = res.data;
                if(response.status === 'done'){
                    let cartArray = [];
                    if(response.cart !== '{}'){
                        response.cart.map((item, counter) => {
                            cartArray.push({
                                productId: item.productId, 
                                productPackId: item.productPackId, 
                                name: item.productName, 
                                categoryId: item.categoryId, 
                                prodID: item.prodID,
                                url: item.productUrl,
                                count: item.productCount,
                                unitCount: item.productUnitCount,
                                unitName: item.productUnitName,
                                label: item.productLabel,
                                basePrice: item.productBasePrice,
                                price: item.productPrice,
                                discountedPrice: item.discountedPrice,
                                discountPercent: item.discountPercent
                            });
                        });
                        props.reduxUpdateCart(cartArray);
                    }else{
                        props.reduxUpdateCart([]);
                    }
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateCart([]);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
            getUserPreviousWithdrawalRequests();
        }else if(props.ssrUser.status === 'GUEST'){
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);

    const getUserPreviousWithdrawalRequests = () => {
        axios.post(Constants.apiUrl + '/api/user-withdrawal-history', {}, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setUserPreviousRequests(response.history);
            }else if (response.status === 'failed'){
                console.log(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            console.log("error");
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const requestedValueChanged = (event) => {
        if(event.target.value.length !== 0){
            let price = parseInt(event.target.value);
            setRequestedPrice(price)   
        }else{
            setRequestedPrice(0);
        }
    }

    const confirmButtonClicked = () => {
        if(ajaxProcessing){
            return;
        }
        if(requestedPrice < 100){
            return;
        }
        setConfirmButtonText('کمی صبر کنید');
        setAjaxProcessing(true);
        axios.post(Constants.apiUrl + '/api/user-charge-wallet', {
            price: requestedPrice
        }, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setConfirmButtonText("درحال انتقال به صفحه‌ی پرداخت");
                window.location.href = 'https://pep.shaparak.ir/payment.aspx?n=' + response.token;
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
            setAjaxProcessing(false);
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            setAjaxProcessing(false);
        });
    }

    return(
        <React.Fragment>
            <Head>
                <title>موجودی حساب کاربری ‌| هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                            <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                                <div className={['col-2', 'd-none', 'd-md-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_main.svg'} style={{width: '50%', border: '4px solid #00BAC6', borderRadius: '50%'}} />
                                    <Link href='/users/view'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer', 'mt-3'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>نمایه کاربری</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/orders'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>سفارش‌های من</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/showreturned'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_return_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>تاریخچه مرجوعی</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <div className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderTop: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE', borderRight: '1px dashed #DEDEDE', borderLeft: '1px dashed #DEDEDE', background: '#F9F9F9'}}>
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_main.svg'} style={{width: '25px', height: '25px'}} />
                                            <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px', color: '#00BAC6'}}>موجودی/شارژ حساب</h6>
                                        </div>
                                    </div>
                                    <Link href='https://honari.com/academy/user/courses'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>کلاس‌های من</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/balance'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>تسویه حساب</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_cooperation_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>همکاری در فروش</h6>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                                <div className={['col-12', 'd-md-none'].join(' ')}>
                                    <div className={['container'].join(' ')}>
                                    <div className={['row', 'rtl', 'justify-content-between'].join(' ')} style={{borderTop: '1px solid #DEDEDE', borderRight: '1px dashed #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                            <div className={['col-12', 'text-center', 'py-3', 'w-100', 'pointer', 'd-flex', 'flex-row', 'justify-content-center'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE', background: '#F9F9F9'}}>
                                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'px-2'].join(' ')} style={{position: 'relative', left: '0.5rem'}}>
                                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_main.svg'} style={{width: '20px', height: '20px'}} />
                                                    <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6'}}>موجودی/شارژ حساب</h6>
                                                </div>
                                            </div>
                                            <Link href='/users/view'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>نمایه کابری</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/orders'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>سفارش‌های من</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/showreturned'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderLeft: '1px dashed #DEDEDE', borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_return_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>تاریخچه مرجوعی</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://honari.com/academy/user/courses'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{ borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>کلاس‌های من</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/balance'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>تسویه حساب</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cooperation_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>همکاری در فروش</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className={['col-12', 'col-md-10', 'container', 'mt-3'].join(' ')}>
                                    <div className={['row'].join(' ')}>
                                        <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/wallet.png'} className={['mt-3'].join(' ')} style={{width: '40px', height: '40px'}} />
                                            <h6 className={['mb-0', 'text-center', 'mt-3'].join(' ')} style={{fontSize: '14px'}}>موجودی حساب شما</h6>
                                            {
                                                props.reduxUser.information.balance !== undefined
                                                ?
                                                    <h6 className={['mb-0', 'mt-3', 'text-center'].join(' ')}>{props.reduxUser.information.balance.toLocaleString() + ' تومان '}</h6>
                                                :
                                                    <h6 className={['mb-0', 'mt-3', 'text-center'].join(' ')}>تومان</h6>
                                            }
                                        </div>  
                                        <div className={['col-12'].join(' ')}>
                                            <h6 className={['text-center', 'mt-5'].join(' ')} style={{fontSize: '17px'}} >مبلغ موردنظر خود را برای شارژ حساب کاربری به تومان وارد کنید</h6>
                                            <input className={['w-100', 'form-control', 'text-center', 'mt-3'].join(' ')} type='number' placeholder='مثال :‌ 50,000' onChange={requestedValueChanged} />
                                            <div className={['d-flex', 'flex-row', 'justify-content-center', 'mt-3'].join(' ')}>
                                                {
                                                    requestedPrice >= 100
                                                    ?
                                                    <button className={['px-3', 'py-2', 'pointer'].join(' ')} style={{fontSize: '14px', background: '#00BAC6', color: 'white', border: 'none', outline: 'none', borderRadius: '3px'}} onClick={confirmButtonClicked}>{confirmButtonText}</button>
                                                    :
                                                    <button className={['px-3', 'py-2', 'pointer'].join(' ')} style={{fontSize: '14px', background: '#00BAC6', color: 'white', border: 'none', outline: 'none', borderRadius: '3px', opacity: '0.4'}}>{confirmButtonText}</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                </React.Fragment>
        <Footer />
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart,
        reduxLoad: state.loading
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChargeAccount);

export async function getServerSideProps(context){
    const m = await fetch(Constants.apiUrl + '/api/menu', {
        method: 'GET'
    });
    let menu = await m.json();
    if(context.req.cookies.user_server_token !== undefined){
        const res = await fetch(Constants.apiUrl + '/api/user-information',{
            method: 'POST',
            headers: new Headers(
                {
                    'Authorization': 'Bearer ' + context.req.cookies.user_server_token
                }
            )
        });
        let response = await res.json();
        if(await response.status === 'done' && await response.found === true){
            return {
                props: {
                    ssrUser: {status: 'LOGIN', information: await response.information},
                    ssrCookies: context.req.cookies,
                    ssrMenu: await menu
                }
            }
        }else{
            return {
                props: {
                    ssrUser: {status: 'GUEST', information: {}},
                    ssrCookies: context.req.cookies,
                    ssrMenu: await menu
                },
                redirect: {
                    destination: '/'
                }
            }
        }
        
    }else{
        console.log("DOES NOT HAVE ANY COOKIES");
        return{
            props: {
                ssrUser: {status: 'GUEST', information: {}},
                ssrCookies: context.req.cookies,
                ssrMenu: await menu
            },
            redirect: {
                destination: '/'
            }
        };
    }
}