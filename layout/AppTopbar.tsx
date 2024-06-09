/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [confirmation, setConfirmation] = useState(false);
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const hideConfirmation = ()=>{
        setConfirmation(false)
    }

    const loggout = ()=>{
        Cookies.remove('token');
                
        router.push('/auth/login');
    }

    const confirmationFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick= {hideConfirmation}  />
            <Button label="Oui" icon="pi pi-check" text onClick={loggout} />
        </>
    );

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            
            <Toast ref={toast} />
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>DI VAY</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Link href="/admin/notification">
                        <i className="pi pi-bell mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem', marginTop:8 }}>
                            <Badge value="10+" severity="danger"></Badge>
                        </i>
                </Link>
                <button type="button" className="p-link layout-topbar-button" onClick={()=>{setConfirmation(true)}}>
                    <i className="pi pi-sign-out"></i>
                    <span>Profile</span>
                </button>
                <Dialog visible={confirmation} style={{ width: '450px' }} header="Confirmation" modal footer={confirmationFooter} onHide={()=>{setConfirmation(false)}}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Voulez vous vraiment se deconnecter?</span>
                        </div>
                    </Dialog>
                
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
