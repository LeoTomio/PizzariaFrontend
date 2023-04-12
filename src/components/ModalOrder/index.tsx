import Modal from 'react-modal'
import styles from './style.module.scss'

import { FiX } from 'react-icons/fi'
import { OrderItemProps } from '@/src/pages/dashboard';
import { useState, useEffect } from 'react';

interface ModalOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    order: OrderItemProps[];
    handleFinishOrder: (id: string) => void;
}


export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {

    const [totalPrice, setTotalPrice] = useState<number>(0)

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%,-50%)',
            backgroundColor: '#1d1d2e'
        }
    }


    useEffect(() => {
        const orderTotal = order.reduce((total, item) => {
            return total + item.amount * Number(item.product.price);
        }, 0);

        setTotalPrice(orderTotal);
    }, [order]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >

            <button type="button"
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background: 'transparent', border: 'none' }}
            >
                <FiX size={45} color="#f34748" />
            </button>

            <div className={styles.container}>
                <h2>Detalhes do pedido</h2>
                <span className={styles.table}>
                    Mesa: <strong> {order[0].order.table}</strong>
                </span>
                {order.map(item => {

                    return (
                        <section key={item?.id} className={styles.containerItem}>
                            <span >{item?.amount} - <strong>{item?.product.name}</strong> ( R$ {item?.product.price}. Un)</span>
                            <span className={styles.description}>{item?.product.description}</span>
                            <span className={styles.totalPerItem}> Total:  <span className={styles.itemPrice}>R$ {(item?.amount * Number(item.product.price)).toFixed(2)}</span></span>
                        </section>
                    );
                })}

                <div>
                    <span className={styles.totalOrder}>
                        Total do Pedido:R$ {totalPrice.toFixed(2)}
                    </span>
                </div>
                <div style={{textAlign:'center'}}>
                    <button className={styles.buttonOrder} onClick={() => handleFinishOrder(order[0].order_id)}>Concluir pedido</button>
                </div>
            </div>



        </Modal >
    )
}