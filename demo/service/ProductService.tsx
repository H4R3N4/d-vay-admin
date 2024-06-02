import { Demo } from '@/types';
import axios , {AxiosResponse, AxiosError} from 'axios'


export const ProductService = {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    async getListeVin(): Promise<Demo.Typevin[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8080/Type_vin');
            console.log(response.data.typesVin);
            return response.data.typesVin as Demo.Typevin[];
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de vins:', error);
            return [];
        }
    },
    async getListeClient(): Promise<Demo.Client[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8080/Utilisateur');
            return response.data.clients as Demo.Client[];
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de client:', error);
            return [];
        }
    },
    async getListeCommandes(): Promise<Demo.Commande[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8080/Commande');
            console.log(response.data.commandes)
            return response.data.commandes as Demo.Commande[];
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste des commandes:', error);
            return [];
        }
    },
    
    async getListeVignoble(): Promise<Demo.Vignoble[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8080/Vignoble');
            return response.data.vignobles as Demo.Vignoble[];
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de vins:', error);
            return [];
        }
    },
    
    async getListeRecolte(): Promise<Demo.Recolte[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8080/Recolte');
            return response.data.recoltes as Demo.Recolte[];
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de vins:', error);
            return [];
        }
    },

    getProducts() {
        return fetch('/demo/data/products.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};
