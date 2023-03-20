import { canSSRAuth } from "@/src/utils/canSSRauth"
import Head from 'next/head'
import { Header } from "../../components/Header"

export default function Dashboard() {
    return (
        <>
            <Head>
                <title> Painel - Pizzaria</title>
            </Head>
            <Header />
            <h1>Painel</h1>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})