import { createServer } from "http";
import { router } from "./router/router";

const PORT = 4000;

const server = createServer(router);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})