import { createServer } from "http";
import cluster from 'cluster';
import { availableParallelism } from 'os';
import { request } from "http";
import userModel from "../models/user/model";
import { router } from "../router/router";
import { pipeline } from "stream/promises";
import { ApiError } from "../exceptions/apiError";
import { HOST } from "./const";

const PORT = process.env.PORT || 4000;

export const startLoadBalancer = () => {

    if (cluster.isPrimary) {
        let workerIndex = 0;
        const clusterPorts: number[] = [];
        const numCPUs = availableParallelism();
        for (let i = 0; i < numCPUs; i++) {
            const workerPort = +PORT + i + 1;
            cluster.fork({ workerPort });
            clusterPorts.push(workerPort)
        }

        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster.fork({ workerPort: clusterPorts[clusterPorts.length - 1] + 1});
        });

        cluster.on('message', async (worker, message) => {
            try {
                const data = await userModel[message.action](...message.payload);
                worker.send({ data });
            } catch(error) {
                const { message, status } = error instanceof ApiError ? error : ApiError.internalServerError();
                worker.send({ status: status, message });
            }
        });

        const server = createServer((req, res) => {
            if (workerIndex === numCPUs) workerIndex = 0;
            const options = {
                host: HOST,
                port: clusterPorts[workerIndex],
                path: req.url,
                method: req.method,
                headers: req.headers,
            };
            const requestToWorker = request(options, (response) => {
                if (response.statusCode) {
                    res.writeHead(response.statusCode, response.statusMessage, response.headers);
                }
                pipeline(response, res);
            });
            pipeline(req, requestToWorker);
            workerIndex++;
        });
        
        server.listen(PORT, () => {
            console.log(`${cluster.isPrimary ? 'Primary' : 'Worker'} #${process.pid} is running on port ${PORT}`);
        });
    } else {
        const server = createServer(router);

        const PORT = process.env.workerPort;
        if (!PORT) throw ApiError.internalServerError();

        server.listen(+PORT, () => {
            console.log(`${cluster.isPrimary ? 'Primary' : 'Worker'} #${process.pid} is running on port ${PORT}`)
        })
    }
}