import { createServer } from "http";
import { router } from "./router/router";
import { startLoadBalancer } from "./app/loadBalancer";
import "dotenv/config";

const CLUSTERS_MODE = process.env.API_MODE === "cluster";

if (CLUSTERS_MODE) {
    startLoadBalancer();
} else {
    const PORT = process.env.PORT || 4000;
    createServer(router).listen(PORT, () => {
        console.log(`App is running on port ${PORT} with ${process.pid} process id`)
    })
}