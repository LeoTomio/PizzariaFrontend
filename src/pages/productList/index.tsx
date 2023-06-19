import { ProductList, ProductProps } from "@/src/components/ListProduct";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRauth";
import { modalProductType } from "@/src/utils/enum";



export default function teste({ productList: listProduct, categoryList }: ProductProps){
    return(
        <ProductList
        categoryList={categoryList}
        productList={listProduct}
        modalType={modalProductType.cardapio}
        />
    )

}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const productResponse = await apiClient.get('/product/')
    const categoryResponse = await apiClient.get('/category/')
    return {
        props: {
            productList: productResponse.data,
            categoryList: categoryResponse.data
        }
    }
})