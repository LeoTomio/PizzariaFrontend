import Head from "next/head";
import styles from './styles.module.scss'

import { canSSRAuth } from "@/src/utils/canSSRauth";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/ui/Input";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, FormEvent, useState } from "react";
import { setupAPIClient } from "@/src/services/api";
import { toast } from "react-toastify";

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [description, setDescription] = useState<string>('')


    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [imageAvatar, setImageAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [selectedCategory, setSelectedCategory] = useState(0)


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
    //Quando voce selecionar uma nova categoria na lista 
    function handleChangeCategory(event) {
        console.log(event.target.value)
        setSelectedCategory(event.target.value)

    }


    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        try {
            const data = new FormData();
            if (!name || !price || !description || !imageAvatar) {
                toast.error("Preencha todos os campos!")
                return;
            }
            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('category_id', categories[selectedCategory].id)
            data.append('file', imageAvatar)

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data)

            toast.success('Cadastrado com sucesso!')

        } catch (error) {
            console.log(error)
            toast.error('Erro ao cadastrar!')
        }

        clear();
    }

    function clear() {
        setName('')
        setPrice('')
        setSelectedCategory(0)
        setDescription('')
        setImageAvatar(null)
        setAvatarUrl('')
    }

    return (
        <>
            <Head>
                <title>Novo produto</title>

            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo produto</h1>
                    <form className={styles.form} onSubmit={handleRegister}>


                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#FFF" />
                            </span>

                            <input type='file' accept="image/png, image/jpeg" onChange={handleFile} />

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

                        <select value={selectedCategory} onChange={handleChangeCategory}>
                            {categories.map((item, key) => {
                                return (
                                    <option key={item.id} value={key}>
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
                            <button className={styles.buttonAdd} type='submit'>
                                Cadastrar
                            </button>
                            <button className={styles.buttonAdd} type='reset' onClick={clear}>
                                Limpar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')

    return {
        props: {
            categoryList: response.data
        }
    }
})