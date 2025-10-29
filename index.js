import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app. use (express. json ());
app. use(express. static ('Assign3_Workspace/dist/assign3-workspace/browser'));
const port = process.env.PORT || 3000;
app.listen (port,() => {
    console.log("listening", port)
});


import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var tokenKey = process.env.FINNHUB_TOKEN;
var highChartsTokenKey = process.env.POLYGON_TOKEN;

const today = new Date();
var currentDate = today.getTime();

var newMonth, newDay, finalDate;


// const app = express();

app.use(cors());

var ticker;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/insertIntoWatchlistData', async (req, res) => {
    try {
        await client.connect();
        const { tickerSymbol, companyName } = req.query;
        await insert(tickerSymbol, companyName);
        console.log("Data Inserted");
        res.status(200).json({ message: "Data is Inserted Successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Data could not be inserted' });
        console.log('Data could not be fetched');
    }
})

async function insert(tickerSymbol, companyName) {
    try {
        await client.connect();
        const database = client.db("WebTech");
        const collection = database.collection("favourites");
        const doct = {
            tickerSymbol: tickerSymbol,
            CompanyName: companyName,
        }
        const result = await collection.insertOne(doct);
        console.log("printed");
        console.log(result.insertedId);
    } finally {
        // await client.close();
    }
}

