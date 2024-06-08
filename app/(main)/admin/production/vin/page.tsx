'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadSelectEvent  } from 'primereact/fileupload';
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
import ImgUpload_template from './imgupload';

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

    let emptyTypeVin: Demo.Typevin={
        code_type: '',
        prix_unitaire: 0,
        design_vin: '',
        description:'',
        img_vin:''
    }

    const [products, setProducts] = useState(null);
    const [listetypeVin, setListetypeVin] = useState(null);
    const [productDialog, setProductDialog] = useState(false);  // open dialog d'ajout
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [typevin, setTypevin] = useState<Demo.Typevin>(emptyTypeVin);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data as any));
        ProductService.getListeVin().then((data) => setListetypeVin(data as any));
        // fetchList_Type_Vin();
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        // setListetypeVin(null);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setTypevin(emptyTypeVin);
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        try{
            const res = await axios.post('http://localhost:8080/Type_vin/add',typevin);
            ProductService.getListeVin().then((data) => setListetypeVin(data as any));
            setProductDialog(false)
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Vin ajouté avec succès',
                life: 3000
            });
            setTypevin(emptyTypeVin);
        }
        catch(e){
            console.error('error',e)
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const [idSupp,setIdSupp]=useState('')

    const confirmDeleteProduct = (codetype:string) => {
        setIdSupp(codetype);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        // setProducts(_products);
        const res = await axios.delete(`http://localhost:8080/Type_vin/delete/${idSupp}`);
            ProductService.getListeVin().then((data) => setListetypeVin(data as any));
            //setProductDialog(false)
            setDeleteProductDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: res.data.succes,
                life: 3000
            });
            //setTypevin(emptyTypeVin);
        //setProduct(emptyProduct);
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
                    <Button label="Ajouter" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
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
    const designation_template = (rowData: Demo.Typevin) => {
        return (
            <>
                <span className="p-column-title">Désignation</span>
                {rowData.design_vin}
            </>
        );
    };
    const prix_template = (rowData: Demo.Typevin) => {
        return (
            <>
                <span className="p-column-title">Prix</span>
                {rowData.prix_unitaire}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData.code_type)  }/>
            </>
        );
    };

    const img_vin_template = (rowData: Demo.Typevin)=>{
        return (
            <>
                <img className="shadow-2" src={`data:image/jpeg;base64,${rowData.img_vin}`} alt='img_vin' width="50" height='50' />
            </>
        )
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Liste des commandes possible de vin</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Recherche..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" severity='secondary' text onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="pi pi-check" severity='success' text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Oui" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );


    const [image64selected, setImage64Selected] = useState<string | null>(null); // Explicitly defining the type as string | null

    const handleFileSelect = (event: FileUploadSelectEvent) => {
        const files = event.files;
        const file = files[0];
        const newTypevin = {...typevin}

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                const imagebrute = base64String.split(',');
                newTypevin.img_vin=imagebrute[1];
                setTypevin(newTypevin);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleClearFileSelect = () => {
        setTypevin((prevFromData)=>({
            ...prevFromData,
            code_type:''
        }))
            
    };

    const uploadOptions = { icon: 'none', iconOnly: true, className: 'hidden' };
    const chooseOptions = { icon: 'pi pi-image', iconOnly: false,label:'Ajouter photo d\'éxposition', className: '' };
    const cancelOptions = { icon: 'none', iconOnly: false,label:'Annuler', className: '' };

    useEffect(()=>{
        console.log('typevin::'+JSON.stringify(typevin));
    },[typevin])


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} position='top-center'/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={listetypeVin}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey='code_type'
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
                        <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                        <Column header="Image" body={img_vin_template} />
                        <Column field="code_type" header="code_type" sortable  headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="design_vin" header="Désignation" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="prix_unitaire" header="Prix" align='right' sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="description" header="Déscription" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '750px' }} position='top' header="Detail du produit" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="codetype">Code type vin:</label>
                            <InputText
                                id="code_type"
                                //value={typevin.code_type}
                                onChange={(e) => {
                                    const{ value } = e.target;
                                        setTypevin((prevFromData)=>({
                                            ...prevFromData,
                                            code_type:value
                                        }))
                                    }
                                }
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !typevin.code_type && <small className="p-invalid">Code est requis.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="design_vin">Désignation:</label>
                            <InputText
                                id="name"
                                //value={typevin.design_vin}
                                onChange={(e) => {
                                    const{ value } = e.target;
                                        setTypevin((prevFromData)=>({
                                            ...prevFromData,
                                            design_vin:value
                                        }))
                                    }
                                }
                                required
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !typevin.design_vin && <small className="p-invalid">Désignation est requis.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Déscription:</label>
                            <InputText
                                id="description"
                                //value={typevin.design_vin}
                                onChange={(e) => {
                                    const{ value } = e.target;
                                        setTypevin((prevFromData)=>({
                                            ...prevFromData,
                                            description:value
                                        }))
                                    }
                                }
                                required
                                className={classNames({
                                    'p-invalid': submitted && !typevin.description
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Désignation est requis.</small>}
                        </div>


                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="prix_unitaire">Prix unitaire:</label>
                                <InputNumber
                                    id="prix_unitaire"
                                    value={typevin.prix_unitaire}
                                    onValueChange={(e)=>{
                                        setTypevin((prevFromData)=>({
                                            ...prevFromData,
                                            prix_unitaire:e.value
                                        }))
                                    }}  
                                    mode="currency"
                                    currency="MGA"
                                    // locale="en-US"
                                />
                                {submitted && !typevin.design_vin && <small className="p-invalid">Désignation est requis.</small>}
                            </div>
                        </div>
                        
                    <div className="card">
                        <FileUpload 
                            maxFileSize={1000000} 
                            onSelect={handleFileSelect}
                            onClear={handleClearFileSelect}
                            emptyTemplate={<p className="m-0">Glisser et déposer ici</p>}
                            uploadOptions={uploadOptions}
                            cancelOptions={cancelOptions}
                            chooseOptions={chooseOptions}
                            mode='advanced'
                        />
                        {image64selected && (
                            <img src={image64selected} alt="Selected" />
                        )}      
                    </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmation" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ color:'red' , fontSize: '2rem' }} />
                            {product && (
                                <span style={{color:'red'}}>
                                    Etes-vous sûr que vous voulez le vin : <b>{idSupp}</b>?
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
