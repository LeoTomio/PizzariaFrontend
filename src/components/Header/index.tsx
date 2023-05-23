import { useContext } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'

import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'

export function Header() {

    const { user, signOut } = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>

                <Link href="/dashboard" legacyBehavior>
                    <img src="/logo.svg" width={190} height={60} />
                </Link>

                {/*<div className={styles.userDiv}><h2><b>Usuario:</b> {user?.name}</h2></div>*/}
                <nav className={styles.menuNav}>
                    {/* O que ta no href tem que ser igual o nome da pasta */}
                    <Link href="/category" legacyBehavior>
                        <a>Categoria</a>
                    </Link>

                    <Link href="/product" legacyBehavior>
                        <a>Produtos</a>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#fff' size={24} />
                    </button>
                </nav>

            </div>
        </header>
    )

}