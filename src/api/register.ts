import { Router, Request, Response } from "express";
import express from "express";
import Joi, { Schema, ValidationResult } from "joi";
import { Collection, Db } from "mongodb";
import { getDatabase } from "../database.js";
import { Register, RegisterSchema } from "../contracts/register.js";
import { Collections } from "../contracts/collections.js";
import { nanoid } from "nanoid";
import nodemailer, { Transporter } from "nodemailer";

const courseTypes: { label: string; value: string }[] = [
  {
    label: "Štvornesačné kurzy - Basic",
    value: "4",
  },
  {
    label: "Dvojmesačné kurzy - Deluxe",
    value: "2",
  },
  {
    label: "Mesačné kurzy - Deluxe",
    value: "1",
  },
];

const courseCategory: { label: string; value: string }[] = [
  {
    label: "B, B1, AM",
    value: "B",
  },
  {
    label: "A, A2, A1, AM",
    value: "A",
  },
];

const registerSchema: Schema<RegisterSchema> = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  birthday: Joi.date().required(),
  courseType: Joi.string().required(),
  courseCategory: Joi.string().required(),
  courseStart: Joi.date().empty().allow(null),
  preferedTime: Joi.string().empty().allow(null),
  remarks: Joi.string().empty().allow(null),
  agreement: Joi.boolean().required(),
  tos: Joi.boolean().required(),
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
    subject: `Nová registrácia pre ${schemaResult.value.firstName} ${schemaResult.value.lastName}`,
    text: `Meno: ${schemaResult.value.firstName}, Priezvisko: ${schemaResult.value.lastName}, Email: ${schemaResult.value.email}, Telefón: ${schemaResult.value.phone}, Adresa: ${schemaResult.value.address}, Rok narodenia: ${schemaResult.value.birthday}, Typ kurzu: ${courseTypes.find((c) => c.value === schemaResult.value.courseType)?.label}, Kategória kurzu: ${courseCategory.find((c) => c.value === schemaResult.value.courseCategory)?.label}`,
    html: `Meno: ${schemaResult.value.firstName}<br />Priezvisko: ${schemaResult.value.lastName}, Email: ${schemaResult.value.email}<br />Telefón: ${schemaResult.value.phone}<br />Adresa: ${schemaResult.value.address}<br />Rok narodenia: ${schemaResult.value.birthday}<br />Typ kurzu: ${courseTypes.find((c) => c.value === schemaResult.value.courseType)?.label}<br />Kategória kurzu: ${courseCategory.find((c) => c.value === schemaResult.value.courseCategory)?.label}`,
  });

  await registerCollection.insertOne(registration);

  response.sendStatus(200);
});

export default router;