app.get('/deleteFromWatchlist', async (req, res) => {
    try {
        await client.connect();
        const { tickerSymbol } = req.query;
        await deletefromWishlist(tickerSymbol);
        console.log("Data deleted");
        res.status(200).json({ message: "Data is Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Data could not be deleted' });
        console.log('Data could not be fetched');
    }
})

async function deletefromWishlist(tickerSymbol) {
    try {
        await client.connect();
        const database = client.db("WebTech");
        const collection = database.collection("favourites");

        const result = await collection.deleteOne({ tickerSymbol: tickerSymbol });
        console.log("The deleted entry is ", result);
    } finally {
        // await client.close();
    }
}

app.get('/getWatchlistData', async (req, res) => {
    try {
        await client.connect();
        console.log("inside getWatchlist data");
        const allData = await get();
        console.log(allData);
        res.json(allData);
    } catch (error) {
        console.log('Data could not be fetched');
    }
})

async function get() {
    try {
        await client.connect();
        console.log("inside get data");
        await client.connect();
        let responseData = [];
        const database = client.db("WebTech");
        const collection = database.collection("favourites");

        const pointer = await collection.find().toArray();
        // console.log(pointer);

        for (const document of pointer) {
            console.log(document);
            const tickerSymbol = document.tickerSymbol;
            const companyName = document.CompanyName;
            try {
                const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${tokenKey}`);
                var data = response.data;
                responseData.push({ ticker: tickerSymbol, companyName: companyName, currentPrice: data.c, change: data.d, changePercent: data.dp });
            } catch (error) {
                console.error("Failed to fetch data for:", tickerSymbol, error);
            }
        }
        console.log(responseData);
        return responseData;
    } finally {
        // console.log("data not fetched");
        // await client.close();
    }
}

app.get('/portfolioComponent', async (req, res) => {
    try {
        await client.connect();
        const allData = await getPortfolioComponent();
        console.log(allData);
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ message: "Data could not be fetched" });
        console.log('Data could not be fetched');
    }
})

async function getPortfolioComponent() {
    try {
        console.log("inside getPortfolio data");
        await client.connect();
        let responseData = [];
        const database = client.db("WebTech");
        const collection = database.collection("PortfolioCollection");

        const walletCollection = database.collection("wallet");

        const walletDoc = await walletCollection.findOne();
        const walletAmount = walletDoc.wallet; 

        const pointer = await collection.find().toArray();

        for (const document of pointer) {
            console.log(document);
            const id = document._id;
            const tickerSymbol = document.tickerSymbol;
            const companyName = document.companyName;
            const quantity = document.quantity;
            const totalCost = document.totalCost;
            
            try {
                const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${tokenKey}`);
                var data = response.data;
                responseData.push({ id: id, ticker: tickerSymbol, companyName: companyName, currentPrice: data.c, quantity: quantity, totalCost: totalCost, wallet: walletAmount });
            } catch (error) {
                console.error("Failed to fetch data for:", tickerSymbol, error);
            }
        }
        console.log(responseData);
        return responseData;
    } finally {
        // await client.close();
    }
}


app.get('/insertOrUpdatePortfolioComponent', async (req, res) => {
    try {
        const { tickerSymbol, companyName, quantity, currentPrice, transactionType } = req.query;
        // console.log("inside getWatchlist data");
        await insertOrUpdatePortfolioComponent(tickerSymbol, companyName, parseFloat(quantity), parseFloat(currentPrice), transactionType);
        res.status(200).json({ message: "Data is Inserted or Update in Portfolio Component Successfully" });
    } catch (error) {
        console.log('Data could not be Update or Inserted');
    }
})

// async function insertOrUpdatePortfolioComponent(tickerSymbol, companyName, quantity, currentPrice) {
//     try {
//         await client.connect();
//         const database = client.db("WebTech");
//         const collection = database.collection("PortfolioCollection");

//         const filter = { tickerSymbol: tickerSymbol};


//         const updateDoc = {
//             $setOnInsert: { tickerSymbol:tickerSymbol, companyName: companyName }, 
//             $inc: {
//                 quantity: quantity, 
//                 totalCost: quantity * currentPrice 
//             }
//         };

//         const options = { upsert: true };

//         const result = await collection.updateOne(filter, updateDoc, options);

//         if (result.upsertedCount > 0) {
//             console.log("One document was inserted");
//         } else if (result.modifiedCount > 0) {
//             console.log(`One document was updated.`);
//         } else {
//             console.log('No changes were made (the document did not exist but upsert was set to true).');
//         }

//     } catch (error) {
//         console.error(`Failed to insert or update document: ${error}`);
//     } finally {
//         await client.close();
//     }
// }

// async function insertOrUpdatePortfolioComponentt(tickerSymbol, companyName, quantity, currentPrice, transactionType) {
//     try {
//         await client.connect();
//         const database = client.db("WebTech");
//         const collection = database.collection("PortfolioCollection");
//         const walletCollection = database.collection("wallet");
//         const walletFilter = { money: "money" };

//         const transactionAmount = quantity * currentPrice;
//         let walletUpdate;

//         if (transactionType === 'buy') {
//             walletUpdate = { $inc: { wallet: -transactionAmount } };
//         } else if (transactionType === 'sell') {
//             walletUpdate = { $inc: { wallet: transactionAmount } };
//         } else {
//             throw new Error('Invalid transaction type');
//         }

//         const walletResult = await walletCollection.updateOne(walletFilter, walletUpdate);

//         // Now update the portfolio
//         const filter = { tickerSymbol: tickerSymbol };
//         const updateDoc = {
//             $setOnInsert: { tickerSymbol: tickerSymbol, companyName: companyName },
//             $inc: {
//                 quantity: transactionType === 'sell' ? -quantity : quantity,
//                 totalCost: transactionType === 'sell' ? -transactionAmount : transactionAmount
//             }
//         };
//         const options = { upsert: true };
//         const result = await collection.updateOne(filter, updateDoc, options);

//         if (result.upsertedCount > 0) {
//             console.log("One document was inserted");
//         } else if (result.modifiedCount > 0) {
//             console.log("One document was updated.");
//         } else {
//             console.log("No changes were made (the document did not exist but upsert was set to true).");
//         }
//         // const walletDoc = await walletCollection.findOne(walletFilter);
//         // return walletDoc.amount; 

//     } catch (error) {
//         console.error(`Failed to insert or update document: ${error}`);
//     } finally {
//         await client.close();
//     }
// }

// async function insertOrUpdatePortfolioComponent(tickerSymbol, companyName, quantity, currentPrice, transactionType) {
//     try {
//         await client.connect();
//         const database = client.db("WebTech");
//         const collection = database.collection("PortfolioCollection");
//         const walletCollection = database.collection("wallet");
//         const walletFilter = { money: "money" };

//         const transactionAmount = quantity * currentPrice;
//         let walletUpdate;

//         // if (transactionType === 'buy') {
//         //     walletUpdate = { $inc: { wallet: -transactionAmount } };
//         // } else if (transactionType === 'sell') {
//         //     walletUpdate = { $inc: { wallet: transactionAmount } };
//         // } else {
//         //     throw new Error('Invalid transaction type');
//         // }


//         if (transactionType === 'buy') {
//             walletUpdate = { $inc: { wallet: -transactionAmount } };
//         } else if (transactionType === 'sell') {
//             const portfolioDoc = await collection.findOne({ tickerSymbol: tickerSymbol });
//             const avgCostPerUnit = portfolioDoc ? portfolioDoc.totalCost / portfolioDoc.quantity : 0;
//             const totalCost = avgCostPerUnit * quantity;
//             walletUpdate = { $inc: { wallet: transactionAmount } };
//         } else {
//             throw new Error('Invalid transaction type');
//         }

//         const walletResult = await walletCollection.updateOne(walletFilter, walletUpdate);
//         console.log("Wallet update result:", walletResult.modifiedCount);

//         // Now update the portfolio
//         const filter = { tickerSymbol: tickerSymbol };
//         const updateDoc = {
//             $setOnInsert: { tickerSymbol: tickerSymbol, companyName: companyName },
//             $inc: {
//                 quantity: transactionType === 'sell' ? -quantity : quantity,
//                 totalCost: transactionType === 'sell' ? -totalCost : transactionAmount
//             }
//         };
//         const options = { upsert: true };
//         const result = await collection.updateOne(filter, updateDoc, options);
//         console.log("Portfolio update result:", result);

//         // Check the updated document to decide on deletion
//         const updatedDoc = await collection.findOne({ tickerSymbol: tickerSymbol });
//         if (updatedDoc && updatedDoc.quantity === 0) {
//             // Delete the document if the quantity is zero
//             await collection.deleteOne({ tickerSymbol: tickerSymbol });
//             console.log("Document deleted as quantity is zero.");
//         } else {
//             if (updatedDoc) {
//                 console.log(`Updated document: ${updatedDoc.quantity} left for ${tickerSymbol}`);
//             } else {
//                 console.log("No document found after update, which should not happen with upsert true.");
//             }
//         }
//     } catch (error) {
//         console.error(`Failed to insert or update document: ${error}`);
//     } finally {
//         await client.close();
//     }
// }

async function insertOrUpdatePortfolioComponent(tickerSymbol, companyName, quantity, currentPrice, transactionType) {
    try {
      await client.connect();
      const database = client.db("WebTech");
      const collection = database.collection("PortfolioCollection");
      const walletCollection = database.collection("wallet");
      const walletFilter = { money: "money" };

      
  
      const transactionAmount = quantity * currentPrice;
      console.log("The transaction amount is ",transactionAmount);
      let walletUpdate, totalCost;
  
      if (transactionType === 'buy') {
        console.log("I bought");
        walletUpdate = { $inc: { wallet: -transactionAmount } };
        totalCost = transactionAmount; 
      } else if (transactionType === 'sell') {
        console.log("I sold");
        const portfolioDoc = await collection.findOne({ tickerSymbol: tickerSymbol });
        if (!portfolioDoc) {
          throw new Error('Portfolio document not found for ticker: ' + tickerSymbol);
        }
        const avgCostPerUnit = portfolioDoc.totalCost / portfolioDoc.quantity;
        totalCost = avgCostPerUnit * quantity; 
        walletUpdate = { $inc: { wallet: transactionAmount } };
      } else {
        throw new Error('Invalid transaction type');
      }
  
      // Update wallet
      const walletResult = await walletCollection.updateOne(walletFilter, walletUpdate);
      console.log("Wallet update result:", walletResult.modifiedCount);
  
      // Update portfolio
      const filter = { tickerSymbol: tickerSymbol };
      const updateDoc = {
        $setOnInsert: { tickerSymbol: tickerSymbol, companyName: companyName },
        $inc: {
          quantity: transactionType === 'sell' ? -quantity : quantity,
          totalCost: transactionType === 'sell' ? -totalCost : totalCost
        }
      };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, updateDoc, options);
    //   console.log("Portfolio update result:", result);
  
      // Check the updated document to decide on deletion
      const updatedDoc = await collection.findOne({ tickerSymbol: tickerSymbol });
      if (updatedDoc && updatedDoc.quantity <= 0) {
        // Delete the document if the quantity is zero or negative
        await collection.deleteOne({ tickerSymbol: tickerSymbol });
        console.log("Document deleted as quantity is zero or negative.");
      } else {
        console.log(`Updated document: ${updatedDoc.quantity} left for ${tickerSymbol}, Total Cost: ${updatedDoc.totalCost}`);
      }
    } catch (error) {
      console.error(`Failed to insert or update document: ${error}`);
    } finally {
      console.log("hello");
    }
  }





