"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importStar(require("../index"));
describe("Users API", () => {
    (0, supertest_1.default)(index_1.serverDB);
    const request = (0, supertest_1.default)(index_1.default);
    beforeEach(async () => {
        await request.patch("/api/users").send({ command: "Init DB" });
    });
    afterAll(() => {
        index_1.default.close();
        index_1.serverDB.close();
    });
    const newUser = {
        username: "First User",
        age: 19,
        hobbies: ["sit", "run"],
    };
    const updatedUser = {
        username: "Second User",
        age: 47,
        hobbies: ["sit"],
    };
    const fakeUser = {
        username: "",
        age: "19",
        hobbies: [1, 2],
    };
    const fakeID = "e653b49e-6de2-4551-bfc7-f88d1800b0bd";
    describe("Check endpoint path", () => {
        test("should return error on invalid endpoint", async () => {
            const response = await request.get("/api/user");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Endpoint not found");
        });
    });
    describe("Get all users", () => {
        test("should return empty users array", async () => {
            const response = await request.get("/api/users");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        test("should return array with First User", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const equal = { id, ...newUser };
            const responseGet = await request.get("/api/users");
            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toEqual([equal]);
        });
    });
    describe("Get user", () => {
        test("should return error NoId", async () => {
            const response = await request.get(`/api/users/noID`);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("UserId is invalid (not uuid)");
        });
        test("should return error UserIdNotFound", async () => {
            const response = await request.get(`/api/users/${fakeID}`);
            expect(response.status).toBe(404);
            expect(response.body.error).toEqual("The record with the requested ID does not exist");
        });
        test("should return First User", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const equal = { id, ...newUser };
            const responseGet = await request.get(`/api/users/${id}`);
            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toEqual(equal);
        });
    });
    describe("Create user", () => {
        test("should create new user", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const equal = { id, ...newUser };
            expect(response.body).toStrictEqual(equal);
        });
        test("should return error Invalid Data", async () => {
            const response = await request.post("/api/users").send(fakeUser);
            const equal = [
                "Username required",
                "Age must be a number",
                "Hobbies must be an array of strings",
            ];
            expect(response.status).toBe(400);
            expect(response.body.error).toStrictEqual(equal);
        });
    });
    describe("Update user", () => {
        test("should update user", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const responseUpdatedUser = await request
                .put(`/api/users/${id}`)
                .send(updatedUser);
            expect(responseUpdatedUser.status).toBe(200);
            expect(responseUpdatedUser.body).toStrictEqual({
                id,
                ...updatedUser,
            });
        });
        test("should not update user because invalid request body", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const responseUpdatedUser = await request
                .put(`/api/users/${id}`)
                .send({ age: "27" });
            expect(responseUpdatedUser.status).toBe(400);
            expect(responseUpdatedUser.body.error).toStrictEqual([
                "Age must be a number",
            ]);
        });
    });
    describe("delete user", () => {
        test("should delete user", async () => {
            const response = await request.post("/api/users").send(newUser);
            const { id } = response.body;
            const responseDeleteUser = await request.delete(`/api/users/${id}`);
            expect(responseDeleteUser.status).toBe(204);
            expect(responseDeleteUser.body).toStrictEqual({});
            const responseDeletedUser = await request.get(`/api/users/${id}`);
            expect(responseDeletedUser.status).toBe(404);
            expect(responseDeletedUser.body.error).toStrictEqual("The record with the requested ID does not exist");
        });
    });
});
//# sourceMappingURL=users.test.js.map