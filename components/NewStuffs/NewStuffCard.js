import React from 'react';
import Image from 'next/image';

const NewStuffCard = () =>{
    return (
        <div className={['col-2', 'rounded', 'shadow', 'p-2', 'text-center'].join(' ')} style={{backgroundColor: 'white'}}>
            <img src="/assets/images/stuff_images/cup.jpg" className={[].join(' ')} style={{width: '100%'}} />
            <div className={['text-right'].join(' ')} style={{direction: 'rtl'}}>
                <img src="/assets/images/main_images/bookmark.png" style={{width: '24px'}} />
                <h6 className={['mr-2', 'd-inline'].join(' ')}>فنجان سفالی کد ۴۱۳۵۴۲۳</h6>
            </div>
            <div className={['d-flex', 'align-items-center', 'mt-3'].join(' ')}>
                <img src="/assets/images/main_images/percentage.png" style={{width: '30px'}} />
                <span className={['rounded', 'ml-1', 'p-1', 'text-light'].join(' ')} style={{background: '#FC7C49'}}>12%</span>
            </div>
            <h5 className={['text-right', 'text-muted'].join(' ')} style={{width: '100%', direction: 'rtl'}}><del>۱۲,۳۰۰ تومان</del></h5>
                <h5 className={['text-right'].join(' ')} style={{width: '100%', direction: 'rtl'}}>۱۰,۱۲۳ تومان</h5>
        </div>
    );
}

export default NewStuffCard;