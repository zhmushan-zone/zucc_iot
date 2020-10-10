import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  Application,
  InternalServerErrorException,
} from "https://deno.land/x/abc@v1.1.0/mod.ts";

const { env } = Deno;

interface UserSchema {
  _id: { $oid: string };
  设备ID: string;
  姓名: string;
  学号: string;
}

const MongoUri = env.get("MongoUri")!;
const DatabaseName = env.get("DatabaseName")!;

type User = Omit<UserSchema, "_id">;

const client = new MongoClient();
client.connectWithUri(MongoUri);

const db = client.database(DatabaseName);
const users = db.collection<UserSchema>("users");

const app = new Application();

app.post("/users", async (c) => {
  const userData = await c.body as User;
  const user = ensureUserValid(userData);
  await users.updateOne(
    { 设备ID: userData.设备ID },
    { $set: user },
    { upsert: true },
  );

  return {
    msg: "成功",
  };
});

app.get("/users", (_) => {
  return users.find();
});

app.start({ port: 8083 });

function ensureUserValid(user: User): User {
  const keys = ["姓名", "学号", "设备ID"] as const;
  const { 姓名, 学号, 设备ID } = user;
  user = { 姓名, 学号, 设备ID };
  for (const i of keys) {
    if (!user[i]) {
      throw new InternalServerErrorException(`${i}❌`);
    }
  }

  return user;
}
