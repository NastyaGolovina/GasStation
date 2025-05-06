const express = require('express');
const app = express();
const cors = require('cors');
const { PythonShell } = require('python-shell');
const { v4: uuidv4 } = require('uuid');


let codeRunRequests = [];
let pyshell;

const pyCodePath = "D:/UPT/4th Semester/WTL/xampp/xampp/htdocs/GasStation/python";
const pyPath = "C:/Python313/python.exe";
const pyCodeFileName = "language.py";

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API endpoint
app.post('/api/runcode', async (req, res) => {
    try {

        const requestId = uuidv4();

        if (req && req.body.code !== undefined && req.body.code !== "")
        {
            codeRunRequests.push({id:requestId, code: req.body.code, completed: false})
        }
        //console.log(codeRunRequests);
        let options = {
            scriptPath: pyCodePath,
            pythonPath: pyPath,
            args: [req.body.code],
        };

        pyshell = new PythonShell(pyCodeFileName, options);

        pyshell.on('message', function (message) {
            addResultToRequest(message, requestId, false)
        });

        pyshell.end(function (err, code, signal) {
            if (err) {
                addResultToRequest("Python error: " + err, requestId, false);
                console.error("Python error:", err);
            }
            addResultToRequest("Exit code:" + code, requestId, false);
            console.log("Exit code:", code);
            addResultToRequest("Signal:" + signal, requestId, true);
            console.log("Signal:", signal);
            console.log(codeRunRequests);
        });

        // Send response
        res.json({id : requestId});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function addResultToRequest(message, id, completed)
{
    const runRequest = codeRunRequests.find(obj => obj.id === id);
    if (runRequest)  {
        runRequest.result = runRequest.result !== undefined ? runRequest.result+message : message;
        runRequest.result += "</br>";
        runRequest.completed = completed;
    }
    //console.log(codeRunRequests);
}

app.get('/api/runresult', async (req, res) => {
    try {
        let thisId = req.query.id;
        let resp;
        if (req && thisId !== undefined && thisId !== "")
        {
            const runRequest = codeRunRequests.find(obj => obj.id === thisId);
            if (runRequest)  {
                resp = {id:runRequest.id,
                    completed: runRequest.completed,
                    output: runRequest.completed === true ? runRequest.result : ""};
            }
        }

        // Send response
        res.json(resp);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));