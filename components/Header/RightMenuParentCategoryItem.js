import { CopyrightOutlined } from '@material-ui/icons';
import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RightMenuParentCategoryItem = (props) => {
    const [information, setInformation] = useState(props.information);
    const [showChildrenCategories, setShowChildrenCategories] = useState(false);

    return(
        <div className={['px-2', 'py-3'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>{information.parentName}</h5>
                {
                    showChildrenCategories == true
                    ?
                        <Image src='/assets/images/main_images/down_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} onClick={() => {setShowChildrenCategories(false)}} /> 
                    :
                        <Image src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} onClick={() => {setShowChildrenCategories(true)}} />        
                }
            </div>
            {
                showChildrenCategories == true && information.children != [] && information.children != undefined
                ?
                    information.children.map((child, counter) => {
                        return <Link href={child.url}><h6 className={['text-right', 'rtl', 'pr-3', 'mt-3', 'mb-0', 'pointer'].join(' ')} style={{fontSize: '12px'}}>{child.name}</h6></Link>
                    })
                :
                    null
            }
        </div>
    );
}

export default RightMenuParentCategoryItem;