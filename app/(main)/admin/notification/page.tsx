/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import './notification.css';
import Link from 'next/link';

const Notification = () => {
    return (
        <>
            <div className="card">
                <div className="flex align-items-center justify-content-between mb-4">
                    <h5>Notifications</h5>
                    <div>
                        <Menu
                            popup
                            model={[
                                { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                            ]}
                        />
                    </div>
                </div>

                <span className="block text-600 font-medium mb-3">AUJOURD'HUI</span>
                <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                    <Link href="/admin/vente/commande">
                        <li className="list-item flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-bell text-xl text-green-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Rahasinarivo Lahatra
                                <span className="text-700">
                                    {' '}
                                    a commandé trois bouteille de Maroparasy <span className="text-blue-500">15.000Ar</span>
                                </span>
                            </span>
                        </li>
                    </Link>
                    <Link href="/admin/vente/commande">
                        <li className="list-item flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-bell text-xl text-green-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Rahasinarivo Lahatra
                                <span className="text-700">
                                    {' '}
                                    a commandé trois bouteille de Maroparasy <span className="text-blue-500">15.000Ar</span>
                                </span>
                            </span>
                        </li>
                    </Link>
                </ul>

                <span className="block text-600 font-medium mb-3">HIER</span>
                <ul className="p-0 m-0 list-none">
                    <Link href="/admin/vente/commande">
                        <li className="list-item flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-bell text-xl text-green-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Rahasinarivo Lahatra
                                <span className="text-700">
                                    {' '}
                                    a commandé trois bouteille de Maroparasy <span className="text-blue-500">15.000Ar</span>
                                </span>
                            </span>
                        </li>
                    </Link>
                    <Link href="/admin/vente/commande">
                        <li className="list-item flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-bell text-xl text-green-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Rahasinarivo Lahatra
                                <span className="text-700">
                                    {' '}
                                    a commandé trois bouteille de Maroparasy <span className="text-blue-500">15.000Ar</span>
                                </span>
                            </span>
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    );
};

export default Notification;
