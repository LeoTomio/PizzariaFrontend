import { Header } from "@/src/components/Header";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import Modal from 'react-modal'

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from './styles.module.scss';
import { FiX } from "react-icons/fi";
import { ItemProps } from "@/src/pages/product";

interface ModalCategoryProps {
    isOpen: boolean;
    onRequestClose: () => void;
    selectedCategory: ItemProps
    categoryList: ItemProps[]
    setCategoryList: Dispatch<SetStateAction<ItemProps[]>>;

}


export function CategoryModal({ isOpen, onRequestClose, selectedCategory, categoryList, setCategoryList }: ModalCategoryProps) {

    const [name, setName] = useState<string>('')

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!name) {
            return
        }
        const apiClient = setupAPIClient();
        await apiClient.post('/category/', { name }).then((response) => {
            let listCategory: ItemProps[] = categoryList
            listCategory.push({
                id: response.data.id,
                name: name
            })
            setCategoryList(listCategory)
            toast.success('Categoria cadastrada com sucesso!')
            setName('')
            onRequestClose()
        }).catch((error) => {
            toast.error('Erro ao inserir categoria!')
        })

    }

    async function handleEdit(event: FormEvent) {
        event.preventDefault();
        if (!name) {
            return
        }
        const apiClient = setupAPIClient();
        await apiClient.put('/category/', {
            id: selectedCategory.id,
            name: name
        }).then(() => {
            categoryList.find(categoryItem => {
                if (categoryItem.id === selectedCategory.id) {
                    categoryItem.name = name
                }
            })
            toast.success('Categoria editada com sucesso!')
            setName('')
            onRequestClose()
        })

    }

    useEffect(() => {
        selectedCategory && setName(selectedCategory.name)
    }, [])

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.container}>
            <div className={styles.teste}>
                <button className={styles.closeButton} onClick={onRequestClose} style={{ background: 'transparent', border: 'none' }}>
                    <FiX size={35} color="#f34748" />
                </button>
                <h1>Cadastrar categoria</h1>
                <div className={styles.form} >
                    <input
                        type="text"
                        placeholder="Digite o nome da categoria"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button className={styles.buttonAdd} onClick={selectedCategory ? handleEdit : handleRegister}>
                        Cadastrar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }

})

