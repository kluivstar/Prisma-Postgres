const router = require('express').Router()

const productController = require('../controllers/categoryController')

router.post('/', productController.createProduct)
router.get('/', productController.getProduct)
router.get('/:id', productController.getProductById)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
router.get('/category/:categoryId', productController.getProductsByCategoryId)

module.exports = router