// async function insertOrUpdatePortfolioComponent(tickerSymbol, companyName, quantity, currentPrice){
//     try {
//         await client.connect();
//         const database = client.db("WebTech");
//         const collection = database.collection("PortfolioCollection");

//         const filter = { tickerSymbol: tickerSymbol };

//         const update = {
//             $set: {
//                 companyName: companyName,
//                 quantity: quantity,
//                 totalCost: quantity * currentPrice
//             }
//         };

//         const options = { upsert: true };

//         const result = await collection.updateOne(filter, update, options);

//         if (result.upsertedCount > 0) {
//             console.log(`One document was inserted with the id ${result.upsertedId._id}`);
//         } else if (result.modifiedCount > 0) {
//             console.log(`One document was updated.`);
//         } else {
//             console.log('No changes were made to the documents.');
//         }

//     } catch (error) {
//         console.error(`Failed to insert or update document: ${error}`);
//     } finally {
//         await client.close();
//     }
// }


// get().catch(console.dir);

// insert().catch(console.dir);

function getPastDate(year, month, day) {
    const before = new Date();
    before.setFullYear(before.getFullYear() - year);
    before.setMonth(before.getMonth() - month);
    before.setDate(before.getDate() - day);
    return before.getTime();
}

function formatDateforNews(days) {
    var date = new Date();
    date.setMonth(date.getMonth());
    date.setDate(date.getDate() - days);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        newMonth = '0' + month;
    } else {
        newMonth = month;
    }
    if (day < 10) {
        newDay = '0' + day;
    } else {
        newDay = day;
    }
    finalDate = year + '-' + newMonth + '-' + newDay;

    return finalDate;
}

