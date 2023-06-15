import Head from "next/head";
import styles from './styles.module.scss'

import { canSSRAuth } from "@/src/utils/canSSRauth";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/ui/Input";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { setupAPIClient } from "@/src/services/api";
import { toast } from "react-toastify";
import { ProductItemProps } from "@/src/pages/product";
import { CategoryItemProps } from "@/src/pages/category";
import Modal from 'react-modal'

import { baseURL } from '../../services/api';
interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    selectedProduct: ProductItemProps
    productList: ProductItemProps[]
    categoryList: CategoryItemProps[]
    setProductList: Dispatch<SetStateAction<ProductItemProps[]>>;

}


export default function ProductModal({ isOpen, onRequestClose, selectedProduct, setProductList, productList, categoryList }: ModalProps) {

    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [description, setDescription] = useState<string>('')


    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [imageAvatar, setImageAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categories[0].id)


    useEffect(() => {
        if (selectedProduct) {
            setName(selectedProduct.name)
            setPrice(selectedProduct.price)
            setDescription(selectedProduct.description)
            setSelectedCategory(categories.find(item => { if (item.id === selectedProduct.category_id) return item }).id)
            setImageAvatar(selectedProduct.banner)
            setAvatarUrl(baseURL + '/files/' + selectedProduct.banner)
        }
    }, [])



    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }
        const image = e.target.files[0];
        if (!image) {
            return
        }
        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }

    }

    async function submit(e: FormEvent) { 
        e.preventDefault();
        try {
            const apiClient = setupAPIClient();
            let newList: ProductItemProps[] = productList

            if (selectedProduct) {
                let data = {
                    id: selectedProduct.id,
                    name,
                    price,
                    description
                }

                await apiClient.put('/product/', data).then((response) => {
                    newList.find(productItem => {
                        if (productItem.id === selectedProduct.id) {
                            productItem.name = name;
                            productItem.price = price;
                            productItem.description = description;
                        }
                    })
                    toast.success(response.data.message)
                    onRequestClose()
                })

            } else {
                const data = new FormData();
                if (!name || !price || !description || !imageAvatar) {
                    toast.error("Preencha todos os campos!")
                    return;
                }
                data.append('name', name)
                data.append('price', price)
                data.append('description', description)
                data.append('category_id', selectedCategory)
                data.append('file', imageAvatar)

                await apiClient.post('/product/', data).then((response) => {
                    newList.push({
                        id: response.data.id,
                        name,
                        description,
                        price,
                        category_id: selectedCategory
                    })
                    setProductList(newList)
                })

                toast.success('Produto Cadastro')
                onRequestClose()
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro ao cadastrar!')
        }
    }

    function clear() {
        setName('')
        setPrice('')
        setDescription('')
        setSelectedCategory(undefined)
        setImageAvatar(null)
        setAvatarUrl('')
    }

    function handleChangeCategory(event) {
        setSelectedCategory(event.target.value)
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.container}>
            <div className={styles.modalBody}>
                <h1>Adicionar produto</h1>
                <div className={styles.form} >
                    <label className={styles.labelAvatar} style={!!selectedProduct ? {} : { cursor: 'pointer' }}>
                        {!avatarUrl && <span>
                            <FiUpload size={30} color="#FFF" />
                        </span>}
                        <input type='file' accept="image/png, image/jpeg" disabled={!!selectedProduct} onChange={handleFile}></input>
                        {!!avatarUrl && (
                            <img
                                className={styles.preview}
                                src={avatarUrl}
                                alt="Foto do produto"
                                width={250}
                                height={250}
                            />
                        )}
                    </label>

                    <select value={selectedProduct ? selectedProduct.category_id : selectedCategory ? selectedCategory : categories[0].id} disabled={!!selectedProduct} onChange={handleChangeCategory}>
                        {categories.map((item, key) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            )
                        })}
                    </select>

                    <Input
                        type="text"
                        placeholder="Digite o nome do produto"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />

                    <Input
                        type="text"
                        placeholder="Preço do produto"
                        className={styles.input}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} />

                    <textarea
                        placeholder="Descreva seu produto..."
                        className={styles.input}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />

                    <div className={styles.buttonContainer}>
                        <button className={styles.buttonAdd} style={!!selectedProduct ? { width: '95%' } : {}} onClick={submit}>Cadastrar</button>
                        {!selectedProduct && <button className={styles.buttonAdd} onClick={clear}>Limpar</button>}
                    </div>
                </div>
            </div>
        </Modal >
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