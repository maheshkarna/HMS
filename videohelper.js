const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegStatic);
//const videoTemp = "./www/temp/";
const videoPath1 = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
const videoPath2 = "rtsp://admin:123456@49.156.148.238:554/ch01.264";
const videoPath3 = "rtsp://admin:123456@49.156.148.238:554/ch01.264";



let videoHelper = {
  
  
  stream1: () => {
    return new Promise((resolve, reject) => {
  
        ffmpeg(videoPath1, { timeout: 432000 })
        .addOptions([
        "-hls_time 10", // 10 second segment duration
        "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-f hls", // HLS format
        "-max_muxing_queue_size 512"
      ])
      .output("./www/Video1_Streaming/output.m3u8")

      // ffmpeg(videoPath1, { timeout: 432000 })
      //   .addOptions([
      //     "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
      //     "-level 3.0",
      //     "-s 640x360", // 640px width, 360px height output video dimensions
      //     "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
      //     "-hls_flags delete_segments",
      //     "-hls_time 10", // 10 second segment duration
      //     "-f hls", // HLS format
          
      //   ])
      // .output("./www/Video1_Streaming/output.m3u8")


        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
          resolve();
        })
        .on("error", function (err, stdout, stderr) {
          console.log("An error occurred: " + err.message, err, stderr);
          reject();
        })
        .on("progress", function (progress) {
          // console.log("Processing: " + progress.percent + "% done");
          //console.log(progress);

          //   if (progress.percent > 1) {
          //     resolve();
          //   }
          //   def.resolve();
        })
        .on("end", function (err, stdout, stderr) {
          console.log("Finished processing!" /*, err, stdout, stderr*/);
          resolve();
        })
        .run();
    });
  },

   
  stream2: () => {
    return new Promise((resolve, reject) => {
       
      ffmpeg(videoPath2, { timeout: 432000 })
      .addOptions([
        "-hls_time 10", // 10 second segment duration
        "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-f hls", // HLS format
        "-max_muxing_queue_size 512"
      ])
      .output("./www/Video2_Streaming/output.m3u8")

      // ffmpeg(videoPath2, { timeout: 432000 })
      //   .addOptions([
      //     "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
      //     "-level 3.0",
      //     "-s 640x360", // 640px width, 360px height output video dimensions
      //     "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
      //     "-hls_flags delete_segments",
      //     "-hls_time 10", // 10 second segment duration
      //     "-f hls", // HLS format
      //    " -c:v h264 ",
      //    " -preset ultrafast"
          
      //   ])
      // .output("./www/Video2_Streaming/output.m3u8")


        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
          resolve();
        })
        .on("error", function (err, stdout, stderr) {
          console.log("An error occurred: " + err.message, err, stderr);
          reject();
        })
        .on("progress", function (progress) {
         // console.log(progress);
          //   if (progress.percent > 1) {
          //     resolve();
          //   }
          //   def.resolve();
        })
        .on("end", function (err, stdout, stderr) {
          console.log("Finished processing!" /*, err, stdout, stderr*/);
          resolve();
        })
        .run();
    });
  },

   
  stream3: () => {
    return new Promise((resolve, reject) => {


      ffmpeg(videoPath3, { timeout: 432000 })
      .addOptions([
        "-hls_time 10", // 10 second segment duration
        "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments", // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-f hls", // HLS format
        "-max_muxing_queue_size 512"
      ])
      .output("./www/Video3_Streaming/output.m3u8")

      // ffmpeg(videoPath3, { timeout: 432000 })
      //   .addOptions([
      //     "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
      //     "-level 3.0",
      //     "-s 640x360", // 640px width, 360px height output video dimensions
      //     "-hls_list_size 3", // Maxmimum number of playlist entries (0 means all entries/infinite)
      //     "-hls_flags delete_segments",
      //     "-hls_time 10", // 10 second segment duration
      //     "-f hls", // HLS format
      
      //   ])
      // .output("./www/Video3_Streaming/output.m3u8")


        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
          resolve();
        })
        .on("error", function (err, stdout, stderr) {
          console.log("An error occurred: " + err.message, err, stderr);
          reject();
        })
        .on("progress", function (progress) {
          //console.log(progress);

          //   if (progress.percent > 1) {
          //     resolve();
          //   }
          //   def.resolve();
        })
        .on("end", function (err, stdout, stderr) {
          console.log("Finished processing!" /*, err, stdout, stderr*/);
          resolve();
        })
        .run();
    });
  },

  

  getImage: async(PathOne,slipNum,filePath) => {
    
    const timestamp = new Date().getTime(); // get current timestamp
    const filename = `${slipNum}_${timestamp}.png`; // create filename with timestamp
    let ffmpegRun = new Promise(function(resolve, reject){
    
      ffmpeg(PathOne) 
      .format("mjpeg")
      .frames(1)
      .size("640x360")
      .saveToFile(`${filePath}/${filename}`)
      .toFormat("image2")
      .on('end', function(stdout, stderr) {
        console.log("Picture Saved As"+filename);
        resolve(filename);
       });
    })
    let result = await ffmpegRun;
        return result;      
  },

  getBMRImage: async(PathOne,slipNum,filePath) => {
    const timestamp = new Date().getTime(); // get current timestamp
    const filename = `${slipNum}_${timestamp}.png`; // create filename with timestamp
    let ffmpegRun = new Promise(function(resolve, reject){
      ffmpeg(PathOne) 
      .format("mjpeg")
      .frames(1)
      .size("1280x720")
      .saveToFile(`${filePath}/${filename}`)
      .toFormat("image2")
      .on('end', function(stdout, stderr) {
       // console.log(stdout);
        //console.log(stderr);
        console.log("done");
        console.log(filename);
        resolve(filename);
     });
    })
    let result = await ffmpegRun;
        return result;      
  },
};

module.exports = { videoHelper };
