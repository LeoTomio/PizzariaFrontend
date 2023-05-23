import { Header } from "@/src/components/Header";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import Head from "next/head";

import { FormEvent, useEffect, useState } from "react";

import styles from './styles.module.scss';
import { CategoryProps } from "../product";

import { FiPlus, FiTrash2, FiEdit3 } from "react-icons/fi"
import { CategoryModal } from "@/src/components/ModalCategory";



export default function Category({ categoryList: listCategory }: CategoryProps) {

    const [categoryList, setCategoryList] = useState(listCategory || [])
    const [openModalCategory, setOpenModalCategory] = useState<boolean>(false)

    function handleCloseModal() {
        setOpenModalCategory(false)
    }


    const category = categoryList.map((item, key) => {
        return (
            <div className={styles.list}>
                <span>{item.name}</span>
                <div key={item.id} className={styles.item}>
                    <button>
                        <FiEdit3 size={25} color={'#3FFFA3'} />
                    </button>
                    <button>
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

