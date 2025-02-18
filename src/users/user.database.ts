import { User, UnitUser, Users } from "./user.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";

let users: Users = loadUsers();

function loadUsers(): Users {
    try {
        const data = fs.readFileSync("./users.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error: ${error}`);
        return {};
    }
}

function saveUsers() {
    try {
        fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
        console.log(`Users saved successfully!`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}


export const findAll = async (): Promise<UnitUser[]> => Object.values(users);

export const findOne = async (id: string): Promise<UnitUser | null> => users[id] || null;

export const create = async (userData: UnitUser): Promise<UnitUser> => {
    
    const id = random();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user: UnitUser = {
        id: id,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
    };

    users[id] = user;
    saveUsers();
    return user;
};

