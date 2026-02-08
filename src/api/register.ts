import { Router, Request, Response } from "express";
import express from "express";
import Joi, { Schema, ValidationResult } from "joi";
import { Collection, Db } from "mongodb";
import { getDatabase } from "../database.js";
import { Register, RegisterSchema } from "../contracts/register.js";
import { Collections } from "../contracts/collections.js";
import { nanoid } from "nanoid";
import nodemailer, { Transporter } from "nodemailer";

const registerSchema: Schema<RegisterSchema> = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  birthday: Joi.date().required(),
  courseType: Joi.string().required(),
  courseCategory: Joi.string().required(),
  courseStart: Joi.date(),
  preferedTime: Joi.string(),
  remarks: Joi.string(),
  agreement: Joi.boolean(),
  tos: Joi.boolean(),
});

const transporter: Transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 587,
  secure: false,
  auth: {
    user: "info@autoskolaimrich.sk",
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const router: Router = express.Router();

router.post("/", async (request: Request, response: Response) => {
  const database: Db = await getDatabase();
  const registerCollection: Collection<Register> = database.collection(
    Collections.Registers,
  );
  const body = request.body;
  const schemaResult: ValidationResult<RegisterSchema> =
    registerSchema.validate(body);

  if (schemaResult.error) {
    response.statusCode = 403;
    response.json(schemaResult.error);
    return;
  }

  const registration: Register = {
    id: nanoid(),
    ...schemaResult.value,
  };

  await transporter.sendMail({
    from: '"Autoškola Imrich" <info@autoskolaimrich.sk>',
    to: "info@autoskolaimrich.sk",
    subject: "Hello from Express",
    text: "This email was sent via Mailcow",
    html: "<b>This email was sent via Mailcow</b>",
  });

  await registerCollection.insertOne(registration);

  response.sendStatus(200);
});

export default router;
