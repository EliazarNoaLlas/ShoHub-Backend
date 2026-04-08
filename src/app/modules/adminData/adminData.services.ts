import { prisma } from "../../../db/db"

const metaData = async()=>{
    const orders = await prisma.order.count();
    const price = await prisma.order.aggregate({
        _sum: {
            totalPrice:true,
        }
    });
    const products = await prisma.product.count();
    const totalSales = price._sum.totalPrice
    return {
        totalSales,
        orders,
        products
    }

}

export const adminDataServices = {metaData}