import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/home.module.scss'

import logoImg from '../../../public/logo.svg'

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import Link from 'next/link'
export default function SignUp() {
    return (
        <>
            <Head>
                <title>Cadastre-se</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoImg} alt="Pizzaria" />

                <div className={styles.login}>

                    <h1>Criando sua conta</h1>

                    <form>

                        <Input
                            placeholder='Digite seu nome'
                            type="text" />


                        <Input
                            placeholder='Digite seu email'
                            type="email" />

                        <Input
                            placeholder='Senha'
                            type="password" />

                        <Button
                            type="submit"
                            loading={false}
                        >
                            Cadastrar
                        </Button>

                    </form>
                    <Link legacyBehavior href="/">
                        <a className={styles.text}>Já possui uma conta? <b>Faça login!</b></a>
                    </Link>
                </div>
            </div>
        </>
    )
}