app.get('/companyDescription', async (req, res) => {
    try {
        ticker = req.query.symbol;
        console.log(ticker);
        console.log(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${tokenKey}`);
        const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${tokenKey}`);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/historicalData', async (req, res) => {
    try {
        var startDate = getPastDate(2, 0, 0);
        //console.log(startDate);
        var ticker = req.query.symbol;
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${currentDate}?adjusted=true&sort=asc&apiKey=${highChartsTokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.error('Data could not be fetched', error.message, error.response?.data);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

app.get('/latestPrice', async (req, res) => {
    try {
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/autoComplete', async (req, res) => {
    try {
        const q = req.query.query;
        const url = `https://finnhub.io/api/v1/search?q=${q}&token=${tokenKey}`
        console.log(url);
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${q}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/companyNews', async (req, res) => {
    try {
        // var startDate = getPastDate(0,7);
        currentDate = formatDateforNews(0);
        var fromDate = formatDateforNews(7);
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${currentDate}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.error('Data could not be fetched', error.message, error.response?.data);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

app.get('/recommendationTrends', async (req, res) => {
    try {
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/insiderSentiment', async (req, res) => {
    try {
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/companyPeers', async (req, res) => {
    try {
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/companyEarnings', async (req, res) => {
    try {
        var ticker = req.query.symbol;
        const response = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${tokenKey}`);
        const data = response.data;

        res.json(data);
    } catch (error) {
        console.log('Data could not be fetched');
        // res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/summaryData', async (req, res) => {
    try {
        var ticker = req.query.symbol;

        // var startDate = getPastDate(6, 1);
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        console.log("the dates appear here");
        console.log(startDate);
        console.log(endDate);

        // highChartsTokenKey = "";

        //console.log(startDate);
        console.log(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${endDate}/${startDate}?adjusted=true&sort=asc&apiKey=${highChartsTokenKey}`);
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${endDate}/${startDate}?adjusted=true&sort=asc&apiKey=oOU0U7vwORYQQPnrX5aLBOSTstHyw1sz`);
        //https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${endDate}/${startDate}?adjusted=true&sort=asc&apiKey=oOU0U7vwORYQQPnrX5aLBOSTstHyw1sz`
        const data = response.data;
        // console.log(data);
        res.json(data);
    } catch (error) {
        console.error('Data could not be fetched', error.message, error.response?.data);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });


