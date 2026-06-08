import { Router } from 'express';

const router = Router();

router.get('/:user') // WORKING
router.post('/:user') // NOT IMPLEMENTED
router.put('/address') // NOT IMPLEMENTED
router.delete('/address') // NOT IMPLEMENTED

export default router;
