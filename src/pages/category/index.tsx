import { Header } from "@/src/components/Header";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import Head from "next/head";

import { useState } from "react";
import styles from './styles.module.scss';

import { CategoryModal } from "@/src/components/ModalCategory";
import { AxiosError } from "axios";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export type CategoryItemProps = {
    id: string;
    name: string;
}

export interface CategoryProps {
    categoryList: CategoryItemProps[];
}

export default function Category({ categoryList: listCategory }: CategoryProps) {

    const [categoryList, setCategoryList] = useState(listCategory || [])
    const [openModalCategory, setOpenModalCategory] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryItemProps | undefined>()

    function handleCloseModal() {
        setOpenModalCategory(false)
    }

    async function handleEdit(item: CategoryItemProps) {

        const api = setupAPIClient();
        const response = await api.get(`/category/${item.id}`)
        setSelectedCategory(response.data)
        setOpenModalCategory(true)
    }

    async function handleDelete(item: any) {
        setOpenModalCategory(false)

        const api = setupAPIClient();
        await api.delete(`/category/${item.id}`).then((response) => {

            let newCategoryList = categoryList.filter(categoryItem => {
                return (categoryItem.id !== item.id)
            })
            toast.success(response.data.message)
            setCategoryList(newCategoryList)
        }).catch((error: AxiosError | any) => {
            toast.error(error.response.data.message)
        })
    }

    const category = categoryList.map((item, key) => {
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
    })

    return (
        <>
            <Head>
                <title>Categorias</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar Categorias</h1>
                    <div className={styles.containerHeader}>
                        <div>
                            <button onClick={() => setOpenModalCategory(true)}>Adicionar</button>
                        </div>
                    </div>
                    {category}
                </main>

                {openModalCategory === true &&
                    <CategoryModal
                        isOpen={openModalCategory}
                        onRequestClose={handleCloseModal}
                        selectedCategory={selectedCategory}
                        categoryList={categoryList}
                        setCategoryList={setCategoryList}

                    />}

            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category/')
    return {
        props: {
            categoryList: response.data
        }
    }
})

