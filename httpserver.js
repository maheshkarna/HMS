const path = require("path");
const { app } = require('electron');
var fs = require("fs");
const os = require('os');
const express = require("express");
let fileNames = [];
const http = require("http");
const socketio = require("socket.io");
const iconv = require('iconv-lite');
let testval = "0.0";
let sp = "";
var bodyParser = require('body-parser')
const videoHelperObj = require("./videohelper.js");
const busboy = require("connect-busboy");
const form = require("connect-form");
const multer = require("multer");
const axios = require('axios');//FOR API REQUAST
const querystring = require('querystring');//FOR API REQUAST
const FormData = require('form-data');

const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
// const Readline = SerialPort.parsers.Readline;
// const Readline = require('@serialport/parser-readline');
const { ReadlineParser } = require('@serialport/parser-readline');
//const Readline = require('readline');
//const { Transform } = require('stream');
const rl = '';
const concatStream = '';
let logopath = "";
const machineId = require('node-machine-id');
const CryptoJS = require('crypto-js');
let ciphertext = "";
let plaintext = "";
let secretKey = ""; /// Skey = machineId_endDate;
let cc = "";

// const parser=new Readline();
const server = http.createServer();
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./www/files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});



const logoAttachment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./www/logo/");
  },
  filename: function (req, file, cb) {

    logopath = "./logo/" + file.originalname;

    cb(null, file.originalname);

  },
});



const QRCode = require('qrcode-generator');
const { send } = require("process");
// const attachgStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./www/attachments/");
//   },
//   filename: function (req, file, cb) {
//    // cb(null, req.body.docnum + '-' + Date.now() + '.png') // set the filename to docnum-timestamp-filename
//     const randomNumber = Math.floor(Math.random() * 10000);
//     const fileExtension = file.originalname.split('.').pop();
//     const newFilename = `${req.body.docnum}-${randomNumber}.${fileExtension}`;
//     cb(null, newFilename);
//     fileNames.push = newFilename;
//     // cb(null, file.originalname);
//   },
// });


const attachgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./www/attachments/");
  },
  filename: function (req, file, cb) {
    const randomNumber = Math.floor(Math.random() * 10000);
    const fileExtension = file.originalname.split('.').pop();
    const newFilename = `${req.body.docnum}-${randomNumber}.${fileExtension}`;
    fileNames.push("attachments/" + newFilename); // add this line to push the filename to the fileNames array
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: attachgStorage });
const upload3 = multer({ storage: logoAttachment });


