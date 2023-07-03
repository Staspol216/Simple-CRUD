import request from "supertest";
import { server } from "../src";
import { v4 as uuidv4 } from "uuid";
import { ErrorMessages } from "../src/exceptions/types";

const API_BASE_URL = "/api/users";

const mockUser = {
    username: "Bob",
    age: 20,
    hobbies: ["swimming"],
};

describe("Getting data by endpoints", () => {
    it("Getting all users", async () => {
        const res = await request(server).get(API_BASE_URL);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    })

    it("Getting user by id", async () => {
        const res = await request(server)
            .post(API_BASE_URL).send(mockUser);

        const targetId = res.body.id;
        const responseWithTargetUser = await request(server)
            .get(`${API_BASE_URL}/${targetId}`);

        expect(responseWithTargetUser.status).toBe(200);
        expect(responseWithTargetUser.body).toEqual({
            id: targetId,
            ...mockUser,
        });
    })

    it("Creating new user", async () => {
        const response = await request(server)
            .post(API_BASE_URL).send(mockUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: response.body.id,
            ...mockUser,
        });
    })

    it("Updating new user", async () => {
        const res = await request(server)
            .post(API_BASE_URL).send(mockUser);

        const postedUser = res.body;
        const newUserData = {
            username: "Alex",
            age: 29,
            hobbies: ["running"]
        }

        const responseWithUpdatedUser = await request(server)
            .put(`${API_BASE_URL}/${postedUser.id}`)
            .send(newUserData)
      
        expect(responseWithUpdatedUser.status).toBe(200);
        expect(responseWithUpdatedUser.body).toEqual({
            id: postedUser.id,
            ...newUserData,
        });
    })

    it("Deleting an existing user", async () => {
        const res = await request(server)
            .post(API_BASE_URL).send(mockUser);

        const postedUserId = res.body.id;

        const responseByUserDeleting = await request(server)
            .delete(`${API_BASE_URL}/${postedUserId}`)
      
        expect(responseByUserDeleting.status).toBe(204);
    })
})

describe("Endpoints errror testing", () => {

    it("Invalid endpoint", async () => {
        await request(server).get("/api/foo").expect(404, { message: ErrorMessages.INVALID_ENDPOINT })
    })

    it("Unavailable method", async () => {
        await request(server).patch(API_BASE_URL).expect(400, { message: ErrorMessages.UNAVAILABLE_METHOD });
    });

    it("Updating a non-existent user", async () => {
        const id = uuidv4();
        await request(server)
            .put(`${API_BASE_URL}/${id}`)
            .send(mockUser)
            .expect(404, { message: ErrorMessages.USER_NOT_FOUND});
    });

    it("Deleting a non-existent id", async () => {
        const id = uuidv4();
        await request(server)
            .delete(`${API_BASE_URL}/${id}`)
            .expect(404, { message: ErrorMessages.USER_NOT_FOUND });
    });
})

describe("Gettings errors by invalid post data", () => {

    afterAll(() => {
        server.close()
    })

    it("Create user with invalid data", async () => {
        const invalidUserData = {
            age: 'too much',
            name: "Alex",
        }
        await request(server).post(API_BASE_URL)
            .send(invalidUserData).expect(400, { message: ErrorMessages.INVALID_USER_DATA })
    })

    it("Put user with invalid data", async () => {
        const { body: newUser } = await request(server).post(API_BASE_URL).send(mockUser);
        
        const id = newUser.id;

        const { body: user } = await request(server).get(`${API_BASE_URL}/${id}`);

        expect(user).toEqual(newUser)

        const invalidUserData = {
            age: 'too much',
            name: "Alex",
        };

        await request(server).put(`${API_BASE_URL}/${id}`)
            .send(invalidUserData).expect(400, { message: ErrorMessages.INVALID_USER_DATA })
    })
})