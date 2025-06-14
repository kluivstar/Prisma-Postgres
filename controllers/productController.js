const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createProduct = async(req, res) => {
    try {
        if(!req.body.name) {
            return res.status(422).json({
                error: "Name is required"
            })
        }

        if(!req.body.price) {
            return res.status(422).json({
                error: "Price is required"
            })
        } else {
            if (typeof req.body.price !== 'number' || req.body.price < 0){
                return res.status(422).json({ error: 'Price must be a non negative number'})
            }
        }
        if(!req.body.categoryId) {
            return res.status(422).json({
                error: "Category id is required"
            })
        } else {
            if (typeof req.body.price !== 'number' || req.body.price < 0){
                return res.status(422).json({ error: 'Category id not found'})
            }
        }

        const newProduct = await prisma.product.create({
            data: req.body,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            
            omit: {
                categoryId: true
            }
    })
    return res.status(201).json(newProduct)

    } catch(error) {
        return res.status(500).json({error: error.message})
    }
    
}

exports.getProducts = async(req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            omit: {
                categoryId: true
            }
        })
        return res.status(201).json(products)
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
    
}

exports.getProductById = async(req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(req.params.id)
            },

            include: {
                category: {
                    select:{
                        id: true,
                        name: true
                    }
                }
            },
            omit: {
                categoryId: true
            }
        })
        if (!product) {
            return res.status(404).json({ error: 'Product not found'})
        }
        return res.status(201).json(product)
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
    
}

exports.updateProduct = async (req, res) => {
}

exports.deleteProduct = async (req, res) => {
}

exports.getProductsByCategoryId = async (req, res) => {
    try {
        if (!await prisma.category.findUnique({ where: { id: parseInt(req.params.categoryId) } })) {
            return res.status(404).json({ error: 'Category id not found' })
        }

        const products = await prisma.product.findMany({
            where: {
                categoryId: parseInt(req.params.categoryId)
            },

            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },

            omit: {
                categoryId: true
            },
            
            orderBy: {
                name: 'asc'
            }
        })

        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ error: error.message })  
    }
}