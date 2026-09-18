import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
    const passwordHash = await bcrypt.hash("dev123456", 12);

    const user = await prisma.user.upsert({
        where: {
            email: "dev@mywishes.local",
        },
        update: {
            passwordHash,
        },
        create: {
            email: "dev@mywishes.local",
            name: "Dev User",
            passwordHash,
        },
    });

    const birthday = await prisma.event.upsert({
        where: {
            slug: "birthday-test-local",
        },
        update: {},
        create: {
            type: "BIRTHDAY",
            name: "Cumpleaños Test",
            honoreeName: "Alex",
            gender: "MALE",
            birthdayAge: 25,
            dressCode: "Casual",
            date: new Date("2026-09-15T23:00:00.000Z"),
            endDate: new Date("2026-09-16T02:00:00.000Z"),
            timezone: "America/Lima",
            location: "Casa Test",
            locationURL: "https://maps.google.com",
            description: "Evento de prueba para desarrollo local.",
            slug: "birthday-test-local",
            creatorId: user.id,
        },
    });

    const babyShower = await prisma.event.upsert({
        where: {
            slug: "baby-shower-test-local",
        },
        update: {},
        create: {
            type: "BABY_SHOWER",
            name: "Baby Shower Test",
            honoreeName: "Mateo",
            gender: "MALE",
            dressCode: "Pastel",
            date: new Date("2026-10-10T20:00:00.000Z"),
            timezone: "America/Lima",
            location: "Salón Test",
            locationURL: "https://maps.google.com",
            description: "Baby shower de prueba.",
            slug: "baby-shower-test-local",
            creatorId: user.id,
        },
    });

    const genderReveal = await prisma.event.upsert({
        where: {
            slug: "gender-reveal-test-local",
        },
        update: {},
        create: {
            type: "GENDER_REVEAL",
            name: "Gender Reveal Test",
            honoreeName: null,
            gender: null,
            birthdayAge: null,
            dressCode: "Blanco",
            date: new Date("2026-11-05T22:00:00.000Z"),
            timezone: "America/Lima",
            location: "Jardín Test",
            locationURL: "https://maps.google.com",
            description: "Evento de prueba para Gender Reveal.",
            slug: "gender-reveal-test-local",
            creatorId: user.id,
        },
    });

    const christmas = await prisma.event.upsert({
        where: {
            slug: "christmas-test-local",
        },
        update: {},
        create: {
            type: "CHRISTMAS",
            name: "Navidad Test",
            honoreeName: "Familia Test",
            gender: "FEMALE",
            dressCode: "Rojo y verde",
            date: new Date("2026-12-24T23:00:00.000Z"),
            timezone: "America/Lima",
            location: "Casa Familiar",
            locationURL: "https://maps.google.com",
            description: "Evento navideño de prueba.",
            slug: "christmas-test-local",
            creatorId: user.id,
        },
    });

    await prisma.gift.createMany({
        data: [
            {
                eventId: birthday.id,
                name: "Audífonos",
                currency: "PEN",
                quantity: 1,
                purchasedQuantity: 0,
                status: "AVAILABLE",
            },
            {
                eventId: birthday.id,
                name: "Zapatillas",
                currency: "PEN",
                quantity: 1,
                purchasedQuantity: 0,
                status: "AVAILABLE",
            },
            {
                eventId: babyShower.id,
                name: "Biberones",
                currency: "PEN",
                quantity: 2,
                purchasedQuantity: 0,
                status: "AVAILABLE",
            },
        ],
        skipDuplicates: true,
    });

    console.log("Seed listo.");
    console.log("Login local:");
    console.log("dev@mywishes.local");
    console.log("dev123456");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });