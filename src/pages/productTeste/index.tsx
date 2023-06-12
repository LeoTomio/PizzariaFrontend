
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import { useState } from "react";
import styles from './styles.module.scss';
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Head from "next/head";
import { Header } from "@/src/components/Header";
import { CategoryItemProps } from "../category";

export type ProdcutItemProps = {
    id: string;
    name: string;
    description: String;
    price: string
    category_id: string
}

export interface ProductProps {
    productList: ProdcutItemProps[];
    categoryList: CategoryItemProps[];
}

export default function Product({ productList, categoryList }: ProductProps) {

    const [products, setProducts] = useState(productList || [])
    const [category, setCategory] = useState(categoryList || [])

    async function handleEdit(item: ProdcutItemProps) {
        console.log('Edit')
    }

    async function handleDelete(item: any) {
        console.log('delete')
    }

    const filteredProducts = category.map((itemCategory) => {
        let item = products.filter((itemProduct) => itemProduct.category_id === itemCategory.id)
        return { category: itemCategory, produtos: { item } }
    })
    const productss = filteredProducts.map((item, key) => {
        return (
            <div className={styles.categoryTitle}>
                <h2>{item.category.name}</h2>
                {item.produtos.item.map((item, productkey) => {
                    return (
                        <div className={styles.list} key={key}>
                            <span>{item.name}</span>
                            <div key={item.id} className={styles.item}>
                                <button onClick={() => handleEdit(item)}>
                                    <FiEdit3 size={25} color={'#3FFFA3'} />
                                </button>
                                <button onClick={() => handleDelete(item)}>
                                    <FiTrash2 size={25} color={'#FF3F4B'} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    })


    return (
        <>
            <Head>
                <title>Produtos</title>
            </Head>
            <div>
                <Header/>
                <main className={styles.container}>
                    <h1>Cadastrar Produtos</h1>
                    <div className={styles.containerHeader}>
                        <div>

                            <button onClick={() => console.log('Clicou')}>Adicionar</button>
                        </div>
                    </div>
                    {productss}
                </main>
            </div>

            
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const productResponse = await apiClient.get('/product/')
    const categoryResponse = await apiClient.get('/category/')
    return {
        props: {
            productList: productResponse.data,
            categoryList: categoryResponse.data
        }
    }
})