import Head from "next/head";
import styles from './styles.module.scss'

import { canSSRAuth } from "@/src/utils/canSSRauth";
import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/ui/Input";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, useState } from "react";
import { setupAPIClient } from "@/src/services/api";

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
        setSelectedCategory(event.target.value)

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
                    <form className={styles.form}>


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
                            <button className={styles.buttonAdd} type='reset'>
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