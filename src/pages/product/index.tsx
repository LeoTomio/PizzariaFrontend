
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import { useState } from "react";
import styles from './styles.module.scss';
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Head from "next/head";
import { Header } from "@/src/components/Header";
import { CategoryItemProps } from "../category";
import ProductModal from "@/src/components/ModalProduct";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export type ProductItemProps = {
    id: string;
    name: string;
    description: string;
    price: string;
    category_id: string;
    banner?: string;
}

export interface ProductProps {
    productList: ProductItemProps[];
    categoryList: CategoryItemProps[];
}

export default function Product({ productList: listProduct, categoryList }: ProductProps) {

    const [productList, setProductList] = useState(listProduct || [])
    const [category, setCategory] = useState(categoryList || [])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<ProductItemProps | undefined>()

    async function handleEdit(item: ProductItemProps) {
        const api = setupAPIClient();
        const response = await api.get(`/product/${item.id}`)
        setSelectedProduct(response.data)
        setOpenModal(true)
    }

    async function handleDelete(item: any) {
        const api = setupAPIClient();
        await api.delete(`/product/${item.id}`).then((response) => {
            let newList = productList.filter(productItem => {
                return (productItem.id !== item.id)
            })
            setProductList(newList)
            toast.success(response.data.message)
        }).catch((error: AxiosError | any) => {
            console.log(error)
            toast.error(error.response.data.message)
        })
    }
    function handleCloseModal() {
        setSelectedProduct(undefined)
        setOpenModal(false)
    }

    const filteredProducts = category.map((itemCategory, key) => {
        let item = productList.filter((itemProduct) => itemProduct.category_id === itemCategory.id)
        return (
            <div className={styles.categoryTitle}>
                <h1>{itemCategory.name}</h1>
                {item.map((item) => {
                    return (
                        <div className={styles.list} key={key}>
                            <div>
                                <p className={styles.name}>{item.name}</p>
                                <p title={item.description} className={styles.description}>{item.description}</p>
                            </div>
                            <div key={item.id} className={styles.item}>
                                <button onClick={() => handleEdit(item)}>
                                    <FiEdit3 size={20} color={'#3FFFA3'} />
                                </button>
                                <button onClick={() => handleDelete(item)}>
                                    <FiTrash2 size={20} color={'#FF3F4B'} />
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
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar Produtos</h1>
                    <div className={styles.containerHeader}>
                        <div>
                            <button onClick={() => setOpenModal(true)}>Adicionar</button>
                        </div>
                    </div>
                    {filteredProducts}
                </main>

                {openModal === true &&
                    <ProductModal
                        isOpen={openModal}
                        onRequestClose={handleCloseModal}
                        selectedProduct={selectedProduct}
                        productList={productList}
                        categoryList={categoryList}
                        setProductList={setProductList}

                    />}
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