import { getExpense } from "../utils/getExpense.js";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

const filePath = "./src/data/db.json";

export async function getAllExpenses(req: Request ,res: Response){
    try {
        const expensesLists = await getExpense();
        res.status(200).json({ message: "Success getting all expenses list.",expensesLists});
      } catch (error) {
        console.log(error);
      }
}

export async function getExpenseDetails(req: Request ,res: Response){
    try {
        const expenses = await getExpense();
        const expense = expenses.find((expense: { id: string }) => {
          return expense.id === req.params.id;
        });
    
        if (!expense) {
          res.status(404).json({ message: "We can't find the item." });
        }
        res.status(200).json({ expense });
      } catch (error) {
        console.log(error);
      }
}

export async function createExpense(req: Request ,res: Response){
    try {
        const { title, nominal, type, category } = req.body;
        if(title && nominal && category && type){
            const data = await getExpense();
            let date = new Date;
            let localDate = date.toLocaleDateString('id-ID')
            const newData = {id:uuidv4(), title, nominal, type, category, date: localDate}
            data.push(newData);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2))
            res.status(201).json({message: "success adding new data", newData})
          }else{
            res.status(400).json({message: "Required field is missing!"})
          }
    } catch (error) {
        console.log(error);
        
    }
  
}

export async function updateExpense(req: Request ,res: Response){
    try {
    const datas = await getExpense();
    const newData = req.body
    const findData = datas.findIndex((data: {id : string}) => data.id === req.params.id)
    const data = datas[findData]

    if(!data){
        res.status(404).json({Message: "Data not found."})
    }
    datas[findData] = {...data, ...newData}
    await fs.writeFile(filePath, JSON.stringify(datas, null, 2))
    res.status(200).json({Message: "update success."})

    } catch (error) {
        console.log(error);
        
    }
}

export async function deleteExpense(req: Request ,res: Response){
    try {
    const datas = await getExpense();
    const findData = datas.findIndex((data: {id : string}) => data.id === req.params.id)

    if(findData == '-1'){
        res.status(404).json({Message: "Data not found."})
    }
    
    datas.splice(findData, 1)
    await fs.writeFile(filePath, JSON.stringify(datas, null, 2))
    res.status(200).json({Message: "data deleted."})

    } catch (error) {
        console.log(error);
        
    }
}


export async function getTotalExpenseByCategory(req: Request, res: Response){
    try {
        const expensesLists = await getExpense();
        let filteredExpense = expensesLists.filter((expense: {category: string, nominal : string}) => expense.category == req.params.category)
        let total = 0
        filteredExpense.forEach((expense: {nominal: number}) => total += expense.nominal)
        res.status(200).json({message : `Total expense dari category ${req.params.category} adalah ${total.toLocaleString('id-ID')}`})

    } catch (error) {
        console.log(error);
        
    }
}

//kita harus memasukan date range di body request terlebuh dahulu
export async function getTotalExpenseByDate(req: Request, res: Response){
    try {
        const expensesLists = await getExpense();
        const {date_start, date_end} = req.body;
        const splitDateStart = date_start.split('/')
        const splitDateEnd = date_end.split('/')
        const filteredDateExpense = expensesLists.filter((expense: {date: string}) => {
            let splitDateNow = expense.date.split('/')
            if(splitDateNow[2] == splitDateStart[2] || splitDateNow[2] == splitDateEnd[2]){
                if(splitDateNow[1] == splitDateStart[1] || splitDateNow[1] == splitDateEnd[1]){
                    if(Number(splitDateNow[0]) >= Number(splitDateStart[0]) && Number(splitDateNow[0]) <= Number(splitDateEnd[0])){
                        return expense;
                    }
                }
            }
            
        })
        let total = 0;
        filteredDateExpense.forEach((expense: {nominal: number}) => total += expense.nominal)
        res.status(200).json({message : `Total expense dari tanggal ${date_start} sampai tanggal ${date_end} adalah ${total.toLocaleString('id-ID')}`})


    } catch (error) {
        console.log(error);
        
    }
}