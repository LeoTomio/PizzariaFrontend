import { Header } from "@/src/components/Header";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import Modal from 'react-modal'

import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import styles from './styles.module.scss';
import { FiX } from "react-icons/fi";

interface ModalCategoryProps {
    isOpen: boolean;
    onRequestClose: () => void;
}


export function CategoryModal({ isOpen, onRequestClose }: ModalCategoryProps) {

    const [name, setName] = useState<string>('')



    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!name) {
            return
        }
        const apiClient = setupAPIClient();
        await apiClient.post('/category', { name })
        toast.success('Categoria cadastrada com sucesso!')
        setName('')
        onRequestClose()

    }


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
                    <button className={styles.buttonAdd} onClick={handleRegister}>
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

