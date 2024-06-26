/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../../demo/service/ProductService';
import { Demo } from '@/types';
import axios from 'axios';
import { TreeTable } from 'primereact/treetable';

import './commande.css'

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    let emptyCommande: Demo.Commande = {
        num_commande: 0,
        date_de_commande: '',
        addresse_livraison: '',
        date_paiment: '',
        code_mode_paiment: '',
        email: '',
        utilisateur: {
            nom:'',
            prenom:''
        },
        contenir:[]
        };

    let emptyTypeVin: Demo.Typevin={
        code_type: '',
        prix_unitaire: 0,
        design_vin: '',
        img_vin:''
    }

    const [products, setProducts] = useState(null);
    const [listeCommande, setListCommande] = useState(null);
    const [commande,setCommande] = useState<Demo.Commande>(emptyCommande);
    const [productDialog, setProductDialog] = useState(false);  // open dialog d'ajout
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data as any));
        ProductService.getListeCommandes().then((data) => setListCommande(data as any));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setListCommande(null);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Produit modifié',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Produit créé',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const infoCommande = (commande: Demo.Commande) => {
        setCommande({ ...commande });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Produit supprimé',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Produits supprimé',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
               <Button label="Exporter" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    //template des body du datatable
    const code_type_template = (rowData: Demo.Typevin) => {
        return (
            <>
                <span className="p-column-title">Code_type</span>
                {rowData.code_type}
            </>
        );
    };
    const designation_template = (rowData: Demo.Commande) => {
        return (
            <>
               {rowData.contenir.map((contenirItem, index) => (
                <div key={index}>
                    {contenirItem.type_vin?.design_vin}
                </div>
            ))}
            </>
        );
    }
    const designation_template_contenir = (rowData: Demo.Contenir) => {
        return (
            <>
               {rowData.type_vin.design_vin}
            </>
        );
    };
    const pu_template_contenir = (rowData: Demo.Contenir) => {
        return (
            <>
               {rowData.type_vin.prix_unitaire}
            </>
        );
    };
    const date_de_commande_template = (rowData: Demo.Commande) =>{
        const date =new Date(rowData.date_de_commande)
        return (
            <>
                {date.toLocaleDateString('fr-FR', {
                        timeZone: 'UTC',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'})}
            </>
        );

    }
    const qte_template_contenir = (rowData: Demo.Contenir) => {
        return (
            <>
               {rowData.quantite}
            </>
        );
    };
    const somme_template_contenir = (rowData: Demo.Contenir) => {
        return (
            <>
               {rowData.somme_due}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.Commande) => {
        return (
            <>
                <Button icon="pi pi-info-circle" rounded severity="info" className="mr-2" onClick={() => infoCommande(rowData)} />
                {/* <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
            </>
        );
    };
    const date_commande_template = (date: Date) => {
        const date_commande =new Date(date)
        return date_commande.toLocaleDateString('fr-FR', {
                        timeZone: 'UTC',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'})}


    const nomPrenomClient = (rowData: Demo.Commande)=>{
        return (
            <>
                {rowData.utilisateur.nom+" "+rowData.utilisateur.prenom}
            </>
        )
    }

    const footerTableContenir = (total: String)=>{
        return(
            <>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontWeight:'bold'}}>TOTAL</span>
                    <span style={{fontSize:'bold'}}>{total}</span>
                </div>
            </>
        )
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Liste des commandes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Recherche..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Fermer" icon="pi pi-times" text onClick={hideDialog} />
            {/* <Button label="Enregistrer" icon="pi pi-check" text onClick={saveProduct} /> */}
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

  
    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={listeCommande}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey='num_commande'
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Affichage du {first} au {last} des {totalRecords} produits "
                        globalFilter={globalFilter}
                        emptyMessage="Produits non trouvé."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="num_commande" header="N°commande" sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={date_de_commande_template} header="Du" sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={nomPrenomClient} sortable header="Client" headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={productDialog} position='top' style={{ width: '900px' }} header="Detail de la commande" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div>
                            <div style={{display:'flex',justifyContent:'space-around'}}>
                                <div>
                                    <span className='info-label'>Client: </span> 
                                    <span className='info-value' >{commande.utilisateur.nom+" "+commande.utilisateur.prenom}</span><br />    
                                </div>
                                <div>
                                    <span className='info-label'>Email: </span>
                                    <span className='info-value'>{commande.email}</span><br />
                                </div>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-around'}}>
                                <div>
                                    <span className='info-label'>N° Commande: </span>
                                    <span className='info-value' >{commande.num_commande.toString()}</span><br />
                                </div>
                                <div>
                                    <span className='info-label'>Du </span> 
                                    <span className='info-value' >{date_commande_template(commande.date_de_commande)}</span><br />
                                </div>
                            </div>
                        <br />
                        </div>
                        <p>Liste des commandes</p>
                        <DataTable value={commande.contenir} footer={footerTableContenir("Net à payer")}>
                            <Column field='code_type' header='Type'/>
                            <Column body={designation_template_contenir} header='Désignation'/>
                            <Column body={pu_template_contenir} header='PU'/>
                            <Column body={qte_template_contenir} header='Qté'/>
                            <Column body={somme_template_contenir} header='Somme'/>
                        </DataTable>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Etes-vous sûr que vous voulez supprimer<b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Êtes-vous sûr de vouloir supprimer les produits sélectionnés?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
