// import * as path from 'path';
import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';
import * as WebSocket from 'ws';

const setRequest = (targetServiceName: string, body: object) => {
    return {
      header: {
        targetServiceName,
        messageType: "REQUEST",
        contentType: "TEXT",
      },
      body: body,
    };
  };

export const getFilesFromDB = (memFs: MemFS, serverUrl: string, projectId: number) => {
    //get files form server
    //...
    const projectSocket = new WebSocket(serverUrl);
    projectSocket.onopen = (event: any) => {
        projectSocket.send(JSON.stringify(setRequest("com.tmax.service.sourceCode.ListSrcService", {projectId: projectId})));
    };

    projectSocket.onmessage = (event: any) => {                
        const projectWSdata = JSON.parse(event.data);

        projectWSdata.forEach((d: any)=>{
            const lineData: string [] = [];
            const fileSocket = new WebSocket(serverUrl);
            fileSocket.onopen = (event: any) => {
                fileSocket.send(JSON.stringify(setRequest("com.tmax.service.sourceCode.DetailSrcService", {srcId: d.id})));
            };
          
            fileSocket.onmessage = (event: any) => {                
                const fileWsdata = JSON.parse(event.data);                
                const lineData: string [] = [];
                fileWsdata.body.data.forEach((d: any) => {
                  lineData.push(d.content);
                });
                const directory = d.path.split('/');

                directory.pop();            
            
                let temp = '/';        
                directory.forEach((path: any)=>{
                    temp = temp + path + '/';
                    let existDirectory = false;
                    try {
                        memFs.readDirectory(vscode.Uri.parse(`dsfs:${temp}`));
                        existDirectory = true;
                    } catch {
                        existDirectory = false;
                    }            
                    !existDirectory && memFs.createDirectory(vscode.Uri.parse(`dsfs:${temp}`));
                });
            
                memFs.writeFile(vscode.Uri.parse(`dbfs:/${d.path}`), Buffer.from(lineData.join("")), { create: true, overwrite: true });
            };
        });
    };

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
      
    tempProjectReq.body.data.forEach(d=>{
        const lineData: string [] = [];
        tempFileReq[d.id-1].body.data.forEach((d: any) => {
            lineData.push(d.content);
          });
        const directory = d.path.split('/');
        directory.pop();
        
        
        let temp = '/';        
        directory.forEach((path)=>{
            temp = temp + path + '/';
            let existDirectory = false;
            try {
                memFs.readDirectory(vscode.Uri.parse(`dsfs:${temp}`));
                existDirectory = true;
            } catch {
                existDirectory = false;
            }            
            !existDirectory && memFs.createDirectory(vscode.Uri.parse(`dsfs:${temp}`));
        });
        
        memFs.writeFile(vscode.Uri.parse(`dbfs:/${d.path}`), Buffer.from(lineData.join("")), { create: true, overwrite: true });
    });
      
    
};