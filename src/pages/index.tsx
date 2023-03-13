import { useContext, FormEvent, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import logoImg from '../../public/logo.svg'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { AuthContext } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import Link from 'next/link'

import { GetServerSideProps } from 'next'
import { canSSRGuest } from '../utils/casSSRguest'

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();


    if (email === '' || password === '') {
      toast.warning('preencha os dados')
      return;
    }

    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false)


  }

  return (
    <>
      <Head>
        <title>Pizzaria - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Pizzaria" />
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu email'
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }} />

            <Input
              placeholder='Senha'
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} />

            <Button
              type="submit"
              loading={loading}>
              Acessar
            </Button>

          </form>
          <Link legacyBehavior href="/signup">
            <a className={styles.text}>Não possui uma conta? <b>Cadastre-se</b></a>
          </Link>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {

    }
  }

})