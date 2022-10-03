require("dotenv").config();
const { GreetingUtil } = require("./src/utils/greeting");
// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const PROTO_PATH = "../proto/greeting.proto";
// const greetingProtoDef = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// const Greeter =
//   grpc.loadPackageDefinition(greetingProtoDef).ms.nextjs_grpc.Greeter;

// const MS = `${process.env.MS_HOST}:${process.env.MS_PORT}`;
// const greetingService = new Greeter(
//   MS,
//   grpc.credentials.createInsecure()
// );

// async function sendGreeting(greeting) {
//   console.log("uri: ", MS)
//   return new Promise((resolve, reject) => {
//     greetingService.sendGreeting(greeting, (error, response) => {
//       if (error) {
//         console.log(error);
//         reject(error);
//         return;
//       }
//       console.log("response sent:", response);
//       resolve(response);
//     });
//   });
// }

const greeting = new GreetingUtil();

greeting
  .sendGreeting({
    name: "utku",
    age: 3,
    job: 0,
    fav_movies: ["hda", "dfd", "als"],
  })
  .then((greeting) => {
    console.log("greeting response", greeting);
  });
