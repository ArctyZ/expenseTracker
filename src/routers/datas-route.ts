import express from 'express';
import { getAllExpenses, getExpenseDetails, createExpense,updateExpense,deleteExpense, getTotalExpenseByCategory, getTotalExpenseByDate } from '../controllers/tracker-controllers.js';


const router = express.Router();

router.route('/list').get(getAllExpenses).post(createExpense);
router.route('/list/:id').get(getExpenseDetails).put(updateExpense).delete(deleteExpense)
router.route('/category/:category').get(getTotalExpenseByCategory)
router.route('/date').get(getTotalExpenseByDate)


export default router