let httpserver = {
  root: path.join(__dirname, "./www/"),
  port: 8686,
  host: "localhost",
  exObj: express(),
  intialize: () => {
    httpserver.exObj.use(express.static(httpserver.root));
    httpserver.exObj.use(bodyParser.json());
    // httpserver.exObj.get("/", function (request, response) {
    //   response.send("Hello!!");
    // });
    // httpserver.exObj.get("/*", function (req, response, next) {
    //   response.setHeader("Last-Modified", new Date().toUTCString());
    //   next();
    // });


    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    // QR Saving
    httpserver.exObj.post("/makeQR", urlencodedParser, function (request, response) {
      // const QRPath = request.params.QRPath || request.query.QRPath;
      //console.log(request.body.QRPath);
      const QRPath = request.body.QRPath;
      const qr = QRCode(0, 'L');
      qr.addData(QRPath);
      qr.make();
      // Get the QR code image data as a base64-encoded string
      const imageDataUrl = qr.createDataURL();
      // Write the image data to a file
      const filePath = './www/qrcode/' + QRPath + '.png';
      const data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(filePath, data, { encoding: 'base64' });
      response.send(`QR code saved to ${filePath}`);
    });


    /////////// Report Excel Send To Mail ////////
    httpserver.exObj.get("/mailSendExel", function (request, response) {
      let encodedData = request.query.data;
      let decodedData = decodeURIComponent(encodedData);
      let tableData = JSON.parse(decodedData);
      // Do your Excel and email processing here
      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet('Table Data');
      // Add date-wise report heading (merge cells)
     
      let title = request.query.title; // Access the title parameter 
      let email = request.query.email; // Access the title parameter 

      console.log("Title:", title);
      console.log("Table Data:", tableData);

      worksheet.mergeCells('A1:K1'); // Merge cells A1 to C1
      const reportDate = title; // Replace with your date
      worksheet.getCell('A1').value = reportDate;
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      worksheet.getCell('A1').font = { bold: true, size: 14 };

      tableData.forEach(row => {
          worksheet.addRow(row);
      });
  
      let excelFilePath = path.join(__dirname, './www/files', 'Report_Sheet.xlsx'); // Path to the desired folder
      workbook.xlsx.writeFile(excelFilePath)
          .then(() => {
            console.log('Excel file saved successfully');
              // Do your email processing here
              response.send(true); // Respond with success
          })
          .catch(error => {
              console.error('Error occurred while saving Excel file:', error);
              response.status(500).json({ error: 'An error occurred while generating the Excel file.' });
          });

      // Create a transporter using the default SMTP transport
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'spondiasindiapvt@gmail.com',
            pass: 'cbyyxdvjctrghowu',
          },
      });

      // Email content
      const mailOptions = {
        from: 'spondiasindiapvt@gmail.com',
        to: email,
        subject: 'Excel Report',
        text: 'Please find the attached Excel file.',
        attachments: [
          {
            filename: 'data.xlsx', // Replace with your file name
            path: './www/files/Report_Sheet.xlsx',
            // Use the absolute path to your Excel file, // Adjust the path to your Excel file
          },
        ],
      };

      // Send the email with the attachment
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log(true);
        }
      });
    });

    // REGISTATION API
    httpserver.exObj.get("/regAPI", function (request, response) {
      let data = request.query;
      let jsonData = JSON.stringify(data);
      axios.post('https://spondias.com/weighbridge/registerAPI.php', jsonData)
        .then(resul => {
          console.log(resul.data);
          response.send('success')
        })
        .catch(error => {
          console.error(error);
        });
    });

    // WEIGMENT API
    httpserver.exObj.get("/postAPI_WeighmentData", function (request, response) {
      let data = request.query.Wt_data;
      let img_data = request.query.Wt_Images;

      // let sData = request.query.subData;
      let cc = request.query.subData.cc;
      let action = request.query.subData.action;
      
      const dataObject = {};
      data.forEach((item, index) => {
        dataObject[index] = item;
      });

      dataObject.cc = cc;
      dataObject.action = action;
      dataObject.length = data.length;
      console.log(data.length);
      console.log(img_data)

      let maxId = request.query.maxid;
      let jsonData = JSON.stringify(dataObject);
       axios.post('https://spondias.com/weighbridge/weighmentAPI.php', jsonData)
        .then(resul => {
          console.log(resul.data);
          response.send(maxId);
        })
        .catch(error => {
          console.error(error);
        });

      /////////////////////// upload vehicle images /////////////////////

      for (let x = 0; x < img_data.imgCount; x++) {
        
        let vehicleFilePath = './www/temp/' + img_data[x];

        let formData = new FormData();
        formData.append('file', fs.createReadStream(vehicleFilePath));
        formData.append('cc', cc);
        formData.append('wbs', request.query.Wt_data[0].WBS);

        axios.post('https://spondias.com/weighbridge/weighmentAPI.php', formData, {
          headers: formData.getHeaders(),
        })
          .then((msg) => {
            console.log(msg.data);
          })
          .catch((error) => {
            console.error('Error uploading file:', vehicleFilePath, error);
          });
      }
    });


    // GET CC API
    httpserver.exObj.get("/getCC_API", function (request, response) {
      axios
        .get("https://spondias.com/weighbridge/registerAPI.php?action=cc")
        .then(apiResponse => {
          // Send the response back to the client
          function incrementString(str) {
            return str.replace(/(\d+)$/, (match, number) => {
              let incrementedNumber = parseInt(number, 10) + 1;
              return incrementedNumber.toString().padStart(number.length, '0');
            });
          }
          let incrementedString = incrementString(apiResponse.data);
          console.log(incrementedString);
          response.send(incrementedString);
        })
        .catch(error => {
          console.error(error);
          // Send an error response back to the client
          response.sendStatus(500); // Internal Server Error
        });
    });

    //// check CC Login 
    httpserver.exObj.get("/checkCClogins", function (request, response) {

      let baseUrl = 'https://spondias.com/weighbridge/registerAPI.php'; // Replace with your PHP API endpoint
      let cc = encodeURIComponent(request.query.validCC);
      let username = encodeURIComponent(request.query.username);
      let password = encodeURIComponent(request.query.password);
      let actin = encodeURIComponent("checkCC");

      let url = `${baseUrl}?cc=${cc}&username=${username}&password=${password}&action=${actin}`;

      axios.get(url)
        .then(result => {
          // Handle the result from the server
          response.send(result.data)
          console.log(result.data);
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });

    });

    // Change Password API

    httpserver.exObj.get("/changePassword_API", function (request, response) {
      let passData = request.query.passData;

      let formData = querystring.stringify(passData);
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      axios.post('https://spondias.com/weighbridge/registerAPI.php', formData, config)
        .then(result => {
          console.log(result.data);
          response.send(result.data)
        })
        .catch(error => {
          console.error('API request error:', error);
        });
    });

    ////Mail Notification API
    httpserver.exObj.get("/mail_notification", function (request, response) {
      let mailData = request.query.mailData;

      let formData = querystring.stringify(mailData);

      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      axios.post('https://spondias.com/weighbridge/registerAPI.php', formData, config)
        .then(result => {
          console.log(result.data);
          response.send(result.data)
        })
        .catch(error => {
          console.error('API request error:', error);
        });
    });

    // get mechineId
    httpserver.exObj.get("/getMechineId", function (request, response) {
      const orgLocalMachineId = machineId.machineIdSync({ original: true });
      const localMechineId = machineId.machineIdSync();
      // console.log(orgLocalMachineId);
      // console.log(localMechineId);
      response.send(orgLocalMachineId)
    });


    //  encoding of registration Key 
    httpserver.exObj.get("/encryptString", function (request, response) {
      plaintext = request.query.regKey
      secretKey = request.query.skey
      ciphertext = CryptoJS.AES.encrypt(plaintext, secretKey).toString();
      // console.log(ciphertext);
      response.send(ciphertext);
    });


    // decodeing of Registration Key
    httpserver.exObj.get("/decryptString", function (request, response) {
      ciphertext = request.query.encregkey;
      secretKey = request.query.skey;
      let bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      plaintext = bytes.toString(CryptoJS.enc.Utf8);
      // console.log(plaintext);
      response.send(plaintext);
    });


    // Creating File For Registration Key
    httpserver.exObj.get("/createFile", function (request, response) {
      let regKeyfileName = 'key.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');

      if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath);
        console.log('SpondiasWB folder created successfully!');

        let datFilePath = path.join(tempFolderPath, regKeyfileName);
        let fileContent = request.query.encregkey;

        fs.writeFileSync(datFilePath, fileContent);
        fs.chmodSync(datFilePath, '0444');
        console.log('Key file created successfully!');
        let hiddenFilePath = path.join(tempFolderPath, `.${regKeyfileName}`);
        fs.renameSync(datFilePath, hiddenFilePath);
        console.log('Key file hidden successfully!');
      } else {
        console.log('SpondiasWB folder already exists!');
      }
    });

    // Reading File For The registration Key
    httpserver.exObj.get("/readFile", function (request, response) {
      let regKeyfileName = 'key.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');
      let hiddenFileName = `.${regKeyfileName}`;
      let hiddenFilePath = path.join(tempFolderPath, hiddenFileName);
      let keyVal = "";
      if (fs.existsSync(hiddenFilePath)) {
        let fileContent = fs.readFileSync(hiddenFilePath, 'utf8');
        console.log('Hidden key file content:', fileContent);
        keyVal = fileContent;
      } else {
        console.log('Hidden key file not found!');
      }
      response.send(keyVal);
    });



    // Update Reg Key in the Given Temp File
    httpserver.exObj.get("/updateRegKey", function (request, response) {
      let regKeyfileName = 'key.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');
      let hiddenFileName = `.${regKeyfileName}`;
      let hiddenFilePath = path.join(tempFolderPath, hiddenFileName);
      let newContent = request.query.encregkey;
      if (fs.existsSync(hiddenFilePath)) {

        // Example usage
        const tempFilePath = path.join(tempFolderPath, hiddenFileName);

        // Function to delete a file
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('File deleted successfully');
            //Recreating file 
            let datFilePath = path.join(tempFolderPath, regKeyfileName);
            fs.writeFileSync(datFilePath, newContent);
            fs.chmodSync(datFilePath, '0444');
            console.log('Key file created successfully!');
            let hiddenFilePath = path.join(tempFolderPath, `.${regKeyfileName}`);
            fs.renameSync(datFilePath, hiddenFilePath);
            console.log('Key file hidden successfully!');
            response.send('Key file hidden successfully!')
          });
        }
     });

    //////////// update Key In Server API ///////////
    httpserver.exObj.get("/updateKey_Server", function (request, response) {
      let keyData = request.query.newRegKey;
      let bytes = CryptoJS.AES.decrypt(keyData, 'machineId_endDate');
      plaintext = bytes.toString(CryptoJS.enc.Utf8);
      let end_Date = (plaintext).split('.')[1];
      let data = {
        end_Date: end_Date,
        newRegKey: request.query.newRegKey,
        cc: request.query.cc,
        wbs: request.query.wbs,
        action: 'update_endDate'
      }

      let formData = querystring.stringify(data);
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      axios.post('https://spondias.com/weighbridge/registerAPI.php', formData, config)
        .then(result => {
          console.log(result.data);
          response.send(result.data)
        })
        .catch(error => {
          console.error('API request error:', error);
        });
    });


    ///////////// Checking Date //////
    //create Date File
    httpserver.exObj.get("/createCheckDateFile", function (request, response) {
      let DateFileName = 'date.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');
      if (fs.existsSync(tempFolderPath)) {
        let datFilePath = path.join(tempFolderPath, DateFileName);
        let fileContent = request.query.currentDateTime;

        fs.writeFileSync(datFilePath, fileContent);
        // fs.chmodSync(datFilePath, '0444');
        console.log('date file created successfully!');
        let hiddenFilePath = path.join(tempFolderPath, `.${DateFileName}`);
        fs.renameSync(datFilePath, hiddenFilePath);
        console.log('date file hidden successfully!');
      }
    });

    //update Date file
    httpserver.exObj.get("/updateDate", function (request, response) {
      // console.log(request.query.currentDate)
      let DateFileName = 'date.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');
      let hiddenFileName = `.${DateFileName}`;
      let hiddenFilePath = path.join(tempFolderPath, hiddenFileName);
      let newContent = request.query.currentDate;
      if (fs.existsSync(hiddenFilePath)) {
        fs.writeFileSync(hiddenFilePath, newContent)
      } else {
        fs.writeFileSync(hiddenFilePath, newContent);
        console.log('Hidden date file created!');
        response.send('date file created')
      }
    });

    //read date File
    httpserver.exObj.get("/readDateFile", function (request, response) {
      console.log('read file')
      let dateFileName = 'date.dat';
      let tempFolderPath = path.join(os.tmpdir(), 'SpondiasWB');
      let hiddenFileName = `.${dateFileName}`;
      let hiddenFilePath = path.join(tempFolderPath, hiddenFileName);
      if (fs.existsSync(hiddenFilePath)) {
        let fileContent = fs.readFileSync(hiddenFilePath, 'utf8');
        response.send(fileContent);
      }

    });
    ///// End Checking Date //////////

    // video streeming
    httpserver.exObj.get("/video", async function (request, response) {
      console.log("in video");

      await videoHelperObj.videoHelper.stream1();
      await videoHelperObj.videoHelper.stream2();
      await videoHelperObj.videoHelper.stream3();

      response.status(200).send("success");
      console.log("response sent");
    });



    ///delate all video files  of  live streems
    httpserver.exObj.get("/cleaStream", function (request, response) {
      // const folderPath = './www/Video1_Streaming/'; // replace with your folder path
      var folderPath = ['./www/Video1_Streaming/', './www/Video2_Streaming/', './www/Video3_Streaming/'];
      for (let i = 0; i < folderPath.length; i++) {
        fs.readdirSync(folderPath[i]).forEach((file) => {
          const filePath = `${folderPath[i]}/${file}`;
          fs.unlinkSync(filePath);
          console.log(`Deleted ${file}`);
        });
      }
    });



    // image Capture With Ip Camara
    httpserver.exObj.get("/getimage", function (request, response) {
      videoHelperObj.videoHelper.getImage();
      response.send("success");
    });



    // image Capture With Ip Camara
    httpserver.exObj.get("/Saveimage", urlencodedParser, async function (request, response) {
      let slipNum = request.query.slipNum;
      let CameraPathOne = request.query.ipCamURL1;
      let CameraPathTwo = request.query.ipCamURL2;
      let CameraPathThree = request.query.ipCamURL3;
      let filePath = request.query.filePath;



      // const CameraPathOne = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
      // const CameraPathTwo = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
      // const CameraPathThree = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
      /// Machavaram IP Address = rtsp://admin:123456@45.249.78.43:554/ch01.264


      // let data = app.cameraSettings.fetchData();
      //  console.log(data);
      let imageName = "";
      let imageTwoName = "";
      let imageThreeName = "";

      if (CameraPathOne != "") {
        imageName = await videoHelperObj.videoHelper.getImage(CameraPathOne, slipNum, filePath);
      }
      if (CameraPathTwo != "") {
        imageTwoName = await videoHelperObj.videoHelper.getImage(CameraPathTwo, slipNum, filePath);
      }
      if (CameraPathThree != "") {
        imageThreeName = await videoHelperObj.videoHelper.getImage(CameraPathThree, slipNum, filePath);
      }

      const images = [imageName, imageTwoName, imageThreeName];
      //  let images ="";
      response.send(images);
    });

    httpserver.exObj.get("/SaveBMRimage", urlencodedParser, async function (request, response) {
      let slipNum = request.query.slipNum;
      const CameraPathOne = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
      // let data = app.cameraSettings.fetchData();
      //  console.log(data);
      let imageName = await videoHelperObj.videoHelper.getBMRImage(CameraPathOne, slipNum);
      response.send(imageName);
    });


    httpserver.exObj.post(
      "/upload",
      upload.single("uploadFile"),
      function (request, response) {
        response.send("success");
      }
    );

    httpserver.exObj.post(
      "/uploadLogo",
      upload3.fields([{ name: 'logo' }]),
      function (request, response) {
        response.send(logopath);
      }
    );

    httpserver.exObj.post(
      "/uploadAttachments",
      upload2.fields([{ name: 'attachment_one' }, { name: 'attachment_two' }, { name: 'attachment_three' }, { name: 'attachment_four' }]),
      function (request, response) {
        // console.log("success" + fileNames);
        response.send(fileNames);
        fileNames = [];
      }
    );

  
    httpserver.exObj.listen(httpserver.port, httpserver.host);
  },


  intializeSocket: () => {
    io.on("connection", (socket) => {
      console.log("A client has connected.");
      socket.on("message", (data) => {
        console.log(`message received: ${data}`);
        io.emit("message", data); // Send the message to all connected clients
      });
      socket.on("disconnect", () => {
        console.log("A client has disconnected.");
      });
    });

    server.listen(3000, () => {
      console.log("Server is listening on port 3000.");
    });
  },
};

module.exports = { httpserver };
