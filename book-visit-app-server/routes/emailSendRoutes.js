const { Router } = require('express')
const activationEmailRouter = require('../controllers/activationEmailRoutes')

const router = Router()

router.post('/send-email', activationEmailRouter.sendVerEmail)
router.post('/confirmation-email', activationEmailRouter.confirmOrderEmail)
router.get('/active', activationEmailRouter.activationFromEmail)

module.exports = router