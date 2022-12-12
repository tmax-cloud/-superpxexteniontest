const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8001 });

const tempProjectReq = {        
    body: {
      path: "ListSrcService",
      statusCode: 200,
      message: "success",
      data: [
        {
          id: 1,
          path: "src/test",
          projectId: 1
        },
        {
            id: 2,
            path: "src/test2",
            projectId: 1
        },
        {
            id: 3,
            path: "src/temp/test3",
            projectId: 1
        }
      ]
    }
  };
  const tempFileReq = [
    {            
        body: {
          path: "DetailSrcService",
          statusCode: 200,
          message: "success",
          data: [
            {
              id: 1,
              number: 1,
              content: "hello",
              prevLineId: 0
            },
            {
              id: 2,
              number: 2,
              content: "world",
              prevLineId: 1
            }
          ]
        }
      },
      {            
        body: {
          path: "DetailSrcService",
          statusCode: 200,
          message: "success",
          data: [
            {
              id: 1,
              number: 1,
              content: "hello2",
              prevLineId: 0
            },
            {
              id: 2,
              number: 2,
              content: "world2",
              prevLineId: 1
            }
          ]
        }
      },
      {            
        body: {
          path: "DetailSrcService",
          statusCode: 200,
          message: "success",
          data: [
            {
              id: 1,
              number: 1,
              content: "hello3",
              prevLineId: 0
            },
            {
              id: 2,
              number: 2,
              content: "world3",
              prevLineId: 1
            }
          ]
        }
      }
      
];

// 웹소켓 서버 연결 이벤트 바인드
wss.on("connection", ws => {
    // 데이터 수신 이벤트 바인드
    ws.on("message", data => {
      console.log(`Received from user: ${data}`);
      if (data === 'Hello') {
        ws.send(`Received ${data}`); // 서버의 답장
      }
      const messageObject = JSON.parse(data);
      if (messageObject.header.targetServiceName === "com.tmax.service.sourceCode.ListSrcService") {
        ws.send(JSON.stringify(tempProjectReq.body.data));
      }
      if (messageObject.header.targetServiceName === "com.tmax.service.sourceCode.DetailSrcService") {
        ws.send(JSON.stringify(tempFileReq[messageObject.body.srcId-1]));
      }
    });
  });